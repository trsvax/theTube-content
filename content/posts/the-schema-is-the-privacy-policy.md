---
title: The Schema Is the Privacy Policy
date: 2026-05-16
tags: [tech]
type: draft
summary: Put @redacted on the field once. Everything downstream — agents, logs, browsers — enforces it automatically. The schema stops being documentation and starts being law.
---

The standard approach to PII protection is defensive: scrub logs before sharing, add access checks in resolvers, train developers to handle sensitive fields carefully. It works until someone forgets. Then it doesn't.

GraphQL gives you a better option. The schema already declares every field that exists. If you can mark a field as sensitive in the schema, the enforcement can be automatic everywhere.

## @redacted on outputs

The obvious starting point: add a directive to fields that contain PII.

```graphql
type User {
  id: ID!
  name: String!
  email: String! @redacted
}
```

A server-side plugin intercepts the response before it leaves and replaces `@redacted` field values with `[REDACTED]`. Agent clients, log consumers, and support tools see the structure — field exists, type is String, value is non-null — without seeing the data.

## @redacted on inputs

The more interesting move is pushing the directive up to query arguments.

```graphql
type Query {
  users(name: String @redacted, status: String): [User]
}
```

For agent clients, the server ignores `@redacted` arguments entirely before the query runs. No database hit, no result set, no count to leak. The field might as well not exist.

The side effect: an agent searching with `name: "foo"` gets the same result as `name: "Barry"`. The input is stripped either way. The agent can't use the field as a probe — there's nothing to learn from varying the value.

## Foo is better than Barry

This turns out to be a feature, not a limitation.

An agent testing a search UI doesn't need real names. It needs to verify that the search field accepts input, the query runs, results come back, pagination works, the list renders. "foo" does all of that. "Barry" does all of that plus sends a real person's name into a model's context window.

The agent becomes a better tester because it can't use real data. It's forced to test behavior in isolation from content — which is what a test should do anyway.

## Schema plus browser

A browser MCP gives an agent eyes on the rendered page. The schema gives it knowledge of the privacy contract. Together, they enable something useful: automated compliance verification.

The agent knows from the schema that `email` is `@redacted`. It drives the browser to a user profile page and reads the DOM. If a real email address appears in the rendered output, the schema and the implementation disagree. That's a bug — and the agent caught it without a human reviewer and without touching real data.

Schema is the spec. Browser is the implementation. Agent checks they match.

## Structured logs

String replacement — swapping "barry@example.com" for "[REDACTED]" — works but throws away information. Structured redaction keeps it.

```json
{ "field": "email", "value": "[REDACTED]", "sensitive": true }
{ "field": "status", "value": "active", "sensitive": false }
```

Now the logs are queryable on the sensitivity dimension. Which queries touched sensitive fields? Which agent sessions accessed PII inputs? Are there patterns of sensitive access followed by data exports? You get compliance analytics without the compliance liability.

Tiered retention follows naturally. `sensitive: false` logs keep indefinitely. `sensitive: true` logs purge on schedule. Same log store, different lifecycle based on a field value.

## The directive runs code

The objection to schema-level annotations is that they're documentation until something enforces them. `@redacted` on a field is a label. Labels don't redact anything.

GraphQL directive transformers close that gap. The directive definition includes the enforcement:

```js
const RedactedDirective = {
  visitFieldDefinition(field) {
    const { resolve } = field
    field.resolve = async (source, args, context, info) => {
      const value = await resolve(source, args, context, info)
      return context.isAgent ? '[REDACTED]' : value
    }
  }
}
```

The transformer wraps every resolver that touches a `@redacted` field at schema build time — before any request runs. The label and the behavior are the same artifact. You can't declare `@redacted` and forget to wire up the enforcement because the enforcement is in the declaration.

The schema stops being documentation and starts being executable policy.

## Two logs, one access event

The Proxy is the right place to split the audit trail. Every sensitive field access fires two log entries automatically — the resolver doesn't know either is happening.

```js
function getSensitive(args, context) {
  return new Proxy(args._sensitive, {
    get(target, key) {
      const value = target[key]

      // Safe log — shareable with agents, support tools, dashboards
      logger.info({
        field: key,
        value: '[REDACTED]',
        sensitive: true,
        resolver: context.resolverName,
        requestId: context.requestId
      })

      // Audit log — restricted store, real value, compliance use only
      auditLogger.info({
        field: key,
        value: value,
        resolver: context.resolverName,
        userId: context.userId,
        requestId: context.requestId
      })

      return value
    }
  })
}
```

The regular log goes anywhere — it never had PII. The audit log goes to a restricted store with stricter access controls, separate encryption, its own retention policy. The `requestId` ties them together: if you need the real value for a specific request, look it up in the audit store by ID.

The resolver writes `const sensitive = getSensitive(args, context)` and then `sensitive.email` like a normal property access. Both log entries happen on that read. The logging can't be skipped, can't be forgotten, can't be commented out during debugging. The act of reading the value is the log entry.

Two loggers, one Proxy, zero burden on resolver authors.

## The schema as contract

The real value is that this composes. Mark a field `@redacted` once in the schema. Output redaction, input stripping, log tagging, and browser verification all enforce the same contract automatically. Add a new PII field and it's protected everywhere immediately. Forget to mark one and a lint rule catches it in CI.

Compliance stops being a code audit and becomes a schema review. The schema stops being documentation and starts being law.

[journey]:
From a conversation about browser MCP agents and PII. Started with "what if you pointed an MCP at a production site with PII data?" The @redacted directive on inputs came from thinking about search — if you can't return Barry's record, you also shouldn't run the query. The "foo is better than Barry" observation was the user's. The structured log idea followed from wanting logs that are searchable without scrubbing.
