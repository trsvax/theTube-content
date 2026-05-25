---
title: Don't Let Your Repo Be a Junk Drawer
date: 2026-05-16
tags: [tech]
type: draft
summary: The private repo started with fonts and ended up with Lambda code and CDK stacks. "Private" is not a concern — it's an access control label. The fix is a fork, and forks are cheap.
workflow: published
---

Everything started in one repo because what else would you do. One push deployed everything. Simple.

The first problem was the fonts. Licensed typefaces can't live in a public repo. So a private repo was the obvious move. While I was there, private posts went in too. Then the auth Lambda. Then the CDK infrastructure stack.

Everything landed in one private repo because it shared one property: not public.

That's not a concern. That's an access control label. You can't organize a repo around it any more than you can organize a codebase around "files that happen to be large." The fonts, the private posts, the Lambda, and the CDK stack have nothing to do with each other. They change at different rates, for different reasons, by different people someday. I don't want my graphic designer committing auth Lambda code.

The private repo was a monorepo in disguise. It took a while to notice.

## Fork when it's wrong

The fix was to fork again — pull the private content out of the infra repo, give it its own repo, point the deploy pipeline at both. Two checkout steps instead of one. The content didn't change. The infra didn't change. Only where things lived changed.

That's what makes repos pluggable. Builders don't care which content repos they pull from — they care that the repos exist at checkout time and contain markdown files in the right directory. Swapping one repo for two is a deploy.yml change, not a rewrite. The interface is the contract.

This is extract module at repo scale. In code: you notice two things are tangled, you extract a function, a class, a module. The caller doesn't change — it imports from a new location. In repos: you notice two concerns are tangled, you fork. Builders don't change — they check out from a new location.

## You don't design it upfront

Every fork in this project came from noticing something was wrong, not from planning it in advance. Content and builder were wrong — fork. Private content and infra were wrong — fork. The organization emerged from the mistakes.

That's fine. The cost of reorganizing is low because the interface is thin: a directory convention and a checkout step. As long as that holds, the internals can move freely. You can iterate toward the right structure instead of having to predict it.

The fork doesn't hide the history. It records it. The content _did_ live with the builder. The private posts _did_ live with the Lambda. That's honest. The commit that extracts them is the refactor, visible in the log.

## What the pipe makes possible

Split right, the whole thing is a pipeline. Sources — any number of content repos — feed builders. Builders produce files. The files go to S3. CloudFront distributes them. Any HTTP client consumes them.

That builders is plural is a feature. Next.js produces HTML pages. The indexer produces content.json files. A feed generator could produce an RSS feed. Each reads from the same content repos, each produces files, each is independent. Add one without touching the others.

Each stage does one thing and doesn't know about the others. S3 doesn't know what built the files. Builders don't know which client will read them. A new content repo is just another source — another checkout, another directory merge, no other changes required.

The interface is public. The content is portable. The fork that separated them made that possible.

[journey]:
prev: doug-mcilroy-would-recognize-it
First version written at the moment of doing the content/builder split — drafted before the work. Content copied to theTube-content [commit 927698e]. Builder updated and content/ removed from theTube [commit 58cd252]. 75 open issues closed in theTube with a note pointing to theTube-content. GitHub's new repo form doesn't include Creative Commons licenses — added CC BY 4.0 manually. The symlink (`content → ../theTube-content/content`) makes local dev work without changing any paths in the builder.

Pulled back to draft after publishing — the post was right but incomplete. The private repo was the second mistake: fonts, private posts, Lambda, and CDK infrastructure all dumped together because they shared one property — not public. "Private" is not a concern. Rewrote to lead with that story and draw the fuller picture: you don't design the organization upfront, you fork when you notice the wrong thing is bundled.
