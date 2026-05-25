---
title: Moderated Comments
date: 2026-05-18
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
summary: Comments via batch events. You review, approve, they appear on next build. No spam, no real-time pressure. The log holds everything until you're ready.
workflow: published
---

[comment]:

The simple version of comments. No real-time. No pressure. Comments accumulate in the event log. You review them when you feel like it. Approve the ones worth keeping. They appear on the next build.

## The flow

1. Visitor submits comment → `POST /tube/comment/add?post=my-post&body=...&name=...`
2. CloudFront logs it. Returns 202. Done from the visitor's perspective.
3. You check the logs when you want: `aws s3 cp s3://bucket/logs/latest.gz - | gunzip | grep comment/add` — or ask AI to do it.
4. Review. Approve the good ones.
5. Approved comments get written to `/comments/<uuid>/index.json` in S3.
6. Next build (or a Lambda) picks them up. They're live.

## What "approve" means

Could be:
- A manual step: you run a script that writes approved comments to S3
- A GitHub issue: the log processor creates an issue per comment, you close it to approve
- A simple admin page: list pending comments, click to approve

All of these are just "read the log, write a file." Different UIs for the same operation.

## Why moderated

- No spam — nothing appears without your approval
- No real-time pressure — review on your schedule
- No infrastructure running between submissions — the log holds everything
- The log is the queue — no separate message broker needed

## Cost

Zero beyond what already exists. The events endpoint is live. CloudFront logs the submissions. You grep the logs when you want. The approval step writes a file. No new infrastructure.

[journey]:
prev: the-log-is-the-event-bus
The batch processing path applied to comments. The log holds submissions. You review when ready. Approve = write a file. Simple, no spam, no pressure.

2026-05-20: Built it. Comment form submits to `/tube/comment/add`, returns 202 in 1ms. Verified in the CloudFront logs — post, body, authenticated user, all captured. Grepped the logs like the 90s. Works.
