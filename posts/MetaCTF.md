# MetaCTF Challenge Writeup

## Overview

I recently participated in a cybersecurity **Capture The Flag (CTF)** event hosted by **MetaCTF**, focused on practical, hands-on problem solving.  
This was a **Flash CTF**, designed to test quick analysis and fundamental security concepts.

CTF Link:
https://compete.metactf.com/561/problems

---

## Challenge 1: Snowfall Wishes

**Category:** Web Exploitation  
**Objective:** Bypass the VIP check to obtain the flag.

---

## Vulnerability Analysis

The VIP access verification was implemented **entirely on the client side using JavaScript**, which is a critical security flaw.

Key issues:
- No server-side validation
- Sensitive logic exposed in client-side code
- Flag stored in an encoded but reversible format

This made the challenge solvable by simply inspecting the JavaScript source code.

---

## Solution

### Step 1: Analyzing the Source Code

By using **View Page Source** or browser developer tools, I inspected the JavaScript file responsible for the VIP check.

The following snippet was found in the source code:

```js
// ============================================
// VIP Access System
// TODO: Move this check to the backend before launch!
// For now the code is: frosty_flakes_2024
// ============================================

const _0xg1ft = "TWV0YUNURntjMGxkX2g0bmRzX3c0cm1faDM0cnRzX3N0MHBfcHU3NzFuZ19zM25zaTdpdmVfMW5mMF8xbl83aDNfY2xpM250X2gzNHJ0aH0=";

function checkVIPAccess() {
    const codeInput = document.getElementById('vipCode');
    const messageDiv = document.getElementById('vipMessage');
    const enteredCode = codeInput.value;

    // Super secret VIP passphrase
    const secretCode = "frosty_flakes_2024";
}
```

Two important observations:

- The VIP passphrase was hardcoded in the client-side JavaScript.
- The variable _0xg1ft contained a Base64-encoded string.

### Step 2: Identifying the Encoding

The encoded string:
```js
TWV0YUNURntjMGxkX2g0bmRzX3c0cm1faDM0cnRzX3N0MHBfcHU3NzFuZ19zM25zaTdpdmVfMW5mMF8xbl83aDNfY2xpM250X2gzNHJ0aH0=
```
The trailing = character strongly suggests Base64 encoding.

### Step 3: Decoding the Flag

I decoded the string using the hURL tool:
```bash
hURL -b "TWV0YUNURntjMGxkX2g0bmRzX3c0cm1faDM0cnRzX3N0MHBfcHU3NzFuZ19zM25zaTdpdmVfMW5mMF8xbl83aDNfY2xpM250X2gzNHJ0aH0="
```
✅ Decoded Output
```txt
Original string       :: TWV0YUNURntjMGxkX2g0bmRzX3c0cm1faDM0cnRzX3N0MHBfcHU3NzFuZ19zM25zaTdpdmVfMW5mMF8xbl83aDNfY2xpM250X2gzNHJ0aH0=
Base64 decoded string :: MetaCTF{c0ld_h4nds_w4rm_h34rts_st0p_pu771ng_s3nsi7ive_1nf0_1n_7h3_cli3nt_h34rth}
```
 ###  Flag successfully recovered.

## Challenge 2: Gift hunt

**Category:** OSINT 
**Objective:** Find the place where the picture was taken

### Image
<img src="images/GiftHunt.jpg" width="500" height="300">

### Image Analysis

I used **Google Lens** to perform a reverse image search on the photograph. The combination of:
- The distinctive spider sculpture
- AGIO restaurant signage
- Japanese retail brands
- Holiday decorations

Led to multiple matches of similar locations in Japan.

### Location Verification with Google Maps

I searched for "AGIO restaurant Japan" and began examining each location on Google Maps. I specifically looked for:
- Shopping plazas or malls
- Locations with outdoor areas
- Places matching the architectural style
- Presence of the spider sculpture

After checking several AGIO locations, I found a **perfect match** at the **Market Restaurant AGIO Ichikawa shop** located in the **Nikke Colton Plaza** shopping complex.

**Location:** Nikke Colton Plaza, Ichikawa, Japan

### Flag

```
MetaCTF{nikke_colton_plaza}
```

