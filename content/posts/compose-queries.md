---
title: Compose Queries
date: 2026-05-20
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: walk
summary: GraphQL fragments compose into one query. @defer means they don't have to come back at the same time. Parallel fetches to different files, progressive rendering. No server.
---

We'll have a bunch of GraphQL fragments — meta, markdown, comments, thoughts. Each backed by a different file at a different URL. Compose them into one query:

```graphql
query PostPage($slug: String!) {
  meta(slug: $slug) { title, date, tags }
  markdown(slug: $slug) { body }
  comments(post: $slug) { id, body, author, date }
}
```

One hook call. Three parallel fetches. The component gets everything it needs.

## @defer — they don't have to arrive together

```graphql
query PostPage($slug: String!) {
  meta(slug: $slug) { title, date, tags }
  markdown(slug: $slug) { body }
  ...comments @defer
}

fragment comments on Query {
  comments(post: $slug) { id, body, author, date }
}
```

`@defer` means: render what you have, send the rest when it's ready. Meta and markdown come from cache instantly. Comments might take longer — separate file, maybe not cached. The page renders progressively without waiting for the slowest fetch.

## How it maps

| Fragment | Source | Speed |
|---|---|---|
| `meta` | `content.json` (CDN cached) | instant |
| `markdown` | `/posts/<slug>.md` (CDN) | fast |
| `comments` | `/comments/<slug>.txt` (S3) | variable |

No GraphQL server resolving these. The hook reads the schema, knows which URL backs each fragment, fires parallel fetches. `@defer` is just "this fetch might be slower — don't block on it."

## The hook

```tsx
const { meta, markdown, comments } = useQuery('PostPage', { slug });
// meta and markdown resolve immediately
// comments arrives when ready, component re-renders
```

Same `useQuery` from before. The schema tells the hook what to fetch and where. Fragments compose at the schema level. Fetches parallelize at the hook level. Progressive rendering at the component level.

## No server required

A GraphQL server would resolve all fields in one request. Here, the "resolution" is parallel HTTP fetches to static files. The result is the same — one query, all the data — but the backend is files at URLs, not a resolver runtime.

[journey]:
Walk thought. We have fragments scattered across repos (comments schema, content schema). They compose into one query. @defer means progressive rendering without a server — just parallel fetches that resolve at different speeds. The hook hides it all.
