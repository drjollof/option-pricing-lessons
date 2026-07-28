import { Lesson } from '@/content/types';

export const lesson28: Lesson = {
  id: 'lesson-28',
  title: 'Granger Causality',
  description: 'Explore how to test if one time series is useful in forecasting another using Granger Causality and F-tests.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l28-p1-granger-intuition',
      title: 'What is Granger Causality?',
      kind: 'granger-causality',
      visibleParams: [],
      stepTexts: [
        "First, a warning: **Granger Causality is NOT true philosophical causality.** Just because roosters crow before the sun rises doesn't mean roosters *cause* the sun to rise.",
        "Granger Causality is actually **Predictive Causality**.",
        "If past values of $X$ help predict current values of $Y$ *better* than just using past values of $Y$ alone, we say that '$X$ Granger-causes $Y$'.",
        "For example, if knowing yesterday's Interest Rates helps predict today's Inflation better than just looking at yesterday's Inflation, Rates Granger-cause Inflation."
      ],
      formulas: [
        [ "\\text{True Causality: } X \\rightarrow Y" ],
        [ "\\text{Granger Causality: Past } X \\text{ predicts } Y" ]
      ]
    },
    {
      id: 'l28-p2-restricted-model',
      title: 'The Restricted Model',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "To test for Granger Causality, we build two models.",
        "The first is the **Restricted Model**. We try to predict $Y$ using ONLY its own past values (an Autoregressive model).",
        "We calculate the Sum of Squared Residuals ($SSR_{\\text{restricted}}$) to measure how much error this model makes.",
        "Think of this as the baseline: how well can $Y$ predict itself?"
      ],
      formulas: [
        [ "\\text{Restricted Model:}" ],
        [ "Y_t = c + \\alpha_1 Y_{t-1} + \\alpha_2 Y_{t-2} + \\dots + \\epsilon_t" ]
      ]
    },
    {
      id: 'l28-p3-unrestricted-model',
      title: 'The Unrestricted Model',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Next, we build the **Unrestricted Model**. We add the past values of our suspect variable $X$ to the regression.",
        "We then calculate the new error, the $SSR_{\\text{unrestricted}}$.",
        "Because we added more variables, the Unrestricted SSR will always be lower (or equal). The question is: is it *significantly* lower?"
      ],
      formulas: [
        [ "\\text{Unrestricted Model:}" ],
        [ "Y_t = c + \\alpha Y_{t-1} + \\dots + \\beta_1 X_{t-1} + \\beta_2 X_{t-2} + \\dots + u_t" ]
      ]
    },
    {
      id: 'l28-p4-f-test',
      title: 'The F-Test for Causality',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "We use an **F-Test** to compare the two models.",
        "The **Null Hypothesis ($H_0$)** is that all the $\\beta$ coefficients for $X$ are exactly zero. (Meaning $X$ provides zero extra predictive power).",
        "**Numeric Example:** We run the models and get an F-statistic of $6.24$. The p-value is $0.012$.",
        "Because $p < 0.05$, we strongly reject the null hypothesis! We conclude that the past values of $X$ provide statistically significant predictive power for $Y$. $X$ Granger-causes $Y$!"
      ],
      formulas: [
        [ "H_0: \\beta_1 = \\beta_2 = \\dots = 0 \\quad (X \\text{ does not Granger-cause } Y)" ],
        [ "\\text{F-Stat} = \\frac{(SSR_{\\text{restricted}} - SSR_{\\text{unrestricted}}) / p}{SSR_{\\text{unrestricted}} / (n - 2p - 1)}" ],
        [ "\\text{If } p\\text{-value} < 0.05 \\implies \\text{Reject } H_0" ]
      ],
      codeSnippet: `import numpy as np
import pandas as pd
from statsmodels.tsa.stattools import grangercausalitytests

# Simulate Data where X Granger-causes Y
np.random.seed(42)
X = np.random.normal(0, 1, 500)
Y = np.zeros(500)

for t in range(1, 500):
    # Y depends on its own past AND the past of X!
    Y[t] = 0.5 * Y[t-1] + 0.8 * X[t-1] + np.random.normal(0, 0.5)

df = pd.DataFrame({'Y': Y, 'X': X})

# Run Granger Causality Test (testing if X causes Y)
# The function expects data in [Y, X] format.
print("Testing if X Granger-causes Y:")
# maxlag=2 checks up to 2 past lags
results = grangercausalitytests(df[['Y', 'X']], maxlag=[2])

# You will see the F-test p-value is extremely small (< 0.05),
# proving that X successfully Granger-causes Y in our simulation.`
    }
  ]
};
