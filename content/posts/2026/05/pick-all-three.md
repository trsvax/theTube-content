---
title: Pick All Three
date: 2026-05-17
tags: [tt:tech]
type: journal
audience: public
status: vague-thought
summary: The old engineering joke says pick two. Turns out you just had to stop using servers.
workflow: published
---

The old engineering joke: fast, good, cheap — pick two. The assumption is that you're always trading one for another. That's true when you're choosing between implementations of the same architecture. It's not true when you change the architecture.

## Faster

A Lambda that reads one DynamoDB key and writes one S3 file is faster than a server-based API because there's less in the way. No framework boot, no middleware stack, no connection negotiation, no ORM serialization. Just the operation. Sub-200ms for a validated, stateful write.

Most server-based apps are lucky to get sub-second because they're doing more work per request than the problem requires.

## Better

Globally distributed. 99.9%+ uptime. Eleven 9s durability. No failover to configure. No single point of failure. No patches. No monitoring. No 3am pages.

The "no server" approach is more reliable than any server because there's nothing to go down.

## Cheaper

A dollar a month at personal scale. Linear cost at any scale. No idle cost — nothing runs when nobody's visiting. No scaling cliffs — 10x traffic is 10x the pennies, not a re-architecture project.

## Pick all three

The constraint was never "pick two." The constraint was the server. Remove it and the tradeoff disappears. Faster because there's less in the way. Better because there's nothing to fail. Cheaper because there's nothing running idle.

[journey]:
prev: scaling-is-a-business-problem
The scaling post ended with "why would anyone use a server?" This is the answer to the inverse: what do you get when you don't? Everything. Faster, better, cheaper — all three. The tradeoff was the server itself.
