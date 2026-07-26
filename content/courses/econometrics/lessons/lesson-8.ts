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
        "So far, we have focused on **Parametric Models** like OLS. They assume a specific functional form (usually a straight line or a fixed polynomial).",
        "If the true relationship between variables is highly complex, non-linear, or changes across the domain, a parametric model will suffer from severe **Model Misspecification**.",
        "Instead of forcing the data to fit a predetermined equation, we can use **Non-Parametric Regression**, which allows the data to speak for itself and determine the shape of the curve."
      ],
      formulas: [
        [ "\\text{Parametric: } Y = \\beta_0 + \\beta_1 X + \\epsilon" ],
        [ "\\text{Misspecification occurs when true form is complex.}" ],
        [ "\\text{Non-Parametric: } Y = m(X) + \\epsilon" ],
        [ "\\text{Where } m(X) \\text{ is an unspecified smooth function.}" ]
      ]
    },
    {
      id: 'loess-regression',
      title: 'LOESS (Local Polynomial Regression)',
      description: 'Fitting models locally instead of globally.',
      kind: 'loess-plot',
      visibleParams: ['sigma', 'N'],
      stepTexts: [
        "**LOESS** (Locally Estimated Scatterplot Smoothing) is a popular non-parametric technique.",
        "Instead of fitting one global line, LOESS fits multiple simple models (usually linear or quadratic) to localized subsets of the data.",
        "For any target point $x$, LOESS finds its nearest neighbors, assigns higher weights to points closer to $x$, and fits a weighted regression.",
        "Notice the blue LOESS fit curve in the visualizer. It smoothly tracks the underlying non-linear sine wave (red dashed line) despite the noise. Adjust `sigma` (noise) and `N` (sample size) to see how LOESS adapts."
      ],
      formulas: [
        [ "\\text{LOESS = Locally Estimated Scatterplot Smoothing}" ],
        [ "\\text{Fit multiple simple models locally.}" ],
        [ "\\text{Local Weight Function: } w_i(x) = K\\left(\\frac{x_i - x}{h}\\right)" ],
        [ "\\text{Where } K \\text{ is a kernel (like Epanechnikov) and } h \\text{ is the bandwidth.}" ]
      ]
    },
    {
      id: 'bias-variance-tradeoff',
      title: 'The Bias-Variance Tradeoff',
      description: 'Tuning the bandwidth parameter.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "The critical choice in LOESS (and all non-parametric models) is the **Bandwidth** ($h$) or the neighborhood size.",
        "If the bandwidth is too small, the model fits the noise perfectly (High Variance, Overfitting). It looks jagged.",
        "If the bandwidth is too large, the model becomes too rigid and misses the non-linear pattern (High Bias, Underfitting). It looks like a straight line.",
        "Finding the optimal bandwidth is usually done via Cross-Validation to minimize out-of-sample error."
      ],
      formulas: [
        [ "\\text{Bandwidth } (h) \\text{ controls smoothness.}" ],
        [ "\\text{Small } h \\implies \\text{High Variance (Overfitting)}" ],
        [ "\\text{Large } h \\implies \\text{High Bias (Underfitting)}" ],
        [ "\\text{MSE} = \\text{Bias}^2 + \\text{Variance} + \\text{Irreducible Error}" ]
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
        "The most important parameter is `frac`, which dictates the fraction of the data used when estimating each y-value.",
        "A `frac` of 0.2 means each local regression uses 20% of the closest data points.",
        "We can then use `matplotlib` to plot the resulting smoothed curve over the raw scatter data."
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
