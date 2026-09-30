---
name: Reeveri
description: Creative marketing agency site set as a photographer's contact sheet, with one red china-marker choosing the keeper.
colors:
  ink: "#0b0b0a"
  ink-2: "#141413"
  ink-3: "#1d1d1b"
  paper: "#efeee8"
  paper-2: "#e2e1d9"
  dim: "#a3a29b"
  rebate: "#6d6d68"
  marker: "#f2452d"
  line: "rgb(239 238 232 / 0.13)"
  line-strong: "rgb(239 238 232 / 0.26)"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.1rem, 10.4vw, 9.25rem)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "-0.04em"
    fontVariation: "\"wdth\" 104"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 6.5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.04em"
    fontVariation: "\"wdth\" 104"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
    fontVariation: "\"wdth\" 104"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    fontVariation: "\"wdth\" 100"
  lead:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.5
    fontVariation: "\"wdth\" 100"
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.14em"
    fontFeature: "\"tnum\""
    fontVariation: "\"wdth\" 62"
rounded:
  none: "0px"
  focus: "2px"
  pill: "9999px"
spacing:
  gutter: "clamp(1rem, 4vw, 3.5rem)"
  frame-gap: "0.625rem"
  section-top: "clamp(4rem, 8vw, 7rem)"
  section-bottom: "clamp(6rem, 12vw, 11rem)"
  statement: "clamp(7rem, 16vw, 14rem)"
  container: "110rem"
components:
  button-primary:
    backgroundColor: "{colors.marker}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  button-primary-lg:
    backgroundColor: "{colors.marker}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 40px"
    height: "80px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-on-paper:
    backgroundColor: "{colors.marker}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  button-on-paper-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  frame:
    backgroundColor: "{colors.ink-2}"
    rounded: "{rounded.none}"
  film-strip:
    backgroundColor: "{colors.ink-3}"
    rounded: "{rounded.none}"
    padding: "16px 0"
  edge-print:
    textColor: "{colors.rebate}"
    typography: "{typography.label}"
---

# Design System: Reeveri

## Overview

**Creative North Star: "The Contact Sheet"**

Creative direction is selection, so the page is laid out the way a photographer reviews a roll: frames in rows on unlit film base, numbers edge-printed along the margins, and one red china-marker deciding what matters. Everything is either the sheet (black ground, print-white type, hairline frames, sprocket rows) or the hand that marks it (red circles, underlines, strikes, ticks, crop brackets, and the one action that starts a project).

Density is editorial and generous: very large, tight, heavy display type carries the voice; long runs of hairline-ruled lists carry the detail; small condensed caps carry the metadata. Motion is photographic rather than decorative: the strip advances frame by frame, frames unmask from a crop, headlines rise out of a clipped line, and marker strokes draw themselves when they come into view. On desktop a loupe cursor stands in for the pointer and swells into a "View project" lens over frames.

The world is flat. Depth comes from three shades of film black, a 6% film-grain overlay, and hairlines, never from shadows or rounded containers.

**Key Characteristics:**
- Film-base black ground, print-white type, one china-marker red.
- Archivo alone, stretched across its width axis: wide and heavy for display, condensed caps for edge print, normal for text.
- Hairline-bordered rectangular frames with 3:2, 4:3, 4:5, and 21:9 crops; sprocket rows on the strip.
- Hand-drawn marker marks (circle, underline, strike, tick, crop brackets) that draw on load or scroll.
- Pill-shaped magnetic actions; everything else is square.
- Desktop loupe cursor; all motion collapses under reduced-motion.

## Colors

A near-monochrome film palette with a single warm red that behaves like a grease pencil on the sheet.

### Primary
- **China-Marker Red** (`marker`): the hand. Pencil circles, underlines and strikes, hover crop brackets, the scroll-progress rule on the process timeline, text selection, the focus ring, and the fill of the primary "Start a project" action. On the paper CTA section the circle switches to ink so the red remains the button.

