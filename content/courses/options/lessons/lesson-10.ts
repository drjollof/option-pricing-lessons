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
      description: 'By asserting that the variance of the asset returns over the time step $\\Delta t$ must match the continuous variance ($\\sigma^2 \\Delta t$), we gain our third equation. This gives us a system of three equations with three unknowns, solvable for the unique probabilities.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "Equation 1: The probabilities must sum to 1.",
        "Equation 2: The expected return must equal the risk-free rate $r$ (Martingale condition).",
        "Equation 3: The second moment of the discrete step must match the second moment of the continuous process $e^{2r\\Delta t} + \\sigma^2 \\Delta t$.",
        "Solving this system yields the explicit mathematical formulas for $p_u$, $p_d$, and $p_m$."
      ],
      formulas: [
        `p_u + p_m + p_d = 1`,
        `p_u u + p_m (1) + p_d d = e^{r \\Delta t}`,
        `p_u u^2 + p_m (1)^2 + p_d d^2 = e^{2r \\Delta t} + \\sigma^2 \\Delta t`,
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
        "Let's define a convenient term $M = e^{r \\Delta t}$ representing the expected drift.",
        "Let $V = e^{2r \\Delta t} + \\sigma^2 \\Delta t$ represent the variance constraint.",
        "By substituting $p_m = 1 - p_u - p_d$ into the other two equations, we can isolate $p_u$ and $p_d$.",
        "These derived probabilities guarantee that our discrete tree perfectly mimics the continuous Black-Scholes environment as $\\Delta t \\to 0$."
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
