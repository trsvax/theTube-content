---
title: Enterprise Security on a Solo Developer Budget
date: 2026-05-12
tags: [tech]
audience: user
summary: Dependabot, Copilot Autofix, scheduled scans, and supply chain protection — zero ongoing manual work.
issueNumber: 6
workflow: published
---

Supply chain attacks are the growth industry of software security. A malicious package lands in your dependency tree, gets installed, exfiltrates credentials or mines crypto. It happened to thousands of projects via `event-stream` in 2018. It keeps happening.

The enterprise answer is a dedicated security team, a software composition analysis tool, a vulnerability management platform, and a lot of meetings. The solo developer answer is a few configuration files and GitHub.

## Dependabot

Enable it in the repo settings. Dependabot scans your `package.json` and lock files against the GitHub Advisory Database. When a vulnerability is found, it opens a PR with the fixed version. You review, you merge.

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
```

That's it. You don't have to think about it until a PR appears.

## Copilot Autofix

When Dependabot opens an alert, the Security tab shows a "Generate fix with Copilot" button. Copilot explains what the vulnerability is, what the fix does, and opens a PR. For straightforward version bumps it's automatic. For breaking changes it explains the tradeoff.

The combination of Dependabot (detection) and Copilot (explanation + fix) means most vulnerabilities are resolved without you having to read a CVE.

## Scheduled scans

Dependabot covers known vulnerabilities in your direct and transitive dependencies. A scheduled GitHub Action can cover everything else — license compliance, outdated packages, custom checks.

```yaml
on:
  schedule:
    - cron: "0 9 * * 1" # every Monday at 9am
```

Same pattern as any other workflow. Runs weekly, opens an issue or PR if something needs attention.

## Supply chain protection

The scariest attacks aren't in known vulnerabilities — they're in packages that haven't been flagged yet. Two tools help:

**`minimum-release-age`** (pnpm v10.16+): blocks installing packages published less than N minutes ago. A typosquatting attack or a compromised maintainer account publishes a malicious version — this setting means you won't install it until it's been in the registry long enough for the community to notice.

```
minimum-release-age=10080  # 7 days in minutes
```

**Socket.dev GitHub App**: scans every PR for suspicious package behavior — new install scripts, new network access, new filesystem access. Free for open source. Flags the package before it lands in your lock file.

## What this costs

Dependabot: free. Copilot Autofix: included with Copilot. Scheduled Actions: free tier covers it. Socket.dev: free for public repos. `minimum-release-age`: a line in `.npmrc`.

Zero ongoing manual work. No security team. No SCA subscription.

A solo developer can have enterprise-grade supply chain security with zero ongoing manual work. It's all GitHub and a few configuration files.

## The build machine is the runtime

There's a security property that falls out of "deploys run in GitHub Actions, never locally" — one that wasn't designed in.

The AWS credentials never exist on your machine. They live in GitHub's secret store. The ephemeral Actions VM uses them, finishes, disappears. No `~/.aws/credentials` to leak, no session token to hijack, no persistent process holding keys.

Your machine is a git client. A compromised laptop means: someone can push commits. Branch protection on `main` limits even that — no direct pushes, PRs required. They can't read GitHub secrets. They can't touch S3. They can't access the private repo beyond what's already checked out locally.

The attacker gets your local working copy of the markdown files. Public content they could already read on the site.

That security posture is a consequence of architecture, not a deliberate hardening step. The build machine is the runtime. Your machine is just an editor and a git client. The blast radius of a breach shrinks accordingly.
