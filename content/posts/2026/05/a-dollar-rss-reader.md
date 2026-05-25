---
title: A $1 RSS Reader You Actually Own
date: 2026-05-16
tags: [tech]
audience: public
type: journal
summary: No ads, no tracking, no algorithm. Your reading history in S3, queryable forever, with an MCP server for free.
workflow: draft
---

Feedly costs $8/month and knows everything you read. Google killed Reader. Twitter killed third-party clients. The pattern is always the same: give us your attention graph, we'll give you convenience.

There's a different way to build this.

## The architecture

An RSS reader is not a complicated application. It has three moving parts:

1. Something that fetches feeds on a schedule
2. Somewhere to store the items
3. A UI to read them

The interesting question is what you use for storage. Most readers use a database they manage. I'm using S3 Tables — Amazon's Iceberg-based structured data primitive — which means every item I've ever fetched is stored in open columnar format, queryable with SQL, and costs pennies per month to keep forever.

The poller is a Lambda function triggered by EventBridge every 15 minutes. It fetches each feed, parses the XML, and writes new items to the Iceberg table. The query layer is Athena, which runs SQL directly against S3 — no database server, no connection pool, no operational overhead. A second Lambda translates Athena queries into JSON that the browser already knows how to render.

The frontend is a page on theTube, gated behind a Cognito login. The whole stack runs in your AWS account.

## What it costs

Fifty feeds, ten items each per day: ~15,000 items per month. Lambda polling is well within the free tier. Athena costs $5 per terabyte scanned — your feed database is a few megabytes, so each query costs a fraction of a cent. S3 storage for the items is effectively zero.

Total: under $1/month. No ads. No tracking. No algorithm deciding what rises to the top.

## Any feed protocol

The poller is just an adapter. RSS and Atom are the obvious ones. Bluesky (AT Protocol), Mastodon (ActivityPub), GitHub notifications, Hacker News — they all reduce to the same schema:

```
source, author, title, body, url, published_at
```

Everything downstream is identical. The reader doesn't care where an item came from.

## Clone the repo, get a reader

The same pattern theTube uses for publishing. The repo is the application. Your S3 bucket is your data. Fork it, point it at your feeds, add your AWS credentials, deploy. Nobody else has access to what you read or how often.

## The part that surprised me

Your reading history in S3 Tables is a natural MCP resource. An AI agent can query it directly: "what have I been reading about distributed systems this month?" Your personal feed becomes context for any tool that speaks MCP. That's not something Feedly can offer — because they need the data to be theirs.

The site already demos publishing without a platform. This adds consuming without a platform. Same stack, same CDN, same auth layer. Two sides of the open web.
