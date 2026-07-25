# Interactive Options Pricing Curriculum — Implementation Plan

**Goal:** A website that teaches quantitative finance lessons (binomial pricing,
Greeks, calibration, and future topics) the same way the Colab animations did —
simplified theory + code + a synchronized 3‑pane visual (Math Console / Tree / Array) —
but as a native, scrubbable, parameter‑adjustable web experience that scales
cleanly as new lessons are added.

---

## 1. Core Design Decision: Recompute Live, Don't Just Replay Video

There are three ways to bring the Colab animations to the web. Picking the
right one now saves a rewrite later.

| Option | How it works | Pros | Cons |
|---|---|---|---|
| A. Export MP4/GIF per lesson | Embed the Colab-rendered video | Zero new code | Not interactive, can't change `u,d,r,N`, huge asset sizes, hard to keep in sync with new lessons |
| B. Precompute frame data as JSON, animate in the browser | Python still does the math once, dumps a JSON "script" of frames, JS renders + steps through it | Fast to build, matches what you already have | Frozen at the parameters used when JSON was generated — no "what if I change u?" exploration |
| **C. Reimplement the math in TypeScript, compute live in-browser** | The same formulas (`stock_tree`, `option_tree`, `delta_tree`, calibration) are ported to a small TS math module; animation frames are derived on the fly | **Fully interactive** — sliders for S0/K/u/d/r/N/σ, instant recompute, best for the "understand it myself" goal | More upfront work; math must be ported and unit-tested per lesson |

**Recommendation: Option C, with Option B as the content-authoring format.**
Concretely:
- Each lesson's *narrative text* (console commentary, per-frame explanations,
  formulas) lives in a structured JSON/MDX file — this is authored content,
  not recomputed.
- Each lesson's *numeric grids* (stock/option/delta trees) are computed live
  by a small, well-tested TypeScript port of the Python logic, so changing a
  parameter slider regenerates the whole animation instantly.
- This gives you a real teaching tool (learners can break the model, see it
  mis-converge, fix it) instead of a fixed replay — which is exactly what
  Lesson 3's convergence test and Lesson 4's calibration are *about*.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | SSG for lesson pages (fast, SEO-friendly, cheap to host), file-based routing scales naturally as `lessons/1`, `lessons/2`, ... are added |
| Styling | **Tailwind CSS** | Fast iteration, easy to keep a consistent "console / lattice / matrix" visual language across lessons |
| Math rendering | **KaTeX** (via `react-katex` or `rehype-katex`) | Renders `\Delta = \frac{C_u - C_d}{S_u - S_d}` properly instead of plain-text formulas — big legibility upgrade over the Colab text console |
| Content authoring | **MDX** | Lets you write the theory prose (the "Lesson 1.1 concepts" parts) as normal markdown, then drop in `<TreePlayer lesson="1" phase="build" />` components inline wherever a visual is needed |
| Diagrams (tree, payoff curves, moneyness bands) | **Custom SVG components + Framer Motion** | You already designed these as coordinate-based scatter/line plots — SVG + Framer Motion gives the same look with real DOM transitions (nodes fading/sliding in) instead of frame-by-frame image redraws |
| Array/matrix view | **Custom `<MatrixGrid>` SVG or CSS-grid component** | Recreates the `matshow` heatmap pane with colormap-by-value, editable/interactive cells |
| Code snippets | **Shiki or `react-syntax-highlighter`** | Show the actual Python (or TS) source next to the visual, syntax-highlighted, so the "code" half of "theory and code" isn't lost |
| Charts (convergence tests, put-call parity checks) | **Recharts or Observable Plot** | Lesson 3/4 convergence plots (price vs. N) map directly onto a line chart component; reusable across lessons |
| State management | **Zustand** (lightweight) or React context | Holds current lesson parameters (S0, K, u, d, r, N, σ), current frame/phase, play state — shared across the three panes |
| Math engine | **`/lib/binomial.ts`** — hand-ported, unit-tested functions: `buildStockTree`, `priceEuropeanCall`, `priceEuropeanPut`, `buildDeltaTree`, `calibrateUD(sigma, dt)` | Single source of truth so every lesson's live computation is consistent and testable |
| Testing | **Vitest** for math module, **Playwright** for e2e on the player | Cheap insurance — a wrong `p` formula silently breaks every downstream lesson |
| Deployment | **Vercel** | Zero-config Next.js hosting, previews per PR — convenient as you add lessons over time |
| Content versioning | **Git repo**, lessons as data files under `/content/lessons/` | New lesson = new file + registry entry, not a code change |

---

## 3. Data Model

Two layers: **content** (authored, static) and **computed** (derived live from
parameters). Keep them separate.

