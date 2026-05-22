---
title: The /w/ Protocol
date: 2026-05-21
tags: [tech]
type: journal
audience: public
coffee: 0
origin: conversation
summary: One write endpoint. POST /w/{namespace}/{verb}. The ? is the switch — present means batch (always works), absent means Lambda (might 503).
workflow: draft
---

The platform had two write paths: `/events/` for batch (GET, logged by CloudFront, free) and `/fastevent/` for realtime (POST with body, Lambda processes immediately). Two endpoints, two verbs, two behaviors. The client had to know which one to use.

That's an eight-inch hose. The split was an implementation detail leaking into the protocol.

## One endpoint

```
POST /w/{namespace}/{verb}
```

That's the whole protocol. One URL pattern. One verb.

## The `?` is the switch

| Request | Guarantee | Default handler | Reliability |
|---|---|---|---|
| `?` present | Data is in the URL. Always captured in logs. | CloudFront Function, 202 | Data never lost |
| No `?` | Data is in the body. Requires compute. | Lambda | Might 503 |

The `?` means "the data is self-contained in the URL." The cheapest possible handler (log and 202) is sufficient. But nothing stops Lambda from also handling it — the `?` doesn't exclude compute, it just doesn't *require* it.

```
POST /w/comment/add?post=x&body=hello   → data captured regardless
POST /w/comment/add                      → needs Lambda, might fail
```

The `?` is a data-capture guarantee, not a routing constraint. The server can do whatever it wants with either path. But with a `?`, the data is in the log no matter what — even if Lambda is down, even if nothing processes it yet.

## Why this works at the CDN

CloudFront Functions can see the query string but can't read request bodies. The `?` is the natural boundary between what the function can handle alone and what needs Lambda. If there's a `?`, the function has all the data — it can return 202 without help. No `?` means the data is elsewhere, so it passes through to Lambda@Edge.

## Why POST

Not for semantic reasons. Not because there's a body (there might not be). Because POST tells CloudFront not to cache it. Every request hits the function. Every request gets logged. GET would risk caching — a cached 202 means lost events.

## The client contract

POST. Look at the status code.

- `2xx` — success. Done.
- `4xx` — your fault.
- `503` + `Retry-After` — Lambda is down, resend later.

If there's a response body, use it. If not, don't. The client doesn't know or care what's behind the endpoint.

## Failure modes

`?` path: data is always captured in the log. Even if Lambda is down, even if nothing processes it yet. The log is the safety net.

No-`?` path: Lambda might be down. 503 + Retry-After. The client holds the data and retries. You opted into compute — you accept the failure mode.

## Namespace is a convention, not a contract

```
/w/comment/add       → plugin repo (thetube-comments)
/w/contact/submit    → platform built-in
/w/deploy/done?      → internal event (empty query string, just the path matters)
/w/error/js          → client error reporting
```

The path structure is `/w/{namespace}/{verb}`. But nothing enforces that the namespace maps to a repo or that a schema exists. The CloudFront Function doesn't validate — it logs and returns 202. Structure is opt-in when you need it.

Plugins that want typed operations bring a GraphQL schema. The operation name tells you the input params and output shape. The directives tell the client hook whether to include a `?`. But you can also just `POST /w/whatever/thing?x=1` and it gets logged. Grep later. Add structure when it earns its keep.

## What this replaces

- `/events/` — gone. Was the batch path.
- `/fastevent/` — gone. Was the realtime path.
- `addComment` vs `addCommentRealtime` — one operation. `?` decides.
- Client-side routing based on role — gone. The hook reads the schema directive and decides whether to include a `?`.
- GET for writes — gone. POST always, for caching reasons.

## CloudFront config

One behavior: `/w/*` → no cache, run the function. Auth, CORS, rate limiting — one place.

## Isolation

The namespace is the security boundary. Each namespace maps to a repo, a Lambda, an IAM role, and an S3 prefix:

```
/w/comment/*  → thetube-comments repo → comment Lambda → can only write s3://bucket/comments/*
/w/contact/*  → contact repo          → contact Lambda → can only write s3://bucket/contact/*
```

The contract repo declares what the plugin *can* do (the schema). IAM enforces the ceiling. A team with write access to `thetube-comments` can break comments. They can't break contact forms, can't break the main site, can't touch other namespaces.

Blast radius = repo scope. A bad deploy means one namespace returns 503 until they fix it. Everything else keeps working. And the `?` path still captures data even when the Lambda is broken — nothing is lost, it's just slow until the fix ships.

Different teams can only break their own stuff.

The platform enforces the boundary but says nothing about what happens inside it. Process, tooling, language, deploy cadence, code review policy — all internal to the repo. One team vibe codes and ships ten times a day. Another does waterfall with mandatory reviews. The platform doesn't care. The interface is the schema and the URL. Everything behind it is the team's business.

## The schema's role

The GraphQL schema in a plugin repo declares:

- What operations exist (the namespace/verb combinations)
- What parameters each operation accepts
- What the output looks like
- What directives apply (`@moderate` = include `?`, `@realtime @auth` = no `?`)

It's a type system and capability declaration. Not a routing table.

[journey]:
Conversation. Started from the eight-inch-hose insight — /events/ and /fastevent/ were two endpoints because someone wrote it down early. Collapsed to one: POST /w/{namespace}/{verb}. The ? is the routing signal — CloudFront Function can see it, can't see bodies. ? present = batch, always works, free. No ? = Lambda, might 503. The protocol is one sentence. The hose became a tube.
