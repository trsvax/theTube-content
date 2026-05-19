---
title: Same Hooks, No Server
date: 2026-05-18
tags: [tech]
type: journal
audience: user
status: vague-thought
coffee: 0
origin: bike
summary: React hooks with the same API as Apollo or urql — but the backend is files and a CDN. No GraphQL server. The hook hides the implementation.
---

The hook API is identical to a sync GraphQL hook:

```tsx
const { data, loading, error } = useMutation('addComment', { post: 'my-post', body: 'great' });
const { data, loading } = useQuery('comments', { post: 'my-post' });
```

Under the hood: `useMutation` fires to `/events/...` or `/fastevent/...` based on the directive. `useQuery` fetches a file from S3. The component doesn't know or care about the transport.

## Same developer experience

The API is Apollo/urql. The infrastructure is files and a CDN. No GraphQL server. No connection pool. No resolver runtime. The hook hides the difference.

A developer who's used Apollo can use these hooks without learning anything new. The mental model is the same: mutations write, queries read. The implementation is radically different but the interface is identical.

## What the hooks do

- `useMutation(opName, data)` → fires fetch to the right path based on the schema directive. Returns loading/error/data.
- `useQuery(opName, params)` → fetches the file at the known URL. Returns loading/error/data.
- The schema (from `blocks.md` → spec URL) tells the hook which path to use.

## Why this matters

The async model disappears from the developer's perspective. They write the same code they'd write against a server. The fact that there's no server is an implementation detail hidden by the hook.

[journey]:
prev: the-graphql-contract
Forgot this one on the bike. The async GraphQL model we designed needs a developer interface. React hooks with the same API as existing GraphQL libraries — but backed by files and events instead of a server. The abstraction hides the infrastructure.