### 3.1 Lesson manifest (`/content/lessons/lesson-1.json`)
```jsonc
{
  "id": "lesson-1",
  "title": "Derivatives, the Binomial Model & Risk-Neutral Pricing",
  "defaultParams": { "S0": 100, "K": 100, "u": 1.15, "d": 0.85, "r": 0.05, "T": 1, "N": 3 },
  "phases": [
    {
      "id": "concepts",
      "title": "Derivatives & Options 101",
      "kind": "static-slides",         // no computation, pure explainer
      "slides": [
        { "heading": "What is a Derivative?", "body": "A financial derivative is...", "visual": "asset-to-derivative-diagram" },
        { "heading": "Call vs Put Payoffs", "body": "...", "visual": "payoff-diagram" },
        { "heading": "Moneyness & Exercise Style", "body": "...", "visual": "moneyness-bands" },
        { "heading": "Trade Venues & Roadmap", "body": "...", "visual": "tree-skeleton-preview" }
      ]
    },
    {
      "id": "stock-build",
      "title": "Building the Binomial Stock Tree",
      "kind": "tree-reveal",           // computed live from params
      "reveals": "stock_tree",
      "colormap": "blues",
      "direction": "forward"
    },
    {
      "id": "no-arbitrage",
      "title": "No-Arbitrage & Risk-Neutral Probability",
      "kind": "derivation-steps",
      "steps": ["setup", "solve", "risk-neutral-p"]
    },
    {
      "id": "backward-induction",
      "title": "Call Payoff & Backward Induction",
      "kind": "tree-reveal",
      "reveals": "option_tree",
      "colormap": "purples",
      "direction": "backward"
    }
  ]
}
```

### 3.2 Computed grids (never stored — generated client-side)
```ts
// /lib/binomial.ts
export interface TreeParams { S0: number; K: number; u: number; d: number; r: number; T: number; N: number }

export function buildStockTree(p: TreeParams): number[][]
export function riskNeutralP(p: TreeParams): number
export function priceEuropeanOption(p: TreeParams, kind: "call" | "put"): { optionTree: number[][], price: number }
export function buildDeltaTree(p: TreeParams, optionTree: number[][], stockTree: number[][]): number[][]
export function calibrateFromVol(sigma: number, dt: number): { u: number; d: number }
export function convergenceSeries(p: TreeParams, maxN: number, calibrated: boolean): { N: number; price: number }[]
```
Every lesson's interactive visuals call into this same module — Lesson 3's
Delta grid and Lesson 4's calibration reuse Lesson 1's `buildStockTree`
unchanged. This mirrors how you incrementally extended the Colab script
lesson over lesson, but now it's enforced by shared code instead of copy-paste.

---

## 4. Component Architecture

```
<LessonPage lessonId="lesson-1">
 ├─ <LessonIntroMDX />                 (theory prose, MDX-authored)
 ├─ <ParamControls />                  (sliders: S0, K, u, d, r, N — live)
 ├─ <PhaseTabs />                      (Phase 1/4 ... Phase 4/4 nav)
 └─ <ThreePanePlayer phase={active}>
     ├─ <MathConsolePane />            (KaTeX formulas + step-by-step text)
     ├─ <LatticePane />                (SVG tree, Framer Motion reveals)
     └─ <ArrayGridPane />              (heatmap grid, mirrors NumPy array)
     + <PlaybackControls />            (play / pause / step / speed / scrub)
```

- `<ThreePanePlayer>` is the one reusable "engine" — every lesson just feeds
  it different phase configs and a different slice of the computed grids.
  This is the direct analog of your `update(f)` / `draw_pane0/1/2` functions,
  just split into React components with the frame index as state instead of
  a matplotlib `FuncAnimation`.
- `<PlaybackControls>` gives scrubbing (drag to any frame), which
  matplotlib's `to_jshtml()` also gave you for free — keep that UX.
- `<ParamControls>` is the genuinely new capability: moving the `N` slider
  live re-triggers `buildStockTree`/`priceEuropeanOption` and re-renders the
  same phase with new numbers — this is what makes Lesson 3's convergence
  test and Lesson 4's calibration actually *explorable* rather than just
  watched.

---

## 5. Directory Structure

```
/app
  /lessons
    /[lessonId]
      page.tsx                 # renders LessonPage
  /layout.tsx
/components
  ThreePanePlayer.tsx
  MathConsolePane.tsx
  LatticePane.tsx
  ArrayGridPane.tsx
  PlaybackControls.tsx
  ParamControls.tsx
  PayoffDiagram.tsx            # reusable across lesson 1's concept slides
  ConvergenceChart.tsx         # reusable for lesson 3 & 4
/lib
  binomial.ts                  # core math, unit tested
  binomial.test.ts
  colormaps.ts                 # blues/purples/ylgn -> hex scales, shared with matshow-style panes
/content
  /lessons
    lesson-1.json
    lesson-2.json
    lesson-3.json
    lesson-4.json
  /lessons-index.json           # ordered list + metadata for the homepage
/public
  /diagrams                     # any static SVG/illustration assets
```

