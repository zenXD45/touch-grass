# Gardenwise

An offline-first garden planner: frost dates for your ground, one checklist for the week, and an open-weight model that runs in your browser. Built around the idea of touching grass.

No account, no server of ours, no telemetry. Your location and frost dates live in `localStorage` on your device.

## What it does

- **Frost dates from your coordinates.** Six years of daily ≤0 °C crossings from the [Open-Meteo](https://open-meteo.com) climate API, averaged into last-spring and first-autumn frost dates. Or enter the dates you already know — that path never touches the network.
- **A weekly checklist.** Start-indoors and direct-sow tasks generated from those frost dates plus the week's real dates, with spacing, days-to-maturity, and sun chips. Checkboxes persist across reloads.
- **Frost alerts.** A 7-day forecast scan that flags cold nights (≤2 °C) and floats a protect-tasks banner when one is coming.
- **45 crops** with category filters and search.
- **Ask** — an open-weight model (Qwen2.5-1.5B by default, SmolLM2-360M for small devices) downloaded and run entirely in your tab via [WebLLM](https://mlc.ai/web-llm/) over WebGPU. It never sends your questions anywhere. Works without the model too: the planner above is the product, the assistant is optional.
- **Full offline.** Installable PWA; after the first visit the whole app (including your data) works with the network off.

## Run it locally

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/
npm run preview    # serve the production build
```

Deployed at `https://zenxd45.github.io/touch-grass/` (GitHub Pages serves `dist/`).

## Data & attributions

| What | Source | License |
| --- | --- | --- |
| Frost normals & forecasts | [Open-Meteo](https://open-meteo.com) | CC BY 4.0 |
| Assistant weights (Qwen2.5-1.5B, SmolLM2-360M) | [WebLLM](https://mlc.ai/web-llm/) / ML C-AI | Apache-2.0 |
| "Vegetable garden with raised beds, Trimingham" | Kolforn, Wikimedia Commons | CC BY-SA 4.0 |
| "Basket of tomatoes and peppers" | U.S. National Park Service | Public domain |
| Icons | [Phosphor Icons](https://phosphoricons.com) | MIT |
| Type | Outfit, IBM Plex Mono (self-hosted) | SIL OFL 1.1 |

Frost normals are an average of past years — a planning signal, not a guarantee. Your local conditions decide; when in doubt, protect the plants.

## Code

MIT — see [LICENSE](./LICENSE).
