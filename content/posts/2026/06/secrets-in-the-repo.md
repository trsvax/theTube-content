---
title: Secrets in the Repo
date: 2026-06-02
tags: [tech]
type: post
audience: public
status: journaling
coffee: 2
summary: You don't need Vault. You need openssl and a password in Keychain. Three approaches to secrets at personal scale.
workflow: draft
---

## The problem

You have secrets. Private keys, API tokens, signing credentials. They need to be:

1. In version control (so you don't lose them when a disk dies)
2. Not readable by anyone who clones the repo
3. Usable without a running service

Every solution I've seen fails at least one of these:

| Approach | Version controlled | Encrypted at rest | No service required |
|----------|-------------------|-------------------|---------------------|
| `.env` files (gitignored) | ❌ | ❌ | ✅ |
| AWS Secrets Manager / Vault | ❌ | ✅ | ❌ |
| git-crypt / sops | ✅ | ✅ | ❌ (GPG, tooling) |
| GitHub Actions secrets | ❌ | ✅ | ❌ |
| Environment variables | ❌ | ❌ | ✅ |

The common thread: people treat "secrets" as a special category that requires special infrastructure. But a secret is just a file you don't want other people to read. We solved that problem in the 70s. It's called encryption.

## The obvious answer

```bash
# Encrypt a file
openssl enc -aes-256-cbc -salt -pbkdf2 -in private-key.pem -out private-key.pem.enc

# Decrypt a file
openssl enc -d -aes-256-cbc -pbkdf2 -in private-key.pem.enc -out private-key.pem
```

Commit the `.enc` file. Gitignore the plaintext. The password lives in your head (or your Keychain — more on that).

That's it. `openssl` is pre-installed on every Mac and Linux box. No dependencies. No service. No monthly bill. The encrypted file is in git. You have history, blame, diff (on the metadata, not the content — it's binary). Restore from any backup.

## Scaling up: tar + openssl

One file per secret gets noisy when you have ten of them. Bundle them:

```bash
# Encrypt a directory of secrets
tar czf - secrets/ | openssl enc -aes-256-cbc -salt -pbkdf2 -out secrets.tar.gz.enc

# Decrypt the bundle
openssl enc -d -aes-256-cbc -pbkdf2 -in secrets.tar.gz.enc | tar xzf -
```

One file in the repo. One password. Decrypt, use, re-encrypt, commit. The directory structure inside the tarball is your organization. Add a secret = add a file to `secrets/`, re-encrypt.

## Scaling further: encrypted SQLite

When you need metadata — which key is for what service, when it was created, when it expires, rotation history — a flat directory isn't enough. But a database is:

```bash
# Create the secrets database
sqlite3 secrets.db <<SQL
CREATE TABLE secrets (
  name TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  service TEXT,
  created TEXT DEFAULT (datetime('now')),
  expires TEXT,
  notes TEXT
);
INSERT INTO secrets (name, value, service, notes)
VALUES ('cloudfront-key', '-----BEGIN RSA...', 'cloudfront', 'Signs URLs for protected content');
SQL

# Encrypt it
openssl enc -aes-256-cbc -salt -pbkdf2 -in secrets.db -out secrets.db.enc

# Clean up
rm secrets.db
```

To use:

```bash
# Decrypt
openssl enc -d -aes-256-cbc -pbkdf2 -in secrets.db.enc -out secrets.db

# Query
sqlite3 secrets.db "SELECT name, service, expires FROM secrets"

# Extract one key
sqlite3 secrets.db "SELECT value FROM secrets WHERE name = 'cloudfront-key'" > key.pem
```

Same `openssl` pattern. Same one password. But now you have structured data — rotation queries, expiry checks, service mapping. `sqlite3` is also pre-installed everywhere.

## The password

One password protects everything. Where does it live?

**macOS Keychain:**

```bash
# Store the password
security add-generic-password -a "$USER" -s "repo-secrets" -w "your-passphrase"

# Retrieve it in a script
PASS=$(security find-generic-password -a "$USER" -s "repo-secrets" -w)

# Decrypt using Keychain
openssl enc -d -aes-256-cbc -pbkdf2 -pass "pass:$PASS" -in secrets.db.enc -out secrets.db
```

Touch ID can gate access to the Keychain item. The passphrase never appears in your shell history, never in environment variables, never in a file.

## CI/CD

