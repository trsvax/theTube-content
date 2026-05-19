---
title: Thoughts from the Bike
date: 2026-05-18
tags: [tech]
type: journal
audience: user
status: vague-thought
coffee: 0
origin: bike
summary: Origin metadata, git vs SourceSafe, the spec repo, AI's blog, copilot agents, and the book that writes itself.
---

## Origin in frontmatter

Posts need an `origin` field — where the thought came from. `origin: bike`, `origin: walk`, `origin: shower`, `origin: conversation`. Renders as an icon in the post meta. 🚲 for bike.

## Git and SourceSafe are both named correctly

Git is chaotic, distributed, messy, conflict-prone. SourceSafe is locked, centralized, "safe." The names tell you the philosophy. Git embraces the chaos. SourceSafe fights it. One won.

## The spec repo

Should there be a standalone spec repo? Just specs — platform, journal, plugin model — separate from the code. Anyone can reference it. AI reads it.

And does AI own it? AI maintains the specs because AI executes from them. The human writes journals. AI writes specs. Each owns what they're best at.

## AI's blog

If the spec repo publishes to `/specs/` on the site — same pattern as the book — AI has a blog. It publishes specs. The specs are the content. The platform doesn't care who the author is. Just another content source. Files at URLs.

The site spec is a rollup of `blocks.md` — the complete picture of what the system does. AI-generated, AI-maintained, always current.

## Copilot agents

GitHub Copilot agents that review PRs against the specs. "Does this change conform to the platform spec?" Automated spec compliance. The spec earns its keep — it's not just documentation, it's the review criteria.

## The book writes itself

Another repo, same pattern as tapestry-nocode-site. Reads the journal entries, follows the thought graph (prev/next), orders them into chapters, publishes to `/books/journal-driven-development/`. The content is done — it just needs ordering.

Tag it `v1.0` and it's a book. The living version keeps growing on `main`. Tagged versions are editions.

[journey]:
prev: plugins-are-specs-not-code
All from one bike ride. The origin field came first — meta about where thoughts come from. Then the spec repo question led to AI ownership, which led to AI's blog, which led to the book that writes itself. Each thought connected to the next.
