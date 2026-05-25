---
title: The Tube Is Live
date: 2026-05-25
tags: [tech]
type: journal
audience: public
status: journaling
coffee: 2
summary: The tube writes to S3. End-to-end — curl with a JWT, CF Function gates, API Gateway forwards, Lambda writes, file lands in the bucket.
workflow: draft
---

[share]:
type: image
file: e2e-final.heic
captured: 2026-05-25
caption: first capture through the live tube
src:

The first request through the production tube. Not a real photo — a curl command with a test JWT. But the pipe works.

```
curl -X POST -H "Authorization: Bearer test123" \
  "https://thetube.today/tube/share/add?type=image&file=e2e-final.heic&date=2026-05-25"
```

202 Noted. File in S3 at `tube/share/add/2026/05/25/4634b8d1889c.json`. The whole chain: CloudFront → CF Function (gate on JWT) → API Gateway → Lambda → S3. No server. No database. Just a pipe with `> file`.

The function URL approach didn't work — persistent 403 on the account, even with correct permissions. Switched to HTTP API Gateway as the origin. Same Lambda, different front door. Works immediately.

Next: real JWT validation (the mint script exists), update `send-tube` to read from Keychain, iOS Shortcut.

[journey]:
prev: the-share-system
Built the tube end-to-end in one session. Started with consistency work (posts into YYYY/MM/, frontmatter normalization, content spec). Then CloudFront behavior rename (/w/ → /tube/), CF Function rename (short-url-redirects → thetube-router). Created thetube-tube Lambda, hit a wall with function URLs (account-wide 403 — never resolved). Pivoted to API Gateway, worked first try. WebDAV server refactored into providers/, added S3/Cognito/IAM browsing, mounted in workspace. The filesystem is the debug tool now.
