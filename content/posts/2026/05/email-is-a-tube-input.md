---
title: Email Is a Tube Input
date: 2026-05-31
tags: [tech]
type: journal
audience: public
status: journaling
coffee: 1
origin: chat
summary: Route all email to S3 via SES. AI classifies it. Forward the important ones. Daily summary of the rest. Your inbox only gets what matters.
workflow: draft
---

Email arrives. SES saves it to S3. It's a file now.

```
/fs/tube/email/2026/05/31/abc123.eml
```

Same pattern as everything else. The tube doesn't care what the input is — a photo from iOS, a request from the WebDAV server, an email from a stranger. It's all files.

## AI classifies it

The processor reads the email, sends it to Bedrock (Claude Haiku), gets back a label: spam, newsletter, personal, action-needed. Writes the result next to the email.

```
/fs/tube/email/2026/05/31/abc123.eml
/fs/tube/email/2026/05/31/abc123.result    → { "classification": "newsletter" }
```

Cost: ~$0.12 per 1000 emails. Basically free.

## Forward the important ones

If classified as `action-needed` or `personal`, forward it to my real inbox immediately. The rest stays in the tube.

## Daily summary

One email at end of day:

```
Today: 3 action-needed, 12 newsletters, 47 spam, 2 personal

Action needed:
- "Invoice #4521" from billing@...
- "PR review requested" from github@...
- "Flight change" from airline@...
```

My real inbox only gets what matters + one digest. Everything else is in the tube if I want it. Searchable, browsable, classified. But it doesn't interrupt me.

## The cost

- SES receiving: free (1000/month), then $0.10/1000
- S3 storage: pennies
- Bedrock classification: $0.12/1000 emails
- Daily Lambda: one invocation
- SES sending: free (62k/month)

A dollar a month at personal scale. Linear cost at any scale.

## All the doors

Every AWS input channel routes to the same place — a file in S3:

| Channel | Service | Cost | Lands as |
|---------|---------|------|----------|
| HTTP | CloudFront + API Gateway | Free tier | `tube/{path}/{id}.json` |
| Email | SES | Free–$0.10/1000 | `tube/email/{id}.eml` |
| SMS | Pinpoint | $1/mo + $0.0075/msg | `tube/sms/{id}.json` |
| Voice | Pinpoint/Connect | $1/mo + $0.013/min | `tube/voice/{id}.mp3` |
| WhatsApp | Pinpoint | $0.05/conversation | `tube/whatsapp/{id}.json` |
| Webhook | API Gateway | Free tier | `tube/webhook/{source}/{id}.json` |
| IoT | IoT Core | $1/million msgs | `tube/iot/{device}/{id}.json` |
| Photos | iOS Shortcut → presigned PUT | Free | `tube/share/{id}.heic` |
| Facebook | Messenger webhook (Page) | Free | `tube/facebook/{id}.json` |
| LinkedIn | Webhooks (Company Page) | Free | `tube/linkedin/{id}.json` |

One processor. One filesystem. One summary. The tube doesn't care which door you used.

Facebook and LinkedIn both offer webhooks for Pages/Company Pages — incoming messages, comments, mentions all route to your API Gateway. Personal accounts are walled, but Pages are open. The business model tells you who'll cooperate: platforms that want you to build on them give you webhooks. Platforms that don't want you to leave don't.

## Add compute when you observe the need

I didn't start with an email system. I started with a tube. Email is just another input. The classification is just another handler in the processor. The daily summary is just another scheduled Lambda. Each piece added when the need appeared, not guessed upfront.

## Everything on the Mac is already a file

The Apple cloud you can own is the Mac itself. The data is already there:

| Source | What you get |
|--------|-------------|
| Messages | All iMessage/SMS conversations |
| Notes | All Apple Notes |
| Calendar | Events |
| Reminders | Tasks |
| Contacts | Everyone |
| Safari | History + bookmarks |
| Photos | Library index |
| Screen Time | App usage, pickups |
| Keychain | Credentials (Touch ID gated) |

All SQLite databases or plists. Already on disk. The WebDAV server reads them as providers:

```
/fs/apple/messages/
/fs/apple/notes/
/fs/apple/calendar/
/fs/apple/contacts/
/fs/apple/safari/history/
```

Your entire digital life is already on your Mac as files. Apple just didn't give you a unified interface to it. The local WebDAV server is that interface. Push any of it to the tube for classification, summaries, search — same processor, different input.

## Photos from the phone

Take a photo. Share it via iOS Shortcut. It lands in S3. By the time you get home, it's processed, thumbnailed, browsable at `/fs/tube/share/`. The share system was the first tube input — same pattern as email, SMS, messages. Just a different door.

## The summary is a file

```
GET /fs/summary/today
```

The WebDAV server computes it on read — feeds today's inputs to the AI, returns a summary. No cron job. No stored file that goes stale. You read it, it computes. Fresh every time.

`cat /fs/summary/today` — that's your daily briefing.

## The AI is a lens, not a gate

Everything lands in the tube. Everything is a file. The AI just decides what to surface. The spam is still there if you want it. The AI classifies, you decide. The filesystem is the truth. The summary is a view.

[journey]:
prev: the-ticket-machine
Everything is a tube input. Email, photos, form submissions, API requests. The tube doesn't care. It's all files. AI is just another processor in the back room.
