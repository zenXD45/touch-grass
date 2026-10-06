---
name: Gardenwise
description: Offline-first garden planner — a trusted white-card app with one locked leaf-green accent, mono-set data, and checklist-first layout.
colors:
  primary: "#2e7d46"
  primary-deep: "#256638"
  primary-soft: "#e7f2ea"
  on-primary: "#ffffff"
  canvas: "#f7f9f5"
  surface: "#ffffff"
  surface-tint: "#eff4ec"
  ink: "#17251a"
  ink-soft: "#4a5a4d"
  line: "#e2e9df"
  line-strong: "#c9d4c5"
  placeholder: "#647266"
  stamp-red: "#c0392b"
  frost-blue: "#2f6f93"
  frost-blue-soft: "#e7f1f7"
typography:
  display:
    fontFamily: "Outfit Variable, Outfit, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "clamp(2.5rem, 4.6vw, 3.5rem)"
    fontWeight: 660
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Outfit Variable, Outfit, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "clamp(1.6rem, 2.6vw, 2.05rem)"
    fontWeight: 640
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Outfit Variable, Outfit, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.05rem"
    fontWeight: 640
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Outfit Variable, Outfit, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, 'SFMono-Regular', monospace"
    fontSize: "0.7rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.07em"
  data:
    fontFamily: "IBM Plex Mono, ui-monospace, 'SFMono-Regular', monospace"
    fontSize: "1.02rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "-0.01em"
rounded:
  card: "16px"
  input: "10px"
  pill: "999px"
  photo: "20px"
  bubble: "14px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "44px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
    padding: "7px 15px"
  chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: "7px 15px"
  field-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    padding: "10px 12px"
  plan-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "18px 20px 16px"
---

# Design System: Gardenwise

## Overview

**Creative North Star: "The Home-Screen Standard"**

Gardenwise is a canon build: it should look exactly like the trusted apps its audience already keeps on the home screen (garden peers Planta, PictureThis, Epic Gardening; craft peers Things 3, Apple Weather, Strava), executed without irony. The personality is quiet competence — soft white cards on a faintly green canvas, one leaf-green accent locked page-wide, real garden photography, and a checklist that answers "what do I do this week" in seconds.

Density is plan-first. Information lives in cards and hairline-divided rows; the weekly checklist owns the middle of the page and the assistant is the last, optional section. Emphasis comes from weight and size, never from decoration: there is no gradient text, no glow, no hero-metric stat row. The aesthetic philosophy is a well-kept plot — everything on the page earns its place by being something a gardener acts on or checks.

Confirmed visual rejections: the generic AI-SaaS look (chat never leads, no model theatrics in the first viewport) and anything untied to real practice — photographs are real and credited, numbers are real frost math, and the browser's own chrome (selection, caret, scrollbars, focus rings) is themed rather than left to defaults.

**Key Characteristics:**
- One locked leaf-green accent on green-tinted neutrals; white cards divided by hairlines
- Checklist-first composition: the plan leads, the assistant sits last and optional
- Outfit Variable for voice, IBM Plex Mono for data and labels — two families, no more
- 16px cards, pill actions, 1.5px ink outlines reserved for the two "record" blocks
- Real photography in 20px frames with provenance credited in the footer
- Light and dark as a full token swap off `[data-theme='dark']`
- One authored motion moment (the week stamp) over a single shared entrance

## Colors

The palette is green-tinted neutrals carrying a single leaf-green accent, plus two state inks that only appear when the state they name exists.

### Primary
- **Leaf Green** (`#2e7d46`): the only page-wide accent. Primary buttons, checked task boxes, active chips and week tabs, links, the progress fill, the brand mark, focus rings, caret and selection tints.
- **Deep Leaf** (`#256638`): hover fill for accent buttons, and the AA-safe green for small text on tints — the network pill sets it on the wash. In dark theme this role flips to a brighter green (`#7acf95`); the direction follows contrast, not hue.
- **Leaf Wash** (`#e7f2ea`): the accent's tint — user chat bubbles, proof icon tiles, ghost-button hover, net pill ground.
- **On Leaf** (`#ffffff`): text on accent fills (dark theme inverts it to near-black `#0f1410`).

### Secondary
- **Stamp Red** (`#c0392b`): the ink of record and warning — the week stamp outline, error status text, frost-tender meta chips, the stamp-hit bloom. Never a call to action.
- **Frost Blue** (`#2f6f93`) with **Frost Wash** (`#e7f1f7`): the cold-state pair — the offline network pill and the frost-watch banner only.

