---
title: content.json at the Edge
date: 2026-05-17
tags: [tt:tech]
type: journal
audience: user
status: vague-thought
summary: What if there was one content.json with everything in it, and the edge filtered it by role? One source of truth, the proxy handles access.
---

Right now the build splits content into separate files per role — `/public/content.json`, `/user/content.json`, `/kids/content.json`, `/friends/content.json`. The script reads all posts, groups by audience, writes four files. The browser fetches whichever ones it can reach.

What if there was one file? Everything in it. The edge filters before returning.

## The idea

One `content.json` with all items regardless of audience. A CloudFront Function (or Lambda@Edge) reads the viewer's JWT, checks the `cognito:groups` claim, and strips items the viewer can't see. Returns the filtered result.

The producer doesn't need to know about access control. The consumer doesn't need to know about hidden items. The proxy handles the impedance mismatch.

## What it eliminates

- `build-indexes.mjs` — no more build-time splitting
- Four separate files — one source of truth
- The `audience` field still exists in frontmatter but it's consumed at the edge, not at build time

## What it needs

- A CloudFront Function that can parse JSON, read a JWT from a cookie, and filter an array. CF Functions have a 10KB code limit and can't do network calls — but the filtering is simple enough. The JWT validation is already done by Lambda@Edge on the protected paths.
- Or: Lambda@Edge on the `content.json` path specifically. More capable, slightly more latency.

## The Proxy pattern

Same pattern as JavaScript's `Proxy` object — intercept the access, return only what the caller is allowed to see. The data exists in full. The proxy gates it. `pii(obj)` in JS strips fields the caller shouldn't see. The edge does the same thing to `content.json`.

## What could go wrong

- CF Function size limit — the filtering logic plus JWT parsing might not fit in 10KB
- Caching — if the response varies by role, CloudFront can't cache it the same way. Need `Vary` headers or cache policies per role.
- Latency — Lambda@Edge adds cold start time. For a JSON file that's fetched once on page load, probably fine.

## Why it's worth exploring

It makes the whole thing feel dynamic — like there's a server. But there isn't one. It's a static file being filtered at the edge. CloudFront is the server you don't have to maintain. Lambda@Edge is the middleware you don't have to deploy. The static file is the database you don't have to back up. It looks dynamic to the user but the infrastructure is still just files on S3.

That's the Plan 9 thing again — the namespace looks unified to the client, but it's assembled from different sources at request time. The client doesn't know or care how it's composed.

It's the same argument as the rest of the platform: one source of truth, multiple readers, the proxy handles access. The build stays simple. The edge does the work. Failure is an option — if it doesn't work, the current approach is fine and the journal means I learned something.

[journey]:
prev: cloudfront-is-a-reverse-proxy
Came from a conversation about Proxy objects in JS filtering PII fields at runtime. The leap: CloudFront is already a proxy. It already validates JWTs. Why not have it filter content.json too? Eliminates the build-time split entirely. Might not work due to CF Function limits or caching complexity — worth finding out.
