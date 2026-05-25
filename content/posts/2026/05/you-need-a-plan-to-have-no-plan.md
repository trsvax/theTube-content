---
title: You Need a Plan to Have No Plan
date: 2026-05-16
tags: [tech]
audience: public
type: journal
summary: Invest upfront in infrastructure — structured logs, schema annotations, operation capture — and you never have to plan a test, a report, or a query again. The planning happens once. The flexibility is permanent.
workflow: published
---

I gave up writing tests before I got around to turning off the linter. Both decisions were correct.

Tests require discipline to write well, discipline to maintain, and discipline to keep honest. Discipline is the scarcest resource on any team. The tests that exist to satisfy a process get written badly, maintained reluctantly, and eventually ignored or deleted. The green CI badge stops meaning anything.

## Mock databases test the mock

The hardest case is a database-backed site. The conventional answer is to mock the database — replace the real DB with an in-memory fake so tests run fast and in isolation. 

This tests nothing real. The mock doesn't have the real query planner, the real constraint enforcement, the real transaction semantics, the real edge cases on nulls and empty sets. You write tests that pass against the mock and fail in production. The mock diverges from the real database with every schema change, and nobody updates it because updating the mock is harder than the original problem.

Integration tests against a real database are the only tests worth having for DB-backed code. If that's too slow or too hard to set up, fix the infrastructure. The answer is never more mocks.

## The test suite writes itself

The real test suite is production GraphQL operations replayed against UAT.

Every query real clients actually send — captured from production traffic, with PII stripped — runs against UAT before each deploy. If a schema change breaks a production operation, it fails in UAT. If it passes, you have evidence that counts: the code works against the actual queries actual users run.

This is better than anything you'd write by hand. The operations come from real usage, not from what a developer anticipated when writing tests. They evolve automatically as usage evolves. Every production bug adds another operation to the corpus — after six months you have a regression suite of every edge case that actually happened, not ones someone imagined.

You were going to log production operations anyway to debug "why did this query return wrong data on Tuesday at 3pm." The operation log exists for debugging. Replay against UAT is a free byproduct of infrastructure you already needed.

## One test, total coverage

For the proxy-based PII enforcement pattern, there's exactly one test worth writing:

```js
test('logger warns on unclassified type', () => {
  const warnings = []
  mockLogger.warn = (entry) => warnings.push(entry)

  resolveField({ type: 'UnclassifiedType', field: 'name' })

  expect(warnings).toHaveLength(1)
  expect(warnings[0].message).toBe('unclassified type')
})
```

That's it. The proxy applies the same code path to every field on every type. Test it once and walk away. New fields, new types, new resolvers — all covered without new tests. The conventional approach would have a test per sensitive field, updated with every schema change, drifting further from reality with every sprint.

Write one thing correctly and stop.

## The logging cluster is bigger than the app cluster

That's not an accident — it's a priority. Most teams treat logging as a cost center sized at a fraction of the app. We treat it as load-bearing infrastructure sized for the actual work it does.

The app servers process requests in milliseconds. The logging cluster processes meaning continuously. PII classification warnings, operation replay, anomaly detection, performance trends, audit trails — that's unbounded work against an unbounded stream. The ratio reflects where the value actually is.

It also means the "just log a warning" enforcement approach has real teeth. Lint runs once on one machine at build time. The logging cluster runs continuously against everything in production at scale. An unclassified type appearing in production generates a warning that hits the cluster within seconds, triggers an alert, and surfaces in a dashboard before the developer who shipped it has closed their laptop.

That's enforcement proportional to the infrastructure budget — which is already proven to be substantial.

## Mine the logs six months later

Structured logs are a queryable dataset. You don't need to know the questions in advance.

Six months ago you logged every field access with resolver name, type name, field classification, timestamp, commit SHA, and request ID. Today someone asks for a report on "which resolvers accessed email fields during business hours in Q1." The data is there. The report is a query, not a backfill project.

Unstructured logs don't have this property. Structured logs with consistent fields answer questions you haven't thought of yet. The schema annotations — `@pii`, `@redacted`, `@safe` — are a retrospective key. Add `@pii` to a type today and every historical log entry for that type becomes classifiable. You didn't have to log "this is PII" at write time. You logged the type name. The schema does the rest.

Six months of operation logs with consistent structure is worth more than six months of test coverage. Tests tell you what the code did in a controlled scenario at one point in time. Logs tell you what actually happened to real users in production, continuously, forever.

The logs get more valuable over time. Tests get more expensive.

[journey]:
From a conversation about GraphQL PII enforcement, proxy-based logging, and testing philosophy. The "gave up writing tests before turning off lint" observation was the user's — both decisions correct. The production operations against UAT pattern came from the user's practice. The elastic logging cluster being bigger than the app cluster was the tell that logging is load-bearing, not an afterthought.
