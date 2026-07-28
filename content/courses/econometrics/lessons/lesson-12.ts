import { Lesson } from '@/content/types';

export const lesson12: Lesson = {
  id: 'lesson-12',
  title: 'Joint Probability and Copula',
  description: 'Understand how Sklar\'s Theorem allows us to bind entirely different marginal distributions together into joint probability structures using Copulas.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.8, u: 1.1, d: 0.9, N: 3, T: 1
  },
  phases: [
    {
      id: 'l12-p1-marginal-vs-joint',
      title: 'Marginals vs Joint Distributions',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In finance, we rarely look at one asset in isolation. A **Marginal Distribution** describes a single asset in isolation. A **Joint Distribution** describes how multiple assets behave together.",
        "For example, Asset X might be a stable bond that typically returns $2.0\\%$ a year. Its marginal distribution is a tight Normal curve.",
        "Asset Y might be a volatile tech stock that typically returns $10.0\\%$ but can crash $-50.0\\%$. Its marginal distribution is a severely fat-tailed Skew-t curve.",
        "Standard correlation math strictly assumes both assets share the exact same distribution family (e.g., both Normal). If we try to violently force Asset Y into a Normal correlation matrix, the math breaks down, and we massively underprice crash risk."
      ],
      formulas: [
        [ "\\text{Marginal } X \\sim \\text{Normal}(\\mu=2.0, \\sigma=1.0)" ],
        [ "\\text{Marginal } Y \\sim \\text{Skew-t}(\\mu=10.0, \\text{Fat Tails})" ],
        [ "\\text{Goal: Joint Probability } \\text{Pr}(X \\le x, Y \\le y)" ],
        null
      ]
    },
    {
      id: 'l12-p2-sklars-theorem',
      title: 'Sklar\'s Theorem & Probability Integral Transform',
      kind: 'copula-plot',
      visibleParams: [],
      stepTexts: [
        "**Sklar's Theorem** offers a brilliant mathematical solution: we completely separate the Marginals from the Correlation mechanism.",
        "Step 1 is the **Probability Integral Transform**. We map every raw return into a pure percentile from 0 to 1.",
        "**Calculation Example:** If Asset X returns $2.0\\%$ and its mean is $2.0\\%$, it sits exactly at the 50th percentile. We mathematically map this to $U = 0.50$.",
        "If Asset Y crashes to $-50.0\\%$, we check its Skew-t CDF. It might sit at the 1st percentile. We map this to $V = 0.01$."
      ],
      formulas: [
        [ "\\text{Transform: } U = F_X(x), V = F_Y(y)" ],
        [ "\\text{Asset X: } x = 2.0\\% \\implies U = 0.50 \\text{ (50th Pctl)}" ],
        [ "\\text{Asset Y: } y = -50.0\\% \\implies V = 0.01 \\text{ (1st Pctl)}" ],
        null
      ]
    },
    {
      id: 'l12-p3-the-copula',
      title: 'The Copula Space',
      kind: 'copula-plot',
      visibleParams: [],
      stepTexts: [
        "By converting all raw returns into percentiles ($U$ and $V$), the resulting square (from 0 to 1 on both axes) is the **Copula Space**.",
        "Because $U$ and $V$ are just pure percentiles, they are completely stripped of their original units and fat tails! They are mathematically clean **Uniform Distributions**.",
        "Sklar's Theorem mathematically proves that we can bind any two random Marginals together using a specialized Copula function $C(U, V)$ inside this clean percentile square.",
        "This means we can model Asset X as Normal, Asset Y as Skew-t, and use the Copula solely to model how they crash together."
      ],
      formulas: [
        [ "U \\sim \\text{Uniform}(0,1), V \\sim \\text{Uniform}(0,1)" ],
        [ "\\text{Sklar's Theorem: } H(x,y) = C(F_X(x), F_Y(y))" ],
        [ "\\text{Where } C(U,V) \\text{ is the mathematical Copula}" ],
        null
      ]
    },
    {
      id: 'l12-p4-gaussian-copula',
      title: 'The Gaussian Copula (And its failure)',
      kind: 'copula-3d',
      visibleParams: [],
      stepTexts: [
        "Different Copula functions model dependency differently. The **Gaussian Copula** strictly assumes dependencies are perfectly symmetric.",
        "For example, it assumes the probability of both assets simultaneously hitting their 99th percentiles ($U=0.99, V=0.99$) is mathematically identical to them both hitting their 1st percentiles ($U=0.01, V=0.01$).",
        "In real financial markets, assets rarely rally $50\\%$ together, but they violently crash $-50\\%$ together! The Gaussian Copula has exactly zero **Tail Dependence**.",
        "This specific math formula infamously caused the 2008 financial crisis, as it systematically underestimated the probability of thousands of mortgages defaulting simultaneously."
      ],
      formulas: [
        [ "\\text{Gaussian Copula: } C_R^{Gauss}(u,v)" ],
        [ "\\text{Assumes: } \\text{Pr}(U=0.01, V=0.01) = \\text{Pr}(U=0.99, V=0.99)" ],
        [ "\\text{Tail Dependence } = 0 \\implies \\text{Underprices Crashes}" ],
        null
      ]
    },
    {
      id: 'l12-p5-archimedean-copulas',
      title: 'Archimedean Copulas',
      kind: 'copula-3d',
      visibleParams: [],
      stepTexts: [
        "To fix this catastrophic flaw, quants use **Archimedean Copulas**, which mathematically capture extreme asymmetry.",
        "The **Clayton Copula** specifically models **Lower Tail Dependence**. If we input our $\\theta$ parameter, the math heavily clusters the probabilities in the bottom-left corner of the Copula square.",
        "This mathematically forces Asset X and Asset Y to crash together, accurately mimicking real-world panic selling.",
        "Conversely, the **Gumbel Copula** models **Upper Tail Dependence**, useful for modeling tech stocks that violently rally upward together."
      ],
      formulas: [
        [ "\\text{Clayton Copula } (\\text{Lower Tail Dependence}):" ],
        [ "C_\\theta(u,v) = \\max\\left(u^{-\\theta} + v^{-\\theta} - 1, 0\\right)^{-1/\\theta}" ],
        [ "\\text{As } \\theta \\to \\infty, \\text{ Lower Tail Dependence } \\lambda_L \\to 1" ],
        null
      ],
      codeSnippet: `import numpy as np
import scipy.stats as stats
import matplotlib.pyplot as plt

# 1. Generate Uniform Marginals (Probability Integral Transform)
# In practice, you'd use empirical CDFs of your stock returns
u = np.random.uniform(0, 1, 1000)

# 2. Simulate a Clayton Copula (Lower Tail Dependence)
# (Using a simplified generator for illustration)
theta = 2.0
v_raw = np.random.uniform(0, 1, 1000)
v = (u**(-theta) * (v_raw**(-theta/(theta+1)) - 1) + 1)**(-1/theta)

plt.scatter(u, v, alpha=0.5, s=10)
plt.title("Clayton Copula (Notice clustering in bottom left)")
plt.xlabel("Asset X (Uniform Marginal)")
plt.ylabel("Asset Y (Uniform Marginal)")
plt.show()`
    }
  ]
};
