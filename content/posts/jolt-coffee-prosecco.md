---
title: Jolt, Coffee, Prosecco
date: 2026-05-21
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: walk
specLink: .kiro/specs/jolt-coffee-prosecco
summary: Story points are joyless. Jolt is the estimate, coffee is the effort, prosecco is the celebration. Same data as agile, different energy.
---

Story points mean nothing. "This is a 5." Five what? Five sadnesses? Five meetings about it?

## The units

- ⚡ **Jolt** — the estimate. How many jolts of caffeine will this take? A 1-jolt task is a quick fix. A 5-jolt task is a full day of hard thinking.
- ☕ **Coffee** — the actual effort. How many coffees deep are you? Increments as you work.
- 🥂 **Prosecco** — done. When there's prosecco, it shipped. The number is how much you're celebrating.

## The math

Prosecco is derived from the gap between estimate and effort:

```
prosecco = (jolt - coffee)² / coffee + 1
```

The curve is U-shaped. Beat the estimate by a lot? Popping bottles — celebration prosecco. Hit it exactly? One glass. Went way over? Also drinking — that's coping prosecco. The minimum is 1, right at the sweet spot where effort matches the estimate.

## In frontmatter

```yaml
jolt: 5
coffee: 1
prosecco: 17
```

We thought this was hard. It wasn't even close. Seventeen glasses.

```yaml
jolt: 5
coffee: 5
prosecco: 1
```

Estimate was right. One glass. Solid.

```yaml
jolt: 3
coffee: 8
prosecco: 4
```

We thought this was easy. It wasn't. Four glasses — but nobody's celebrating.

## The project view

You already have:
- `status` — the kanban column
- `prev/next` — dependencies (the Gantt chart)
- `date` — timeline
- `jolt` — estimate
- `coffee` — effort
- `prosecco` — completion

That's everything a PM needs. It's in frontmatter. It's version-controlled. It's greppable. And it's fun to fill in instead of soul-crushing.

The [spec](https://github.com/trsvax/theTube/blob/main/.kiro/specs/jolt-coffee-prosecco/requirements.md) has the full requirements.

## The lifecycle

- `vague-thought` — just captured. No estimate. `jolt: 0, coffee: 0, prosecco: 0`
- `thought` — committed to finishing it. Set `jolt:` now. That's the estimate.
- `draft` — working. `coffee` increments each session.
- `published` — shipped. Set `prosecco: (jolt - coffee)² / coffee + 1`.

The jolt gets set at the moment you decide "this is worth finishing" — the transition from vague-thought to thought. Before that, estimating is premature. After that, you're already working.

## The rules

- ⚡ **Jolt** — set once, at the thought transition. Never changes. If it was wrong, the gap tells you.
- ☕ **Coffee** — increments as you work. Honest count. The agent tracks it.
- 🥂 **Prosecco** — derived at publish. The further from the estimate, the more you're drinking. Whether that's celebration or coping depends on which direction you missed.

No decrementing. No punishment. The numbers tell the story by diverging or converging.

## vs. agile

Same data, different frame. Agile makes work feel like work. This makes work feel like coffee and champagne. The information content is identical — relative effort, progress, completion. The experience of tracking it is not.

<small>Not an endorsement of drinking — it's a metaphor. But you knew that.</small>

[journey]:
Walk thought. Jab at agile story points. Can the same data (estimate, effort, done) live in frontmatter with units that are fun? Jolt = estimate, coffee = progress, prosecco = derived from the gap. The better things go, the more prosecco.
