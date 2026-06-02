---
title: The MVP
date: 2026-06-02
tags: [tech]
type: journal
audience: public
status: journaling
coffee: 2
summary: The MVP already exists. It's a static site. CloudFront logs every request. The data is there. Everything else is an enhancement.
workflow: draft
---

## I already have it

I have a static site on CloudFront. That means I have a backend. I just hadn't looked at it.

CloudFront logs every request. Every URL. Every query string. Every timestamp. Every IP. Every status code. A contact form that POSTs to `/tube/contact?name=Alice&message=Hello` gets a 404 — but the data is in the log file. The 404 didn't lose anything. The CDN captured it anyway.

The MVP is a static site that logs. No server. No Lambda. No edge function. No database. Just files on a CDN that records every request.

Read the logs. There's the data.

## Enhancements, not requirements

Everything beyond "static site + logs" is optional. Each layer adds a capability without changing what came before:

| Layer | What it adds | Required? |
|-------|-------------|-----------|
| **Static site + CloudFront** | Content + logging | The product |
| **Edge function** (12 lines) | 202 instead of 404 — polite, gates noise | No |
| **Ticket machine** (80 lines) | File uploads, request-response lockers | No |
| **Processor** | Automation — act on what arrives | No |

I can stop at any layer. Each one works without the next. The blog ran for months on layer 0 alone.

## Layer 0: the static site

I already have this. HTML/CSS/JS in S3, served by CloudFront. The blog. The book. The forms. All static.

A form that submits to a URL that doesn't exist? CloudFront logs it anyway. The data is in the query string. Grep the log files. That's my inbox.

Cost: whatever I'm already paying for hosting. $0 extra.

## Layer 1: the edge

A 12-line CloudFront Function. Checks if the request has auth (header or query param). No auth → 404. Auth present → 202 Noted.

What this adds: the caller knows their request was accepted. Bots without tokens get filtered out. I stop paying attention to noise in the logs.

What it doesn't add: compute or processing. The data is still just a log line. But I already have all the storage I need — CloudFront was logging to S3 the whole time.

Cost: $0 (CloudFront Functions are included in request pricing).

## Layer 2: the ticket machine

An 80-line Lambda. Decrypts the JWT, verifies identity, creates a locker in S3, returns presigned URLs.

What this adds: file uploads (photos, documents — anything too big for a URL), request-response (poll a result URL), physical isolation between requests.

When I need it: when I have bytes, or when someone's waiting for an answer.

Cost: ~$0.000003 per request (Lambda 50ms at 128MB + S3 PUT).

## Layer 3: the processor

Whatever I want. A Lambda triggered by S3 events on the locker prefix. Reads `request.json`, does the work, writes `result.json`.

What this adds: automation. Instead of me reading the logs, a Lambda reads the lockers.

When I need it: when I'm tired of doing it manually. When the volume justifies it. When I have enough real data to know what the processor should do.

Cost: whatever the work costs. Could be $0 (just move a file). Could be $0.01 (call Bedrock for classification).

## The progression

1. Deployed the static site. Forms POST to `/tube/whatever`. Data in logs. Read manually.
2. Got tired of 404s in my analytics. Deployed the edge function. 202s look cleaner.
3. Wanted to accept photo uploads from my phone. Deployed the ticket machine.
4. Getting enough comments to moderate. Write a processor.

Each step motivated by a real need, not a hypothetical one. I never build something before the problem exists.

## Trust as a spectrum

Not "authenticated or not." A spectrum:

| Trust | What they get |
|-------|--------------|
| None (no token) | 404 at the edge |
| Unverified (any token) | Write-only locker — data goes in, nothing comes back |
| Verified (Cognito, valid JWT) | Locker + result URL — can poll for a response |
| Owner (encrypted JWT + time-hash) | Sync response — 200 with data immediately |

The prefix is the trust level: `tube/locker/verified/`, `tube/locker/unverified/`. Different lifecycle rules, different processors. The filesystem is the access control.

Unverified callers get Hotel California — data goes in, doesn't come out. I log that someone might be messing with me. They learn nothing.

## Authentication ≠ authorization

The ticket machine answers "who are you" (authentication). The processor answers "what can you do" (authorization). Physically separated — different Lambda, different time, different concern. Can't mix them because they don't share code.

Most systems tangle these in one middleware. Here they're separated by an S3 directory. The locker is the handoff point.

## Why not a server

The server's only real advantage is familiarity — people know Express, Rails, Django. But:

- A server costs money when idle ($5-20/month minimum)
- A static site + logs costs $0 extra and is already deployed
- My static site survives the Slashdot effect. A server melts.
- Every state in the tube is a file. Every state in a server is hidden in memory until it crashes.
- "One place to look when things break" is a fantasy — I've debugged systems with 5+ databases and Elastic. There's never one place to look. The path through the code never has enough logs.
- With AI building the code, framework familiarity is a liability. A 5-year-old Rails codebase is a maze of scar tissue. An 80-line Lambda is one file.

The tube's "complexity" is just... looking at log files and writing to S3. Things I do anyway. Just not as the primary architecture.

## The real MVP

1. Deploy a static site
2. Get data (it's in the logs whether I asked for it or not)

That's it. Everything else is optional and late. The data accrues. S3 is eleven 9s durable. Read it when I want. Process it when I'm ready. Or never.

The minimum viable product is a website. I already have one.

[journey]:
prev: http-done-write
The MVP reframed itself through conversation. Started as "two deploys" (edge + ticket machine). Then realized the edge is just making the 404 into a 202 — cosmetic. Then realized CloudFront logs the request regardless of status code — the data is captured even without the edge. The real MVP was always "static site + CDN logging." Everything else is enhancement. The progression: logs → edge → ticket → processor. Each step optional. Each motivated by real need. "Deploy and walk away" is a complete product. Clearly easier than a server — the server requires building everything before launch. The tube requires having a website. Which I already do.
