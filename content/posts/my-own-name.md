---
title: My Own Name
date: 2026-05-21
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: walk
summary: Everyone wants to own my identity. LinkedIn, GitHub, Apple. I need a namespace that's mine — one domain that mounts all the services without being tied to any of them.
workflow: published
---

At a meetup everyone wants my LinkedIn. I don't have one. I give my GitHub but I don't want that either. I don't want to tie my identity to some random company that might pivot, paywall, or disappear.

What I want: one URL. Mine. `thetube.today`. That's the identity. What's behind it can change — S3 today, something else tomorrow. The address stays.

## The problem

My stuff is everywhere:
- Code on GitHub
- Photos in iCloud
- Posts in S3
- Events in CloudFront logs
- Books in another S3 path

Each service wants to be the canonical location. Each one is a silo. None of them talk to each other. And each one could change terms, shut down, or lock me out.

## The namespace

The domain is the namespace. Everything mounts under it:

```
thetube.today/                 → homepage (UI)
thetube.today/a/...            → aliases/redirects
thetube.today/w/...            → writes (CloudFront Function)
thetube.today/public/posts/... → public content (S3)
thetube.today/user/posts/...   → user content (S3, auth required)
thetube.today/books/...        → S3
thetube.today/.well-known/...  → S3 (identity, keys)
```

The data lives wherever makes sense. Apple can build the photo infrastructure. GitHub can host the repos. AWS can store the files. But the *address* is mine. The namespace is mine. The services are storage backends, not identities.

## Plan 9

Everything is a file. The namespace is composable. You mount remote filesystems into your local tree. The domain is the local tree. S3, GitHub, iCloud — those are the remote filesystems mounted where I want them.

At a meetup I hand someone `thetube.today`. Not linkedin.com/in/whoever. Not github.com/trsvax. My namespace. What they see is what I choose to show.

[journey]:
Walk thought. Frustrated by everyone wanting LinkedIn at meetups. The real need: a namespace that's mine, that mounts services without being owned by them. The domain is the identity. Everything else is plumbing.
