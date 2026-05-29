---
title: RFC — The Tube Protocol
date: 2026-05-29
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: chat
summary: The tube protocol on a business card. POST, 202, Location, poll. That's the spec.
workflow: draft
---

JSON was RFC 4627. One page. "It's this." The tube protocol could be the same.

## The Tube Protocol

1. Client sends `POST /tube/{path}` with `Authorization: Bearer {token}`
2. Server validates token, writes request to storage
3. Server responds `202 Noted` with `Location: /fs/{result-path}`
4. Client polls `Location` until result appears
5. Result is the response

## Properties

- **Async by default** — 202, not 200
- **Location is the ticket** — the receipt tells you where to find the result
- **Idempotent** — same request, same result path, no re-execution
- **Observable** — every request is a file, every result is a file
- **Scoped** — the token determines what paths are available
- **Stateless** — no session, no connection, no server memory

## Fits on a business card

```
POST /tube/{path}
Authorization: Bearer {token}

202 Noted
Location: /fs/tube/{path}/{id}.result
```

That's the spec. Everything else is implementation.

[journey]:
prev: tube-request
JSON started as an RFC. The tube protocol is simpler than JSON. If Crockford could fit his on a business card, this fits on the back of mine.
