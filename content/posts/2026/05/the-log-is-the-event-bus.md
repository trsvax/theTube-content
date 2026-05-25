---
title: The Log Is the Event Bus
date: 2026-05-17
tags: [tt:tech]
type: journal
audience: public
status: vague-thought
summary: The log path isn't just for logging — it's a write API. Different paths have different readers. Some index. Some produce artifacts. Comments without a server.
workflow: published
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

## Two paths, one format

Not everything needs the same latency:

- `/events/...` — cheap, async, 5-20 min latency. CloudFront logs the request, Lambda processes the log batch later. Returns 202 with no body. Fire and forget. Good for: dead links, analytics, error reporting.
- `/fastevent/...` — Lambda processes immediately, writes to S3 in real time. Sub-200ms warm, sub-300ms cold. Returns 202 with `Location` header pointing to where the result will appear. The browser knows exactly where to check back. Good for: comments, reactions, anything the next visitor should see.

```
POST /fastevent/comment?post=my-post&body=great+post

HTTP 202 Accepted
Location: /comments/my-post.txt
```

Standard HTTP semantics — no custom headers, no invented protocol. The `Location` on a 202 means "the result will be here when it's ready."

## What else fits

Anything that's "user did X" or "client observed Y":

- Reactions/likes — `/fastevent/react?post=my-post&type=👍`
- Bookmarks — `/logs/event/bookmark?post=my-post`
- Read tracking — `/logs/event/read?post=my-post`
- Form submissions — any form, serialize to the URL, process later
- Polls/votes — `/fastevent/vote?poll=best-framework&choice=htmx`
- Error reporting — `/logs/error/js?msg=...&stack=...`

The form is the UI. The URL is the persistence. The processor arrives when you need it. Build the form first, deal with the implementation later — the data is captured either way.

[journey]:
prev: the-url-is-the-log-entry
The logging post established the write path — a URL that CloudFront records. This is what happens when you ask "what else could read that log?" The answer is anything. Comments, reactions, analytics, moderation — all just different readers of the same event stream. The log is the event bus.
