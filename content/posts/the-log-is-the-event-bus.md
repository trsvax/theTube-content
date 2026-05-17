---
title: The Log Is the Event Bus
date: 2026-05-17
tags: [tt:tech]
type: journal
audience: user
status: vague-thought
summary: The log path isn't just for logging — it's a write API. Different paths have different readers. Some index. Some produce artifacts. Comments without a server.
---

The URL-as-log-entry pattern does more than logging. The log path is a write API disguised as a URL. Different paths have different readers:

- `/logs/link/dead` → the log indexer reads it (Athena, whenever you query)
- `/logs/event/comment` → a Lambda reads the log, extracts comments, writes `comments.json` to S3

The log is the event bus. CloudFront is the ingestion layer. Different consumers process different event types. Some just index. Some produce artifacts the browser fetches.

## Comments without a server

Visitor writes to `/logs/event/comment?post=my-post&body=great+post`. Lambda@Edge validates the JWT, adds the user identity as a custom header. CloudFront logs the request with the authenticated user attached.

A Lambda (triggered by S3 log delivery) reads new comment events and appends them to a single file per post — `comments/my-post.txt`. Multiple comments per file. The browser fetches the file and renders them all. No JSON. Just text, one comment per line.

When the file gets too big, send `/logs/comment/aggregate?post=my-post` and something compacts it — archives old comments, trims the file, whatever makes sense. The aggregation is just another event in the log. Another reader handles it. The pattern handles its own growth.

You don't solve the scaling problem until you have it. And when you do, the solution is just another log event.

## The tradeoff

Higher latency — the comment appears after the Lambda processes the log, not instantly. But the system never goes down. The comment is in the CloudFront log the moment the request hits. It's not going anywhere. The processing can fail and retry without losing data.

Higher latency for simplicity and reliability. That's a better trade for a personal site than millisecond responses with a server that needs babysitting.

## The edge signs it

Lambda@Edge already validates the JWT. It knows who the user is. It adds the identity to the request before logging. The comment is attributed by the edge, not self-reported by the client. No trust in the browser. The auth layer you already have does the work.

## Same pattern, different readers

Same file (the CloudFront log), multiple readers with different objectives. The indexer queries it with Athena. The comment processor extracts events and produces artifacts. The browser reads the artifacts. Nobody coordinates. Each reader does its own thing.

[journey]:
prev: the-url-is-the-log-entry
The logging post established the write path — a URL that CloudFront records. This is what happens when you ask "what else could read that log?" The answer is anything. Comments, reactions, analytics, moderation — all just different readers of the same event stream. The log is the event bus.
