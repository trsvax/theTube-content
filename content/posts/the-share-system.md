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

## The design

Two flows, two trust levels, one endpoint.

**Field capture** — out in the world, hit share, tap "Save to Tube." The Shortcut logs the intent:

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

## The auth model

Started thinking about key pairs — private key on Mac, public key in the repo, openssl signing. That works, but it's two different auth paths (asymmetric for Mac, bearer token for phone). Complicated Lambda verification. Two code paths to maintain.

Landed somewhere simpler: **minted JWTs with embedded secrets and time-based hashes.** One model for everything.

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

The `scope` controls what you can do. The `sub` identifies the device. The `secret` is what makes the time-hash work. The JWT itself is HMAC-signed with the secret — can't tamper with the claims without invalidating the signature.

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

### What an attacker needs

- Token alone → fails (can't compute hash without secret)
- Secret alone → fails (no valid token to present)
- Both, but later → fails (timestamp outside ±30s window)
- Both, right now → succeeds, but requires my unlocked device

If they have my unlocked device, I've got bigger problems. Remote wipe, mint a new token.

## Trust levels

The same mechanism, different storage:

| Client | Secret stored in | Trust |
|--------|-----------------|-------|
| Mac | Keychain + Touch ID | High |
| Phone (Shortcut) | Shortcut text field | Medium |
| Kid's device | Shortcut, short expiry | Medium, time-bounded |
| Browser (future) | Cognito + hashme service | Medium |

The Mac is the highest trust because Keychain + biometric. The phone is medium — the secret is in the Shortcut, protected by the phone's lock screen. Kids get short expiry as a natural re-authorization.

## Identity and escalation

The JWT is identity — it's always there, even on public pages. The site knows who's looking. But identity alone doesn't authorize writes.

For reads: the JWT claims gate access. `role: kids` → can see `/kids/`. Same as edge-auth does today with Cognito groups.

For writes: the time-hash is the escalation. It proves physical presence — you have the secret, you computed the hash, you're here right now. On the Mac that means Touch ID. On the phone it means the phone is unlocked and the Shortcut is running.

Future: passkeys for the browser. Same principle — biometric confirmation before writing. The JWT says who you are, the passkey says "yes, right now, I intend this."

## Multi-user

For family: mint tokens on my Mac, hand them out. Each person gets their own `sub` and `scope`. Revoke = don't re-mint.

For the public: Cognito. Self-service signup, groups, the standard OAuth flow. Lambda checks `iss` to decide which verification path — minted JWT or Cognito JWT.

Both paths converge at the same endpoint. Same Lambda, same S3 bucket, same result.

## The `/w/` foundation

This isn't specific to share. The pattern is generic:

```
/w/share/add?...     → capture intent
/w/comments/add?...  → add a comment
/w/react/add?...     → like/bookmark
```

`?` present → log and 202 (batch, no compute). No `?` → Lambda processes it. Same auth, same CF function, same log processing. Build it once, every write operation uses it.

CloudFront logs give you timestamp, IP, user-agent, and edge location on every request for free. The field capture log entry tells you when, roughly where, and what device. You didn't design any of that. It's just there.

## Closing the loop

The captures are breadcrumbs. You drop them in the field without thinking. The interesting part is what happens when you come back.

"What photos did I take on my walk?" That's a log query. CloudFront logs from the last two hours, path `/w/share/add`, device `iphone` — three images, two with captions, timestamps that tell you the order. The walk is reconstructed from the breadcrumbs.

An MCP server with read-only AWS access makes this conversational. The AI reads the logs, tells you what you captured, helps you build the post. No CloudWatch console, no grep, no manual cross-referencing. Just: "what did I see today?" → here's the list, want me to draft the `[share]:` blocks?

The same read access answers infrastructure questions. "Why did this get a 403?" — pull the CloudFront log, find the request ID, check the edge-auth Lambda log, find the rejection reason. "Is `/w/` wired up?" — check the distribution config. One question, one answer.

All reads. The AI doesn't need write access to AWS. It reads logs, reads config, reads state. The writes happen from your devices through the auth chain, or from your editor through git. The AI connects the dots.

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
This is the evolution of travel-capture.md — that post was the vague-thought, this is the design session. The key shift from the original: dropped the asymmetric key pair approach in favor of minted JWTs with embedded secrets and time-based hashes. Same verification path for all devices. The two trust tiers remain (?=batch=log only, no ?=Lambda=compute) but the auth is unified. The passkey insight: identity (JWT) is always present, writes require escalation (biometric/time-hash). The /w/ path is a generic write endpoint — share, comments, reactions all use the same pattern. The MCP insight: the AI only needs reads to be useful — logs, config, state. Writes stay on your devices through the auth chain.
