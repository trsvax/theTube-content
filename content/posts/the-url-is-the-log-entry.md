---
title: The URL Is the Log Entry
date: 2026-05-17
updated: 2026-05-20
tags: [tech]
type: post
audience: public
status: vague-thought
coffee: 1
summary: The browser fetches a URL with the event in the query string. CloudFront logs the request. No backend, no analytics service. The log is a side effect of the request existing.
---

There's no logging on this site. Need some. The question is how to add it without adding infrastructure.

## The idea

Write a file:

```
https://thetube.today/events/link/dead?url=https://example.com/gone&post=my-post
```

CloudFront logs every request in its standard access logs. The URL _is_ the log entry. The response doesn't matter — 204, 404, a 1x1 pixel, whatever. The log exists because the request exists.

No backend. No Lambda. No analytics service. No third-party tracker. The infrastructure is already there — CloudFront access logs go to S3 by default.

## What the browser reports

- Dead links — fetched a URL, got a 404
- Errors — client-side JS exceptions
- Navigation — which posts get read (only for logged-in users, not public visitors)
- Whatever else becomes useful later

The browser is the plumber. It observes and reports. You review when you want.

## Querying later

CloudFront access logs are in S3. Athena can query them with SQL. Filter by `/events/link/dead` and you have a dead link report. No database, no aggregation service. Just files and a query engine.

The logs are permanent. Add a new feature next year that needs historical data — reprocess the old logs. Add Elastic later if you need real-time dashboards. The data doesn't move. You just add readers. Same file, multiple readers, different objectives.

This is why starting to collect now matters even without a processor. The data accumulates. When you eventually build the thing that reads it, all the historical data is already there waiting.

## What this doesn't do

- No real-time dashboard (yet) — you query when you want, not when events happen
- No alerting (yet) — the log is passive
- No public visitor tracking (yet) — only logged-in users trigger log events (the auth token gates it)

That's fine. The logging cluster philosophy: observe everything, act on what you choose. The log is the source of truth. The action is separate and human-driven.

Just grepping the logs like the 90s. And it works. Same as it did then. The tools haven't changed because they didn't need to. `grep` is still the right answer for "find this thing in these files." The 5-machine Elastic cluster was the detour.

## The pattern

The URL is structured data. CloudFront is the log collector. S3 is the storage. Athena is the query engine. All of it already exists and costs nothing at this scale.

## Format detection

The event is in the path. The content is in the query string. Sub-events use path hierarchy — "It's a UNIX system! I know this!"

```
/events/link/dead?url=https://example.com/gone&post=my-post
/events/link/slow?url=https://example.com/page&ms=3200
/events/deploy/start?commit=abc1234
/events/deploy/done?commit=abc1234&duration=28s
/events/error/js?msg=TypeError&post=my-post
/events/error/fetch?url=https://api.example.com&status=500
```

Easy to filter in CloudFront logs — match on the URI path. No query string parsing to find the event type. Different CloudFront behaviors per event type if you ever need them.

If the query string starts with `{`, it's JSON. Otherwise it's key=value pairs. The reader handles both — duck typing for log format. No configuration, no content-type header, no negotiation.

GET only — data must be in the URL to be captured in CloudFront access logs. The body isn't logged. For heavier payloads (comment bodies), use `/fastevent/` with POST — that hits a Lambda which receives the body.

## vs. the 5-machine cluster

The alternative is Elastic — a 5-machine cluster that needs patching every month, breaks its API every major release, requires shard rebalancing, index lifecycle policies, and a security team that always wants it updated. All that operational overhead just to store and query text that you may never query.

CloudFront access logs + S3 + Athena: no patches, no API changes, no cluster management. The log format is stable. S3 doesn't have security vulnerabilities you need to patch. Athena is standard SQL that won't change — not whatever Elastic's query DSL is this year. Zero machines. Same data, same queries, no ops.

The entropy argument again — Elastic fights it with constant maintenance. The serverless approach accepts it by having nothing to maintain. The second law wins either way, but one path costs you weekends and downtime.

10 lines of code. Globally distributed, infinitely scalable, immutable, queryable with SQL, costs nothing.

[journey]:
prev: content-json-at-the-edge
next: dont-fight-the-lego-blocks, the-log-is-the-event-bus
Came from the dead link detection idea — the browser notices a broken link and needs somewhere to report it. Creating a GitHub issue is too aggressive. Logging is right. The simplest possible log is a fetch to a URL that CloudFront records. Zero new infrastructure. The write/index split means you don't need CPU to do both in real time — write is free, index is on-demand. You might never query it, and that's fine.

Decision: renamed from `/logs/` to `/events/` — it's what it actually is. Something might act on it, not just index it later.

Built it. 10 lines in the CloudFront Function. More durable, more available, more scalable, cheaper, and tamper-proof than the billion-dollar logging industry. They're fighting the architecture — running servers to index data you might never query.

2026-05-20: Added "grepping like the 90s" — verified the comment form by grepping the logs. The tools haven't changed because they didn't need to. Added `updated` field to frontmatter because the post keeps growing.
