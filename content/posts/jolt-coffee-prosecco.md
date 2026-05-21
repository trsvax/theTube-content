---
title: Jolt, Coffee, Prosecco
date: 2026-05-21
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: walk
summary: Story points are joyless. Jolt is the estimate, coffee is the effort, prosecco is the celebration. Same data as agile, different energy.
---

Story points mean nothing. "This is a 5." Five what? Five sadnesses? Five meetings about it?

## The units

- **Jolt** — the estimate. How many jolts of caffeine will this take? A 1-jolt task is a quick fix. A 5-jolt task is a full day of hard thinking.
- **Coffee** — the actual effort. How many coffees deep are you? Increments as you work.
- **Prosecco** — done. When there's prosecco, it shipped. The number is how much you're celebrating.

## In frontmatter

```yaml
jolt: 3
coffee: 2
prosecco: 0
```

Three jolts estimated. Two coffees in. No prosecco yet — still working.

```yaml
jolt: 3
coffee: 3
prosecco: 1
```

Shipped. Estimate was right. One glass.

## The project view

You already have:
- `status` — the kanban column
- `prev/next` — dependencies (the Gantt chart)
- `date` — timeline
- `jolt` — estimate
- `coffee` — effort
- `prosecco` — completion

That's everything a PM needs. It's in frontmatter. It's version-controlled. It's greppable. And it's fun to fill in instead of soul-crushing.

## vs. agile

Same data, different frame. Agile makes work feel like work. This makes work feel like coffee and champagne. The information content is identical — relative effort, progress, completion. The experience of tracking it is not.

[journey]:
Walk thought. Jab at agile story points. Can the same data (estimate, effort, done) live in frontmatter with units that are fun? Jolt = estimate, coffee = progress, prosecco = shipped.
