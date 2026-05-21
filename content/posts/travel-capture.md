---
title: Travel Capture
date: 2026-05-21
tags: [tech, travel]
type: journal
audience: public
status: vague-thought
coffee: 0
summary: Share a photo while traveling, blog about it later. The log is the intent — "I saw something worth writing about." The photo stays in iCloud. The event stays in CloudFront.
---

The problem with travel blogging: you're busy traveling. You see something, take a photo, think "I should write about this." Then you don't, because you're on a train or in a bar or walking somewhere new. By the time you're back at the machine, you've forgotten which photos mattered and why.

## The capture

Share Sheet → "Save to Tube" → done. One tap while you're still looking at the thing.

```
/events/capture?type=image&description=temple+gate+at+sunset&origin=phone
```

The photo stays in iCloud Photos. It's already backed up, already synced, already organized by date and location. You don't upload it anywhere. You just log the intent: "this one matters."

## Back at the machine

Grep the logs:

```bash
grep "type=image" logs/*.gz | gunzip
```

A list of everything you flagged. Timestamps, descriptions, origin. Cross-reference with your photo library by date. Pull the ones you want into the post. Write.

## What the log gives you

CloudFront logs timestamp, IP, user-agent, and edge location on every request — free. So each capture event also tells you:

- **When** — timestamp to the second
- **Where** — the edge location (DFW, NRT, LHR) is a rough geo signal
- **What device** — user-agent distinguishes phone from watch from Mac

You didn't design any of that. It's just there because CloudFront logs everything.

## The photo doesn't move

This is the key insight. The photo is already in the best photo storage system ever built (iCloud Photos, or Google Photos, or whatever). It's backed up, searchable, organized. You don't need to move it to S3 to write about it.

What you need is a *pointer* — "this photo, at this time, mattered." The event log is that pointer. The photo stays where it is. The blog post references it by URL once you've exported and placed it.

## Future: EXIF in the query string

A smarter shortcut could extract EXIF metadata before logging:

```
/events/capture?type=image&lat=35.6762&lng=139.6503&ts=2026-05-21T09:30:00Z&description=temple+gate
```

Now the log entry has precise location and time. "Show me everything I flagged in Tokyo" becomes a query, not a memory exercise.

## The pattern

Same as everything else. A URL, a log entry, grep later. The capture device is whatever's in your hand. The storage is whatever already has the file. The log is the thread that connects them.

[journey]:
Realized the travel capture use case is the same events endpoint pattern — you're not uploading the photo, you're logging the intent. The photo stays in iCloud. The log is the breadcrumb trail back to the moments that mattered.
