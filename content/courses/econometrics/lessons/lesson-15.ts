import { Lesson } from '@/content/types';

export const lesson15: Lesson = {
  id: 'lesson-15',
  title: 'Lesson 15: Autoregressive Model',
  description: 'Learn how to model time series data by regressing a variable against its own past values, and understand the critical constraints for stationarity.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l15-p1-ar-theory',
      title: 'Phase 1: The Autoregressive AR(p) Model',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "While an MA model predicts today using past *errors*, an **Autoregressive (AR)** model predicts today using past *values*.",
        "It is exactly like standard OLS linear regression, except instead of using exogenous variables (like interest rates or GDP), you are regressing the stock price against its own historical lags.",
        "**Calculation Example:** Consider an AR(1) model. If we know yesterday's price and today's shock, we can calculate today's final price.",
        "Review the math panel below for the exact manual calculation."
      ],
      formulas: [
        [ "\\text{AR}(p) \\text{ Model:}" ],
        [ "Y_t = c + \\phi_1 Y_{t-1} + \\phi_2 Y_{t-2} + \\dots + \\phi_p Y_{t-p} + \\epsilon_t" ],
        [ "\\text{Example AR(1) Calculation:}" ],
        [ "\\text{Given } c = 0.5, \\phi_1 = 0.8, Y_{t-1} = 10, \\epsilon_t = 1.5" ],
        [ "Y_t = 0.5 + 0.8(10) + 1.5 = 10" ]
      ]
    },
    {
      id: 'l15-p2-stationarity',
      title: 'Phase 2: Stationarity Constraints',
      kind: 'stochastic-path',
      visibleParams: [],
      overrideParams: { u: 4 }, // AR(1) mode
      stepTexts: [
        "For an AR(1) process to be mathematically valid (stationary), the coefficient for the first lag must fall strictly between -1 and 1.",
        "Why? Imagine if the coefficient was 1.2. The values would compound on each other and explode to infinity! This violates the constant variance requirement of stationarity.",
        "Look at the visualizer. Because we set the coefficient to 0.8, the path wanders around, but whenever it gets too high, the fractional multiplier shrinks it back down toward the mean on the next step. This is **Mean Reversion**."
      ],
      formulas: [
        [ "\\text{Stationarity Constraint for AR(1): } |\\phi_1| < 1" ],
        [ "\\text{If } \\phi_1 = 1 \\implies \\text{Random Walk (Non-stationary)}" ],
        [ "\\text{Unconditional Mean: } E(Y_t) = \\frac{c}{1 - \\phi_1}" ],
        [ "\\text{Example: } E(Y_t) = \\frac{0.5}{1 - 0.8} = \\frac{0.5}{0.2} = 2.5" ]
      ]
    },
    {
      id: 'l15-p3-invertibility',
      title: 'Phase 3: AR/MA Invertibility',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Through iterative mathematical substitution, any stationary AR(1) process can be rewritten as an MA process with infinite lags.",
        "Conversely, any invertible MA(1) process can be rewritten as an AR process with infinite lags.",
        "**Mathematical Proof Step-by-Step:** We can recursively substitute the lagged equation into itself.",
        "Check the LaTeX panel below for the formal derivation proving how the AR process transforms into an infinite sum of past errors."
      ],
      formulas: [
        [ "\\text{Start: } Y_t = \\phi Y_{t-1} + \\epsilon_t" ],
        [ "\\text{Substitute } Y_{t-1}: Y_{t-1} = \\phi Y_{t-2} + \\epsilon_{t-1}" ],
        [ "Y_t = \\phi (\\phi Y_{t-2} + \\epsilon_{t-1}) + \\epsilon_t" ],
        [ "Y_t = \\phi^2 Y_{t-2} + \\phi \\epsilon_{t-1} + \\epsilon_t" ],
        [ "Y_t = \\epsilon_t + \\phi \\epsilon_{t-1} + \\phi^2 \\epsilon_{t-2} + \\phi^3 \\epsilon_{t-3} + \\dots" ],
        [ "\\text{Because } |\\phi| < 1, \\text{ the influence of ancient errors decays to zero.}" ]
      ]
    },
    {
      id: 'l15-p4-yule-walker',
      title: 'Phase 4: Yule-Walker Estimators',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "How do we actually find the coefficients using historical data? We use the **Yule-Walker Equations**, which perfectly map the empirical autocorrelations to the theoretical AR parameters.",
        "**Calculation Example:** We want to fit an AR(2) model. We measure the data and find Lag-1 ACF and Lag-2 ACF.",
        "We set up a system of linear equations using these autocorrelations. See the math console for the full matrix calculation resolving the exact values of the coefficients."
      ],
      formulas: [
        [ "\\begin{bmatrix} \\rho_1 \\\\ \\rho_2 \\end{bmatrix} = \\begin{bmatrix} 1 & \\rho_1 \\\\ \\rho_1 & 1 \\end{bmatrix} \\begin{bmatrix} \\phi_1 \\\\ \\phi_2 \\end{bmatrix}" ],
        [ "\\text{Example: } \\rho_1 = 0.5, \\rho_2 = 0.2" ],
        [ "\\phi_1 = \\frac{\\rho_1 (1 - \\rho_2)}{1 - \\rho_1^2} = \\frac{0.5(1 - 0.2)}{1 - 0.25} = \\frac{0.40}{0.75} = 0.533" ],
        [ "\\phi_2 = \\frac{\\rho_2 - \\rho_1^2}{1 - \\rho_1^2} = \\frac{0.2 - 0.25}{1 - 0.25} = \\frac{-0.05}{0.75} = -0.066" ]
      ]
    },
    {
      id: 'l15-p5-acf-pacf-signatures',
      title: 'Phase 5: Reading AR/MA Signatures',
      kind: 'arima-signature',
      visibleParams: [],
      stepTexts: [
        "How do we know whether to use an AR or MA model just by looking at the data? We check the ACF and PACF plots for their **Signatures**.",
        "**Rule 1:** An MA model will have its ACF 'cut off' completely after lag q, while its PACF tails off gradually.",
        "**Rule 2:** An AR model behaves exactly the opposite! Its PACF 'cuts off' completely after lag p, while its ACF tails off gradually.",
        "Look at the visualizer. By scanning the PACF plot for the AR model, we see it goes entirely to zero after lag 1. That's our visual proof that we should build an AR(1) model!"
      ],
      formulas: [
        [ "\\text{AR}(p): \\text{ ACF Tails off, PACF Cuts off after lag } p" ],
        [ "\\text{MA}(q): \\text{ ACF Cuts off after lag } q, \\text{ PACF Tails off}" ]
      ],
      codeSnippet: `import numpy as np
from statsmodels.tsa.arima_process import ArmaProcess
from statsmodels.regression.linear_model import yule_walker

# 1. Simulate an AR(2) process
# Note: statsmodels requires AR coefficients to have inverted signs
ar2_process = ArmaProcess(ar=[1, -0.533, 0.066], ma=[1])
ar2_data = ar2_process.generate_sample(nsample=1000)

# 2. Estimate coefficients using Yule-Walker Equations
rho, sigma = yule_walker(ar2_data, order=2, method="mle")

print(f"True AR(1): 0.533 | Estimated AR(1): {rho[0]:.4f}")
print(f"True AR(2): -0.066 | Estimated AR(2): {rho[1]:.4f}")`
    }
  ]
};
