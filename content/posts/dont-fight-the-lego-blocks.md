---
title: Don't Fight the Lego Blocks
date: 2026-05-17
tags: [tt:tech]
type: journal
audience: user
status: vague-thought
summary: Use the pieces the way they want to be used. The architecture that works is the one that fits the services, not the one that forces them into a shape they resist.
workflow: published
---

AWS is lego blocks. Each service does one thing. The architecture that works is the one that assembles them the way they fit — not the one that forces them into a shape they resist.

## The logging example

You could run Elastic on 5 EC2 instances. Index every log line at ingest. Pay for the cluster whether you query it or not. Fight the API changes every major release. Patch it when the security team asks.

Or: CloudFront logs to S3 automatically. Athena queries S3 on demand. Write is free (append to a file). Index is pay-per-query (scan when you need to). Zero machines. Zero maintenance.

The second approach isn't clever engineering. It's just using the blocks the way they fit. CloudFront already logs. S3 already stores. Athena already queries. You don't build anything — you connect what's there.

## The principle

Don't build a server to do what a managed service already does. Don't run infrastructure to do what the CDN handles. Don't maintain a cluster when the native model is serverless.

The cost of fighting the blocks is operational: patching, upgrading, monitoring, scaling. The cost of using them as designed is the AWS bill — which at personal scale is a dollar a month.

## Where this shows up

- Logging: CloudFront + S3 + Athena, not Elastic
- Auth: Cognito + Lambda@Edge, not a session server
- Hosting: S3 + CloudFront, not EC2 + nginx
- Deploy: GitHub Actions + S3 sync, not a CI server
- Content: static files, not a CMS with a database

Every decision is the same: use the block that fits, don't build the thing the block already does.

## Old Lego vs new Lego

Old school Lego: generic bricks, build anything, the pieces don't dictate the shape. New Lego: specialized pieces designed for one kit, fight them and you get a mess.

AWS services are old school Lego — generic blocks (S3 stores bytes, CloudFront serves HTTP, Lambda runs code) that compose freely. Running Elastic on EC2 is new Lego — a specialized kit that only builds one thing and breaks if you deviate from the instructions.

The generic bricks age better than the specialized kits. Entropy again — the specialized kit fights time. The API changes, the versions drift, the security patches pile up. The generic blocks don't change because they don't need to. S3 stores bytes the same way it did in 2006. That's the second law working in your favor for once — the simpler the piece, the less it decays.

[journey]:
prev: the-url-is-the-log-entry
Came from the logging discussion — realizing that the write/index split maps perfectly to CloudFront + Athena, and that fighting that model (running Elastic) is fighting the lego blocks. The principle generalizes across the whole platform.
