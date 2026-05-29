---
title: JSDoc Is a File
date: 2026-05-29
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: chat
summary: JSDoc is metadata that lives in the filesystem. TypeScript is metadata that lives in a compiler. One of those is grep-able.
workflow: draft
---

TypeScript types disappear at runtime and require a full parser to extract at build time. They're invisible to `cat`, `grep`, `awk`. They only exist for the TypeScript compiler. They don't compose with Unix tools.

JSDoc is comments. Comments are text. Text is `grep`-able. A dumb shell script can parse JSDoc. Good luck writing a TypeScript parser in bash.

```bash
# Extract all @param from a file
grep '@param' lib/tube.js
```

Try that with TypeScript interfaces spread across five files with generics and conditional types.

## The tradeoff

TypeScript gives you: compile-time errors, refactoring confidence, IDE autocomplete.

JSDoc gives you the same IDE autocomplete — VS Code reads JSDoc for type hints. Plus: no build step, no source maps, no transpilation. The file you wrote is the file that runs. The file you `grep` is the file that executes.

## The real test

Can your tooling read it without a compiler? Can a shell script use it? Can `grep` find it? If the answer is no, the metadata is locked inside a tool. If the answer is yes, it's a file.

JSDoc is a file. TypeScript is a dependency.

## js + jsdoc > ts

Types when you want them. No build step. No intermediary in the path. The AI reads JSDoc fine. The shell reads JSDoc fine. The browser runs the file directly. No translation layer. No source maps. No "the error is on line 47 of the compiled output which is line 23 of the source."

Same philosophy as everything else: no unnecessary intermediary in the data flow.
