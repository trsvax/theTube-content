---
title: Free Metadata
date: 2026-05-18
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
summary: CloudFront logs timestamp, IP, user-agent, referer, edge location on every request. You get dimensions of data you didn't design — they're just there.
workflow: published
---

Every event logged to `/events/...` comes with metadata you didn't ask for:

- **Timestamp** — when it happened
- **IP** — where it came from
- **User-agent** — what sent it (browser, GitHub Actions, curl, bot)
- **Referer** — what page triggered it
- **Edge location** — which CloudFront POP handled it

None of this is in the URL. CloudFront captures it automatically on every request. You get five dimensions of context for free.

## What this means

You can answer questions you didn't think to ask:

- "Are deploy events coming from GitHub Actions?" — check user-agent
- "Which edge location serves the most traffic?" — group by POP
- "What page has the most dead links?" — check referer
- "When do people read posts?" — timestamp distribution
- "Is someone hammering the events endpoint?" — group by IP

All from the same log. No additional instrumentation. The data was always there — you just started writing to a path that makes it queryable.

## Self-describing data

The URL content duck-types itself: starts with `{` → JSON, otherwise key=value. The metadata duck-types the source: user-agent tells you what sent it without the sender declaring anything. The whole system is self-describing without schemas.

[journey]:
prev: the-url-is-the-log-entry
Noticed that CloudFront access logs include user-agent, referer, timestamp, IP, and edge location on every request — all free, all queryable, none designed. The events endpoint gets five dimensions of metadata without adding anything to the URL.
