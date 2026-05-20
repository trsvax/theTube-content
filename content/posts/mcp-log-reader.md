---
title: MCP Log Reader
date: 2026-05-20
tags: [tech]
type: journal
audience: public
status: draft
coffee: 0
summary: An MCP server that reads CloudFront logs from S3. Query events, verify deploys, check comments — all from the chat without running CLI commands.
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

Same as everything else — read a file, filter it, return the result. The MCP server is just another reader of the same log files. It doesn't need special access — just S3 read on the logs prefix.

## Could also

- Apply `@pii` schema filter — strip marked fields before returning results to AI
- Run Athena queries and return results
- Watch for new log files and alert on patterns
- Summarize activity since last session

[journey]:
prev: the-url-is-the-log-entry
While verifying the comment form worked, had to run aws CLI to check the logs. An MCP server would let AI read them directly. Same data, better interface for the conversation workflow.
