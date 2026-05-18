---
title: Per-User Namespaces
date: 2026-05-18
tags: [tt:tech]
type: journal
audience: user
status: vague-thought
summary: Plan 9's per-process namespaces on a CDN. The edge picks the right site.json per role. Each user sees a different filesystem. Static files, fully cacheable.
---

Plan 9 gives each process its own namespace — a different view of the filesystem based on who you are. The edge can do the same thing.

## The idea

Pre-generate a `site.json` per role at build time:

```
s3://bucket/site/public.json
s3://bucket/site/user.json
s3://bucket/site/kids.json
s3://bucket/site/friends.json
```

The edge reads the JWT, determines the role, rewrites `/site.json` to `/site/{role}.json`. Static files, fully cacheable per role. No Lambda processing on every request.

## What each user sees

- Public: `site/public.json` → public sections only
- Logged-in: `site/user.json` → public + user sections
- Kids group: `site/kids.json` → public + user + kids sections
- Friends group: `site/friends.json` → public + user + friends sections

The namespace is composable and per-user. The files are static. The edge is the mount point.

## Why this works

Same pattern as the existing role-scoped `content.json` files — already doing this for post feeds. Extending it to `site.json` means the browser never sees sections it can't access. No 403s, no wasted requests, no leaking what exists to unauthorized users.

Four files generated at build time. The edge picks the right one. No runtime filtering needed.

## For the enterprise project

This is how multi-tenancy works without a server. Each tenant gets their own `site.json` variant. The edge routes by identity. Same bucket, different views. Scale to thousands of tenants with no infrastructure change — just more static files.

[journey]:
prev: content-json-at-the-edge
The edge-filtering idea applied to site.json. Instead of filtering at runtime, pre-generate per role and let the edge pick. Same pattern already used for content.json. Plan 9 per-process namespaces realized on a CDN.
