import { Lesson } from '../../../types';

export const lesson10: Lesson = {
  id: 'lesson-10',
  title: 'FTAP II and Variance Matching',
  description: 'Learn how to force market completeness in a trinomial framework by matching the second moment (variance), yielding a unique Equivalent Martingale Measure.',
  defaultParams: { S0: 100, K: 100, u: 1.15, d: 0.869, r: 0.05, T: 1, N: 3 },
  phases: [
    {
      id: 'ftap-ii',
      title: 'The Second Fundamental Theorem',
      description: 'The Second Fundamental Theorem of Asset Pricing (FTAP II) states that an arbitrage-free market is complete if and only if there is a unique risk-neutral probability measure. A complete market allows any derivative to be perfectly replicated.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "In our trinomial model, we had an infinite number of risk-neutral probability measures because we had three unknowns ($p_u, p_m, p_d$) and only two equations.",
        "Without a unique measure, we cannot definitively price a derivative because we cannot form a unique replicating portfolio.",
        "To achieve a unique Equivalent Martingale Measure (EMM), we need a third constraint.",
        "We obtain this constraint by matching the variance of our discrete trinomial tree to the continuous-time variance of Geometric Brownian Motion."
      ],
      formulas: [
        null,
        null,
        `\\text{Need 3 equations for } p_u, p_m, p_d`,
        `\\text{Variance}_{\\text{tree}} = \\text{Variance}_{\\text{GBM}}`
      ]
    },
    {
      id: 'variance-matching',
      title: 'Variance Matching for Completeness',
      description: 'By asserting that the variance of the tree must exactly match the continuous volatility of the stock, we gain our third constraint. This fully solves the system, unlocking a unique set of probabilities.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "Think of variance as the 'spread' or 'wildness' of the stock. A highly volatile tech stock swings wildly, while a stable utility stock barely moves.",
        "If our discrete tree is going to accurately mimic real life, the mathematical spread of our up, down, and mid branches MUST exactly match the stock's true real-world volatility.",
        "By forcing the tree's second moment (variance) to equal the continuous Black-Scholes variance, we gain our critical third constraint.",
        "We now have a perfect locked system: the probabilities sum to 1, the expected return matches the risk-free bank account (drift), and the spread matches real life (volatility)!"
      ],
      formulas: [
        `\\text{Tree Spread} = \\text{Real-World Volatility}`,
        `p_u u^2 + p_m (1)^2 + p_d d^2 = e^{2r \\Delta t} + \\sigma^2 \\Delta t`,
        `\\text{Constraint 3 Locked}`,
        `\\text{Unique Solution Exists!}`
      ]
    },
    {
      id: 'unique-probabilities',
      title: 'The Unique Risk-Neutral Probabilities',
      description: 'Solving the system of equations provides the exact weights required to price options using backward induction in a trinomial model.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "Now that we have our 3 locked constraints, we can use basic algebra to solve for our 3 unknown probabilities.",
        "To keep the math clean, we define $M$ as our 'Target Drift' (the bank account return), and $V$ as our 'Target Volatility Spread'.",
        "By substituting $p_m$ out of the equations, we isolate the exact formulas for the up and down probabilities.",
        "While these formulas look messy, their purpose is beautiful: they guarantee that our step-by-step discrete tree behaves exactly like a continuous Black-Scholes model!"
      ],
      formulas: [
        `M = e^{r \\Delta t}`,
        `V = e^{2r \\Delta t} + \\sigma^2 \\Delta t`,
        `p_u = \\frac{V - 1 - (M-1)(d+1)}{(u-1)(u-d)}`,
        `p_d = \\frac{(M-1)(u+1) - (V-1)}{(1-d)(u-d)}`
      ]
    },
    {
      id: 'numeric-example',
      title: 'A Concrete Numeric Calculation',
      description: 'Let us calculate these probabilities using real numbers to prove that they are valid probabilities (between 0 and 1) that sum to 1.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "Assume $r = 0.05, \\sigma = 0.20, \\Delta t = 1, u = 1.25, d = 0.8$.",
        "First, we calculate the drift $M = e^{0.05 \\times 1} = 1.0513$.",
        "Next, we calculate the variance constraint $V = e^{0.10} + 0.20^2 = 1.1052 + 0.04 = 1.1452$.",
        "Plugging $M$, $V$, $u$, and $d$ into our formulas yields $p_u = 0.231$, $p_d = 0.258$, and therefore $p_m = 0.511$."
      ],
      formulas: [
        `M = e^{0.05} = 1.0513`,
        `V = e^{0.10} + (0.2)^2 = 1.1452`,
        `p_u = 0.231, p_d = 0.258`,
        `p_m = 1 - 0.231 - 0.258 = 0.511`
      ]
    }
  ]
};
