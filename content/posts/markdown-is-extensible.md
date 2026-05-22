---
title: Markdown Is Extensible
date: 2026-05-16
tags: [tech]
type: draft
summary: The [] callout notation is already a content protocol. The post declares slots. Other sources fill them. You don't have to implement all the slots upfront — empty ones are invisible.
workflow: published
---

The `[design]:` block is a slot. The author declares it, a designer fills it with an image. The post doesn't care when the image arrives or who put it there. The slot is the contract.

`[journey]:` is the same pattern — the author fills their own slot. The mechanism is identical.

That means the `[]` notation is already a content protocol. Any named slot can be filled by whoever has write access to the right path:

- `[journey]:` — the author's making-of notes
- `[design]:` — artwork from a designer
- `[comments]:` — reader responses fetched from GitHub Discussions
- `[corrections]:` — edits from an editor
- `[translation]:` — a contributor's translation
- `[context]:` — a curator linking related posts

The post defines what belongs here. Other people or systems fulfill the contract independently.

The good part: you don't have to implement all of this upfront. Empty slots are invisible. Add `[comments]:` to a post today and nothing breaks — there's just nothing there yet. Build the comments fetcher when you're ready. The slot waits.

Features arrive when the slot gets filled, not when the post gets written.
