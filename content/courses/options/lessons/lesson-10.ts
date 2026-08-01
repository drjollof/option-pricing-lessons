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
        "In our trinomial model, we had an infinite number of risk-neutral probability measures because we had three unknowns and two equations.",
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
      description: 'By asserting that the variance of the asset returns over the time step dt must match the continuous variance (sigma squared times dt), we gain our third equation. This gives us a system of three equations with three unknowns, solvable for the unique probabilities.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "Equation 1: The probabilities must sum to 1.",
        "Equation 2: The expected return must equal the risk-free rate r (Martingale condition).",
        "Equation 3: The variance of the discrete step must equal σ²Δt.",
        "Solving this system yields the explicit mathematical formulas for p_u, p_d, and p_m."
      ],
      formulas: [
        `p_u + p_m + p_d = 1`,
        `p_u u + p_m + p_d d = e^{r \\Delta t}`,
        `p_u u^2 + p_m + p_d d^2 = e^{2r \\Delta t} + \\sigma^2 \\Delta t`,
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
        "Let's define a convenient term M = e^{r \\Delta t} and V = e^{2r \\Delta t} + \\sigma^2 \\Delta t.",
        "By substituting p_m = 1 - p_u - p_d into the other equations, we can isolate p_u.",
        "The probability of an upward movement, p_u, perfectly balances the expected return and variance.",
        "Similarly, p_d is derived, and the remaining probability defaults to the mid-move p_m."
      ],
      formulas: [
        `M = e^{r \\Delta t}, \\quad V = M^2 + \\sigma^2 \\Delta t`,
        null,
        `p_u = \\frac{V - M d - M + d}{(u - d)(u - 1)}`,
        `p_d = \\frac{V - M u - M + u}{(u - d)(1 - d)}`
      ]
    }
  ]
};
