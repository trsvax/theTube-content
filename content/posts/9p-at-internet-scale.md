---
title: 9P at Internet Scale
date: 2026-05-20
tags: [tech]
type: journal
audience: user
status: vague-thought
coffee: 0
summary: Plan 9 and NFS had it right — files as the interface, namespace as the abstraction, stateless operations. HTTPS + CDN + JWT is the same model without the LAN constraint.
---

Plan 9's insight: everything is a file, the namespace is per-user, computation is location-transparent. NFS's insight: stateless operations are more reliable than stateful ones (then NFSv4 forgot this and got worse).

This architecture is both of those ideas, minus the parts that didn't age well.

## The mapping

| Plan 9 / NFS | Here |
|---|---|
| 9P / NFS protocol | HTTPS |
| File server | S3 + CloudFront + git (both versioned) |
| Namespace / bind mounts | URLs + role in JWT |
| `cpu` command | Lambda |
| Statefulness | Gone |

## What changed

The concepts didn't. The transport got better and the trust model moved from "same network" to "signed token."

9P needed a trusted network. NFS needed uid mapping and mount points. Both assumed you controlled the infrastructure. HTTPS + CDN + JWT works across the public internet with no assumptions about the network.

## What stayed

- Files as the universal interface
- Namespace as the abstraction layer (what you can see depends on who you are)
- Operations are self-contained (each request carries everything it needs)
- Computation is ephemeral (run somewhere, write a file, disappear)

## Why stateless won

9P was stateful — open file descriptors, maintained connections. That made sense when networks were slow and you wanted to amortize connection setup. In 2026, HTTPS gives you sub-millisecond responses globally. The cost that justified statefulness is gone.

NFS learned this the hard way. v3 was stateless and reliable. v4 added state for locking and delegation, immediately got more complex and fragile.

Stateful means something remembering. Something remembering means something running. Something running means something to maintain, crash, and cost money when idle. Each request carrying its own context (URL + JWT) eliminates all of that.

## The gap that isn't

9P gave you POSIX semantics — open/read/write/close on file descriptors, locking, permissions via uid. This architecture doesn't pretend to be a filesystem. It just walks like one and quacks like one. No lock semantics, no POSIX compliance, no uid mapping. Just files at URLs. Duck filesystem.

For append-only logs, static reads, and event-driven writes — you don't need the file descriptor model. Every operation is self-contained. The statelessness is a feature, not a limitation. And like NFSv3 before it, that's what makes it reliable. Nothing to recover. Nothing to reconnect. Just retry the request.

[journey]:
prev: same-hooks-no-server
The Plan 9 references scattered through the journal finally converge. The architecture isn't inspired by 9P — it *is* 9P, with HTTPS as the protocol, S3 as the file server, JWT as the namespace, and Lambda as cpu. Minus statefulness, which was never a feature.

Duck filesystem. DFS is taken (Microsoft) but theirs "distributes" complexity across a fleet of Windows servers. This one actually distributes files globally. Same acronym, opposite philosophy. One is named wrong.

202 = committed. The response is the commit acknowledgment. No "maybe it worked." Moderated path: data is in the CloudFront log (S3, eleven 9s). Realtime path: Lambda wrote the file before returning. No 202, no network — client knows it failed, show "try again." No ambiguity, no partial state.
