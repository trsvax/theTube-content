---
title: The Share System
date: 2026-05-23
tags: [tech]
type: journal
audience: user
status: journaling
coffee: 2
summary: How theTube works — /tube is input, /fs is output, auth gates the output end. Share is the first example.
workflow: draft
---

In [Travel Capture](./travel-capture.md) I described the problem: take a photo while traveling, forget why it mattered by the time I'm back at the machine. The prototype was a URL and a log entry — share the intent, grep the logs later.

That proved the concept. Now here's how the platform works.

## The tube

`/tube` — input. Data goes in. Anyone can write. Can't stop them.

`/fs` — the filesystem. Everything lives here. Posts, content, requests, results. The tube writes into it. Git writes into it. WebDAV writes into it. `/fs` doesn't care how the files got there.

How much of `/fs` you can see depends on how much I trust you.

POST to `/tube` is always dumb. It stores what you sent — request metadata to `/fs`, body to `/fs` if there is one. Returns 202 Noted and a receipt. No promises other than I got it. Just a pipe into the filesystem — which might be `/dev/null`.

The compute happens on the read. GET the receipt location with strong auth triggers processing — and only when someone asks for the result. If nobody checks the receipt, no compute happens. You only pay for processing when it matters.

The name was always the architecture.

## The `[share]:` block

Share is the first thing through the tube. The block is the glue between the input and the post:

```markdown
[share]:
type: image
file: IMG_4521.HEIC
captured: 2026-05-23T12:15:00
caption: creek trail
src:
```

Placeholder until published. The AI generates these from the capture logs — "here are your three captures from today, I've drafted the blocks, which ones go in this post?"

## Closing the loop

AI is the loop.

## The example: field capture

Out in the world, hit share, tap "Send Tube." The Shortcut sends:

```
POST /tube/share/add?type=image&file=IMG_1234.HEIC&date=2026-05-23&caption=temple+gate
```

Data is in the URL. CloudFront logs it. Lambda writes the request to S3. 202 Noted. No body, no upload. The photo stays in iCloud. The log is the breadcrumb: "this one mattered, at this time." Result is in `/fs`.

## The example: publish

Back at the machine. Edit the photo. Share the finished version — this time with a body. Lambda writes request + body to S3. The body landing triggers the next Lambda, which stores the image at its final URL. The `[share]:` block gets a `src:`.

```markdown
[share]:
type: image
file: IMG_1234.HEIC
captured: 2026-05-23
caption: temple gate at sunset
src: /shares/K1jaBcDeFgH.jpg
```

Same tube. Same contract. The body is the only difference.

## The contract

```
/tube/share/add?...     → capture intent
/tube/comments/add?...  → add a comment
/tube/react/add?...     → like/bookmark
```

One tube. The path after `/tube/` is a tag, not a route. Same contract for everything:

- POST data in → 202 Noted, receipt
- 503 + receipt → "not sure what happened, but here's your receipt — check it"
- 503, no receipt → retry
- No body + 503 → don't care, data is in the URL, it's logged
- Body + 503 → check the receipt location to know for sure, retry if it's not there

The 202 Noted includes `Location: /fs/{path}/{requestId}` — where to find the result when it's ready.

Don't like this contract? Use `/fs` directly. Full WebDAV. Read, write, list. You know where things are, you control the structure. The tube is just one way data gets into the filesystem.

## App isolation

The path is the namespace. `/tube/share/add` writes to `share/add/{requestId}` in S3. `/tube/comments/add` writes to `comments/add/{requestId}`. Each prefix has its own S3 event notification, its own processor Lambda.

The pipe Lambda is shared — dumb as `cat`. It just writes `{path}/{requestId}` and walks away.

Each processor Lambda is scoped to its own prefix. The share processor can't touch comments data. The comments processor can't touch share data. They don't know each other exists. If one crashes, the others keep working.

And each processor can do whatever it needs. The share processor just writes `{requestId}.result` — a file. The comments processor could talk to a database if you wanted real-time. The reactions processor could be a single counter increment. The platform doesn't have opinions about what processors do. It just delivers the request and lets each app handle it however it wants.

The tube is the contract. What happens at the end of the tube is up to you.

CloudFront logs give you timestamp, IP, user-agent, and edge location on every request for free. I didn't design any of that. It's just there.

## The MVP

The whole system is four pieces:

1. CF function at `/tube/*` — checks JWT, routes to Lambda or returns 404
2. Lambda (the tube) — writes request + body to S3, returns 202 Noted
3. iOS Shortcut with JWT — "Send Tube"
4. MCP server reads `/fs` — "what did I capture?"

Everything else — real-time comments, passkeys, multi-user, browser uploads — is enhancement. The core loop works with just these four.

## Identity and escalation

The first fork: has JWT? No → 404, but CloudFront still logged the URL. Yes → more roads open.

Public content is the t-shirt — I'm on the street, anyone can read it. Don't know me? It's ok to introduce yourself. If I know you, I'd say hi and maybe chat. Want to come into my house? Now I need to know it's really you. Want to rearrange the furniture? That's my job.

Escalation isn't about reads vs writes — it's about consequence. Most reads are anonymous. Some reads need identity (protected content, private photos, kid stuff). Some writes are anonymous too (contact form — just another log entry). The fork decides based on what's at stake, not what HTTP method you used.

Give a man a JWT and I'll call Lambda. The JWT gates compute. The time-hash gates the output end — proves physical presence, proves you're here right now. On the Mac that means Touch ID. On the phone it means the phone is unlocked and the Shortcut is running.

## The auth model

