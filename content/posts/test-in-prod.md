---
title: Test in Prod
date: 2026-05-18
tags: [tech]
type: journal
audience: user
status: vague-thought
coffee: 0
origin: bike
summary: When the architecture is append-only and stateless, testing against prod is safe, fast, and free. No staging, no UAT, no raspberry pi.
workflow: published
---

The test environment is production.

## Why it's safe

- The log is append-only. Test data can't corrupt real data.
- The pieces are stateless. No shared state to pollute.
- The pieces are isolated. A test comment doesn't affect the post renderer.
- No reader exists yet for most events. The data sits harmlessly in the log.

## Why it's fast

You're hitting CloudFront — globally distributed, infinite capacity. Not a raspberry pi in a closet pretending to be a data center. 10,000 test requests run in seconds, not hours.

## Why it's free

CloudFront requests cost fractions of a penny. The raspberry pi costs more than the test run. No UAT server to maintain. No staging environment to keep in sync.

## The test

```
curl -i 'https://thetube.today/events/comment/submit?post=test&body=hello'
```

Did it return 202? Done. Load test = same thing, more concurrent. Black box. Input → output. If the output is correct, the implementation is correct.

## No cleanup

Test data in the log? Filter it when querying: `WHERE post != 'test'`. Or don't — it doesn't matter. Append-only means you never need to clean up. The data is there. Ignore what you don't want.

## The pi costs more

A raspberry pi UAT box: $50 hardware + electricity + maintenance + 10-hour test runs. Testing against prod: $0.001 for 10,000 requests + runs in seconds. The "cheap" option is the expensive one.

[journey]:
prev: same-hooks-no-server
Realized that with append-only logs and stateless functions, there's no reason not to test against prod. The architecture makes it safe by construction. No staging needed. The test environment is production.
