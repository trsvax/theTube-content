theTube is a personal publishing system built on a simple constraint: static HTML first, everything else optional.

No server. No database. No CMS. The pages are files on S3, served through CloudFront. Authentication is real — signed cookies, Lambda@Edge, Cognito — but it sits on top of files. Remove the auth layer and the site still works. Remove the JavaScript and the site still works. It works in Lynx. It costs about $1 a month.

The architecture is its own argument for how much of the web doesn't need to be as complicated as it is.

## Content is the most portable thing

Posts are Markdown files with YAML frontmatter in a git repo. No proprietary format, no export button, no lock-in. The content repo is public. If this site disappears, the writing doesn't.

Every concern that evolves independently gets its own repo. Content in one. Design in another. The renderer wires them together at build time. The format agreement between repos — Markdown files, CSS, JSON — is the interface. Any tool that speaks the format can participate.

## The Unix pipe model

GitHub Actions is the shell. The content repo writes Markdown. The renderer reads it and produces HTML. CloudFront serves it. Each step does one thing. None of them need to know about each other beyond the format.

This is Doug McIlroy's pipe model applied to publishing. Small tools, clear interfaces, compose at the shell. The whole stack is four npm dependencies: Next.js, React, React DOM, marked.

## Built in public

Each idea starts as a GitHub issue, gets built, and gets written about. The code and the writing ship together. The posts about how this works are part of the thing that works.

The repo-as-package model means anyone can fork the renderer and point it at their own content. The Austin Healey restorer, the solo developer with a stack they want to own — fork it, bring your own content and design, deploy to your own S3 bucket. The renderer is the only shared thing.

## Source

- App: [github.com/trsvax/theTube](https://github.com/trsvax/theTube)
- Content: [github.com/trsvax/theTube-content](https://github.com/trsvax/theTube-content)
