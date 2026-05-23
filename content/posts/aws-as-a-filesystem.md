---
title: AWS as a Filesystem
date: 2026-05-23
tags: [tech]
type: journal
audience: user
status: journaling
coffee: 2
summary: What if your AWS infrastructure was a mounted filesystem? /proc for the cloud. WebDAV over Lambda, read-only, auth-gated.
workflow: idea
---

## The idea

Linux has `/proc` — kernel state exposed as files. `cat /proc/cpuinfo` gives you the CPU. `ls /proc/1/` gives you init's state. No special tools, no APIs. Just files.

What if AWS worked the same way?

```
/proc/lambda/thetube-edge-auth/code
/proc/lambda/thetube-edge-auth/config.json
/proc/lambda/thetube-edge-auth/logs/2026-05-23
/proc/cf/E2DMNPNLN0VAQM/behaviors
/proc/cf/E2DMNPNLN0VAQM/logs/
/proc/s3/thetube-shares/2026-05-23-abc123.jpg
/proc/cognito/thetube-users/groups
/proc/route53/thetube.today/records
```

Mount it on your Mac. `ls` lists your Lambdas. `cat` reads their config. `grep` searches logs. No CLI commands, no console, no context switching. Just the filesystem you already know.

## Why Lambda

A local server on your Mac could do this — make SDK calls with your credentials, expose results as files. But Lambda is already *inside* AWS. It doesn't need credentials over the internet. The IAM role is attached directly. It's reading its own system.

Lambda *is* the `/proc`. It's not querying AWS from outside — it's reporting on its own environment.

## The protocol

WebDAV. HTTP-based filesystem protocol. macOS mounts it natively:

```bash
mount -t webdav https://thetube.today/proc/ /aws
```

No FUSE, no kernel extensions, no third-party software. Just `mount` and go.

WebDAV verbs map to filesystem operations:

| WebDAV | Filesystem | AWS SDK |
|--------|-----------|---------|
| PROPFIND | ls / stat | List* calls |
| GET | cat / read | Get* calls |
| PUT | write | (blocked — read-only) |

## The auth

Same as everything else on `/w/`. Minted JWT in the header, edge-auth verifies, Lambda serves. The IAM role on the Lambda is read-only — even if something goes wrong, it can't mutate anything.

```
/w/share/add?...  → write (log and 202)
/proc/lambda/     → read (list functions)
/proc/cf/         → read (distribution config)
/proc/logs/       → read (recent events)
```

`/proc` is just another path on the site. Auth-gated, read-only, WebDAV protocol.

## The publish shortcut

Before you get to `/proc`, there's a simpler win: mount S3 as a WebDAV folder.

```
/shares/  → S3 bucket, write-enabled for your Mac
```

Drag a photo to `/shares/` in Finder. It's in S3. The `[share]:` block gets its `src:`. No script, no terminal, no Lambda in the publish path. The Mac writes directly.

Existing tools do this already — SFTPGo, aws-s3-webdav (Rust). Fork one, add your auth, mount it. Publishing becomes a file copy.

## The layers

1. **S3 mount** — drag to publish. Solved problem, existing tools. (Soon)
2. **MCP server** — AI reads AWS via tool calls. Local, Touch ID. (Next)
3. **`/proc` WebDAV** — AWS as a filesystem. Lambda serves it. (Future)

Each layer builds on the same foundation: read-only AWS access, IAM-gated, auth'd by your minted JWT. The interface changes (Finder / AI chat / filesystem), the trust model doesn't.

## What the AI gets

With `/proc` mounted, the AI doesn't need custom MCP tools. It reads files. It already knows how to do that.

"Is `/w/` wired up?" → `cat /proc/cf/E2DMNPNLN0VAQM/behaviors`
"Why did this get a 403?" → `grep 403 /proc/cf/logs/2026-05-23`
"What Lambda functions exist?" → `ls /proc/lambda/`

No tool definitions, no schemas, no MCP protocol. Just paths.

[journey]:
prev: the-share-system
Came out of the share system design session. Started with "how does the AI read my AWS?" and ended at "mount it." The /proc analogy clicked — AWS state exposed as files, Lambda serving it because it's already inside. WebDAV because macOS speaks it natively. The S3 mount for publishing was the unexpected win — drag to /shares/ replaces the publish Lambda entirely for the Mac path.
