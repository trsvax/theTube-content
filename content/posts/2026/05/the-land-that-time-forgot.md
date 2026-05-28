---
title: The Land That Time Forgot
date: 2026-05-28
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: chat
summary: The PC made us forget multi-user computing. Now AI is dragging us back — and we've lost the tools.
workflow: published
---

The PC was a single-user machine. One person, one keyboard, no network. Why would you need per-process namespaces? Why would you need file permissions? Why would you need a protocol for remote resources? Only you, naked on your own island. As far as you can see, everything is yours.

That assumption baked into DOS, then Windows. macOS evolved — it put BSD underneath, real multi-user, real permissions — but the GUI layer kept the single-user illusion alive. The whole industry optimized for one human, one machine, everything accessible. Multi-user was a server thing. An enterprise thing. Not a personal computer thing.

Multics had rings of protection, per-process access control, hardware-enforced memory segments. All in the 1960s. It was "too complex" so they built Unix as the simple version — and then spent 50 years adding the complexity back. A friend of mine used Multics in college. That system already solved the problem we're rediscovering.

Then the internet showed up and wanted to run code on my machine. The browser built a sandbox — same-origin policy, CORS, CSP — because they didn't use the OS. An operating system inside the application. But the sandbox only works inside the browser.

Safari is 36MB. The macOS kernel is 17MB. The sandbox is bigger than the thing it's sandboxing. Greenspun's Tenth Rule: any sufficiently complicated application contains an ad hoc, informally-specified, bug-ridden, slow implementation of twice an operating system. JavaScript. The kernel's permission model has been hardened for 50 years. The browser's sandbox gets a new CVE every week.

Now AI shows up looking friendly and suddenly there is another actor on the same machine. You and the agent. You and the agent. The PC is multi-user for the first time since timesharing. And we're building browser 2.0 — another ad hoc, bug-ridden reimplementation of what the kernel already does. Hooks, approval gates, tool restrictions. Less spec'd than JavaScript. Another 36MB of reimplemented `chroot`. The solution was in the 17MB kernel the whole time.

## The protocols

Six AI agent protocols in 2026. MCP, A2A, ACP, AG-UI, UCP, AuthMD. Each one solving: how does an agent discover what's available, authenticate, and exchange data.

Which is `ls`, `grep`, `chmod`, and `read`/`write`.

Plan 9 had one protocol for all of this. 9P. Fourteen messages. Every resource in the system — network, devices, processes, remote machines — spoke those fourteen messages. One interface. Everything composes.

The industry is reinventing mount points, one acronym at a time.

## The filesystem was the equalizer

In Plan 9, `/net` was the network stack. `/proc` was running processes. `/mnt/remote` was another machine's files. All in the same namespace, all browsable the same way. The filesystem was the world. You could `ls -R /net/foo` and see the network the same way you see your disk.

Finder made it "Documents, Downloads, Desktop." The network became a separate thing you access through apps. The remote machine became SSH or a web browser. The filesystem stopped being the universal namespace and became just the local storage layer. `ls` used to show you the world. Now it shows you your disk.

Anyone could `ls`. Anyone could `grep`. The data was right there, in a format humans and programs could both read. No special client, no SDK, no API key dance. Just files.

The protocol proliferation creates a priesthood. The AI is the priest — it intercedes between you and your data. You ask it questions because you can't look yourself. That's not augmentation. That's dependency. That leads to dystopia.

And it's not accidental. Everyone wants in the data flow. MCP servers, API gateways, OAuth providers, SaaS dashboards — they exist in the path because being in the path is where the money is. A file on disk doesn't have a billing meter. A mounted filesystem doesn't report usage. The protocol complexity isn't a design failure — it's a business model. Every intermediary is a toll booth.

The filesystem is the enemy of rent-seeking.

## What we lost

9P gave each process its own namespace. You could `bind` different servers to the same path per-process. Process A sees `/net` as the real network. Process B sees `/net` as a filtered proxy. Same path, different backing, per-process. The kernel enforced the boundary.

macOS has Unix underneath — BSD, proper multi-user, file permissions, the whole thing. But the GUI layer pretends it's not there. It was trying to namespace you away from the system. "You don't need to see `/usr/bin`. Here's your Documents folder. Stay in your lane." The namespace was: user stuff here, system stuff hidden.

But the problem that needed namespacing changed. It's no longer "protect the system from the user." It's "protect the user from the agent." The namespace boundary moved — from system/user to user/AI — and the OS didn't follow.

You need both directions at every layer:

- System ↔ User (SIP protects system from user, Finder protects user from system complexity)
- User ↔ AI (nothing protects user from AI, nothing protects AI from user interference)

The first pair exists. The second pair doesn't. The OS already has the primitives — users, groups, capabilities, sandboxes. Nobody's using them for AI. The AI agent should be `_ai` with its own uid. You grant it access to specific paths. `chmod` is the policy engine.

Instead we get hooks, approval dialogs, and "are you sure?" prompts. Reimplementing `sudo` in userspace, badly. Do you trust the app to sandbox itself?

## The workaround

WebDAV. Might be more elegant than 9P — it's stateless, and it works over the infrastructure that already exists. Mount a synthetic filesystem — computed on read, routed on write. The client doesn't know what's behind the path — and it never did. Every `read()` is a function call. "Static" just means the function is so well-hidden you forgot it's there.

The main difference is state. 9P keeps it on the server — file handles, position, walk context. WebDAV is stateless. Every request is self-contained. And stateless is what you want when the server is a CDN, the client might disappear, and the whole thing needs to scale without coordination. State is the enemy of resilience. Server crashes? 9P connections are gone. WebDAV? Client just retries.

The server is the boundary. It does what I tell it. I control what each path exposes. Different entry points, different views. Same data, scoped by who's asking. Not per-process like 9P, but per-key — which maps better to the network world.

## The real problem

AI runs outside the browser sandbox — in the terminal, in the IDE, as a shell process. Back to raw OS permissions. Which are just "you."

The progression:

1. **PC** — one user, everything accessible, no problem
2. **Browser** — untrusted code arrives, OS can't help, app builds its own sandbox
3. **AI** — untrusted code arrives, runs outside the app sandbox, OS still can't help

The browser proved the OS permission model was insufficient. But instead of fixing the OS, we fixed the app. Now AI sidesteps the app and we're back to the original problem. The OS only knows "you."

Until the tools people figure out AI is just another user — not a feature of your IDE, not an extension of your shell, but a separate process with a separate identity — we're stuck. The server is your `chmod`. The mount point is your namespace.

I don't need a wall. I just want a door. And the keys to it.

The problem was solved in 1971. In the 1960s if you count Multics. We just forgot. The dinosaurs are still alive in the valley. We just stopped visiting.

We should demand our filesystem back.

[journey]:
prev: the-share-system
Written in one chat session. Started from "why are there six AI protocols when `ls` exists?" and followed the thread: 9P vs WebDAV, stateful vs stateless, Finder hiding the namespace, the browser as the first sandbox, AI running outside it. The git history of this file is the editing process — every word choice revision is a commit. The journey is in `git log`.
