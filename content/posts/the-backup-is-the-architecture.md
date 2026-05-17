---
title: The Backup Is the Architecture
date: 2026-05-17
tags: [tt:tech]
type: journal
audience: user
status: vague-thought
summary: There's nothing to back up because nothing is primary in only one place. Git has the source. Logs have the user input. Replay either one and you reconstruct the state.
---

There's nothing to back up.

- Content: git repos on GitHub. Replicated, versioned, full history.
- Built output: regenerable from source. Push to main, wait 30 seconds.
- Logs: S3 with eleven 9s durability. More durable than any backup you'd make.
- Infrastructure config: in the deploy workflow. Code, versioned.

If S3 disappeared tomorrow, push to main and rebuild. The source of truth is git, not S3. S3 is just the serving layer — a cache of the built output.

## The log is the backup of user input

Comments, reactions, bookmarks — all derived from the event log. The log is append-only, immutable (Object Lock), replicated across facilities. Replay the log and you regenerate all derived state.

Git for your content. Logs for user content. Both append-only, both durable, both replayable.

## No backup strategy needed

The backup strategy is: don't lose the log. S3 handles that. If you want belt-and-suspenders, Cross-Region Replication copies to another region. One setting.

There's nothing to back up because the architecture _is_ the backup. Every piece is either in git (replicated by GitHub) or in S3 (replicated by AWS). The system is its own redundancy.

## What about a database?

A database needs backup because it's mutable — you can UPDATE and DELETE, so you need point-in-time recovery. The log is immutable — you can only append. There's nothing to recover from because nothing can be lost or corrupted.

Event sourcing without the event sourcing infrastructure. The backup is free because the architecture makes data loss structurally impossible.

[journey]:
prev: pick-all-three
Realized there's no backup strategy because there's nothing to back up. Git has the source, S3 has the logs, both are replicated. Playing back the logs regenerates all user-generated state. The architecture is the backup.