### Neutral
- **Garden Paper** (`#f7f9f5`): page canvas and input fills.
- **Card White** (`#ffffff`): every card and panel surface.
- **Soft Moss** (`#eff4ec`): second tonal step — task-group header bands, week-tab track, footer band, AI chat bubbles, hover fills.
- **Field Ink** (`#17251a`): primary text and the 1.5px record outlines.
- **Moss Gray** (`#4a5a4d`): all secondary/lede text.
- **Hairline** (`#e2e9df`) / **Hairline Strong** (`#c9d4c5`): default dividers and card edges / interactive borders (inputs, checkboxes, ghost borders, scrollbar thumb).
- **Placeholder Sage** (`#647266`): placeholder text only — a dedicated token, never repurposed as body color.

Dark theme re-declares every key above in the `[data-theme='dark']` block of `src/styles.css` (mirrored in `.impeccable/design.json`); the light values in the frontmatter are normative. In dark, accent direction inverts (greens brighten, ink and surface swap roles), neutrals go near-black green, shadows go black-based, and stamp/frost lighten to hold contrast.

### Named Rules
**The One Accent Rule.** Leaf green is the only accent allowed to spread across a screen. Stamp red and frost blue are state inks: they appear only when the state they name exists — an error, a frost-tender crop, a cold snap, offline — and never as decoration or a second brand color.
**The AA Pair Rule.** Small green text never uses the bright accent; it uses the deep variant on the wash tint. When the theme flips, the pair flips: the deepening green becomes a brightening one so the pair stays legible in both directions.

## Typography

**Display Font:** Outfit Variable (self-hosted, with Outfit / system-ui / Segoe UI fallback)
**Body Font:** Outfit Variable (same stack — one grotesque carries the whole voice)
**Label/Mono Font:** IBM Plex Mono (self-hosted, weights 400 and 500)

**Character:** A clean geometric-grotesque at variable weights against a working monospace. The face does the personality; the mono supplies facts. No serif, no system display face, no third family.

### Hierarchy
- **Display** (660, `clamp(2.5rem, 4.6vw, 3.5rem)`, 1.12): the single hero headline; re-clamped to `clamp(2.1rem, 9vw, 2.7rem)` under 760px.
- **Headline** (640, `clamp(1.6rem, 2.6vw, 2.05rem)`, 1.12): every section `h2`.
- **Title** (640, 0.98–1.2rem, 1.12): card and group headings — crop cards (1.05rem), task groups (0.98rem), empty states (1.2rem).
- **Body** (400, 16px, 1.55): running copy. Lede variant 1.05rem, hero sub 1.13rem. Measures are capped in code: 44ch hero sub, 62ch section ledes, 40–52ch supporting copy.
- **Label** (mono 400, 0.7–0.72rem, uppercase, 0.06–0.09em tracking): field labels, plan-row labels, title-block cells, footer column heads, network pill. 500 for the stamp and footer heads.
- **Data** (mono 500, 1.02rem): plan values and dates; title-block hero values go `clamp(1.25rem, 2.2vw, 1.6rem)`.

UI emphasis steps in the body face: 520 nav links, 560 quiet links, 580 chips and disclosures, 600 buttons and task names, 640 headings, 660 hero.

### Named Rules
**The Mono Means Data Rule.** IBM Plex Mono appears only on data, labels, and status — dates, coordinates, counts, uppercase micro-labels, the stamp. Running prose never sets in mono, and mono is never used as a costume for "technical."
**The Variable Steps Rule.** Outfit is a variable face and the build steps it deliberately (640 headings, 660 hero, 520–600 for UI) instead of snapping to 400/700. New text picks a weight from this ramp rather than the browser's default bold.

## Layout

One centered container (1200px max, 24px gutters; 18px under 760px) feeds every section. Section padding is 64px vertical / 24px horizontal (48px / 18px under 760px), with section heads sitting 28px above their content. The sticky nav is 68px tall — surface at 86% opacity behind a 12px backdrop blur with a hairline underline — and `scroll-padding-top: 88px` keeps anchored sections clear of it.

Split layouts as built: hero `1.02fr / 0.98fr` gap 48px; offline section `0.9fr / 1.1fr` gap 44px; footer `1fr / 1.6fr` gap 44px. Data grids: checklist is `auto-fit, minmax(320px, 1fr)` gap 20px; crop grid is `auto-fill, minmax(248px, 1fr)` gap 16px; the frost title block is a fixed 4-up. Breakpoints: **960px** (hero stacks, offline split stacks, footer stacks, title block goes 2-up) and **760px** (nav collapses to a dropdown, checklist goes single column, form fields stretch full width).

