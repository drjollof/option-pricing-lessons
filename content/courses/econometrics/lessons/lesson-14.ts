import { Lesson } from '@/content/types';

export const lesson14: Lesson = {
  id: 'lesson-14',
  title: 'Lesson 14: Time Series Statistical Models',
  description: 'Understand the foundational models of time series analysis: White Noise, Random Walks, and Moving Average (MA) processes.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l14-p1-differencing',
      title: 'Phase 1: Differencing & Detrending',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "If a time series is non-stationary (e.g., a stock price that generally drifts upward over time), we cannot model it reliably. We must make it stationary first.",
        "One common method is **Detrending**, where we fit a linear regression line to the data and subtract the line away, analyzing only the residuals.",
        "A more robust method for financial data is **Differencing**. Instead of looking at the raw price, we look at the change in price from yesterday to today.",
        "**Calculation Example:** If a stock closes at 100, 102, 101, and 105 dollars, we calculate the First Difference by subtracting yesterday's price from today's. See the math panel below for the result."
      ],
      formulas: [
        [ "\\text{First Difference: } \\Delta Y_t = Y_t - Y_{t-1}" ],
        [ "\\text{Example Prices: } [100, 102, 101, 105]" ],
        [ "\\text{First Difference Series: } [(102-100), (101-102), (105-101)]" ],
        [ "\\Delta Y_t = [2, -1, 4]" ]
      ]
    },
    {
      id: 'l14-p2-white-noise',
      title: 'Phase 2: White Noise',
      kind: 'stochastic-path',
      visibleParams: ['sigma'], // selectively show sigma (volatility)
      overrideParams: { u: 0, sigma: 1 }, 
      stepTexts: [
        "The most basic time series process is **White Noise**. It represents pure, unpredictable randomness.",
        "White Noise is strictly stationary. It has a constant mean of 0, a constant variance, and absolutely zero autocorrelation at any lag. Yesterday's shock tells you nothing about today's shock.",
        "Look at the visualizer. The path jumps violently up and down around zero. If your final econometric model's residuals look like this, it means you have successfully captured all the predictable signal, and only pure noise remains!"
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
      title: 'Phase 3: Random Walk',
      kind: 'stochastic-path',
      visibleParams: ['sigma'],
      overrideParams: { u: 1, sigma: 1 }, // u=1 for RW
      stepTexts: [
        "A **Random Walk** occurs when today's value is simply yesterday's value plus a random White Noise shock.",
        "Because it accumulates every single past shock, it has 'infinite memory'. This means its variance grows infinitely over time, making it highly **non-stationary**.",
        "**Calculation Example:** Let the starting value be 100. We add a series of random shocks to simulate a random walk. See the step-by-step math below."
      ],
      formulas: [
        [ "Y_t = Y_{t-1} + \\epsilon_t" ],
        [ "\\text{Example Shocks: } [+2, -1, +3]" ],
        [ "Y_1 = 100 + 2 = 102" ],
        [ "Y_2 = 102 - 1 = 101" ],
        [ "Y_3 = 101 + 3 = 104" ],
        [ "\\text{Var}(Y_t) = t \\sigma^2 \\implies \\text{Variance explodes to infinity!}" ]
      ]
    },
    {
      id: 'l14-p4-random-walk-drift',
      title: 'Phase 4: Random Walk with Drift',
      kind: 'stochastic-path',
      visibleParams: ['sigma'],
      overrideParams: { u: 2, sigma: 1 }, // u=2 for RWD
      stepTexts: [
        "If we add a constant term (or drift) to the random walk, we get a **Random Walk with Drift**.",
        "This is the standard baseline model for long-term equity markets: they wander randomly day-to-day, but have an underlying upward drift over the decades.",
        "Look at the visualizer. The random shocks are exactly the same as the previous phase, but the constant drift parameter slowly pulls the entire path upwards."
      ],
      formulas: [
        [ "Y_t = c + Y_{t-1} + \\epsilon_t" ],
        [ "E(Y_t) = Y_0 + c \\cdot t" ],
        [ "\\text{The mean grows linearly with time, so it is strictly non-stationary.}" ]
      ]
    },
    {
      id: 'l14-p5-ma-model',
      title: 'Phase 5: Moving Average (MA) Model',
      kind: 'stochastic-path',
      visibleParams: [],
      overrideParams: { u: 3 }, // u=3 for MA(1)
      stepTexts: [
        "The **Moving Average (MA)** model attempts to predict today's value using *past errors* (shocks), rather than past prices.",
        "An MA(1) model uses only today's shock and yesterday's shock. Because it only remembers one day into the past, its 'memory' instantly dies after lag 1.",
        "**Calculation Example:** We want to calculate today's value for an MA(1) model given yesterday's shock and today's shock.",
        "Follow the exact calculation in the math panel below. If we look at a correlogram for this data, the ACF will have a single spike at Lag 1 and then immediately cut off to zero!"
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
