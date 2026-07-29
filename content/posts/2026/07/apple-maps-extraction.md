---
title: Extracting Places from Apple Maps
date: 2026-07-18
tags: [tech]
type: journal
audience: public
status: journaling
coffee: 1
summary: Apple Maps has no export button. Your saved places live in a CloudKit-synced SQLite database managed by a system daemon. The data is structured and accessible — if you know where to look and what permissions to grant.
workflow: draft
---

## The question

Can I get my saved places out of Apple Maps? Pins, favorites, collections — the stuff I've been accumulating for years. No export button exists. No API. Apple doesn't want you thinking about this.

## Where the data lives

The Maps app container on macOS has a `Pins.mapsdata` file:

```
~/Library/Containers/com.apple.Maps/Data/Library/Maps/Pins.mapsdata
```

It's a binary plist wrapping protobuf-encoded pin data. Each pin is a small blob with lat/lng as IEEE 754 doubles:

```python
import struct, plistlib

with open(path, 'rb') as f:
    plist = plistlib.load(f)

for pin_data in plist.get('PinsKey', []):
    # Protobuf structure: field 5 contains nested coords
    # Offset into the nested message for the two fixed64 doubles
    lat = struct.unpack('<d', pin_data[7:15])[0]
    lng = struct.unpack('<d', pin_data[15:23])[0]
    print(f'{lat}, {lng}')
```

But that file only holds dropped pins — the red pins you place manually. One pin on my machine. Not the interesting data.

## The real database

Your favorites, collections, and saved places sync through CloudKit into a SQLite database called `MapsSync_0.0.1`. The schema (visible on the iOS Simulator) has everything:

```
ZFAVORITEITEM    — saved places with lat, lng, name, address, category
ZCOLLECTION     — your named collections
ZCOLLECTIONITEM — places within each collection  
ZHISTORYITEM    — search and navigation history
```

The `ZFAVORITEITEM` table has the fields you'd want:

```
ZLATITUDE, ZLONGITUDE
ZCUSTOMNAME, ZMAPITEMNAME, ZMAPITEMADDRESS, ZMAPITEMCATEGORY
ZCREATETIME, ZMODIFICATIONTIME
```

The problem: on macOS, this database is managed by `mapsd`, a system daemon. It lives in a protected path that requires Full Disk Access or root to reach. Apple sandboxed it away from you.

## What actually works

**Option 1: Full Disk Access**

Grant Terminal (or your script) Full Disk Access in System Settings → Privacy & Security. Then find and read the MapsSync database directly. You get everything in one shot — every favorite, every collection, every item with coordinates and metadata.

**Option 2: AppleScript**

Script the Maps app through the Accessibility APIs. Open Maps, navigate to Library, iterate through collections. Slower, fragile if Apple changes the UI, but works without special permissions.

**Option 3: Shortcuts capture**

Build an Apple Shortcut that fires when you share a place from Maps. It captures name + coordinates and appends to a file. Forward-looking — captures new saves but doesn't retroactively export existing ones.

## The deeper issue

Apple treats your saved places as app data, not user data. There's no "Export my places" because the mental model is: Maps is the canonical interface. You don't need your data outside of Maps because Maps is always there.

This is the same pattern as Notes, Reminders, Health — your data is accessible only through Apple's UI. The underlying storage is SQLite with clean schemas, perfectly structured for export. They just don't let you at it easily.

## The protobuf detail

The pin format is worth documenting. The binary plist contains an array under `PinsKey`, each entry a protobuf message:

```
20 01        — field 4, varint, value 1
2a 1d        — field 5, length-delimited, 29 bytes
  0a 12      — field 1, length-delimited, 18 bytes  
    09 [8B]  — field 1, fixed64 (latitude as double)
    11 [8B]  — field 2, fixed64 (longitude as double)
  19 [8B]    — field 3, fixed64 (third value — possibly timestamp)
```

No schema file exists publicly. You reverse-engineer it by looking at the wire format and checking if the doubles land on valid coordinates. When `30.35, -97.74` comes back and that's Austin, you know you got it right.

## What I'd build

A Python script that:
1. Reads the MapsSync database (with Full Disk Access)
2. Exports favorites and collections as GeoJSON
3. Outputs a GPX file for interop with other mapping tools

GeoJSON because it's the universal interchange format for geo data. GPX because every hiking/mapping app imports it. Both are just files — they could live on S3, rendered on a map with Leaflet, or fed into a review session.

The places I've saved in Apple Maps over the years are a personal geography. Trip planning, favorite restaurants, places I want to visit. That data shouldn't be locked in one app's daemon-controlled SQLite file. It should be files at URLs.

[journey]:
prev: rss-reader
Apple Maps saved places are stored in a CloudKit-synced SQLite database (MapsSync) with a clean schema — favorites, collections, history, all with coordinates and metadata. The database is protected by macOS sandboxing (requires Full Disk Access). Dropped pins use a simpler protobuf-in-plist format. No public API exists for personal Maps data. The extraction path is: grant disk access, read SQLite, export as GeoJSON/GPX.
