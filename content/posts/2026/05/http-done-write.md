---
title: HTTP Done Write
date: 2026-05-29
tags: [tech]
type: journal
audience: public
status: journaling
coffee: 1
origin: chat
summary: What's the difference between McDonald's and the dry cleaners? McDonald's is a thread pool. The dry cleaner is an event queue.
workflow: draft
---

## McDonald's

You wait. You're at the drive thru until the burger is ready. Most APIs work this way — send a request, block, wait for the response. Even when the work takes 10 seconds and you could be doing something else.

Scales by adding more workers behind the counter. More throughput, same latency. You're still waiting.

McDonald's is a thread pool.

## The dry cleaner

You drop off. Get a ticket. Come back later.

The person at the register doesn't clean clothes. Doesn't know how to clean clothes. Doesn't care. They take your stuff, give you a ticket, put it in the back.

The actual cleaning happens in the back, on someone else's schedule, by someone who never talks to customers.

Your stuff ends up on that rack thing, in a slot matched to the ticket number. You come back, hand them the ticket, they go to the slot, pull your stuff. The ticket *is* the address of your result.

Scales by adding another register. The register is instant — take the stuff, give a ticket. The bottleneck is never the register. It's always the back. And the back scales independently because it's decoupled from the customer.

The dry cleaner is an event queue.

## The security model

"This ticket is not from here." Wrong signature. Rejected.

"It's 3 years old." Expired. Rejected.

"We gave your stuff to Goodwill." Unclaimed too long. Gone.

No auth code. It's just how dry cleaners work.

## HTTP done write

HTTP already has both models. 200 is McDonald's — here's your burger. 202 is the dry cleaner — noted, come back later. Most APIs only use 200.

The [tube](/posts/tube-request) uses 202.

[journey]:
prev: tube-request
Came out of a walk. The tube is a dry cleaner. Most APIs are McDonald's. The difference is whether you make the customer wait while you cook.
