import { Lesson } from '../types';

export const lesson4: Lesson = {
  id: 'lesson-4',
  title: 'Model Calibration & Convergence',
  description: 'Learn how to calibrate the binomial model using real-world volatility, and discover how scaling N to infinity converges to the continuous Black-Scholes formula.',
  defaultParams: { S0: 100, K: 100, u: 1.15, d: 0.85, r: 0.05, T: 1, N: 50, sigma: 0.2 },
  phases: [
    {
      id: 'volatility-calibration',
      title: 'Calibrating with Volatility',
      description: "Instead of choosing arbitrary 'u' and 'd' values, market practitioners calibrate the tree using Implied Volatility (σ). As we slice time (T) into N steps, the step size Δt becomes T/N. We then set u = e^(σ√Δt) and d = e^(-σ√Δt).",
      kind: 'derivation-steps',
      showParamControls: false,
      stepTexts: [
        "Step 0: We assume a stock volatility of σ = 20% (0.20) and T = 1 year.",
        "Step 1: If N = 50 steps, then Δt = 1/50 = 0.02.",
        "Step 2: We calculate the up factor: u = e^(0.20 * √0.02).",
        "Step 3: This guarantees that our discrete binomial tree statistically matches the continuous real-world volatility of the stock!"
      ],
      formulas: [
        [
          `\\sigma = 0.20 \\quad T = 1 \\quad N = 50`,
          `\\Delta t = \\frac{1}{50} = 0.02`
        ],
        [
          `u = e^{\\sigma \\sqrt{\\Delta t}} \\quad d = e^{-\\sigma \\sqrt{\\Delta t}}`
        ],
        [
          `\\begin{aligned} u &= e^{0.20 \\sqrt{0.02}} \\\\ &= e^{0.20 \\times 0.1414} \\\\ &= e^{0.0283} \\\\ &\\approx 1.0287 \\end{aligned}`
        ],
        [
          `\\begin{aligned} d &= e^{-0.20 \\sqrt{0.02}} \\\\ &\\approx 0.9721 \\end{aligned}`
        ]
      ]
    },
    {
      id: 'convergence-sweep',
      title: 'Convergence to Black-Scholes',
      description: "What happens if we increase N? A tree with N=3 is inaccurate, but as N → ∞, the binomial price oscillates and eventually flattens out, perfectly converging to the continuous-time Black-Scholes formula! Try adjusting the parameters below.",
      kind: 'convergence-sweep',
      showParamControls: true
    }
  ]
};
