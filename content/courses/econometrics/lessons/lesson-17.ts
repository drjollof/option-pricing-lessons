import { Lesson } from '@/content/types';

export const lesson17: Lesson = {
  id: 'lesson-17',
  title: 'ARCH Model',
  description: 'Discover how to mathematically model volatility clustering and conditional variance using the ARCH model.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l17-p1-volatility-clustering',
      title: 'Volatility Clustering',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In traditional models like White Noise or ARMA, we assume that the variance (volatility) of the shocks is perfectly constant over time. This is called **Homoskedasticity**.",
        "However, real financial markets exhibit **Volatility Clustering**. Mandelbrot famously noted that 'large changes tend to be followed by large changes, and small changes by small changes.'",
        "If a market crashes today, it will likely be highly volatile tomorrow. If it is calm today, it will likely be calm tomorrow.",
        "We need a model where today's variance is mathematically conditioned on yesterday's shocks. We call this **Conditional Heteroskedasticity**."
      ],
      formulas: [
        [ "\\text{Standard Assumption: } \\text{Var}(\\epsilon_t) = \\sigma^2 \\quad \\text{(Constant)}" ],
        [ "\\text{Reality: } \\text{Var}(\\epsilon_t | \\epsilon_{t-1}) = h_t \\quad \\text{(Time-Varying)}" ],
        null,
        null
      ]
    },
    {
      id: 'l17-p2-arch-model',
      title: 'The ARCH(1) Model',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "To capture this clustering, Robert Engle invented the **Autoregressive Conditional Heteroskedasticity (ARCH)** model.",
        "An ARCH(1) model states that today's variance ($h_t$) is a baseline constant ($\\omega$) plus a multiplier ($\\alpha$) times yesterday's squared shock.",
        "**Calculation Example:** Suppose baseline variance is $\\omega = 1.0$, and the ARCH multiplier is $\\alpha = 0.8$.",
        "If yesterday had a massive shock of $5.0$, today's conditional variance jumps to $1.0 + 0.8(5^2) = 1.0 + 0.8(25) = 21.0$. The market is now highly volatile!"
      ],
      formulas: [
        [ "\\text{ARCH(1) Variance Equation:}" ],
        [ "h_t = \\omega + \\alpha_1 \\epsilon_{t-1}^2" ],
        [ "\\text{Example Calculation:}" ],
        [ "\\text{Given } \\omega = 1.0, \\alpha_1 = 0.8, \\epsilon_{t-1} = 5.0" ],
        [ "h_t = 1.0 + 0.8(5.0^2) = 1.0 + 20.0 = 21.0" ]
      ]
    },
    {
      id: 'l17-p3-conditional-vs-unconditional',
      title: 'Conditional vs Unconditional',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In an ARCH model, the *conditional* variance changes every single day based on what happened yesterday.",
        "However, the *unconditional* (long-term average) variance is perfectly constant! Over a 10-year period, the overall average volatility remains stable.",
        "**Calculation Example:** Using the same parameters $\\omega = 1.0$ and $\\alpha = 0.8$, the long-term unconditional variance is $1.0 / (1 - 0.8) = 1.0 / 0.2 = 5.0$.",
        "So while today's variance might spike to $21.0$ due to a crash, we know mathematically it will eventually mean-revert back to the long-term average of $5.0$."
      ],
      formulas: [
        [ "\\text{Conditional Variance: } h_t = \\omega + \\alpha_1 \\epsilon_{t-1}^2 \\quad \\text{(Changes Daily)}" ],
        [ "\\text{Unconditional Variance: } \\sigma^2 = \\frac{\\omega}{1 - \\alpha_1} \\quad \\text{(Constant Average)}" ],
        [ "\\text{Example: } \\sigma^2 = \\frac{1.0}{1 - 0.8} = \\frac{1.0}{0.2} = 5.0" ],
        [ "\\text{Stationarity Requirement: } \\alpha_1 < 1" ]
      ]
    },
    {
      id: 'l17-p4-visualizing-arch',
      title: 'Visualizing ARCH Returns',
      kind: 'stochastic-path',
      visibleParams: [],
      overrideParams: { u: 5 }, // ARCH(1)
      stepTexts: [
        "Look at the visualizer. This simulates a time series of returns driven by an ARCH(1) process with $\\alpha = 0.8$.",
        "Notice how the periods of high volatility cluster together! A single large spike immediately causes the variance of the next step to inflate, leading to a sequence of wild swings.",
        "Eventually, if by chance a small shock occurs, the variance shrinks, and the series enters a prolonged period of calm.",
        "This perfectly mimics the boom-and-bust cycle of real financial returns."
      ],
      formulas: [
        [ "\\text{Returns Equation: } r_t = \\sqrt{h_t} Z_t" ],
        [ "\\text{Where } Z_t \\sim \\text{Standard Normal } N(0,1)" ],
        [ "\\text{If } \\epsilon_{t-1} \\text{ was large, } h_t \\text{ is large, making } r_t \\text{ likely large.}" ],
        null
      ]
    },
    {
      id: 'l17-p5-arch-limitations',
      title: 'Limitations of ARCH',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "While ARCH was a Nobel Prize-winning breakthrough, it has severe limitations in practice.",
        "Financial shocks take a long time to die out. To accurately model a stock market crash, you might need to look back at the past 30 days of squared shocks.",
        "This means you would need to build an ARCH(30) model and estimate 30 separate $\\alpha$ parameters!",
        "Estimating 30 parameters leads to massive statistical errors and overfitting. We need a more 'parsimonious' solution to capture long-term volatility memory. (Hint: GARCH)."
      ],
      formulas: [
        [ "\\text{ARCH(q) Model:}" ],
        [ "h_t = \\omega + \\alpha_1 \\epsilon_{t-1}^2 + \\alpha_2 \\epsilon_{t-2}^2 + \\dots + \\alpha_q \\epsilon_{t-q}^2" ],
        [ "\\text{If memory is long, } q \\text{ becomes impractically large.}" ],
        null
      ],
      codeSnippet: `import numpy as np
import matplotlib.pyplot as plt
from arch import arch_model

# 1. Simulate ARCH(1) Data
np.random.seed(42)
n = 500
omega = 1.0
alpha = 0.8
returns = np.zeros(n)
h = np.zeros(n)
z = np.random.normal(0, 1, n)

h[0] = omega / (1 - alpha)
returns[0] = np.sqrt(h[0]) * z[0]

for t in range(1, n):
    h[t] = omega + alpha * (returns[t-1]**2)
    returns[t] = np.sqrt(h[t]) * z[t]

# 2. Fit ARCH(1) Model using the arch library
model = arch_model(returns, vol='ARCH', p=1, rescale=False)
res = model.fit(disp='off')

print(res.summary())

# Plot the returns
plt.figure(figsize=(10, 4))
plt.plot(returns, color='red')
plt.title("Simulated ARCH(1) Returns - Notice the Volatility Clusters!")
plt.show()`
    }
  ]
};
