---
title: Time Travel via Tags
date: 2026-05-18
tags: [tech]
type: journal
audience: user
status: vague-thought
coffee: 0
summary: Branch per journal entry, tag on merge. Every shipped feature has a snapshot. Click a journal entry, see the site as it was when that feature landed.
workflow: published
---

Branch per journal entry. Tag on merge. The git workflow maps to the journal lifecycle:

- `journaling` → branch exists, deployed to your per-user namespace. You see it live. Nobody else does.
- `shipped` → merged to main, tagged, snapshot deployed to `s3://bucket/tags/<tag>/`. Permanent.

## Time travel

Every shipped journal entry has a tag. Every tag has a deployed snapshot. The journal index becomes a timeline. Click any shipped entry → see the site as it was when that feature landed.

Not every commit. Just the intentional moments — the ones you chose to mark by shipping a journal entry.

## The tester handoff

Assign a tester to your branch: update their JWT claim (or a config file) to point at your branch prefix. They see your work at the same URL. No staging link to share. No subdomain. Just identity → namespace.

When testing is done, remove the assignment. They see main again.

## Multiple people, same URL

Each person's JWT determines what they see. Person A sees their branch. Person B sees theirs. The tester sees whoever's branch they're assigned to. Everyone else sees main. One URL. Per-user namespaces. Plan 9.

[journey]:
prev: one-url-per-branch
next: per-user-namespaces
The one-url-per-branch post used subdomains. This sharpens it: no subdomains needed. Per-user namespaces via JWT. Branch per journal, tag on merge. The site becomes a time machine through its own history.
