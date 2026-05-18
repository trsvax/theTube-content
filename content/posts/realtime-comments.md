---
title: Real-Time Comments
date: 2026-05-18
tags: [tech]
type: journal
audience: user
status: vague-thought
coffee: 0
summary: Comments via fastevent. Lambda validates, writes to S3, returns Location header. The next visitor sees the comment. Sub-second. No server.
---

The fast version. Comment appears immediately — no moderation queue, no waiting for a build. The visitor submits, the Lambda processes, the file updates, the next page load shows it.

## The flow

1. Visitor submits comment → `POST /fastevent/comment` with body `{ post: "my-post", body: "great post" }`
2. Lambda@Edge validates the JWT — knows who the user is
3. Lambda validates the data (post exists, body not empty)
4. Lambda appends to `comments/my-post.txt` in S3
5. Returns `202 Accepted` with `Location: /comments/my-post.txt`
6. Browser can poll the Location URL or just show "comment submitted"
7. Next visitor loads the page → fetches `comments/my-post.txt` → sees the comment

## Sub-second

Lambda warm: 50-100ms. S3 write: 20-50ms. Total: under 200ms from submit to file existing in S3. The next visitor gets it from CloudFront cache (if TTL allows) or directly from S3.

## The tradeoff vs moderated

- **Real-time**: instant gratification, but spam risk. Need auth (only logged-in users can comment) or rate limiting.
- **Moderated**: no spam, but delayed. Visitor doesn't see their comment immediately.

Both use the same storage format (`comments/my-post.txt`). You can run both — real-time for authenticated users, moderated for anonymous. Same file, different write paths.

## The Location header

Standard HTTP. `202 Accepted` + `Location` tells the client where to find the result. The browser knows exactly where to look without hardcoding paths. The Lambda decides the output location. The client follows.

## When to use which

- Personal blog with few visitors: real-time for logged-in users. You trust them (they signed up).
- Public-facing with unknown visitors: moderated. Review before publish.
- Both: real-time for `user` role, moderated for anonymous. The auth layer decides the path.

[journey]:
prev: moderated-comments
The fast path. Same storage, different processing. Lambda writes immediately instead of waiting for batch review. The 202 + Location pattern from the event bus spec applied to comments.
