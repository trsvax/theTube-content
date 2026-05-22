---
title: Schema-Filtered Reads
date: 2026-05-20
tags: [tech]
type: journal
audience: public
coffee: 0
origin: meetup
summary: The schema declares @pii. The reader applies the filter. Same file, different view per consumer. Access control lives in the reader, not the storage.
workflow: draft
---

DRAFT

---

The schema already declares what's PII:

```graphql
type Mutation {
  addComment(
    post: String!
    body: String!
    email: String @pii
  ): Comment
}
```

The log contains everything. The question is: who sees what when they read it?

## Three readers, one log

| Reader | View | How |
|---|---|---|
| You | Everything | `s3 get \| grep` — full IAM, no filter |
| MCP log reader | `@pii` fields redacted | Schema-aware read, strips marked fields |
| Processing Lambda | Everything | Needs PII to do the work (write the comment) |

The file is the same file. The access control isn't in the storage or the protocol. It's in the reader. Each reader applies its own view based on what it's allowed to see.

## The schema does triple duty

1. **Client routing** — directives tell the hook which path (`@moderate` → `/events/`, `@realtime` → `/fastevent/`)
2. **Server enforcement** — `@auth(role: "user")` checked by Lambda@Edge
3. **Privacy enforcement** — `@pii` stripped by the MCP at read time

All declarative. All from the same schema. The schema is the privacy policy, the routing table, and the access control list.

## Why the filter lives in the reader

You could split logs at write time — PII to one path, clean data to another. But that's two copies of the same event, diverging over time. Harder to correlate. More storage. More complexity.

One log, multiple views. The reader applies the schema as a lens. The MCP knows which fields it can't show. Your `grep` doesn't care — you see everything because you're the owner.

## Plan 9 again

Same file server, different namespace per process. The file doesn't change. The view changes based on who's looking. The schema is the bind table — it declares what each consumer's namespace contains.

[journey]:
From the meetup. The @pii directive idea from the-schema-is-the-privacy-policy applied to log reads. The MCP log reader is schema-aware — it knows what to redact. You grep the raw logs because you're the owner. Same file, different view. Per-consumer namespaces via the schema.
