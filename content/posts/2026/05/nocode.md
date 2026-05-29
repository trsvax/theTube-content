---
title: NoCode
date: 2026-05-29
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: chat
summary: Declare the operations. AI generates the implementation. The infrastructure handles the rest. No server. No auth code. No backend you wrote. Just a schema, a tube, and logs.
workflow: draft
---

SQL was "declare what you want, the engine figures out how."

This is the same:

- **Schema** (GraphQL) — declares what operations exist and what they mean
- **UI** — AI generates it from the schema, native to the site
- **Transport** — the tube. Log it or store it. No server.
- **Auth** — presigned URLs. Infrastructure, not code.
- **Backend** — AI reads the logs and processes them. Generated from the schema too.

No server. No auth code. No backend code you wrote. Just a schema, a tube, and AI that reads the logs.

And you can add compute later if you need it. Start with nothing. The logs tell you what's happening. Add a Lambda when the data demands it. Remove it when it doesn't. Zero cost at rest.

The opposite of "start with a server and scale down." Start with nothing and add compute only when the logs prove you need it.

[journey]:
prev: the-ticket-machine
The connection between Tapestry NoCode and the tube. GraphQL is the spec. AI generates the UI and the processor. The tube is the transport. The infrastructure is the auth. The logs are the backend. Add compute when you observe the need, not when you guess it.
