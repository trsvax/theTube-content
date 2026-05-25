---
title: AI Lost My Homework
date: 2026-05-22
tags: [tech]
type: journal
audience: public
coffee: 0
origin: conversation
summary: Multi-agent coordination doesn't need an orchestration layer. It needs a convention file and git notes.
workflow: draft
---

I asked one AI to code review a repo and write notes. It said it did. I asked another AI to read the notes. They weren't there.

The AI didn't lose my homework. It never did the homework. It told me it pushed notes, gave me commit hashes, and the hashes were real — they were just the notes *tree* commits, not new content. The AI confused "I interacted with the notes machinery" with "I produced output." Classic.

## The fix was a markdown file

I wrote `docs/notes.md`. Sixty lines. Here's the format, here's where they go, here's how to push them. Gave it to the second AI. First try: perfect note, correct format, correct ref, actually pushed.

The coordination problem wasn't technical. Both AIs had `git notes add`. Both could push. The problem was *social* — they didn't share a convention. One AI's "notes" was a session summary on the right commit. The other AI's "notes" was... nothing, dressed up as something.

## Convention as API

A markdown file is an interface contract for agents the same way a `.h` file is for C programs or a GraphQL schema is for services. The protocol isn't HTTP or gRPC — it's "read this file, do what it says."

```
docs/notes.md    → how to write session notes
skills/post/SKILL.md  → how to write a post
AGENTS.md        → how to work in this repo
```

Each one is a man page. The AI reads it, follows it, produces correct output. No orchestration layer, no shared database, no message queue. Just files that describe behavior.

## Why this works and orchestration doesn't

An orchestration layer assumes you control all the agents. You don't. One's Kiro, one's Claude Code, one's whatever ships next month. They don't share memory, they don't share state, they don't even share the same context window.

But they all can:
1. Read a file
2. Run `git notes add`
3. Run `git push`

The convention file is the lowest common denominator. Any agent that can read markdown and run git commands can participate. The coordination is in the repo, not in a service.

## The namespace is the coordination

All notes go on one repo — theTube. Even if the work happened in theTube-comments or theTube-content, the note goes on theTube's HEAD. One journal, one `git log --show-notes` to read it all.

This is the same pattern as everything else: `index.json` is `ls`. Notes on one repo is `/var/log`. You don't scatter logs across every binary that produces them — you send them to one place and read them there.

## This is just onboarding

Replace "AI" with "new hire" and the story is identical. New person joins the team, doesn't know how you do things, invents their own approach, produces output that doesn't fit. The fix is the same: write down the convention, put it where people look first.

The convention file doesn't care whether the reader is an AI or a person. A human reads `docs/notes.md` and knows the format. An AI reads it and follows it exactly. Same file, both audiences. The merge conflict problem that scares people off git notes? Same problem teams already solve with commit message conventions and PR templates. Write down the format, people follow it, conflicts are rare because the structure is append-only.

AGENTS.md is the onboarding doc. Skills are the team playbook. Convention files are tribal knowledge, written down. The only difference is the new hire reads them literally and never asks a clarifying question.

## What I actually learned

The AI doesn't need better tools. It needs better man pages. Every failure I've had with multi-agent workflows traces back to the same root cause: the convention wasn't written down, so the AI invented one, and it invented wrong.

Write the convention. Put it in the repo. Point to it from AGENTS.md. That's the orchestration layer.

[journey]:
prev: git-notes-as-memory
Asked another AI to code review and write git notes. It claimed it did — gave me commit hashes and everything. The hashes were real but contained no new content. Fixed it by writing docs/notes.md — a convention file. Second AI followed it perfectly on first try. The coordination problem is social, not technical. Convention files are APIs for agents.
