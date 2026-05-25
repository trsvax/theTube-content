---
title: Monitoring Without a Monitor
date: 2026-05-17
tags: [tt:tech]
type: journal
audience: user
status: vague-thought
summary: Route 53 pings the URL. The browser reports errors to the log. Lambda@Edge failures show up in CloudFront access logs. No Datadog, no Prometheus. Just config.
workflow: published
---

No monitoring right now. Need some. But not a monitoring system — just the lego blocks doing one more thing.

## Uptime

Route 53 Health Checks ping `https://thetube.today` every 30 seconds from multiple regions. If it fails, SNS sends an email. That's it. One config, zero infrastructure.

## Errors

The browser reports to `/logs/error/js?msg=...&stack=...`. Query with Athena when you want. No real-time dashboard — you look when something feels wrong.

## Auth failures

Lambda@Edge returns 403 for unauthorized requests. Those are already in the CloudFront access logs. Filter by status code 403 in Athena — that's your auth failure report.

## Deploy health

GitHub Actions already reports success/failure. Could also log to `/logs/deploy/done?commit=...&status=success` for a unified view.

## What this doesn't need

- No Datadog ($15/host/month)
- No Prometheus (cluster to maintain)
- No PagerDuty (subscription)
- No Grafana (another service to run)
- No alerting rules to configure and maintain

Route 53 Health Check + CloudFront logs + Athena. All existing services. All config, no code.

## The pattern

Same as everything else: the data already exists (CloudFront logs every request). You just need to ask the right question at the right time. The monitoring is querying the log. The alerting is Route 53 pinging a URL.

## Don't monitor AWS with AWS

If Route 53 is down, it can't tell you it's down. An external check from a different provider is the failsafe. Uptime Robot free tier: 50 monitors, 5-minute intervals. Independent of AWS entirely.

Belt and suspenders: Route 53 for fast detection (30 seconds), Uptime Robot as the independent failsafe. Both free.

[journey]:
prev: the-backup-is-the-architecture
After backup, the next question is monitoring. Same answer: the lego blocks already do it. Route 53 for uptime, CloudFront logs for everything else, Athena for queries. No monitoring infrastructure needed.
