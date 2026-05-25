---
title: The Browser Is a Blit
date: 2026-05-16
tags: [tech]
audience: public
type: journal
summary: The blit was Bell Labs' smart terminal — its own processor, local compute, fetches from the network, renders locally. The browser inherited the design without inheriting the name. And theTube is a Plan 9 cluster.
workflow: published
---

Plan 9's core idea: everything is a file, namespaces are composable, any client speaks the same protocol. You mount different file servers into one namespace and the client doesn't know or care.

theTube does the same thing unintentionally — at every layer:

**Build time** — three repos mounted into one directory tree via `cp` in GitHub Actions. The builder reads one unified namespace, doesn't know which repo each file came from.

**Runtime** — the browser fetches multiple `content.json` feeds, merges them, renders the list. Live namespace composition, in the client, right now. Role-based feeds mount dynamically based on the cookie. Add a new feed and it appears without a rebuild.

**Storage** — S3 is the namespace. Files in, files out. Any HTTP client speaks the same protocol — browser, curl, Lynx, bot.

The browser is already doing Plan 9. The HTML pages are a frozen snapshot; the index is a live mount. "Build time" is an implementation choice for the pages, not a constraint of the design. A running system could render markdown on demand from the GitHub API and serve it directly — same interface, live namespace.

Doug McIlroy, Plan 9 — same Bell Labs lineage. The Unix philosophy keeps showing up whether you invite it or not.

And the browser is basically a node in a compute cluster. Every client that loads the page fetches data, processes it — merges feeds, filters by role, sorts — and renders the result. The compute is distributed across every reader automatically, for free, with zero coordination.

S3 is the shared filesystem. CloudFront is the network. Every browser is a compute node running the same job independently. No orchestration, no master node, no message passing. The cluster scales perfectly: more readers means more nodes, each doing their own work, none talking to each other. The only shared state is S3, and it's read-only at runtime.

GitHub Actions is a node too — it's just the build node. It runs once on push, writes its output to S3, and exits. The browser nodes run continuously, on demand, one per reader. Same cluster, different job, different schedule.

Plan 9 called this a "cpu server" — a node that does compute on behalf of the user. The browser is the cpu server, and the user is already sitting at it.

Plan 9 organized its network by function. The mapping to theTube is exact:

| Plan 9      | theTube                                                  |
| ----------- | -------------------------------------------------------- |
| Terminal    | Browser — user-facing, runs the UI                       |
| CPU Server  | Browser — does the compute (merge feeds, filter, sort)   |
| File Server | S3 — the shared namespace, read by all                   |
| Auth Server | Lambda@Edge — manages credentials, issues signed cookies |
| Network     | CloudFront — routes requests, enforces access            |

GitHub Actions is just a client with write access to the file server. Not a node type — a process that populates the namespace on push.

The browser is both terminal and cpu server. In Plan 9 that was the blit — Bell Labs' smart terminal with its own processor. Not a dumb display, not a server. A smart client that fetches from the network and renders locally. The server doesn't know what the output looks like. The blit figures out the rest.

The lineage: blit → Plan 9 terminal → web browser. The browser inherited the design without inheriting the name.
