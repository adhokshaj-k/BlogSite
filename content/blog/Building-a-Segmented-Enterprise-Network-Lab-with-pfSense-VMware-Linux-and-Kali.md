---
title: "Building a Segmented Enterprise Network Lab with pfSense, VMware, Linux and Kali"
description: "Build a cybersecurity lab that went beyond individual tools and demonstrated how network architecture, firewall policies, Linux systems, and security testing work together."
date: "2026-08-08"
tags:
  - Cybersecurity
  - Networking
  - Linux
  - Project
published: true
---
## Introduction

I wanted to build a cybersecurity lab that went beyond individual tools and demonstrated how network architecture, firewall policies, Linux systems, and security testing work together.

For this project, I designed and deployed a small enterprise-style network using VMware, pfSense, Ubuntu, MySQL, Nginx, and Kali Linux.

The environment was divided into three security zones:

- **WAN** – external/untrusted network
    
- **LAN** – internal network
    
- **DMZ** – isolated network for externally accessible services
    

The main objective was to implement controlled communication between these zones using pfSense and verify that the firewall behaved as intended.

> 📸 **[SCREENSHOT 1 — INSERT FINAL LAB TOPOLOGY HERE]**
> 
> Show the complete VMware lab with the five VMs and the WAN/LAN/DMZ connections.

---

## 1. Lab Architecture

The lab was designed around **pfSense as the central firewall and router**.

The architecture consisted of:

```text
                         INTERNET
                            |
                         WAN
                            |
                         pfSense
                       /         \
                     LAN         DMZ
                     |             |
              +------+-----+       |
              |            |       |
           Ubuntu         Kali   Ubuntu
           Client        Admin    Web Server
              |                    |
           MySQL DB              Nginx
```

The network was divided into separate subnets:

```text
LAN : 10.10.10.0/24
DMZ : 10.20.20.0/24
```

The pfSense interfaces were configured as:

```text
LAN : 10.10.10.1
DMZ : 10.20.20.1
```

The Ubuntu web server was placed in the DMZ:

```text
Web Server : 10.20.20.10
```

The database was kept inside the LAN rather than the DMZ because it represents an internal resource that should not be directly exposed to external-facing systems.

> 📸 **[SCREENSHOT 2 — INSERT NETWORK/IP CONFIGURATION HERE]**
> 
> Show the relevant VMware network adapters and/or pfSense interface configuration demonstrating WAN, LAN and DMZ.

---

## 2. Why WAN, LAN and DMZ?

The main reason for using three zones was **network isolation**.

A public-facing web server is more exposed than an internal database. If the web server is compromised, an attacker should not automatically receive unrestricted access to internal resources.

The design therefore follows a simple principle:

```text
External Network
       |
       v
     WAN
       |
    pfSense
       |
   +---+---+
   |       |
  DMZ     LAN
   |       |
 Web      Database
Server
```

The **DMZ** contains services that need controlled access, while the **LAN** contains internal resources.

This creates a security boundary that can restrict lateral movement.

---

## 3. Deploying the DMZ Web Server

The web server was deployed using Ubuntu Server and connected to the VMware DMZ network.

Its network configuration was:

```text
IP Address : 10.20.20.10
Subnet     : 10.20.20.0/24
Gateway    : 10.20.20.1
```

Nginx was installed as the web server.

The objective was not simply to make a web page accessible. The important part was ensuring that access to the web server was controlled through the firewall.

The intended path was:

```text
LAN Client
     |
     v
pfSense
     |
     v
DMZ
     |
     v
10.20.20.10
Nginx
```

> 📸 **[SCREENSHOT 3 — INSERT WEB SERVER CONFIGURATION HERE]**
> 
> Show the Ubuntu Web Server IP configuration and its connection to the DMZ.

> 📸 **[SCREENSHOT 4 — INSERT NGINX RUNNING HERE]**
> 
> Show `systemctl status nginx` and/or `curl http://10.20.20.10` demonstrating that Nginx is running.

