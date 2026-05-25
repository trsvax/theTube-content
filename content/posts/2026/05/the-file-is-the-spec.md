---
title: The File Is the Spec
date: 2026-05-15
tags: [tech]
audience: public
type: journal
summary: The markdown file doesn't just contain the post. It contains the spec for everything assembled around it — images, journey narrative, audience, status. One file, complete picture.
workflow: published
---

A post file on theTube looks like this:

```markdown
---
title: A Fork Is a Refactor
date: 2026-05-15
tags: [tech]
audience: public
---

Post body...

[design]: /images/posts/dont-let-your-repo-be-a-junk-drawer/og-image.png
[journey]: /journeys/dont-let-your-repo-be-a-junk-drawer.json
```

That file tells you everything:

- What the post says — the body
- What images it needs — the `[design]:` block, with the URL where the image will land
- Where the making-of lives — the `[journey]:` block, with the URL the browser will fetch
- Who can see it — `audience` frontmatter
- Whether it's done — `draft` frontmatter

No external project management tool. No CMS dashboard. No database row. The file is the source of truth for everything downstream.

## The renderer reads the spec

The main build reads the file and emits HTML. For `[design]:` blocks it emits an `<img>` pointing at the declared URL — or a placeholder if the image hasn't arrived yet. For `[journey]:` blocks it emits a `<details>` accordion that will fetch the declared URL when opened.

The renderer doesn't know or care whether the content at those URLs exists. It just knows the shape: image goes here, journey narrative goes there. Whether the delivery pipelines have run is not its problem.

## The delivery pipelines read the same spec

The design workflow reads `[design]:` blocks, checks whether the declared URL exists in S3, opens a GitHub issue if it doesn't. The journey workflow does the same for `[journey]:` blocks. Both read the same file the renderer reads. The spec is the contract between them.

When the designer closes the issue and commits the image, it lands at exactly the URL declared in the file. No configuration, no mapping table, no lookup. The URL in the file is the URL in S3.

## Two builds, one spec

The post body and the assembled content ship on different schedules. The main build runs when the post file changes. The journey build runs when a journey file is added or updated. They read from the same spec but produce independent outputs with independent CloudFront invalidation paths.

The post ships immediately. The journey arrives when it's written. The image arrives when it's designed. The accordion shows pending until the journey build has run. The `<img>` shows a placeholder until the design build has run.

The file declared what was needed. The pipes deliver it. The browser assembles it.

That's the whole system in one markdown file.

[journey]:
prev: old-tools-new-services
Related: markdown-is-a-programming-language (blocks as execution), content-is-the-most-portable-thing (own the spec, rent the implementation). This post is the URL contract angle — the file declares what it needs, pipes deliver independently, browser assembles lazily. Emerged from realizing that [journey]: and [design]: blocks are URL contracts, not embedded content. "The file is the spec" was the user's observation: "I think that is already a post."
