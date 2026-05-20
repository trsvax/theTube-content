---
title: Bluesky Handle
date: 2026-05-20
tags: [tech]
type: journal
audience: public
status: draft
coffee: 0
summary: Setting up thetube.today as a Bluesky handle. Your domain is your identity — no platform namespace required.
---

Got asked for my LinkedIn yesterday. Don't have one. But I do have a Bluesky account sitting empty at `trsvax.bsky.social`.

Noticed VS Code uses `@vscode.dev` as their Bluesky handle. That's just a DNS TXT record — Bluesky lets you prove domain ownership and use it as your handle. So `@thetube.today` instead of `@trsvax.bsky.social`.

## The steps

1. Bluesky Settings → Handle → "I have my own domain"
2. Add a DNS TXT record: `_atproto.thetube.today` → `did=did:plc:...`
3. Verify in Bluesky

Then the handle is `@thetube.today`. Same string as the business card. Same string as the URL. One identity, no platform in the middle.

## What's next

- Wire up `bsky: true` in frontmatter so deploy auto-posts to Bluesky
- The summary field becomes the post text, the OG image becomes the card thumbnail
- GitHub Actions does the crosspost — no manual step after `git push`

The whole social layer is: a DNS record and a deploy hook. No app to maintain, no feed to curate manually. Write, push, it shows up everywhere.
