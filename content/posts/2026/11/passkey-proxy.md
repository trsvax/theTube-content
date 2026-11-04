---
title: A Passkey Proxy for code-server
date: 2026-11-04
tags: [tech]
type: post
audience: public
coffee: 1
origin: travel
summary: A small Node server that authenticates with Face ID via passkeys and proxies to code-server on the Mac mini.
workflow: draft
---

code-server in the browser is great until you think about who can reach it. A token in the URL means anyone with the unlocked iPad is in. A password means typing it every session. Neither feels right for a server that gives full shell access to your Mac.

The better option: passkeys. A small Node server on the Mac mini handles WebAuthn and proxies to code-server. Safari on iPad supports passkeys natively, stored in the Secure Enclave, unlocked with Face ID. You navigate to the auth server, Safari prompts for Face ID, you tap, the server sets a session cookie and proxies you through to code-server. No password to type, no token in the URL, and the auth is cryptographic — a real key, not a reusable string.

## What it does

Three things:

1. **Register** — one-time enrollment. iPad visits the page, Safari prompts for Face ID, the passkey is created and the public key is stored in SQLite.
2. **Authenticate** — on every visit, the server sends a challenge. Safari prompts Face ID, the iPad signs the challenge with the private key in the Secure Enclave, the server verifies it against the stored public key, sets a session cookie.
3. **Proxy** — authenticated requests get forwarded to code-server on `127.0.0.1:8080`. Unauthenticated requests get the login page.

## Start on demand

code-server doesn't need to run 24/7. The proxy is always on (it's lightweight — just Node and SQLite), but code-server is the heavy process. The proxy starts it on successful auth and shuts it down after a period of inactivity.

On auth: check if code-server is running. If not, spawn it as a child process bound to `127.0.0.1:8080`. Proxy requests to it once it's up.

On inactivity: a timer checks the last request timestamp. If nothing has hit the proxy for 30 minutes, kill the code-server process. Next auth spawns it again.

This is more reliable than running code-server as a daemon — if it crashes or hangs, the proxy just starts a fresh instance on the next auth. No `brew services` to manage, no stale process. The proxy is the lifecycle manager.

## The stack

- **Node 24** — `node:sqlite` is built in, no external database
- **`@simplewebauthn/server`** — handles the WebAuthn protocol (challenge generation, response verification)
- **`http-proxy-middleware`** — proxies authenticated requests to code-server
- **Fastify** — HTTP server (or use `node:http` if you want zero dependencies beyond WebAuthn)

Two npm dependencies, everything else built in. The public key is a row in SQLite, the auth is a function, the URL is the interface.

## HTTPS

Safari's WebAuthn API requires a secure context to create or use passkeys. The traffic is already encrypted by Teleport (WireGuard), so HTTPS is just to satisfy the browser's security requirement.

A self-signed cert generated with openssl works fine. No real cert needed — this is a private network. Either tap through Safari's warning or install the self-signed cert as a profile on the iPad for permanent trust.

## Security

code-server binds to `127.0.0.1` only — localhost, not the LAN. Nothing on the network can reach it directly. The Node server is the only thing exposed, and it requires a passkey to get through. code-server isn't sitting open on the network waiting for someone to guess the password.

The security boundary is Face ID on the iPad. The passkey lives in the Secure Enclave — it never leaves the device. The server stores only the public key. This is asymmetric crypto, same model as theTube's device auth: private key on device, public key on server, signature verifies.

## The shape

```
iPad (Safari) → Teleport → Node auth proxy (HTTPS, always on)
    ↳ Face ID unlocks passkey          ↳ verifies signature
                                       ↳ sets session cookie
                                       ↳ spawns code-server if not running
                                       ↳ proxies to code-server (localhost:8080)
                                       ↳ kills code-server after 30 min idle
```

Node proxy in front, code-server behind on demand, Teleport as the pipe. No extra layers.