GitHub Actions (or whatever) needs secrets too. One secret: the passphrase. Store it as a repository secret. The workflow decrypts the bundle:

```yaml
- name: Decrypt secrets
  run: |
    openssl enc -d -aes-256-cbc -pbkdf2 \
      -pass "pass:${{ secrets.SECRETS_PASSPHRASE }}" \
      -in secrets.db.enc -out secrets.db
```

One repository secret instead of ten. Add new secrets to the database, re-encrypt, push. CI picks them up automatically. No UI clicks to add each secret individually.

## What about rotation

Rotation is a row update:

```bash
# Decrypt
openssl enc -d -aes-256-cbc -pbkdf2 -pass "pass:$PASS" -in secrets.db.enc -out secrets.db

# Rotate
sqlite3 secrets.db <<SQL
UPDATE secrets SET value = '-----BEGIN RSA NEW...', created = datetime('now')
WHERE name = 'cloudfront-key';
SQL

# Re-encrypt and commit
openssl enc -aes-256-cbc -salt -pbkdf2 -pass "pass:$PASS" -in secrets.db -out secrets.db.enc
rm secrets.db
git add secrets.db.enc
git commit -m "rotate cloudfront key"
```

Git history shows when every rotation happened. `git log secrets.db.enc` is your audit trail.

## Why not Vault / Secrets Manager

- Costs money when idle ($0.40/secret/month on AWS — adds up)
- Requires network access to use your own secrets
- Another service to manage, secure, back up
- Overkill at personal scale (1 user, <20 secrets)
- If AWS is down, you can't access your secrets

An encrypted file in git works offline, costs nothing, survives provider outages, and has the same security properties — AES-256, password-derived key, no plaintext at rest.

At organizational scale with 50 engineers and audit requirements, use Vault. At personal scale, `openssl` is the answer. And the SQLite approach has a bonus: every language can read it natively. Node 22 has `node:sqlite` built in — no dependencies. Python has `sqlite3` in the standard library. Your deploy script can query the decrypted database directly instead of parsing key files or shelling out. The database is the interface.

## Zero friction: git hooks

The developer never runs `openssl` manually. Git does it:

```bash
# .git/hooks/post-checkout — decrypt on clone/checkout
#!/bin/sh
PASS=$(security find-generic-password -a "$USER" -s "repo-secrets" -w)
openssl enc -d -aes-256-cbc -pbkdf2 -pass "pass:$PASS" -in secrets.db.enc -out secrets.db 2>/dev/null
```

```bash
# .git/hooks/pre-commit — re-encrypt before every commit
#!/bin/sh
if [ -f secrets.db ]; then
  PASS=$(security find-generic-password -a "$USER" -s "repo-secrets" -w)
  openssl enc -aes-256-cbc -salt -pbkdf2 -pass "pass:$PASS" -in secrets.db -out secrets.db.enc
  git add secrets.db.enc
fi
```

Clone the repo. Enter the passphrase once (Keychain remembers). Secrets are just there — a queryable database in your working tree. Commit, and they're re-encrypted automatically. The plaintext `.db` is gitignored. If you forget, `pre-commit` catches it.

The workflow is invisible. No one explains anything. No one installs anything. It's just git.

## Audit

This satisfies enterprise audit requirements:

- **Encryption at rest** — AES-256-CBC with PBKDF2 key derivation
- **Access control** — passphrase in Keychain, Touch ID optional
- **Audit trail** — `git log secrets.db.enc` shows every change, who made it, when
- **Rotation evidence** — `created` column in the database + commit history
- **Backup/recovery** — it's in git, replicated everywhere you clone

That's more auditable than Vault, where someone has to remember to check CloudTrail. Here the audit trail is the same tool everyone already uses — `git log`.

## The progression

1. **One secret** → `openssl enc` the file, commit the `.enc`
2. **Several secrets** → tar the directory, encrypt the tarball
3. **Structured secrets** → SQLite database, encrypt the `.db`

Each step uses the same two tools: `openssl` and `sqlite3`. Both pre-installed. Both will exist in 20 years — SQLite has a [published pledge](https://www.sqlite.org/lts.html) to support the file format until 2050. The US Library of Congress recommends SQLite as a storage format for the preservation of digital content. AES isn't going anywhere either. No lock-in. No dependencies. No service.

The encrypted file is the backup. Git is the history. Keychain is the key. That's the whole system.
