---
title: The Code Is Disposable
date: 2026-05-17
tags: [tt:tech]
type: journal
audience: public
status: vague-thought
summary: If you have the specs, the docs, and the content model, the code can be regenerated. The journal leads to the code — it's not some random out-of-date doc.
workflow: published
---

If you deleted all the code from this repo and kept everything else — the platform spec, the journal spec, the docs, the skills, the content files, the deploy workflow — a working version could be rebuilt. Not identical, but functionally equivalent. Same output, same structure, same behavior.

That's the proof that the journal-driven method works. The journal leads to the spec. The spec leads to the code. The chain is live — not a random out-of-date doc sitting next to code that diverged six months ago.

## Why it stays current

Docs go stale because they're written separately from the work. The journal can't go stale because it _is_ the work. You can't build something without writing about it first. The spec can't go stale because AI reads it before every implementation. If the spec is wrong, the code is wrong, and you notice immediately.

The feedback loop keeps everything honest. Stale docs happen when there's no consequence for drift. Here, drift breaks the build.

## The real assets

The journal is the source of truth for intent — why things exist, what was tried, what failed.
The spec is the source of truth for implementation — what to build, how it connects, what the constraints are.
The code is just one possible implementation of both. Disposable. Regenerable.

## What this means

You don't need to read the code to understand the system. You read the spec. You don't need to read the spec to understand the thinking. You read the journal. The code is the least important artifact in the repo.

## The spec is the source code

Compilers didn't generate the same binary run to run either — different optimization passes, different register allocation, different link order. Same source, different object code. Nobody cared because the behavior was the same.

AI-generated code is the same deal. Different variable names, different approach to the same problem, but same behavior. The spec defines the behavior. The implementation is just one possible compilation of it.

The spec is the source code. The code is the object code.

People didn't trust compilers either. Wrote assembly by hand because they couldn't verify the output. Where are they now? The ones who let go shipped faster. The ones who held on are maintaining legacy systems nobody else can read. Same thing is happening with AI-generated code right now.

## C was the beginning of the end

C was "portable assembly" — close enough to the machine that the asm holdouts could accept it, but abstract enough that you didn't need to rewrite for every architecture. Unix was written in C to prove you could write an OS without assembly. That was the argument that won.

AI-generated code is "portable spec." Close enough to what a developer would write that the holdouts can read it, but abstract enough that you don't need to write it yourself. The spec is the new C. The code is the new assembly.

## C turned out to be dangerous too

Buffer overflows, use-after-free, the entire class of memory safety bugs. C gave you enough rope to hang yourself. The tradeoff for "close to the machine" was "the machine will let you corrupt everything."

The equivalent danger with AI-generated code: code that works but nobody understands _why_ it works. When it breaks, you can't debug it because the reasoning isn't in the code — it's in the spec and the journal. If those are missing or stale, you're in the same position as a C program with no comments and a buffer overflow somewhere.

The journal is the memory safety of AI development — the thing that prevents "works but nobody knows why" from becoming the default state.

[journey]:
prev: you-cant-argue-with-the-second-law
Came from asking: if the code was deleted, could it be rebuilt? The answer is yes — from the specs and docs alone. That proves the journal-to-spec-to-code chain is live, not decorative. The journal leads to the code. It's not documentation after the fact.

The compiler parallel emerged naturally. Non-reproducible builds were normal for decades — same source, different binary, nobody cared because the behavior was the same. AI-generated code is the same deal. The spec is the source code, the code is the object code.

C was the beginning of the end for assembly. AI-generated code is the beginning of the end for hand-written code. Both had the same trust problem — people didn't believe the output until they had no choice. Compiler bugs were real, people did hit them, and the answer wasn't "go back to assembly." It was better compilers. Same thing will happen here — better specs, better context, better feedback loops. The journal is part of that answer.

Side note: "bug" predates "compiler" by 70 years — Edison used it in 1878, Hopper coined "compiler" in 1952. Bugs existed before the tools that were supposed to prevent them. Same pattern with AI hallucinations.
