---
title: The Job
date: 2026-06-02
tags: [tech]
type: post
audience: public
status: journaling
coffee: 2
summary: A scheduled job is a file and a schedule. Not a server. Not Jenkins. Not Java. One Lambda, one rule, one line of code for the cron.
workflow: draft
---

## The problem

Run a thing on a schedule. Every 5 minutes, read some log files and extract what matters.

This is the simplest possible job. It should be the simplest possible infrastructure. Let's see what people actually build:

## Jenkins

To run a bash script every 5 minutes on Jenkins:

1. Provision an EC2 instance ($20/month minimum)
2. Install Java
3. Install Jenkins
4. Configure authentication (LDAP, AD, SAML — pick your poison)
5. Create a service account for the agent (change ticket, two week approval)
6. Configure SSH keys for the agent (another ticket)
7. Install plugins (git, credentials binding, pipeline)
8. Write a Jenkinsfile in Groovy (a language nobody asked for)
9. Configure credentials in the Jenkins UI (click, click, click)
10. Create the pipeline job (more clicking)
11. Set the schedule (`H/5 * * * *` — why is it `H`?)
12. Pray it works

Then maintain it:
- Patch the OS monthly
- Update Jenkins quarterly (breaking changes guaranteed)
- Rotate the service account password (another ticket)
- Monitor Jenkins itself (is it up? is the disk full? did Java leak memory?)
- Debug workspace pollution from the last run
- Figure out why the agent went offline at 3am

All of this to run a bash script every 5 minutes.

## Lambda

```js
// sync-captures.mjs
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { gunzipSync } from "node:zlib";

const s3 = new S3Client({});

export async function handler() {
  // Read today's logs, extract tube entries, write results
  const date = new Date().toISOString().slice(0, 10);
  // ... 40 lines of actual work
}
```

The schedule:

```ts
new events.Rule(this, "SyncCaptures", {
  schedule: events.Schedule.rate(cdk.Duration.minutes(5)),
  targets: [new targets.LambdaFunction(syncLambda)],
});
```

Deploy: `cdk deploy`. Done.

No server. No Java. No Groovy. No plugins. No agents. No service accounts. No SSH keys. No disk. No patching. No monitoring the scheduler itself.

## What you get

| Concern | Jenkins | Lambda + EventBridge |
|---------|---------|---------------------|
| Did it run? | Check the Jenkins UI | CloudWatch metric (automatic) |
| Did it fail? | Check the Jenkins UI | Alarm fires (automatic) |
| How long? | Parse the console log | Duration metric (automatic) |
| Is it stuck? | Hope someone notices | Timeout kills it (automatic) |
| What happened? | Console log in Jenkins | CloudWatch Logs (permanent) |
| Is the scheduler up? | Monitor separately | Not your problem |
| Cost when idle | $20/month | $0 |
| Cost when running | Same $20/month | $0.0001/day |

## The identity problem

Jenkins needs a service account. In enterprise environments where local accounts aren't allowed, that means:

1. Request an AD service account (ticket)
2. Get it approved (meeting)
3. Wait for provisioning (days)
4. Configure password rotation (another system)
5. Store the password somewhere Jenkins can read it (credentials plugin)
6. Hope nobody disables the account during quarterly cleanup

Lambda has an IAM role. It exists in code:

```ts
const role = new iam.Role(this, "SyncRole", {
  assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
});
role.addToPolicy(new iam.PolicyStatement({
  actions: ["s3:GetObject", "s3:ListBucket"],
  resources: ["arn:aws:s3:::my-bucket/*"],
}));
```

The role is the identity. No accounts. No passwords. No rotation. No tickets. Scoped to exactly what the job needs — not "this service account has admin because someone couldn't figure out the minimum permissions three years ago."

## FIPS

Jenkins isn't FIPS compliant without significant effort. You need FIPS-validated JVM, FIPS-validated plugins, FIPS-validated crypto providers. Most plugins don't support it. The community doesn't care.

Lambda in a FIPS endpoint: done. AWS handles the crypto. The Lambda runtime uses FIPS-validated modules. You write the same code. The compliance is infrastructure, not your problem.

## Creating jobs

Jenkins: Jenkinsfile DSL, pipeline syntax, declarative vs scripted, shared libraries, agent labels, stage/step hierarchy, post conditions, when clauses. A language unto itself. Documentation spread across plugin READMEs of varying quality.

Lambda: write a function. It receives an event. It does work. It returns. That's the contract. The "DSL" is the programming language you already know.

Adding a new job:

**Jenkins**: create a Jenkinsfile, configure a pipeline in the UI (or seed job, or Job DSL plugin, or Organization Folder), assign an agent label, add credentials bindings, set the trigger. Debug the Groovy.

**Lambda**: write a `.mjs` file, add a CDK rule. Push.

## The real question

What does Jenkins give you that EventBridge + Lambda doesn't?

- A UI for non-developers to trigger jobs manually → Lambda has a "Test" button in the console. Or wrap it in a one-page web form.
- Build artifact storage → S3.
- Pipeline visualization → Step Functions if you need it. (You probably don't.)
- Distributed builds across agents → Lambda scales to thousands of concurrent invocations. No agents.

What does Jenkins cost you?

- A server to maintain
- Java to update
- Plugins to manage
- An attack surface to secure
- $240/year minimum (EC2) for something that runs 5 seconds every 5 minutes

## The job is a file

```
lambda/jobs/
  sync-captures.mjs    ← the work
  infra.ts             ← the schedule (2 lines)
```

That's the whole system. The job is a file in a repo. The schedule is a line of CDK. Push to deploy. CloudWatch to monitor. `git log` for history. Nothing else.

A scheduled job doesn't need a job server. It needs a clock and a function. The cloud has both.
