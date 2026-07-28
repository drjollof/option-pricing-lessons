import { Lesson } from '@/content/types';

export const lesson22: Lesson = {
  id: 'lesson-22',
  title: 'Unit Root Tests',
  description: 'Learn how to statistically test if a time series is stationary or contains a unit root using the Dickey-Fuller and KPSS tests.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l22-p1-what-is-unit-root',
      title: 'What is a Unit Root?',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In an Autoregressive AR(1) model, today's value depends on yesterday's value: $y_t = \\phi y_{t-1} + \\epsilon_t$.",
        "If the coefficient $\\phi = 1$, the series is a Random Walk. It wanders aimlessly, its variance grows infinitely, and it never reverts to a mean. This $\\phi=1$ condition is called a **Unit Root**.",
        "If $\\phi < 1$ (for example, $\\phi = 0.8$), the series is **Stationary**. Shocks eventually die out, and the series is pulled back toward its mean.",
        "Most financial models require stationary data to avoid 'spurious regressions', making it critical to test for unit roots!"
      ],
      formulas: [
        [ "\\text{AR(1) Model: } y_t = \\phi y_{t-1} + \\epsilon_t" ],
        [ "\\text{If } \\phi = 1 \\implies \\text{Unit Root (Non-Stationary)}" ],
        [ "\\text{If } |\\phi| < 1 \\implies \\text{Stationary}" ]
      ]
    },
    {
      id: 'l22-p2-dickey-fuller',
      title: 'The Dickey-Fuller Test',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "To statistically test if $\\phi = 1$, David Dickey and Wayne Fuller proposed a clever algebraic trick. Subtract $y_{t-1}$ from both sides of the AR(1) equation.",
        "This gives us $\\Delta y_t = (\\phi - 1) y_{t-1} + \\epsilon_t$. We define $\\gamma = (\\phi - 1)$.",
        "If the true series has a unit root ($\\phi = 1$), then $\\gamma$ must be exactly $0$. Our Null Hypothesis is that $\\gamma = 0$.",
        "We run an OLS regression. If our estimated $\\hat{\\gamma}$ is significantly negative (e.g., $\\hat{\\gamma} = -0.15$), we confidently reject the null hypothesis and conclude the series is stationary!"
      ],
      formulas: [
        [ "\\text{Subtract } y_{t-1}: \\quad y_t - y_{t-1} = \\phi y_{t-1} - y_{t-1} + \\epsilon_t" ],
        [ "\\Delta y_t = (\\phi - 1) y_{t-1} + \\epsilon_t" ],
        [ "\\text{Let } \\gamma = \\phi - 1. \\quad \\text{Regression: } \\Delta y_t = \\gamma y_{t-1} + \\epsilon_t" ],
        [ "\\text{Null Hypothesis (Unit Root): } \\gamma = 0" ],
        [ "\\text{Alternative (Stationary): } \\gamma < 0" ]
      ]
    },
    {
      id: 'l22-p3-adf-test',
      title: 'Augmented Dickey-Fuller (ADF)',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "The basic Dickey-Fuller test assumes the error terms $\\epsilon_t$ are perfectly independent (White Noise). In real financial data, there is often leftover autocorrelation.",
        "The **Augmented Dickey-Fuller (ADF)** test fixes this by adding lagged differences ($\\Delta y_{t-1}, \\Delta y_{t-2}$) into the regression.",
        "These extra terms 'soak up' the autocorrelation, ensuring the test on our main parameter $\\gamma$ remains statistically valid.",
        "**Numeric Example:** We run an ADF test and get a t-statistic of $-3.40$. The critical threshold for $95\\%$ confidence is $-2.86$. Because $-3.40$ is more negative than $-2.86$, we reject the Unit Root!"
      ],
      formulas: [
        [ "\\text{ADF Regression:}" ],
        [ "\\Delta y_t = c + \\delta t + \\gamma y_{t-1} + \\sum_{i=1}^{p} \\beta_i \\Delta y_{t-i} + \\epsilon_t" ],
        [ "\\text{If } t\\text{-stat } (\\gamma) < \\text{Critical Value} \\implies \\text{Reject Null}" ],
        [ "-3.40 < -2.86 \\implies \\text{Stationary!}" ]
      ]
    },
    {
      id: 'l22-p4-kpss-test',
      title: 'The KPSS Confirmatory Test',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "The ADF test assumes there IS a unit root until proven otherwise. Sometimes, tests lack statistical power and fail to reject the null, leaving us uncertain.",
        "The **KPSS Test** does the exact opposite: its Null Hypothesis is that the series IS Stationary.",
        "Econometricians use them together for **Confirmatory Analysis**.",
        "**Numeric Example:** If ADF rejects the unit root ($p = 0.02$) AND the KPSS test fails to reject stationarity ($p = 0.45$), we have massive confidence that our data is safe to use in a stationary model!"
      ],
      formulas: [
        [ "\\text{ADF Null: Data has a Unit Root}" ],
        [ "\\text{KPSS Null: Data is Stationary}" ],
        [ "\\text{Ideal Scenario: Reject ADF Null, Fail to reject KPSS Null.}" ]
      ],
      codeSnippet: `import numpy as np
from statsmodels.tsa.stattools import adfuller, kpss

# Simulate a stationary AR(1) process
np.random.seed(42)
y = np.zeros(500)
for t in range(1, 500):
    y[t] = 0.8 * y[t-1] + np.random.normal(0, 1) # phi = 0.8

# 1. ADF Test (Null: Unit Root)
adf_result = adfuller(y)
print(f"ADF Statistic: {adf_result[0]:.3f}")
print(f"ADF p-value: {adf_result[1]:.4f}") # Should be < 0.05

# 2. KPSS Test (Null: Stationary)
# (Warning: p-values are often interpolated, hence ignoring warnings in prod)
kpss_result = kpss(y, regression='c', nlags='auto')
print(f"KPSS Statistic: {kpss_result[0]:.3f}")
print(f"KPSS p-value: {kpss_result[1]:.4f}") # Should be > 0.05`
    }
  ]
};
