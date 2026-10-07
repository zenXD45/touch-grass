# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + vanilla JavaScript (user-confirmed 2026-10-06; scaffolded with @mlc-ai/web-llm). Build target: static bundle deployable to GitHub Pages (user-confirmed).

## Users

Global home gardeners — anyone with a patch of ground, any hemisphere or climate. Primary job: know what to sow, plant, or protect this week, then close the screen and go outside.

## Product Purpose

An offline-first garden planner that derives frost dates for the user's coordinates from open climate data, turns them plus a curated planting table into a weekly outdoor checklist, and offers an optional open-weight LLM running entirely in the browser for grounded, conversational advice. Success: a user gets their week's plan in under a minute, can print it, and the app keeps working with no internet.

## Positioning

The plan and the assistant both run on the user's device: frost dates cached locally from open climate normals, a deterministic rules engine, and chat served by an open-weight model through WebLLM — no server ever sees the user's location or questions. A neighboring product could not truthfully copy the "works with zero signal, data never leaves the device" claim while running a closed API.

## Operating Context

- First run: needs network once to (a) download the open-weight model (~0.4–1.6 GB, browser-cached) and (b) fetch climate normals for the chosen coordinates — or the user types frost dates manually and never touches the network at all.
- Subsequent runs: fully offline (PWA shell + cached data + cached model).
- Ritual: weekly check lasting minutes, with a screen-to-outdoors handoff via a printable checklist.
- Long-lived artifact: public GitHub repo + DEV post; the post must answer: runs with no internet, keeps data off third-party servers, allows swapping/fine-tuning models, costs nothing, and where the open approach beat a closed one.

## Capabilities and Constraints

- Core (works without the LLM): coordinate input (geolocation or manual lat/lon), frost-date computation from Open-Meteo climate normals (verified live 2026-10-06), curated planting table shipped in-repo, "this week" task engine relative to frost dates (hemisphere-agnostic), 7-day frost warning from Open-Meteo forecast when online, local persistence (no account, no backend).
- Optional layer: WebLLM chat with two switchable open models — Qwen2.5-1.5B-Instruct-q4f16_1-MLC (default, ~1.6 GB) and SmolLM2-360M-Instruct-q4f16_1-MLC (~0.4 GB); requires WebGPU; graceful degradation to rules-only when unavailable.
- Hard constraints: no payment or runtime API keys, no servers of ours, code MIT, data CC-BY-4.0, static hosting only (GitHub Pages).
- Open decisions: product name (folder is `touch-grass`), exact crop list in the planting table, tropical no-frost fallback behavior.

## Brand Commitments

- Visual direction: **canon** — the category standard, chosen deliberately by the user 2026-10-06 after the direction roll; executed at full fidelity without irony or smuggled quirk.
- Quality bar (user-selected union of three packs): garden app peers (Planta, PictureThis, Epic Gardening), cross-category craft peers (Things 3, Apple Weather, Strava), garden media references (Gardener's World-style editorial trust).
- Standing pins that survive the canon choice: no generic AI-SaaS look (chat never leads), feel tied to real dirt and practice.
- Working product name: **Gardenwise** (builder-chosen placeholder, rename any time).

## Evidence on Hand

- Open-Meteo climate + forecast APIs: live-tested 2026-10-06, no key required, daily temperature_2m_min available.
- @mlc-ai/web-llm 0.2.85 with prebuiltAppConfig.model_list (163 entries); model IDs and sizes verified locally.
- Project brief: open-source AI at its core, with clear answers about offline use, privacy, cost, and model choice.
- No user-provided brand assets, screenshots, or garden content; the planting table must be authored from general horticultural knowledge and must not fabricate institutional endorsements.

## Product Principles

1. Offline is the feature, not the fallback: every core path works with the network unplugged.
2. The screen is the shortest part of the experience: plans are brief, printable, action-oriented.
3. Open at the core: open-weight model, open data, open source; no closed dependency decides behavior.
4. Honest degradation: no WebGPU → rules still work; no location → manual entry; no network → cached.
5. Privacy by architecture: nothing about the user's ground leaves the device.

## Accessibility & Inclusion

No specific standard established; baseline: semantic HTML, keyboard operability, readable contrast, and functioning under low bandwidth or no connectivity (which the offline design already serves).
