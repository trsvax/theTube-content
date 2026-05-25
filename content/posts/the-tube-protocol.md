---
title: The /tube/ Protocol
date: 2026-05-21
tags: [tech]
type: journal
audience: public
coffee: 0
origin: conversation
summary: One write endpoint. POST /tube/{namespace}/{verb}. The ? is the switch — present means batch (always works), absent means Lambda (might 503).
workflow: draft
---

The platform had two write paths: `/events/` for batch (GET, logged by CloudFront, free) and `/fastevent/` for realtime (POST with body, Lambda processes immediately). Two endpoints, two verbs, two behaviors. The client had to know which one to use.

That's an eight-inch hose. The split was an implementation detail leaking into the protocol.

## One endpoint

```
POST /tube/{namespace}/{verb}
```

That's the whole protocol. One URL pattern. One verb.

## The `?` is an app decision

CloudFront logs the URL — path and query string. Not the body. That's the whole driver.

| Request     | Where data lands | Who saves it                           |
| ----------- | ---------------- | -------------------------------------- |
| `?` present | Query string     | CloudFront logs it automatically       |
| No `?`      | Body only        | Lambda saves it to S3                  |
| `?` + body  | Both             | CF logs the URL; Lambda saves the body |

Trust model: JWT present → Lambda spins up to verify and decide. No JWT → endpoint doesn't exist. The `?` is about data format — it signals that data is also in the URL, not that there's no body.

**Use `?`** when you want the data in CloudFront logs. The URL is the record. Lambda verifies the JWT and reads intent from what was logged.

**Use body** when you have a file to store, or when the data shouldn't be in the logs (PII, sensitive content). Lambda verifies the JWT and saves the body to S3.

**Use both** when you want metadata logged and a file saved in one request.

```
POST /tube/share/add?type=image&file=IMG_1234.HEIC   → CloudFront logs URL, 202
POST /tube/share/upload                               → Lambda saves body to S3
```

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
/tube/comment/add       → plugin repo (thetube-comments)
/tube/contact/submit    → platform built-in
/tube/deploy/done?      → internal event (empty query string, just the path matters)
/tube/error/js          → client error reporting
```

The path structure is `/tube/{namespace}/{verb}`. But nothing enforces that the namespace maps to a repo or that a schema exists. The CloudFront Function doesn't validate — it logs and returns 202. Structure is opt-in when you need it.

Plugins that want typed operations bring a GraphQL schema. The operation name tells you the input params and output shape. The directives tell the client hook whether to include a `?`. But you can also just `POST /tube/whatever/thing?x=1` and it gets logged. Grep later. Add structure when it earns its keep.

## What this replaces

- `/events/` — gone. Was the batch path.
- `/fastevent/` — gone. Was the realtime path.
- `addComment` vs `addCommentRealtime` — one operation. `?` decides.
- Client-side routing based on role — gone. The hook reads the schema directive and decides whether to include a `?`.
- GET for writes — gone. POST always, for caching reasons.

## CloudFront config

One behavior: `/tube/*` → no cache, run the function. Auth, CORS, rate limiting — one place.

## Isolation

The namespace is the security boundary. Each namespace maps to a repo, a Lambda, an IAM role, and an S3 prefix:

```
/tube/comment/*  → thetube-comments repo → comment Lambda → can only write s3://bucket/comments/*
/tube/contact/*  → contact repo          → contact Lambda → can only write s3://bucket/contact/*
```

The contract repo declares what the plugin _can_ do (the schema). IAM enforces the ceiling. A team with write access to `thetube-comments` can break comments. They can't break contact forms, can't break the main site, can't touch other namespaces.

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
Conversation. Started from the eight-inch-hose insight — /events/ and /fastevent/ were two endpoints because someone wrote it down early. Collapsed to one: POST /tube/{namespace}/{verb}. The ? is the routing signal — CloudFront Function can see it, can't see bodies. ? present = batch, always works, free. No ? = Lambda, might 503. The protocol is one sentence. The hose became a tube.
