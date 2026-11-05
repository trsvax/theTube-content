---
title: A Passkey Proxy for the Mac mini
date: 2026-11-04
tags: [tech]
type: post
audience: public
coffee: 1
origin: travel
summary: A small Node server that authenticates with Face ID via passkeys and gates both code-server and a browser shell on the Mac mini.
workflow: draft
---

code-server in the browser is great until you think about who can reach it. A token in the URL means anyone with the unlocked iPad is in. A password means typing it every session. Neither feels right for a server that gives full shell access to your Mac.

The better option: passkeys. A small Node server on the Mac mini handles WebAuthn and gates whatever sits behind it. Safari on iPad supports passkeys natively, stored in the Secure Enclave, unlocked with Face ID. You navigate to the auth server, Safari prompts for Face ID, you tap, the server sets a session cookie and routes you through. No password to type, no token in the URL, and the auth is cryptographic — a real key, not a reusable string.

The proxy is one front door with two backends behind it: code-server for full dev, and a browser shell for when you just want a terminal. Same Face ID, pick the surface.

## What it does

Three things:

1. **Register** — one-time enrollment. iPad visits the page, Safari prompts for Face ID, the passkey is created and the public key is stored in SQLite.
2. **Authenticate** — on every visit, the server sends a challenge. Safari prompts Face ID, the iPad signs the challenge with the private key in the Secure Enclave, the server verifies it against the stored public key, sets a session cookie.
3. **Route** — once authenticated, the session cookie authorizes both backends: HTTP requests proxy to code-server on `127.0.0.1:8080`, and a WebSocket connects to the browser shell. Unauthenticated requests get the login page.

## Two backends, one door

The same auth gates two surfaces:

- **code-server** (full dev) — the editor, file explorer, extensions, and an integrated terminal. Proxied over HTTP. This is the heavy tier, for when you're editing by hand.
- **The browser shell** (just a terminal) — xterm.js in the browser, a real `zsh` on the Mac via `node-pty`, streamed over a WebSocket. This is the light tier, for when all you want is a command line.

You Face ID once. The session cookie authorizes both. You pick the surface depending on the task: open code-server when you want the editor, open the shell when you just want to run something.

The shell is the more interesting one. Most of what you do remotely is run a CLI tool — `kiro-cli` for coding (it edits files itself, so you don't need the editor pane), or `llm` for a quick question that has nothing to do with code. The shell runs any of it. A terminal doesn't care what you type into it, so one authenticated shell covers dev work and everything else. code-server becomes optional — the thing you reach for only when you genuinely want to edit files by hand.

## Start on demand

code-server doesn't need to run 24/7. The proxy is always on (it's lightweight — just Node and SQLite), but code-server is the heavy process. The proxy starts it on successful auth and shuts it down after a period of inactivity.

On auth: check if code-server is running. If not, spawn it as a child process bound to `127.0.0.1:8080`. Proxy requests to it once it's up.

On inactivity: a timer checks the last request timestamp. If nothing has hit the proxy for 30 minutes, kill the code-server process. Next auth spawns it again.

This is more reliable than running code-server as a daemon — if it crashes or hangs, the proxy just starts a fresh instance on the next auth. No `brew services` to manage, no stale process. The proxy is the lifecycle manager.

## The stack

- **Node 24** — `node:sqlite` is built in, no external database
- **`@simplewebauthn/server`** — handles the WebAuthn protocol (challenge generation, response verification)
- **`http-proxy-middleware`** — proxies authenticated requests to code-server
- **`xterm.js`** (browser) + **`node-pty`** (server) — the browser shell: xterm.js renders the terminal, node-pty spawns a real `zsh`, a WebSocket streams keystrokes up and output down
- **Fastify** — HTTP server and WebSocket upgrade

A handful of dependencies, everything else built in. The public key is a row in SQLite, the auth is a function, the URL is the interface, and the shell is a PTY on a socket.

The browser shell can stand alone. If you never want the editor, drop code-server entirely — the proxy, xterm.js, and node-pty are the whole stack. Face ID in, you're at a `zsh` prompt, run `kiro-cli` or `llm` or anything else. That's a tiny system you own completely, no VS Code dependency at all.

## HTTPS

Safari's WebAuthn API requires a secure context to create or use passkeys. The traffic is already encrypted by Teleport (WireGuard), so HTTPS is just to satisfy the browser's security requirement.

A self-signed cert generated with openssl works fine. No real cert needed — this is a private network. Either tap through Safari's warning or install the self-signed cert as a profile on the iPad for permanent trust.

## Security

code-server binds to `127.0.0.1` only — localhost, not the LAN. Nothing on the network can reach it directly. The Node server is the only thing exposed, and it requires a passkey to get through. code-server isn't sitting open on the network waiting for someone to guess the password.

The security boundary is Face ID on the iPad. The passkey lives in the Secure Enclave — it never leaves the device. The server stores only the public key. This is asymmetric crypto, same model as theTube's device auth: private key on device, public key on server, signature verifies.

Be deliberate about one thing: the browser shell is a real `zsh` with full shell access, reachable over the tunnel. The passkey is the only gate between the network and a shell that can do anything on the Mac. That's fine — remote dev is the whole point — but it means the Face ID auth isn't a convenience, it's the entire security boundary. Keep the session cookie short-lived and require re-auth, so a stolen cookie doesn't hold a shell open forever.

## The shape

```
iPad (Safari) → Teleport → Node auth proxy (HTTPS, always on)
    ↳ Face ID unlocks passkey    ↳ verifies signature, sets session cookie
                                 │
                                 ├→ code-server (HTTP proxy, localhost:8080)
                                 │     ↳ spawned on demand, killed after 30 min idle
                                 │
                                 └→ browser shell (WebSocket → node-pty → zsh)
                                       ↳ run kiro-cli, llm, git, anything
```

One Node proxy in front, two backends behind, Teleport as the pipe. Face ID gates both. code-server is the heavy tier for editing; the shell is the light tier for running CLI tools. Pick the surface — or drop code-server and keep just the shell. No extra layers either way.
