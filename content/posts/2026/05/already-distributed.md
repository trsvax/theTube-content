---
title: Already Distributed
date: 2026-05-17
tags: [tt:tech]
type: journal
audience: public
status: vague-thought
summary: Multi-zone, multi-region, globally distributed — without configuring anything. That's what you get for free by using the CDN as the serving layer instead of a server.
workflow: published
---

CloudFront has 450+ edge locations across 90+ cities. Every request is served from the nearest edge. S3 replicates within a region across multiple availability zones automatically. The site is already globally distributed without configuring anything.

A database in multiple zones requires cross-region replication, conflict resolution, consistency tradeoffs. S3 + CloudFront just does it.

## The log path is distributed too

The `/logs/` write path hits CloudFront — which means it's accepted at the nearest edge, globally. The `/fastevent/` path runs Lambda@Edge — also at the nearest edge. The write side is as distributed as the read side. No single point of ingestion.

## What this means for the event bus

Comments submitted from Tokyo hit the Tokyo edge. Comments from London hit the London edge. Both end up in the same S3 bucket. The Lambda processes them all. The output file is served from all edges.

A traditional server-based comment system: one server, one region, everyone else gets latency. Or you run multiple servers and deal with replication conflicts. Here there's nothing to replicate — S3 is the single source of truth and CloudFront distributes the reads.

## No failover

There's nothing to fail over. CloudFront doesn't go down — if one edge fails, traffic routes to the next. S3 doesn't go down — it's replicated across facilities. Lambda doesn't go down — it runs in whatever AZ has capacity.

The whole system is more available than any single server could be, and you didn't configure any of it. You just used the blocks the way they fit.

[journey]:
prev: the-log-is-the-event-bus
Realized the event bus pattern is already globally distributed because CloudFront is the ingestion layer. No single point of failure, no replication to configure, no failover to manage. The lego blocks handle it.
