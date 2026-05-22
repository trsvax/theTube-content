---
title: Real-Time Comments
date: 2026-05-18
updated: 2026-05-20
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
summary: Same as moderated. Add a Lambda. That's it. The architecture doesn't change. The form doesn't change. The logging doesn't change.
workflow: published
---

Same form. Same hook. Same event logged to CloudFront. The only difference: a Lambda that also writes the file immediately.

Without the Lambda, both paths are identical — CloudFront returns 202, the event is in the logs. Real-time doesn't exist until the Lambda exists. And the Lambda is one function that reads the request and writes a file.

The architecture doesn't change. The form doesn't change. The logging doesn't change. One function is the only difference between batch and real-time.

## The logs are the backlog

A UI person can ship the form today with `useMutation('comment/submit', { fast: true })`. It hits `/fastevent/`, gets 202 from the CloudFront Function, data is captured in the logs. The form works. The UI is done.

Events hitting `/fastevent/` that return 202 from the CloudFront Function (not a Lambda) = "this path exists in the UI but nobody's handling it yet." The log is the backlog. No ticket system needed. The logs *are* the tickets.

The follow-up is Lambda event processing — reading the logs and writing the files. The UI ships first. The backend catches up. No coordination. No blocking.

## The flow

1. Visitor submits comment → `POST /fastevent/comment` with body `{ post: "my-post", body: "great post" }`
2. CloudFront Function (viewer request) checks for JWT — no token → 403 immediately. No origin hit, no Lambda, no cost.
3. Lambda@Edge validates the JWT signature and role claim — knows who the user is
4. Lambda validates the data (post exists, body not empty)
5. Lambda appends to `comments/my-post.txt` in S3
6. Returns `202 Accepted` with `Location: /comments/my-post.txt`
7. Browser can poll the Location URL or just show "comment submitted"
8. Next visitor loads the page → fetches `comments/my-post.txt` → sees the comment

## Two-layer enforcement

The CloudFront Function is the bouncer. No JWT, no entry — 403 inline, sub-millisecond, before anything expensive runs. It can't do full crypto validation (10ms limit, no libraries), but it can check token presence and basic structure (three base64 segments).

Lambda@Edge is the real check. Validates the signature, checks the role claim, rejects expired tokens. This is where `@auth(role: "user")` is actually enforced.

The client hook would never call `/fastevent/` without a token anyway. The 403 is the safety net, not the routing mechanism.

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

## The client picks the path

The schema has `@auth(role: "user")` on `addCommentRealtime`. The client already knows the role from the JWT. So the hook picks the operation automatically — `user` role calls `/fastevent/`, anonymous calls `/events/`. One form, one component, no conditional UI. The role is the feature flag. The server still enforces (Lambda@Edge rejects unauthorized `/fastevent/` requests) but the routing decision happens client-side.

[journey]:
prev: moderated-comments
The fast path. Same storage, different processing. Lambda writes immediately instead of waiting for batch review. The 202 + Location pattern from the event bus spec applied to comments.
