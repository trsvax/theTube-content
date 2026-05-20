---
title: The Schema Is the Privacy Policy
date: 2026-05-18
tags: [tech]
type: journal
audience: user
status: vague-thought
coffee: 0
origin: meetup
summary: "@PII on the GraphQL schema marks what's sensitive. A JS Proxy hides it by default. grep pii returns all the touch points. The schema is the privacy policy."
---

Everyone at the Elastic meetup is concerned about AI and PII. Fair — if your logs have names and emails and you feed them to AI, you've shared PII with a third party.

## @PII in the schema

```graphql
type Comment {
  id: ID!
  post: String!
  body: String!
  author: String @PII
  email: String @PII
  date: String!
}
```

The schema declares what's PII. Machine-readable. One source of truth. No separate privacy document that drifts from the code.

Every reader knows which fields are sensitive:
- The edge can strip `@PII` fields before logging
- AI knows not to include them in analysis
- Export Lambdas can redact them for public reports
- Compliance audits scan the schema and know exactly where PII lives

## The JS Proxy

```js
const comment = pii(rawComment, schema);

// Normal access — PII is hidden
JSON.stringify(comment);  // { id, post, body, date }

// Explicit PII access
const { author, email } = pii.unwrap(comment);
```

The Proxy intercepts `JSON.stringify` (via `toJSON`) and property access. PII fields are invisible by default. You have to explicitly unwrap to get them. Accidental logging of PII becomes impossible.

The schema drives which fields the Proxy hides. Read the `@PII` directives at startup, build the Proxy, done.

## grep pii

`grep pii` across the codebase returns every touch point where PII is accessed. Every `pii.unwrap()` call is a deliberate decision to handle sensitive data. The audit is a grep. No scanning tool needed.

## The schema is the privacy policy

Not a legal document nobody reads. A machine-readable declaration that drives runtime behavior. The policy enforces itself through the Proxy. You can't accidentally violate it because the default is redacted.

[journey]:
prev: the-graphql-contract
Came from the Elastic meetup — everyone worried about AI and PII. The answer: @PII directive in the schema, JS Proxy that hides marked fields by default, explicit unwrap for intentional access. The schema is the privacy policy. grep pii is the audit.
