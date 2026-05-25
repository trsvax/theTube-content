---
title: "Share System: Checkpoint"
date: 2026-05-24
tags: [tech]
type: journal
audience: user
status: journaling
coffee: 1
summary: Design review checkpoint. The capture path works end-to-end. Documenting what's proven, what's decided, and what's still open before building the rest.
workflow: draft
---

The share system has a working capture path. Time to stop and look at the whole thing before building more.

## What's proven (working today)

**Capture from Mac:**

```
share-request.sh capture --type image --file IMG_TEST_001.HEIC --date 2026-05-24 --caption "testing"
→ POST /tube/share/add?type=image&file=IMG_TEST_001.HEIC&date=2026-05-24&caption=testing
→ 202
```

The request hits CloudFront, the CF function returns 202, CloudFront logs the full URL with timestamp, edge location, user-agent. The breadcrumb is dropped.

**Log sync:**

```
sync_captures(date: "2026-05-24")
→ Scanned 47 log files, found 1 share entry, added 1 new capture
```

Reads S3 logs, extracts `/tube/share/` entries, stores to SQLite. Tracks which log files have been processed. Idempotent — re-run skips already-synced files.

**Query:**

```
query_captures(date: "2026-05-24")
→ [{file: "IMG_TEST_001.HEIC", type: "image", date: "2026-05-24", caption: "testing share endpoint"}]
```

The AI reads SQLite, tells you what you captured. That's the UI.

## Design decisions (locked in)

**Per-app CF functions.** `/tube/` is the mount point. Each app owns its namespace and routing. Share has `cf-share.js` on a `/tube/share/*` behavior. The default (`cf-short-urls.js`) catches anything without its own behavior — query string → 202.

**Auth is part of the path contract.** No Authorization header → 404. The path doesn't exist without auth. Not security (can't verify at the edge), but the endpoint is invisible to anything that doesn't know the protocol.

**The `?` convention.** Query string = data lands in the URL, CloudFront logs it automatically. No query string = body, Lambda saves it to S3. JWT gates access either way — without auth, the endpoint doesn't exist. The `?` decides where data lands, not whether compute runs.

**SQLite as working memory.** The MCP proxy owns a SQLite file. Captures, tokens, session notes, synced log tracking. Any AI that connects gets the same state. The source of truth is S3 (logs, files). SQLite is the cache — lose it, re-sync.

**GraphQL as spec, not runtime.** `theTube-share/schema.graphql` defines the operations. The transport is whatever's cheapest — a URL and a log entry for capture, Lambda for publish. The schema describes what; the implementation picks how.

## Architecture as it stands

```
Phone/Mac                    CloudFront                     S3
    │                            │                          │
    ├─ POST /tube/share/add?...  ──→│                          │
    │   (Authorization: Bearer)  │                          │
    │                            ├─ cf-share.js             │
    │                            │   auth header? → 202     │
    │                            │   no header? → 404       │
    │                            │                          │
    │                            ├─ logs request ──────────→│ thetube-today-logs/
    │                            │                          │
    │                            │                          │
    ├─ POST /tube/share/upload  ──→│                          │
    │   (body: image)            ├─ cf-share.js             │
    │                            │   no qs → pass through   │
    │                            │         → Lambda ───────→│ /shares/{requestId}.jpg
    │                            │                          │
                                                            │
MCP proxy (local)                                           │
    │                                                       │
    ├─ sync_captures ──── reads logs from ─────────────────→│
    │                                                       │
    ├─ SQLite (state.db)                                    │
    │   captures, synced_logs, tokens, sessions             │
    │                                                       │
    ├─ query_captures ── reads SQLite                       │
    │                                                       │
    └─ AI asks "what did I capture?" ── answers from cache  │
```

## What's decided but not built

**Lambda for `/tube/share/upload`:**

- CF function passes through (no query string → origin)
- Lambda reads Authorization + X-Pass + X-Timestamp headers
- Verifies: decode JWT → get secret → SHA256(secret + timestamp) → compare → ±30s window → check scope
- Reads body → stores to S3 at `/shares/{requestId}.{ext}`
- Returns `{"src": "/shares/K1jaBcDeFgH.jpg"}`

The verification logic is proven in `verify-local.sh`. The Lambda is that script in Node with an S3 put.

**iOS Shortcut ("Save to Tube"):**

- Same auth: JWT in a text field, secret in a text field
- Shortcuts has native "Generate Hash" (SHA256)
- Concatenate secret + timestamp → hash → X-Pass header
- POST to `/tube/share/add?type=...&file=...&date=...&caption=...`
- Same endpoint, same 202, same log entry

**`[share]:` block renderer:**

- In `lib/posts.ts`, follows the `[design]:` pattern
- Parses the block, renders placeholder if no `src:`, renders image if `src:` present
- CSS for the placeholder state

## Open questions

**1. How does `src:` get populated?**

After publish, the Lambda returns a URL. But who writes it back into the markdown? Options:

- The AI does it — you say "publish this" and it runs the upload, gets the URL, edits the post
- A script does it — `share-request.sh publish` returns the URL, a post-publish hook writes it into the file
- Manual — you paste it

The AI doing it feels right. It's already the UI for everything else.

**2. What's the S3 path for published images?**

`/shares/{requestId}.{ext}` — server-generated by CloudFront, not guessable. Same pattern as comments. But should it be under a role path? `/public/shares/...` vs `/user/shares/...`? If a share is in a protected post, should the image also be protected?

Probably: images at `/shares/` are public (they're just images). Access control is on the post page, not the asset. Same as how `/images/` works today.

**3. CloudFront behavior for Lambda origin?**

The `/tube/share/*` behavior currently points to the S3 origin. When the Lambda exists, requests without a query string need to route to a Lambda origin instead. Options:

- Change the `/tube/share/*` behavior to point to a Lambda function URL origin
- Add a separate `/tube/share/upload` behavior pointing to Lambda
- Use Lambda@Edge on the existing behavior

Lambda function URL as origin is simplest. One behavior, CF function decides what gets through, Lambda handles what arrives.

**4. Multiple captures of the same file?**

If I share `IMG_1234.HEIC` twice on the same day (different captions), the dedup check (`file + date`) would skip the second one. Is that right? Probably — same file, same day, it's the same capture. But if the caption changed, you'd lose the update.

Maybe dedup should be `file + date + caption`? Or just `file + date` and accept that the first one wins?

**5. The EC2 box — when?**

Not needed for the system to work. It's a convenience: Finder mount via WebDAV, automatic log sync via systemd timer. Build it when the ad-hoc flow gets annoying. The system proves itself without it.

## What's next

Build order, roughly:

1. iOS Shortcut — unlocks capture from the phone, which is the primary use case
2. `[share]:` block renderer — so captures are visible in posts
3. Lambda for publish — so images actually land
4. EC2 box — when the manual flow gets old

But the design is solid. The capture path works. The auth model is proven. The routing is clean. The rest is implementation.

[journey]:
prev: the-share-system
This is the checkpoint after proving the capture path end-to-end. The previous entry designed the system; this one documents what's working, what's decided, and what's still open. The key insight from this session: per-app CF functions (not one shared function), auth as part of the path contract (404 not 403), and the AI as the UI (sync → query → draft blocks).
