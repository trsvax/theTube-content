---
title: HTML Is Assembly
date: 2026-05-16
tags: [tech]
type: draft
summary: Markdown is nothing like HTML to a human writer. That's the point. The web's instruction set is the wrong level for writing.
workflow: published
---

To a human writer, markdown is nothing like HTML. That's not an accident — it's the whole design.

HTML is a markup language. You're annotating content with tags. The tags are always there, always visible, always competing with the words. Reading the raw source, you're reading two things at once: the content and the instructions. Writing it is the same — you're managing the document and managing the language simultaneously.

Markdown disappears into the prose. `**ran**` feels like emphasis. `> quote` feels like a blockquote. A writer reading the raw source barely notices the syntax. That's not simplification — it's a completely different model.

## HTML became pixel-perfect

HTML started as a structural format: headings, paragraphs, links, lists. Semantic, presentation-agnostic. The same document could render in a terminal, a browser, a screen reader, a printer — each surface made its own layout decisions.

Then CSS arrived. Then designers got involved. HTML became complicit in layout, and eventually in pixel-perfect control. A modern webpage is a precise spatial instruction set. Designers work in it like a canvas. Every margin, every color, every animation is specified.

Markdown has none of this. No position, no alignment, no sizing, no color. The only spatial information in a markdown document is the order of the paragraphs. That's the only layout decision the writer makes.

## The strict parser was always the problem

HTML came from SGML — a large technical document format designed for engineering teams with strict validation. Missing a closing tag: invalid. Wrong nesting: invalid. Unescaped ampersand: invalid. The parser was the authority.

Browsers broke from this early. Error recovery — try to figure out what the author meant rather than reject the document — was a pragmatic concession to the fact that humans were writing the markup and humans make mistakes. Different browsers recovered from errors differently, so the same broken HTML rendered differently in IE versus Netscape. The browser wars were partly a competition in error recovery strategies.

The W3C tried to restore strictness with XHTML: XML-based, strict parser, one malformed tag shows an error instead of a page. Web developers hated it. It failed. HTML5 won by standardizing error recovery instead.

Markdown drew the right conclusion. Make the syntax so simple and forgiving that there's almost nothing to get wrong. Forget to close something — nothing to close. Nest things wrong — nesting barely exists. The worst you can do is choose the wrong heading level.

## Why AI chose it

AI outputs tokens. Markdown is what those tokens look like when the training corpus is mostly GitHub, Stack Overflow, and technical documentation. The model learned "surround code with triple backticks" because humans did that billions of times.

But there's a structural reason it stuck. Generating valid HTML token-by-token is hard — every tag needs a closing tag, nesting has to be right, attributes need quoting. A model generating HTML can easily produce malformed output.

Markdown has almost no way to be structurally wrong. You can generate it one character at a time and it stays valid. A `**` without a closing `**` renders as literal asterisks — no broken document.

The same properties that made markdown good for human writers made it good for language models: forgiving, readable in raw form, separates content from presentation. The writer changed; the right answer didn't.

## The assembly analogy

HTML and JavaScript are the web's instruction set. The browser is the CPU. Writing raw HTML for a document is like writing a blog post in assembly because you want to control the stack frame. You have full control, but you're thinking at the wrong level of abstraction.

Markdown is a high-level language that compiles to that instruction set. You write at the semantic level — this is a heading, this is emphasis, this is a link — and the renderer handles code generation. The browser sees `<h2>` and `<strong>` and `<a href>`. The writer never touched any of it.

The same content, different rendering surfaces, different "machine code" each time. The markdown document is the portable artifact. The renderer decides what the platform receives.

That's what HTML was supposed to be, before designers got hold of it.

[journey]:
prev: markdown-is-a-programming-language
From a conversation about markdown, HTML, and the writer's experience. Started with whether markdown is just simplified HTML (no — it's nothing like HTML to a writer). Hit SGML strictness, XHTML's failure, browser error recovery, why AI landed on markdown. The assembly analogy came last and pulled it together.
