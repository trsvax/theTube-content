---
title: The Share System
date: 2026-05-23
tags: [tech]
type: journal
audience: user
status: journaling
coffee: 1
summary: An Apple Share action that POSTs to theTube. Field capture from any app, two trust tiers, no upload required.
workflow: draft
---

The problem: you're out walking, you see something worth writing about, you take a photo. By the time you're back at the machine the moment is gone. You remember the photo. You don't remember why it mattered.

The solution is already in your pocket. Every Apple app has a share button. You just need something to share *to*.

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

## Two trust tiers

The field capture Shortcut needs auth but not strong auth — you're just taking notes. A long-lived JWT stored in Keychain, sent as `Authorization: Bearer <token>`. Simple. The log processor checks it before acting.

The publish Shortcut earns compute, so it needs to earn the trust. On Mac: a public/private key pair. The private key lives in the Mac Keychain. The shell script reads it (Touch ID prompt), signs the payload with openssl, attaches the signature. The public key lives in the repo — anyone can verify, only you can sign.

```
scripts/share-public-key.pem  ← in the repo
~/.keychain (private key)     ← never leaves the Mac
```

Lambda verifies the signature before processing. Same model as Cognito JWT verification — public keys hardcoded, no network call at verify time.

The `?` is the routing signal. Capture uses `?` (batch, logged, 202). Publish omits `?` (Lambda, verified, compute).

## The roadmap

The Shortcuts + shell script approach is the prototype. It works today. The iOS Shortcut has less trust than the Mac — no shell script, no openssl. A long-lived JWT is good enough for field capture.

The next step is a native iOS app. SwiftUI, share extension, Secure Enclave key. Device-bound signing, Touch ID to authorize each upload, proper OAuth. Same backend, same verification, better UX. Could ship to the App Store — the trust model scales to other users.

The Mac shell script and the iOS app converge on the same design: asymmetric key, signature in the header, public key in the repo.

## What the `/w/` path gives you for free

CloudFront logs timestamp, IP, user-agent, and edge location on every request. The field capture log entry tells you when (timestamp), where (edge location is a rough geo), and what device (user-agent). You didn't design any of that. It's just there.

The `[share]:` block is the glue between the log entry and the post. The block starts with the metadata from the capture. The `src:` fills in when the image publishes. The post builds when the block is complete.

[claude]:
session: 2026-05-23
plan: .claude/plans/tender-bubbling-crystal.md

Phase 1 — [share]: block renderer in lib/posts.ts (follows [design]: pattern), CSS placeholder, blocks.md entry, iOS Shortcut (JWT from Keychain, query string POST to /w/share/add?).
Phase 2 — Mac Shortcut with openssl signing (private key in Keychain, Touch ID), public key in scripts/share-public-key.pem, Lambda for /w/share/upload (no ?), stores to S3 /shares/.
Phase 3 — native iOS/macOS SwiftUI app, Secure Enclave, replaces Shortcuts.
CF function already handles /w/*?* → 202. No changes needed for Phase 1.

[journey]:
prev: travel-capture
This is the evolution of travel-capture.md — that post was the vague-thought, this is the design session. The key shift: two trust tiers mapped to the two /w/ paths (?=batch=low trust, no ?=Lambda=high trust). The field capture and publish flows are the same distinction. The Mac openssl signing with a public key in the repo came out of discussing what "real auth" looks like without writing an app. The iOS app is the long-term destination, the Shortcut is the prototype.
