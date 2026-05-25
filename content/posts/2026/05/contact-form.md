---
title: Contact Form
date: 2026-05-20
tags: [tech]
type: journal
audience: public
coffee: 0
origin: walk
summary: Same pattern as comments. A form that hits /tube/contact/submit. CloudFront logs it. You grep when you want. The log is the inbox.
workflow: published
---

Same pattern as comments. A form, a URL, a log entry.

## The flow

1. Visitor fills out contact form → `POST /tube/contact/submit?name=...&email=...&message=...`
2. CloudFront logs it. Returns 202. Done.
3. You check when you want: `grep contact/submit` in the logs.

No email service. No form backend. No third-party widget. No spam filter needed — you read the log when you feel like it.

## Why it works

The events endpoint already exists. The CloudFront Function already returns 202. The logs already capture the full query string. Adding a contact form is adding a form. Zero infrastructure.

## The email field

It's `@pii` in the schema. The MCP log reader won't show it. You see it when you grep directly. The visitor trusts you with their email — not your tools.

[journey]:
prev: moderated-comments
Walk thought. Contact form is just comments without the post. Same URL pattern, same logging, same grep workflow. The log is the inbox. □
