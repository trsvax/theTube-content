---
title: Java Done Right
date: 2026-05-29
tags: [tech]
type: journal
audience: public
status: vague-thought
coffee: 0
origin: chat
summary: Java spent 25 years building abstractions to hide Java. JS is not the little brother — it's Java's goals done right for the internet.
workflow: draft
---

Write once run anywhere? JS actually did it. The browser, the server, Lambda, your phone, a Raspberry Pi. No JVM, no classpath, no `AbstractSingletonProxyFactoryBean`. Just the runtime that's already there.

The internet is async. HTTP is async. DNS is async. TCP is async. The whole network is "send a packet, maybe get a response later." JS just didn't pretend otherwise. Java spent 25 years building abstractions to hide that fact, then finally admitted it with virtual threads.

Java spent 25 years building abstractions to hide Java.

And if the stories are believed, that's where JS actually came from. Netscape needed a scripting language, Sun wanted Java in the browser, Brendan Eich built JavaScript in 10 days as the "lightweight Java for the web." The name was a marketing deal with Sun. It was supposed to be Java's little brother.

The one built in 10 days for the browser outlived the one built in years for the enterprise. Because the internet won and the internet is async.

[journey]:
prev: tube-request
Came out of asking "is JS better than Java for this?" The answer: the tube is inherently async — POST, wait, poll, get result. That's one line in JS. In Java it's CompletableFuture or reactive streams or virtual threads or blocking and pretending. The language and the architecture agree in JS. In Java they fight.
