---
title: tubeRequest
date: 2026-05-29
tags: [tech]
type: journal
audience: public
status: journaling
coffee: 1
origin: chat
summary: One function exposes the tube.
workflow: draft
---

The WebDAV providers call AWS directly right now. That means the server holds full credentials. The fix: route everything through the tube.

```js
const result = await tubeRequest("aws/describe-cloudfront", params);
```

That one function does:

1. POST to `/tube/aws/describe-cloudfront` with JWT
2. Tube Lambda validates JWT scope, writes request to S3
3. Tube returns 202 + signed URL to the result location
4. `tubeRequest` polls or waits for the result
5. Returns the content

The provider doesn't know about auth. The provider doesn't hold AWS credentials. The provider just awaits a result. Same as `fetch`. Same as a React hook.

## The chain

```
Your JWT → tube → request file in S3 → processor Lambda picks it up
  → checks scope → assumes scoped IAM role → makes AWS call
  → writes .result file → marks request as executed (S3 metadata)
  → signed URL resolves → tubeRequest returns the content
```

## Idempotent

Second call with the same request: tube sees `.result` exists, returns 200 with the signed URL. No re-execution. The log is the dedup key.

## The pattern at every layer

| Layer | Abstraction | Hides |
|-------|-------------|-------|
| Browser | `useQuery("cloudfront")` | fetch, cache, loading state |
| Server | `tubeRequest("aws/describe-cloudfront")` | POST, signed URL, polling |
| Filesystem | `GET /fs/aws/cloudfront/README.md` | everything |

One pattern. Three layers. The tube is the backend for all of them.

## What this gives you

- **No credentials on the WebDAV server** — only a JWT
- **Per-key scoping** — different JWTs see different AWS resources
- **Immutable audit trail** — every request is a file in S3
- **Idempotent by default** — same request returns cached result
- **Observable** — `ls /fs/tube/s3/aws/` shows what happened

## Next

~~Implement `tubeRequest`. Wire the providers through it. The whole filesystem becomes JWT-scoped without any provider knowing about auth.~~

Done. [`tubeRequest.js`](https://github.com/trsvax/theTube-mcp/blob/main/webdav/tubeRequest.js) — 184 lines with docs. Providers swap one import.

## Escalation

Reads just read. The JWT is enough. But what about `aws/update-lambda`?

| Scope | Auth | Gates |
|-------|------|-------|
| `read` | JWT only (Keychain, long-lived) | describe, list, get — safe to run a million times |
| `publish` | JWT + time-hash | share/add, writes to known paths |
| `mutate` | JWT + passkey (Touch ID) | update-lambda, put-s3-object, anything destructive |

The Mac has the hardware. Touch ID is `sudo` for the tube — you're already authenticated, but escalation requires proof of presence. The passkey signature goes in a header. The tube Lambda verifies it. The processor checks scope before executing.

Every request is a file. The passkey signature is in the metadata. Full audit trail of who escalated when and what they did with it.

Same model as Unix: `cat` doesn't ask for your password. `rm -rf /` does. `cat ~/.aws/credentials` should.

## Why does your laptop need credentials at all?

`~/.aws` was never a good idea. Plaintext credentials on the filesystem. There are products to solve that — Leapp, aws-vault, granted, SSO session tokens — all answering "how do I store credentials safely." But they're still about getting you temporary AWS credentials so you can call AWS directly from your machine.

The tube sidesteps the whole category. Your machine never calls AWS. It calls the tube. The tube calls AWS. Your laptop doesn't need to know what AWS is. A JWT in Keychain behind Touch ID. That's it.

It's not a better answer to "how do I manage credentials." It's "why does your laptop need credentials at all."

Often the best answer to a hard problem is just: don't do that.

## Multi-cloud is just another path

```js
const vms = await tubeRequest("azure/list-vms", { resourceGroup: "prod" });
const lambdas = await tubeRequest("aws/list-lambdas");
```

The provider doesn't know if the tube routes to a Lambda, an Azure Function, or a Raspberry Pi. It POSTs, it polls, it gets a result. The path is the routing key. `aws/*` goes to Lambda. `azure/*` goes to an Azure Function. Same JWT, same audit trail, same escalation model.

I'm not trusting all my thoughts to Bezos. Should be Bezos and Gates. I'd like to add Jobs but not sure how — iCloud doesn't have a compute layer you can own. Apple sells you the device, not the cloud. Maybe that's the answer: the Mac *is* the Jobs cloud. The tube already runs on it. Touch ID is already the auth. The local WebDAV server is already serving files. `apple/*` routes to localhost.

And clearly they did give you the API. Keychain, Touch ID, `security` CLI, launchd, the filesystem. They just didn't call it a cloud. They called it a gateway to the cloud — the secure device that holds your keys, verifies your identity, and talks to everyone else's infrastructure on your behalf. The Mac isn't the cloud. It's the front door to all of them.

## What do you want from your PC?

Identity, keys, and a gateway. That's it. Everything else can live somewhere else — S3, Azure, someone's API. The PC is the thing that proves you're you and signs the requests. The compute is cheap and fungible. The identity isn't.

Which is exactly what the tube does. The Mac holds the JWT, prompts Touch ID, signs the request. The cloud does the work. The Mac is the trust anchor, not the compute layer.

What else? Local-first drafts — write offline, sync when connected. But that's just files. The Mac already does that. iCloud does that. Git does that.

The PC's job is: be the thing I trust. Everything else is delegation.

## AI can read ~/.aws

Right now, every AI coding assistant that calls AWS does it by reading `~/.aws/credentials`. The AI has your full access keys. It can do anything you can do. More, actually — it's read all the AWS docs. It knows API calls you've never heard of. And it's fast. A thousand calls before you'd notice. No scope, no audit trail, no escalation. The AI and the human have the same permissions because they share the same plaintext file.

`$HOME` was meant for one user. AI barged in with my friend VS Code. Now I have a roommate.

With the tube: the AI gets a JWT with `scope: read`. It can list lambdas, describe CloudFront, browse S3. It cannot update, delete, or mutate. If it tries, the processor rejects it — wrong scope. If you want to let it mutate, you escalate with Touch ID. The AI doesn't have fingers. Yet.

The AI never sees credentials. It sees a tube endpoint and a scoped token. The token says what it's allowed to ask for. The audit trail shows what it actually asked for. And the escalation requires a human body part.

`~/.aws` is "I trust everything on this machine equally." The tube is "I trust different things differently." That's the whole game when AI is running on your machine.

## Greenspun's Eleventh Rule

Any sufficiently complicated server contains an ad hoc, informally-specified, bug-ridden, slow implementation of half of IAM.

Every `if ( user.role = 'admin' )` is security you wrote yourself. The JWT gets you past the front door, then it's all custom authorization: role checks, permission lookups, resource-state guards. All bugs waiting to happen.

The presigned URL skips all of it. The authorization *is* the URL. There's no code after the decode. AWS already decided: this URL can read this one file for this many seconds. You can't get it wrong because you didn't write it. I could still get it wrong — but now it's configuration, not code.

The tube's job is just: decide whether to generate the URL. One decision, one place. Then AWS handles the rest.

[journey]:
prev: the-tube-is-live
Came out of the "how do we secure the WebDAV server" discussion. The answer: don't give it credentials. Route through the tube. The tube is the permission layer. The JWT is the key. The signed URL is the receipt. Same pattern as the React hooks post — hide the complexity behind one function call.
