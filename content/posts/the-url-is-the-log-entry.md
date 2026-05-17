---
title: The URL Is the Log Entry
date: 2026-05-17
tags: [tt:tech]
type: journal
audience: user
status: vague-thought
summary: The browser fetches a URL with the event in the query string. CloudFront logs the request. No backend, no analytics service. The log is a side effect of the request existing.
---

There's no logging on this site. Need some. The question is how to add it without adding infrastructure.

## The idea

The browser fetches a URL:

```
https://thetube.today/log?event=dead-link&url=https://example.com/gone&post=my-post
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

CloudFront access logs are in S3. Athena can query them with SQL. Filter by `/log?event=dead-link` and you have a dead link report. No database, no aggregation service. Just files and a query engine.

## What this doesn't do

- No real-time dashboard — you query when you want, not when events happen
- No alerting — the log is passive
- No public visitor tracking — only logged-in users trigger log events (the auth token gates it)

That's fine. The logging cluster philosophy: observe everything, act on what you choose. The log is the source of truth. The action is separate and human-driven.

## The pattern

It's a tracking pixel without the pixel. The URL is structured data. CloudFront is the log collector. S3 is the storage. Athena is the query engine. All of it already exists and costs nothing at this scale.

## Format detection

If the query string starts with `{`, it's JSON. Otherwise it's key=value pairs. The reader handles both — duck typing for log format. No configuration, no content-type header, no negotiation.

```
/log?event=dead-link&url=https://example.com/gone
/log?{"event":"dead-link","url":"https://example.com/gone","meta":{"post":"my-post"}}
```

Key=value for simple events. JSON when you need nested data. The reader figures out what it got. Same pattern as everything else.

## vs. the 5-machine cluster

The alternative is Elastic — a 5-machine cluster that needs patching every month, breaks its API every major release, requires shard rebalancing, index lifecycle policies, and a security team that always wants it updated. All that operational overhead just to store and query text.

CloudFront access logs + S3 + Athena: no patches, no API changes, no cluster management. The log format is stable. S3 doesn't have security vulnerabilities you need to patch. Athena is standard SQL that won't change. Zero machines. Same data, same queries, no ops.

The entropy argument again — Elastic fights it with constant maintenance. The serverless approach accepts it by having nothing to maintain. The second law wins either way, but one path costs you weekends.

[journey]:
prev: content-json-at-the-edge
Came from the dead link detection idea — the browser notices a broken link and needs somewhere to report it. Creating a GitHub issue is too aggressive. Logging is right. The simplest possible log is a fetch to a URL that CloudFront records. Zero new infrastructure.