---

## 4. Deploying the Internal Database

To make the environment closer to a real enterprise network, a MySQL database server was placed inside the LAN.

The design intentionally kept the database away from the DMZ:

```text
DMZ
 |
 | Web traffic
 v
Web Server
 |
 X
 |
LAN
 |
Database
```

The database represents an internal application resource that should only be reachable through explicitly permitted communication paths.

This provides a useful scenario for testing whether a compromised DMZ system could move toward an internal database.

> 📸 **[SCREENSHOT 5 — INSERT DATABASE SERVER HERE]**
> 
> Show the Ubuntu database server, its LAN IP address, and MySQL service running.

---

## 5. Configuring pfSense Firewall Policies

pfSense was used as the central security appliance.

Instead of allowing unrestricted traffic between networks, I configured policies based on **least privilege**.

For example, the LAN was permitted to access the web server over HTTP:

```text
Source       : LAN subnet
Destination  : 10.20.20.10
Protocol     : TCP
Port         : 80
Action       : ALLOW
```

The idea was to permit the required service without automatically exposing every service running on the server.

Other policies were used to restrict unnecessary or dangerous communication, including SSH access and traffic originating from the DMZ toward internal resources.

> 📸 **[SCREENSHOT 6 — INSERT PFSENSE FIREWALL RULES HERE]**
> 
> Show the LAN and DMZ/OPT1 firewall rules. Make sure the rule descriptions, source, destination and ports are visible.

---

## 6. Testing Allowed Traffic

After configuring the firewall, I tested the rules from the client side.

For HTTP connectivity, I used Netcat:

```bash
nc -zv 10.20.20.10 80
```

A successful connection demonstrates that the LAN client can reach the DMZ web server on the required HTTP service.

I also verified the web application directly:

```bash
curl http://10.20.20.10
```

The purpose of these tests was to verify actual network behavior rather than relying only on the firewall configuration displayed in the GUI.

> 📸 **[SCREENSHOT 7 — INSERT LAN → DMZ HTTP SUCCESS HERE]**
> 
> Show the successful `nc` test for TCP port 80 and/or the `curl` response.

---

## 7. Testing Blocked Traffic

A major part of the project was testing traffic that should **not** be permitted.

For example:

```bash
nc -zv 10.20.20.10 22
```

This was used to determine whether SSH access to the DMZ web server was available from the LAN.

The result helped identify whether an existing broad firewall policy was allowing traffic beyond the intended HTTP service.

This reinforced an important security lesson:

> A rule being configured does not automatically prove that the overall firewall policy behaves as expected.

Firewall rules need to be tested against the actual traffic path.

> 📸 **[SCREENSHOT 8 — INSERT BLOCKED SSH TEST HERE]**
> 
> Show the final failed/blocked TCP/22 test after the restrictive rule is correctly positioned above any broader allow rule.

---

## 8. DMZ-to-LAN Isolation

The reverse direction is equally important.

The DMZ should not have unrestricted access to the internal LAN.

The intended policy was:

```text
DMZ → LAN
       |
       v
     BLOCK
```

This reduces the risk of lateral movement if the web server is compromised.

For example, the DMZ web server should not be able to directly initiate unauthorized connections toward internal systems such as the database.

> 📸 **[SCREENSHOT 9 — INSERT DMZ → LAN BLOCK TEST HERE]**
> 
> Show a test from the Web Server attempting to reach the LAN client/database and the resulting blocked connection.

---

## 9. Kali Security Validation

Kali Linux was used as a dedicated security and administration host.

Nmap was used to inspect the services exposed by the DMZ web server.

For example:

```bash
nmap -p 22,80,443 10.20.20.10
```

This provided another method of validating the firewall configuration.

The expected security model was that only deliberately exposed services should be reachable.

The workflow was:

```text
Configure firewall
       |
       v
Test connectivity
       |
       v
Run Nmap
       |
       v
Review firewall logs
       |
       v
Compare expected vs actual behavior
```

