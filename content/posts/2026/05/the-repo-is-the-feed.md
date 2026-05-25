---
title: The Repo Is the Feed
date: 2026-05-15
tags: [tech]
audience: public
type: journal
summary: GitHub already generates an Atom feed of commits. The raw file URL is always current. The API lists all posts. Any service that can read GitHub can subscribe — no RSS generation, no separate feed file, no build artifact.
workflow: published
---

GitHub already generates an Atom feed for every repo: `github.com/trsvax/theTube-content/commits/main.atom`. New post, new commit, new feed entry. No RSS file to generate, no separate build step, no feed reader plugin.

The raw file URL is always current: `raw.githubusercontent.com/trsvax/theTube-content/main/content/posts/dont-let-your-repo-be-a-junk-drawer.md`. The GitHub API lists all posts with metadata. Any service that can read GitHub can subscribe to the content without touching the published site.

The repo is the feed. The question is whether the URL should say so.

## Own the feed URL

`raw.githubusercontent.com` is GitHub's domain. If the repo moves to GitLab or a self-hosted git server, the feed URL breaks. Every subscriber has to update their endpoint.

The fix is a redirect: `thetube.today/repo` → `github.com/trsvax/theTube-content`. The published domain owns the identity. The redirect target changes when the host changes. The feed URL never does.

`thetube.today/repo` is stable. `github.com/trsvax/theTube-content` is an implementation detail.

## The build fires the webhook

The build already knows what changed. After `next build`, a post-build step diffs `HEAD~1` against `HEAD`, finds new or modified post files, and fires a webhook per changed post — slug, frontmatter fields, event type. One call per post, full context, no parsing required by the receiver.

The receiver doesn't need to understand git. It gets:

```json
{
  "slug": "dont-let-your-repo-be-a-junk-drawer",
  "bsky": true,
  "event": "publish"
}
```

That's enough to crosspost to Bluesky, send a newsletter, update a search index, or notify a feed aggregator.

## The subscriber registry

Who gets called? A JSON file in S3 — private, not in the repo. Subscribers register by calling an endpoint: `POST thetube.today/subscribe`. A Lambda writes their URL to the registry. The build reads the registry at deploy time and calls each subscriber.

Self-service, private, no PR required. The registry is just an S3 file — edit it directly if needed. The subscribe endpoint is the only public surface.

Same pattern as any webhook registry. Just on infrastructure you already own.

## What this is

A publishing platform. Content in git, identity on your domain, subscribers self-registering, notifications fired by the build. No third-party feed service, no CMS, no platform dependency.

The pipe that started with a markdown file and a checkout step now reaches from content creation to reader notification. All from static files and a deploy workflow.

## The subscribe button

The webhook registry is the infrastructure. The subscribe button is the reader-facing end of the same pipe.

For general readers: a Bluesky crosspost. They follow the account, get notified when a post ships. No webhook, no setup.

For developers: a "Subscribe via webhook" link on the post page — opens a form at `thetube.today/subscribe`, pre-filled with the site. POST your endpoint URL, the Lambda adds it to the S3 registry, you get called on every new post.

Two audiences, two subscribe paths, one content source. The button on the post page is just the UI for what the build already does.

[journey]:
prev: the-file-is-the-spec
From a chain of observations: why not use the repo URL as the feed? Then own it with a redirect. Then have the build fire per-file webhooks. Then a subscriber registry in S3. Each step followed from the last. "That's a thought" — yes, and now it's a post.
