---
title: Per-Repo Vault
date: 2026-05-20
tags: [tech]
type: journal
audience: public
status: qed
coffee: 0
origin: walk
summary: One encrypted file per repo. One script to show credentials. openssl and a password. No secrets manager, no service, no monthly cost.
---

Each repo gets its own IAM role. Each repo stores its own credentials — encrypted, in the repo.

```
.vault/
  credentials.enc    # encrypted with openssl
  vault.sh           # the interface
```

## The interface

```sh
vault.sh show -iam        # AWS access key + secret
vault.sh show -github     # GitHub token
vault.sh env              # export all as env vars
vault.sh setup            # encrypt plaintext into credentials.enc
```

One password. One file. One script. The script is the same in every repo — only the encrypted file differs.

## Why per-repo

Each repo has its own IAM role with its own namespace. The MCP log reader can only read logs. The comment Lambda can only write to `comments/`. The deploy role can sync to S3. Isolation by design — and the credentials live where they're used.

## Why not a secrets manager

AWS Secrets Manager costs $0.40/secret/month + $0.05 per 10,000 API calls. For a personal project with a handful of roles, that's overhead for a problem that `openssl enc` already solves. The encrypted file is in git (or `.gitignore`d if you prefer). The password is in your head.

## The implementation

```sh
#!/bin/sh
read -sp "Password: " pass; echo
creds=$(openssl enc -aes-256-cbc -d -pbkdf2 -in .vault/credentials.enc -pass pass:"$pass")

case "$1" in
  show)
    case "$2" in
      -iam)    echo "$creds" | grep AWS_ ;;
      -github) echo "$creds" | grep GITHUB_ ;;
      *)       echo "$creds" ;;
    esac ;;
  env)  echo "$creds" | sed 's/^/export /' ;;
  *)    echo "usage: vault.sh [show [-iam|-github]|env|setup]" ;;
esac
```

[journey]:
Walk thought. We're about to create a bunch of IAM accounts — one per repo, one per concern. Need a way to manage them that doesn't add infrastructure. openssl + a shell script. The vault is a file, the interface is a script, the password is in your head. □
