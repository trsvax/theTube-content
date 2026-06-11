---
title: Journals and Novels
date: 2026-06-05
tags: [tech]
type: journal
audience: public
status: journaling
coffee: 1
summary: A journal is append-only. A novel is mutable. The distinction is whether you're recording or constructing.
workflow: draft
---

## The confusion

I kept getting stuck on coherence. The fileProvider project needs to read as a coherent thing — chapters building on each other, earlier ones revised when later ones change the picture. But the journal entries about *building* it don't need that. They're just timestamps. Records of a moment.

The thing being built needs coherence. The log of building it does not.

## Two forms

A **journal** is append-only. You write today's entry, you publish it, you never touch it again. It's a record of that moment. Editing it later would be dishonest — it's a timestamp, not a claim. The value is in the accumulation.

A **novel** is mutable. You write chapter by chapter, but you go back. If chapter 5 contradicts chapter 2, you fix chapter 2. The whole thing needs to read as a coherent whole at HEAD. A reader picking it up shouldn't hit contradictions you already resolved.

Journals are git logs — history is sacred. Novels are the working tree — the current state is what matters.

## The mapping

A novel is a software project. Same shape:

- Written iteratively, chapter by chapter
- Earlier chapters get refactored when you learn something later
- The whole thing is coherent at HEAD
- It has a goal — a working system, a complete narrative
- Git history captures the *process*, the working tree is the *product*
- Never truly "done" but it can be "released"

You'd never rebase a journal. But you absolutely rebase a novel — squash the false starts, reorder the discoveries into a teaching sequence, make it read like you knew where you were going all along.

## In practice

Some repos are journals, some are novels:

**Novels** — coherent, mutable, sequential:
- `tapestry-nocode` — book chapters
- `theTube-fileProvider` — project chapters
- `theTube` itself — the platform (kept coherent at HEAD)

**Journals** — append-only, timestamped:
- Journal entries (like this one)
- Session notes
- CloudFront logs (the ultimate journal — pure event stream)

A project can have both. The novel is the coherent artifact. The journal is the trail of breadcrumbs you left while building it. One is the product, the other is the process.
