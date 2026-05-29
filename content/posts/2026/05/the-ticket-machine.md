---
title: The Ticket Machine
date: 2026-05-29
tags: [tech]
type: journal
audience: public
status: journaling
coffee: 1
origin: chat
summary: The tube Lambda doesn't need to write to S3. It just needs to decide who gets a ticket. The presigned URL is the permission. The data goes direct.
workflow: draft
---

The tube Lambda currently does three things: validate JWT, write to S3, return 202. But what if it only did one: validate JWT, return a presigned PUT URL.

The client writes directly to S3. The Lambda never sees the data. No 6MB payload limit. No base64 encoding. No timeout on large uploads. The data goes from your machine to S3 without touching compute.

The dry cleaner with lockers. Get a key from the register once, put your stuff in the locker yourself. After that, don't go to the register — just use the locker. The register never touches your clothes.

## The flow

```
Client                    Tube Lambda              S3
  |                           |                     |
  |-- GET /tube/ticket ------>|                     |
  |   (JWT + path)            |                     |
  |                           |-- validate JWT      |
  |                           |-- generate          |
  |                           |   presigned PUT     |
  |<-- 200 { url, key } -----|                     |
  |                           |                     |
  |-- PUT {presigned URL} --------------------------->|
  |   (body goes direct)                            |
  |<-- 200 ------------------------------------------|
  |                                                 |
  |                              S3 event fires     |
  |                              processor runs     |
```

The tube Lambda becomes a ticket machine. That's it.

## Write once or write all day

The presigned URL expiry is the permission duration:

- **Write once** — 5-minute TTL, scoped to one exact key. Use it or lose it.
- **Write all day** — 24-hour TTL, scoped to a prefix. Upload as many photos as you want.

Same Lambda, same auth check, different TTL based on the JWT's scope. The ticket machine decides how generous to be with the ticket.

The Mac gets write-all-day. The iOS Shortcut gets write-once. Same tube, different trust levels, expressed as URL expiry.

## Without a ticket

No valid presigned URL → PUT to S3 fails → 403 from AWS. It never touches my infrastructure. AWS rejected it at their door. Their logs, their problem.

CloudFront still logs the *attempt* to get a ticket. So I see who tried. But the bucket never sees unauthorized writes.

## What's left of the Lambda

50 lines of JWT validation + one `getSignedUrl()` call. Maybe 60 lines total. The tube Lambda is a ticket machine and nothing else. It doesn't write. It doesn't read. It doesn't process. It decides.

## Two intents, not three

It's not about body size. It's about intent:

1. **Log it** — data in the URL. CloudFront logs it. I just want a record that this happened. Fire and forget. No compute.
2. **Store it** — I want a locker. A place to put something and get it back later. Get a ticket, put it in the slot, come back for the result.

A capture is a note — log it. A photo is an artifact — store it. A request that needs a result is a locker — put the request in, come back for the result.

The tube has two doors. The URL is the log. The ticket is the locker.

[journey]:
prev: tube-request
Evolution: the tube Lambda doesn't need to be a pipe. It's a ticket booth. The presigned URL is the permission. The data goes direct. Less code, less compute, less surface area.
