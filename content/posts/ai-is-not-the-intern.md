---
title: AI Is Not the Intern
date: 2026-05-21
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: walk
summary: People build guardrails to keep AI from deleting the database. Wrong problem. The architecture should make deletion impossible, not the process around the actor.
---

Everyone's building intern management systems for AI. Approval gates, sandboxed execution, "are you sure?" prompts, diff reviews before every write. The assumption: AI is the intern. It'll break things if you don't watch it.

Wrong model.

## Three actors

- **Intern** — doesn't read the docs, breaks things by ignorance
- **Old guy** — reads the docs, breaks rules by judgment ("just this once")
- **AI** — reads the docs, breaks rules by habit (training data > your instructions)

AI isn't the intern. It reads everything. It doesn't skip the README, doesn't forget the onboarding doc, doesn't skim. But it also doesn't follow the docs reliably — it pattern-matches against how everyone else does it and defaults to that, even when your docs say otherwise.

So it's the old guy with bad habits. Knows the rules. Has its own ideas.

## The wrong fix

If you treat AI as the intern, you add process: review gates, approval workflows, restricted permissions per action. More structure, more friction, less speed. You're managing the actor instead of fixing the system.

The intern isn't going to read the doc that says "don't delete the database." But the solution isn't a bigger doc. The solution is: don't have a database that can be deleted by a single command.

## The right fix

IAM doesn't care who you are — intern, old guy, AI, you. It enforces the same boundaries on everyone. The deploy user can put objects and invalidate the cache. It can't delete the bucket. Doesn't matter who's holding the credentials.

The protection is in the system design:
- Append-only logs — nothing to delete
- Static files in S3 — versioned, recoverable
- Git history — every state is preserved
- IAM roles — scoped to exactly what's needed

You don't need "AI guardrails" if the IAM role can only do what it should do. The permissions are the guardrails. They already exist. They work on everyone equally.

## Architecture over process

People are building AI-specific permission systems when IAM already solves it. Give the AI a scoped role. Done. Same as you'd give a contractor or a CI pipeline. The problem isn't new — it's just a new actor in the same system.

The steering files and AGENTS.md aren't guardrails. They're context — institutional memory so the AI makes better decisions. But when it ignores them (and it will, because training data fights your docs), the architecture catches it. IAM doesn't care about habits. It enforces boundaries regardless.

Trust the system, not the actor. Design so that nothing breaks, no matter who's driving.

[journey]:
Walk thought. Started as "is AI the intern or the old guy?" Landed on: it's the old guy with bad habits — reads everything, follows selectively. The fix isn't more process (intern management). The fix is architecture that can't break regardless of who's acting. IAM, append-only, static files. The system protects itself.
