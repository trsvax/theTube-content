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

Starting at Motel Safari, walking east along Route 66, then back through downtown and west.

| # | Name | Location | Address |
|---|------|----------|---------|
| 22 | [Mother Road](https://maps.apple.com/?q=Mother+Road+Mural&ll=35.1718,-103.7140) | Motel Safari | 722 E. Route 66 |
| 23 | [Elvis & Cadillac](https://maps.apple.com/?q=Elvis+and+Cadillac&ll=35.1718,-103.7140) | Motel Safari | 722 E. Route 66 |
| 24 | [Tucumcari Tonite!](https://maps.apple.com/?q=Tucumcari+Tonite&ll=35.1718,-103.7140) | Motel Safari | 722 E. Route 66 |
| 25 | [Get Your Kicks](https://maps.apple.com/?q=Get+Your+Kicks&ll=35.1718,-103.7155) | Motel Safari | 522 E. Route 66 (East Wall, NW Corner) |
| 21 | [James Dean](https://maps.apple.com/?q=James+Dean+Mural&ll=35.1718,-103.7130) | Blue Swallow Motel | 815 E. Route 66 |
| 35 | [Tucumcari Tonight](https://maps.apple.com/?q=Tucumcari+Tonight&ll=35.1718,-103.7130) | Continental Oil Company Gas Station | 815 E. Route 66 |
| 31 | [Route 66 Buffalo](https://maps.apple.com/?q=Route+66+Buffalo&ll=35.1718,-103.7110) | Teepes Curios | 924 E. Route 66 |
| 32 | [Route 66 Car](https://maps.apple.com/?q=Route+66+Car&ll=35.1718,-103.7110) | Teepes Curios | 924 E. Route 66 |
| 34 | [Striped Mountain Sunset](https://maps.apple.com/?q=Striped+Mountain+Sunset&ll=35.1718,-103.7100) | Roadrunner Lodge | 1023 E. Route 66 |
| 20 | [Texaco 66](https://maps.apple.com/?q=Texaco+66+Mural&ll=35.1718,-103.7090) | Bare & Wild Creations | 1201 E. Route 66 |
| 30 | [Wanted: Billy the Kid](https://maps.apple.com/?q=Billy+the+Kid+Mural&ll=35.1718,-103.7080) | Palomino Motel | 1215 E. Route 66 |
| 1 | [Dinosaur](https://maps.apple.com/?q=Dinosaur+Mural&ll=35.1908,-103.7052) | Mesalands Dinosaur Museum | 222 E. Laughlin Ave. |
| 51 | [Route 66](https://maps.apple.com/?q=Route+66+Mural+Mesalands&ll=35.1740,-103.7130) | Mesalands Community College | 922 10th St. Repind Building A |
| 19 | [Rattlers](https://maps.apple.com/?q=Rattlers+Mural&ll=35.1740,-103.7130) | Water Tank | 10th Street across from Elementary School |
| 26 | [66 Eyes On Route 66](https://maps.apple.com/?q=66+Eyes+On+Route+66&ll=35.1718,-103.7165) | Ca Electric Co. | 505 E. Route 66 (Wall in Parking Lot) |
| 27 | [Daylight Train](https://maps.apple.com/?q=Daylight+Train&ll=35.1718,-103.7165) | Everyones Federal Credit Union | 505 E. Route 66 |
| 28 | [Waterfall](https://maps.apple.com/?q=Waterfall+Mural&ll=35.1718,-103.7165) | Everyones Federal Credit Union | 505 E. Route 66 |
| 33 | [Mural Rite 66](https://maps.apple.com/?q=Mural+Rite+66&ll=35.1718,-103.7200) | Inside of McDonald's | 1st St. near I-40 |
| 29 | [Onsite](https://maps.apple.com/?q=La+Cita+Mural&ll=35.1710,-103.7215) | La Cita | 820 S. 1st St. & Route 66 |
| 16 | [You Are Here](https://maps.apple.com/?q=You+Are+Here+Mural&ll=35.1740,-103.7185) | High Street Church | 424 E. High St. |
| 54 | [Flying Space Men](https://maps.apple.com/?q=Flying+Space+Men&ll=35.1725,-103.7195) | L'find Dispensary | 1st & Charles Ave. |
| 55 | [Abstract New Mexico Landscape](https://maps.apple.com/?q=Abstract+New+Mexico&ll=35.1725,-103.7185) | Grasslands Dispensary | 1st & Crutcher Ave. |
| 14 | [Alex Street - First Mayor of Tucumcari](https://maps.apple.com/?q=Alex+Street+Mural&ll=35.1730,-103.7205) | City Hall | 205 E. Center |
| 11 | [Arch Hurley](https://maps.apple.com/?q=Arch+Hurley+Mural&ll=35.1725,-103.7210) | Princess Theater | 108 E. Main St. |
| 12 | [Bird's Eye View of A Mural in the Making](https://maps.apple.com/?q=Birds+Eye+View+Mural&ll=35.1725,-103.7215) | Security Finance Building | 1st & Main St. |
| 17 | [Pray For Us](https://maps.apple.com/?q=Pray+For+Us+Mural&ll=35.1725,-103.7215) | Knights of Columbus | 1st & Main St. |
| 2 | [Tucumcari Lumber Co.](https://maps.apple.com/?q=Tucumcari+Lumber+Mural&ll=35.1720,-103.7220) | Tucumcari Lumber | 211 S. 1st St. (South Wall) |
| 48 | [Abstract Spiral](https://maps.apple.com/?q=Abstract+Spiral&ll=35.1710,-103.7220) | Unknown | 717 S. 1st St. |
| 9 | [I Love Tucumcari Mural](https://maps.apple.com/?q=I+Love+Tucumcari&ll=35.1722,-103.7225) | Alley Mural | S. Alley On Main St. Between 1st & 2nd St. |
| 10 | [Tucumcari Legend Map](https://maps.apple.com/?q=Tucumcari+Legend+Map&ll=35.1728,-103.7225) | Alley Mural | N. Alley On Main St. Between 1st & 2nd St. |
| 50 | [Honoring Vets](https://maps.apple.com/?q=Honoring+Vets+Mural&ll=35.1725,-103.7225) | VFW | Between 1st & 2nd on Main Street |
| 8 | [Southern Pacific Union Pacific Rock Island](https://maps.apple.com/?q=Railroad+Mural&ll=35.1730,-103.7230) | Massey Building | N. 2nd St. |
| 13 | [Western Welcome To Tucumcari](https://maps.apple.com/?q=Western+Welcome&ll=35.1725,-103.7230) | Israel Building | 2nd and Main |
| 3 | [Ranch Scene](https://maps.apple.com/?q=Ranch+Scene+Mural&ll=35.1715,-103.7235) | Tucumcari General Insurance | 214 S. 2nd St. (North Wall) |
| 4 | [Conchas Dam & Lake](https://maps.apple.com/?q=Conchas+Dam+Mural&ll=35.1715,-103.7235) | Tucumcari General Insurance | 214 S. 2nd St. (West Wall of Adjacent Building) |
| 6 | [In Memory of Moynihan](https://maps.apple.com/?q=Moynihan+Mural&ll=35.1710,-103.7235) | Bob's Budget Pharmacy | 311 S. 2nd St. (South Wall) |
| 5 | [Blessed](https://maps.apple.com/?q=Blessed+Mural&ll=35.1725,-103.7250) | Abandoned Building | 3rd & Main (East Wall) |
| 53 | [WPA Mural](https://maps.apple.com/?q=WPA+Mural&ll=35.1710,-103.7250) | Court House | 300 S. 3rd Street |
| 7 | [Give them A Head Start](https://maps.apple.com/?q=Head+Start+Mural&ll=35.1720,-103.7255) | Eastern Plains Community Action Agency | 3rd St. & Central (East Wall) |
| 47 | [The Legendary Road](https://maps.apple.com/?q=Legendary+Road&ll=35.1718,-103.7260) | Lowe's Market | 100 W. Tucumcari Blvd. (East Wall) |
| 15 | [Memories of the Old Swimming Pool](https://maps.apple.com/?q=Swimming+Pool+Mural&ll=35.1700,-103.7265) | Tucumcari Historical Museum | 416 S. Adams (Behind the Red Barn) |
| 18 | [Fort Bascom Trading Post](https://maps.apple.com/?q=Fort+Bascom+Trading+Post&ll=35.1725,-103.7270) | Bascom Building | Main St. & Adams St. |
| 46 | [Where's My Horse?](https://maps.apple.com/?q=Wheres+My+Horse&ll=35.1718,-103.7270) | Route 66 Smoke Shop | 202 W. Route 66 (SE and SW of Building) |
| 36 | [Radio Ranch](https://maps.apple.com/?q=Radio+Ranch+Mural&ll=35.1700,-103.7280) | KTNM-KQAY Station | S. Dale St. |
| 45 | [Phillips 66](https://maps.apple.com/?q=Phillips+66+Mural&ll=35.1718,-103.7280) | Quality Lube & Tire | 302 W. Route 66 |
| 37 | [Route 66 - West](https://maps.apple.com/?q=Route+66+West+Mural&ll=35.1710,-103.7290) | Hairshop | 424 S. 7th St. |
| 42 | [Welcome To Tucumcari](https://maps.apple.com/?q=Welcome+To+Tucumcari&ll=35.1718,-103.7295) | Chamber of Commerce Visitor Center | 404 W. Route 66 |
| 43 | [Quay County](https://maps.apple.com/?q=Quay+County+Mural&ll=35.1718,-103.7295) | Chamber of Commerce Visitor Center | 404 W. Route 66 |
| 41 | [Rattlesnakes & Lions](https://maps.apple.com/?q=Rattlesnakes+Lions&ll=35.1718,-103.7310) | Unknown | 602 W. Route 66 |
| 44 | [Whiting Brothers](https://maps.apple.com/?q=Whiting+Brothers&ll=35.1718,-103.7320) | Chamber Gas Station | 184 W. Tucumcari Blvd. |
| 39 | [Six Shooter Siding - Capri](https://maps.apple.com/?q=Six+Shooter+Siding&ll=35.1718,-103.7340) | Abandoned Building | (Next To) 801 W. Tucumcari Blvd. |
| 49 | [Six Shooter Siding - Wolf & Truck](https://maps.apple.com/?q=Six+Shooter+Wolf&ll=35.1718,-103.7340) | Abandoned Building | (Next To) 801 W. Tucumcari Blvd. |
| 40 | [Get Your Kicks 66](https://maps.apple.com/?q=Get+Your+Kicks+66&ll=35.1718,-103.7355) | Magnolia Station | 1016 W. Tucumcari Blvd. |
| 38 | [Happy Motoring](https://maps.apple.com/?q=Happy+Motoring&ll=35.1718,-103.7380) | Historic Esso Station | (Next To) 1302 W. Route 66 |
| 52 | [Mural Inside Hospital](https://maps.apple.com/?q=Hospital+Mural&ll=35.1680,-103.7250) | Cafeteria Wall | Trigg Memorial Hospital |
