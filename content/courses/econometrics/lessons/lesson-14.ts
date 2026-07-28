import { Lesson } from '@/content/types';

export const lesson14: Lesson = {
  id: 'lesson-14',
  title: 'Time Series Statistical Models',
  description: 'Understand the foundational models of time series analysis: White Noise, Random Walks, and Moving Average (MA) processes.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l14-p1-differencing',
      title: 'Differencing & Detrending',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "If a time series is non-stationary, we cannot model it reliably. We must force it to become stationary.",
        "One method is **Detrending**, where we fit a linear regression line to the data and subtract the line away, analyzing only the residuals.",
        "A more robust method for financial data is **Differencing**. Instead of modeling the raw price, we model the change in price from yesterday to today.",
        "**Calculation Example:** If a stock closes at 100, 102, 101, and 105, we calculate the First Difference by subtracting yesterday's price from today's. See the math panel below for the exact differences."
      ],
      formulas: [
        [ "\\text{First Difference: } \\Delta Y_t = Y_t - Y_{t-1}" ],
        [ "\\text{Example Prices: } Y = [100, 102, 101, 105]" ],
        [ "\\text{First Difference Series: } [(102-100), (101-102), (105-101)]" ],
        [ "\\Delta Y_t = [2, -1, 4]" ]
      ]
    },
    {
      id: 'l14-p2-white-noise',
      title: 'White Noise',
      kind: 'stochastic-path',
      visibleParams: ['sigma'],
      overrideParams: { u: 0, sigma: 1 }, 
      stepTexts: [
        "The foundational building block of time series is **White Noise**. It represents pure, unpredictable randomness.",
        "White Noise is strictly stationary. It has a constant mean of 0, a constant variance, and exactly zero autocorrelation at any lag.",
        "For example, if yesterday's white noise shock was $+5.0$, today's mathematical expectation is strictly $0.0$. There is zero memory.",
        "If your final econometric model's residuals look like this visualizer—violently jumping around zero with no pattern—it means you have successfully captured all the predictable signal!"
      ],
      formulas: [
        [ "\\epsilon_t \\sim \\text{White Noise (WN)}" ],
        [ "E(\\epsilon_t) = 0" ],
        [ "\\text{Var}(\\epsilon_t) = \\sigma^2" ],
        [ "\\text{Cov}(\\epsilon_t, \\epsilon_{t-k}) = 0 \\quad \\text{for } k \\neq 0" ]
      ]
    },
    {
      id: 'l14-p3-random-walk',
      title: 'Random Walk',
      kind: 'stochastic-path',
      visibleParams: ['sigma'],
      overrideParams: { u: 1, sigma: 1 },
      stepTexts: [
        "A **Random Walk** occurs when today's value is simply yesterday's value plus a random White Noise shock.",
        "Because it accumulates every single past shock, it has 'infinite memory'. Its variance grows infinitely over time, meaning it is severely **non-stationary**.",
        "**Calculation Example:** Let the starting value be 100. We add a sequence of random shocks: $+2$, $-1$, $+3$.",
        "The values step from 102, to 101, to 104. See the exact calculations below."
      ],
      formulas: [
        [ "Y_t = Y_{t-1} + \\epsilon_t" ],
        [ "\\text{Example Shocks: } \\epsilon = [+2, -1, +3]" ],
        [ "Y_1 = 100 + 2 = 102" ],
        [ "Y_2 = 102 - 1 = 101" ],
        [ "Y_3 = 101 + 3 = 104" ],
        [ "\\text{Var}(Y_t) = t \\sigma^2 \\implies \\text{Variance explodes to infinity!}" ]
      ]
    },
    {
      id: 'l14-p4-random-walk-drift',
      title: 'Random Walk with Drift',
      kind: 'stochastic-path',
      visibleParams: ['sigma'],
      overrideParams: { u: 2, sigma: 1 },
      stepTexts: [
        "If we add a constant term (or drift) to the random walk, we get a **Random Walk with Drift**.",
        "This is the baseline model for long-term equity markets: they wander randomly day-to-day, but have an underlying upward drift.",
        "**Calculation Example:** Suppose the drift is $c = 0.5$ and the starting price is $100$. Over $10$ days, the expected baseline price is $100 + (10 \\times 0.5) = 105$.",
        "Because the mean explicitly grows linearly over time ($c \\cdot t$), it violates the constant mean requirement of stationarity."
      ],
      formulas: [
        [ "Y_t = c + Y_{t-1} + \\epsilon_t" ],
        [ "E(Y_t) = Y_0 + c \\cdot t" ],
        [ "\\text{Example: } c = 0.5, \\quad E(Y_{10}) = 100 + 10(0.5) = 105" ],
        [ "\\text{The mean grows with time (Non-stationary).}" ]
      ]
    },
    {
      id: 'l14-p5-ma-model',
      title: 'Moving Average (MA) Model',
      kind: 'stochastic-path',
      visibleParams: [],
      overrideParams: { u: 3 },
      stepTexts: [
        "The **Moving Average (MA)** model attempts to predict today's value using *past errors* (shocks), rather than past prices.",
        "An MA(1) model uses only today's shock and yesterday's shock. Because it only remembers one day into the past, its memory instantly dies after lag 1.",
        "**Calculation Example:** We want to calculate today's value for an MA(1) model. The long-term mean is $\\mu = 0$, the lag coefficient is $\\theta_1 = 0.8$.",
        "If yesterday's shock was $-2$ and today's shock is $+3$, today's exact value is $0 + 3 + (0.8 \\times -2) = 1.4$. See the math panel."
      ],
      formulas: [
        [ "\\text{MA}(q) \\text{ Model:}" ],
        [ "Y_t = \\mu + \\epsilon_t + \\theta_1 \\epsilon_{t-1} + \\dots + \\theta_q \\epsilon_{t-q}" ],
        [ "\\text{MA(1) Example Calculation:}" ],
        [ "\\text{Given } \\mu = 0, \\theta_1 = 0.8, \\epsilon_{t-1} = -2, \\epsilon_t = +3" ],
        [ "Y_t = 0 + 3 + 0.8(-2) = 1.4" ]
      ],
      codeSnippet: `import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.arima_process import ArmaProcess

# 1. Simulate White Noise
np.random.seed(42)
white_noise = np.random.normal(0, 1, 200)

# 2. Simulate Random Walk (Cumulative Sum of White Noise)
random_walk = np.cumsum(white_noise)

# 3. Simulate MA(1) Process
# statsmodels requires the zero-th lag coefficient to be 1
ma1_process = ArmaProcess(ar=[1], ma=[1, 0.8])
ma1_data = ma1_process.generate_sample(nsample=200)

# Plotting the series
plt.figure(figsize=(10, 6))
plt.plot(random_walk, label="Random Walk (Non-Stationary)", color='red')
plt.plot(ma1_data, label="MA(1) Process (Stationary)", color='green')
plt.title("Time Series Statistical Models")
plt.legend()
plt.show()`
    }
  ]
};
