---
title: The GraphQL Contract
date: 2026-05-18
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 1
summary: Client sends operationName + data. The query lives in the repo. The repo is the schema. Leverage existing specs instead of inventing new ones.
workflow: published
---

The client sends two things: `operationName` and `data`. That's it. The client doesn't know the query. The client doesn't know the schema. It just says what it wants to do and provides the data.

```json
{ "operationName": "addComment", "data": { "post": "my-post", "body": "great post" } }
```

The query definition lives in the repo — not sent by the client, not in a running server. The repo *is* the schema. A Lambda reads the operation definition from the repo (or from S3 at deploy time) and executes it against the data.

## The contract

- Client sends: operationName + data
- Repo contains: what each operation does (the GraphQL queries/mutations)
- Lambda: matches operationName → query from repo → executes → writes result

The client speaks a universal protocol. The repo defines what that means. Fork the repo, change the operations, deploy — different behavior, same client interface.

## Why not invent a new protocol

GraphQL is one of the most well-documented specs in existence. Every AI knows how to write resolvers, schemas, operations. You don't need to spec the protocol — it already exists. You just spec what your operations *do* and AI knows how to wire it up.

Leverage existing specs instead of inventing new ones. The GraphQL spec is someone else's work. The comment behavior is yours. AI combines them. You only write the part that's unique to you.

## The plugin interface

This is how plugins communicate. The client sends operationName + data to any plugin's endpoint. The plugin's repo defines what operations exist. Different repos = different plugins = different behavior. Same client interface for all of them.

## One file, many readers

The schema file:
- AI reads it → generates the Lambda resolver
- AI reads it → generates the client form
- AI reads it → generates the validation
- Humans read it → understand what operations exist
- The build reads it → generates type definitions

One file. Five readers. Each produces something different. Nobody coordinates.

## Extensible with directives

GraphQL directives (`@`) are the extension mechanism:

```graphql
type Mutation {
  addComment(post: String!, body: String!): Comment @realtime @auth(role: "user")
  submitFeedback(post: String!, note: String!): Feedback @moderate
}
```

`@realtime` → use `/fastevent/`. `@moderate` → use `/events/` batch path. `@auth` → require JWT. Readers that don't know a directive ignore it. Same pattern as `[tag]:` blocks in markdown.

## Build time, not runtime

For your own platform where you control both sides, the queries are known at build time. Pre-defined operations, pre-defined responses. The "GraphQL server" is just a lookup table: operationName → do this thing.

If you ever need full runtime query parsing for a public API — pass the query in the request body via `/fastevent/`. The Lambda runs it against the schema. Same endpoint, more data in the request. Add that capability when someone actually needs it. Not before.

## The wire format stays simple

The schema is the contract between humans and AI. The wire format stays name=value:

```
/events/comment/submit?post=my-post&body=great+post&name=barry
```

The schema says "addComment takes post (required), body (required), name (optional)." That's for AI and validation — not for the transport. Simplest possible wire format. Richest possible contract. They don't have to be the same thing.

## Async GraphQL via files

Mutations are writes to the event log. Queries are reads from S3. The schema ties them together. All async. All files. No GraphQL server running.

- Mutation → `/events/comment/submit?...` → logged, processed later by Lambda → writes result to S3
- Query → `GET /comments/my-post.txt` → read a file

The transport is HTTP. The persistence is a file. The processing is decoupled from the request. No WebSocket subscription needed. Just: write an event, read a file.

## No server to attack

Even if you open a public API that accepts arbitrary GraphQL queries, it doesn't run on your main server. It's a Lambda — isolated, ephemeral, scales independently. A bad query can't take down your site because there's no shared process. The function handles it and disappears.

Webhooks (Stripe payment confirmed, GitHub issue closed) — same thing. A Lambda receives it, processes it, writes a file. No server sitting there waiting for callbacks.

Nothing shares a process. Every operation is isolated. A malicious query can't DOS your site because the site is static files on a CDN. The Lambda is a separate thing that can't affect the serving layer.

## Async isn't a compromise

`fetch()` is already async. Every API call in the browser is already `await`. The developer experience is identical whether the response comes in 50ms (fastevent) or you poll a file 5 minutes later. It's all promises either way. The async model isn't a tradeoff — it's what JS already does. The "sync" APIs people are used to are async under the hood anyway.

[journey]:
prev: plugins-are-specs-not-code
The plugin model needs a protocol. GraphQL is already well-known to AI and well-specified. The insight: the query lives in the repo, not in the client or a server. The repo is the schema. The client just says what it wants.
