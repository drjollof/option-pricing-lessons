import { Lesson } from '../../../types';

export const lesson8: Lesson = {
  id: 'lesson-8',
  title: 'Non-Parametric Regression (LOESS)',
  description: 'Moving beyond straight lines: learning to fit flexible, local curves to complex data structures without assuming a functional form.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, T: 1, N: 50, u: 1.1, d: 0.9
  },
  phases: [
    {
      id: 'parametric-limitations',
      title: 'The Limits of Parametric Models',
      description: 'Why straight lines aren\'t always enough.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Suppose we are tracking inflation ($Y$) across decades ($X$). In the 1970s, it spikes to $14\\%$. In the 1990s, it drops to $2\\%$. In the 2020s, it spikes back to $8\\%$.",
        "If we use OLS, it tries to fit a single straight line through this massive wave. It might calculate a flat average slope, predicting inflation is always around $4.5\\%$.",
        "This flat line is a catastrophic **Model Misspecification**. By imposing a rigid straight line, it completely misses the massive $14\\%$ and $2\\%$ extremes.",
        "The model is mathematically blind to curves. It generates massive prediction errors (e.g., predicting $4.5\\%$ when the reality is $14\\%$)."
      ],
      formulas: [
        [ "\\text{Data: } Y = [14, 2, 8]" ],
        [ "\\text{OLS Model: } \\hat{Y} = 4.0 + 0.05X" ],
        [ "\\text{Error in 1970s: } 14.0 - 4.5 = 9.5\\%" ],
        null
      ]
    },
    {
      id: 'loess-regression',
      title: 'LOESS (Local Polynomial Regression)',
      description: 'Fitting models locally instead of globally.',
      kind: 'loess-plot',
      visibleParams: [],
      stepTexts: [
        "**LOESS** solves this by refusing to fit a single global equation. Instead, it slides across the data and fits thousands of tiny, localized regressions.",
        "Let's predict inflation for 1975. LOESS grabs only the closest data points (e.g., 1972 through 1978). It completely ignores data from the 1990s and 2020s, mathematically assigning them a weight of exactly $0.0$.",
        "It fits a mini-regression on just that 1970s cluster, calculating a localized prediction of $13.5\\%$, successfully capturing the macroeconomic spike.",
        "Notice the blue LOESS fit curve in the visualizer dynamically bending and flexing to capture every turn in the data without assuming a global shape."
      ],
      formulas: [
        [ "\\text{Target: } X = 1975" ],
        [ "\\text{Weight}(1974) = 0.95, \\quad \\text{Weight}(1995) = 0.00" ],
        [ "\\text{Local Prediction } \\hat{Y} = 13.5\\%" ],
        null
      ]
    },
    {
      id: 'bias-variance-tradeoff',
      title: 'The Bias-Variance Tradeoff',
      description: 'Tuning the bandwidth parameter.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "The critical mathematical parameter in LOESS is the **Bandwidth** (or `frac`), which dictates exactly what percentage of points are included in the local neighborhood.",
        "If we set `frac = 0.01`, LOESS only looks at 1% of the data. The curve violently spikes up and down, perfectly memorizing the random daily noise. This is severe **Overfitting** (High Variance).",
        "If we set `frac = 1.0`, LOESS uses 100% of the data for every prediction. The math literally reverts back into a rigid OLS flat line. This is severe **Underfitting** (High Bias).",
        "In algorithmic trading, Quants computationally optimize this Bandwidth using Cross-Validation, searching for the exact decimal that balances the curve."
      ],
      formulas: [
        [ "\\text{frac = 0.01 } \\implies \\text{Overfit (Memorizes Noise)}" ],
        [ "\\text{frac = 1.00 } \\implies \\text{Underfit (Reverts to OLS)}" ],
        [ "\\text{MSE} = \\text{Bias}^2 + \\text{Variance} + \\sigma^2" ],
        null
      ]
    },
    {
      id: 'code-implementation-8',
      title: 'Python Implementation',
      description: 'Fitting LOESS using statsmodels.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In Python, we can easily fit a LOESS curve using `statsmodels.nonparametric.smoothers_lowess`.",
        "The most important parameter is `frac`, which dictates the fraction of the data used when estimating each localized y-value.",
        "A `frac` of 0.2 means each local regression calculates its curve using exactly 20% of the closest data points.",
        "We can then use `matplotlib` to plot the resulting smoothed curve over the raw scatter data to visually verify the fit."
      ],
      codeSnippet: `import numpy as np
import matplotlib.pyplot as plt
from statsmodels.nonparametric.smoothers_lowess import lowess

# X and Y are our data arrays
# frac controls the bandwidth (0 to 1)

# Fit LOESS
# Returns a 2D array where col 0 is sorted X, col 1 is smoothed Y
smoothed = lowess(Y, X, frac=0.2)

# Plotting
plt.scatter(X, Y, alpha=0.5, label='Raw Data')
plt.plot(smoothed[:, 0], smoothed[:, 1], 'r-', linewidth=3, label='LOESS Curve')
plt.title('LOESS Smoothing')
plt.legend()
plt.show()`
    }
  ]
};