Spacing rhythm: 8 / 12 / 16 / 24 / 44 / 64px steps — tight inside components (12–18px padding), generous between sections (44–64px).

### Named Rules
**The One Container Rule.** Every section draws from the same 1200px container and is separated by rhythm (64px, 48px on small screens), never by full-bleed color bands. The only content band allowed to break the container edge-to-edge is the footer's surface-tint band; the sticky nav is chrome, and runs edge-to-edge with its own inner container.

## Elevation & Depth

A hybrid system: hairlines and tonal steps carry almost all structure, and shadows stay soft, low-opacity, and tinted from the ink green in light theme (pure black in dark). There are no hard offset shadows anywhere in the build; depth never announces itself.

### Shadow Vocabulary
- **Resting** (`--shadow-1`: `0 1px 2px rgba(23,37,26,0.05), 0 10px 30px rgba(23,37,26,0.07)`): cards at rest — location form, task groups, chat panel, crop cards on hover, the active week tab, the open mobile nav panel.
- **Floating** (`--shadow-2`: `0 2px 4px rgba(23,37,26,0.06), 0 10px 24px rgba(23,37,26,0.12)`): only content that physically overlaps a photograph — the hero plan card.
- **Focus ring** (`0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent)`): text inputs and the chat input on focus, paired with an accent border. The global `:focus-visible` is a 2px accent outline, 2px offset, 4px radius.

### Named Rules
**The Hairline-First Rule.** Structure is 1px `line` borders and tonal steps (`canvas` → `surface` → `surface-tint`); shadow only confirms elevation on top of them. Print styles strip shadows entirely.
**The Floating Shadow Rule.** The floating shadow is reserved for elements that overlap photography — today, the hero plan card. Nothing else earns the second shadow step.

## Shapes

Radius maps to role. Fully rounded pills (999px) are things you press: buttons, week tabs, filter chips, nav links, icon buttons, the chat input, the progress track. Cards and panels are 16px. Data fields are 10px (shared with the small proof icon tiles). Photographs get 20px frames, chat bubbles 14px, the task checkbox 7px, and the stamp label and focus ring 4px.

Borders: 1px hairline is the default edge; a 1.5px dashed hairline-strong marks empty states and the manual-entry disclosure; 1px `color-mix` tints carry semantic surfaces (frost banner, network pill, ghost button, frost chip). Nothing is clipped or masked — photos are plain rounded rectangles, no cutouts, no geometric masks.

### Named Rules
**The Pill Means Action Rule.** Fully rounded means interactive; 10–16px rounded rectangles mean readable. New controls follow it, and content cards never go pill-shaped.
**The Ink Outline Rule.** A 1.5px `ink` outline marks "the record": the floating plan card and the frost title block. Ordinary cards stay on hairlines — do not promote the ink outline to a default card treatment.

## Components

### Buttons
Confident pill controls with fast, small feedback.
- **Shape:** pill (999px), 12px 24px padding, 16px / 600, transparent 1px border at rest.
- **Primary:** accent fill, on-accent text; hover → deep accent (160ms); active → `scale(0.97)` (120ms).
- **Secondary:** surface fill, ink text, 1px hairline-strong border; hover → surface-tint.
- **Ghost:** transparent, accent text, 1px accent-at-45% border; hover → wash fill with deep accent text (used for "Print the checklist").
- **Icon button:** 40×40 pill circle with hairline border (36×36 under 760px); hover → surface-tint; holds self-hosted Phosphor glyphs.
- **Focus:** 2px accent outline, 2px offset.

### Chips
- **Filter chip:** surface fill, hairline-strong border, pill, 7px 15px, 0.88rem / 580; hover → accent border and text; active → accent fill with on-accent text.
- **Meta chip:** mono 0.7rem on surface-tint with hairline border, pill, 3px 9px. The frost variant switches to stamp-red text, tint, and border to mark frost-tender crops.
- **Network pill:** mono 0.72rem uppercase in the AA pair (wash ground, deep-accent text); the offline state switches the pair to frost wash / frost blue.

### Cards / Containers
- **Corner style:** card radius (16px); background surface; 1px hairline border; resting shadow.
- **Task group:** surface-tint header band with hairline underline, glyph + title + mono count; rows divided by hairlines at 14px 18px padding; completed rows dim to ink-soft with a line-through on the name.
- **Crop card:** 18px padding; hover lifts it 2px with an accent-mixed border and the resting shadow.
- **Empty state:** 1.5px dashed hairline-strong box, 56px 32px centered padding, accent glyph, copy capped at 44ch.
- **Frost banner:** frost wash, 1px frost-at-40% border, card radius.
- **Chat panel:** card radius, 24px padding, max 780px; AI bubbles on surface-tint, user bubbles on accent wash, both 14px radius; model progress is an accent `scaleX` fill on a surface-tint track.

