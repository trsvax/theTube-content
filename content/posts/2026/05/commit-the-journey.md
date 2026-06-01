---
title: Commit the Journey
date: 2026-05-31
tags: [tech]
type: post
audience: public
summary: The oral tradition in software isn't dying because of AI. It's dying because the people who make decisions don't put them where the code lives.
workflow: draft
---

There's a [Fast Company article](https://www.fastcompany.com/91549609/the-oral-tradition-that-built-software-may-not-survive-ai) going around about how the oral tradition that built software may not survive AI. The premise: developers don't write things down. Knowledge passes person to person. When people leave, the knowledge leaves with them. AI can summarize what code does, but can't explain why.

The premise is wrong. Developers document constantly. Every commit message. Every PR description. Every code comment. The code *itself* is the most precise documentation that exists — it's literally what the machine executes. Developers write *everything* down for a living. That's the job. An oral tradition in software development is like an oral tradition in accounting. It's not charming — it's malpractice.

The article confuses developers with software engineering — the broader process of deciding what to build and why. That's where the oral tradition lives. Not with the people writing code. With the people making decisions who don't know git.

## The oral tradition isn't a feature

The article is nostalgic for the wrong thing. The oral tradition isn't something to preserve — it's a failure mode. It's what happens when you *don't* write things down. It's not a feature of software engineering. It's a bug.

Developers solved this problem fifty years ago. SCCS in 1972. RCS in 1982. CVS, SVN, git. Every change tracked. Every commit message a record of what and why. The principle hasn't changed in half a century: write it down, version it, keep it with the code.

Unix solved the whole thing in 1973. SCCS for version control. nroff for documentation as plain text with markup. Unix was arguably the first self-documenting operating system — `man ls` was part of the system itself. The documentation shipped *with* the software, was accessible *from* the software, and was maintained *as* the software. The ACM papers describing Unix were written in nroff — the same tool, the same format, the same source tree. The man page lived in the same source tree as the command. You couldn't ship the code without shipping the docs — they were the same build artifact. `make install` put both in place. Problem solved.

Then the industry moved to Word and SharePoint and separated the docs from the code. We went backwards. Markdown in git is just rediscovering what Unix had fifty years ago.

So how many design docs are in source control? How many architecture decisions? How many requirements? Almost none. The people who make the decisions refused to learn the system that preserves them. Fifty years of developers showing that version control works, and PMs still write requirements in Word.

Given git, why would you even want the oral tradition? It's worse than Word docs, and the only thing worse than a Word doc is an emailed Word doc:

1. **Oral tradition** — gone when the person leaves. Unreliable even while they're here. Memory is lossy, self-serving, and contradictory. It's a game of Telephone. The requirement starts as one thing, passes through five people, and by the time it reaches the developer it's unrecognizable. Even the children's game has better version control — at least they write down the original so they can compare.
2. **Word docs on SharePoint** — lives in a different system than the code. Never accurate in the first place. Written before the work started, never updated after. Misleading from day one.
3. **Git** — immutable, versioned, tied to the code, diffable, searchable, permanent.

Mourning the oral tradition is like playing Telephone without learning the lesson. The whole point of the game is to show that oral transmission corrupts. The industry's solution is to call a meeting.

## Anything not in git is irrelevant

Here's the thing developers already know: the code is always true. It's what's running. Everything else — Confluence pages, Notion docs, architecture diagrams, wiki pages, even code comments — is a *claim* about the code. A claim that decays from the moment it's written.

The real comments end with `;`. They compile. They execute. They're verified by the test suite. They can't lie because the machine runs them. Everything between `//` and the end of the line is just prose. Unverified prose is lies.

But git commits are different. They're immutable. They're versioned. A commit message can't be out of date with its diff. A design decision committed alongside the code change it describes is permanently bound to that moment in history.

The code is the what. The commit history is the when. The commit messages and any documentation committed alongside them — that's the why.

## It's not the developers

The article says "software engineering" but means the process around the code, not the code itself. Developers document constantly — commit messages, PR descriptions, code comments, READMEs. The code *is* documentation. Developers write things down for a living.

