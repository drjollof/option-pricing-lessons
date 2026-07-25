# How to Add a New Lesson

This masterclass platform is designed to be easily extensible. All mathematical calculations (building trees, pricing options) are handled globally by the engine in `/lib/binomial.ts`. 

To add a new lesson, you do **not** need to touch any UI components or math engine code. You simply author a new TypeScript object in the `/content/lessons/` directory!

---

## 1. Create the Lesson File

Create a new file in `/content/lessons/` (e.g., `lesson-5.ts`).

### Basic Structure

```typescript
import { Lesson } from '../types';

export const lesson5: Lesson = {
  id: 'lesson-5',
  title: 'American Options & Early Exercise',
  description: 'Learn how American options differ from European options by adding early exercise checks to the backward induction process.',
  defaultParams: { S0: 100, K: 100, u: 1.15, d: 0.85, r: 0.05, T: 1, N: 3, sigma: 0.2 },
  phases: [
    // Your interactive phases go here...
  ]
};
```

## 2. Define Your Phases

The core of the educational experience is the `phases` array. Each phase defines a specific step of the lesson and dictates what the UI should render. There are 6 different `PhaseKind` types you can use:

### A. The "Pure Theory" Phase (`static-slides`)
Use this when you just want to explain a concept using the math console and array grid, without animating a tree.

```typescript
{
  id: 'intro',
  title: 'What is an American Option?',
  description: 'A brief explanation of early exercise...',
  kind: 'static-slides',
  showParamControls: false, // Hide sliders to focus on theory
  stepTexts: [
    "Step 1: European options can only be exercised at maturity.",
    "Step 2: American options can be exercised at ANY node..."
  ],
  formulas: [
    [`C_{EU} = e^{-r \\Delta t}(p C_u + (1-p) C_d)`],
    [`C_{AM} = \\max(S - K, C_{EU})`]
  ]
}
```

### B. The "Animated Tree" Phase (`tree-reveal`)
This is the workhorse of the platform. It automatically renders an animated SVG lattice and Array Grid based on the `reveals` property.

```typescript
{
  id: 'american-tree',
  title: 'Building the American Tree',
  description: 'Watch the backward induction happen node by node.',
  kind: 'tree-reveal',
  reveals: 'option_tree', // Options: 'stock_tree', 'option_tree', 'delta_tree'
  direction: 'backward',  // Options: 'forward', 'backward'
  showParamControls: true, // Let users play with the math!
  stepTexts: [ /* Array of explanations per node */ ],
  formulas: [ /* Array of KaTeX strings per node */ ],
  codeSnippet: `def price_american(S, K): ...` // (Optional) Adds the "View Code" toggle
}
```

### C. The "Step-by-Step Math" Phase (`derivation-steps`)
Use this when you want to walk through a mathematical proof. This phase hides the lattice tree entirely and expands the Math Console to take up the full screen width.

```typescript
{
  id: 'proof',
  title: 'Deriving the Formula',
  description: 'Let us prove why early exercise is never optimal for non-dividend calls.',
  kind: 'derivation-steps',
  stepTexts: [ ... ],
  formulas: [ ... ]
}
```

### D. Specialty Phases
- **`hedge-rebalance-animation`**: Specifically designed to animate the dynamic delta-hedging portfolio values over time.
- **`convergence-sweep`**: Removes all trees and renders the high-performance SVG line chart to show option prices converging to Black-Scholes as N approaches infinity.

## 3. Register the Lesson

Once your `lesson-5.ts` file is written, you must register it so it appears on the homepage.

Open `/content/lessons-index.ts` and add it to the array:

```typescript
import { lesson1 } from './lessons/lesson-1';
import { lesson2 } from './lessons/lesson-2';
import { lesson3 } from './lessons/lesson-3';
import { lesson4 } from './lessons/lesson-4';
import { lesson5 } from './lessons/lesson-5'; // 1. Import it

// 2. Add to array
export const lessons = [lesson1, lesson2, lesson3, lesson4, lesson5];
```

That's it! Next.js will automatically generate the `/lessons/lesson-5` route, the homepage will generate a beautiful new Lesson Card (and automatically number it "5"), and your lesson is live!
