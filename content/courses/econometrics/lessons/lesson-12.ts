import { Lesson } from '@/content/types';

export const lesson12: Lesson = {
  id: 'lesson-12',
  title: 'Lesson 12: Joint Probability and Copula',
  description: 'Understand how Sklar\'s Theorem allows us to bind entirely different marginal distributions together into joint probability structures using Copulas.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.8, u: 1.1, d: 0.9, N: 3, T: 1
  },
  phases: [
    {
      id: 'l12-p1-marginal-vs-joint',
      title: 'Phase 1: Marginals vs Joint Distributions',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In finance, we rarely look at one asset in isolation. We look at portfolios. A **Marginal Distribution** describes a single asset in isolation.",
        "A **Joint Distribution** describes how multiple assets behave *together*.",
        "The mathematical problem: If Asset X is normally distributed, but Asset Y has fat tails (Log-Normal), how on earth do we model their correlation?",
        "Standard correlation metrics assume both assets follow the *exact same distribution family*. When they don't, standard models break down spectacularly, especially during market crashes."
      ],
      formulas: [
        [ "\\text{Marginal } X \\sim N(10, 15^2)" ],
        [ "\\text{Marginal } Y \\sim \\text{LogNormal}(20, 25^2)" ],
        [ "\\text{How do we model the joint probability } \\text{Pr}(X \\le x, Y \\le y)?" ]
      ]
    },
    {
      id: 'l12-p2-sklars-theorem',
      title: 'Phase 2: Sklar\'s Theorem & Probability Integral Transform',
      kind: 'copula-plot',
      visibleParams: [],
      stepTexts: [
        "**Sklar's Theorem** offers a brilliant, elegant solution: It proves that we can mathematically separate the Marginal Distributions from the Dependency Structure.",
        "Step 1 is the **Probability Integral Transform**. We map both X and Y onto a Uniform Distribution [0, 1] using their respective Cumulative Distribution Functions (CDFs).",
        "**Calculation Example:** If Asset X returns 5 percent, we use its normal CDF to find its percentile. See the math panel below for the exact numbers.",
        "Watch the visualizer: notice how the raw data points are stripped of their original scales and shapes. We are left with pure, unadulterated dependency!"
      ],
      formulas: [
        [ "\\text{Probability Integral Transform:}" ],
        [ "U = F_X(X) \\implies U \\sim \\text{Uniform}(0,1)" ],
        [ "V = F_Y(Y) \\implies V \\sim \\text{Uniform}(0,1)" ],
        [ "\\text{Example: } X = 0.05, \\mu=0, \\sigma=0.05 \\implies U = 0.8413" ]
      ]
    },
    {
      id: 'l12-p3-the-copula',
      title: 'Phase 3: The Copula Space',
      kind: 'copula-plot',
      visibleParams: [],
      stepTexts: [
        "The resulting square of uniform marginals (from 0 to 1 on both axes) is the **Copula**. It serves as the mathematical 'glue' binding the individual distributions together.",
        "Sklar's Theorem states that ANY joint distribution can be written in terms of its marginals and a Copula function.",
        "This means we can model Asset X as Normal, Asset Y as Log-Normal, and then use a Copula to model the specific way they crash together."
      ],
      formulas: [
        [ "\\text{Sklar's Theorem:}" ],
        [ "H(x,y) = C(F_X(x), F_Y(y))" ],
        [ "\\text{Where } C(u,v) \\text{ is the Copula function}" ]
      ]
    },
    {
      id: 'l12-p4-gaussian-copula',
      title: 'Phase 4: The Gaussian Copula (And its failure)',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Different Copulas model dependency differently. The **Gaussian Copula** uses the dependency structure of a multivariate normal distribution.",
        "It assumes *symmetric* dependence. However, in financial markets, correlation is notoriously asymmetric: assets tend to crash together (high correlation in the left tail) but rally independently (low correlation in the right tail).",
        "The Gaussian Copula infamously failed during the 2008 financial crisis because it lacked 'Tail Dependence'. It systematically underestimated the probability that thousands of mortgages would all default simultaneously."
      ],
      formulas: [
        [ "\\text{Gaussian Copula:}" ],
        [ "C_R^{Gauss}(u,v) = \\Phi_R(\\Phi^{-1}(u), \\Phi^{-1}(v))" ],
        [ "\\text{Tail Dependence } = 0 \\implies \\text{Fails to model crashes.}" ]
      ]
    },
    {
      id: 'l12-p5-archimedean-copulas',
      title: 'Phase 5: Archimedean Copulas',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "To fix this, quants use **Archimedean Copulas**. These functions can capture extreme asymmetry.",
        "The **Clayton Copula** specifically models **Lower Tail Dependence**. It accurately reflects the empirical fact that assets crash together.",
        "The **Gumbel Copula**, conversely, models **Upper Tail Dependence**. It might be used to model the joint probability of two highly viral tech stocks exploding upward simultaneously.",
        "By combining accurate Marginals (like Skew-t) with accurate Copulas (like Clayton), quants can build incredibly robust risk models."
      ],
      formulas: [
        [ "\\text{Clayton Copula } (\\text{Lower Tail Dependence}):" ],
        [ "C_\\theta(u,v) = \\max\\left(u^{-\\theta} + v^{-\\theta} - 1, 0\\right)^{-1/\\theta}" ],
        [ "\\text{As } \\theta \\to \\infty, \\text{ Lower Tail Dependence } \\lambda_L \\to 1" ]
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
