---
title: Why This Is Working
date: 2026-05-29
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: chat
summary: I don't lose my train of thought coding the prototype. The chat is the design document. The deleted prototypes are the ones I never had to write.
workflow: draft
---

The old way: have the idea, start coding, hit a syntax error or a dependency issue, and by the time you fix it the original thought is gone. The context switch kills the design. Ten prototypes deleted. No record of why the final one looks the way it does.

This way: the thought stays continuous. Design the API, the escalation model, the multi-cloud routing, the credential elimination — and write a post about it — all in one unbroken stream. The code appears alongside the thinking, not instead of it.

And I have the record of how I got here. The chat is the design document. The journal is the decision log. The session notes are the executive summary. The git history is the implementation. It's all one continuous record from "what if" to working code.

The deleted prototypes are the ones I never had to write.

## What if

Not "please generate." Not "act as a senior architect." Not "use the PRFAQ method." Just: "what if we route through the tube?" "What if the Mac is the gateway?" "What if $HOME has a roommate?"

"What if" is cheap now. A dead end costs a conversation, not a week of coding. Explore the fork, see where it goes — it becomes a prototype or you back up. No deleted code, no wasted sprint. The exploration *is* the process.

That's forks in the road, not prompts to a vending machine.

## Less code

Writing code is not the goal. Writing less code might be.

The AI hype is "write more code faster." The actual lesson: write less code, better placed. The tube Lambda is ~100 lines. `tubeRequest` is 184. The security model is "don't write the security code." The scaling model is "don't write the scaling code." The best code is the code you didn't write — because it can't have your bugs.

The thinking is the work. The code is a side effect.

[journey]:
prev: tube-request
Observation mid-session: I designed a multi-cloud scoped-auth API with passkey escalation, wrote the implementation, wrote two blog posts, and never lost the thread. That doesn't happen when you're fighting the compiler.