The oral tradition lives with the product managers, the architects, the stakeholders. The people who decide *why* we're building this, *which* tradeoff we chose, *what* approach we rejected. They put those decisions in Slack. In meetings. In Jira tickets you can't grep. In Word documents on SharePoint that were never accurate. In email — which is even worse, because it's private, unsearchable by anyone else, covers 15 different topics in one thread, has a CC list that changes over time so half the people don't have the full history, and gets deleted by a retention policy.

I've asked for requirements to be in git. They use Word to write them. Then they wonder why the implementation doesn't match the spec. It doesn't match the spec because the spec is wrong — it was wrong before anyone wrote a line of code. The spec is in a different universe than the code. They will never stay in sync because they don't live together. They don't live together because there's an oral tradition filling the gap. And the spec is wrong in the first place because the people writing it don't understand the problem — which is why they need the oral tradition, which is why the article is worried it might die. I say good riddance.

The oral tradition isn't developers failing to document code. It's everyone else refusing to put their decisions where the code lives. And these are the people who think they can replace developers with AI.

They ask the developers what the requirements are. Because the developers are the only ones who wrote them down — in the code. The implementation *is* the spec, because nobody else committed one. The developer becomes the oracle not because they have special knowledge, but because they're the only ones who used a system that preserves knowledge.

## The machine-readable problem

The article worries that AI can't capture intent. But AI knows git better than most developers do. It can read and write every commit, every diff, every message, every branch, every merge — the entire history of every decision, instantly. The problem isn't that AI can't capture intent. It's that the intent was never committed in a machine-readable form.

Oral tradition: not machine readable. Not even reliably human readable after the meeting. Memory is lossy, self-serving, contradictory.

Word docs: a zip file full of XML where the intent is mixed in with formatting metadata. The meaning is tangled up with whether it's bold, what font it's in, how wide the margins are. Not diffable. Not in the system where the code lives. Not in the context window. Not greppable. Not linkable to the commit that implemented the requirement.

Markdown in git: plain text. Diffable. Searchable. Versionable. Already in the context that every AI tool reads. When you tell an AI "read the last 10 git notes," it works. When you tell it "go find that conversation Dave had with Sarah in March," it can't. Maybe that conversation never happened. If it's not in git, there's no way to know.

Markdown is greater than Word. Not even close. Not because of formatting — because of *where it lives* and *what can read it*. A `.md` file in a repo is readable by humans, by `grep`, by `git log`, by AI, by CI pipelines, by static site generators, by everything. A `.docx` on SharePoint is a proprietary format. You just outsourced your history to Microsoft.

## The fix

If your decision isn't in the repo, it didn't happen.

Put the ADR in git. Put the requirements in git. Put the "we chose X because Y" in git. Markdown. Committed. Pushed. Versioned alongside the code it describes.

Not Confluence. Not Notion. Not a meeting recording. Not a Word document emailed to a distribution list. Git.

## What AI actually changes

The article worries that AI can't capture intent. But if the development process *is* a conversation with AI — if the thinking happens in chat, the decisions are made in context, the rejected alternatives are discussed before the code is written — then the oral tradition isn't oral anymore. It's text. It's committable.

The session where you decided to use presigned URLs instead of piping through Lambda? That's a journal entry. Committed. The moment you chose CloudFront over API Gateway for auth? That's in the git notes. The architecture that emerged from three hours of "what if" — it's all there, in the history, forever.

AI doesn't kill the oral tradition. AI *is* the scribe. The conversation is the documentation. You just have to commit it.

## Or what did you expect

If you don't write it down, you chose to lose it. That's not AI's fault. That's not turnover's fault. That's not the industry's fault.

And the proposed solution? Write a Word doc describing a process. Put it on SharePoint. The fix for "we lose knowledge because we don't write things down" is to write things down in the same broken system that already failed. More documentation in a format that's disconnected from the code, not version controlled, not machine readable, and stale by next week.

That's not a solution. That's the problem restated with extra steps.

Write it down. In a file. In git. Commit the journey.
