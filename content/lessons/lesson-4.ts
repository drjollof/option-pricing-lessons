import { Lesson } from '../types';

export const lesson4: Lesson = {
  id: 'lesson-4',
  title: 'Model Calibration & Convergence',
  description: 'Learn how to calibrate the binomial model using real-world volatility, and discover how scaling N to infinity converges to the continuous Black-Scholes formula.',
  defaultParams: { S0: 100, K: 100, u: 1.15, d: 0.85, r: 0.05, T: 1, N: 50, sigma: 0.2 },
  phases: [
    {
      id: 'real-world-vs-tree',
      title: 'The Real World vs. The Tree',
      description: "So far, we have arbitrarily chosen u = 1.15 and d = 0.85 for our binomial tree. But in the real world, stock markets don't move in arbitrary chunks. If we want our option price to match reality, our tree must mimic the actual statistical behavior of the stock.",
      kind: 'static-slides',
      showParamControls: false,
      stepTexts: [
        "Step 0: A real stock price moves continuously, modeled by Geometric Brownian Motion.",
        "Step 1: The two key parameters of this motion are Drift (μ) and Volatility (σ).",
        "Step 2: If we slice time into very small steps (Δt), we can force our discrete binomial tree to perfectly match the continuous volatility (σ) of the stock.",
        "Step 3: This process is called 'Calibration'."
      ],
      formulas: [
        [ `u = 1.15, d = 0.85 \\quad (\\text{Arbitrary!})` ],
        [ `\\text{Real World: } dS = \\mu S dt + \\sigma S dW` ],
        [ `\\text{Tree Variance must match } \\sigma^2 \\Delta t` ],
        [ `\\text{We must solve for } u \\text{ and } d \\text{ using } \\sigma` ]
      ]
    },
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
      id: 'lognormal-walk',
      title: 'The Lognormal Walk',
      description: "By calibrating the tree with σ, something magical happens as we increase the number of steps (N). The terminal stock prices at the end of the tree begin to perfectly form a Lognormal Distribution, which is the exact distribution assumed by the Black-Scholes formula.",
      kind: 'static-slides',
      showParamControls: false,
      stepTexts: [
        "Step 0: At N=3, there are only 4 possible final stock prices. The distribution is very jagged.",
        "Step 1: At N=50, there are 51 possible final stock prices.",
        "Step 2: Because u = 1/d, the tree recombines beautifully. The middle nodes have vastly more paths leading to them than the extreme edge nodes.",
        "Step 3: This path-counting naturally generates a bell curve (Normal distribution) in log-space, yielding a Lognormal distribution of prices."
      ],
      formulas: [
        [ `N=3 \\implies 4 \\text{ terminal nodes}` ],
        [ `N=50 \\implies 51 \\text{ terminal nodes}` ],
        [ `\\text{Paths to node } j = \\binom{N}{j} = \\frac{N!}{j!(N-j)!}` ],
        [ `\\text{Binomial Tree } \\xrightarrow{N \\to \\infty} \\text{ Lognormal Distribution}` ]
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
