---
title: The Eight-Inch Hose
date: 2026-05-21
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: conversation
summary: The B-58 ground cooling spec said 8 inches. Nobody knew why. The number was made up, but the difficulty was real.
---

My grandfather was a rocket scientist. He told me this story about the B-58 Hustler — the first operational supersonic bomber.

The spec said the ground cooling hose had to be 8 inches in diameter. This was apparently very difficult to engineer. People struggled with it. Meetings were held. Solutions were proposed and rejected. The 8-inch constraint drove real complexity into the design.

The problem: nobody had actually calculated that it needed to be 8 inches. Someone wrote it down early in the process and it became the requirement. The number was made up. The difficulty was real.

## The pattern

A number appears in a spec. It looks precise. It has the weight of authority — it's in the document, so someone must have derived it. Engineers work around it, design to it, suffer for it. Nobody asks where it came from because asking implies you haven't read the spec.

The constraint was never validated. It was just written down first.

## In software

- "The API timeout should be 30 seconds." Why 30? Someone typed it.
- "We need 99.99% uptime." Why four nines? Because three felt low and five felt expensive.
- "The page must load in under 2 seconds." Based on what? A blog post from 2012.
- "Story points use Fibonacci." Why? Because someone's Scrum book said so.

Half the constraints in any spec are eight-inch hoses. They feel precise. They drive real engineering effort. And nobody remembers who wrote them down or why.

## The fix

Journal-driven development. The conversation that just happened with the uptime post — we started with "how hard to run on Azure?" and ended up discovering that `/fastcreate` shouldn't exist. The spec had two endpoints because someone wrote it down early. The journal caught it before any code existed.

Ask: "what happens if this number is wrong?" If the answer is "we'd have to redo a lot of work," then validate the number before building to it. If nobody can explain where it came from, it's probably made up.

The B-58 didn't need an 8-inch hose. It needed adequate cooling. The diameter should have been derived from the thermal load, not invented in a meeting. And `/fastcreate` didn't need to be a separate endpoint. It needed a way to prioritize writes. The journal found that. The spec alone wouldn't have.

[journey]:
Conversation. Grandfather's story about the B-58 Hustler ground cooling spec. The 8-inch hose requirement was made up but drove real engineering difficulty. Same pattern in software — arbitrary numbers in specs that nobody questions because they look precise.
