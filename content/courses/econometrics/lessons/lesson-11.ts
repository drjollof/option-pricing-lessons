import { Lesson } from '@/content/types';

export const lesson11: Lesson = {
  id: 'lesson-11',
  title: 'Correlation Metrics',
  description: 'Explore linear vs monotonic relationships, and learn step-by-step calculations for Pearson, Spearman, and Kendall rank correlations.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 1.1, d: 0.9, N: 3, T: 1
  },
  phases: [
    {
      id: 'l11-p1-pearson-theory',
      title: 'Pearson Correlation (Linear)',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "**Pearson Correlation** is the most common measure of statistical association. It strictly measures the strength of the *linear* relationship between two variables.",
        "It evaluates how much the two variables vary exactly together (Covariance) relative to how much they independently vary overall (the product of their Standard Deviations).",
        "**Calculation Example:** Let's assume we have two heavily traded assets, X and Y, and we want to find their exact Pearson Correlation.",
        "If their joint Covariance is $0.08$, and their individual volatilities are $0.20$ and $0.50$, the math is exactly $0.08 / (0.20 \\times 0.50) = 0.80$. A score near $1.0$ indicates a nearly perfect positive straight-line relationship."
      ],
      formulas: [
        [ "r = \\frac{\\text{Cov}(X,Y)}{\\sigma_X \\sigma_Y}" ],
        [ "\\text{If Cov}(X,Y) = 0.08, \\sigma_X = 0.20, \\sigma_Y = 0.50:" ],
        [ "r = \\frac{0.08}{(0.20)(0.50)} = \\frac{0.08}{0.10} = 0.80" ],
        null
      ]
    },
    {
      id: 'l11-p2-pearson-limitations',
      title: 'Limits of Pearson Correlation',
      kind: 'rank-correlation',
      visibleParams: [],
      stepTexts: [
        "Despite its immense popularity, Pearson has a massive mathematical flaw: it *only* detects linear straight lines.",
        "For example, let's say Asset X grows linearly: $X = [1, 2, 3, 4, 5]$, while Asset Y explodes exponentially: $Y = [1, 10, 100, 1000, 10000]$.",
        "This relationship is a **perfect, 100% deterministic curve**. If you know X, you know exactly what Y is.",
        "But if you run a standard Pearson correlation on this exponential data, it calculates a correlation of only $r = 0.72$, completely failing to recognize the perfect underlying relationship."
      ],
      formulas: [
        [ "\\text{Linear: } X = [1, 2, 3, 4, 5]" ],
        [ "\\text{Exponential: } Y = [1, 10, 100, 1000, 10000]" ],
        [ "\\text{Actual Relationship: } 100\\% \\text{ Deterministic}" ],
        [ "\\text{Pearson Score: } r = 0.72 \\text{ (Mathematically Fails)}" ]
      ]
    },
    {
      id: 'l11-p3-spearman-rank',
      title: 'Spearman Rank Correlation',
      kind: 'rank-correlation',
      visibleParams: [],
      stepTexts: [
        "To solve this flaw, we use a **Non-Parametric** approach called **Spearman's Rank Correlation**.",
        "Instead of looking at the actual raw numerical values (like $1000$ or $1$), we completely discard them and simply rank them. The smallest Y gets Rank 1, the next gets Rank 2.",
        "Because $Y = [1, 10, 100, 1000, 10000]$ is always increasing, its Ranks are simply $[1, 2, 3, 4, 5]$. Because $X$ is also ranked $[1, 2, 3, 4, 5]$, the Ranked arrays are mathematically identical!",
        "Spearman correlation runs Pearson on these ranks, resulting in a perfect $\\rho = +1.00$. It completely neutralizes the explosive effect of exponential tails."
      ],
      formulas: [
        [ "\\text{Raw } Y = [1, 10, 100, 1000, 10000]" ],
        [ "\\text{Rank } Y = [1, 2, 3, 4, 5]" ],
        [ "\\text{Rank } X = [1, 2, 3, 4, 5]" ],
        [ "\\text{Spearman } \\rho = +1.00 \\text{ (Perfect Score)}" ]
      ]
    },
    {
      id: 'l11-p4-kendall-tau-theory',
      title: 'Kendall\'s Tau',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Another highly robust, non-parametric metric is **Kendall's Tau**. Instead of ranking everything globally, it strictly focuses on Concordant vs Discordant individual pairs.",
        "**Calculation Example:** We select any two pairs of days (Day 1 and Day 2). On Day 1, $X_1 = 5, Y_1 = 10$. On Day 2, $X_2 = 8, Y_2 = 14$.",
        "Since X increased ($5 \\to 8$) AND Y increased ($10 \\to 14$), they moved in the exact same direction. This is mathematically a **Concordant (C)** pair.",
        "If Y had instead crashed to $6$, they moved in opposite directions, making it a **Discordant (D)** pair. Tau aggregates every possible pair."
      ],
      formulas: [
        [ "\\text{Day 1: } (X_1, Y_1) = (5, 10)" ],
        [ "\\text{Day 2: } (X_2, Y_2) = (8, 14)" ],
        [ "\\text{Since } 8 > 5 \\text{ and } 14 > 10 \\implies \\text{Concordant (C)}" ],
        [ "\\tau = \\frac{C - D}{C + D} = \\frac{8 - 2}{8 + 2} = 0.60" ]
      ]
    },
    {
      id: 'l11-p5-tau-vs-rho',
      title: 'When to use which?',
      kind: 'correlation-heatmap',
      visibleParams: [],
      stepTexts: [
        "So we have three distinct mathematical metrics: Pearson, Spearman, and Kendall. Which one should a quantitative researcher actually use in practice?",
        "**Pearson:** Use it strictly when the data is roughly normal, the relationship is perfectly linear, and there are no massive outliers. (This is notoriously rare in real finance!)",
        "**Spearman:** An excellent general-purpose quantitative metric. Use it for non-linear monotonic relationships or when the data has dangerous fat tails. It's incredibly resistant to outliers.",
        "**Kendall's Tau:** Statistically, it is even more mathematically robust than Spearman and converges better for extremely small sample sizes. However, computing every pair is computationally expensive."
      ],
      formulas: [
        null,
        null,
        null,
        null
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
