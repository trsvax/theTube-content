---
title: Siri Thought Capture
date: 2026-05-20
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: walk
summary: "Hey Siri, thought" — dictate, hit a URL, it's in the logs. Grep later, turn into journal entries. Works from the watch with a crown action.
---

On a walk. Have a thought. Don't want to stop and type. Don't want to lose it.

## The flow

1. "Hey Siri, thought: contact form is just comments without the post"
2. Siri Shortcut fires: `GET /events/thought/capture?text=contact+form+is+just+comments+without+the+post&origin=walk`
3. CloudFront logs it. 202. Done.
4. Back at the machine: grep the logs for `thought/capture`. Turn the good ones into journal entries.

Same pattern as comments, contact form, deploy events. A URL, a log entry, grep later.

## From the watch

Apple Watch Ultra — the Action Button maps directly to a Siri Shortcut. Press the button, dictate, done. No "Hey Siri," no complication tap, no phone needed. One physical button press to capture a thought into the log. The watch has cellular, hits the URL directly.

## The shortcut

1. Shortcuts app → new shortcut named "thought"
2. Action: Dictate Text (or take Siri input)
3. Action: Get Contents of URL → `https://thetube.today/events/thought/capture?text=[dictated text]&origin=watch`
4. Done. No app to build. No backend. The shortcut is the app.

## Why not Apple Notes

Apple Notes works but it's a silo. The thought is trapped in iCloud until you manually copy it out. Hitting a URL puts it in the same log as everything else — same grep, same MCP reader, same workflow. One namespace.

## The origin field

`origin=walk` or `origin=watch` or `origin=bike`. When you grep later, you know where the thought came from. The frontmatter `origin:` field in journal entries maps directly to this.

[journey]:
Walk thought (meta). Tried "Hey Siri, remind me when I get home" — works but the reminder is a dead end. A Siri Shortcut that hits a URL puts the thought in the same log as everything else. Same grep, same MCP, same namespace. Works from the watch too — crown action, dictate, done.
