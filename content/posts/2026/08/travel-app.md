---
title: The Travel App
date: 2026-08-13
tags: [tech, travel]
type: journal
audience: public
status: journaling
coffee: 2
summary: All the pieces exist — share captures, push notifications, maps, journal entries, trip planning. The app is the native shell that ties them together. One app that does capture, receive, map, journal, and plan — backed by files at URLs.
workflow: draft
---

## The pieces already exist

Over the past few months, a system emerged from solving individual problems:

- **Share system** — tap share on my phone, anything becomes a capture. Photo, link, note, location. CloudFront logs it. A Lambda processes it. It accrues.
- **RSS reader** — subscribe to feeds, items accumulate alongside captures, surface in review sessions.
- **Maps** — NPS park tiles, OpenStreetMap routes, GeoJSON files for trips. Static HTML pages with Leaflet.
- **Push notifications** — title monitoring, feed items, alerts. Lambda detects something, APNs delivers it.
- **Journal** — markdown files that become blog posts. Written during or after trips.
- **Review sessions** — sit down with AI, process what accumulated, decide what to publish.

Each one works. Each one is a separate script, Lambda, web page, or conversation. There's no single interface that ties them together. The "app" is a collection of shell commands, browser tabs, and Kiro chats.

## What the app is

A native iOS app. One screen to capture. One screen to receive. One screen to see the map. One screen to write. One screen to plan.

**Capture** — the share extension that already exists conceptually. Share a photo from the camera, a link from Safari, a place from Maps. P-256 signature, CloudFront logs it. But now it's not just a share sheet target — it's an app you can open and see what you've captured recently without waiting for a review session.

**Receive** — push notifications from your own infrastructure. The title monitor found a new recording. The RSS reader surfaced something interesting. A place you saved has a weather alert. The tube talks to you instead of you having to go check.

**Map** — all 63 national parks, color-coded by visited/not-visited. Your sign photos as markers. Scenic routes as lines (US-89, Route 66, US-20). Saved places from your planning. Not Apple Maps, not Google Maps — your map. Your data. Your history.

**Journal** — write while traveling. Location-tagged. Date-stamped. Markdown. When you get home, promote the good entries to blog posts. The journal is the draft. The blog is the published version. Same files, different audience.

**Plan** — this is the one that doesn't exist yet.

## Planning is the gap

Every trip has the same question: where am I sleeping tonight?

Calendar doesn't work for this. A hotel reservation on July 15th in a calendar looks the same as a dentist appointment. What I need to see at a glance:

- Which nights have a confirmed place to stay
- Which nights are unaccounted for
- Where those places are on the map (am I driving 8 hours between Tuesday's hotel and Wednesday's hotel?)
- What's between them (parks, routes, points of interest)

The real problem is overlap — or rather, the lack of it. A hotel booking is "check-in afternoon Day 1, check-out morning Day 4." The next booking needs to start Day 4. Not Day 3 (you're still at the first place). Not Day 5 (you're sleeping in the car). The seam between bookings is where things break.

A calendar shows colored blocks but can't answer: "which nights don't have a bed?" You have to mentally verify that check-out from Place A aligns with check-in at Place B, for every pair of stops. Ten stops means nine seams to eyeball.

The data model makes this trivial:

```json
{
  "trips": [{
    "name": "Parks Loop 2027",
    "start": "2027-06-01",
    "end": "2027-06-21",
    "stays": [
      { "place": "Moab, UT", "checkIn": "2027-06-01", "checkOut": "2027-06-04", "confirmed": true, "notes": "Airbnb booked" },
      { "place": "Grand Canyon South Rim", "checkIn": "2027-06-05", "checkOut": "2027-06-08", "confirmed": false, "notes": "check campground" }
    ]
  }]
}
```

The gap detection is one line:

```javascript
const gaps = tripDates.filter(d => !stays.some(s => d >= s.checkIn && d < s.checkOut))
// → ["2027-06-04"] — no bed that night
```

Same pattern as everything else: diff actual state against expected state, surface anomalies. Expected: every night covered. Actual: your bookings. Gaps are the alert. The app shows this as a timeline — green for confirmed, amber for tentative, red for uncovered. Gaps are visible instantly.

You tap an unplanned night. The app shows what's nearby based on the previous and next confirmed stops. "You're in Moab on the 2nd and Grand Canyon on the 4th — here's what's in between." Not AI magic, just geography and simple math.

## The map is the interface

Not a list. Not a calendar grid. The map.

A road trip is inherently spatial. "Where am I sleeping" is a geographic question, not a temporal one. The calendar shows dates but hides distance. The map shows distance but can also show dates — each night's stop is a numbered point on the route.

The planning view: your stops on the map, numbered by night, connected by the road. Unplanned nights are gaps in the line. You can see immediately: "there's 600 miles between night 3 and night 5, I need to stop somewhere in between."

Click the gap. See what's there. NPS parks, saved places, points of interest from your captures. Drag a waypoint in. That night turns amber — tentative, needs a reservation.

## Where it lives

Same platform as everything else. The trip data is a JSON file on S3. The map page is a static HTML file. The app is the native iOS client that reads and writes those files via the same P-256 signed API that everything else uses.

```
trip.json        → S3 (the plan)
captures/*.json  → S3 (photos, notes from the trip)  
journal/*.md     → S3 → blog (writing from the trip)
parks.json       → S3 (lifetime park tracker)
```

No new infrastructure. No trip planning SaaS. No subscription. No database. Just files at URLs, rendered by a native app that knows about maps and dates.

## CarPlay

While driving, the app does two things:

1. **Receives** — push notifications from your Lambdas. "Tomorrow's campground check-in is at 2pm." "Weather alert for your destination." "New blog comment on yesterday's post."

2. **Captures** — "Hey Siri, tube capture" → dictate a thought → it lands as a capture with your current GPS coordinates. Drive past something interesting, say it out loud, deal with it later.

The app doesn't need a CarPlay UI. It needs push notification registration and a Siri Shortcut for voice capture. CarPlay shows the notifications automatically. Siri announces them if you enable it. The driving experience is: the tube watches and tells you things, you talk back when you want to capture something.

## The bet

Every travel app is either:
- A planning tool (TripIt, Wanderlog) — great before the trip, useless during
- A journal tool (Day One, blogging apps) — great after the trip, useless before
- A maps tool (Google Maps, AllTrails) — great for navigation, doesn't know about your trip
- A social tool (Instagram, travel blogs) — great for sharing, doesn't help you plan

None of them are all four. None of them own their data. None of them talk to your infrastructure. None of them grow a lifetime map from your actual travels.

The app is: plan, capture, journal, map — one thing, backed by files you own. The planning feeds the navigation. The captures feed the journal. The journal feeds the blog. The map grows from all of it. One loop, no seams.

[journey]:
prev: title-monitoring
The travel app is the native iOS shell around everything that already exists — share captures, push notifications, maps, journal, review sessions. The missing piece is trip planning: which nights have a place to stay, rendered on a map as a spatial timeline rather than a calendar grid. Data model is simple (JSON of nights with confirmed/tentative/unplanned states). The map is the interface because road trips are spatial, not temporal. CarPlay integration is push notifications inbound + Siri voice captures outbound. The bet: one app that does plan/capture/journal/map, backed by files at URLs, growing a lifetime travel record.
