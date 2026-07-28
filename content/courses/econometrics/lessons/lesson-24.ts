import { Lesson } from '@/content/types';

export const lesson24: Lesson = {
  id: 'lesson-24',
  title: 'Cointegration and ECM',
  description: 'Learn how Cointegration allows non-stationary variables to move together, and how the Error Correction Model (ECM) captures their mean reversion.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l24-p1-what-is-cointegration',
      title: 'What is Cointegration?',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In our exploration of Unit Root Tests, we learned that non-stationary (Unit Root) variables like stock prices wander aimlessly as random walks.",
        "However, if a *linear combination* of two non-stationary variables is stationary, they are **Cointegrated**.",
        "Think of a dog and its owner walking in a park. Both paths are random and non-stationary. But the *distance between them* (the leash) is stationary and bounded!",
        "**Numeric Example:** If Stock A is $\\$100$ and Stock B is $\\$50$, the spread $A - 2B = 0$. If they wander to $A = \\$120$ and $B = \\$60$, the spread is still $0$. They move together in the long run."
      ],
      formulas: [
        [ "\\text{Given: } y_t \\sim I(1) \\text{ and } x_t \\sim I(1)" ],
        [ "\\text{If } y_t - \\beta x_t = u_t \\text{ where } u_t \\sim I(0)" ],
        [ "\\text{Then } y_t \\text{ and } x_t \\text{ are Cointegrated.}" ]
      ]
    },
    {
      id: 'l24-p2-engle-granger',
      title: 'Engle-Granger Two-Step Method',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "How do we prove two variables are cointegrated? We use the Engle-Granger two-step method.",
        "**Step 1:** Run a simple OLS regression between the variables: $y_t = \\beta x_t + e_t$. Let's say we estimate $\\hat{\\beta} = 2.0$.",
        "**Step 2:** Extract the residuals $\\hat{e}_t = y_t - 2.0 x_t$. These residuals represent the historical 'spread'.",
        "**Step 3:** Run an ADF Unit Root test on the residuals! If the ADF test rejects a unit root, the residuals are stationary. We have proven cointegration!"
      ],
      formulas: [
        [ "\\text{Step 1 Regression: } y_t = \\beta x_t + e_t" ],
        [ "\\text{Step 2 Residuals: } \\hat{e}_t = y_t - \\hat{\\beta} x_t" ],
        [ "\\text{Step 3 ADF Test on } \\hat{e}_t: \\text{Is it Stationary?}" ]
      ]
    },
    {
      id: 'l24-p3-the-ecm',
      title: 'The Error Correction Model (ECM)',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "If two variables are cointegrated, there MUST be a mechanism pulling them back together when they drift apart. This is the **Error Correction Model (ECM)**.",
        "The ECM equation predicts the *change* today ($\\Delta y_t$) based on how wide the spread (the 'error') was yesterday ($e_{t-1}$).",
        "The coefficient for the error term is called the **Speed of Adjustment** ($\\alpha$).",
        "For mean reversion to work, $\\alpha$ MUST be negative. If the spread is too high, a negative $\\alpha$ forces the price to drop today to correct the error."
      ],
      formulas: [
        [ "\\text{ECM Equation:}" ],
        [ "\\Delta y_t = \\alpha e_{t-1} + \\gamma \\Delta x_t + v_t" ],
        [ "\\text{Where } \\alpha \\text{ is the Speed of Adjustment (}\\alpha < 0)" ]
      ]
    },
    {
      id: 'l24-p4-ecm-calculation',
      title: 'ECM Numeric Calculation',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Let's calculate an Error Correction step.",
        "**Numeric Example:** Yesterday, Stock A was $\\$110$ and Stock B was $\\$50$. The long-term relationship is $A = 2B$.",
        "The spread yesterday was $e_{t-1} = 110 - 2(50) = +10$. Stock A was priced $\\$10$ too high relative to B.",
        "Our estimated speed of adjustment $\\alpha = -0.2$.",
        "Today's correction: $\\Delta A_t = -0.2(10) = -2.0$. Stock A will drop by $\\$2.00$ today to begin correcting the overpricing error!"
      ],
      formulas: [
        [ "\\text{Error Yesterday: } e_{t-1} = A_{t-1} - 2 B_{t-1}" ],
        [ "e_{t-1} = 110 - 100 = 10" ],
        [ "\\text{Correction Today: } \\Delta A_t = \\alpha (e_{t-1})" ],
        [ "\\Delta A_t = -0.2(10) = -2.0" ]
      ],
      codeSnippet: `import numpy as np
import statsmodels.api as sm
from statsmodels.tsa.stattools import adfuller

# Simulate Cointegrated Data
np.random.seed(42)
B = np.cumsum(np.random.normal(0, 1, 500)) # Random Walk
error = np.random.normal(0, 1, 500)        # Stationary noise
A = 2.0 * B + error                        # Cointegrated!

# Step 1: OLS Regression
X = sm.add_constant(B)
model = sm.OLS(A, X).fit()
beta = model.params[1]
print(f"Estimated Beta: {beta:.3f}")

# Step 2: Extract Residuals
residuals = model.resid

# Step 3: ADF Test on Residuals
adf_result = adfuller(residuals)
print(f"ADF Stat: {adf_result[0]:.3f}, p-value: {adf_result[1]:.4f}")
if adf_result[1] < 0.05:
    print("Residuals are stationary. A and B are Cointegrated!")`
    }
  ]
};
