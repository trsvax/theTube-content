---
title: Git Notes as Memory
date: 2026-05-21
tags: [tech]
type: journal
audience: public
coffee: 0
summary: Session context for AI lives in git notes — attached to commits, portable across tools, owned by you. No proprietary memory layer needed.
workflow: draft
---

Every AI coding tool has a memory problem. Copilot stores context in GitHub's servers. Cursor keeps it in app state. ChatGPT locks it in your account. Switch tools and the context is gone. The AI forgets everything.

Git notes fix this.

## What they are

Notes attach metadata to a commit without changing the commit hash. They live in `refs/notes/commits` — a separate ref tree, stored as git objects like everything else. The commit stays the same. The note is an annotation.

```bash
git notes add -m "Session summary: built the events endpoint, verified with curl"
git log --show-notes --notes -10
```

Any AI that can run `git log` picks up where the last one left off. The tool is interchangeable. The context isn't.

## Why nobody uses them

Almost nobody does. GitHub doesn't display them. They don't push by default. No popular workflow mentions them. The tooling assumes commit messages carry all the context.

The objections:

- "Merge conflicts" — only when two people annotate the same commit. Single author, no conflicts. And git has `--strategy=cat_sort_uniq` built in — it concatenates both. The problem is already solved.
- "Push/fetch is non-default" — only matters when collaborators need them. For local AI context, local-only is a feature.

Both are team problems. For a single-author workflow they're irrelevant.

## What goes in them

Session summaries. What was discussed, what was decided, what was built. Not the commit message — that's about the code change. The note is about the work session.

```
Session 2026-05-21:

Key ideas:
- Static JWT for auth: one key pair, claims identify user
- Verified shortcuts hit CloudFront from Mac and phone
- Bookmarklet is cleanest Mac option

Files updated:
- siri-thought-capture.md (added Verified section)
- links.md (added CRISP paper)
```

At the start of the next session: `git log --show-notes -10`. The AI has context. No onboarding, no "let me read the whole repo," no proprietary memory store.

## Why not Jira

The plan should live where the work lives. A Jira board is a projection of what someone thinks is happening. The repo is what's actually happening. When they diverge — and they always diverge — the repo wins.

Put the plan in the repo:
- "What needs to be done" → a markdown file
- "What's in progress" → the branch
- "What's done" → the commit
- "What happened during the work" → git notes

One source of truth. Version-controlled. Diffable. Greppable. No separate tool that's always stale.

## The real question

Why would you store development context outside git? The only reasons:

- Lock-in — your history is their moat
- Habit — built a database because that's what you do
- Cross-repo context — notes are per-repo

The third one is the only legitimate reason, and even that's a dotfile or a notes repo. It doesn't require a cloud service.

## The pattern

The note is a file. The AI is a reader. Same architecture as everything else — files at known locations, tools are interchangeable readers. The context belongs to you because it's in your repo. Switch from Kiro to Cursor to Claude Code to whatever ships next month. The notes are still there.

[journey]:
Conversation about git notes as AI session memory. Realized nobody uses them because the use case didn't exist before AI-assisted development. The objections (merge conflicts, push/fetch) are team problems that don't apply to single-author workflows. Led to: why even have Jira? The plan should live where the work lives.
