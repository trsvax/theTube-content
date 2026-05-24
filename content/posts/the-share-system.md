---
title: The Share System
date: 2026-05-23
tags: [tech]
type: journal
audience: user
status: journaling
coffee: 2
summary: An Apple Share action that POSTs to theTube. Field capture from any app, minted JWTs with time-based hashes, no upload required.
workflow: draft
---

In [Travel Capture](./travel-capture.md) I described the problem: you take a photo while traveling, you forget why it mattered by the time you're back at the machine. The prototype was a URL and a log entry — share the intent, grep the logs later.

That proved the concept. Now here's the real system.

## The `[share]:` block

The block is the glue between the log entry and the post. The block starts with the metadata from the capture. The `src:` fills in when the image publishes. The post builds when the block is complete.

```markdown
[share]:
type: image
file: IMG_4521.HEIC
captured: 2026-05-23T12:15:00
caption: creek trail
src:
```

Placeholder until published. The AI can generate these from the capture logs — "here are your three captures from today, I've drafted the blocks, which ones go in this post?"

## Closing the loop

AI is the loop.

## The design

Two flows, two scopes, one auth model.

**Field capture** — out in the world, hit share, tap "Send Tube." The Shortcut logs the intent:

```
POST /w/share/add?type=image&file=IMG_1234.HEIC&date=2026-05-23&caption=temple+gate
```

Query string → CloudFront logs it → 202. No compute, no upload. The photo stays in iCloud. The log is the breadcrumb: "this one mattered, at this time."

**Publish** — back at the machine, you've edited the photo in Apple Photos. Share the finished version. This time it uploads — Lambda receives the binary, stores it to S3, returns a URL. The `[share]:` block in your draft post gets a `src:`.

```markdown
[share]:
type: image
file: IMG_1234.HEIC
captured: 2026-05-23
caption: temple gate at sunset
src: /shares/2026-05-23-abc123.jpg
```

Placeholder until `src:` is populated. Real image once it lands. Same pattern as `[design]:`.

## The `/w/` foundation

This isn't specific to share. The pattern is generic:

```
/w/share/add?...     → capture intent
/w/comments/add?...  → add a comment
/w/react/add?...     → like/bookmark
```

`?` means the data is in the URL — self-contained, already captured in CloudFront logs the moment it arrives. That's not a design choice. That's just how CloudFront works. AWS picked that, not me.

The 202 means: 99.999999999% chance I have your data. Whether a Lambda also processes it doesn't matter. If Lambda fails, crashes, times out — the data is already in the logs. Reprocess later. The logs are the source of truth, not Lambda's output.

No `?` means the data is in the body — a photo, a file, something that doesn't fit in a URL. CloudFront doesn't log bodies. So you need something to catch it and put it somewhere durable. That's the Lambda — it takes the body, writes it to S3 as `{requestId}`, done. Doesn't parse it, doesn't validate it, doesn't care what it is. Just a pipe from HTTP to S3.

Same auth, same CF function, same log processing. Build it once, every write operation uses it.

CloudFront logs give you timestamp, IP, user-agent, and edge location on every request for free. The field capture log entry tells you when, roughly where, and what device. I didn't design any of that. It's just there.

## The MVP

This is why you think before coding. The whole system is four pieces:

1. CF function at `/w/*` → 202 (logs the request, done)
2. Lambda behind `/w/` for no-`?` requests → body to S3
3. iOS Shortcut with JWT + time-hash → "Send Tube"
4. MCP server reads the logs → "what did I capture?"

Everything else — real-time comments, passkeys, multi-user Cognito, browser uploads — is enhancement. The core loop works with just these four: capture in the field, store the breadcrumb (or the body), ask the AI what you captured, build the post.

## Identity and escalation

The first fork: has JWT? No → you're anonymous, public content is yours. Yes → identity claimed, more roads open.

