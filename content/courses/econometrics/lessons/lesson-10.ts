import { Lesson } from '@/content/types';

export const lesson10: Lesson = {
  id: 'lesson-10',
  title: 'Skew Normal and Skew-t Distribution',
  description: 'Understand higher moments like skewness and kurtosis, how they violate the normality assumption, and how to quantify them mathematically.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 4, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l10-p1-skewness-theory',
      title: 'The Mathematics of Skewness',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Financial market returns rarely follow a symmetric bell curve. The third mathematical moment is **Skewness**, which measures structural asymmetry.",
        "To calculate it, we measure how far each data point is from the mean, divide by the standard deviation (to normalize it), and then **cube** the result.",
        "Imagine an upside outlier of $+3$ standard deviations. Cubing it gives $(+3)^3 = +27$. Now imagine a downside crash of $-3$ standard deviations. Cubing it gives $(-3)^3 = -27$.",
        "This is the mathematical secret! Unlike squaring (which destroys negative signs, since $(-3)^2 = +9$), cubing perfectly preserves the directional sign, allowing us to mathematically isolate the direction of the extreme tail."
      ],
      formulas: [
        [ "\\text{Skewness } \\gamma_1 = \\frac{1}{n} \\sum_{i=1}^n \\left(\\frac{x_i - \\bar{x}}{s}\\right)^3" ],
        [ "\\text{Upside: } (+3)^3 = +27" ],
        [ "\\text{Downside: } (-3)^3 = -27" ],
        null
      ]
    },
    {
      id: 'l10-p2-skewness-visual',
      title: 'Divergence of the Mean and Median',
      kind: 'distribution-curve',
      visibleParams: [],
      overrideParams: { sigma: 0.2, u: 4 }, // High positive skew
      stepTexts: [
        "Let's look at a mathematically Positively Skewed distribution. Suppose 9 employees make 50,000 dollars, and the CEO makes 5,000,000 dollars.",
        "The **Median** (the 50th percentile) is 50,000 dollars. The **Mode** (the highest peak) is also 50,000 dollars.",
        "But because the **Mean** is mathematically sensitive to the massive magnitude of the 5,000,000 dollar outlier, the mean gets violently dragged all the way up to 545,000 dollars.",
        "In a highly right-skewed distribution, the mean is always artificially inflated far beyond the typical outcome."
      ],
      formulas: [
        [ "\\text{Salaries: } [50k, 50k, ..., 5m]" ],
        [ "\\text{Median } = 50,000" ],
        [ "\\text{Mean } = \\frac{(9 \\times 50k) + 5m}{10} = 545,000" ],
        [ "\\text{Right-Skewed: } \\text{Mean} > \\text{Median} > \\text{Mode}" ]
      ]
    },
    {
      id: 'l10-p3-kurtosis',
      title: 'Kurtosis & Fat Tails',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "The fourth mathematical moment is **Kurtosis**. This raises the normalized distance to the **fourth power**, measuring the probability of extreme market crashes.",
        "Take a massive 5 standard deviation market crash ($Z = -5$). If we squared it, the penalty is $(-5)^2 = 25$. But because Kurtosis uses the 4th power, the mathematical penalty explodes to $(-5)^4 = 625$.",
        "This places an absolutely enormous mathematical weight on extreme outliers. A standard Normal Distribution has a baseline Kurtosis of 3.",
        "We often calculate **Excess Kurtosis** (Kurtosis - 3). If Excess Kurtosis > 0, the distribution is **Leptokurtic** (fat-tailed), meaning extreme $Z=5$ events happen far more often than normally expected."
      ],
      formulas: [
        [ "\\text{Squaring Penalty: } (-5)^2 = 25" ],
        [ "\\text{Kurtosis Penalty: } (-5)^4 = 625" ],
        [ "\\text{Excess Kurtosis} = \\text{Kurtosis} - 3" ],
        [ "\\text{Excess Kurtosis } > 0 \\implies \\text{Leptokurtic}" ]
      ]
    },
    {
      id: 'l10-p4-kurtosis-visual',
      title: 'Visualizing Fat Tails on a Q-Q Plot',
      kind: 'qq-plot',
      visibleParams: [],
      overrideParams: { sigma: 0.2, u: 4 }, // Fat tails trigger
      stepTexts: [
        "Let's see what a Leptokurtic (fat-tailed) distribution actually looks like on a Q-Q plot compared to a theoretical normal distribution (the red diagonal line).",
        "Look at the absolute center. The empirical data points hug the red line incredibly well. The middle 90 percent of trading days mathematically look perfectly normal.",
        "Now look at the extreme left tail. If the theoretical normal math expects a worst-case drop of $-3.00\\%$, but the actual empirical data crashes by $-8.00\\%$, the dot vividly breaks below the red line.",
        "Because traditional finance models (like Black-Scholes) strictly assume normal distributions, they systematically underprice the true mathematical risk of these extreme $-8.00\\%$ Black Swan crashes."
      ],
      formulas: [
        null,
        null,
        [ "\\text{Normal Expectation: } -3.00\\%" ],
        [ "\\text{Actual Market Crash: } -8.00\\%" ]
      ]
    },
    {
      id: 'l10-p5-skew-t',
      title: 'The Skew-t Distribution',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "If the normal distribution blindly predicts $-3.00\\%$ but the market repeatedly crashes $-8.00\\%$, what advanced distributions should Quants use?",
        "The **Student's t-distribution** is naturally fat-tailed. The 'degrees of freedom' parameter (e.g. $\\nu = 3$) controls the fatness. As $\\nu \\to \\infty$, it mathematically converges exactly into a normal distribution.",
        "However, the t-distribution is strictly symmetric. To simultaneously capture both the fat tails (the $-8.00\\%$ crash) and the asymmetry (Mean $\\neq$ Median), we use the **Skew-t Distribution**.",
        "The Skew-t mathematically introduces a dedicated skew parameter ($\\lambda$), drastically improving the accuracy of Value-at-Risk (VaR) models in algorithmic trading."
      ],
      formulas: [
        [ "\\text{t-distribution: Fat-tailed (controlled by } \\nu)" ],
        [ "\\nu \\to \\infty \\implies \\text{Normal Distribution}" ],
        [ "\\text{Skew-t: Adds asymmetry parameter } \\lambda" ],
        [ "f_{skew}(x) = 2 f(x | \\nu) F(\\lambda x | \\nu+1)" ]
      ],
      codeSnippet: `import numpy as np
import scipy.stats as stats

# 1. Calculate Skewness and Kurtosis
returns = np.random.normal(0, 1, 1000)
skewness = stats.skew(returns)
kurtosis = stats.kurtosis(returns) # Fisher's definition (excess kurtosis)

print(f"Skewness: {skewness:.4f}")
print(f"Excess Kurtosis: {kurtosis:.4f}")

# 2. Fit a Skew-Normal Distribution
a, loc, scale = stats.skewnorm.fit(returns)
print(f"Fitted Skew (alpha): {a:.4f}")`
    }
  ]
};
