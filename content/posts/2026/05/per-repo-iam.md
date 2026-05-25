---
title: Per-Repo IAM
date: 2026-05-18
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
summary: Each repo that deploys to S3 should have its own IAM credentials scoped to its path. Least privilege. If creds leak, blast radius is one prefix.
workflow: published
---

The tapestry-nocode-site build needs AWS credentials to deploy. Currently using the same creds as the main theTube deploy. That's wrong — if the book repo's secrets leak, the attacker has access to the entire bucket.

## The fix

Each repo gets its own IAM user (or role) scoped to just its S3 prefix:

- `trsvax/theTube` → full bucket access (it owns the root)
- `trsvax/tapestry-nocode-site` → `s3://bucket/books/tapestry-nocode/*` only
- Future repos → their own prefix, their own creds

The IAM policy for the book build:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::thetube-today/books/tapestry-nocode/*",
        "arn:aws:s3:::thetube-today"
      ],
      "Condition": {
        "StringLike": { "s3:prefix": ["books/tapestry-nocode/*"] }
      }
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "*"
    }
  ]
}
```

## Same principle as repos

Repos are access boundaries. IAM credentials are access boundaries. They should match. The book repo can only write to its path. The main repo can write everywhere. Each new content source gets its own creds for its own prefix.

If creds leak, the blast radius is one prefix — not the whole site.

[journey]:
prev: dont-fight-the-lego-blocks
Noticed the book build needs its own creds. Currently sharing the main deploy credentials — too much access. Same principle as repos-as-access-boundaries applied to IAM.