Public content is the t-shirt — I'm on the street, anyone can read it. Don't know me? It's ok to introduce yourself. If I know you, I'd say hi and maybe chat. Want to come into my house? Now I need to know it's really you. Want to rearrange the furniture? That's my job.

Escalation isn't about reads vs writes — it's about consequence. Most reads are anonymous. Some reads need identity (protected content, private photos, kid stuff). Some writes are anonymous too (contact form — just another log entry). The fork decides based on what's at stake, not what HTTP method you used.

The time-hash is the escalation. It proves physical presence — you have the secret, you computed the hash, you're here right now. On the Mac that means Touch ID. On the phone it means the phone is unlocked and the Shortcut is running.

Future: passkeys for the browser. Same principle — biometric confirmation before anything consequential. The JWT says who you are, the escalation says "yes, right now, I intend this."

## The auth model

Assume every layer is broken. I wrote the code — it will fail. If your goal is to keep them out, you will fail. The goal is to make it matter less when it breaks. You can't trust any crypto layer — that's why the architecture doesn't depend on it. The auth classifies the request. The forks beyond it decide what that classification can do.

This is a personal site. The threat is someone with my unlocked device — at which point I have bigger problems. We just need pretty good auth, not perfect auth. No token server, no refresh flow, no session database.

**Minted JWTs with embedded secrets and time-based hashes.** One verification path, no infrastructure, secure enough for what this is.

The design exists because of the phone. iOS Shortcuts can hash a string but can't do Cognito without a native app. I didn't want to build two auth paths right now, so the Mac gets the same model — not because Cognito wouldn't work there, but because one path is simpler than two.

### How it works

On my Mac I mint a token. The token is a JWT with a random secret baked into the claims. The secret also goes in Keychain. At request time, the device computes `SHA256(secret + unix_timestamp)` and sends it as a header. Lambda decodes the JWT, extracts the secret, computes the same hash, compares.

```
Device:  SHA256(secret + timestamp) → X-Pass header
Lambda:  decode JWT → get secret → SHA256(secret + timestamp) → compare
```

The time-hash proves the device has the secret *right now*. Can't replay an old request — the timestamp drifts out of the ±30 second window.

### What's in the JWT

```json
{
  "iss": "share-mac",
  "sub": "mac",
  "scope": "publish",
  "secret": "ybVkb0ee8lQKswRvmMe5iwgmrsTIfJiGat_Y_jF9buc",
  "iat": 1716480000,
  "exp": 1748016000
}
```

The `scope` controls what you can do. The `sub` identifies the device. The `secret` is what makes the time-hash work. The JWT itself is encrypted (JWE) — can't read the claims without the decryption key, so the secret stays hidden even if the token leaks.

### One model, every device

Mint a token on the Mac for each device. Different scope, different expiry, same verification:

```bash
mint-token.sh --device mac --scope publish --days 365
mint-token.sh --device iphone --scope capture --days 90
mint-token.sh --device kid-emma --scope capture --days 30
```

Mac stores the secret in Keychain (Touch ID to access). Phone stores it in the Shortcut (synced via iCloud). Kids get short-lived capture-only tokens. Lambda doesn't care which device — same verification path for all of them.

### The phone can hash

iOS Shortcuts has a native "Generate Hash" action. SHA256 is built in. So the Shortcut computes the time-hash itself — no crypto library, no shell script, no third-party app. Just: concatenate secret + timestamp, hash it, send it in the header.

### What anyone needs

The more you have, the more I trust you:

- Token alone → identity claimed, not verified
- Token + secret → verified, but when?
- Token + secret + fresh hash → verified, right now
- All of that + Touch ID → highest confidence

If you have my unlocked device, I've got bigger problems. Remote wipe, mint a new token.

### Forks in the road

And even if capture auth fails completely — the result is the same: a line in a log file, and there are plenty of those. I'd need AI to even find it. Anyone can write to CloudFront logs — that's true for any site that logs. Every HTTP request is a log entry. The difference is I'm actually reading mine — the AI reads the logs, that's the UI — which means I'd notice the noise. The auth on capture isn't a security boundary — it's a signal-to-noise optimization.

