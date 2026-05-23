---
title: CGI Was Almost Right
date: 2026-05-21
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: walk
summary: CGI was stateless, serverless, one-request-one-process. The only thing wrong with it was blocking. 202 fixes that — but the browser couldn't handle 202 until 2004.
workflow: draft
---

CGI was the first way to have dynamic content on the web. Request comes in, script runs, response goes out, process dies. No state, no server to manage, no connection pool. Stateless by design.

Then the industry decided it was too slow. Fork a process per request? Unacceptable. So we built app servers — persistent processes, thread pools, session state, connection reuse. Twenty years of complexity to solve a performance problem.

Now: CloudFront Functions, Lambda, edge compute. Request comes in, function runs, response goes out, nothing persists. We're back to CGI. Same model, different scale.

## What was actually wrong

CGI wasn't slow because it was stateless. It was slow because it was synchronous. The client sends a request, the server forks a process, the process does work, the client *waits*. If the work takes 3 seconds, the client blocks for 3 seconds.

The fix wasn't app servers. The fix was 202.

```
Client: GET /cgi-bin/submit?data=...
Server: 202 Accepted
```

Done. Client moves on. Server processes whenever. No blocking, no forking under load pressure, no reason to keep a process alive between requests.

## 202 was always there

HTTP/1.0 — RFC 1945, May 1996 — defined 202 Accepted. The status code existed from the beginning. CGI never used it because the mental model was "the script produces the response." The form submits, the script runs, the "thank you" page renders. Synchronous by assumption, not by necessity.

## The browser couldn't handle it

Even if a CGI script had returned 202 in 1996, what would the browser do? Show a blank page. There was no JavaScript to fire a background request. No XHR, no fetch, no way to say "send this and don't wait." Every request was a page navigation. The browser's only mode was request → render.

The timeline:
- **1993** — CGI exists. Synchronous.
- **1996** — HTTP/1.0 defines 202. No client can use it.
- **1999** — XHR ships in IE5. Background requests become possible.
- **2004** — "Ajax" — people realize you can fire requests without navigating.
- **2015** — `fetch()` — clean fire-and-forget API.
- **2025** — Apple Shortcuts, Service Workers, any HTTP client that isn't a browser tab.

The status code was ahead of the clients by a decade. The infrastructure to *use* 202 properly didn't exist until much later.

## The client CGI never had

An Apple Shortcut is the client that makes async CGI work. It fires a GET, doesn't care about the response body, doesn't render anything. The watch doesn't have a browser. It has an HTTP client. That's all it needs.

```
Shortcut → GET /create/thought?text=... → 202 → done
```

Same as CGI: stateless, one request, no server. Minus the one thing that was wrong: blocking. The Shortcut doesn't block because it doesn't need a response. The CloudFront Function doesn't block because it returns immediately. Nobody waits for anybody.

## The circle

CGI (1993) → App servers (2000s) → Serverless (2015) → Edge functions (2020s)

We added persistent processes, connection pools, session stores, load balancers, container orchestration, service meshes — all to solve a problem that 202 already solved. The answer was in the spec the whole time. We just didn't have clients that could use it.

[journey]:
Walk thought. Was CGI the right model? Yes — minus the synchronous assumption. 202 existed in HTTP/1.0 (1996) but browsers couldn't handle it until XHR (1999) and really until fetch (2015). The Shortcut is the client CGI never had — fire and forget, no rendering, no blocking.