### Inputs / Fields
- **Style:** mono 0.95rem text on canvas fill, 1px hairline-strong border, 10px radius, 10px 12px padding; labels sit above in mono caps (0.7rem).
- **Focus:** accent border plus the 3px accent-22% ring, default outline removed; placeholder text uses the dedicated placeholder token; caret tinted accent.
- **Variants:** search field with a leading glyph and 36px left padding; the chat input is the pill variant set in the body face; date fields share the same 10px shell.

### Navigation
Sticky 68px bar: surface at 86% behind `backdrop-filter: blur(12px)`, hairline bottom. Brand = accent SVG mark + wordmark (1.06rem / 640). Links are 0.95rem / 520 in ink-soft; hover paints a surface-tint pill and turns the text to ink. Carries the network pill, theme toggle, and GitHub icon button. Under 760px the links collapse into a full-width dropdown panel below the bar (surface, hairline, resting shadow) toggled by a pill icon button whose menu/close glyphs swap.

### Signature: The Week Stamp
- **Form:** mono 0.7rem uppercase, 1.5px stamp-red outline, 4px radius, rotated −1.5°, `white-space: nowrap`, sitting in the plan-card head beside the location.
- **The moment:** the instant coordinates resolve (or the week changes), the stamp plays `stamp-hit` — 0.52s on the standard ease: overshoot to 1.18 scale with a 3° → −4° swing and a stamp-red ring bloom, settling back at −1.5° — then the card's rows and note ink in (`row-ink`, 0.4s, 60ms stagger). This is the memorable beat of the page and the only bespoke animation in the system.

### Motion
- **Entrance:** one shared `rise` — opacity 0→1 with a 10px lift, 0.24–0.4s on the standard ease — applied to task rows (45ms stagger per index), crop cards (30ms per index), chat messages, and the hero plan card (0.4s, 150ms delay).
- **State:** transitions are 160ms for color/background/border and 120ms for transforms; press feedback is `scale(0.97)` (0.92 on the checkbox).
- **Standard ease:** `cubic-bezier(0.23, 1, 0.32, 1)` — exponential ease-out everywhere.
- **Reduced motion:** a global `prefers-reduced-motion` block zeroes animation and transition durations; smooth scrolling returns to auto.

### Named Rules
**The One Moment Rule.** One bespoke animation exists in this system — the week stamp's `stamp-hit`. Every other appearance is the shared rise entrance, staggered by index; new surfaces do not invent their own entrances.

### Print
Print mode is part of the system: nav, hero, crops, offline, assistant, footer, and controls are hidden; the checklist prints two-up; cards lose their shadows and avoid breaking across pages; body goes black on white.

## Do's and Don'ts

### Do:
- **Do** keep one accent: leaf green for every primary action, active state, link, and focus; use the deep variant for small green text on tints.
- **Do** keep actions pill-shaped (999px) and containers at 16px, inputs at 10px, photos at 20px.
- **Do** theme the browser's own surfaces from the palette — selection, caret, scrollbar, and focus rings are already tokenized; new UI should be too.
- **Do** set dates, coordinates, counts, status, and micro-labels in IBM Plex Mono at 0.7–1.02rem; keep prose in Outfit.
- **Do** reserve the 1.5px ink outline for record blocks (plan card, title block) and hairlines for everything else.
- **Do** let list surfaces enter with the shared rise entrance, staggered by index, and keep the stamp as the single authored animation.
- **Do** keep the plan ahead of the assistant: the chat section stays last, optional, and visually quieter than the checklist.
- **Do** credit every raster's provenance in the footer — photographs ship with their source.

### Don't:
- **Don't** introduce a second bright accent, or use stamp red / frost blue decoratively — they name states only.
- **Don't** use hard offset shadows (`4px 4px 0`), gradient text, or glass/blur as decoration; depth is soft, low-opacity, and ink-tinted (the nav's backdrop blur is functional, tied to stickiness).
- **Don't** set a kicker or eyebrow above a heading — headings carry their own weight at 640 / −0.02em.
- **Don't** reach for a system display face or unicode/emoji glyphs as icons; Outfit is the display voice, and icons come from Phosphor (self-hosted) or authored SVG.
- **Don't** put chat, model loading, or a hero-metric stat row in front of the plan.
- **Don't** ship a new surface whose selection, caret, scrollbar, or focus treatment falls back to browser defaults.
