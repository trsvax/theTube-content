# TODO

Working notes from the Nov 4 session. Not a published post — lives at repo root.

## Posts to verify / finish before pushing

- [ ] Test the llm setup (install Python from python.org, order PATH ahead of 3.9.6, `python3 -m pip install llm`, `llm install llm-bedrock`, enable Bedrock models in console, confirm AWS creds picked up) → then fix `content/posts/2026/11/assistant-is-tools.md` with what actually worked. Verify the exact plugin name and model IDs.
- [ ] Read and decide on `content/posts/2026/11/churn-is-the-disease.md` (the cfront rant) — push or edit
- [ ] Read and decide on `content/posts/2026/11/kiro-iam.md` (IAM Identity Center / single billing) — push or edit
- [ ] Reconcile the kiro-cli install command in `content/posts/2026/11/remote-dev.md` — currently `npm install -g @kiro/cli`, but docs suggested `curl -fsSL https://cli.kiro.dev/install | bash`. Confirm which is current.

## Setup / real-world tasks

- [ ] Decide: Mac mini M6 (32GB/512GB, ~$1,499) vs a Linux VPS. (Floated "maybe don't need the Mac" — VPS gives code-server + CLI tools; Mac adds iCloud Photos, Screen Sharing, Mac-only tooling.)
- [ ] Build the passkey proxy + browser shell (Node 24, node:sqlite, @simplewebauthn/server, xterm.js, node-pty). Designed in passkey-proxy.md, not built.
- [ ] Install kiro-cli on the server, confirm it authenticates with AWS Identity Center and picks up steering files.
- [ ] Test the full remote chain end to end from outside the house (Teleport → Face ID → shell → kiro-cli / llm).
- [ ] Kill the old Builder ID Stripe charge via official Kiro support (billing moved to AWS Identity Center).

## AWS billing as a tube provider

- [ ] Add an AWS billing provider to the tube fs (theTube-fileProvider + theTube-mcp/webdav) — billing as read-only files. `list`/`read` over a directory tree like `/billing/2026/11/summary.json`, `/billing/current.json`.
- [ ] Break out Bedrock specifically — it's the one cost that scales with use (S3/CloudFront/Lambda are flat ~$1/mo; Bedrock is metered tokens per llm query, tool call, kiro-cli session). Tree like `/billing/bedrock/current.json`, `by-model.json`, `daily.json` so a spike shows up fast. This is the feedback loop for the only unpredictable cost.
- [ ] Caching caveat: Cost Explorer API is ~$0.01/request, so don't hit it on every `list`. A scheduled Lambda writes the JSON to S3; the provider serves the cached file. The cached file is the real "file at a URL"; Cost Explorer just refreshes it. Keeps it inside the idle-cost rule.
- [ ] Read-only provider — no writes.
- [ ] Probably its own post: "the AWS bill is a file." Ties to kiro-iam (billing consolidated onto AWS) — now the bill itself is a file in the namespace.

## Future posts / ideas (not written)

- [ ] Photo backup job: iCloud → S3. The "job triggers download" approach (job detects new photo, pulls full-res from iCloud via PhotoKit, uploads to S3). Mac stays a relay, no local storage needed.
- [ ] Bike round display — still a vague thought, no build. LilyGO T-RGB 2.1" + iPad over BLE/USB + 3D-printed Garmin mount.

## Pushed this session (done)

- remote-dev.md — iPad remote dev setup
- passkey-proxy.md — WebAuthn proxy + browser shell
- bike-round-display.md — the bike display idea
