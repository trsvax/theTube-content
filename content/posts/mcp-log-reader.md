---
title: MCP Log Reader
date: 2026-05-20
tags: [tech]
type: journal
audience: public
coffee: 0
summary: An MCP server that reads CloudFront logs from S3. Query events, verify deploys, check comments — all from the chat without running CLI commands.
workflow: draft
---

DRAFT

An MCP server that fetches CloudFront logs from S3, decompresses them, and returns filtered results. Then AI can query the logs directly during a conversation.

## What it does

- List recent log files
- Fetch and decompress a log file
- Filter by path (e.g. `/events/comment/submit`)
- Filter by time range
- Return structured results

## Why

Currently verifying events requires: `aws s3 cp ... - | gunzip | grep ...`. Works but breaks the flow. An MCP server means: "show me the last 10 comment events" → results in the chat. No context switch.

## The pattern

Same as everything else — read a file, filter it, return the result. The MCP server is just another reader of the same log files. It has its own IAM role and namespace — scoped to the logs prefix, with `@pii` fields filtered at read time by the schema.

## Structured for free

The GraphQL schema gives you structured logs at zero cost. The events *are* the operations — the URL encodes the operation name, the query params are the fields. No separate logging format, no structured logging library. The schema already defines the structure.

When the MCP reads the logs, it already knows: this is an `addComment` event, these are the fields, this one is `@pii`. No parsing heuristics, no regex guessing. The schema is the log format.

## Could also

- Run Athena queries and return results
- Watch for new log files and alert on patterns
- Summarize activity since last session

## Roles: user + mcp

The MCP's JWT carries roles `["user", "mcp"]`. It can do everything a user can — read content, submit comments — plus whatever `/events/mcp/*` allows. All MCP activity is logged under its own path. Grep `events/mcp` to see exactly what the AI did, separate from human activity.

The edge enforces it: request to `/events/mcp/something` without `mcp` role → 404. Not 403 — don't reveal the path exists. The namespace is invisible to anyone without the role.

## /proc for the MCP

A capability list at a known URL — like `/mcp/capabilities` — that declares what the MCP can do. The edge checks against it. If the MCP tries a path not in the list → 404. The list is the allowlist. Everything else doesn't exist.

```
/mcp/capabilities
  read-logs
  query-events
  summarize-activity
```

Same idea as Plan 9's `/proc` — the filesystem declares what's possible. The namespace *is* the permission model. If it's not in the namespace, it doesn't exist.

[journey]:
prev: the-url-is-the-log-entry
While verifying the comment form worked, had to run aws CLI to check the logs. An MCP server would let AI read them directly. Same data, better interface for the conversation workflow.
