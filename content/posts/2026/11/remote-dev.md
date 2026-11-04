---
title: Remote Dev from an iPad
date: 2026-11-04
tags: [tech]
type: post
audience: public
coffee: 1
origin: travel
summary: Traveling without the laptop, coding from the iPad browser through a tunnel back to the Mac mini at home.
workflow: draft
---

The problem: you want to travel light. Just the iPad. No laptop, no extra apps. You still want to code — real work, not just editing a Google Doc. The projects live on your Mac at home. You need to reach them from the road.

## The pieces

The Mac mini stays home, always on. The iPad mini travels. Everything runs in the browser. No iPad apps required.

**Teleport.** You already have Ubiquiti gear and Teleport. It's a WireGuard tunnel built into your network that connects the iPad back to your LAN from anywhere. No third-party VPN service, no port forwarding, no public IP. It just works through hotel WiFi and coffee shop networks. This is the pipe.

**code-server.** VS Code in the browser. Runs on your Mac at home, accessed from Safari on the iPad over Teleport. You get the file explorer, syntax-highlighted editing, extensions, and an integrated terminal — all in a browser tab. No app to install on the iPad.

**kiro-cli.** The terminal version of Kiro. Runs inside code-server's integrated terminal. Same chat, same agent workflows, same MCP, same steering files. You open the terminal panel in the browser, run `kiro-cli`, and you have essentially what you have now in the IDE.

## The hardware

Two devices. One stays home, one travels.

**Mac mini M6** — the home server. Always plugged in, no lid to manage, no battery to degrade. Runs code-server, the Node auth proxy, kiro-cli, Copilot CLI, all your dev tools, your git repos. Headless — you don't need a display, you're reaching it through code-server. Low power draw, quiet, can run 24/7 without thinking about it. This replaces the "keep the MacBook awake" problem entirely. A mini just stays on.

The M6 starts at $899 with 16GB RAM and 256GB SSD. For this use case, bump the RAM:

- **M6, 32GB RAM, 512GB SSD — $1,499.** 32GB is the sweet spot. You're running code-server, two AI CLI tools (kiro-cli and Copilot CLI), the Node auth proxy, and your dev environment — all at once on the same machine. 16GB would work but you'd feel it with multiple tools active. 32GB gives headroom. 512GB is enough for repos and tools; you're not storing media on this machine.

**iPad mini (A17 Pro)** — the travel client. Small enough for a jacket pocket, big enough for code-server in Safari. Cellular model means you don't depend on hotel WiFi — you can work from anywhere with a signal. Face ID for the passkey auth. The mini is the right size: a full iPad is too much to carry, a phone is too small to code on.

**UPS** — already solved. The mini lives in the Airstream, which has lithium batteries. The batteries are the UPS. Power goes out, the mini keeps running. No extra hardware to buy.

That's the hardware. You already have the Ubiquiti networking gear, Teleport, and battery backup in the Airstream. The mini is the server, the iPad mini is the client. Nothing else to buy.

## The setup

You already have code-server running and Teleport on the iPad. The only piece left:

1. **kiro-cli installed on the Mac mini.** `npm install -g @kiro/cli`. Run it once locally to confirm it works, authenticates, and picks up your steering files and MCP config.

2. **Mac mini stays awake.** A mini doesn't sleep the way a MacBook does — no lid to close. But check Energy Saver settings: set it to never sleep when the display is off. `sudo pmset -c sleep 0 disablesafe` or just toggle it in System Settings.

3. **Test the full path.** Before you leave, connect to Teleport from outside the house (hotspot off your phone), open Safari, navigate to your auth server URL, Face ID, confirm code-server loads, open the terminal, run `kiro-cli`. Confirm the whole chain works end to end.

## On the road

Open Safari. Connect to Teleport if it's not already running. Navigate to your auth server URL, Face ID to authenticate, and code-server loads — full VS Code in the browser. File explorer on the left, editor on the right, terminal at the bottom. Open the terminal, `cd` to your project, run `kiro-cli`.

Save the URL as a desktop app on the iPad — Safari's Share button → Add to Home Screen. It opens full-screen, no browser chrome, and sits on the home screen like any other app. One tap and you're in.

You're working. The Mac mini does the computing; the iPad is just the screen. Everything stays on the Mac mini — the code, the builds, the git history. Nothing travels with you except the iPad.

## What you have vs the IDE

What works the same:
- Chat and agent workflows
- Hooks, MCP, steering files
- File access, git, builds, tests
- Workflows and subagents
- File editing with syntax highlighting and explorer

What you lose:
- The visual spec workflow (requirements → design → tasks panels)
- Inline diff view — the CLI shows diffs in the terminal, which is fine but not as smooth
- The Problems panel — you'd run builds and read output instead