Assume every layer is broken. I wrote the code — it will break. If your goal is to keep them out, you will fail. The goal is to make it matter less when it breaks. I can't trust any crypto layer — I wrote that too. The auth classifies the request. The forks beyond it decide what that classification can do.

This is a personal site. We just need pretty good auth, not perfect auth. No token server, no refresh flow, no session database.

**Minted JWTs with embedded secrets and time-based hashes.** One verification path, no infrastructure, secure enough for what this is.

The design exists because of the phone. iOS Shortcuts can hash a string but can't do Cognito without a native app. I didn't want to build two auth paths right now, so the Mac gets the same model — not because Cognito wouldn't work there, but because one path is simpler than two.

### How it works

On my Mac I mint a token. The token is a JWT with a random secret baked into the claims. The secret also goes in Keychain. At request time, the device computes `SHA256(secret + unix_timestamp)` and sends it as a header. Lambda decodes the JWT, extracts the secret, computes the same hash, compares.

```
Device:  SHA256(secret + timestamp) → X-Pass header
Lambda:  decode JWT → get secret → SHA256(secret + timestamp) → compare
```

The time-hash proves the device has the secret _right now_. Can't replay an old request — the timestamp drifts out of the ±30 second window. The JWT itself is encrypted (JWE) — can't read the claims without the decryption key, so the secret stays hidden even if the token leaks.

### What anyone needs

The more you have, the more I trust you:

- No JWT → 404, logged only
- Valid JWT (plain) → request to S3, no body, 202 Noted
- Encrypted JWT (mine) → request + body to S3, 202 Noted
- Encrypted JWT + time-hash → triggers processing, output end opens

For example: `POST /tube/contact` with a plain JWT and a body introducing yourself. Lambda sees a valid but unencrypted token — low trust, no time-hash — stores the body and moves on. No special registration, no form, no contact page. You just need to know the protocol.

### Forks in the road

And even if auth fails completely — the result is the same: a line in a log file, and there are plenty of those. I'd need AI to even find it. Anyone can write to CloudFront logs — that's true for any site that logs. Every HTTP request is a log entry. The difference is I'm actually reading mine — the AI reads the logs, that's the UI — which means I'd notice the noise. The auth on the input end isn't a security boundary — it's a signal-to-noise optimization.

Lambda runs, but it's isolated — it verifies the JWT and writes to S3. That's all it does. No injection, no escalation, no stored XSS. The data doesn't touch a database, doesn't render anywhere automatically. The blast radius of the input end is: a line in S3. That's the real security of the capture path — it's a journey with obstacles.

And if they reach the compute layer — Lambda is isolated. It writes the body to S3 as `{requestId}`. That's all it does. If you can exploit that, everyone has a problem. The site content flows through git. Different process, different credentials, different blast radius. And there's no database to drop. Can't SQL inject S3. The attack surface that keeps enterprises awake doesn't exist here — it's files at URLs, all the way down.

The attacker is just another actor with different motives. The architecture doesn't distinguish between malice, mistakes, and enthusiasm — it limits what any actor can do. Same forks, same review, same blast radius.

Most roads end in a log file. The only path that reaches "something changed on the live site" requires every fork to go the right way. And even then — human review is the last fork. The architecture is the security.

## Secret storage

How well-protected is the secret on each device:

| Client           | Secret stored in         | Protection                 |
| ---------------- | ------------------------ | -------------------------- |
| Mac              | Keychain + Touch ID      | High — biometric to access |
| Phone (Shortcut) | Shortcut text field      | Medium — phone lock screen |
| Kid's device     | Shortcut, short expiry   | Medium, time-bounded       |
| Browser (future) | Cognito + hashme service | Medium                     |

The phone stores thoughts. The Mac publishes. Touch ID on the Mac isn't friction — it's a finger tap, you're already at the keyboard. Face ID on the phone would add a step to a workflow where the consequence is a log entry. Biometric goes where it's free, not where it hurts.

## Multi-user

For family: mint tokens on my Mac, hand them out. Each person gets their own `sub` and `scope`. Revoke = don't re-mint.

For the public: Cognito. Self-service signup, groups, the standard OAuth flow. Lambda checks `iss` to decide which verification path — minted JWT or Cognito JWT.

Both paths converge at the same tube. Same Lambda, same S3 bucket, same result.

---

A stream of thoughts. That was always the intent. This is the implementation.

[kiro]:
spec: [share](../../.kiro/specs/share/README.md)

[claude]:
session: 2026-05-23
plan: .claude/plans/tender-bubbling-crystal.md

Phase 1 — [share]: block renderer in lib/posts.ts (follows [design]: pattern), CSS placeholder, blocks.md entry, iOS Shortcut (minted JWT + time-hash, POST to /tube/share/add?). CF function for /tube → 202 + receipt.
Phase 2 — Lambda pipe (request + body to S3). S3 event triggers processor Lambda. Edge-auth updated to verify minted JWTs alongside Cognito.
Phase 3 — Passkeys for browser writes. Native iOS/macOS app with Secure Enclave. hashme service for web clients.
Phase 4 — MCP server (read-only /fs + logs). Query captures, trace requests by receipt, check infra state. The AI reads, you write.

[journey]:
prev: travel-capture
This is the evolution of travel-capture.md — that post was the vague-thought, this is the design session. The key shift: the post is about how the platform works, with share as the first example. /tube is input (fire-and-receipt), /fs is output (read with auth). The tube has two ends — anyone can write to the input, trust gates the output. Compute happens on read, not write. The name is the architecture. AI is the loop. The MVP is four pieces. The auth is pretty good. The architecture is the security.
