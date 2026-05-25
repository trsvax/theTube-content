---
title: Logs Are the Test Suite
date: 2026-05-21
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: walk
summary: The system already records everything that happens. The test is just — did the expected thing show up in the record? No framework, no mock, no staging. Test in prod because prod is append-only.
workflow: draft
---

This morning I shared a URL from Safari using a Shortcut. Then I asked AI to verify it worked. It grepped the CloudFront logs, found the request, confirmed 202. That was a test. I just didn't call it one.

## The test I ran

1. Fire a request (the shortcut)
2. Check the logs for the expected entry
3. Confirm 202, confirm the URL was captured

That's an integration test. The system under test is production. The test output is the access log. The assertion is: did the expected line show up?

## Why it's a regression test

The git note from this session says:

```
Verified: shortcuts hit CloudFront, logs show 202s from Mac (IAD) and phone (DFW)
```

That's the test case. If I change the CF function tomorrow, the same check works: fire a request, grep the logs, did it show up? If yes, no regression. If no, something broke.

The note is the spec. The log is the test output. The AI is the test runner.

## Async testing

CloudFront standard logs take 5-10 minutes to land in S3. You can't run this in a CI pipeline that expects instant feedback. But who said tests need to be synchronous?

Two scheduled actions:

1. **Fire** (every hour): `curl https://thetube.today/create/heartbeat?origin=ci`
2. **Check** (15 minutes later): grep the logs for `heartbeat&origin=ci`. If it's not there, something's broken.

The test is decoupled from the assertion. Same architecture as everything else — write now, read later. And if the check fails, it writes its own event: `/create/alert?test=heartbeat&status=failed`. The system monitors itself using itself.

## Test in prod

There's no staging environment because there's nothing to stage. The CF function either returns 202 or it doesn't. A test request with `type=heartbeat&origin=ci` goes through the same path as a real request. It *is* a real request. The test is production traffic.

No mock, no fake, no "staging that's almost like prod but not quite." You can't corrupt data by testing because there's no data to corrupt — just logs that accumulate. One more log entry doesn't hurt anything. That's the luxury of stateless + append-only.

## vs. traditional testing

Traditional: write code → write tests → run tests → tests produce output → check output → maintain tests when code changes

This: use the system → system produces logs → check logs

The logs are the test report. The notes are the test cases. The AI is the test runner. No pytest, no Jest, no test framework. Just files and a reader.

The gap: notes aren't executable. You can't run them in CI. An AI has to interpret them. That's weaker as an automated gate but stronger as a regression check — the intent survives implementation changes that would break brittle unit tests. "The shortcut fires and the request appears in the logs" doesn't care whether the handler is a CF function or a Lambda or a different path. The assertion is about behavior, not implementation.

## Tag your test traffic

Set a cookie to mark your requests in the logs:

```bash
curl -b "thetube_test=1" https://thetube.today/posts/whatever
```

CloudFront logs cookie names. Filter for `thetube_test` = your test traffic. Everything else = real visitors or bots. No code change needed — the cookie is just a tag that shows up in the log line. Set it in the browser dev tools for manual testing, pass it with curl for scripted checks.

Separates your verification traffic from real traffic without any infrastructure. When you grep the logs: has `thetube_test` = you were testing. Doesn't have it = organic. Simple.

[journey]:
Walk thought → conversation. The verification I did this morning (grep logs for the shortcut request) is literally a regression test. The git note records what should work. The logs prove it does. Two cron jobs make it automated. No framework needed — the system already records everything.
