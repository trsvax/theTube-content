---
title: Hotel Booking Without a Server
date: 2026-05-17
tags: [tt:tech]
type: journal
audience: user
status: vague-thought
summary: A hotel booking system built on files at URLs. The only transaction is a DynamoDB conditional write. Everything else is static files and events.
---

Can the files-at-URLs architecture handle something that actually needs state? Hotel booking is the classic example — availability changes, bookings are atomic, payments need confirmation. Let's see.

## The pieces

- **Hotel catalog** — a JSON file per hotel. Rooms, rates, photos, amenities. Static, updated by the hotel when rates change. A file at a URL.
- **Availability** — a file per hotel per date range. Updated when bookings happen. The browser reads it to show what's open.
- **Search** — DynamoDB. "Hotels in Austin, May 20-22" → returns URLs to hotel files. Or a static search index if the catalog is small enough.
- **Booking** — `/events/booking?hotel=xyz&room=101&dates=may20-22&guest=barry`. Lambda validates availability, writes the booking, updates availability. Sub-second.
- **Payment** — Stripe checkout. Redirect to Stripe, webhook hits `/events/payment/confirmed`. Lambda updates booking status.
- **Confirmation** — a file at a URL. `bookings/abc123.json`. Guest gets the URL. That's their confirmation.
- **Audit** — every request logged by CloudFront. Immutable. Who booked what, when.

## The one transaction

"Is this room still available AND book it" needs to be atomic. DynamoDB conditional writes: "update availability IF room count > 0, decrement by 1." One operation, atomic, no database server running. Costs fractions of a penny per booking.

That's the only part that genuinely needs transactional semantics. Everything else is files.

## Cost

At 100k bookings/month:
- CloudFront: ~$3
- Lambda: ~$2-5
- DynamoDB: ~$10-15
- S3: ~$1
- Stripe fees: 2.9% + $0.30 per transaction (that's Stripe's problem)

Total infrastructure: $20-30/month for a booking system that handles 100k reservations. No server. No database cluster. No ops team.

## What this proves

If hotel booking works on this architecture, most web applications do. The pattern handles: catalogs (files), search (index), user actions (events), atomic state changes (conditional writes), payments (webhooks), confirmations (files), and audit (logs).

The thousand abstractions — booking engines, reservation systems, availability managers, payment orchestrators — collapse into: files, URLs, functions, CDN.

[journey]:
prev: a-thousand-abstractions
Asked "could this build hotel booking?" after establishing the architecture handles auth, events, logging, and scale. The answer is yes — the only genuinely transactional part is a single DynamoDB conditional write. Everything else is the same pattern.
