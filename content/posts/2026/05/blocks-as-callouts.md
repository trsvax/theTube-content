---
title: Blocks as Callouts
date: 2026-05-23
tags: [tech]
type: journal
audience: public
status: journaling
coffee: 1
summary: A block isn't just a rendering hint. It's a work assignment. [design]: briefs a designer. [kiro]: briefs Kiro. [claude]: briefs Claude.
workflow: draft
---

`[design]:` already does this. You add the block, a GitHub issue gets created in the design repo, the designer sees it. The block is not just a rendering hint — it's a callout to a specific person to do a specific thing.

The same pattern scales to agents.

## The existing model

Right now blocks are either built-in (handled by `lib/posts.ts`) or plugin-defined (the `blocks.md` registry). Multiple readers can respond to the same block — that's the Plan 9 `bind` model in `blocks.md`. Not a collision, a collaboration. A `[comment]:` block is handled by both the render layer and the comment indexer.

But the readers are tools and services. They're not agents with opinions about design.

## The callout pattern

`[kiro]:` and `[claude]:` are explicit work assignments. You write the block, the named agent sees it on next session and acts on it. The agent updates the block when done — same as `[design]:` gets `src:` filled in when the asset lands.

```markdown
[kiro]:
Generate a spec for the share system design in this post.
specPath: .kiro/specs/share
```

```markdown
[claude]:
Implement the [share]: block renderer in lib/posts.ts.
Look at [design]: for the pattern.
```

The block is the task. The agent is the assignee. The frontmatter is the status.

## Why this matters

Multiple agents can work on the same project without knowing each other exists. The repo is the coordination layer. You write a `[kiro]:` block, Kiro writes a spec. You write a `[claude]:` block, Claude implements it. Neither agent needs to know the other ran. The artifacts — specs, commits, notes — are the handoff.

This is the same reason git notes work for session continuity. Any agent reading the last 10 notes can pick up context. The notes don't know who wrote them or who will read them. The block doesn't know which agent will act on it. The coordination is in the file, not in the agents.

## The question

Are `[kiro]:` and `[claude]:` the right names? They couple the block to the tool. If you switch agents, the blocks read wrong.

The alternative: a `[spec]:` block with a `tool:` field. Or just `[spec]:` and let whichever agent is present handle it. The block describes the work, not the worker.

But there's something useful about explicit routing. `[design]:` works because it names the role — the designer. Not "whoever handles visual assets." The name carries meaning.

Maybe `[ai]:` is the right namespace and the `tool:` field is opt-in routing. Most of the time you don't care which AI picks it up. Sometimes you do.

This is still open.

## The bigger picture

Every block is an API endpoint. `[product]:` could create a Stripe listing. `[event]:` could trigger a calendar entry. `[share]:` logs a capture intent. The post is the API surface, the blocks are the endpoints, the readers are the clients.

The agents are just another class of reader. They read the block, do the work, write back to the file. The file is both the input and the output.

[claude]:
session: 2026-05-23

[journey]:
This came out of the share system discussion — we were talking about how Kiro and Claude could coordinate on the same project without knowing about each other. The git notes are already the coordination layer for sessions. The [kiro]: and [claude]: idea is the same pattern applied to blocks. The open question is whether to name the agent explicitly or use a generic [ai]: block with an optional tool: field. Not resolved yet.
