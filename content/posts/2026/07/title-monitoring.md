---
title: Title Monitoring
date: 2026-07-29
tags: [tech]
type: journal
audience: public
status: journaling
coffee: 1
summary: Travis County doesn't monitor property recordings for fraud. Williamson County does. The difference is a name-match on new filings — something a Lambda could do by scraping the public records portal. Grep the web for things you should know about.
workflow: draft
---

## The 2 AM realization

Home title theft is real in Travis County. The County Clerk's office acknowledges it on their site, TCAD has a consumer alert about forged deeds, and local law firms are writing blog posts about it happening to occupied homes. But unlike Williamson County next door, Travis County offers no monitoring service. No alerts. No screening.

The recording process: you bring a document with original signatures to the Clerk's office (or e-file through an authorized submitter), pay $25, and they stamp it. That's it. No verification that the grantor actually owns the property. No check that the notarization is legitimate. The Clerk's statutory duty is to record, not to authenticate.

A forged deed with a forged notary stamp becomes part of the official chain of title the moment it's recorded. You find out when someone tries to evict you from your own house, or when you try to refinance and discover you no longer own the property.

## What monitoring looks like

Williamson County uses a service called Property Fraud Alert (by Fidlar Technologies). You register your name. When any document is recorded with your name as grantor or grantee, you get an email or phone call. That's it. A name match on new filings. It doesn't prevent anything — it just tells you it happened so you can act before the damage compounds.

Travis County doesn't offer this. TCAD's property records update infrequently. The commercial alternatives are subscription services that function like LifeLock — monthly fees for what amounts to the same name-match automation.

## The pattern

This is the same pattern as everything else: poll a source, diff against known state, surface changes.

```
RSS reader:        fetch feed → compare items → surface new ones
Share system:      CloudFront logs → compare captures → surface new ones
Title monitoring:  county records → compare filings → alert on new ones
```

The source is `tccsearch.org` — Travis County Clerk's public records search. It's an ASP.NET WebForms app (Aumentum Recorder by Harris Recording Solutions). You accept a disclaimer, search by name, get back a list of recorded instruments with dates, types, and instrument numbers.

## The mechanism

A Lambda on a schedule. Daily is probably fine — title fraud doesn't need sub-second detection, it needs detection before the fraudster does something irreversible with their fake ownership.

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│ Scheduled Lambda │────▶│ tccsearch.org │────▶│ Compare to  │
│ (daily)          │     │ (scrape)      │     │ last state  │
└─────────────────┘     └──────────────┘     └──────┬──────┘
                                                     │ new?
                                                     ▼
                                              ┌─────────────┐
                                              │ Alert        │
                                              └─────────────┘
```

The Lambda:
1. Authenticates with tccsearch.org (accept disclaimer, get session)
2. Searches your name as both grantor and grantee
3. Parses the results — instrument number, date, document type, other party
4. Compares against `state.json` on S3 (last known set of recordings)
5. If new instruments appear that you didn't file → send an alert
6. Updates `state.json`

The alert is an email via SES. Or a push notification. Or a capture in the share system that shows up in the next review session. Whatever you already have.

## The scraping problem

ASP.NET WebForms is the worst thing to scrape. ViewState tokens, event validation strings, postback parameters that change every page load. The session is stateful and the form submissions carry invisible hidden fields that the server expects.

Two approaches:

**Headless browser** — Puppeteer/Playwright in the Lambda. Clicks through the disclaimer, fills the search form, reads the results. Reliable but heavy. Lambda needs more memory and a browser binary.

**HTTP replay** — Capture the exact sequence of requests (disclaimer acceptance POST, search POST with ViewState), replay them. Lighter but fragile — any UI change breaks it.

The headless approach is more maintainable. A Lambda with Playwright is about 50MB zipped. It runs, clicks three things, reads a table, exits. Cost: fractions of a penny per day.

## Grep the web

The deeper idea: you should be able to "grep" the web for things relevant to you. Not in real time — on a schedule. Not everything — specific sources, specific patterns.

- County records for your name
- Court filings in your jurisdiction
- Domain expiration for domains you care about
- Business filings for companies you're involved with
- Patent filings in your space
- Regulatory changes that affect you

Each one is the same Lambda pattern: fetch, parse, diff, alert. The sources are all public. The automation is trivial. The value is knowing something happened before it becomes a problem.

Commercial services charge monthly subscriptions for each of these. What they're actually doing is running a cron job against a public data source. The value they add is knowing which source to check and how to parse it. Once you know that, the monitoring is a Lambda and a JSON file.

## Why this doesn't exist as a service

It does — as fragmented subscription products. LifeLock for identity. Commercial title monitoring for property. Google Alerts for mentions. PACER alerts for court filings. Each one charges separately for the same basic operation: watch a source, tell me when something new appears with my name on it.

Nobody aggregates them because the business model is per-vertical subscriptions. A general "grep the web for my name across all public records" tool would cannibalize a dozen SaaS products. So nobody builds it.

But for a personal system — a Lambda that knows your name, your property, your domains, your interests — it's one pattern, many sources. The share system already has the capture mechanism. The review session already has the surfacing mechanism. The monitoring sources are just new inputs to the same pipeline.

[journey]:
prev: apple-maps-extraction
Title fraud in Travis County is real and unmonitored. The County Clerk records any deed without authentication. Williamson County offers free name-match alerts via Property Fraud Alert (Fidlar Technologies). The DIY version: a daily Lambda scrapes tccsearch.org for new recordings against your name, diffs against known state, alerts on changes. Same pattern as RSS, same pattern as captures. The general concept: grep the web on a schedule for things you should know about. Every commercial monitoring service is just a cron job against a public source — the only barrier is knowing which source and how to parse it.
