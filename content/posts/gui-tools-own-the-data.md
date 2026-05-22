---
title: GUI Tools Own the Data
date: 2026-05-15
tags: [tech]
type: draft
summary: Squarespace owns your content. Substack owns your subscribers. Notion owns your notes. The GUI is the lock-in mechanism. The pipe doesn't own anything — it's just files, and files predate every tool in the stack.
workflow: published
---

The GUI isn't just hiding the dataflow. It's capturing it.

Squarespace owns your content. Substack owns your subscribers. Notion owns your notes. The interface is the product; the lock-in is the business model. You can see your data through the interface they provide, export it in the format they choose, on the schedule they permit — if they permit it at all.

The pipe doesn't own anything. git owns nothing — it's a format. S3 owns nothing — it's a bucket. The data is yours because it's just files, and files predate every tool in the stack.

## It's all in the file

The post file contains everything: the content, the delivery spec, the audience, the status, the image placeholder, the making-of narrative. One file, complete picture. No database row that only makes sense inside the platform's schema. No proprietary format that requires their export tool to read.

A markdown file with YAML frontmatter is readable by any text editor that has ever existed. It will be readable by any text editor that will ever exist. The format is stable because it has no owner.

## The files are in the repo

Versioned, diffable, distributable. The full history of every change — when a post was drafted, when it was published, when a typo was fixed — is in the git log. No audit trail to request from a support team. No "activity history" that disappears when you downgrade your plan.

The repo is the database. The commit is the transaction log. The diff is the changelog. All of it is yours, locally, without asking.

## The repo can be anywhere and everywhere

git doesn't care where it lives. GitHub today, GitLab tomorrow, a self-hosted Gitea on a VPS in parallel, a NAS in the basement as backup. Clone to a new machine and you have everything — full history, full content, full spec. No migration tool, no export process, no data portability request.

Squarespace's export is a ZIP file you have to remember to download. Your content is already on GitHub, on every machine you've cloned to, and in S3. Three independent copies as a side effect of normal workflow. Push to a friend's machine and there's a fourth.

That's distribution as a property of the format, not a feature of the platform. The GUI tools make distribution a product they sell you. git makes it the default behavior of the tool.

## The platform is where you run git today

The GUI tools sell the illusion that the platform is necessary. The file is what's necessary. The platform is just where you happen to be running git today.

When the platform changes its terms, raises its prices, or shuts down — and they all eventually do one of those things — the content doesn't move. It's already everywhere. The only thing that changes is which remote you push to.

That's the case for the pipe over the GUI. Not that pipes are more convenient — they're not, at first. But that pipes don't own what flows through them.

[journey]:
prev: the-repo-is-the-feed
From three observations in sequence: "GUI tools own the data" → "with git I can independently spread it everywhere" → "it's all in the file, the files are in the repo, the repo can be anywhere and everywhere." That last sentence is the post.
