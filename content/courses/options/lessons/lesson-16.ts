import { Lesson } from '../../../types';

export const lesson16: Lesson = {
  id: 'lesson-16',
  title: 'The Vasicek Model',
  description: 'Apply continuous-time stochastic modeling to interest rates using a mean-reverting risk-neutral process.',
  defaultParams: { S0: 0.05, K: 100, u: 0.1, d: 0.9, sigma: 0.02, r: 0.05, T: 1, N: 100 },
  phases: [
    {
      id: 'beyond-equities',
      title: 'Beyond Equities',
      description: "Geometric Brownian Motion (GBM) is great for stocks because stocks can grow exponentially forever. But can we use GBM for interest rates? No. If interest rates grew exponentially, the global economy would collapse. Interest rates naturally fluctuate around a long-term average. To model this, we need a mean-reverting process.",
      kind: 'static-slides',
      showParamControls: false,
      visibleParams: [],
      stepTexts: [
        "Stocks: Expected to drift upward indefinitely.",
        "Interest Rates: If they go too high, central banks cut them. If they go too low, inflation spikes and banks raise them.",
        "This gravitational pull toward an equilibrium is called Mean Reversion."
      ],
      formulas: [
        [ `S_t \\to \\infty` ],
        [ `r_t \\to \\theta` ],
        [ `\\text{Mean Reversion}` ]
      ]
    },
    {
      id: 'vasicek-sde',
      title: 'The Vasicek SDE',
      description: "Introduced by Oldřich Vašíček in 1977, this model modifies our stochastic differential equation. Instead of a constant drift, the drift term actively pushes the interest rate back toward a target level.",
      kind: 'stochastic-path',
      showParamControls: false,
      visibleParams: ['S0', 'u', 'K'], // K is used for k, S0 is r_0, u is theta
      overrideParams: { S0: 0.10, u: 0.05, K: 0.5, sigma: 0.02 }, // Exaggerated numbers for visual path
      stepTexts: [
        "The Vasicek SDE is: $dr_t = k(\\theta - r_t)dt + \\sigma dZ_t$.",
        "Let's trace a concrete path. The process starts at a current rate of $r_0 = 10\\%$.",
        "The central bank's long-term target mean is $\\theta = 5\\%$. Notice the current rate is too high. It wanders due to the $\\sigma dZ_t$ noise.",
        "But because it is above the target, the $k(\\theta - r_t)$ term is negative, pulling the path downward like a rubber band back to 5%."
      ],
      formulas: [
        [ `dr_t = k(\\theta - r_t)dt + \\sigma dZ_t` ],
        [ `r_0 = 10\\%` ],
        [ `\\theta = 5\\%` ],
        [ `\\theta - r_t = -5\\% \\implies \\text{Pull Downward}` ]
      ]
    },
    {
      id: 'deconstructing-sde',
      title: 'Deconstructing the Parameters',
      description: "Let's numerically break down the three parameters that define the Vasicek model: $k$, $\\theta$, and $\\sigma$.",
      kind: 'static-slides',
      showParamControls: false,
      visibleParams: ['S0', 'u', 'K', 'sigma'],
      overrideParams: { u: 0.05, S0: 0.10, K: 0.5, sigma: 0.02 }, // Map u to theta, K to k, S0 to r_0
      stepTexts: [
        "Let's numerically break down the 'rubber band' effect using a current rate ($r_{t-1}$) and target mean ($\\theta$).",
        "We calculate the gap between the target and current rate. Multiplying by the Speed of Reversion ($k$) gives the deterministic drift.",
        "This means the model mathematically expects the interest rate to drop over the next year to revert to the mean.",
        "If we add a volatility random shock, we get the final rate."
      ],
      formulas: [
        [ `r_{t-1} = 10\\% \\text{ and } \\theta = 5\\%` ],
        [ `\\text{Drift} = k(\\theta - r_{t-1}) = 0.5(5\\% - 10\\%) = -2.5\\%` ],
        [ `\\text{Expected Rate} = 10\\% - 2.5\\% = 7.5\\%` ],
        [ `\\text{Final Rate} = 7.5\\% + 1.0\\% = 8.5\\%` ]
      ]
    },
    {
      id: 'python-vasicek',
      title: 'Python Simulation: Vasicek',
      description: "Just like GBM, we can discretize the Vasicek SDE into a simple loop to simulate interest rate paths.",
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "We set up our parameters: $r_0$, $k$, $\\theta$, and $\\sigma$.",
        "Inside the loop, the expected change is $k \\times (\\theta - r_{t-1}) \\times dt$.",
        "The random shock is $\\sigma \\times \\epsilon \\times \\sqrt{dt}$.",
        "We add both to the previous rate to get the new rate."
      ],
      formulas: [
        [ `\\text{Parameters}` ],
        [ `\\text{Drift} = k(\\theta - r_{t-1})dt` ],
        [ `\\text{Shock} = \\sigma \\epsilon \\sqrt{dt}` ],
        [ `r_t = r_{t-1} + \\text{Drift} + \\text{Shock}` ]
      ],
      codeSnippet: `import numpy as np
import matplotlib.pyplot as plt

# Parameters
r0 = 0.05    # Starting rate (5%)
theta = 0.05 # Long-term mean (5%)
k = 0.15     # Speed of reversion
sigma = 0.01 # Volatility
T = 1.0      # 1 Year
N = 252      # Daily steps
dt = T / N

r = np.zeros(N)
r[0] = r0
epsilon = np.random.randn(N)

for t in range(1, N):
    drift = k * (theta - r[t-1]) * dt
    shock = sigma * epsilon[t] * np.sqrt(dt)
    
    # Discrete Vasicek Equation
    r[t] = r[t-1] + drift + shock

plt.plot(r)
plt.axhline(theta, color='red', linestyle='--')
plt.title("Simulated Vasicek Interest Rate Path")
plt.show()`
    }
  ]
};