Adding **Lesson 5+** later = one new `lesson-5.json` + one entry in
`lessons-index.json`. No component code changes needed unless the new lesson
introduces a genuinely new visual "kind" (e.g., Lesson 4's convergence-vs-N
sweep needs a `ConvergenceChart`, which you build once and reuse for any
future convergence-style lesson).

---

## 6. Mapping Your 4 Existing Lessons to `phase.kind` Types

| Lesson | New `phase.kind`s needed |
|---|---|
| Lesson 1 | `static-slides`, `tree-reveal`, `derivation-steps` |
| Lesson 2 | `tree-reveal` (put), `parity-check` (verifies `c0 + Ke^{-rT} = S0 + p0` across nodes — new component) |
| Lesson 3 | `tree-reveal` (delta), `hedge-rebalance-animation` (new), `convergence-sweep` (new — animates price vs. N failing to converge) |
| Lesson 4 | `derivation-steps` (Girsanov explanation), `calibration-form` (new — sliders for σ produce u,d), `convergence-sweep` (reused from Lesson 3, calibrated=true) |

Only 4 net-new `kind`s across all 4 lessons — most of the machinery is
shared, which validates the "engine + config" architecture.

---

## 7. Build Roadmap (Phased)

### Phase 0 — Scaffolding (aim: 1 lesson end-to-end)
- Init Next.js + TS + Tailwind + MDX + KaTeX
- Port `buildStockTree`, `riskNeutralP`, `priceEuropeanOption` to `/lib/binomial.ts` with Vitest coverage
- Build `<LatticePane>` and `<ArrayGridPane>` as static (non-animated) SVG renders of a given grid
- Hardcode Lesson 1's `stock-build` phase end-to-end: params → live grid → rendered lattice + array pane

### Phase 1 — Animation Engine
- Add frame/phase state (Zustand) + `<PlaybackControls>` (play/pause/step/scrub)
- Animate node reveal with Framer Motion (staggered `opacity`/`scale` per column, matching the Colab column-by-column reveal)
- Build `<MathConsolePane>` with KaTeX + per-frame text templates
- Wire up all 4 phases of Lesson 1, including `static-slides` and `derivation-steps` kinds

### Phase 2 — Interactivity
- Add `<ParamControls>` sliders wired into the math module — confirm the whole player re-renders correctly on parameter change (this is the key differentiator vs. the Colab video)
- Add input validation (e.g., warn if `d ≥ e^{r dt} ≥ u`, i.e., arbitrage exists) — a nice teaching moment reusing Lesson 1.3 content

### Phase 3 — Scale to Lessons 2–4
- Build `parity-check`, `hedge-rebalance-animation`, `convergence-sweep`, `calibration-form` components
- Migrate all 4 existing lessons into `/content/lessons/*.json`
- Add `/app/lessons/[lessonId]` dynamic routing + homepage lesson index (`lessons-index.json`)

### Phase 4 — Polish & Learning Aids
- Progress tracking (localStorage: which phases/lessons visited)
- Inline knowledge-check quizzes per phase (simple MCQ component, e.g., "what happens to `p` if `r` increases?")
- Dark mode, mobile-responsive lattice sizing (tree layouts need a mobile SVG viewBox variant)
- "View source" toggle showing the Python/TS code alongside each visual (syntax highlighted)

### Phase 5 — Content Pipeline for Future Lessons
- Write a `CONTRIBUTING_LESSON.md` template: schema for a new `lesson-N.json`, checklist for adding a new `phase.kind` if needed, math module conventions
- Optional: small internal CLI (`pnpm new-lesson 5`) that scaffolds the JSON file + MDX stub

---

## 8. Nice-to-Have Extensions (Post-MVP)

- **Sandbox mode**: a free-play page with just `<ParamControls>` + `<ThreePanePlayer>` and no fixed lesson script — pure exploration.
- **Side-by-side compare**: two `<ThreePanePlayer>`s with different parameter sets (e.g., calibrated vs. uncalibrated `u,d`) to directly visualize Lesson 4's payoff.
- **Export**: "Download as GIF/MP4" button that runs the same animation off-screen and encodes it (via `ffmpeg.wasm` or a serverless render job) — useful if learners want to share a specific configuration.
- **American option toggle**: once Lesson 1's exercise-style concept is taught, a toggle that adds early-exercise checks to the backward induction, visually highlighting nodes where early exercise is optimal.

---

## 9. Immediate Next Steps

1. Confirm this architecture (Next.js + TS math port + JSON-driven lessons) works for you.
2. I can scaffold the actual Next.js project (Phase 0) — `/lib/binomial.ts` with tests, and a working static render of Lesson 1's stock-tree phase — as a starting repo you can build on incrementally, lesson by lesson, the same way we're doing the Colab scripts now.
