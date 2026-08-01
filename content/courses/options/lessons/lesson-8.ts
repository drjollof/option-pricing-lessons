import { Lesson } from '../../../types';

export const lesson8: Lesson = {
  id: 'lesson-8',
  title: 'Monte Carlo Simulation',
  description: 'Escape the Curse of Dimensionality by using randomized simulations to price options mathematically instead of building massive trees.',
  defaultParams: { S0: 100, K: 100, u: 1.15, d: 0.85, r: 0.05, T: 1, N: 3, sigma: 0.2 },
  phases: [
    {
      id: 'what-is-monte-carlo',
      title: 'What is Monte Carlo?',
      description: "In Lesson 7, we saw that pricing path-dependent options (like Asians) requires enumerating 2^N paths. For N=100 days, this is 1.26 x 10^30 paths, which would take a supercomputer longer than the age of the universe to calculate. Enter Monte Carlo Simulation.",
      kind: 'static-slides',
      showParamControls: false,
      stepTexts: [
        "Instead of calculating EVERY possible path, what if we just randomly sample a few thousand of them?",
        "If we generate random price paths that follow the true statistical behavior of the stock, we can just calculate the option payoff for those random paths.",
        "By the Law of Large Numbers, the average of those random payoffs will converge precisely to the true fair value of the option!",
        "This allows us to price incredibly complex exotics in seconds, completely ignoring the 2^N problem."
      ],
      formulas: [
        [ `\\text{Paths required (Tree)} = 2^{100} \\approx 1.26 \\times 10^{30}` ],
        [ `\\text{Paths required (Monte Carlo)} \\approx 10,000` ],
        [ `\\text{Fair Value} \\approx e^{-rT} \\frac{1}{M} \\sum_{i=1}^M \\text{Payoff}_i` ],
        [ `\\text{Goodbye Curse of Dimensionality!}` ]
      ]
    },
    {
      id: 'geometric-brownian-motion',
      title: 'Geometric Brownian Motion',
      description: "To generate these random paths, we assume the stock follows Geometric Brownian Motion (GBM). In a tiny time step Δt, the stock moves based on a guaranteed 'drift' (the risk-free rate) plus a random 'shock' scaled by the stock's volatility (σ).",
      kind: 'derivation-steps',
      showParamControls: false,
      stepTexts: [
        "We start with our continuous GBM model: $dS = \\mu S dt + \\sigma S dW$.",
        "To simulate this on a computer, we use its exact mathematical solution, moving forward in discrete time steps ($\\Delta t$).",
        "At each step, we draw a random 'shock' multiplier $Z$ from a standard bell curve (like rolling a million-sided die).",
        "We then multiply the current price by $e^{\\text{Drift} + \\text{Shock}}$. Notice the Drift is penalized slightly by variance ($-\\sigma^2/2$)—this is because volatility drags down compounded returns!"
      ],
      formulas: [
        [
          `dS_t = \\mu S_t dt + \\sigma S_t dW_t`
        ],
        [
          `S_{t+\\Delta t} = S_t \\exp\\left( (r - \\frac{\\sigma^2}{2})\\Delta t + \\sigma \\sqrt{\\Delta t} Z \\right)`
        ],
        [
          `Z \\sim N(0, 1) \\quad (\\text{Random Standard Normal})`
        ],
        [
          `\\text{Drift} = (r - \\frac{\\sigma^2}{2})\\Delta t`,
          `\\text{Shock} = \\sigma \\sqrt{\\Delta t} Z`
        ]
      ]
    },
    {
      id: 'monte-carlo-visual',
      title: 'Visualizing the Simulations',
      description: "Here we generate completely random paths using GBM. Each line represents one possible 'future' for the stock over the next year. Try changing the number of paths (M) and the number of steps per path (N) to see how the simulation fills out the statistical distribution.",
      kind: 'monte-carlo',
      showParamControls: true
    },
    {
      id: 'pricing-by-simulation',
      title: 'Pricing by Simulation',
      description: "Once we have generated the paths, pricing is trivial! We calculate the payoff for every single path, take the average, and discount it to today. Notice how the Asian option is consistently cheaper than the European option across the simulations, because the averaging process reduces the extremes (volatility).",
      kind: 'static-slides',
      showParamControls: false,
      stepTexts: [
        "We've solved the Asian Option pricing problem.",
        "In the real world, Quants use Monte Carlo to price options with dozens of complex triggers, barriers, and multi-asset dependencies.",
        "While Trees are great for American options (because you can check for early exercise by working backward), Monte Carlo works strictly forward in time.",
        "This makes Monte Carlo terrible for standard American options, but the undisputed king of Exotic options."
      ],
      formulas: [
        [ `C_{European} = e^{-rT} \\frac{1}{M} \\sum_{i=1}^M \\max(0, S^{(i)}_T - K)` ],
        [ `C_{Asian} = e^{-rT} \\frac{1}{M} \\sum_{i=1}^M \\max(0, A^{(i)}_T - K)` ],
        [ `\\text{Trees} \\implies \\text{Backward (Good for American)}` ],
        [ `\\text{Monte Carlo} \\implies \\text{Forward (Good for Exotics)}` ]
      ]
    }
  ]
};
