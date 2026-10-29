<p align="center">
  <img src="public/logo.svg" alt="Prospect — Turning geological data into exploration priorities" width="460" />
</p>

<p align="center">
  <strong>An accessible, transparent GIS-based approach to copper exploration target prioritisation in Zambia.</strong>
</p>

<p align="center">
  <a href="https://prospect-zambia.vercel.app"><strong>▶ Live demo — prospect-zambia.vercel.app</strong></a>
  &nbsp;·&nbsp; <a href="#scoring-methodology">Methodology</a>
  &nbsp;·&nbsp; <a href="#getting-started">Run locally</a>
  &nbsp;·&nbsp; <a href="#replacing-the-demonstration-data">Use your own data</a>
  &nbsp;·&nbsp; <a href="#roadmap">Roadmap</a>
</p>

<p align="center">
  <img alt="Status: MVP" src="https://img.shields.io/badge/status-MVP-b5652b" />
  <img alt="Data: demonstration only" src="https://img.shields.io/badge/data-demonstration%20only-f0c27a" />
  <img alt="React 18" src="https://img.shields.io/badge/React-18-13201c" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-13201c" />
  <img alt="Leaflet" src="https://img.shields.io/badge/Leaflet-1.9-13201c" />
  <img alt="Deployed on Vercel" src="https://img.shields.io/badge/deployed-Vercel-13201c" />
</p>

---

> [!WARNING]
> **Every target, fault, occurrence and geochemical value in this app is synthetic demonstration data.** Target names are fictional, and locations are only loosely placed in the Zambian Copperbelt and North-Western Province to give the map a realistic setting. Prospect makes **no** claim of validated prediction accuracy and **no** discovery claim. A priority score is a **ranking** under the chosen indicators and weights. It is **not** the probability of finding copper.

---

## Table of contents