> 📸 **[SCREENSHOT 10 — INSERT NMAP RESULTS HERE]**
> 
> Show the Nmap output against `10.20.20.10`, including the tested ports and their states.

---

## 10. Firewall Log Validation

Connectivity tests tell us whether traffic succeeded or failed, but firewall logs provide additional evidence about how pfSense handled the traffic.

I used the pfSense firewall logs to review blocked connections and verify that traffic matched the intended security policies.

This is important because a security control should be **observable and verifiable**, not simply configured and assumed to work.

> 📸 **[SCREENSHOT 11 — INSERT PFSENSE FIREWALL LOG HERE]**
> 
> Show a blocked connection in:
> 
> `Status → System Logs → Firewall`
> 
> Ideally, show the source IP, destination IP, protocol and blocked action.

---

## 11. Security Principles Demonstrated

This project allowed me to apply several practical security principles.

### Least Privilege

Only required communication should be permitted.

```text
LAN → DMZ Web :80
        |
      ALLOW
```

Unnecessary services such as unauthorized SSH access should be restricted.

### Network Segmentation

Different classes of systems were separated into different network zones.

```text
WAN
 |
pfSense
 |
+--------+
|        |
LAN     DMZ
```

### Defense in Depth

Security was not dependent on a single control.

The lab combined:

- Network segmentation
    
- Firewall rules
    
- Service restrictions
    
- Nmap validation
    
- Connectivity testing
    
- Firewall log analysis
    

### Limiting Lateral Movement

The DMZ was prevented from having unrestricted access to the internal LAN.

If the web server were compromised, segmentation would make movement toward internal resources more difficult.

---

## 12. Troubleshooting Lessons

One of the most useful parts of the project was troubleshooting the network itself.

When the DMZ web server initially experienced connectivity problems, I had to distinguish between different possible causes:

```text
VMware network
      ↓
Virtual interface
      ↓
IP configuration
      ↓
Routing
      ↓
pfSense interface
      ↓
Firewall policy
      ↓
Application
```

Instead of assuming that the application was broken, I tested each layer independently.

For example, verifying that pfSense could reach the web server helped establish that the underlying VMware and DMZ connectivity was working before moving on to firewall policy testing.

This approach reinforced an important system administration lesson:

> Troubleshooting should be performed layer by layer rather than changing multiple components at once.

---

## 13. Final Architecture

The final environment consisted of five virtual machines organized into three security zones.

```text
                         INTERNET
                            |
                           WAN
                            |
                         pfSense
                       /         \
                     LAN         DMZ
                     |             |
             +-------+------+      |
             |       |      |      |
          Ubuntu   Kali   MySQL  Ubuntu
          Client   Admin  Server Web Server
                               |
                              Nginx
```

The architecture provided a practical environment for studying:

```text
Network Segmentation
Firewall Configuration
Linux Administration
Web Server Security
Database Isolation
Security Testing
Network Troubleshooting
```

> 📸 **[SCREENSHOT 12 — INSERT FINAL LAB OVERVIEW HERE]**
> 
> Your strongest final screenshot. Show the complete five-VM environment or topology and make this the main visual of the blog.

---

## Conclusion

This project helped me understand that network security is not simply about installing a firewall.

The more important question is:

**Who should be allowed to communicate with whom, over which service, and why?**

By separating the environment into WAN, LAN and DMZ zones, placing the web server in the DMZ, keeping the database inside the LAN, and controlling traffic through pfSense, I was able to create a small enterprise-style security environment.

The project also demonstrated the importance of validating security controls. Firewall rules were tested using connectivity tools, Nmap was used to inspect exposed services, and pfSense logs provided evidence of blocked traffic.

The biggest takeaway was the importance of **least privilege and limiting lateral movement**. A secure network should not assume that every internal system needs access to every other system. Instead, access should be deliberately designed, restricted, and continuously validated.