No compute means no injection, no escalation, no stored XSS. The data doesn't touch a database, doesn't render anywhere automatically, doesn't trigger a function. You review the log, you decide what matters. That's the real security of the capture path — it's a journey with obstacles.

And if they reach the compute layer — Lambda is isolated. It writes the body to S3 as `{requestId}`. That's all it does. If you can exploit that, everyone has a problem. The site content flows through git. Different process, different credentials, different blast radius. And there's no database to drop. Can't SQL inject S3. The attack surface that keeps enterprises awake doesn't exist here — it's files at URLs, all the way down.

The attacker is just another actor with different motives. The architecture doesn't distinguish between malice, mistakes, and enthusiasm — it limits what any actor can do. Same scopes, same review, same blast radius.

But this isn't really about the auth model. It's pretty good auth — it passes the trust level to the next fork. The real security is the journey beyond it: each decision point is a fork in the road, and most forks lead to a dead end.

- Has JWT? → no → logged, 202, dead end
- Has valid hash? → no → logged, 202, dead end
- Has `?` in URL? → yes → logged, 202, dead end
- Has publish scope? → no → dead end
- Has Touch ID? → no → dead end

Most roads end in a log file. The only path that reaches "something changed on the live site" requires every fork to go the right way. And even then — human review is the last fork. You could swap the auth mechanism tomorrow and the security posture barely changes. The architecture is the security.

## Secret storage

How well-protected is the secret on each device:

| Client | Secret stored in | Protection |
|--------|-----------------|-------|
| Mac | Keychain + Touch ID | High — biometric to access |
| Phone (Shortcut) | Shortcut text field | Medium — phone lock screen |
| Kid's device | Shortcut, short expiry | Medium, time-bounded |
| Browser (future) | Cognito + hashme service | Medium |

The phone stores thoughts. The Mac publishes. Touch ID on the Mac isn't friction — it's a finger tap, you're already at the keyboard. Face ID on the phone would add a step to a workflow where the consequence is a log entry. Biometric goes where it's free, not where it hurts.

## Multi-user

For family: mint tokens on my Mac, hand them out. Each person gets their own `sub` and `scope`. Revoke = don't re-mint.

For the public: Cognito. Self-service signup, groups, the standard OAuth flow. Lambda checks `iss` to decide which verification path — minted JWT or Cognito JWT.

Both paths converge at the same endpoint. Same Lambda, same S3 bucket, same result.

---

A stream of thoughts. That was always the intent. This is the implementation.

[kiro]:
spec: [share](../../.kiro/specs/share/README.md)

[claude]:
session: 2026-05-23
plan: .claude/plans/tender-bubbling-crystal.md

Phase 1 — [share]: block renderer in lib/posts.ts (follows [design]: pattern), CSS placeholder, blocks.md entry, iOS Shortcut (minted JWT + time-hash, query string POST to /w/share/add?). CF function for /w/*?* → 202.
Phase 2 — Mac script with Keychain secret + Touch ID. Lambda for /w/share/upload (no ?), stores to S3 /shares/. Edge-auth updated to verify minted JWTs alongside Cognito.
Phase 3 — Passkeys for browser writes. Native iOS/macOS app with Secure Enclave. hashme service for web clients.
Phase 4 — MCP server (read-only AWS + GitHub, Touch ID on startup). Query captures, trace 403s, check infra state. The AI reads, you write.

[journey]:
prev: travel-capture
This is the evolution of travel-capture.md — that post was the vague-thought, this is the design session. The key shift from the original: dropped the asymmetric key pair approach in favor of minted JWTs with embedded secrets and time-based hashes. Same verification path for all devices. The ? convention is about data location (URL vs body), not trust tiers. The AI replaces the workflow app — conversation is the UI. The MVP is four pieces: CF function, Lambda pipe, iOS Shortcut, MCP server. The auth is pretty good. The architecture is the security.
