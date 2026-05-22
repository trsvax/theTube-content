---
title: Kernighan Called Me
date: 2026-05-20
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
summary: I emailed him a CRISP compiler bug. He picked up the phone. That's Bell Labs culture — the person who wrote it is the person who fixes it.
workflow: published
---

I was building a workstation around the AT&T CRISP chip. Writing software for it — OS bring-up, getting the toolchain working on custom hardware. Hit a compiler bug. The kind you only find when you're the first person running real code on a new machine.

Emailed Brian Kernighan. He called me.

No ticket. No support tier. No "we'll get back to you in 3-5 business days." The person who wrote the compiler picked up the phone and talked through the bug with the person who found it.

I didn't switch to assembly. The compiler should work. That's the contract. You write C, it produces correct machine code. If it doesn't, that's a bug in the tool, not a signal to drop down a layer.

Same principle applies everywhere. If the CDN can serve files, make it serve files. If the schema can drive the form, make it drive the form. Don't work around broken tools — fix them or report them to the person who can.

[journey]:
The Kernighan story. Building a CRISP workstation, hit a compiler bug, emailed him directly, he called. Bell Labs culture: no indirection between the problem and the fix. The instinct carries forward — don't work around broken abstractions, fix them at the source.
