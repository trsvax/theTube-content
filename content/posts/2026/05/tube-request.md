---
title: tubeRequest
date: 2026-05-29
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: chat
summary: One function hides the tube. POST the request, get a signed URL back, fetch the result. The provider doesn't know about JWTs, S3, or idempotency. It just awaits.
workflow: draft
---

The WebDAV providers call AWS directly right now. That means the server holds full credentials. The fix: route everything through the tube.

```js
const result = await tubeRequest("aws/describe-cloudfront", params);
```

That one function does:

1. POST to `/tube/aws/describe-cloudfront` with JWT
2. Tube Lambda validates JWT scope, writes request to S3
3. Tube returns 202 + signed URL to the result location
4. `tubeRequest` polls or waits for the result
5. Returns the content

The provider doesn't know about auth. The provider doesn't hold AWS credentials. The provider just awaits a result. Same as `fetch`. Same as a React hook.

## The chain

```
Your JWT → tube → request file in S3 → processor Lambda picks it up
  → checks scope → assumes scoped IAM role → makes AWS call
  → writes .result file → marks request as executed (S3 metadata)
  → signed URL resolves → tubeRequest returns the content
```

## Idempotent

Second call with the same request: tube sees `.result` exists, returns 200 with the signed URL. No re-execution. The log is the dedup key.

## The pattern at every layer

| Layer | Abstraction | Hides |
|-------|-------------|-------|
| Browser | `useQuery("cloudfront")` | fetch, cache, loading state |
| Server | `tubeRequest("aws/describe-cloudfront")` | POST, signed URL, polling |
| Filesystem | `GET /fs/aws/cloudfront/README.md` | everything |

One pattern. Three layers. The tube is the backend for all of them.

## What this gives you

- **No credentials on the WebDAV server** — only a JWT
- **Per-key scoping** — different JWTs see different AWS resources
- **Immutable audit trail** — every request is a file in S3
- **Idempotent by default** — same request returns cached result
- **Observable** — `ls /fs/tube/s3/aws/` shows what happened

## Next

Implement `tubeRequest`. Wire the providers through it. The whole filesystem becomes JWT-scoped without any provider knowing about auth.

[journey]:
prev: the-tube-is-live
Came out of the "how do we secure the WebDAV server" discussion. The answer: don't give it credentials. Route through the tube. The tube is the permission layer. The JWT is the key. The signed URL is the receipt. Same pattern as the React hooks post — hide the complexity behind one function call.
