---
title: GitHub as CMS
date: 2026-05-20
tags: [tech]
type: journal
audience: user
status: qed
coffee: 0
summary: A custom GUI that commits to the repo. GitHub is the backend. No CMS server, no database. The WordPress experience without WordPress.
---

Could this platform have a WordPress-like editing GUI? Yes. Here's the proof.

## The mechanism

A GitHub App authenticates via OAuth and uses the Contents API to read/write files. A web app on top of that:

1. Lists posts — reads `content/posts/` via API
2. Edits them — markdown editor, commits on save
3. Creates new ones — fills in frontmatter template, commits
4. Push triggers deploy — the pipeline already exists

The GUI is a frontend to git commits. GitHub is the CMS backend. No database, no server process, no monthly cost.

## Why it works

- The content is already markdown files with structured frontmatter
- The deploy pipeline already triggers on push
- GitHub's API is free at this scale
- The app itself is a static site (could live on theTube)
- Auth is OAuth — GitHub handles it

## What it would know

A custom GUI could understand the schema: frontmatter fields, block types, journal format, journey logs. It's not a generic markdown editor — it knows what a post looks like here. Autocomplete tags, suggest prev links, validate status values.

## Why not build it

Don't need to. The proof is complete. The architecture supports it without changes. If the editing experience ever becomes a bottleneck, the path is clear. Until then, git + AI + chat works fine.

[journey]:
QED. The architecture supports a WordPress-like GUI without any changes. GitHub App + Contents API + static frontend = CMS with no backend. The implementation is optional because the proof is sufficient.
