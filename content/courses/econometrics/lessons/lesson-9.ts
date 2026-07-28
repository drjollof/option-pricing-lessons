import { Lesson } from '@/content/types';

export const lesson9: Lesson = {
  id: 'lesson-9',
  title: 'Random Variables and Distributions',
  description: 'Master the core probability distributions in finance, including the Normal and Binomial distributions, and learn how to formally test for normality.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l9-p1-discrete-vs-continuous',
      title: 'Discrete vs Continuous Variables',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In quantitative finance, we rigorously model market uncertainty using **Random Variables**. These mathematically map real-world events into numerical values.",
        "A **Discrete Random Variable** has a strictly countable number of outcomes. For example, the number of 'green days' a stock has in a 5-day week can only be an integer (0, 1, 2, 3, 4, or 5). It uses a Probability Mass Function (PMF).",
        "A **Continuous Random Variable** can take *any* infinitely precise value. Daily stock returns are continuous because a return could be $1.05321...\\%$. It uses a Probability Density Function (PDF) evaluated via integration.",
        "Because continuous variables have infinite possible exact values, the probability of returning *exactly* $1.000000...\\%$ is exactly $0.00\\%$. We can only measure probabilities across continuous ranges (e.g., between $1.0\\%$ and $2.0\\%$)."
      ],
      formulas: [
        null,
        [ "\\text{PMF: } \\text{Pr}(X = 3)" ],
        [ "\\text{PDF: } \\text{Pr}(0.01 \\le Y \\le 0.02) = \\int_{0.01}^{0.02} f(y)dy" ],
        [ "\\text{Pr}(Y = 0.01000...) = 0.0" ]
      ]
    },
    {
      id: 'l9-p2-binomial',
      title: 'The Binomial Distribution (Discrete)',
      kind: 'mc-histogram', // Re-using a histogram for discrete visualization
      visibleParams: [],
      stepTexts: [
        "The **Binomial Distribution** strictly models the number of 'successes' in a fixed, finite number of independent trials, where each trial has a constant probability of success ($p$).",
        "**Calculation Example:** Imagine a volatile tech stock has a mathematically constant 60 percent chance of going up on any given day. What is the exact probability it goes up exactly 3 times in a 5-day week?",
        "To solve this, we use the Binomial PMF. First, we calculate the number of possible sequence combinations (5 choose 3).",
        "Then, we multiply by the probability of 3 successes ($0.60^3$), and multiply by the probability of 2 failures ($0.40^2$). The final probability is 34.56%."
      ],
      formulas: [
        [ "\\text{Pr}(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}" ],
        [ "\\text{Pr}(X = 3) = \\binom{5}{3} (0.60)^3 (1-0.60)^{5-3}" ],
        [ "\\text{Pr}(X = 3) = \\frac{5!}{3!(5-3)!} (0.216) (0.16)" ],
        [ "\\text{Pr}(X = 3) = 10 \\times 0.216 \\times 0.16 = 0.3456" ]
      ]
    },
    {
      id: 'l9-p3-normal-dist',
      title: 'The Normal Distribution (Continuous)',
      kind: 'distribution-curve',
      visibleParams: [],
      overrideParams: { sigma: 0.15, u: 0 },
      stepTexts: [
        "The **Normal Distribution** (Bell Curve) is the bedrock of quantitative finance. It is perfectly symmetric, meaning the Mean, Median, and Mode are absolutely identical.",
        "To find probabilities, we calculate a **Z-Score**, which tells us exactly how many standard deviations a value is from the mean.",
        "**Calculation Example:** An index has a historical annual mean return of 8 percent and a volatility of 15 percent.",
        "What is the Z-score for a 0 percent return? We subtract the mean from the target, and divide by the volatility. See the exact calculation in the math panel below."
      ],
      formulas: [
        [ "Z = \\frac{X - \\mu}{\\sigma}" ],
        [ "Z = \\frac{0.00 - 0.08}{0.15}" ],
        [ "Z = \\frac{-0.08}{0.15} = -0.5333" ],
        [ "\\text{Pr}(Z < -0.533) \\approx 0.297 \\text{ or } 29.7\\%" ]
      ]
    },
    {
      id: 'l9-p4-empirical-cdf',
      title: 'Empirical CDF',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In reality, we don't always know the true underlying distribution. Instead, we use the observed data to build an **Empirical Cumulative Distribution Function (ECDF)**.",
        "The ECDF simply sorts the historical data from smallest to largest and calculates the percentage of observations that fall below a certain threshold.",
        "**Calculation Example:** We have 5 historical monthly returns. We want to find the ECDF value for a return of 0.",
        "Check the LaTeX console to see the formal mathematical notation and step-by-step resolution."
      ],
      formulas: [
        [ "\\hat{F}_n(x) = \\frac{1}{n} \\sum_{i=1}^n I(X_i \\le x)" ],
        [ "\\text{Data: } \\{-0.04, -0.01, 0.02, 0.03, 0.05\\}" ],
        [ "\\text{For } x = 0: \\text{ Count is 2 (the -0.04 and -0.01)}" ],
        [ "\\hat{F}_5(0) = \\frac{2}{5} = 0.40" ]
      ]
    },
    {
      id: 'l9-p5-qq-plot',
      title: 'Normality Testing & Q-Q Plots',
      kind: 'qq-plot',
      visibleParams: [],
      overrideParams: { sigma: 0.15, u: 0 },
      stepTexts: [
        "We can visually test if our empirical data matches a theoretical Normal distribution using a **Quantile-Quantile (Q-Q) Plot**.",
        "The X-axis plots the theoretical quantiles we *would* expect if the data were perfectly normal. The Y-axis plots the actual empirical quantiles from our real dataset.",
        "For example, if the theoretical 1st percentile predicts a $-2.33\\%$ drop, but our empirical market data shows a real crash of $-5.00\\%$, the dot will violently curve away from the 45-degree diagonal line.",
        "We can also use the **Shapiro-Wilk Test** to formally calculate a p-value. The Null Hypothesis is that the data is perfectly normal. If $p < 0.05$, we mathematically reject normality."
      ],
      formulas: [
        null,
        null,
        [ "\\text{Theoretical: } -2.33\\% \\neq \\text{Actual: } -5.00\\%" ],
        [ "W = \\frac{\\left(\\sum a_i x_{(i)}\\right)^2}{\\sum (x_i - \\bar{x})^2}" ]
      ],
      codeSnippet: `import numpy as np
import scipy.stats as stats
import matplotlib.pyplot as plt

# Generate sample returns
returns = np.random.normal(0.08, 0.15, 1000)

# 1. Normality Test (Shapiro-Wilk)
stat, p_value = stats.shapiro(returns)
print(f"Shapiro-Wilk p-value: {p_value:.4f}")

# 2. Q-Q Plot
stats.probplot(returns, dist="norm", plot=plt)
plt.title("Q-Q Plot")
plt.show()`
    }
  ]
};
