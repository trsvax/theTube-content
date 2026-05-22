---
title: Old Tools, New Services
date: 2026-05-15
tags: [tech]
type: draft
summary: Unix pipes from 1969. Git from 2005. S3 from 2006. GitHub Actions from 2019. The stack is built from old ideas running on new infrastructure. The innovation is refusing to add a layer.
workflow: published
---

Unix pipes are from 1969. Git is from 2005. S3 launched in 2006. GitHub Actions in 2019. None of it was invented for a personal blog. All of it composes cleanly anyway, because the interfaces are simple: files, text streams, HTTP.

The instinct when building something new is to reach for something new. A CMS for the content. A server for the dynamic bits. A framework for the framework. Each addition solves a real problem and creates three new ones — another service to pay for, another API to learn, another thing to go down on a Sunday.

The alternative is to ask whether a file and a checkout step does the same job.

## The interfaces that survived

Doug McIlroy's pipe survived because the interface was right: text in, text out. Not because Unix was the best operating system or Bell Labs was the best lab. The interface was so simple it composed with everything, including tools that didn't exist yet.

HTTP survived for the same reason. A request and a response. The web is 35 years of software that assumed almost nothing about the other side.

Git's interface is a directed acyclic graph of content-addressed objects. That's it. Everything else — branches, remotes, GitHub, Actions — is built on top of that one idea.

S3's interface is a key and a value. Every key returns its value over HTTP. That's the whole API.

These aren't the most powerful interfaces in their category. They're the most composable. They assumed the least about what would be built on top of them.

## 21st century services, 20th century ideas

S3 is just a filesystem that doesn't go down. GitHub Actions is just a shell that runs when you push. CloudFront is just a cache in front of a filesystem. Cognito is just a token issuer.

Each of them is a managed version of something that existed in 1995. The difference is that someone else operates the hardware, patches the software, and handles the capacity. The idea is the same.

This is what the cloud got right. Not new abstractions — managed versions of old ones. The organizations that used it best were the ones who noticed that S3 is a filesystem and treated it like one. The organizations that struggled were the ones who treated it as a new thing requiring new thinking.

## The innovation is restraint

Every time theTube could have added a layer, it didn't. No CMS — Markdown files and git. No server — static export and CloudFront. No npm package for each feature — four dependencies, the rest is code. No database — JSON files on S3.

The constraint isn't poverty. The stack has real authentication, real CDN, real CI/CD. It's not simpler than it needs to be. It's exactly as complicated as it needs to be, and no more.

That's the thesis: old ideas, well understood, running on infrastructure that makes them cheap and reliable. The web spent 30 years building complexity on top of simple interfaces. The move is to use the simple interfaces directly.

Doug McIlroy would recognize it. He'd probably wonder what took so long.

[journey]:
prev: the-diff-is-small
The capstone of the thread that started with a fork. The observation that unified it: Unix pipes from 1969, S3 from 2006, GitHub Actions from 2019 — old ideas running on new infrastructure. The innovation is refusing to add a layer.