### Neutral
- **Film-Base Black** (`ink`): the page ground, frame interiors in the strip, and text on red or paper.
- **Negative Black** (`ink-2`): project frame wells, the active row in the services list, and label backing chips.
- **Strip Black** (`ink-3`): the film strip body the sprockets are punched through; scrollbar thumb.
- **Print White** (`paper`): primary text, the loupe cursor, and the full-bleed contact section ground.
- **Print White Shadow** (`paper-2`): secondary tone inside authored frame art.
- **Faded Print** (`dim`): body copy, supporting lines, section asides, and descriptions.
- **Rebate Gray** (`rebate`): edge-print metadata along frames and the strip (frame numbers, roll name, indices).
- **Hairline** (`line`) and **Strong Hairline** (`line-strong`): list rules, header border, ghost-button ring, frame outlines, and open-state toggles.

### Named Rules
**The Grease Pencil Rule.** Red is only ever the hand or the primary action: a mark drawn on the sheet, a focus ring, or the "Start a project" fill. It never becomes a surface, a heading color, or a decorative fill.

**The One Keeper Rule.** A view gets at most a couple of marker marks. A circle means "this one"; if everything is circled nothing is chosen.

## Typography

**Display Font:** Archivo (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Archivo
**Label/Mono Font:** Archivo at condensed width

**Character:** One family doing three jobs through its width axis. Wide, heavy and tight for the voice; condensed, tracked caps with tabular figures for the edge print; neutral width for reading.

### Hierarchy
- **Display** (800, clamp(3.1rem, 10.4vw, 9.25rem), 0.88, wdth 104): the hero headline and the contact headline, set across most of the viewport and revealed line by line.
- **Headline** (800, clamp(2.75rem, 7vw, 6.5rem), 0.9, wdth 104): section titles such as "What we do" and "Selected work", paired with a short aside in faded print on the right.
- **Title** (800, clamp(1.75rem, 3vw, 2.75rem), 1, wdth 104): project titles, process steps, and service rows (service rows run larger, up to 4.25rem).
- **Body** (400, 1rem, 1.55): descriptions and answers, capped around 28rem to 42rem (max-w-md to max-w-2xl); text-wrap pretty.
- **Lead** (400, 1.05rem to 1.125rem, 1.5): the hero supporting line and FAQ answers on desktop.
- **Label** (600, 0.6875rem, 0.14em, uppercase, wdth 62, tabular figures): edge print, meaning frame numbers, roll names, years, categories, and placeholder notices.
- UI text (buttons and nav) sits between body and label at 0.95rem, weight 500 to 600, tracking -0.01em.

### Named Rules
**The Edge Print Rule.** Metadata belongs on the rebate of a frame: beside or under it, never floating above a headline as a section label. Section headings stand on their own.

**The One Family Rule.** Archivo only. Hierarchy comes from width, weight, and size, never from a second face.

## Layout

A single 110rem container with a fluid gutter (clamp(1rem, 4vw, 3.5rem)) and a 12-column grid from md up. Section heads split 8/4: headline left, aside right and bottom-aligned. Work frames break the grid deliberately (full width, 5 columns, then 6 columns offset down by 16vw, then a 21:9 panorama) so the sheet reads as selected, not tiled. Services and FAQ are full-width hairline-ruled lists. The film strip is the one full-bleed element on the ink ground; the contact section is full-bleed paper.

Rhythm is loose: sections open at clamp(4rem, 8vw, 7rem) and close at clamp(6rem, 12vw, 11rem); the statement block gets clamp(7rem, 16vw, 14rem). On mobile the grid collapses to one column, the hero action column stacks under the headline, service rows expand inline, and the nav becomes a full-screen sheet with display-size links numbered in edge print. A 26rem `xs` breakpoint supplements Tailwind's defaults.

## Elevation & Depth

Flat. No box shadows anywhere. Depth is tonal and material: three shades of black (`ink`, `ink-2`, `ink-3`) separate ground, frame well, and strip body; a fixed fractal-noise grain at 6% opacity sits over everything like film grain; hairlines outline frames and rule lists. The only thing that lifts is the magnetic button, which moves toward the pointer on a spring and never casts a shadow.

### Named Rules
**The Light Table Rule.** Nothing floats. If something needs separation, change the black or draw a hairline.

## Shapes

Frames, strips, panels, and list rows are square-cornered rectangles (0px). The pill is reserved for actions and small circular controls: the magnetic buttons, the FAQ toggle, the menu button, and the loupe cursor. Focus rings round to 2px. The sprocket row is a repeating 3.5px by 2.5px elliptical hole every 18px punched in `ink` through the `ink-3` strip. Crop brackets are 24px L-shaped 2px marker corners that slide outward 8px past the frame on hover. Marker marks are hand-drawn SVG paths drawn in two passes (a full stroke plus a thinner 55% pass offset under a pixel) through a turbulence displacement filter, so the line reads as waxy and uneven.

## Components

### Buttons
Magnetic and confident: they lean toward the pointer (spring, 0.28x/0.36x offset) and press to 0.97.
- **Shape:** full pill (9999px).
- **Primary:** marker fill, ink text, 48px tall with 24px side padding, 0.95rem semibold, trailing arrow that slides 4px on hover. Large size is 64px (80px from sm) with 32 to 40px padding.
- **Hover / Focus:** primary turns print white over 300ms; focus is the global 2px marker outline at 4px offset.
- **Ghost:** transparent with an inset strong-hairline ring that brightens to paper on hover; no arrow.
- **On paper:** marker fill that turns ink with paper text on hover, used on the contact section.

### Frames
- **Corner Style:** square.
- **Background:** `ink-2` well holding media or authored frame art.
- **Border:** hairline where outlined; red crop brackets on hover.
- **Behavior:** unmask from a 12% by 8% inset clip on entry, parallax inside the crop, scale to 1.04 on hover, and carry edge print above (frame number, roll name and year) and a numbered display title below.

### Film Strip
The hero's signature: an `ink-3` band with sprocket rows top and bottom, 3:2 frames at clamp(9.5rem, 19vw, 18rem) wide with 0.625rem gaps, each captioned in edge print. It advances one frame every 2.6s on the advance easing, pauses on hover, loops seamlessly, and stops under reduced motion. Keeper frames carry a marker circle.

### Lists (Services, FAQ)
Hairline-ruled rows. Service rows show an edge-print index, a display title, and a one-line summary; on desktop hover the row darkens to `ink-2`, the title shifts 16px right, the summary swaps for the description, and a tilted frame preview follows the pointer. FAQ rows use a 40px circular hairline toggle with a plus that rotates 45 degrees when open.

### Navigation
Transparent fixed header over the hero that condenses from 96px to 64px after 40px of scroll, gaining an `ink` 92% ground and a bottom hairline. Links are 0.95rem medium at 80% paper with a 1px paper underline that draws from the left. The wordmark REEVERI is set in display. The primary action lives in the header at every size. Mobile opens a full-screen sheet that wipes down with display-size links and edge-print numbers.

### Loupe Cursor
Desktop fine-pointer only. A 14px paper dot in difference blend; 46px hairline ring over links and buttons; a 108px solid paper lens with an edge-print label ("View project" or the frame number) over frames that opt in.

### Pencil Marks
Circle, underline, strike, and tick, drawn by path length (ease 0.65, 0, 0.35, 1) on mount or when 80% in view. Used to circle the hero's "ignore", keeper frames, and the first project number; to underline the key word in the statement and process headline; and in ink around the contact action on paper.

## Do's and Don'ts

### Do:
- **Do** keep red to marks and the primary action; a view should have one or two marks, not a trail of them.
- **Do** set every piece of frame metadata in the edge-print label style (0.6875rem, 600, wdth 62, 0.14em, uppercase, tabular figures) and place it on the frame's margin.
- **Do** use `dim` or `paper` for any text a visitor needs to read; edge print that carries meaning (placeholders, notices) must still meet 4.5:1.
- **Do** separate surfaces with the three blacks and hairlines, and keep frames square.
- **Do** give every motion a reduced-motion path that lands the final state immediately.
- **Do** use the out-expo easing (0.16, 1, 0.3, 1) for reveals and the advance easing (0.7, 0, 0.2, 1) for mechanical moves like the strip and the mobile menu wipe.

### Don't:
- **Don't** add box shadows or rounded cards; the sheet is flat and rectangular.
- **Don't** introduce a second typeface or a system display face; width and weight do the work.
- **Don't** put edge-print labels above section headlines as kickers or eyebrows.
- **Don't** use red as a fill for state (open, active, selected) or as a heading color.
- **Don't** replace hand-drawn marks with icon glyphs; icons appear only where a control needs one (arrow, plus, menu).
