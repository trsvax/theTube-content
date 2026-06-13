---
title: Tucumcari Murals
date: 2026-06-13
tags: [travel]
type: journal
audience: public
status: journaling
coffee: 1
summary: 55 murals on Route 66. A list on a wall, a GPX file that doesn't open in Maps, and the question of what format a walking tour should be.
workflow: draft
---

## The list

There's a printed list on the wall of a building in Tucumcari, New Mexico. "Tucumcari Mural Map Locations." 55 entries. Number, name, building, address. Laminated, sun-faded, taped to glass.

I photographed it.

## The file

A GPX file is XML with waypoints. Latitude, longitude, name, description. Every GPS app on earth reads it. It's the universal format for "here are some places."

```xml
<wpt lat="35.1718" lon="-103.7130">
  <name>21. James Dean</name>
  <desc>Blue Swallow Motel, 815 E. Route 66</desc>
</wpt>
```

55 waypoints. One per mural. Clustered along Route 66 east-to-west through town.

## The problem

Apple Maps doesn't open GPX files. There's no import. No "My Maps" equivalent. No way to say "here are 55 places, show them to me."

Google Maps handles it through My Maps. Gaia GPS handles it natively. Apple Maps — the one on the phone in your pocket while you're walking Route 66 — doesn't.

The workaround: an HTML file with `maps://` links. Each mural becomes a tappable link that opens Apple Maps at that coordinate. It works. But it's a webpage pretending to be a map, not a map.

Or: a Shortcut that reads the GPX and creates a Guide. Or: just use Google Maps. The format is fine. The reader is the constraint.

## The format question

The list on the wall is a table. Four columns. Human-readable. No coordinates — just addresses. "722 E. Route 66" is enough if you're standing on Route 66.

The GPX is machine-readable. Coordinates for every point. But no app on the phone opens it without friction.

The HTML is both — human-readable names, machine-readable coordinates embedded in links. But it requires a server or a local file or AirDrop to get it on the phone.

What format should a walking tour be? The answer is probably: all of them. The table for the wall. The GPX for the GPS apps. The HTML for the phone. Same data, different readers. Files at URLs.

## The murals

Tucumcari has 55 murals painted on buildings along Route 66. Dinosaurs, Billy the Kid, Elvis, trains, Route 66 cars. They're on motels, credit unions, abandoned buildings, water tanks. The Motel Safari alone has four.

The town is small enough to walk in an afternoon. The murals are the reason to.
