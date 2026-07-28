import { Lesson } from '../../../types';

export const lesson4: Lesson = {
  id: 'lesson-4',
  title: 'Monte Carlo Simulation & Stochastic Modeling',
  description: 'Understand the foundations of probability theory, the Central Limit Theorem, and how iterative trials can approximate complex econometric outcomes.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, T: 1, N: 50, u: 1.1, d: 0.9
  },
  phases: [
    {
      id: 'mc-intuition',
      title: 'Why do we simulate data?',
      description: 'Testing models on data where we know the absolute truth.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In real-world econometrics, we run regressions on historical data (like GDP vs Unemployment) to estimate the true, hidden mathematical relationship.",
        "The fundamental problem is: we never actually know if our model is right, because we don't know the 'True' relationship!",
        "To prove that mathematical estimators (like OLS) actually work, econometricians rely on **Monte Carlo Simulations**.",
        "We artificially generate fake data where *we* define the true relationship. Then, we test if our model can successfully rediscover the hidden truth we programmed into it."
      ],
      formulas: [
        null,
        null,
        null,
        null
      ]
    },
    {
      id: 'dgp-math',
      title: 'The Data Generating Process (DGP)',
      description: 'Programming the hidden truth.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Let's build a concrete mathematical simulation. We will define a **Data Generating Process (DGP)** with exactly 10 data points ($N=10$).",
        "We program the True Relationship: $Y = 2.0X + \\epsilon$. The true slope is exactly 2.0. We add random statistical noise ($\\epsilon$) with a variance of 1.0.",
        "We generate 10 random X values, add the noise, and calculate Y. Then, we run OLS on this fake dataset.",
        "Because $N=10$ is extremely small, the noise mathematically overwhelms the signal. Our OLS model guesses the slope is $\\hat{\\beta} = 2.4$. It missed the true 2.0!"
      ],
      formulas: [
        [ "\\text{True DGP: } Y = 2.0X + \\epsilon" ],
        [ "\\text{True } \\beta = 2.0, \\quad \\sigma^2 = 1.0" ],
        null,
        [ "\\text{Estimated } \\hat{\\beta} = 2.4 \\neq 2.0" ]
      ]
    },
    {
      id: 'law-of-large-numbers',
      title: 'The Law of Large Numbers (LLN)',
      description: 'Why more data equals perfect accuracy.',
      kind: 'mc-histogram',
      visibleParams: [],
      stepTexts: [
        "What happens if we dramatically increase our simulated sample size from $N=10$ to $N=100,000$?",
        "As we simulate a massive amount of data, the positive noise perfectly cancels out the negative noise. The true signal cleanly cuts through.",
        "When we run OLS on the 100,000 points, the estimated slope becomes $\\hat{\\beta} = 2.0001$. It perfectly rediscovered our programmed truth!",
        "This mathematical convergence is guaranteed by the **Law of Large Numbers (LLN)**. As sample size grows to infinity, the sample estimate perfectly converges to the true expected value."
      ],
      formulas: [
        null,
        null,
        [ "\\text{For } N=100,000: \\hat{\\beta} \\approx 2.0001" ],
        [ "\\lim_{n \\to \\infty} P(|\\hat{\\beta}_n - \\beta| < \\epsilon) = 1" ]
      ]
    },
    {
      id: 'central-limit-theorem',
      title: 'The Central Limit Theorem (CLT)',
      description: 'The distribution of our errors.',
      kind: 'mc-histogram',
      visibleParams: [],
      stepTexts: [
        "Now, instead of one massive dataset, what if we run our small $N=10$ simulation 1,000 separate times?",
        "We will get 1,000 completely different OLS guesses. One might be 2.4, another 1.8, another 2.1. If we plot a histogram of all 1,000 guesses, what shape will it take?",
        "According to the **Central Limit Theorem (CLT)**, these guesses will miraculously form a perfect, symmetric Normal Distribution (Bell Curve) centered exactly on the true value of 2.0.",
        "Look at the visualizer. This is why econometricians can use Z-scores and Bell Curves to construct Confidence Intervals—because the errors of our estimates naturally form a bell curve!"
      ],
      formulas: [
        null,
        null,
        [ "\\hat{\\beta} \\sim \\mathcal{N}\\left(\\beta, \\frac{\\sigma^2}{\\sum x_i^2}\\right)" ],
        null
      ]
    },
    {
      id: 'code-implementation-4',
      title: 'Python Implementation',
      description: 'Simulating OLS with numpy.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "We can run this exact Monte Carlo experiment in Python using `numpy`.",
        "First, we define our True DGP (Beta = 2.0) and generate random X values.",
        "Next, we loop 1,000 times, adding random normal noise to generate Y, and running OLS to store the estimated Beta.",
        "Finally, we plot a histogram of our 1,000 Betas, revealing the perfect Bell Curve predicted by the CLT."
      ],
      codeSnippet: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

N = 50 # Sample size per simulation
true_beta = 2.0
n_simulations = 1000
estimated_betas = []

for _ in range(n_simulations):
    # 1. Simulate the Data Generating Process (DGP)
    X = np.random.normal(0, 1, (N, 1))
    noise = np.random.normal(0, 1, (N, 1))
    Y = true_beta * X + noise
    
    # 2. Run OLS on the fake data
    model = LinearRegression().fit(X, Y)
    estimated_betas.append(model.coef_[0][0])

# 3. Plot the Central Limit Theorem in action
plt.hist(estimated_betas, bins=30, edgecolor='black', alpha=0.7)
plt.axvline(true_beta, color='red', linestyle='dashed', linewidth=2)
plt.title('Distribution of Estimated Betas (CLT)')
plt.show()`
    }
  ]
};
