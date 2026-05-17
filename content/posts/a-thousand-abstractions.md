---
title: A Thousand Abstractions
date: 2026-05-17
tags: [tt:tech]
type: journal
audience: user
status: vague-thought
summary: Remove the server and the entire abstraction chain collapses. What's left is files, URLs, functions, and a CDN. Four concepts.
---

What we removed:

- ORM
- Connection pool
- Middleware framework
- Job scheduler
- Message queue
- ETL pipeline
- Reporting database
- Backup system
- Monitoring stack
- Load balancer
- Reverse proxy config
- Container orchestration
- Service mesh
- API gateway framework
- Session store
- Cache layer
- Deployment tooling beyond `aws s3 sync`

What's left: files, URLs, functions, and a CDN. Four concepts. Everything else was abstraction over abstraction solving problems created by the previous abstraction.

## The chain

The server needed a load balancer. The load balancer needed health checks. The health checks needed monitoring. The monitoring needed alerting. The alerting needed a notification service. Each layer exists to support the layer below it. None of them exist to serve the user.

Remove the server and the entire chain collapses. Not because you solved each problem — because the problems stop existing.

## What replaces them

| Abstraction           | Replacement                               |
| --------------------- | ----------------------------------------- |
| ORM + connection pool | S3 read/write (files)                     |
| Message queue         | CloudFront logs (the log is the queue)    |
| ETL pipeline          | Lambda triggered by S3                    |
| Reporting database    | Athena on the same files                  |
| Backup system         | The architecture is the backup (git + S3) |
| Monitoring            | Route 53 health check + log queries       |
| Load balancer         | CloudFront (built in)                     |
| Job scheduler         | EventBridge + Lambda                      |
| Cache layer           | CloudFront (built in)                     |
| Session store         | JWT in a cookie (stateless)               |

Each replacement is a managed service doing one thing. No abstraction layers between them. No glue code. No framework.

## Four concepts

1. **Files** — the data, the content, the logs, the records
2. **URLs** — the address of every file, the interface between all components
3. **Functions** — Lambda, triggered by events, stateless, ephemeral
4. **CDN** — serves files, handles auth, ingests events, scales globally

That's the whole stack. Everything else is convention on top of these four.

[journey]:
prev: pick-all-three
Listed everything the server model requires and realized it's all dependency chains — each abstraction exists to support the one below it. Remove the root (the server) and the whole tree falls. What's left is four primitives.
