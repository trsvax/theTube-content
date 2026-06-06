---
title: Markdown Over JSON
date: 2026-06-06
tags: [tech]
type: journal
audience: public
status: journaling
coffee: 1
summary: JSON exists because machines can't handle ambiguity. AI can. So why are you still writing JSON to talk to it?
workflow: draft
---

## The question

Why would a human write JSON to communicate with an AI?

Not to configure a build tool. Not to define an API contract between microservices. To talk to a machine that understands English. Why would you write this:

```json
{
  "role": "system",
  "rules": [
    { "name": "no-em-dashes", "description": "Avoid em dashes in prose" },
    { "name": "short-sentences", "description": "Prefer short declarative sentences" }
  ]
}
```

When you could write this:

```markdown
## Writing style

Avoid em dashes in prose. Prefer short declarative sentences.
```

The AI reads both. It understands both. One of them is also readable.

## The new reader

AI reads prose. It extracts structure from context. It doesn't need braces to know something is an object. It doesn't need brackets to know something is a list. It handles ambiguity, nuance, conditionals, exceptions, emphasis.

But it's also a terrible parser. It drops commas, hallucinates closing brackets, miscounts nesting depth. Ask it to produce 50 lines of valid JSON and watch it fumble the last brace. The format that demands perfect syntax is the format AI is worst at generating.

It's also more expensive. Every brace, bracket, quote, colon, and comma is a token. JSON spends tokens on syntax. Markdown spends tokens on content. Same information, fewer tokens, less to get wrong.

Markdown doesn't have syntax errors. You can't produce invalid markdown. There's nothing to miscount, nothing to escape, no trailing comma to forget. The format matches the machine: fluent with meaning, unreliable with delimiters.

## What you lose

Nothing, if the reader is AI.

The traditional answer is "validation." JSON Schema catches a missing field before anything runs. But AI validates too. Ask it "which of these forms are underspecified?" and it tells you. It doesn't just check shape. It checks meaning. A JSON Schema can tell you the `type` field is missing. It can't tell you the form doesn't make sense. It can't read the spec.

AI validates semantics. JSON Schema validates syntax. If your reader understands semantics, you already have the stronger validation. You just have to ask for it.

## What you gain

Intent. Markdown carries *why*, not just *what*. You can say "prefer short sentences because they're easier to scan" and the AI uses both the rule and the reasoning. JSON gives you the rule. The reasoning goes in a comment field nobody reads, or disappears entirely.

Context. You can write "do this, except when X, and especially when Y." You don't have to change the schema to handle outliers. A JSON schema is rigid. Every exception needs a new field, a new enum value, a new conditional structure. In markdown you just write the edge case.

Maintenance. Anyone can read your config six months later and understand it. JSON configs become write-only. You remember what they do from muscle memory, not from reading them.

## Diffs

Git diff is line-oriented. So is markdown. So is C. So is Python. One statement per line, one idea per line. Change a line, the diff shows that line. The semantic unit matches the diff unit.

JSON isn't line-oriented. It's tree-oriented. Add one item to an array and the closing bracket moves. Reorder keys and every line changes. Nest one level deeper and indentation shifts everything below. The diff is syntactically accurate and semantically useless.

This is why `git blame` works on C code written 30 years ago. Each line is a self-contained statement. The structural information is *in* the line, not in its position relative to braces above and below.

Markdown has the same property. A heading is a heading. A paragraph is a paragraph. A list item is a list item. Move them, change them, add between them. The diff tells you what changed in meaning, not just what shifted in position.

When AI edits your files, you review diffs. Readable diffs are not a nice-to-have. They're how you maintain trust in the output.

## The split

JSON for machine-to-machine contracts. `package.json`, `tsconfig.json`, API responses. Machines on both ends. Ambiguity is a bug.

Markdown for human-to-AI communication. Steering files, AGENTS.md, specs, prompts. A human on one end, an AI on the other. Ambiguity is handled. Structure is inferred. Intent is preserved.

The mistake is defaulting to JSON because "it's structured." Markdown is structured too. Headings, lists, code blocks, frontmatter. The structure is just implicit instead of syntactic. And the reader can handle implicit now.

## The test

Three ways to describe a form field:

HTML (full control):
```html
<div class="field-destination">
  <label for="destination">Destination</label>
  <input type="text" id="destination" name="destination"
    required placeholder="City, hotel, or region" />
  <span class="help">Where do you want to stay?</span>
</div>
<style>
  .field-destination input {
    font-weight: 600;
    border-color: #1a1a1a;
  }
</style>
```

JSON (not actually CSS, needs a custom renderer):
```json
{
  "name": "destination",
  "type": "text",
  "required": true,
  "placeholder": "City, hotel, or region",
  "help": "Where do you want to stay?",
  "style": {
    "input": {
      "fontWeight": "600",
      "borderColor": "#1a1a1a"
    }
  }
}
```

Markdown (readable, carries real CSS):
```markdown
## destination
- required: true
- placeholder: City, hotel, or region
- help: Where do you want to stay?

​```css
.field-destination input {
  font-weight: 600;
  border-color: #1a1a1a;
}
​```
```

No `type: text`. It's not a text field. It's where you want to stay. The name says it. The help text says it. `type: text` is the machine's abstraction, a rendering hint for a dumb form parser. The AI doesn't need the rendering hint. It knows what "destination" means.

The help text is also the sizing hint. "Where do you want to stay?" tells you the input should fit a city name or a short phrase. Not a textarea. Not a tiny box. HTML carries this too, in the placeholder. A smart renderer infers size from content. JSON can't carry content and rendering in the same field. It needs both spelled out separately.

What if AI is the backend. A mock backend reading this form doesn't need `type: text` to generate a response. It needs to know the field means "where you want to stay" so it can improvise a plausible list of hotels. The semantic information is what drives the AI. The type annotation is noise.

JSON has no sweet spot:

- Make it precise enough to fully specify the form and it's just a worse encoding of HTML. You've reinvented the DOM in JSON. At that point, write HTML.
- Leave it imprecise (the way people actually write it) and it's no more precise than markdown. The AI infers either way. Markdown wins because it's easier to write, read, and diff.

And markdown can embed ```` ```html ```` if you really care about one specific element. Full precision where you need it, concise intent everywhere else. JSON can't embed HTML without escaping it into a string. It can't embed CSS at all. It can only carry lossy abstractions of both.

You could convert any markdown to JSON or any JSON to markdown. They carry the same information either way. But converting markdown to JSON makes it worse: harder to read, harder to diff, harder for AI to produce without syntax errors, unable to embed native languages. Just start with markdown.
