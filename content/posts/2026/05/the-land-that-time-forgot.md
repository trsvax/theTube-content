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
workflow: draft
---

The PC was a single-user machine. One person, one keyboard, no network. Why would you need per-process namespaces? Why would you need file permissions? Why would you need a protocol for remote resources? Only you, naked on your own island. As far as you can see, everything is yours.

That assumption baked into DOS, then Windows, then macOS. The whole industry optimized for one human, one machine, everything accessible. Multi-user was a server thing. An enterprise thing. Not a personal computer thing.

Now AI shows up and suddenly there are two actors on the same machine. You and the agent. The PC is multi-user for the first time since timesharing.

## The protocols

Six AI agent protocols in 2026. MCP, A2A, ACP, AG-UI, UCP, AuthMD. Each one solving: how does an agent discover what's available, authenticate, and exchange data.

Which is `ls`, `chmod`, and `read`/`write`.

Plan 9 had one protocol for all of this. 9P. Fourteen messages. Every resource in the system — network, devices, processes, remote machines — spoke those fourteen messages. One interface. Everything composes.

The industry is reinventing mount points, one acronym at a time.

## The filesystem was the equalizer

In Plan 9, `/net` was the network stack. `/proc` was running processes. `/mnt/remote` was another machine's files. All in the same namespace, all browsable the same way. The filesystem was the world.

Finder made it "Documents, Downloads, Desktop." The network became a separate thing you access through apps. The remote machine became SSH or a web browser. The filesystem stopped being the universal namespace and became just the local storage layer. `ls` used to show you the world. Now it shows you your disk.

Anyone could `ls`. Anyone could `grep`. The data was right there, in a format humans and programs could both read. No special client, no SDK, no API key dance. Just files.

The protocol proliferation creates a priesthood. The AI is the priest — it intercedes between you and your data. You ask it questions because you can't look yourself. That's not augmentation. That's dependency.

## What we lost

9P gave each process its own namespace. You could `bind` different servers to the same path per-process. Process A sees `/net` as the real network. Process B sees `/net` as a filtered proxy. Same path, different backing, per-process. The kernel enforced the boundary.

The OS already has the primitives — users, groups, capabilities, sandboxes. Nobody's using them for AI. The AI agent should be `_ai` with its own uid, its own home directory, its own permission set. You grant it access to specific paths. `chmod` is the policy engine.

Instead we get hooks, approval dialogs, and "are you sure?" prompts. Reimplementing `sudo` in userspace, badly. Do you trust the app to be the sandbox?

## The workaround

WebDAV. Might be more elegant than 9P — it's stateless, and it works over the infrastructure that already exists. Mount a synthetic filesystem — computed on read, routed on write. The client doesn't know what's behind the path — and it never did. Every `read()` is a function call. "Static" just means the function is so well-hidden you forgot it's there.

The main difference is state. 9P keeps it on the server — file handles, position, walk context. WebDAV is stateless. Every request is self-contained. And stateless is what you want when the server is a CDN, the client might disappear, and the whole thing needs to scale without coordination. State is the enemy of resilience. Server crashes? 9P connections are gone. WebDAV? Client just retries.

The server is the boundary. It decides what each path exposes. Different entry points, different views. Same data, scoped by who's asking. Not per-process like 9P, but per-credential — which maps better to the network world.

## The real problem

The browser was the first crack. Untrusted code from the internet, running on your machine, as you. The OS couldn't scope permissions per-origin, so the browser built its own sandbox — same-origin policy, CORS, CSP, iframe isolation. A little operating system inside the application, because the actual OS only knew "you" and "not you."

But the sandbox only works inside the browser. AI runs outside it — in the terminal, in the IDE, as a shell process. It sidesteps the app sandbox entirely and we're back to raw OS permissions. Which are just "you."

The progression:

1. **PC** — one user, everything accessible, no problem
2. **Browser** — untrusted code arrives, OS can't help, app builds its own sandbox
3. **AI** — untrusted code arrives, runs outside the app sandbox, OS still can't help

The browser proved the OS permission model was insufficient. But instead of fixing the OS, we fixed the app. Now AI sidesteps the app and we're back to the original problem. The OS only knows "you."

The AI IDE runs as you. Same user, same permissions, same filesystem access. There's no process isolation between "you doing things" and "AI doing things on your behalf." It's all your uid.

Until the tools people figure out AI should be a separate process with a different user, we're stuck. The server is your `chmod`. The mount point is your namespace. It's not the right answer. It's the answer that works given that everyone forgot how multi-user computing works.

The dinosaurs are still alive in the valley. We just stopped visiting.
