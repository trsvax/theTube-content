---
title: The GraphQL Contract
date: 2026-05-18
tags: [tech]
type: journal
audience: user
status: vague-thought
coffee: 1
summary: Client sends operationName + data. The query lives in the repo. The repo is the schema. Leverage existing specs instead of inventing new ones.
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

[journey]:
prev: plugins-are-specs-not-code
The plugin model needs a protocol. GraphQL is already well-known to AI and well-specified. The insight: the query lives in the repo, not in the client or a server. The repo is the schema. The client just says what it wants.
