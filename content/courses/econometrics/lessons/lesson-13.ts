import { Lesson } from '@/content/types';

export const lesson13: Lesson = {
  id: 'lesson-13',
  title: 'Lesson 13: Time Series and Autocorrelation',
  description: 'Understand the properties of time series data and learn how to quantify memory using Autocovariance, ACF, and PACF.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l13-p1-characteristics',
      title: 'Phase 1: Characteristics of Time Series',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "A **Time Series** is a sequence of data points indexed in time order. Unlike cross-sectional data (like the heights of 100 people at one moment), time series data has an inherent ordering.",
        "Financial time series are notoriously difficult to model because they violate the standard statistical assumption of independence.",
        "They frequently exhibit **Trends** (long-term directional movement), **Seasonality** (repeating cycles), and **Volatility Clustering** (large changes tend to be followed by large changes).",
        "Because today's price is heavily dependent on yesterday's price, we must use specialized mathematical tools to measure this 'memory'."
      ],
      formulas: [
        [ "\\text{General Time Series Model:}" ],
        [ "Y_t = T_t + S_t + C_t + \\epsilon_t" ],
        [ "\\text{Where } T_t = \\text{Trend, } S_t = \\text{Seasonality, } C_t = \\text{Cycle, } \\epsilon_t = \\text{Noise}" ]
      ]
    },
    {
      id: 'l13-p2-autocovariance',
      title: 'Phase 2: Autocovariance & ACF',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "To measure memory, we calculate the correlation of the series *with itself* at different time lags. This is the **Autocorrelation Function (ACF)**.",
        "**Calculation Example:** Let's find the Lag-1 Autocovariance of a 4-day return series.",
        "We pair today's return with yesterday's return, and then multiply their deviations from the mean.",
        "Check the LaTeX panel below for the exact manual calculation of Autocovariance at Lag 1."
      ],
      formulas: [
        [ "\\text{Autocovariance at lag } k:" ],
        [ "\\gamma_k = \\text{Cov}(X_t, X_{t-k}) = E[(X_t - \\mu)(X_{t-k} - \\mu)]" ],
        [ "\\text{Example Data: } X = [2, -1, 3, 0], \\mu = 1" ],
        [ "\\gamma_1 = \\frac{(-2 \\times 1) + (2 \\times -2) + (-1 \\times 2)}{4}" ],
        [ "\\gamma_1 = \\frac{-2 - 4 - 2}{4} = \\frac{-8}{4} = -2.0" ],
        [ "\\text{Autocorrelation (ACF) at lag } k: \\rho_k = \\frac{\\gamma_k}{\\gamma_0}" ]
      ]
    },
    {
      id: 'l13-p3-pacf',
      title: 'Phase 3: Partial Autocorrelation (PACF)',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "The standard ACF has a flaw: it includes both *direct* and *indirect* effects. If yesterday affects today, and the day before affected yesterday, then the ACF will show a correlation between the day before and today, even if there is no direct link!",
        "The **Partial Autocorrelation Function (PACF)** isolates the pure, direct effect of a lag on today, mathematically removing the influence of all intermediate lags.",
        "**Calculation Concept:** To find the PACF at lag 2, we run a multiple regression predicting today's value using the past two days. The coefficient for the second lag is the PACF!"
      ],
      formulas: [
        [ "\\text{PACF } (\\phi_{kk}) \\text{ is the correlation of } X_t \\text{ and } X_{t-k}" ],
        [ "\\text{conditional on } X_{t-1}, X_{t-2}, \\dots, X_{t-k+1}" ],
        [ "\\text{Multiple Regression: } X_t = \\alpha + \\phi_{k1}X_{t-1} + \\dots + \\phi_{kk}X_{t-k} + \\epsilon_t" ]
      ]
    },
    {
      id: 'l13-p4-stationarity',
      title: 'Phase 4: Stationarity',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "For ACF and PACF to be mathematically valid over time, the time series must be **Stationary**.",
        "**Strict Stationarity** means the entire joint probability distribution never changes over time. This is almost impossible to find in real financial data.",
        "**Weak Stationarity** (or Covariance Stationarity) is the practical standard. It requires three things: the Mean is constant, the Variance is constant, and the Autocovariance depends *only* on the lag, not on the actual time.",
        "If a stock's volatility is exploding during a market crash, the variance is not constant, so it is non-stationary!"
      ],
      formulas: [
        [ "\\text{Weak Stationarity Requirements:}" ],
        [ "1. \\quad E(X_t) = \\mu \\quad (\\text{Constant Mean})" ],
        [ "2. \\quad \\text{Var}(X_t) = \\sigma^2 \\quad (\\text{Constant Variance})" ],
        [ "3. \\quad \\text{Cov}(X_t, X_{t-k}) = \\gamma_k \\quad (\\text{Constant Autocovariance})" ]
      ]
    },
    {
      id: 'l13-p5-correlogram',
      title: 'Phase 5: Reading a Correlogram',
      kind: 'correlogram',
      visibleParams: [],
      overrideParams: { u: 1 }, // AR(1) pattern
      stepTexts: [
        "We visualize ACF and PACF using a **Correlogram**. The 'stems' show the correlation value at each lag.",
        "The blue shaded region represents the 95 percent confidence interval. If a stem pokes outside this band, the correlation is statistically significant.",
        "Look at the visualization. The ACF stems (purple) decay slowly and exponentially. The PACF stems (green) have one massive spike at Lag 1, and the rest instantly cut off to near zero.",
        "This distinct pattern (ACF tails off, PACF cuts off) is the exact mathematical signature of an Autoregressive AR(1) model!"
      ],
      formulas: [
        [ "\\text{Confidence Interval } \\approx \\pm \\frac{1.96}{\\sqrt{N}}" ],
        [ "\\text{If stem } > \\text{ CI band } \\implies \\text{Statistically Significant}" ],
        [ "\\text{Signature: ACF tails off, PACF cuts off at lag } p" ]
      ],
      codeSnippet: `import numpy as np
import pandas as pd
from statsmodels.tsa.stattools import acf, pacf
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
import matplotlib.pyplot as plt

# Generate simulated AR(1) data
np.random.seed(42)
ar1_data = np.zeros(500)
for t in range(1, 500):
    ar1_data[t] = 0.8 * ar1_data[t-1] + np.random.normal(0, 1)

# Calculate ACF and PACF numerically
acf_values = acf(ar1_data, nlags=10)
pacf_values = pacf(ar1_data, nlags=10)
print(f"Lag-1 ACF: {acf_values[1]:.4f}")
print(f"Lag-1 PACF: {pacf_values[1]:.4f}")

# Plot Correlograms
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
plot_acf(ar1_data, lags=20, ax=axes[0], title="ACF (Tails off)")
plot_pacf(ar1_data, lags=20, ax=axes[1], title="PACF (Cuts off)")
plt.show()`
    }
  ]
};
