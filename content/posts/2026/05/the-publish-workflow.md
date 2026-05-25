---
title: The Publish Workflow
date: 2026-05-18
tags: [tech]
type: journal
audience: user
status: vague-thought
coffee: 1
summary: Tried to publish a journal entry and discovered there's no workflow for it. type: journal entries don't show anywhere. Need a spec.
workflow: published
---

Tried to publish "The URL Is the Log Entry" and it didn't show up. Turns out:

1. `type: journal` entries go into `content.json` (build-indexes doesn't exclude them)
2. But `PostList` filters client-side to only show `type === "post" || type === "thought"`
3. So journal entries are built and deployed but invisible

The fix for now: change `type: journal` to `type: post` and `audience: user` to `audience: public`. Manual. Not great.

## What's missing

A publish workflow. How does a post go from idea to visible? The current model:

- Write with `audience: user` (visible only to logged-in users)
- Flip to `audience: public` when ready (visible to everyone)
- But `type: journal` is filtered out by `PostList` regardless of audience

The questions:

- Should `PostList` show journal entries? Or should `/journal` have its own feed?
- Should there be a `journal/content.json` separate from the role-scoped feeds?
- Or should the journal page be a server component that reads at build time (like the about page)?
- What's the lifecycle: `type: journal` → `type: post` when it's polished? Or do journal entries stay as journals and get their own display?

## The real problem

The content model has `type` and `audience` doing different things but they interact in confusing ways. `type` controls display. `audience` controls access. But there's no clear path from "I wrote this" to "people can see this."

Needs a spec. The journal-driven method found the gap by hitting it.

[journey]:
prev: the-url-is-the-log-entry
Tried to publish the logging post. It didn't show up. Discovered that type: journal is invisible because PostList filters it out. The publish workflow doesn't exist — there's no documented path from writing to visible. The methodology found the gap by using it.
