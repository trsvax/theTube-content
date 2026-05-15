---
title: The Pattern Generalizes
date: 2026-05-15
tags: [tech]
type: draft
summary: Content got its own repo. Design is next. Every concern that evolves independently gets its own repo — that's the pattern, not the exception.
---

Forking content out of the app repo was the first move. The post about it is already up. The short version: content and renderer don't share a concern, so they don't share a repo.

The same argument applies to design.

CSS, fonts, color scheme, layout — none of that is the renderer's job. The renderer knows how to read markdown and produce HTML. It doesn't need to know that the body font is Martian Mono or that the border color is `#e5e5e5`. Those are design decisions. They evolve on a different cadence than the renderer, and on a different cadence than the content.

## What the fork creates

`theTube-design` would hold what's currently scattered across `globals.css`, `public/fonts/`, and the font-loading logic in `layout.tsx`. The renderer checks it out at build time and applies it, the same way it checks out `theTube-content` for posts.

Someone forking the renderer gets a blank design, not mine. They bring their own fonts, their own color palette, their own typographic choices. Right now a fork of theTube is a fork of my aesthetic. That's the wrong default.

## The three-repo structure

App, content, design — three repos, three concerns, three independent evolution paths.

Content changes when I write something. Design changes when I want a different look. The renderer changes when I need a new feature. None of those events need to happen together. Coupling them in one repo was convenient at the start and wrong in the long run.

The footer already shows all three commit SHAs. The structure is ready for the fork. The work is just naming the boundary and making it explicit.

Every concern that evolves independently gets its own repo. That's the pattern, not the exception.

[journey]:
prev: a-fork-is-a-refactor
Wrote this before doing the work — same as the content fork post. The design repo doesn't exist yet. Stability first, then the fork.