For most work this is fine. The spec panels are nice but the CLI has specs too, just terminal-based. The biggest real loss is the inline diff review — in the IDE you get hunks you accept or reject visually. In the CLI you get the diff in text and approve verbally. Workable, just different.

## Security

code-server has two auth options: a password you type each session, or a token baked into the URL. The token approach is convenient — save the URL as a bookmark or PWA on the iPad and you're in with one tap. But the tradeoff is real: if the iPad is unlocked, code-server is unlocked. No second password gate.

The security boundary becomes the iPad's lock screen. Face ID or passcode is the only thing between someone and your Mac's terminal. In practice that's probably fine — if someone has your unlocked iPad, code-server access is the least of your problems. But be honest with yourself about the risk: this gives full shell access to your home Mac, which means full access to everything on it.

Over Teleport the traffic is already encrypted (WireGuard), so HTTP between the iPad and code-server is fine. The token in the URL is the only auth layer.

If you want a gate, use the password instead of the token. You type it once per Safari session. Slightly less convenient, meaningfully more secure.

The better option: passkeys. A small Node server on the Mac mini handles WebAuthn and proxies to code-server — Face ID to authenticate, no password, no token in the URL, code-server locked to localhost. That's its own post: [A Passkey Proxy for code-server](https://thetube.today/posts/passkey-proxy).

## The mini does more than dev

The Mac mini is always on and always home, which makes it a natural home server beyond just code-server. One use case: photo backup to S3. The mini joins your iCloud Photos pool, a job mirrors new photos to S3 as an offsite backup. The question of where the full-res comes from — external storage or a job that triggers iCloud downloads on demand — is a software problem worth its own post. For now: the mini can serve double duty, and the hardware choice (RAM, storage) should account for that.

## Two AI tools, one setup

This isn't just for personal projects. The Copilot CLI runs in the terminal alongside kiro-cli. Copilot for work code, kiro-cli for personal projects.

Same Mac mini. Same code-server. Same iPad. Both tools run in the integrated terminal — the editor is for editing, the AI lives in the terminal. They don't conflict because they're separate processes you run when you need them.

## What's tested, what isn't

The basics work: code-server in the browser on the iPad over Teleport from outside the house. That's been tested — you go places and use it. What hasn't been tested yet:

- kiro-cli and Copilot CLI running through code-server's terminal over the tunnel
- The Node auth proxy with passkeys over Teleport
- VNC/Screen Sharing over the tunnel

The remote dev path is proven. The AI tools and the passkey auth layer are the new pieces that need testing.

## Fallback: remote desktop

If you need the full macOS GUI — System Settings, a GUI app, something that doesn't work headless — Screen Sharing is built into macOS. Enable it in System Settings → Sharing → Screen Sharing. From another Mac, connect with the Screen Sharing app over Teleport. From a non-Mac laptop, any VNC client works.

code-server is the daily driver. Remote desktop is the escape hatch.

## Remote reboot

You can reboot the Mac mini remotely via SSH: `sudo reboot`. The Mac comes back up, services start via LaunchDaemons (system-level, like systemd on Linux — they run on boot independent of login), Teleport reconnects, and you're back in.

One catch: FileVault. If it's on, the Mac stops at a pre-boot password screen before the OS starts. No SSH, no services, no Teleport — just a black screen waiting for a password. You'd need to physically be there.

On Apple Silicon (M6), the disk is always hardware-encrypted by the Secure Enclave. FileVault just adds the password gate on top. Turning it off doesn't make the disk unencrypted — it just means the Mac boots without asking for a password first. The data is still protected by hardware encryption.

For a Mac mini in a locked Airstream, FileVault off is the reasonable call. The physical security is the locked Airstream itself. The tradeoff: anyone with physical access could boot the machine, but anyone with physical access to the Airstream is already a different problem.

## What you don't need

- **iPad apps.** No Blink Shell, no Termius, no SSH client. The browser is the only app. Teleport has a small app for the VPN connection, but that's networking, not a dev tool.

- **A laptop.** The whole point.

## The one thing that matters

The Mac mini has to stay awake and reachable. Teleport gives you the tunnel. The browser keeps you connected. A mini doesn't have the sleep problems of a MacBook — no lid, always plugged in — and the Airstream's lithium batteries handle power outages. Internet is covered too: dual WAN on the router load-balances Google and AT&T, so if one drops the other takes over. The last remaining risk is both ISPs going down at the same time, which is unlikely enough not to plan around.

The Mac mini at home is the server. The iPad mini browser is the client. Teleport is the connection. The Node auth proxy is the gate. code-server is the editor. kiro-cli is the app. The Airstream's batteries are the UPS. That's the whole stack.
