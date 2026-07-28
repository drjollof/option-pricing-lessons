import { Lesson } from '@/content/types';

export const lesson18: Lesson = {
  id: 'lesson-18',
  title: 'GARCH Model',
  description: 'Understand Generalized Autoregressive Conditional Heteroskedasticity and how it parsimoniously models long-term volatility memory.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l18-p1-the-garch-solution',
      title: 'The Intuition of GARCH',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "To capture long-term memory in financial volatility, an ARCH model requires calculating dozens of parameters (like an ARCH(30)). This causes severe statistical overfitting.",
        "Tim Bollerslev solved this by introducing the **Generalized ARCH (GARCH)** model. It adds a single new term: yesterday's *variance*.",
        "By allowing today's variance to explicitly depend on yesterday's variance, a simple GARCH(1,1) model can perfectly capture the same infinite volatility memory as an ARCH($\\infty$) model!"
      ],
      formulas: [
        [ "\\text{GARCH}(1,1) \\text{ Variance Equation:}" ],
        [ "h_t = \\omega + \\alpha_1 \\epsilon_{t-1}^2 + \\beta_1 h_{t-1}" ],
        [ "\\text{Where: }" ],
        [ "\\omega = \\text{Baseline constant}" ],
        [ "\\alpha_1 = \\text{Reaction to yesterday\\'s shock (ARCH term)}" ],
        [ "\\beta_1 = \\text{Memory of yesterday\\'s variance (GARCH term)}" ]
      ]
    },
    {
      id: 'l18-p2-calculation',
      title: 'Step-by-Step Calculation',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Let's manually calculate today's conditional variance for a GARCH(1,1) model.",
        "**Calculation Example:** Suppose the baseline $\\omega = 0.5$. The market reacts to new shocks with $\\alpha_1 = 0.3$, and retains old volatility with $\\beta_1 = 0.6$.",
        "Yesterday, the market was highly volatile with a variance of $10.0$, but the actual price shock was only $2.0$.",
        "Today's variance is $0.5 + 0.3(2.0^2) + 0.6(10.0)$. This equals $0.5 + 1.2 + 6.0 = 7.7$. The variance dropped because the new shock ($1.2$) was smaller than the decaying old volatility ($6.0$)."
      ],
      formulas: [
        [ "\\text{Calculation: } h_t = \\omega + \\alpha_1 \\epsilon_{t-1}^2 + \\beta_1 h_{t-1}" ],
        [ "\\text{Given: } \\omega = 0.5, \\alpha_1 = 0.3, \\beta_1 = 0.6, \\epsilon_{t-1} = 2.0, h_{t-1} = 10.0" ],
        [ "h_t = 0.5 + 0.3(2.0^2) + 0.6(10.0)" ],
        [ "h_t = 0.5 + 0.3(4.0) + 6.0" ],
        [ "h_t = 0.5 + 1.2 + 6.0 = 7.7" ]
      ]
    },
    {
      id: 'l18-p3-stationarity-persistence',
      title: 'Stationarity and Persistence',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "The sum of $\\alpha_1$ and $\\beta_1$ determines the **Persistence** of volatility. It tells us how much of yesterday's volatility survives into today.",
        "In our example, persistence is $0.3 + 0.6 = 0.9$. This means $90\\%$ of any volatility spike survives into the next day, taking many days to fully decay.",
        "For the model to be stationary, this sum must be strictly less than 1. If it equals 1, the volatility is perfectly permanent and never mean-reverts (an IGARCH model).",
        "**Calculation Example:** The long-term unconditional variance is $\\omega / (1 - (\\alpha_1 + \\beta_1)) = 0.5 / (1 - 0.9) = 5.0$. No matter how high it spikes, the variance will eventually return to 5.0."
      ],
      formulas: [
        [ "\\text{Persistence: } \\alpha_1 + \\beta_1" ],
        [ "\\text{Example: } 0.3 + 0.6 = 0.9 \\implies 90\\% \\text{ survival}" ],
        [ "\\text{Stationarity Requirement: } \\alpha_1 + \\beta_1 < 1" ],
        [ "\\text{Unconditional Variance: } \\sigma^2 = \\frac{\\omega}{1 - (\\alpha_1 + \\beta_1)}" ],
        [ "\\text{Example: } \\sigma^2 = \\frac{0.5}{1 - 0.9} = \\frac{0.5}{0.1} = 5.0" ]
      ]
    },
    {
      id: 'l18-p4-garch-vs-arch',
      title: 'Infinite ARCH Memory',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Why is GARCH(1,1) so much better than an ARCH model? Because by recursively substituting the variance equation into itself, we can prove it is identical to an ARCH model with infinite lags!",
        "Look at the mathematical derivation below.",
        "Notice how the coefficient for an older shock $\\epsilon_{t-2}$ becomes $\\alpha_1 \\beta_1$, and for $\\epsilon_{t-3}$ it becomes $\\alpha_1 \\beta_1^2$.",
        "Because $\\beta_1 = 0.6$, the weights exponentially decay: $0.3$, then $0.18$, then $0.108$. We get infinite memory using only 3 simple parameters!"
      ],
      formulas: [
        [ "\\text{Start: } h_t = \\omega + \\alpha_1 \\epsilon_{t-1}^2 + \\beta_1 h_{t-1}" ],
        [ "\\text{Substitute } h_{t-1}: h_{t-1} = \\omega + \\alpha_1 \\epsilon_{t-2}^2 + \\beta_1 h_{t-2}" ],
        [ "h_t = \\omega + \\alpha_1 \\epsilon_{t-1}^2 + \\beta_1 (\\omega + \\alpha_1 \\epsilon_{t-2}^2 + \\beta_1 h_{t-2})" ],
        [ "h_t = \\omega(1 + \\beta_1) + \\alpha_1 \\epsilon_{t-1}^2 + \\alpha_1 \\beta_1 \\epsilon_{t-2}^2 + \\beta_1^2 h_{t-2}" ],
        [ "\\text{Continuing to infinity yields an ARCH(}\\infty) \\text{ process.}" ]
      ]
    },
    {
      id: 'l18-p5-visualizing-garch',
      title: 'Visualizing GARCH Returns',
      kind: 'stochastic-path',
      visibleParams: [],
      overrideParams: { u: 6 }, // GARCH(1,1) mapped to 6
      stepTexts: [
        "Look at the visualizer. This simulates a time series of returns driven by a GARCH(1,1) process.",
        "Notice that compared to the ARCH model from the previous lesson, the periods of high volatility here are far more 'sticky' and persistent.",
        "Because of the $\\beta_1$ parameter, once volatility spikes, it relies on its own past momentum to stay high, decaying smoothly over time rather than crashing instantly.",
        "This smooth decay of volatility clustering is why GARCH(1,1) is the absolute industry standard for modeling daily financial returns."
      ],
      formulas: [
        [ "\\text{Returns Equation: } r_t = \\sqrt{h_t} Z_t" ],
        [ "\\text{Where } Z_t \\sim N(0,1)" ],
        [ "\\beta_1 \\text{ ensures high } h_{t-1} \\text{ keeps } h_t \\text{ high.}" ],
        null
      ],
      codeSnippet: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from arch import arch_model

# 1. Simulate GARCH(1,1) Data
np.random.seed(42)
n = 500
omega = 0.5
alpha = 0.3
beta = 0.6
returns = np.zeros(n)
h = np.zeros(n)
z = np.random.normal(0, 1, n)

h[0] = omega / (1 - alpha - beta)
returns[0] = np.sqrt(h[0]) * z[0]

for t in range(1, n):
    h[t] = omega + alpha * (returns[t-1]**2) + beta * h[t-1]
    returns[t] = np.sqrt(h[t]) * z[t]

# 2. Fit GARCH(1,1) Model using the arch library
model = arch_model(returns, vol='Garch', p=1, q=1, rescale=False)
res = model.fit(disp='off')

print(res.summary())

# Plot the returns
plt.figure(figsize=(10, 4))
plt.plot(returns, color='purple')
plt.title("Simulated GARCH(1,1) Returns - High Persistence!")
plt.show()`
    }
  ]
};
