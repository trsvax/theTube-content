---
title: JSDoc Is a File
date: 2026-05-29
tags: [tech]
type: journal
audience: public
status: journaling
coffee: 1
origin: chat
summary: TypeScript is a build step. JSDoc is grep-able. One ships as-is, the other requires a compiler between you and your code.
workflow: published
---

TypeScript is a language that compiles to another language. JSDoc is a comment in the language you're already running.

```js
// @ts-check

/**
 * @param {string} path
 * @param {Record<string, unknown>} [params]
 * @returns {Promise<unknown>}
 */
export async function tubeRequest(path, params = {}) {
  // ...
}
```

That's it. No `tsconfig.json`. No `dist/` folder. No source maps. No "where's the actual file that runs." The file you read is the file that runs.

## What you get

- Red squiggles in the editor. Same ones TypeScript gives you.
- Hover types. Same ones.
- Autocomplete. Same.
- `tsc --noEmit --checkJs` in CI if you want. No output. Just validation.

## What you don't get

- A build step between you and your code
- A `dist/` directory that may or may not match `src/`
- Source maps that may or may not be correct
- The question "do I read the `.ts` or the `.js`?"
- The question "did I forget to rebuild?"

## The grep test

```bash
grep -r "tubeRequest" .
```

That works. It finds the function. It finds every call site. It finds the types. Because the types are in the same file as the code. They're comments. They're grep-able.

TypeScript files are also grep-able — until you have a monorepo with `src/` and `dist/` and `node_modules/.cache/` and three `tsconfig.json` files and you're not sure which output your runtime is actually loading.

## The .d.ts test

"But libraries need `.d.ts` files for consumers."

```bash
tsc --declaration --emitDeclarationOnly --allowJs
```

That generates `.d.ts` from your JSDoc-annotated `.js`. No TypeScript source files. Your code stays JS. Consumers get types. The declaration is a build artifact — like a `.map` file or a `README`. You don't write in the output format.

## The Lambda test

```bash
zip -j dist.zip index.mjs
aws lambda update-function-code --function-name my-fn --zip-file fileb://dist.zip
```

That's the deploy. The file is the artifact. No transpilation. No bundler. No "does Lambda have the right Node version for this syntax." It's ESM. It runs.

With TypeScript you need: compile, maybe bundle, maybe tree-shake, definitely figure out if you're targeting CommonJS or ESM, definitely figure out if `@aws-sdk` is in the bundle or the runtime. The file you wrote is not the file that runs.

## When TypeScript doesn't lose

- When the team has already decided TypeScript is the standard. It's a social choice, not a technical one. Switching costs more than staying.
- When you already have a build step anyway (React, bundlers, etc.). The compiler is already there. Adding types to it is free. Removing it to use JSDoc saves nothing.

## The tradeoff that isn't

"But complex generics — mapped types, conditional types, template literal types."

Sure, JSDoc can't express `type Routes = { [K in keyof Config]: Handler<Config[K]> }` inline. But that's a compile-time-only abstraction. It evaporates. The runtime never sees it.

With JSDoc you can build something TypeScript can't: documented runtime types. Validation functions that *are* the type definition. A `@typedef` that maps to a runtime check. The type and the enforcement are the same code, not parallel declarations that drift apart.

TypeScript gives you complex static types that disappear at runtime. JSDoc gives you simpler static types that can *also* exist at runtime. Different trade. Not strictly worse.

And mocks. TypeScript mocks satisfy the compiler — they follow the rules. Every property present, every method stubbed, every generic parameter resolved. The mock is correct and useless. A JSDoc mock follows the guidelines — it has the shape the test needs, nothing more. No compiler demanding you implement fourteen methods you'll never call. The documentation tells you what matters. The type system doesn't get a vote on what your test requires.

## The readability argument

`@param {string} path` is English. `path: Extract<keyof RouteMap, \`/\${string}\`>` is a puzzle.

JSDoc is human-readable by default. TypeScript is human-readable until someone discovers utility types. The "type system as communication layer" argument assumes everyone on the team reads type algebra fluently. In practice, half the team reads the JSDoc hover tooltip anyway — which is generated from the same annotations you'd write by hand.

And because JSDoc is structured text, you can do things TypeScript can't: parse it at runtime, generate documentation from it, build a searchable API browser from the source files directly. My other WebDAV server does exactly that — serves a real-time browsable API built from JSDoc comments in the running code. Try that with `.ts` files that need a compiler before they're even valid JavaScript.

## When JSDoc wins

- Small projects that run as-is (Lambda, CLI tools, servers)
- When the file you read should be the file that runs
- When `node index.mjs` is the entire dev experience
- When you want types but refuse to add a compiler

## The real argument

It's not about types. Both give you types. It's about indirection.

TypeScript adds a layer between what you write and what runs. That layer has costs: build time, configuration, debugging through source maps, version mismatches between source and output. For a large application with a build step already, those costs are amortized. For a Lambda function, a CLI tool, a local server — they're pure overhead.

`// @ts-check` at the top of a `.js` file gives you 90% of TypeScript's value with 0% of its infrastructure. The remaining 10% is advanced generics and mapped types. If you need those, use TypeScript. If you don't — and you usually don't — the comment is enough.

The file is the artifact. The comment is the type. The runtime is the source of truth.

[journey]:
prev: tube-request
Came out of writing tubeRequest.js with full JSDoc annotations. The question "should we use TypeScript?" has a simple answer: do you already have a build step? No? Then don't add one for types. The types live in comments. The comments are free.
