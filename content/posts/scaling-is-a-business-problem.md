---
title: Scaling Is a Business Problem
date: 2026-05-17
tags: [tt:tech]
type: journal
audience: user
status: vague-thought
summary: With the right architecture, scaling is "can you afford the bill?" — a business decision, not an engineering problem. No developer needs to wake up.
workflow: published
---

With a server, scaling is an engineering problem. You hit a wall, re-architect, hit the next wall. Load balancers, sharding, caching layers, connection pooling, horizontal scaling. Each jump costs engineering time on top of infrastructure cost. Developers get paged at 3am.

With S3 + CloudFront + Lambda, scaling is a cost problem. 10x visitors = 10x the pennies. No wall. No re-architecture. No capacity planning. No step functions. Just a straight line from zero to whatever.

## The entire category disappears

"Scaling engineering" — load balancers, sharding, read replicas, connection pooling, horizontal scaling — these are solutions to problems created by choosing a server in the first place. Remove the server and the problems don't exist.

No developer needs to wake up. No code needs to change. No architecture needs to be rethought. The question is just: can you afford the bill? That's a business decision.

## Linear cost, no cliffs

A server has scaling cliffs — works fine until it doesn't, then you need a bigger machine or a different architecture. The cost is non-linear: flat, flat, flat, then a spike of engineering time and infrastructure cost.

The serverless model is linear. Every additional request costs the same fraction of a penny as the first one. No surprises. No cliffs. Predictable.

## A dollar a month with no ceiling

The same architecture that costs a dollar at personal scale costs proportionally more at enterprise scale — but it's the same architecture. No migration, no re-platform, no "we need to rewrite this in Go for performance." The code doesn't change. The bill changes.

## What about the hard problems?

The things people say require a server:

- **Real-time collaboration** — it's a pipe (WebSocket). The hard part is conflict resolution, not the transport.
- **Transactions** — banks don't really solve this either. They use eventual consistency + reconciliation. "Pending" exists because the system isn't actually atomic. They pretend and fix it later.
- **Long-running processes** — rent a machine for the duration (EC2 Spot). Not a server you maintain — a machine you rent for an hour and throw away.
- **Streaming** — it's a pipe. WebRTC is peer-to-peer, doesn't even need a server beyond signaling.
- **Complex queries** — data warehouse problem. Redshift, BigQuery, Athena. Not a server problem.

None of them require a traditional server/database architecture. They require specific tools for specific jobs — pipes, rented compute, warehouses. The "server + database" pattern isn't the answer to any of them. It's just the default people reach for because it's familiar.

[journey]:
prev: already-distributed
The distribution post led to "why would anyone use a server?" The answer is familiarity, not necessity. Scaling is the clearest example — it's only an engineering problem if you chose an architecture that makes it one.
