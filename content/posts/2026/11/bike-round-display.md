---
title: A Round Display on a Bike
date: 2026-11-04
tags: [making, bike]
type: post
audience: public
coffee: 1
origin: ride
summary: What if a round display on the bike showed speed and turns, driven by an iPad in your bag?
workflow: draft
---

A round TFT on the handlebars. An iPad in the bag doing the thinking. Bluetooth between them.

That's the whole idea so far.

The ESP32 has BLE built in. The round display — one of those 1.28" GC9A01 panels — sits on the bars and shows what the iPad tells it. The iPad runs the navigation, reads the GPS, computes the speed. The ESP32 just renders. They talk over a GATT characteristic, small JSON messages, nothing heavy.

What goes on the screen is simple: speed in the center, next turn arrow and distance nearby, maybe a street name. The data is tiny. Speed updates a few times a second. Turns change when they change. BLE bandwidth is not the problem here.

The iPad is the interesting part. It has GPS, it has MapKit, it has the routing. An app — SwiftUI, CoreBluetooth — connects to the ESP32 and pushes updates. The bike doesn't need its own sensors or its own brain. The phone in your bag is already computing everything; the display is just a window onto it.

Why a round display specifically? Aesthetics mostly. A round screen on a bike looks like it belongs. Rectangular dashboards feel like they were lifted from a car. A circle reads as a gauge, a dial, something that was always meant to be round.

The mount is the other half. The display needs to sit on the bars, and the cleanest way is a Garmin quarter-turn adapter — the same interface every bike light and computer uses. The Garmin mount pattern is standardized and well-documented: a defined diameter, two tabs that rotate and lock, a slight ramp. Hundreds of models on Printables already show the geometry.

An adapter would be two things in one print: the Garmin quarter-turn interface on the bottom, a circular cradle on top sized to the display PCB. The whole thing is parametric — maybe 50-100 lines of OpenSCAD — so you tweak the tab thickness, the holder diameter, the tolerance for your printer. AI can generate that. It's geometric and parametric, not organic, which is the kind of 3D model generation that actually works. Print it in PETG or ABS for the sun.

This is a vague thought. The shape of it: ESP32 firmware that renders to the TFT, a BLE protocol for commands, an iPad app that drives the whole thing, and a 3D-printed mount that locks it to the bars. Start with the display side, get it rendering and receiving, then build the app to feed it.

Not building it yet. Just thinking about it on the ride.

The real question isn't whether AI can build it. It can. The real question is whether you build it and then ride, or just ride.

Then you think about mounting the iPad on the bars with a Quad Lock and it seems like the answer. The iPad is already a display. It already has GPS, routing, speed. Why build anything?

Because the iPad doesn't have to be there all the time. The round display does. It's small, it's clean, it stays on the bike. The iPad lives in the bag and connects when you ride. You don't want a tablet on the bars for a coffee run. You do want speed and the next turn.

So the project lives. The round display is the always-on minimum. The iPad is the brain you carry when you need it.
