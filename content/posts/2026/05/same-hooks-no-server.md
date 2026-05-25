---
title: Same Hooks, No Server
date: 2026-05-18
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: bike
summary: React hooks with the same API as Apollo or urql — but the backend is files and a CDN. No GraphQL server. The hook hides the implementation.
workflow: published
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

## The role picks the path

The client knows the user's role from the JWT. The schema declares `@auth(role: "user")` on `addCommentRealtime`. That directive does double duty — server-side enforcement *and* client-side routing hint.

```tsx
// One hook. The role decides the path.
const { mutate } = useComment(post);

// role === 'user' → addCommentRealtime → /fastevent/ → instant
// role === null   → addComment → /events/ → moderated
```

One form, one component. Anonymous visitors get moderated comments. Authenticated users get real-time. The server still enforces — Lambda@Edge rejects unauthorized requests to `/fastevent/`. But the client doesn't need a feature flag or conditional logic. The role *is* the feature flag.

## It's just fetch

`useQuery('comments', { post: 'my-post' })` is `fetch('/comments/my-post.txt')` with loading state. That's it. The schema maps operation → URL pattern, the hook does the fetch. Without JS, it's `<a href="/comments/my-post.txt">` — the file exists at a URL regardless.

But if you're writing React, you reach for `useQuery`. It's what your hands type. The hook doesn't add capability — the URL was always the interface. It adds the developer ergonomics that make the file-based backend feel like any other data layer.

## Why this matters

The async model disappears from the developer's perspective. They write the same code they'd write against a server. The fact that there's no server is an implementation detail hidden by the hook.

[journey]:
prev: the-graphql-contract
Forgot this one on the bike. The async GraphQL model we designed needs a developer interface. React hooks with the same API as existing GraphQL libraries — but backed by files and events instead of a server. The abstraction hides the infrastructure.
