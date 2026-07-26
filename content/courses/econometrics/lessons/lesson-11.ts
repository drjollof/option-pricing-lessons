import { Lesson } from '@/content/types';

export const lesson11: Lesson = {
  id: 'lesson-11',
  title: 'Lesson 11: Correlation Metrics',
  description: 'Explore linear vs monotonic relationships, and learn step-by-step calculations for Pearson, Spearman, and Kendall rank correlations.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 1.1, d: 0.9, N: 3, T: 1
  },
  phases: [
    {
      id: 'l11-p1-pearson-theory',
      title: 'Phase 1: Pearson Correlation (Linear)',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "**Pearson Correlation** is the most common measure of association. It measures the strength of the *linear* relationship between two variables.",
        "It evaluates how much the two variables vary together (Covariance) relative to how much they vary independently (the product of their Standard Deviations).",
        "**Calculation Example:** Let's assume we have two assets. We want to find the Pearson Correlation.",
        "We divide the covariance by the product of the volatilities. See the math panel below for the exact numbers and calculation. A score near 1.0 indicates a strong positive linear relationship."
      ],
      formulas: [
        [ "\\text{Pearson } (r) = \\frac{\\text{Cov}(X,Y)}{\\sigma_X \\sigma_Y}" ],
        [ "\\text{If Cov}(X,Y) = 0.08, \\sigma_X = 0.20, \\sigma_Y = 0.50:" ],
        [ "r = \\frac{0.08}{(0.20)(0.50)} = \\frac{0.08}{0.10} = 0.80" ],
        [ "\\text{Note: } -1 \\le r \\le 1" ]
      ]
    },
    {
      id: 'l11-p2-pearson-limitations',
      title: 'Phase 2: Limits of Pearson Correlation',
      kind: 'rank-correlation',
      visibleParams: [],
      stepTexts: [
        "Despite its popularity, Pearson has two massive flaws. First, it is highly sensitive to extreme outliers because it calculates distance using absolute magnitudes.",
        "Second, it *only* detects linear relationships. Look at the raw data in the visualizer: the relationship is clearly incredibly strong (it's an exponential curve!), but it's not a straight line.",
        "If you run a standard Pearson correlation on this exponential data, it might score poorly, tricking you into thinking the relationship is weak!"
      ],
      formulas: [
        [ "\\text{Pearson assumes:}" ],
        [ "1. \\text{ Linear Relationship}" ],
        [ "2. \\text{ Normal Distribution (no extreme outliers)}" ],
        [ "\\implies \\text{Fails on crypto, tech stocks, and exponential growth.}" ]
      ]
    },
    {
      id: 'l11-p3-spearman-rank',
      title: 'Phase 3: Spearman Rank Correlation',
      kind: 'rank-correlation',
      visibleParams: [],
      stepTexts: [
        "To solve this, we can use a **Non-Parametric** approach: **Spearman's Rank Correlation**.",
        "Instead of looking at the raw values, we simply rank them! The smallest X gets Rank 1, the next gets Rank 2. We do the same for Y.",
        "Watch the visualizer: as we transform both X and Y from raw values to ranks, the exponential curve is magically flattened into a perfect straight line!",
        "Spearman correlation is just the Pearson correlation of the *ranks*. It perfectly captures any monotonic relationship (always increasing or always decreasing), regardless of whether it's linear or exponential."
      ],
      formulas: [
        [ "\\text{Spearman } \\rho = 1 - \\frac{6 \\sum d_i^2}{n(n^2-1)}" ],
        [ "\\text{Where } d_i = \\text{Rank}(X_i) - \\text{Rank}(Y_i)" ],
        [ "\\text{Example: } X=\\{10, 100, 1000\\} \\implies \\text{Ranks: } \\{1, 2, 3\\}" ],
        [ "\\text{If ranks match perfectly, } d_i = 0 \\implies \\rho = 1.0" ]
      ]
    },
    {
      id: 'l11-p4-kendall-tau-theory',
      title: 'Phase 4: Kendall\'s Tau',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Another robust, non-parametric metric is **Kendall's Tau**, which focuses strictly on Concordant vs Discordant pairs.",
        "**Calculation Example:** We have two pairs of days. Pair A and Pair B. Did they move in the same direction relative to each other?",
        "If they moved in the same direction, this is a **Concordant** pair. If opposite, it is Discordant.",
        "Review the exact fraction and calculation in the LaTeX panel below to see how Tau evaluates every possible pair in a dataset."
      ],
      formulas: [
        [ "\\text{Concordant (C): } (X_j - X_i)(Y_j - Y_i) > 0" ],
        [ "\\text{Discordant (D): } (X_j - X_i)(Y_j - Y_i) < 0" ],
        [ "\\text{Kendall's } \\tau = \\frac{C - D}{C + D}" ],
        [ "\\text{Example: } C = 8, D = 2 \\implies \\tau = \\frac{8 - 2}{8 + 2} = \\frac{6}{10} = 0.60" ]
      ]
    },
    {
      id: 'l11-p5-tau-vs-rho',
      title: 'Phase 5: When to use which?',
      kind: 'correlation-heatmap',
      visibleParams: [],
      stepTexts: [
        "So we have three metrics: Pearson, Spearman, and Kendall. Which one should a quantitative researcher use?",
        "**Pearson:** Use it when the data is roughly normal, the relationship is strictly linear, and there are no massive outliers. (Often false in finance!)",
        "**Spearman:** Excellent general-purpose metric. Use it for non-linear monotonic relationships or when the data has fat tails. It's highly resistant to outliers.",
        "**Kendall's Tau:** Statistically, it is even more robust than Spearman and converges better for small sample sizes. However, computing every pair is computationally expensive for massive datasets."
      ],
      formulas: [
        [ "\\text{Pearson } (r): \\text{ Linear, fast, fragile to outliers.}" ],
        [ "\\text{Spearman } (\\rho): \\text{ Monotonic, robust to outliers.}" ],
        [ "\\text{Kendall } (\\tau): \\text{ Concordant pairs, highest statistical robustness.}" ]
      ],
      codeSnippet: `import pandas as pd
import numpy as np

# Generate non-linear monotonic data
x = np.arange(1, 100)
y = np.exp(x / 20)

df = pd.DataFrame({'X': x, 'Y': y})

# 1. Pearson Correlation (Linear)
pearson = df['X'].corr(df['Y'], method='pearson')
print(f"Pearson (Linear): {pearson:.4f}")

# 2. Spearman Correlation (Rank)
spearman = df['X'].corr(df['Y'], method='spearman')
print(f"Spearman (Rank): {spearman:.4f}")

# 3. Kendall Tau (Concordant Pairs)
kendall = df['X'].corr(df['Y'], method='kendall')
print(f"Kendall's Tau: {kendall:.4f}")`
    }
  ]
};
