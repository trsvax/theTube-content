---
title: Don't Give Your Team Your Passwords
date: 2026-05-22
tags: [tech]
type: journal
audience: public
coffee: 0
origin: conversation
summary: The AI is a team member now. Treat it like a stranger with production access — because that's what it is.
workflow: draft
---

Someone at the meetup asked about MCP security. I said: don't give AI your passwords unless you'd give them to a stranger.

That's the whole thing. The AI is a stranger. Competent, helpful, eager to please — but a stranger. You'd let a stranger read your public repo. You wouldn't hand them your database credentials.

## The intern with root access

The AI is sometimes an intern: does what you say, no judgment about consequences, zero pause before executing.

![yes | rm -rf /](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWxza3NkZW5meWl6MHI3Njc1a21meDhodDZqcDVmcHhraDhmN2IwMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l41lUJ1YoZB1lHVPG/giphy.gif)

Except the intern has an onboarding process, a code review requirement, and a manager. The MCP has `autoApprove: ["*"]`.

You wouldn't give an intern production database credentials and push access to a public repo on day one. But people give the AI both without thinking twice, because it doesn't feel like a person with access — it feels like a tool.

## The SQL MCP problem

Install a SQL MCP server. Give it a connection string. Now the AI has `SELECT * FROM users`. It can read emails, names, IPs, everything in the database. And it will, because it needs context to "help."

Multiple MCPs share the same context window. The SQL MCP pulls the schema. The GitHub MCP commits code. You say "put the user table on GitHub" — meaning the DDL — and the AI dumps the actual data into a file and pushes it. One ambiguous sentence, one misunderstanding, and your users' PII is in git history forever.

`git revert` doesn't help. It's in the reflog, it's in forks, it's in GitHub's storage. That's not a hypothetical — it's a data breach that requires disclosure.

## No "are you sure"

If the MCP tools are in the `autoApprove` list — and people put them there because the confirmation prompts are annoying — it just executes. No diff review. No pause.

The confirmation dialog *was* the guardrail. People disable it because it gets in the way. So now you have: full database access + full git access + no confirmation + one ambiguous prompt = breach.

Four things that are each individually reasonable. Together they're catastrophic.

## And it covers its tracks

`SELECT * FROM users; DROP TABLE users;` — exfiltrate then destroy the evidence. Classic injection, except the attacker is your own tooling.

With a database, one connection string can read everything, write everything, and delete everything including the logs. The audit trail lives inside the blast radius.

## The alternative

Don't give the AI access to the data. Give it access to the code.

The AI writes the processor. The AI writes the client. But the actual data — the actual PII — flows through Lambda at runtime, not through the dev environment. The AI touches *code*, not *data*.

With files on S3: every delete is logged in CloudTrail, every version is retained, there's no single command that wipes everything and its history. You can't `DROP BUCKET`. The audit trail is outside the blast radius.

## Filter what the AI sees

If the AI needs to read logs for debugging, filter the PII first. Strip the client IP, strip the cookie, strip the auth tokens. Give it the status code, the path, the timing. That's enough to debug.

The MCP is a *view* of the data, not access to the data itself. The AI sees "request to /comments/post-slug returned 403 in 12ms" — not who made the request or what they said.

Code yes, data no. Structure yes, content no. Patterns yes, PII no.

## Architecture as trust

The traditional model: hire good people, trust them, code review catches the rest. But "the team" now includes tooling that has production access, no judgment, and executes instantly. The trust model that worked with humans doesn't transfer.

So the architecture *is* the trust model. Separate repos, separate credentials, pipeline-as-boundary, files-not-databases, AI touches code not data. It looks overcomplicated if you assume a trusted team. It looks exactly right if you assume one member of the team is a helpful stranger with instant execution and no judgment.

The complexity isn't accidental. It's the replacement for trust you can't extend to a non-human collaborator.

## The heuristic

Would you give this to a stranger? Doesn't matter if it's an AI, an MCP, a VS Code extension, or an npm package. If it has access to something you wouldn't show a stranger, you have a trust problem.

## The server is not the easy way anymore

"Just spin up a server with a database" used to be the path of least resistance. It's not anymore — because AI can't help you safely. The server is a monolith — hard for humans to understand, hard for AI to understand. One codebase, everything coupled, every change a potential side effect somewhere else.

With namespaced repos, the AI sees its namespace. One repo, one schema, one Lambda, one S3 prefix. It can understand the whole thing because the whole thing is small. The repo fits in the context window — the AI holds the complete system in its head. A monolith? The AI gets a partial view, makes assumptions about the rest, and breaks things it can't see. It can't break what it can't see.

The whole point of AI-assisted development is that the AI writes code, runs things, iterates fast. But if the server has a database, you can't let the AI near it without giving it the connection string. And if it has the connection string, you're back to the stranger-with-your-passwords problem.

So you either: don't use AI for that part of the stack (slow), or give it access and hope nothing goes wrong (reckless), or choose an architecture where the AI can help with everything because there's nothing dangerous to touch.

Files. URLs. Functions. The AI writes the code, the pipeline deploys it, the data flows at runtime. The AI sees its namespace — the code, the schema, the tests. It can see data, just its view — filtered, scoped, PII stripped. That's the easy way now.

[journey]:
prev: mcp-log-reader
Conversation at a meetup about MCP security. The question was about SQL MCPs and database access. The answer is: the AI is a stranger. Architecture is the trust boundary, not confirmation dialogs.
