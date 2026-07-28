import { Lesson } from '@/content/types';

export const lesson13: Lesson = {
  id: 'lesson-13',
  title: 'Time Series and Autocorrelation',
  description: 'Understand the properties of time series data and learn how to quantify memory using Autocovariance, ACF, and PACF.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l13-p1-characteristics',
      title: 'Characteristics of Time Series',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "A **Time Series** is a sequence of data points strictly indexed in chronological order.",
        "For example, if an asset trades at 60,000 dollars on Monday, 65,000 dollars on Tuesday, and 70,000 dollars on Wednesday, that exact sequence matters. You cannot randomly shuffle the days.",
        "Financial time series are notoriously difficult to model because they violate the standard statistical assumption of independence.",
        "Because today's 65,000 dollar price is heavily dependent on yesterday's 60,000 dollar price, we must use specialized mathematical tools to measure this 'memory'."
      ],
      formulas: [
        [ "\\text{General Time Series Model:}" ],
        [ "Y_t = T_t + S_t + C_t + \\epsilon_t" ],
        [ "\\text{Where } T_t = \\text{Trend, } S_t = \\text{Seasonality, } C_t = \\text{Cycle, } \\epsilon_t = \\text{Noise}" ],
        null
      ]
    },
    {
      id: 'l13-p2-autocovariance',
      title: 'Autocovariance & ACF',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "To measure memory, we calculate the correlation of the series *with itself* at different time lags. This is the **Autocorrelation Function (ACF)**.",
        "**Calculation Example:** We have 4 days of returns: $X = [2\\%, -1\\%, 3\\%, 0\\%]$. The mean is exactly $1\\%$.",
        "To find the Lag-1 Autocovariance, we pair today's return with yesterday's return, and multiply their deviations from the mean.",
        "For Day 2 vs Day 1: $(-1\\% - 1\\%) \\times (2\\% - 1\\%) = -2 \\times 1 = -2.0$. We sum these up for all days. See the exact calculation below."
      ],
      formulas: [
        [ "\\text{Autocovariance at lag } k:" ],
        [ "\\gamma_k = \\text{Cov}(X_t, X_{t-k}) = E[(X_t - \\mu)(X_{t-k} - \\mu)]" ],
        [ "\\text{Data: } X = [2, -1, 3, 0], \\mu = 1" ],
        [ "\\gamma_1 = \\frac{(-2 \\times 1) + (2 \\times -2) + (-1 \\times 2)}{4} = -2.0" ]
      ]
    },
    {
      id: 'l13-p3-pacf',
      title: 'Partial Autocorrelation (PACF)',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "The standard ACF has a major mathematical flaw: it includes both *direct* and *indirect* effects.",
        "**Calculation Concept:** Suppose an earnings shock causes a $10\\%$ return on Day 1. This momentum directly causes a $5\\%$ return on Day 2, and Day 2's momentum causes a $2.5\\%$ return on Day 3.",
        "The standard ACF will erroneously show a strong correlation between Day 1 and Day 3, even though the effect was entirely indirect via Day 2.",
        "The **PACF** mathematically subtracts out the $5\\%$ intermediate effect of Day 2, accurately revealing that the pure, direct correlation between Day 1 and Day 3 is exactly $0.00$."
      ],
      formulas: [
        [ "\\text{PACF } (\\phi_{kk}) \\text{ isolates the pure direct effect.}" ],
        [ "\\text{Multiple Regression: } X_t = \\alpha + \\phi_{k1}X_{t-1} + \\dots + \\phi_{kk}X_{t-k} + \\epsilon_t" ],
        [ "\\phi_{kk} \\text{ is the pure PACF coefficient for lag } k" ],
        null
      ]
    },
    {
      id: 'l13-p4-stationarity',
      title: 'Stationarity',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "For ACF and PACF to be mathematically valid over time, the time series must be **Stationary**.",
        "**Weak Stationarity** requires three things: the Mean is constant, the Variance is constant, and the Autocovariance depends *only* on the lag length.",
        "Attempting to calculate a single, global historical mean when an asset has trended from 10 dollars to 500 dollars is mathematically meaningless.",
        "Likewise, if an asset's daily volatility is normally $1\\%$, but explodes to $10\\%$ during a market crash, the variance is not constant. It is strictly non-stationary!"
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
      title: 'Reading a Correlogram',
      kind: 'correlogram',
      visibleParams: [],
      overrideParams: { u: 1 }, // AR(1) pattern
      stepTexts: [
        "We visualize ACF and PACF using a **Correlogram**. The 'stems' show the exact correlation value at each lag.",
        "The blue shaded region represents the $95\\%$ confidence interval. If a stem mathematically pokes outside this band, the correlation is statistically significant.",
        "Look at the visualization. The ACF stems (purple) decay slowly and exponentially: Lag 1 is $0.80$, Lag 2 is $0.64$, Lag 3 is $0.51$.",
        "The PACF stems (green) have one massive spike at Lag 1 ($0.80$), and all subsequent lags instantly collapse to exactly $0.00$. This distinct pattern is the exact signature of an AR(1) model!"
      ],
      formulas: [
        [ "\\text{Confidence Interval } \\approx \\pm \\frac{1.96}{\\sqrt{N}}" ],
        [ "\\text{If stem } > \\text{ CI band } \\implies \\text{Statistically Significant}" ],
        [ "\\text{Signature: ACF tails off, PACF cuts off at lag } p" ],
        null
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
