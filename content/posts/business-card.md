---
title: Business Card
date: 2026-05-20
tags: [travel]
type: journal
audience: public
status: draft
coffee: 0
summary: An SVG business card — the logo and a URL. That's all you need when the site is the portfolio.
---

Got asked for my LinkedIn yesterday. Don't have one. Figured I'd just get a card printed — the logo and a URL. That's the whole pitch.

![theTube business card](/images/business-card-horizontal.svg)

White card, the logo, `theTube.today`. No phone number, no job title, no address. I'll manage my own identity — don't need help from LinkedIn. The URL is the interface to everything else.

## The template

MOO MiniCards. Weird little format — 2.75" × 1.10" after trim. You design to the bleed (873 × 378px) and they cut it down.

![theTube business card in MOO template](/images/business-card-template.svg)

The grey dashed line is the trim — where the blade lands. The pink dashed line is the safe area — keep anything important inside it. The white extends past the trim to the bleed edge so there's no unprinted strip if the cut drifts.

## How to print

Upload the clean version (without crop marks) to MOO at 873 × 378px. That's the full bleed canvas. They handle the trimming. The template version is just a proof for you to verify nothing important gets cut.

## How we made it

Asked Kiro to build it. Gave it the MOO design guidelines screenshot, said "logo and theTube.today, that's it." It pulled the logo mark SVG from the repo, grabbed the brand colors from `globals.css`, and produced the card as an SVG at the correct dimensions.

The whole thing is a file at a URL. The card references the site. The site serves the card. The post documents both. Files at URLs — the whole contract.
