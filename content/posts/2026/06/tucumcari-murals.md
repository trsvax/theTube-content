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

## The waypoints

| # | Name | Location | Address |
|---|------|----------|---------|
| 1 | Dinosaur | Mesalands Dinosaur Museum | 222 E. Laughlin Ave. |
| 2 | Tucumcari Lumber Co. | Tucumcari Lumber | 211 S. 1st St. (South Wall) |
| 3 | Ranch Scene | Tucumcari General Insurance | 214 S. 2nd St. (North Wall) |
| 4 | Conchas Dam & Lake | Tucumcari General Insurance | 214 S. 2nd St. (West Wall of Adjacent Building) |
| 5 | Blessed | Abandoned Building | 3rd & Main (East Wall) |
| 6 | In Memory of Moynihan | Bob's Budget Pharmacy | 311 S. 2nd St. (South Wall) |
| 7 | Give them A Head Start | Eastern Plains Community Action Agency | 3rd St. & Central (East Wall) |
| 8 | Southern Pacific Union Pacific Rock Island | Massey Building | N. 2nd St. |
| 9 | I Love Tucumcari Mural | Alley Mural | S. Alley On Main St. Between 1st & 2nd St. |
| 10 | Tucumcari Legend Map | Alley Mural | N. Alley On Main St. Between 1st & 2nd St. |
| 11 | Arch Hurley | Princess Theater | 108 E. Main St. |
| 12 | Bird's Eye View of A Mural in the Making | Security Finance Building | 1st & Main St. |
| 13 | Western Welcome To Tucumcari | Israel Building | 2nd and Main |
| 14 | Alex Street - First Mayor of Tucumcari | City Hall | 205 E. Center |
| 15 | Memories of the Old Swimming Pool | Tucumcari Historical Museum | 416 S. Adams (Behind the Red Barn) |
| 16 | You Are Here | High Street Church | 424 E. High St. |
| 17 | Pray For Us | Knights of Columbus | 1st & Main St. |
| 18 | Fort Bascom Trading Post | Bascom Building | Main St. & Adams St. |
| 19 | Rattlers | Water Tank | 10th Street across from Elementary School |
| 20 | Texaco 66 | Bare & Wild Creations | 1201 E. Route 66 |
| 21 | James Dean | Blue Swallow Motel | 815 E. Route 66 |
| 22 | Mother Road | Motel Safari | 722 E. Route 66 |
| 23 | Elvis & Cadillac | Motel Safari | 722 E. Route 66 |
| 24 | Tucumcari Tonite! | Motel Safari | 722 E. Route 66 |
| 25 | Get Your Kicks | Motel Safari | 522 E. Route 66 (East Wall, NW Corner) |
| 26 | 66 Eyes On Route 66 | Ca Electric Co. | 505 E. Route 66 (Wall in Parking Lot) |
| 27 | Daylight Train | Everyones Federal Credit Union | 505 E. Route 66 |
| 28 | Waterfall | Everyones Federal Credit Union | 505 E. Route 66 |
| 29 | Onsite | La Cita | 820 S. 1st St. & Route 66 |
| 30 | Wanted: Billy the Kid | Palomino Motel | 1215 E. Route 66 |
| 31 | Route 66 Buffalo | Teepes Curios | 924 E. Route 66 |
| 32 | Route 66 Car | Teepes Curios | 924 E. Route 66 |
| 33 | Mural Rite 66 | Inside of McDonald's | 1st St. near I-40 |
| 34 | Striped Mountain Sunset | Roadrunner Lodge | 1023 E. Route 66 |
| 35 | Tucumcari Tonight | Continental Oil Company Gas Station | 815 E. Route 66 |
| 36 | Radio Ranch | KTNM-KQAY Station | S. Dale St. |
| 37 | Route 66 - West | Hairshop | 424 S. 7th St. |
| 38 | Happy Motoring | Historic Esso Station | (Next To) 1302 W. Route 66 |
| 39 | Six Shooter Siding - Capri | Abandoned Building | (Next To) 801 W. Tucumcari Blvd. |
| 40 | Get Your Kicks 66 | Magnolia Station | 1016 W. Tucumcari Blvd. |
| 41 | Rattlesnakes & Lions | Unknown | 602 W. Route 66 |
| 42 | Welcome To Tucumcari | Chamber of Commerce Visitor Center | 404 W. Route 66 |
| 43 | Quay County | Chamber of Commerce Visitor Center | 404 W. Route 66 |
| 44 | Whiting Brothers | Chamber Gas Station | 184 W. Tucumcari Blvd. |
| 45 | Phillips 66 | Quality Lube & Tire | 302 W. Route 66 |
| 46 | Where's My Horse? | Route 66 Smoke Shop | 202 W. Route 66 (SE and SW of Building) |
| 47 | The Legendary Road | Lowe's Market | 100 W. Tucumcari Blvd. (East Wall) |
| 48 | Abstract Spiral | Unknown | 717 S. 1st St. |
| 49 | Six Shooter Siding - Wolf & Truck | Abandoned Building | (Next To) 801 W. Tucumcari Blvd. |
| 50 | Honoring Vets | VFW | Between 1st & 2nd on Main Street |
| 51 | Route 66 | Mesalands Community College | 922 10th St. Repind Building A |
| 52 | Mural Inside Hospital | Cafeteria Wall | Trigg Memorial Hospital |
| 53 | WPA Mural | Court House | 300 S. 3rd Street |
| 54 | Flying Space Men | L'find Dispensary | 1st & Charles Ave. |
| 55 | Abstract New Mexico Landscape | Grasslands Dispensary | 1st & Crutcher Ave. |
