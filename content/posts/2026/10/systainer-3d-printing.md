---
title: Systainers and 3D Printing
date: 2026-10-27
tags: [making]
type: post
audience: public
coffee: 2
origin: workshop
summary: A Systainer is a standard box. 3D printing is how you make it hold exactly your tools.
workflow: published
---

A Systainer is a plastic box that locks to other Systainers. That's the whole idea — modular, stackable storage that travels as one unit. Festool ships their tools in them, Tanos makes them, and the system has become a standard in workshops because the boxes do one thing well: they connect.

The box is the easy part. What goes inside is harder.

## The inside problem

A Systainer arrives empty, or with a tool nested in foam. The foam is cut for the tool it shipped with. The moment you want to store something else — a collection of router bits, a charger and batteries, a set of chisels, a mishmash of accessories — the foam is wrong. You can buy new foam. You can cut it yourself. Or you can buy overpriced generic organizer trays that almost fit and rattle.

Every tool has its own shape. Generic storage never fits well. You either waste space or you waste money on inserts that approximate your needs.

## 3D printing fills the box

This is where a printer earns its shelf space. Model the cavity, print an insert that holds exactly your tools. No wasted space, no rattling, no compromise. The insert is custom to your collection because you designed it for your collection.

The reason this works so well is that Systainer interiors are standardized and the dimensions are published. The footprint is fixed across sizes; only the height changes, and even then in known steps. You model once to the footprint and adjust for height. The lid clearance is known. The ribs and latch cutouts sit in fixed positions. It's a predictable design target, not a guessing game.

## What you print

The community has been at this for years. Printables, Thingiverse, and Maker's World are full of Systainer inserts, and the useful categories shake out to a few:

- **Tool inserts** — hold a specific tool plus its accessories, like a router with its guide and collet wrenches.
- **Bit organizers** — rows of holes for router bits, drill bits, driver bits. The common one.
- **Small-parts trays** — low walls, divided cells for screws, fittings, connectors.
- **Bin organizers** — open-top or drawer-style bins for small parts you grab often. Labelable, rearrangeable, and the natural complement to a sealed Systainer.
- **Dividers** — reconfigurable walls that let one box hold mixed contents.
- **Adapters and latches** — fit non-Systainer gear into the system, or repair a broken latch.

The two pair up well: a Systainer for the bulk storage and a set of bins for the grab-and-go parts. One keeps the dust out and stacks for travel, the other sits open on the bench for the things you reach for every few minutes.

The bin footprint is the interface, and it's worth making it speak more than one standard. Take the model for the bottom of a bin and adapt it to Gridfinity — the open modular grid that's become the default for benchtop storage. Same bin, two homes: it drops into a Gridfinity baseplate on the bench, or into a Systainer when it travels. One print, two systems.

Most of these are parametric. You download an insert for a size-2 box, change the wall height or hole diameter in the parameters, and it fits your box and your bits. The good ones are built in OpenSCAD or Fusion with user parameters, so the dimensions are right there to edit.

## Design notes

A few things make the difference between an insert that works and one you reprint twice:

- **Clearance.** Printers aren't perfect and Systainer interiors are tight. Leave about 0.3 mm around the footprint and it drops in. Zero clearance means sanding.
- **Mind the ribs.** The lid and base have locating ribs. Model the notches for them or the insert sits proud and the lid won't close.
- **Print orientation.** Put flat faces down, minimize supports. An insert printed on its side needs supports inside every compartment — annoying to remove and ugly.
- **Filament.** PLA is fine for trays that live in the shop. For anything that rides in a hot car or carries weight, PETG or ABS holds up better.
- **Test fit a corner first.** Print a small section, check it fits, then commit to the full part. Beats discovering the tolerance is off after a six-hour print.

## Labels and QR

The dividers and labels get printed too. The plan: a label the size of a business card, printed in colored filament, with a QR code on its face, that slides into a slot on the front of the Systainer. The base color tells you what's inside at a glance — blue for bike, whatever scheme you settle on. It's a physical thing you can swap, not a sticker that peels.

On each label, a QR code. Scan it with a phone and the app tells you what's inside — the inventory, the layout, maybe a photo and when you last opened it. The box carries its own address. You don't have to remember what's in box 4 of the stack; you scan it.

Keeping that record up to date is the part nobody wants to do by hand. So: open the box, snap a photo of the contents, and let AI write the inventory. The image goes up to S3, a Lambda runs a vision model over it, and the summary — a list of what's in there, the counts, maybe a guess at the categories — becomes the record the QR code resolves to. You don't curate the box's contents; you photograph it and let the model describe it back. Next time you scan, the app reads what the model saw.

Take it one more step: point the phone at the stack and the app overlays the boxes in front of you. The labels are the anchors — each one a marker the camera locks onto. Ask it for a part and it highlights the box that has it. Tap a box in the view and its contents float over the lid. You stop searching and start pointing. The stack becomes a queryable surface.

The loop closes on itself: the app can generate the model for the label too. The label is a business-card plate in colored filament with the QR code embossed on its face. The app already knows which box it scanned and what's inside, so it has the QR target and the color. Generate the STL from parameters — a small geometry library that extrudes the plate and cuts the QR pattern, or OpenSCAD headless — and send it to the printer. Scan the box, get the model, print the label, slide it in. The physical anchor and the digital record both come from the same data.

The interesting part is the bridge. The label is a physical interface to a digital record. The Systainer is the container, the QR code is the URL, and the app is the function that resolves it. Same shape as everything else — a file at an address, fetched on demand.

## The pattern

The Systainer is a standard interface — a defined footprint, a defined height, defined ribs and latches. 3D printing is how you implement that interface with exactly what you need. The box is the contract. The insert is the code.

It's the same shape as everything else in this system: define the interface once, fill it custom. The Systainer standard means any insert works in any box of that size. The printer means the insert can be anything. You get a storage system that's standard on the outside and personal on the inside.
