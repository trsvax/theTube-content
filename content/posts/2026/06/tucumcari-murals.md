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

## The map

<div id="mural-map" style="width:100%;height:500px;border-radius:8px;margin-bottom:2em;"></div>
<script src="https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.core.js" crossorigin async data-callback="initMap" data-token="eyJraWQiOiJaUzMzU1BUU0czIiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJZUk01RjhUVzg4IiwiaWF0IjoxNzgxMzkwMTU2LCJvcmlnaW4iOiJ0aGV0dWJlLnRvZGF5Iiwic2NvcGUiOiJtYXBraXRfanMifQ.kNcVZUE6GvZ_3I2I5p8z72VckreULijTc19MvaYjgKVsfgzItP56nKIH1mbCYFChe_3NF3EnktCHhxy4yUU31w"></script>
<script>
function initMap() {
  const murals = [
    {lat:35.171404,lon:-103.717850,name:"Mother Road",desc:"Motel Safari, 722 E. Route 66"},
    {lat:35.171404,lon:-103.717850,name:"Elvis & Cadillac",desc:"Motel Safari, 722 E. Route 66"},
    {lat:35.171404,lon:-103.717850,name:"Tucumcari Tonite!",desc:"Motel Safari, 722 E. Route 66"},
    {lat:35.171404,lon:-103.718850,name:"Get Your Kicks",desc:"Motel Safari, 522 E. Route 66"},
    {lat:35.172016,lon:-103.716409,name:"James Dean",desc:"Blue Swallow Motel, 815 E. Route 66"},
    {lat:35.172016,lon:-103.716409,name:"Tucumcari Tonight",desc:"Continental Oil Co., 815 E. Route 66"},
    {lat:35.171645,lon:-103.714835,name:"Route 66 Buffalo",desc:"Teepes Curios, 924 E. Route 66"},
    {lat:35.171645,lon:-103.714835,name:"Route 66 Car",desc:"Teepes Curios, 924 E. Route 66"},
    {lat:35.172431,lon:-103.713876,name:"Striped Mountain Sunset",desc:"Roadrunner Lodge, 1023 E. Route 66"},
    {lat:35.171789,lon:-103.713675,name:"Texaco 66",desc:"Bare & Wild Creations, 1201 E. Route 66"},
    {lat:35.172097,lon:-103.711395,name:"Wanted: Billy the Kid",desc:"Palomino Motel, 1215 E. Route 66"},
    {lat:35.173448,lon:-103.723961,name:"Dinosaur",desc:"Mesalands Dinosaur Museum, 222 E. Laughlin Ave."},
    {lat:35.168354,lon:-103.736853,name:"Route 66 (College)",desc:"Mesalands Community College"},
    {lat:35.158255,lon:-103.736334,name:"Rattlers",desc:"Water Tank, 10th Street"},
    {lat:35.171789,lon:-103.719500,name:"66 Eyes On Route 66",desc:"Ca Electric Co., 505 E. Route 66"},
    {lat:35.171789,lon:-103.719500,name:"Daylight Train",desc:"Everyones Federal Credit Union, 505 E. Route 66"},
    {lat:35.171789,lon:-103.719500,name:"Waterfall",desc:"Everyones Federal Credit Union, 505 E. Route 66"},
    {lat:35.154638,lon:-103.724566,name:"Mural Rite 66",desc:"Inside of McDonald's"},
    {lat:35.171723,lon:-103.724769,name:"Onsite",desc:"La Cita, 820 S. 1st St."},
    {lat:35.175869,lon:-103.721835,name:"You Are Here",desc:"High Street Church, 424 E. High St."},
    {lat:35.172500,lon:-103.722500,name:"Flying Space Men",desc:"L'find Dispensary, 1st & Charles Ave."},
    {lat:35.172500,lon:-103.723042,name:"Abstract New Mexico Landscape",desc:"Grasslands Dispensary"},
    {lat:35.178105,lon:-103.724658,name:"Alex Street - First Mayor",desc:"City Hall, 205 E. Center"},
    {lat:35.178965,lon:-103.725846,name:"Arch Hurley",desc:"Princess Theater, 108 E. Main St."},
    {lat:35.179080,lon:-103.724900,name:"Bird's Eye View",desc:"Security Finance Building, 1st & Main"},
    {lat:35.179080,lon:-103.724900,name:"Pray For Us",desc:"Knights of Columbus, 1st & Main"},
    {lat:35.177818,lon:-103.724943,name:"Tucumcari Lumber Co.",desc:"211 S. 1st St."},
    {lat:35.173188,lon:-103.724698,name:"Abstract Spiral",desc:"717 S. 1st St."},
    {lat:35.178800,lon:-103.725400,name:"I Love Tucumcari",desc:"S. Alley, Main St. between 1st & 2nd"},
    {lat:35.179200,lon:-103.725400,name:"Tucumcari Legend Map",desc:"N. Alley, Main St. between 1st & 2nd"},
    {lat:35.179000,lon:-103.725400,name:"Honoring Vets",desc:"VFW, between 1st & 2nd on Main"},
    {lat:35.182840,lon:-103.726011,name:"Southern Pacific Railroad",desc:"Massey Building, N. 2nd St."},
    {lat:35.179080,lon:-103.725980,name:"Western Welcome",desc:"Israel Building, 2nd and Main"},
    {lat:35.177865,lon:-103.725980,name:"Ranch Scene",desc:"Tucumcari General Insurance, 214 S. 2nd St."},
    {lat:35.177865,lon:-103.725980,name:"Conchas Dam & Lake",desc:"Tucumcari General Insurance, 214 S. 2nd St."},
    {lat:35.176851,lon:-103.726206,name:"In Memory of Moynihan",desc:"Bob's Budget Pharmacy, 311 S. 2nd St."},
    {lat:35.179080,lon:-103.727100,name:"Blessed",desc:"Abandoned Building, 3rd & Main"},
    {lat:35.176451,lon:-103.728338,name:"WPA Mural",desc:"Court House, 300 S. 3rd St."},
    {lat:35.178000,lon:-103.727500,name:"Give them A Head Start",desc:"Eastern Plains, 3rd & Central"},
    {lat:35.171700,lon:-103.726000,name:"The Legendary Road",desc:"Lowe's Market, 100 W. Tucumcari Blvd."},
    {lat:35.175149,lon:-103.723073,name:"Memories of the Old Swimming Pool",desc:"Historical Museum, 416 S. Adams"},
    {lat:35.179000,lon:-103.729000,name:"Fort Bascom Trading Post",desc:"Bascom Building, Main & Adams"},
    {lat:35.171700,lon:-103.726500,name:"Where's My Horse?",desc:"Route 66 Smoke Shop, 202 W. Route 66"},
    {lat:35.174000,lon:-103.730000,name:"Radio Ranch",desc:"KTNM-KQAY Station, S. Dale St."},
    {lat:35.171700,lon:-103.728000,name:"Phillips 66",desc:"Quality Lube & Tire, 302 W. Route 66"},
    {lat:35.175236,lon:-103.732361,name:"Route 66 - West",desc:"Hairshop, 424 S. 7th St."},
    {lat:35.171700,lon:-103.730500,name:"Welcome To Tucumcari",desc:"Chamber of Commerce, 404 W. Route 66"},
    {lat:35.171700,lon:-103.730500,name:"Quay County",desc:"Chamber of Commerce, 404 W. Route 66"},
    {lat:35.171700,lon:-103.732000,name:"Rattlesnakes & Lions",desc:"602 W. Route 66"},
    {lat:35.171700,lon:-103.731000,name:"Whiting Brothers",desc:"Chamber Gas Station, 184 W. Tucumcari Blvd."},
    {lat:35.171687,lon:-103.733898,name:"Six Shooter Siding - Capri",desc:"801 W. Tucumcari Blvd."},
    {lat:35.171687,lon:-103.733898,name:"Six Shooter Siding - Wolf & Truck",desc:"801 W. Tucumcari Blvd."},
    {lat:35.171648,lon:-103.737911,name:"Get Your Kicks 66",desc:"Magnolia Station, 1016 W. Tucumcari Blvd."},
    {lat:35.171645,lon:-103.738324,name:"Happy Motoring",desc:"Historic Esso Station, 1302 W. Route 66"},
    {lat:35.156809,lon:-103.722700,name:"Mural Inside Hospital",desc:"Trigg Memorial Hospital"},
  ];

  const map = new mapkit.Map("mural-map", {
    center: new mapkit.Coordinate(35.1720, -103.7240),
    cameraDistance: 12000,
    colorScheme: mapkit.Map.ColorSchemes.Dark,
  });

  const annotations = murals.map(m => {
    const coord = new mapkit.Coordinate(m.lat, m.lon);
    const annotation = new mapkit.MarkerAnnotation(coord, {
      title: m.name,
      subtitle: m.desc,
      color: "#e84545",
      glyphText: "🎨",
    });
    annotation.callout = { calloutContentForAnnotation: () => {
      const div = document.createElement("div");
      div.innerHTML = `<strong>${m.name}</strong><br><span style="color:#888">${m.desc}</span><br><a href="https://maps.apple.com/?q=${encodeURIComponent(m.name)}&ll=${m.lat},${m.lon}" style="color:#4a9eff">Directions</a>`;
      return div;
    }};
    return annotation;
  });

  map.addAnnotations(annotations);
}
</script>

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
| 22 | [Mother Road](https://maps.apple.com/?q=Mother+Road+Mural&ll=35.171404,-103.717850) | Motel Safari | 722 E. Route 66 |
| 23 | [Elvis & Cadillac](https://maps.apple.com/?q=Elvis+and+Cadillac&ll=35.171404,-103.717850) | Motel Safari | 722 E. Route 66 |
| 24 | [Tucumcari Tonite!](https://maps.apple.com/?q=Tucumcari+Tonite&ll=35.171404,-103.717850) | Motel Safari | 722 E. Route 66 |
| 25 | [Get Your Kicks](https://maps.apple.com/?q=Get+Your+Kicks&ll=35.171404,-103.718850) | Motel Safari | 522 E. Route 66 (East Wall, NW Corner) |
| 21 | [James Dean](https://maps.apple.com/?q=James+Dean+Mural&ll=35.172016,-103.716409) | Blue Swallow Motel | 815 E. Route 66 |
| 35 | [Tucumcari Tonight](https://maps.apple.com/?q=Tucumcari+Tonight&ll=35.172016,-103.716409) | Continental Oil Company Gas Station | 815 E. Route 66 |
| 31 | [Route 66 Buffalo](https://maps.apple.com/?q=Route+66+Buffalo&ll=35.171645,-103.714835) | Teepes Curios | 924 E. Route 66 |
| 32 | [Route 66 Car](https://maps.apple.com/?q=Route+66+Car&ll=35.171645,-103.714835) | Teepes Curios | 924 E. Route 66 |
| 34 | [Striped Mountain Sunset](https://maps.apple.com/?q=Striped+Mountain+Sunset&ll=35.172431,-103.713876) | Roadrunner Lodge | 1023 E. Route 66 |
| 20 | [Texaco 66](https://maps.apple.com/?q=Texaco+66+Mural&ll=35.171789,-103.713675) | Bare & Wild Creations | 1201 E. Route 66 |
| 30 | [Wanted: Billy the Kid](https://maps.apple.com/?q=Billy+the+Kid+Mural&ll=35.172097,-103.711395) | Palomino Motel | 1215 E. Route 66 |
| 1 | [Dinosaur](https://maps.apple.com/?q=Dinosaur+Mural&ll=35.173448,-103.723961) | Mesalands Dinosaur Museum | 222 E. Laughlin Ave. |
| 51 | [Route 66](https://maps.apple.com/?q=Route+66+Mural+Mesalands&ll=35.168354,-103.736853) | Mesalands Community College | 922 10th St. Repind Building A |
| 19 | [Rattlers](https://maps.apple.com/?q=Rattlers+Mural&ll=35.158255,-103.736334) | Water Tank | 10th Street across from Elementary School |
| 26 | [66 Eyes On Route 66](https://maps.apple.com/?q=66+Eyes+On+Route+66&ll=35.171789,-103.719500) | Ca Electric Co. | 505 E. Route 66 (Wall in Parking Lot) |
| 27 | [Daylight Train](https://maps.apple.com/?q=Daylight+Train&ll=35.171789,-103.719500) | Everyones Federal Credit Union | 505 E. Route 66 |
| 28 | [Waterfall](https://maps.apple.com/?q=Waterfall+Mural&ll=35.171789,-103.719500) | Everyones Federal Credit Union | 505 E. Route 66 |
| 33 | [Mural Rite 66](https://maps.apple.com/?q=Mural+Rite+66&ll=35.154638,-103.724566) | Inside of McDonald's | 1st St. near I-40 |
| 29 | [Onsite](https://maps.apple.com/?q=La+Cita+Mural&ll=35.171723,-103.724769) | La Cita | 820 S. 1st St. & Route 66 |
| 16 | [You Are Here](https://maps.apple.com/?q=You+Are+Here+Mural&ll=35.175869,-103.721835) | High Street Church | 424 E. High St. |
| 54 | [Flying Space Men](https://maps.apple.com/?q=Flying+Space+Men&ll=35.172500,-103.722500) | L'find Dispensary | 1st & Charles Ave. |
| 55 | [Abstract New Mexico Landscape](https://maps.apple.com/?q=Abstract+New+Mexico&ll=35.172500,-103.723042) | Grasslands Dispensary | 1st & Crutcher Ave. |
| 14 | [Alex Street - First Mayor of Tucumcari](https://maps.apple.com/?q=Alex+Street+Mural&ll=35.178105,-103.724658) | City Hall | 205 E. Center |
| 11 | [Arch Hurley](https://maps.apple.com/?q=Arch+Hurley+Mural&ll=35.178965,-103.725846) | Princess Theater | 108 E. Main St. |
| 12 | [Bird's Eye View of A Mural in the Making](https://maps.apple.com/?q=Birds+Eye+View+Mural&ll=35.179080,-103.724900) | Security Finance Building | 1st & Main St. |
| 17 | [Pray For Us](https://maps.apple.com/?q=Pray+For+Us+Mural&ll=35.179080,-103.724900) | Knights of Columbus | 1st & Main St. |
| 2 | [Tucumcari Lumber Co.](https://maps.apple.com/?q=Tucumcari+Lumber+Mural&ll=35.177818,-103.724943) | Tucumcari Lumber | 211 S. 1st St. (South Wall) |
| 48 | [Abstract Spiral](https://maps.apple.com/?q=Abstract+Spiral&ll=35.173188,-103.724698) | Unknown | 717 S. 1st St. |
| 9 | [I Love Tucumcari Mural](https://maps.apple.com/?q=I+Love+Tucumcari&ll=35.178800,-103.725400) | Alley Mural | S. Alley On Main St. Between 1st & 2nd St. |
| 10 | [Tucumcari Legend Map](https://maps.apple.com/?q=Tucumcari+Legend+Map&ll=35.179200,-103.725400) | Alley Mural | N. Alley On Main St. Between 1st & 2nd St. |
| 50 | [Honoring Vets](https://maps.apple.com/?q=Honoring+Vets+Mural&ll=35.179000,-103.725400) | VFW | Between 1st & 2nd on Main Street |
| 8 | [Southern Pacific Union Pacific Rock Island](https://maps.apple.com/?q=Railroad+Mural&ll=35.182840,-103.726011) | Massey Building | N. 2nd St. |
| 13 | [Western Welcome To Tucumcari](https://maps.apple.com/?q=Western+Welcome&ll=35.179080,-103.725980) | Israel Building | 2nd and Main |
| 3 | [Ranch Scene](https://maps.apple.com/?q=Ranch+Scene+Mural&ll=35.177865,-103.725980) | Tucumcari General Insurance | 214 S. 2nd St. (North Wall) |
| 4 | [Conchas Dam & Lake](https://maps.apple.com/?q=Conchas+Dam+Mural&ll=35.177865,-103.725980) | Tucumcari General Insurance | 214 S. 2nd St. (West Wall of Adjacent Building) |
| 6 | [In Memory of Moynihan](https://maps.apple.com/?q=Moynihan+Mural&ll=35.176851,-103.726206) | Bob's Budget Pharmacy | 311 S. 2nd St. (South Wall) |
| 5 | [Blessed](https://maps.apple.com/?q=Blessed+Mural&ll=35.179080,-103.727100) | Abandoned Building | 3rd & Main (East Wall) |
| 53 | [WPA Mural](https://maps.apple.com/?q=WPA+Mural&ll=35.176451,-103.728338) | Court House | 300 S. 3rd Street |
| 7 | [Give them A Head Start](https://maps.apple.com/?q=Head+Start+Mural&ll=35.178000,-103.727500) | Eastern Plains Community Action Agency | 3rd St. & Central (East Wall) |
| 47 | [The Legendary Road](https://maps.apple.com/?q=Legendary+Road&ll=35.171700,-103.726000) | Lowe's Market | 100 W. Tucumcari Blvd. (East Wall) |
| 15 | [Memories of the Old Swimming Pool](https://maps.apple.com/?q=Swimming+Pool+Mural&ll=35.175149,-103.723073) | Tucumcari Historical Museum | 416 S. Adams (Behind the Red Barn) |
| 18 | [Fort Bascom Trading Post](https://maps.apple.com/?q=Fort+Bascom+Trading+Post&ll=35.179000,-103.729000) | Bascom Building | Main St. & Adams St. |
| 46 | [Where's My Horse?](https://maps.apple.com/?q=Wheres+My+Horse&ll=35.171700,-103.726500) | Route 66 Smoke Shop | 202 W. Route 66 (SE and SW of Building) |
| 36 | [Radio Ranch](https://maps.apple.com/?q=Radio+Ranch+Mural&ll=35.174000,-103.730000) | KTNM-KQAY Station | S. Dale St. |
| 45 | [Phillips 66](https://maps.apple.com/?q=Phillips+66+Mural&ll=35.171700,-103.728000) | Quality Lube & Tire | 302 W. Route 66 |
| 37 | [Route 66 - West](https://maps.apple.com/?q=Route+66+West+Mural&ll=35.175236,-103.732361) | Hairshop | 424 S. 7th St. |
| 42 | [Welcome To Tucumcari](https://maps.apple.com/?q=Welcome+To+Tucumcari&ll=35.171700,-103.730500) | Chamber of Commerce Visitor Center | 404 W. Route 66 |
| 43 | [Quay County](https://maps.apple.com/?q=Quay+County+Mural&ll=35.171700,-103.730500) | Chamber of Commerce Visitor Center | 404 W. Route 66 |
| 41 | [Rattlesnakes & Lions](https://maps.apple.com/?q=Rattlesnakes+Lions&ll=35.171700,-103.732000) | Unknown | 602 W. Route 66 |
| 44 | [Whiting Brothers](https://maps.apple.com/?q=Whiting+Brothers&ll=35.171700,-103.731000) | Chamber Gas Station | 184 W. Tucumcari Blvd. |
| 39 | [Six Shooter Siding - Capri](https://maps.apple.com/?q=Six+Shooter+Siding&ll=35.171687,-103.733898) | Abandoned Building | (Next To) 801 W. Tucumcari Blvd. |
| 49 | [Six Shooter Siding - Wolf & Truck](https://maps.apple.com/?q=Six+Shooter+Wolf&ll=35.171687,-103.733898) | Abandoned Building | (Next To) 801 W. Tucumcari Blvd. |
| 40 | [Get Your Kicks 66](https://maps.apple.com/?q=Get+Your+Kicks+66&ll=35.171648,-103.737911) | Magnolia Station | 1016 W. Tucumcari Blvd. |
| 38 | [Happy Motoring](https://maps.apple.com/?q=Happy+Motoring&ll=35.171645,-103.738324) | Historic Esso Station | (Next To) 1302 W. Route 66 |
| 52 | [Mural Inside Hospital](https://maps.apple.com/?q=Hospital+Mural&ll=35.156809,-103.722700) | Cafeteria Wall | Trigg Memorial Hospital |
