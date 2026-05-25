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
workflow: published
---

On a walk. Have a thought. Don't want to stop and type. Don't want to lose it.

## The flow

1. "Hey Siri, thought: contact form is just comments without the post"
2. Siri Shortcut fires: `POST /tube/thought/capture?text=contact+form+is+just+comments+without+the+post&origin=walk`
3. CloudFront logs it. 202. Done.
4. Back at the machine: grep the logs for `thought/capture`. Turn the good ones into journal entries.

Same pattern as comments, contact form, deploy events. A URL, a log entry, grep later.

## From the watch

Apple Watch Ultra — the Action Button maps directly to a Siri Shortcut. Press the button, dictate, done. No "Hey Siri," no complication tap, no phone needed. One physical button press to capture a thought into the log. The watch has cellular, hits the URL directly.

## The shortcut

1. Shortcuts app → new shortcut named "thought"
2. Action: Dictate Text (or take Siri input)
3. Action: Get Contents of URL → `https://thetube.today/tube/thought/capture?text=[dictated text]&origin=watch`
4. Done. No app to build. No backend. The shortcut is the app.

## Why not Apple Notes

Apple Notes works but it's a silo. The thought is trapped in iCloud until you manually copy it out. Hitting a URL puts it in the same log as everything else — same grep, same MCP reader, same workflow. One namespace.

## The origin field

`origin=walk` or `origin=watch` or `origin=bike`. When you grep later, you know where the thought came from. The frontmatter `origin:` field in journal entries maps directly to this.

## Share Sheet

The same shortcut appears in the iOS Share Sheet. Any app that can share text or URLs can feed the log:

- **Safari** → share a URL. `type=bookmark&url=...&title=...`
- **Text selection** → share highlighted text from any app. `type=quote&text=...&source=app`
- **Photos** → share an image. `type=image&description=...` (the image itself doesn't hit the URL — just the metadata. The photo stays in iCloud. The log records that you flagged it.)
- **Maps** → share a location. `type=place&name=...&lat=...&lng=...`
- **Voice Memos** → share a recording. `type=audio&title=...` (same — log the event, not the file)

Each type maps to a different URL path: `/tube/thought/capture`, `/tube/bookmark/capture`, `/tube/place/capture`. Or one path with a `type` parameter. Either way — it's a POST, it's logged, grep later.

The Share Sheet is the input layer. The log is the storage. The MCP reader is the query layer. Same architecture, different entry point.

## Verified

Built the shortcuts. Fired them from Mac and phone. Checked the CloudFront logs:

```
14:12  DFW (phone)  type=thought&text=
14:35  DFW (phone)  type=bookmark&url=https://thetube.today/posts/siri-thought-capture
14:57  IAD (Mac)    type=bookmark&origin=mac&url=https://www.google.com/search?q=we...
```

All 202s. Both devices, both shortcut types, logged at the edge. The empty `text=` is from the Dictate action exiting immediately on Mac — it doesn't work well there. On the phone it works. The wiring is proven.

Lessons from the GUI:

- Shortcuts doesn't have a file format. No CLI, no import. The GUI is the only authoring surface.
- "Show in Share Sheet" doesn't sync between Mac and phone — you toggle it on each device.
- The Share Sheet on Mac was greyed out until Safari was quit and reopened.
- Dictate Text works on phone/watch, not Mac. Use "Ask for Input" on Mac.
- The variable pill has to be _inserted_ from the suggestions bar, not typed as text.
- One shortcut for phone/watch (Dictate), bookmarklet for Mac. Different input, same endpoint.

[journey]:
Walk thought (meta). Tried "Hey Siri, remind me when I get home" — works but the reminder is a dead end. A Siri Shortcut that hits a URL puts the thought in the same log as everything else. Same grep, same MCP, same namespace. Works from the watch too — crown action, dictate, done.
