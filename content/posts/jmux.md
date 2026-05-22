---
title: jmux
date: 2026-05-20
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: walk
summary: A Python terminal multiplexer. Two panes — Kiro CLI and a live markdown preview. SSH in, jmux journal.md, resume where you left off. The state is in git.
workflow: published
---

tmux is powerful and complicated and needs brew. I just want two panes: a CLI on the left, a markdown preview on the right.

## The idea

```sh
ssh server
cd theTube-content
jmux content/posts/journal.md
```

Left pane: Kiro CLI (or any shell). Right pane: live preview of the markdown file, re-renders on save.

## Why Python

- `pty` module for spawning the CLI
- `curses` for split-screen rendering
- No brew, no compiled dependencies
- Python is already on every machine

## Resume

The session state is the file. The file is in git. SSH in from anywhere, `git pull`, `jmux journal.md` — you're back where you left off. Git notes tell you what happened last session. No tmux resurrect, no serialized state, no `.tmux` directory.

## What it doesn't need

- Plugin system
- Config file
- Multiple windows
- Detach/reattach (the state is in git, not in a running process)
- Anything beyond two panes and a file watcher

[journey]:
Walk thought. tmux is overkill for "CLI + preview." A Python script with curses and pty gives you the same thing with zero dependencies. The resume mechanism is git pull, not session persistence. The state is the file.
