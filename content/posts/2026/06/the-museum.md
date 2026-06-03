---
title: The Museum
date: 2026-06-03
tags: [tech]
type: journal
audience: public
status: journaling
coffee: 1
summary: The repo is the current truth. Git is the museum. Old code in the working tree is an instruction to use it.
workflow: draft
---

## The problem with "keep it for reference"

I just deleted two scripts from a repo. They worked fine. They tested the old auth flow, handled the old publish path. I could have left them — they weren't hurting anything. Still in git if I need them.

But I deleted them because leaving them there is worse than losing them.

## Presence is instruction

Every file in a repo says "use me." Not explicitly — implicitly, by being there. A developer looking for how to publish sees `share-request.sh` and follows it. An AI reading the repo for context picks it up and suggests the old pattern. The file's presence is an instruction, whether you intended it or not.

Comments say "ignore this, it's deprecated." Nobody reads the comments. The file is there. It has a name that describes what it does. It gets used.

## Git is the museum

That's what version control is for. Not the working tree — the log. `git log --all -- scripts/share-request.sh` shows you every version that ever existed. The full history. The context. The commit messages explaining why it changed.

The working tree is the current truth. The thing that works right now. The thing you should use. The thing the AI should read.

Git is the museum. The working tree is the workshop.

## The AI angle

This matters more now than it did five years ago. AI reads your repo. It reads all of it. It doesn't know which files are current and which are "kept for reference." It treats everything with equal weight. An old script sitting next to a new one is a contradiction — and the AI will pick whichever one matches the pattern it's trying to complete.

You can put a comment at the top: `# DEPRECATED — use send-tube instead`. The AI might read it. It might not. But if the file isn't there at all, there's no ambiguity.

A human who was around six months ago remembers the Slack thread: "don't do it that way anymore, we switched to X." The AI wasn't in Slack. It wasn't in the standup. It has no oral history. It has the repo. If the old way is in the repo, the old way is the way.

## The anxiety

"But what if I need it later?"

You won't. And if you do: `git log`, `git show`. The history is immutable. It's safer in git than in the working tree — in the working tree it can be accidentally modified, partially updated, left in a half-broken state. In git it's frozen exactly as it was.

The anxiety is "I might forget this existed." That's what commit messages are for. That's what session notes are for. That's what `git log --oneline --all` is for.

## The rule

If it's not the current way to do something, delete it. If someone needs the old way, they can read the history. The repo is a workshop. Keep it clean. The tools on the bench should be the ones you're using today.

Old code in the working tree isn't documentation. It's a trap.
