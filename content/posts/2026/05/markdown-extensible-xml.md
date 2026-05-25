---
title: Markdown Is More Extensible Than XML
date: 2026-05-15
tags: [tech]
audience: public
summary: XML was designed to be extensible and made it hard. Markdown wasn't designed to be extensible and made it easy.
type: journal
workflow: published
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

## Nobody owns the tag

XML namespaces assumed ownership. `xmlns:xsl` points to a URL — the W3C owns that namespace, defines what it means, controls the schema. The model is: one owner, one definition, one validator.

In practice, a tag like `[design]:` doesn't have one owner. The renderer sees it and thinks "show an image or a placeholder." The GitHub workflow sees it and thinks "create an issue." Neither knows about the other. They just both know how to handle that tag in their own way.

That's the Unix pipe model applied to document semantics. The file is the data. Each tool reads it and does its own thing. They don't coordinate — they agree on the format. The tag is the interface, not the implementation.

Ownership doesn't make sense here because the tag isn't a possession — it's a contract. `[design]:` means "this block describes a visual asset that needs to be produced." What each tool does with that information is its own business. A renderer shows a placeholder. A workflow creates an issue. A future tool might generate the image with AI. None of them need permission from the others.

The namespace, if you need one, is just collision avoidance — a way to say "my `design` is different from your `design`." Until there's an actual collision, it's premature structure. And premature structure is what killed XML adoption in the first place.

The good parts of markdown aren't the things Gruber designed. They're the things he left undefined.