1. [What is Prospect?](#what-is-prospect)
2. [The problem](#the-problem)
3. [Who it is for](#who-it-is-for)
4. [Features (MVP scope)](#features-mvp-scope)
5. [The five-stage workflow](#the-five-stage-workflow)
6. [Using the app](#using-the-app)
7. [Scoring methodology](#scoring-methodology)
8. [Data model & spatial processing](#data-model--spatial-processing)
9. [Demonstration dataset](#demonstration-dataset)
10. [Architecture](#architecture)
11. [Project structure](#project-structure)
12. [Getting started](#getting-started)
13. [Testing](#testing)
14. [Deployment (Vercel CLI)](#deployment-vercel-cli)
15. [Replacing the demonstration data](#replacing-the-demonstration-data)
16. [Customising the scoring model](#customising-the-scoring-model)
17. [Brand & logo](#brand--logo)
18. [Validation plan](#validation-plan)
19. [Risks & limitations](#risks--limitations)
20. [Roadmap](#roadmap)
21. [Contributing](#contributing)
22. [Acknowledgements & attribution](#acknowledgements--attribution)
23. [Licence](#licence)

---

## What is Prospect?

**Prospect** is a GIS-based mineral exploration intelligence platform. It helps users organise and interpret geological and geospatial information when comparing potential **copper exploration areas in Zambia**.

It puts three things in one interface:

| | |
|---|---|
| 🗺️ **Map-based exploration** | Inspect candidate areas alongside the structural and occurrence layers that feed their scores. |
| 📊 **Target comparison** | A ranked list that uses the same indicators for every target, with a stacked bar showing what drives each score. |
| 🔍 **Explainable scoring** | For any target: each indicator's score, its weight, the points it adds, the full calculation, and any data gaps. |

Prospect shows which areas rank higher under a given method, and it also shows why: which geological indicators and assumptions produced each ranking.

Prospect is a **decision-support tool**. It is not meant to replace professional geological judgement or field investigation.

## The problem

Copper exploration combines several kinds of evidence: geological mapping, geochemical measurements, structural features and records of known mineral occurrences. These sources often come in different formats from different places. Before anyone can compare areas, someone has to prepare the datasets, run spatial analysis and interpret the results.

For small and emerging exploration teams, researchers and students, that process costs time and technical resources, and it is hard to do consistently.

> **How can relevant geological and geospatial information be organised into an accessible, transparent workflow that helps users compare potential copper exploration targets and understand the evidence behind their priorities?**

## Who it is for

| Group | Typical use |
|---|---|
| **Primary:** small and emerging exploration companies and teams | Organise information and screen candidate areas before committing budget to fieldwork. |
| Geologists and exploration professionals | Test how sensitive a ranking is to different weightings, and explain priorities to stakeholders. |
| GIS analysts and geospatial practitioners | Use a lightweight, readable reference implementation of a weighted-overlay screening model. |
| University students and researchers | Learn about prospectivity mapping through a model that hides nothing. |

**Focus:** copper, Zambia. The approach may adapt to other commodities or regions, given suitable data and further testing.

## Features (MVP scope)

These map one-to-one to the MVP scope in the Solution Concept Document (§8):

| # | MVP requirement | Implemented as |
|---|---|---|
| 1 | Navigable map with clearly labelled demonstration targets | Leaflet map with Topographic, Streets and Satellite basemaps, colour-coded target markers, approximate target footprints, a permanent **"Demonstration data"** watermark and a legend. |
| 2 | Target selection from the map or ranked list | Click a marker or a list row. The map flies to the target and the side panel opens its details. |
| 3 | A working scoring calculation with a visible formula and weights | Pure, unit-tested scoring engine ([`src/scoring/score.ts`](src/scoring/score.ts)). Each target shows its calculation, e.g. `95 × 0.300 + 85 × 0.300 + … = 87.8`. |
| 4 | Target details showing the factors contributing to each score | Breakdown table (raw evidence → indicator score → weight → points), the strongest driver, data-gap warnings, and facts about the target. |
| 5 | A methodology and data section explaining assumptions and limitations | **Methodology & data** tab: workflow, formula, normalisation rules, lithology lookup, missing-data policy, spatial processing, data sources and limitations. It updates live with the current weights. |
| 6 | Functional filters and weight controls showing how rankings change | Four weight sliders, a missing-data policy toggle, filters (search, province, minimum score, complete-data-only), layer toggles, and **▲/▼ rank-change arrows** against the default weights. |

**Extras:**

- **CSV export** of the current, filtered ranking, with per-indicator scores and points. The file header labels it as demonstration data.
- **Responsive layout** from desktop down to phone width.
- **Accessible controls:** labelled sliders, `aria-pressed` list selection, keyboard focus rings, and text alternatives on the contribution bars.

## The five-stage workflow

```
 ┌──────────┐   ┌───────────┐   ┌──────────┐   ┌────────────┐   ┌──────────────┐
 │ 1 EXPLORE│ → │ 2 IDENTIFY│ → │ 3 COMPARE│ → │4 UNDERSTAND│ → │ 5 INVESTIGATE│
 │ map +    │   │ candidate │   │ weighted │   │ breakdown, │   │ shortlist for│
 │ layers   │   │ targets   │   │ ranking  │   │ formula,   │   │ field checks │
 │          │   │           │   │          │   │ data gaps  │   │ / more data  │
 └──────────┘   └───────────┘   └──────────┘   └────────────┘   └──────────────┘
```

| Stage | In the app |
|---|---|
| **1. Explore** | Pan and zoom the study area. Switch basemaps. Toggle the fault, occurrence and footprint layers. |
| **2. Identify** | Every candidate appears as a marker and a list row. Hover for name, rank and score. |
| **3. Compare** | The ranked list orders targets by priority score, and the stacked bars compare indicator contributions at a glance. |
| **4. Understand** | Select a target to see why it ranks where it does: indicator scores, applied weights, points, the formula and missing data. |
| **5. Investigate** | Filter and export the shortlist (CSV) that may warrant geological assessment, more data collection or field verification. |

## Using the app

Open **<https://prospect-zambia.vercel.app>**.

**Explore & rank** (default view):

- **Left panel: controls**
  - **Scoring weights.** Drag a slider to change how much an indicator counts. Weights are shown as percentages of the total. *Reset* restores the defaults (30 / 30 / 20 / 20).
  - **Missing data.** Choose between *Exclude & rescale weights* and *Score as zero*. See [Missing information](#missing-information).
  - **Filters.** Free-text search (name, ID, district), province, minimum priority score, and *Only targets with all 4 indicators*.
  - **Map layers.** Faults, recorded occurrences, target footprints.
- **Centre: map.** Marker colour encodes the priority score class. Click a marker to select it.
- **Right panel: ranked targets / target detail**
  - Each row shows the rank, name, **rank change versus default weights** (▲ up, ▼ down, – same), a data-gap badge, a contribution bar and the score.
  - Select a target to open its detail card. *← All targets* goes back.
  - **Export CSV** downloads the currently filtered ranking.

**Methodology & data:** the full documentation of the model, rendered from the same constants the scoring engine uses, so the docs cannot drift from the code.

> 💡 **Try this:** set *Structural context* to 100 and the rest to 0, and watch the ranking reorder. Then switch the missing-data policy to *Score as zero* and see how unsurveyed targets such as **DEMO-03 Chambishi West** drop. This sensitivity is the point. Ranking depends on assumptions, and Prospect makes them visible.

## Scoring methodology

### The formula

$$
\text{Priority} \;=\; \sum_{i} w_i \cdot s_i \qquad s_i \in [0, 100],\quad \sum_i w_i = 1
$$

Each indicator $i$ is normalised to a score $s_i$ on 0–100, multiplied by its weight $w_i$ (a fraction of the total weight), and the results are summed. The priority score is therefore also on 0–100.

**Worked example (from the concept document):** an indicator scoring **80** with a weight of **30%** contributes $80 \times 0.30 = \mathbf{24}$ points. This exact case is a unit test.

### Indicators and normalisation

| Indicator | Question it answers | Raw evidence | Normalisation rule | Default weight |
|---|---|---|---|---|
| **Geological setting** | Is the area underlain by a host unit favourable for sediment-hosted copper? | Dominant mapped host unit | Lookup table (below) | **30%** |
| **Geochemical evidence** | How anomalous is copper in soil relative to background? | Median Cu in soil (ppm) | Log-linear: ≤ 50 ppm → 0, ≥ 1000 ppm → 100<br>`s = 100·(log₁₀Cu − log₁₀50)/(log₁₀1000 − log₁₀50)` | **30%** |
| **Structural context** | How close is the area to a mapped fault that could have channelled fluids? | Distance to the nearest fault (km), computed | Linear decay: 0 km → 100, ≥ 10 km → 0<br>`s = 100·max(0, 1 − d/10)` | **20%** |
| **Proximity to occurrences** | How close is the area to a recorded copper occurrence? | Distance to the nearest occurrence (km), computed | Linear decay: 0 km → 100, ≥ 25 km → 0<br>`s = 100·max(0, 1 − d/25)` | **20%** |

**Why log-linear for geochemistry?** Element concentrations in soil are typically roughly log-normally distributed, so a log scale spreads anomalies more evenly than a linear one. For example, 224 ppm (the geometric midpoint of 50 and 1000) scores exactly 50.

**Host-unit favourability lookup** (illustrative, **pending geological review**):

| Mapped unit | Score |
|---|---:|
| Lower Roan Subgroup (ore shale / arenite) | 95 |
| Upper Roan Subgroup (dolomite / argillite) | 70 |
| Mwashia Subgroup | 55 |
| Kundelungu Group | 35 |
| Basement Complex (granite / gneiss) | 25 |
| Post-Katangan intrusive | 20 |

> [!IMPORTANT]
> All thresholds (50 / 1000 ppm, 10 km, 25 km), lookup scores and default weights are **illustrative starting points** for the MVP. They have **not** been calibrated or reviewed by a geologist. Reviewing them is Step 4 of the [validation plan](#validation-plan).

### Missing information

Real datasets have gaps. Prospect makes the treatment of a missing indicator an explicit, user-selectable policy:

| Policy | What happens | Effect |
|---|---|---|
| **Exclude & rescale** *(default)* | The missing indicator is dropped, and the remaining weights are rescaled to total 100%. | Unsurveyed targets are not penalised, but their score rests on less evidence. They carry an **"n/4 indicators"** badge, and the detail card shows a data-gap warning and both the *set* and *applied* weights. |
| **Score as zero** | The missing indicator keeps its weight and contributes 0 points. | Conservative. Favours well-surveyed ground. |

Example with geochemistry missing and default weights (geology 80, structure 50, occurrence 100):

- *Exclude & rescale:* `(80·30 + 50·20 + 100·20) / 70 = 77.1`
- *Score as zero:* `24 + 0 + 10 + 20 = 54.0`

### Edge cases (all covered by tests)

- Weights are scale-invariant: `3/3/2/2` gives the same result as `30/30/20/20`.
- If every weight is 0, weights are split equally.
- If no indicator has data, the score is 0.
- Ties in score are broken by target ID, so the ordering is stable and reproducible.
- Indicator scores are clamped to [0, 100].

### Interpreting a score

| Score class | Map colour | Suggested reading |
|---|---|---|
| 80–100 | Deep copper | Strong on most indicators under current assumptions. |
| 65–80 | Copper | Good support from several indicators. |
| 50–65 | Light copper | Mixed evidence. |
| 35–50 | Sand | Weak, or relies on one indicator. |
| 0–35 | Grey | Little support under current assumptions. |

A high score means **"ranks well under these assumptions"**, not "copper is here". Always read the breakdown and data-gap notes.

## Data model & spatial processing

```ts
// src/data/demo.ts — input records
interface DemoTarget {
  id: string;                 // e.g. "DEMO-01"
  name: string;
  province: 'Copperbelt' | 'North-Western';
  district: string;
  centre: [lat, lng];         // WGS 84 (EPSG:4326)
  areaKm2: number;            // approximate footprint (drawn as an equal-area circle)
  lithology: LithologyKey | null;  // null = unmapped
  cuSoilPpm: number | null;        // null = no survey
  soilSamples: number;
  notes: string;
}

// src/scoring/indicators.ts — evidence passed to the scorer
interface Evidence {
  lithology: LithologyKey | null;
  cuSoilPpm: number | null;
  faultDistanceKm: number | null;      // computed
  occurrenceDistanceKm: number | null; // computed
}
```

**Spatial processing** ([`src/data/targets.ts`](src/data/targets.ts), [`src/scoring/geo.ts`](src/scoring/geo.ts)):

- **CRS:** WGS 84 geographic coordinates (EPSG:4326) for storage and display.
- **Distance to the nearest occurrence:** great-circle (haversine) distance, with Earth radius 6371.0088 km.
- **Distance to the nearest fault:** the minimum point-to-segment distance over every segment of every fault polyline, using a local equirectangular projection centred on the target. Error is well under 1% at the tens-of-kilometres scale used here.
- Distances are **computed from the same layers drawn on the map**, so what you see is exactly what is scored.
- Each target is currently represented by its **centroid**. Polygon statistics (e.g. area-weighted lithology, sample-weighted geochemistry) are planned for the real-data phase.

## Demonstration dataset

| Layer | Count | Notes |
|---|---:|---|
| Candidate targets | 14 | Fictional names, IDs `DEMO-01` to `DEMO-14`. Two have no geochemistry survey and one has unmapped geology, to exercise the missing-data handling. |
| Fault traces | 4 | Mostly NW–SE, broadly echoing the regional trend, plus one NE–SW splay and one N–S trace. |
| Recorded occurrences | 7 | Showings, old workings and drill intersections. All fictional. |

Default ranking (weights 30/30/20/20, exclude & rescale):

| Rank | ID | Target | Score | Geology | Geochem | Structure | Occurrence |
|---:|---|---|---:|---:|---:|---:|---:|
| 1 | DEMO-01 | Kafubu Ridge | 87.8 | 95 | 85 | 95 | 75 |
| 2 | DEMO-11 | Kalumbila Hills | 83.8 | 95 | 75 | 100 | 64 |
| 3 | DEMO-05 | Kafue Headwaters | 71.0 | 95 | 96 | 0 | 68 |
| 4 | DEMO-09 | Solwezi North Arc | 61.8 | 55 | 78 | 56 | 53 |
| 5 | DEMO-14 | Kipushi Corridor | 60.5 | 70 | 81 | 0 | 77 |
| … | | | | | | | |
| 14 | DEMO-13 | Kasempa Gate | 8.6 | 20 | — | 0 | 0 |

*(— = no data. Values come from synthetic inputs and illustrate the mechanics only.)*

## Architecture

```
          ┌──────────────────────────── src/data ─────────────────────────────┐
          │  demo.ts  (targets, faults, occurrences — synthetic)              │
          │      │                                                            │
          │      ▼                                                            │
          │  targets.ts  ── spatial processing (geo.ts) ──▶  Target[] with    │
          │                  fault & occurrence distances      Evidence       │
          └───────────────────────────────────────┬───────────────────────────┘
                                                  │
          ┌────────────────────────── src/scoring ▼ ──────────────────────────┐
          │  indicators.ts   Evidence ──normalise──▶ s_i ∈ [0,100] | null     │
          │  score.ts        combine(s, weights, policy) ──▶ ScoreResult      │
          │                  rank(targets, weights, policy) ──▶ Ranked[]      │
          │  (pure functions, no React — unit-tested in score.test.ts)        │
          └───────────────────────────────────────┬───────────────────────────┘
                                                  │
          ┌─────────────────────────── src/App.tsx ▼ ─────────────────────────┐
          │  state: weights · policy · filters · layers · selection · view    │
          │  useMemo: rank() → filter() ; baseline rank for ▲/▼ deltas        │
          ├──────────────┬─────────────────┬────────────────┬─────────────────┤
          │ Controls.tsx │  MapView.tsx    │ RankingList.tsx│ Methodology.tsx │
          │ sliders,     │  react-leaflet  │ TargetDetail   │ docs rendered   │
          │ filters      │  layers, legend │ .tsx           │ from constants  │
          └──────────────┴─────────────────┴────────────────┴─────────────────┘
```

**Design principles**

- **Transparency first.** The scoring engine is a few dozen lines of pure TypeScript. The Methodology page reads its labels, rules and formulas from the same `INDICATORS` definitions the engine uses.
- **Separation of concerns.** Normalisation (`indicators.ts`) and combination (`score.ts`) are separate, so each can be tested and reviewed on its own.
- **No backend.** Scoring of the MVP dataset runs instantly in the browser. The app is a static site and is cheap to host.
- **Correctness over features.** Controlled examples from the concept document are encoded as tests.

**Tech stack**

| Concern | Choice |
|---|---|
| UI | React 18 + TypeScript (strict) |
| Build | Vite 5 |
| Maps | Leaflet 1.9 via react-leaflet 4 |
| Basemaps | Esri World Topo / World Imagery, OpenStreetMap |
| Tests | Vitest |
| Hosting | Vercel (static) |
| Styling | Plain CSS with design tokens. No CSS framework. |

## Project structure

```
Prospect/
├── index.html                 # HTML entry, fonts, meta
├── public/
│   ├── favicon.svg            # Logo mark (app icon)
│   └── logo.svg               # Full logo lock-up (mark + wordmark + tagline)
├── src/
│   ├── main.tsx               # React root, global CSS imports
│   ├── App.tsx                # App state, layout, view switching, CSV export
│   ├── styles.css             # Design tokens, layout, components, responsive rules
│   ├── components/
│   │   ├── Controls.tsx       # Weight sliders, missing-data policy, filters, layer toggles
│   │   ├── MapView.tsx        # Leaflet map, basemaps, demo layers, markers, legend
│   │   ├── RankingList.tsx    # Ranked list with contribution bars and rank deltas
│   │   ├── TargetDetail.tsx   # Score breakdown, formula, data gaps, facts
│   │   ├── Methodology.tsx    # Methodology, data sources and limitations page
│   │   └── ui.tsx             # Logo, colour scale, shared small components
│   ├── data/
│   │   ├── demo.ts            # ⚠ Synthetic targets, faults, occurrences
│   │   └── targets.ts         # Spatial processing: builds Evidence for each target
│   └── scoring/
│       ├── geo.ts             # Haversine, point-to-segment, nearest-feature distance
│       ├── indicators.ts      # Indicator definitions & normalisation rules
│       ├── score.ts           # Weighted combination, missing-data policy, ranking
│       └── score.test.ts      # Unit tests (controlled examples, edge cases, geometry)
├── vercel.json                # Vercel build settings
├── vite.config.ts             # Vite + Vitest config
├── tsconfig.json
└── package.json
```

## Getting started

**Prerequisites:** Node.js **18+** (developed on Node 24) and npm.

```bash
git clone https://github.com/WazDevZm/Prospect.git
cd Prospect
npm install
npm run dev          # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload. |
| `npm run build` | Type-check (`tsc -b`) and build the production bundle into `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm test` | Run the unit test suite once. |
| `npm run test:watch` | Run the tests in watch mode. |
| `npm run typecheck` | Type-check only. |

## Testing

```bash
npm test
```

The suite ([`src/scoring/score.test.ts`](src/scoring/score.test.ts)) contains **15 tests** covering:

- **Controlled examples:** the concept document's 80 × 30% = 24 example, a full weighted sum (= 72), weight-scale invariance, and both missing-data policies with hand-calculated expected values.
- **Edge cases:** no data available, all-zero weights, and scores bounded to 100.
- **Normalisation:** geochemistry background, saturation and geometric-midpoint values, distance-decay linearity and clamping, and `null` handling.
- **Geometry:** 1° of latitude ≈ 111.2 km, perpendicular point-to-segment distance, and endpoint distance beyond a segment.
- **Ranking:** contiguous ranks in descending score order, and evidence that changing weights changes the ranking.

This corresponds to Step 3 of the validation plan: *test calculations using controlled examples*.

## Deployment (Vercel CLI)

The live app is deployed on Vercel at **<https://prospect-zambia.vercel.app>** (project `prospect-zambia`).

```bash
# one-time
npm i -g vercel          # or use npx vercel
vercel login
vercel link --project prospect-zambia

# preview deployment
vercel

# production deployment
vercel --prod
```

Build settings are pinned in [`vercel.json`](vercel.json): framework `vite`, build command `npm run build`, output `dist`. No environment variables are required.

> Note: Vercel project names must be lowercase. That is why the project is `prospect-zambia` even though the repository is `Prospect`.

The output is a fully static site, so `dist/` can also be hosted on Netlify, GitHub Pages, Cloudflare Pages, S3 or any static web server.

## Replacing the demonstration data

To run Prospect on a real study area:

1. **Prepare the layers** (e.g. in QGIS), reprojected to **WGS 84 / EPSG:4326**:
   - candidate target areas (polygons or centroids) with an ID, name, district and province
   - mapped geology, so you can attribute each target with its dominant host unit
   - soil geochemistry, so you can attribute each target with median Cu ppm and the sample count
   - fault traces (polylines)
   - recorded mineral occurrences (points)
2. **Export the attributes** and replace `DEMO_TARGETS`, `DEMO_FAULTS` and `DEMO_OCCURRENCES` in [`src/data/demo.ts`](src/data/demo.ts). Use `null` wherever an indicator has no data. Do **not** invent values.
3. **Update `STUDY_AREA_BOUNDS`** to frame the new area.
4. **Record provenance** for each dataset: source, licence or permission, date, scale and coverage. Add it to the *Data sources* table in [`src/components/Methodology.tsx`](src/components/Methodology.tsx).
5. **Remove the demonstration labels** (`DemoBadge`, the map watermark, the CSV header line and the README warning) **only** once the data are real, documented and permitted.
6. Run `npm test` and `npm run build`.

> [!CAUTION]
> Avoid **circularity** when evaluating. If the occurrences used to score *proximity to occurrences* are the same occurrences you later use to check whether high-ranked targets "hit" mineralisation, the model will look better than it is. Hold out independent evidence for evaluation. See validation Step 5.

## Customising the scoring model

Everything lives in [`src/scoring/indicators.ts`](src/scoring/indicators.ts) and [`src/scoring/score.ts`](src/scoring/score.ts).

- **Change thresholds:** edit `GEOCHEM_BACKGROUND_PPM`, `GEOCHEM_SATURATION_PPM`, `STRUCTURE_MAX_KM` and `OCCURRENCE_MAX_KM`.
- **Change lithology scores:** edit the `LITHOLOGY` table.
- **Change default weights or policy:** edit `DEFAULT_WEIGHTS` and `DEFAULT_POLICY`.
- **Add an indicator** (e.g. geophysics):
  1. Add the key to `IndicatorKey` and `INDICATOR_KEYS`.
  2. Add an `IndicatorDef` to `INDICATORS` with `label`, `question`, `rule`, `formula`, `colour`, `normalise()` and `describeRaw()`.
  3. Add the raw field to `Evidence`, and populate it in `buildTargets()`.
  4. Add a default weight, and extend the tests.

  The controls, ranked list, detail card, Methodology page and CSV export all pick it up automatically.

Methodology changes should be documented, versioned and reviewed by a geologist, in line with the concept document.

## Brand & logo

<img src="public/favicon.svg" alt="Prospect logo mark" width="72" align="right" />

The **Prospect** mark is a **map pin** whose bowl holds **off-centre topographic contours** closing on a single **hotspot**:

- **Pin:** location and GIS, and the act of putting a target on the map.
- **Contours:** geological and geospatial evidence, layered and converging.
- **Off-centre hotspot:** prioritisation, the point where the evidence concentrates.
- **Copper gradient** (`#E9995C` → `#A2501F`) on **deep slate-green** (`#13201C`): the commodity and the ground.

| Token | Hex | Use |
|---|---|---|
| Copper | `#B5652B` | Brand accent, wordmark, highlights |
| Copper light | `#E9995C` | Gradient start, active tabs |
| Copper dark | `#8A4719` | Headings on light backgrounds |
| Slate | `#13201C` | Logo tile, top bar |
| Sand | `#F4F1EA` | App background |

Files: [`public/logo.svg`](public/logo.svg) (lock-up with wordmark and tagline) and [`public/favicon.svg`](public/favicon.svg) (mark only). Both are hand-written SVG and scale to any size.

## Validation plan

Prospect must earn any claim it makes. The next phase:

| Step | Activity | Status |
|---|---|---|
| 1 | **Select a study area:** a manageable copper exploration area in Zambia with accessible geological information. | ⏳ Planned |
| 2 | **Acquire and inspect data:** credible sources, usage permissions, completeness, coverage, CRS and consistency. | ⏳ Planned |
| 3 | **Implement the scoring method:** indicators, normalisation, weights and missing-data treatment, tested with controlled examples. | ✅ Implemented for the MVP (`score.test.ts`) |
| 4 | **Obtain geological review** of indicators, thresholds, weights and interpretation. | ⏳ Planned |
| 5 | **Evaluate outputs** against independent known occurrences or other evidence, avoiding circularity, with documented limitations. | ⏳ Planned |
| 6 | **Test with users** for usability, clarity, interpretability and usefulness for early screening. | ⏳ Planned |

## Risks & limitations

| Risk | Description | How Prospect responds |
|---|---|---|
| **Data quality** | Incomplete or unreliable inputs give misleading rankings. | Data-gap badges and warnings, an explicit missing-data policy, and a "complete data only" filter. |
| **Scoring assumptions** | Indicator choice, thresholds and weights all drive results. | Everything is documented and adjustable, and rank-change arrows show the sensitivity. |
| **Occurrence-data bias** | Recorded occurrences cluster where people have already looked. | Documented, and the user can down-weight the occurrence indicator to 0. |
| **False confidence** | "72.4" looks more precise than the evidence justifies. | A disclaimer on every detail card, plus the footer and Methodology page. Scores are framed as rankings. |
| **Technical implementation** | Map, scoring and data integration must be reliable. | A pure, unit-tested scoring engine, strict TypeScript, and the type-check built into the build. |
| **Geological validation** | Expert interpretation and fieldwork remain essential. | Prospect is positioned as decision support only. |

## Roadmap

- [x] **Phase 1: functional prototype.** Map, selection, explainable scoring, weights, filters, methodology, CSV export, demo data, tests, deployment.
- [ ] **Phase 2: geological data integration.** A real study area, documented datasets, polygon-based statistics, GeoJSON/Shapefile import.
- [ ] **Phase 3: technical and geological review.** Expert review of indicators, thresholds and weights, and a versioned methodology.
- [ ] **Phase 4: user testing and refinement.** Sessions with exploration teams and students, plus usability fixes.
- [ ] **Phase 5: pilot assessment.** A small pilot with an exploration team or research partner.

Candidate features: uncertainty bands for scores, side-by-side comparison of 2–3 targets, saved scenarios (named weight sets), additional indicators (geophysics, remote-sensing alteration), sharable URLs that encode the current weights, and PDF reports.

## Contributing

Issues and pull requests are welcome, especially from geologists and GIS practitioners.

1. Fork and create a branch: `git checkout -b feature/my-change`
2. `npm install && npm test && npm run build`
3. Keep the scoring engine pure and tested. Add tests for any methodology change.
4. Never commit unlabelled synthetic data or data you lack permission to share.
5. Open a PR that describes what changed and **why** (geological justification for methodology changes).

## Acknowledgements & attribution

- Basemap tiles © **Esri** (World Topographic Map and World Imagery, including their data providers) and © **OpenStreetMap** contributors.
- Built with [React](https://react.dev), [Vite](https://vitejs.dev), [Leaflet](https://leafletjs.com) and [react-leaflet](https://react-leaflet.js.org).
- Developed in response to the **Mine-Tech** programme concept: moving Prospect from a concept interface towards a testable MVP.

## Licence

No licence has been chosen yet, so all rights are reserved by the author. Contact the repository owner ([@WazDevZm](https://github.com/WazDevZm)) about reuse. An open-source licence (e.g. MIT) may be added in future.

---

<p align="center">
  <img src="public/favicon.svg" width="36" alt="" /><br/>
  <strong>PROSPECT</strong><br/>
  <em>Turning geological data into exploration priorities.</em>
</p>
