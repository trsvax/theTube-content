---
title: Don't Let Your Repo Be a Junk Drawer
date: 2026-05-16
tags: [tech]
type: post
summary: The private repo started with fonts and ended up with Lambda code and CDK stacks. "Private" is not a concern — it's an access control label. The fork isn't a fix — it's an upgrade, and upgrades are cheap.
workflow: published
---

I wanted the repo public. Open source, forkable, the whole thing. But the fonts blocked it — licensed typefaces can't live in a public repo. So I split them out into a private repo and made the main repo public.

The fork happened before I even realized I'd forked it.

While that private repo was sitting there, other things moved in. Private posts. The auth Lambda. The CDK infrastructure stack.

Everything landed in one private repo because it shared one property: not public.

That's not a concern. That's an access control label. Organizing a repo around it is like organizing a codebase around "files created on a Tuesday." The fonts, the private posts, the Lambda, and the CDK stack have nothing to do with each other. They change at different rates, for different reasons, by different people someday. I don't want my graphic designer committing vibe coded auth Lambda functions. I'll do that.

The private repo was a monorepo in disguise. It took a while to notice.

## Fork when it's full

The private repo wasn't broken — it worked. It was full. Fonts + Lambda + content + infra all in one place works until you want to give your graphic designer repo access, or add a third collaborator, or swap the builder. Then it's not broken, it's stuck.

The move was to fork — pull the private content out of the infra repo, give it its own repo, point the deploy pipeline at both. Two checkout steps instead of one. The content didn't change. The infra didn't change. Only where things lived changed.

That's what makes repos pluggable. Builders don't care which content repos they pull from — they care that the repos exist at checkout time and contain markdown files in the right directory. Swapping one repo for two is a deploy.yml change, not a rewrite. The interface is the contract.

This is extract module at repo scale. In code: you notice two things are tangled, you extract a function, a class, a module. The caller doesn't change — it imports from a new location. In repos: you notice two concerns are tangled, you fork. Builders don't change — they check out from a new location.

## You don't design it upfront

Every fork in this project came from noticing something was stuck, not from planning it in advance. Content and builder were stuck — fork. Private content and infra were stuck — fork. The organization emerged from the constraints.

That's fine. The cost of reorganizing is low because the interface is thin: a directory convention and a checkout step. As long as that holds, the internals can move freely. You can iterate toward the right structure instead of having to predict it.

The fork doesn't hide the history. It records it. The content _did_ live with the builder. The private posts _did_ live with the Lambda. That's honest. The commit that extracts them is the refactor, visible in the log.

## What the pipe makes possible

Split right, the whole thing is a pipeline. Sources — any number of content repos — feed builders. Builders produce files. The files go to S3. CloudFront distributes them. Any HTTP client consumes them.

Having multiple builders is a feature. Next.js produces HTML pages. The indexer produces content.json files. A feed generator could produce an RSS feed. Each reads from the same content repos, each produces files, each is independent. Add one without touching the others.

Each stage does one thing and doesn't know about the others. S3 doesn't know what built the files. Builders don't know which client will read them. A new content repo is just another source — another checkout, another directory merge, no other changes required.

The interface is just files. The content is portable. The fork that separated them made that possible.

[journey]:

> prev: doug-mcilroy-would-recognize-it
>
> First version written at the moment of doing the content/builder split — drafted before the work. Content copied to theTube-content [commit 927698e]. Builder updated and content/ removed from theTube [commit 58cd252]. 75 open issues closed in theTube with a note pointing to theTube-content. GitHub's new repo form doesn't include Creative Commons licenses — added CC BY 4.0 manually. The symlink (`content → ../theTube-content/content`) makes local dev work without changing any paths in the builder.
>
> Pulled back to draft after publishing — the post was right but incomplete. The private repo was the second mistake: fonts, private posts, Lambda, and CDK infrastructure all dumped together because they shared one property — not public. "Private" is not a concern. Rewrote to lead with that story and draw the fuller picture: you don't design the organization upfront, you fork when you notice the wrong thing is bundled.
>
> The meta-lesson: the post itself was a mistake that got fixed. Published wrong, pulled back, rewritten, retitled. Don't live with your mistakes — fix them. Same advice, applied to the post giving the advice.
>
> Relevant: Adam Savage reorganized his shop hardware into Sortimo containers, got it right — then realized the index (a flat list) was the wrong format. Rebuilt it as a wheel. Same lesson one level up: the organization can be right while the interface is still wrong. https://www.youtube.com/watch?v=EDdpMf_tv0w
>
> My son described his mom's painting process as a "continuous mess up." Insightful. Each mark is a mistake that changes what the next mark needs to be. The painting process isn't the plan — it's the accumulated responses to what went wrong or right. Same as the repo structure. Same as this post. Fix enough mistakes and you have art.
>
> I've done monorepos before. One checkout and git management is easier — those were real arguments. With AI, those aren't problems anymore. The case for keeping everything together gets weaker while the case for separating concerns stays the same.
>
> Before AI, this architecture was borderline for one person — managing multiple repos, keeping deploy workflows in sync, CDK + Lambda + CloudFront, debugging auth edge cases. Doable but miserable. With AI it's clearly one person. The cognitive overhead of context-switching between repos and build configs is exactly where AI helps most. This is designed for one person with AI, not a team without it.
