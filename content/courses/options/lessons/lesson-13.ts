import { Lesson } from '../../../types';

export const lesson13: Lesson = {
  id: 'lesson-13',
  title: 'Continuous-Time & Geometric Brownian Motion',
  description: 'Transition from discrete binomial trees to continuous time by modeling stock prices with stochastic calculus.',
  defaultParams: { S0: 100, K: 100, u: 0.1, d: 0.9, sigma: 0.2, r: 0.05, T: 1, N: 100 },
  phases: [
    {
      id: 'discrete-vs-continuous',
      title: 'The Limits of Discrete Time',
      description: "In previous modules, we used Binomial and Trinomial trees to model stock prices jumping discrete steps ($\\Delta t$). However, markets don't jump every month or day; prices move tick-by-tick in continuous time. As we shrink $\\Delta t$ closer to zero, the trees become computationally overwhelming. To solve this, we must transition to continuous-time mathematics.",
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "A Binomial tree with $N=3$ steps has $2^3 = 8$ paths.",
        "A tree modeling every minute of a trading year would have $N=100,000$ steps.",
        "Instead of calculating $2^{100,000}$ paths, we use Stochastic Differential Equations (SDEs) to model the price as a continuous curve."
      ],
      formulas: [
        [ `\\text{Discrete Steps: } \\Delta t > 0` ],
        [ `\\text{Continuous Time: } \\lim_{\\Delta t \\to 0} \\Delta t = dt` ],
        [ `\\text{Number of Paths} = 2^N \\to \\infty` ]
      ]
    },
    {
      id: 'wiener-process',
      title: 'The Wiener Process (Brownian Motion)',
      description: "To model continuous randomness, we use a Wiener Process (or Brownian Motion), denoted as $W_t$ or $Z_t$. It is a specific type of Markov process (meaning past price paths don't predict the future). Over a tiny slice of time $dt$, the random shock $dW_t$ is normally distributed with a mean of 0 and a variance of $dt$.",
      kind: 'stochastic-path',
      showParamControls: false,
      visibleParams: [],
      overrideParams: { u: 0, sigma: 1, S0: 0, T: 1, N: 12 },
      stepTexts: [
        "The change in a Wiener process over a small time $\\Delta t$ is $\\Delta z = \\epsilon \\sqrt{\\Delta t}$.",
        "Let's ground this. If our time step is exactly 1 month, we can calculate the standard deviation of the shock.",
        "If our random normal draw for this month happens to be a strong upward shock ($\\epsilon$), we calculate the actual move.",
        "The path moves up by $\\Delta z$. Notice how the variance explicitly scales with time, keeping the randomness mathematically contained."
      ],
      formulas: [
        [ `\\Delta z = \\epsilon \\sqrt{\\Delta t}` ],
        [ `\\Delta t = \\frac{1}{12} = 0.0833 \\implies \\sqrt{\\Delta t} = 0.288` ],
        [ `\\epsilon = +1.5` ],
        [ `\\Delta z = 1.5 \\times 0.288 = +0.432` ]
      ]
    },
    {
      id: 'gbm',
      title: 'Geometric Brownian Motion (GBM)',
      description: "A pure Wiener process can go negative, which is impossible for stock prices. To fix this, we model the *percentage* return of the stock using Geometric Brownian Motion (GBM). We add a deterministic drift ($\\mu$) representing expected growth, and we scale the Wiener randomness by volatility ($\\sigma$).",
      kind: 'stochastic-path',
      showParamControls: false,
      visibleParams: ['S0', 'u', 'sigma', 'T'],
      overrideParams: { u: 0.1, sigma: 0.2, S0: 100, T: 1 },
      stepTexts: [
        "The GBM stochastic differential equation is: $dS = S(\\mu dt + \\sigma dW_t)$. Let's prove how this works using a bank account analogy.",
        "If you deposit a principal ($S_0$) in an account with a positive expected return ($\\mu$) for exactly 1 year ($dt = 1$), you expect to earn a drift.",
        "But a stock is risky! If it has high volatility ($\\sigma$) and our 1-year random shock is negative ($\\epsilon = -1.0$), the shock destroys value.",
        "Because both drift and shock are multiplied by the stock price itself, the stock can mathematically never drop below exactly zero."
      ],
      formulas: [
        [ `dS = S(\\mu dt + \\sigma \\epsilon \\sqrt{dt})` ],
        [ `\\text{Drift} = \\$100 \\times 0.10 \\times 1 = +\\$10` ],
        [ `\\text{Shock} = \\$100 \\times 0.20 \\times (-1.0) \\times \\sqrt{1} = -\\$20` ],
        [ `S_{\\text{new}} = \\$100 + \\$10 - \\$20 = \\$90` ]
      ]
    },
    {
      id: 'python-gbm',
      title: 'Python Simulation: GBM',
      description: "We don't have to solve the SDE analytically to use it. We can discretize the GBM equation into a simple loop and simulate paths using Python. This is the foundation of Monte Carlo pricing.",
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "We start by defining our parameters: Initial Price ($S_0$), Drift ($\\mu$), and Volatility ($\\sigma$).",
        "We discretize time into $N$ steps over $T$ years. So $dt = T/N$.",
        "We generate a sequence of random normal shocks using `np.random.randn(N)`.",
        "We loop through time, updating the stock price step-by-step using the GBM equation."
      ],
      formulas: [
        [ `\\text{Initialize Parameters}` ],
        [ `dt = \\frac{T}{N}` ],
        [ `\\epsilon_t \\sim \\mathcal{N}(0, 1)` ],
        [ `S_{t+1} = S_t + S_t (\\mu dt + \\sigma \\epsilon_t \\sqrt{dt})` ]
      ],
      codeSnippet: `import numpy as np
import matplotlib.pyplot as plt

# Parameters
S0 = 100      # Initial stock price
mu = 0.10     # Drift (10%)
sigma = 0.20  # Volatility (20%)
T = 1.0       # Time in years
N = 252       # Number of trading days
dt = T / N

# Simulate Path
S = np.zeros(N)
S[0] = S0

# Generate N random normal shocks
epsilon = np.random.randn(N)

for t in range(1, N):
    # The GBM discrete equation
    dS = S[t-1] * (mu * dt + sigma * epsilon[t] * np.sqrt(dt))
    S[t] = S[t-1] + dS

plt.plot(S)
plt.title("Simulated GBM Stock Path")
plt.show()`
    },
    {
      id: 'gbm-var',
      title: 'Value at Risk (VaR)',
      description: "If we simulate thousands of these GBM paths, we can build a distribution of potential future stock prices. Risk managers use this distribution to calculate Value at Risk (VaR), which answers the question: 'With 95% confidence, what is my worst-case scenario?'",
      kind: 'mc-histogram',
      showParamControls: false,
      visibleParams: [],
      stepTexts: [
        "Imagine we simulate 100 paths of our stock.",
        "Now let's simulate 1,000 paths. The distribution of final prices starts to take shape.",
        "Finally, simulate 50,000 paths. By finding the 5th percentile of this bell curve, we identify the VaR. We are 95% confident the stock won't drop below this point."
      ],
      formulas: [
        [ `\\text{Simulations} = 100` ],
        [ `\\text{Simulations} = 1,000` ],
        [ `\\text{VaR}_{95\\%} = \\text{5th Percentile}` ]
      ]
    }
  ]
};
