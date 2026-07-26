import { Lesson } from '../../../types';

export const lesson4: Lesson = {
  id: 'lesson-4',
  title: 'Monte Carlo Simulation & Stochastic Modeling',
  description: 'Understand the foundations of probability theory, the Central Limit Theorem, and how iterative trials can approximate complex financial outcomes.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, T: 1, N: 50, u: 1.1, d: 0.9
  },
  phases: [
    {
      id: 'law-of-large-numbers',
      title: 'The Law of Large Numbers (LLN)',
      description: 'Why more trials equal better approximations.',
      kind: 'mc-histogram',
      visibleParams: ['N', 'sigma'],
      stepTexts: [
        "In econometrics, we often cannot calculate exact outcomes, but we can simulate them. **Monte Carlo Simulation** relies on repeated random sampling to obtain numerical results.",
        "The theoretical foundation of this is the **Law of Large Numbers (LLN)**. It states that as the number of trials increases, the sample average converges to the expected value.",
        "Notice the histogram. With a small sample size (`N`), the distribution is jagged and unpredictable. As you increase `N`, the shape smooths out.",
        "Adjust `N` using the slider to see how increasing trials provides a more stable and accurate approximation of the underlying distribution."
      ],
      formulas: [
        [ "\\text{Monte Carlo approximates via sampling.}" ],
        [ "\\text{LLN implies convergence: } \\lim_{n \\to \\infty} P(|\\bar{X}_n - \\mu| < \\epsilon) = 1" ],
        [ "\\bar{X}_n = \\frac{1}{n}(X_1 + \\dots + X_n)" ],
        [ "\\text{Larger } N \\implies \\text{Smoother Distribution}" ]
      ]
    },
    {
      id: 'central-limit-theorem',
      title: 'The Central Limit Theorem (CLT)',
      description: 'Why everything becomes a bell curve.',
      kind: 'mc-histogram',
      visibleParams: ['N', 'sigma'],
      stepTexts: [
        "The **Central Limit Theorem (CLT)** takes the LLN a step further. It states that the sum (or average) of many independent random variables will tend toward a normal distribution, regardless of their original distribution.",
        "This is why the **Normal Distribution (Bell Curve)** is so ubiquitous in finance.",
        "In the histogram, we are simulating random variables using a Box-Muller transform. Notice how the distribution centers around zero (the mean) and spreads out symmetrically.",
        "The spread of this distribution is controlled by the standard deviation (Volatility). Adjust the `sigma` slider to see the curve flatten (higher risk) or narrow (lower risk)."
      ],
      formulas: [
        [ "\\text{Sum of RVs } \\to \\text{Normal Distribution}" ],
        [ "\\text{The Normal Distribution is everywhere.}" ],
        [ "\\text{Z-Score: } Z = \\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}" ],
        [ "Z \\sim N(0,1) \\text{ as } n \\to \\infty" ]
      ]
    },
    {
      id: 'stochastic-processes',
      title: 'Stochastic Processes in Finance',
      description: 'Modeling random walks and asset prices.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In finance, asset prices don't just jump randomly; they follow a path over time known as a **Stochastic Process**.",
        "The most common model is **Geometric Brownian Motion (GBM)**, which assumes prices drift upward over time but are subject to random, normally distributed shocks.",
        "To simulate an asset's future price, we run thousands of these stochastic paths. The final distribution of prices allows us to calculate expected values, value-at-risk, or price derivatives.",
        "Monte Carlo methods are essential when models are too complex for analytical solutions (like the Black-Scholes formula)."
      ],
      formulas: [
        [ "\\text{Prices follow Stochastic Processes.}" ],
        [ "\\text{GBM: } dS = \\mu S dt + \\sigma S dW" ],
        [ "dW = \\text{Random Shock}, \\mu = \\text{Drift}, \\sigma = \\text{Vol}" ],
        [ "\\text{Monte Carlo handles non-linear outcomes.}" ]
      ]
    },
    {
      id: 'code-implementation-4',
      title: 'Python Implementation',
      description: 'Simulating asset paths with numpy.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "We can easily simulate Geometric Brownian Motion using `numpy`.",
        "We define our parameters: drift, volatility, time steps, and number of simulations.",
        "Then, we generate random normal shocks using `np.random.normal` and iteratively calculate the price path.",
        "Finally, we can plot the paths or plot a histogram of the final prices to see the log-normal distribution."
      ],
      codeSnippet: `import numpy as np
import matplotlib.pyplot as plt

# Parameters
S0 = 100
mu = 0.05
sigma = 0.2
T = 1.0
dt = 1/252 # Daily steps
N_paths = 1000
N_steps = int(T / dt)

# Simulate paths
paths = np.zeros((N_steps, N_paths))
paths[0] = S0

for t in range(1, N_steps):
    # Random shock Z ~ N(0,1)
    Z = np.random.normal(0, 1, N_paths)
    
    # GBM Equation
    paths[t] = paths[t-1] * np.exp((mu - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * Z)

# Plot final price distribution
plt.hist(paths[-1], bins=50)
plt.title("Distribution of Final Asset Prices")
plt.show()`
    }
  ]
};
