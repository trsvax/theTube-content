---
title: Uptime Is a DNS Problem
date: 2026-05-21
tags: [tech]
type: journal
audience: public
status: draft
coffee: 0
origin: conversation
summary: Multi-cloud failover for static sites isn't an architecture problem. It's a DNS record change.
---

Everyone overcomplicates multi-cloud. Replicate the database. Sync the sessions. Health-check the servers. Coordinate the failover. Hire an SRE team to watch the dashboard.

That's the server model. The static model is different.

## The static model

The output is files. The deploy is `sync`. The failover is: point the name at a different place that has the same files.

```
GitHub Actions build
  → sync to S3 (CloudFront origin)
  → sync to Azure Blob Storage (Azure CDN origin)
  → sync to Cloudflare Pages (or R2)
```

Same `out/` directory, multiple destinations. No replication protocol. No conflict resolution. No eventual consistency. The build is deterministic — same input, same output, every time.

## The failure modes

1. **Cloudflare up** — done. It routes to whichever origin is healthy. You're not thinking about it.
2. **Cloudflare down** — update DNS to point directly at CloudFront or Azure CDN. One record change. Minutes, not hours.
3. **DNS provider down** — wrong DNS provider. That's a procurement decision, not an architecture one.

Each layer fails independently. The fix at each layer is a record change, not a rebuild.

## Why this works

No database to replicate. No session state to sync. No server to health-check. No persistent connection to maintain. The files are the same everywhere because they came from the same build. The only question is which name points at which edge.

Multi-cloud for a static site is `rsync` to two places and a DNS record. That's it.

## The uptime pitch

"Static architecture with multi-cloud failover. No servers, no database replication, no state sync. The uptime guarantee comes from the architecture, not from ops heroics."

The SLA isn't "we'll keep the servers running." It's "the files exist in three places and DNS points at one that's up." The blast radius of any single failure is zero because there's nothing to cascade. Each origin is independent. Each edge is independent. The only shared state is the build output, and it's immutable.

## What about auth?

Auth is the hard part. Edge functions, JWTs, role-based routing — that's cloud-specific. But for the public read-only tier? There is no auth. It's just files at URLs. The multi-cloud story is trivial for the exact part that matters most for uptime SLAs: the content people are actually reading.

The authenticated tier can stay single-cloud. The public tier — the one in the SLA — is the easy one to make redundant.

[journey]:
Conversation. Started from "how hard to run on Azure too?" Realized: for static public content, multi-cloud is just deploying to two places. The architecture already supports it. The only real question is DNS — who points the name at what. Uptime isn't a server problem or a cloud problem. It's a DNS problem.
