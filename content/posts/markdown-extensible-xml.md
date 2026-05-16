---
title: Markdown Is More Extensible Than XML
date: 2026-05-15
tags: [tech]
summary: XML was designed to be extensible and made it hard. Markdown wasn't designed to be extensible and made it easy.
type: draft
---

XML promised extensibility. Namespaces, schemas, DTDs — all the machinery for defining new vocabularies on top of an existing format. The promise was that any tool could understand any XML dialect as long as you declared your schema upfront.

In practice, extensibility required toolchain agreement before you could write a single tag. The extension mechanism was as complex as the format itself. You needed an XML processor, a schema validator, a namespace resolver. The barrier to entry was the spec.

Markdown promised nothing. It was a text-to-HTML converter with a loose spec and no formal extension mechanism. What it had instead was a parser that ignored what it didn't understand.

Reference-style link definitions — `[label]: value` — are part of the spec. If you define a reference and never use it as a link, most parsers consume it silently. Gruber left the slot open. He didn't need to — it was just how the syntax worked.

theTube uses that slot:

```
[design]: needs a diagram showing the pipe model
[journey]: fill in the train details later
```

A standard markdown renderer sees these as unused link definitions and drops them. theTube's renderer intercepts them before the parser and does something with them instead — strips them, renders them as callouts, queues them as issues.

The extension costs the writer nothing. You type it and keep writing. Any renderer that doesn't know about it produces a clean result anyway. The degradation is graceful because the format was already designed to degrade gracefully.

XML's extensibility was a contract. Markdown's extensibility is a gap — and gaps are more useful than contracts when you don't know yet what you need to extend.

The good parts of markdown aren't the things Gruber designed. They're the things he left undefined.
