---
title: creat Needs an E
date: 2026-05-21
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: walk
summary: The path was /log, then /events, now /create. The name catches up to what the system actually does — it creates files. Ken Thompson's one regret, fixed.
---

Ken Thompson said if he could change one thing about Unix, he'd spell `creat` with an 'e'. Forty years later I'm adding it.

## The naming journey

Started with `/log`. That's what I thought it was — logging. A side effect. Something happened, write it down.

Renamed to `/events`. Better — it's not just a log, it's a thing that occurred. But still passive. Still observation. "An event was captured." By whom? For what?

Now: `/create`. Because that's what's actually happening. You're creating a file. A thought, a bookmark, a comment — each one becomes a file in S3. The endpoint doesn't observe. It makes.

```
/create/thought?text=...     → creates a file
/create/bookmark?url=...     → creates a file  
/create/comment?post=...     → creates a file
```

## Why it matters

The name reveals what you think the system *is*. `/log` says "I'm a side effect." `/events` says "I'm a bus." `/create` says "I'm a filesystem operation."

Plan 9's `create` syscall makes a file in a namespace. That's exactly what this does — makes a file in S3, addressable by URL, in a namespace scoped by path. The URL *is* the filename. The query string *is* the content. The 202 *is* the acknowledgment that the file was created.

## The refactor

The git notes from previous sessions describe the intent: "capture thoughts from the watch," "log bookmarks from Safari," "record comments." The intent never mentions `/events`. It mentions what's being *created*. The path can change because the notes describe the *what*, not the *where*.

That's the regression test. If the notes still make sense after the rename, the rename is safe.

## creat(2)

```c
int creat(const char *pathname, mode_t mode);
```

Six characters because early C compilers limited external identifiers to six. A technical constraint that became a permanent scar on the API. Thompson's regret wasn't about design — it was about a name that didn't say what it meant.

`/create` says what it means.

[journey]:
Walk thought. The path naming went /log → /events → /create. Each rename was understanding what the system actually does. It's not logging. It's not event capture. It's file creation. Same as Plan 9's create syscall — make a file in a namespace. The 'e' that Unix left out.
