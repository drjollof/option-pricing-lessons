import { Lesson } from '@/content/types';

export const lesson10: Lesson = {
  id: 'lesson-10',
  title: 'Lesson 10: Skew Normal and Skew-t Distribution',
  description: 'Understand higher moments like skewness and kurtosis, how they violate the normality assumption, and how to quantify them mathematically.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 4, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l10-p1-skewness-theory',
      title: 'Phase 1: The Mathematics of Skewness',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Financial returns rarely follow a perfect bell curve. The third mathematical moment of a distribution is **Skewness**, which measures asymmetry.",
        "To calculate skewness, we measure how far each data point is from the mean, divide by the standard deviation (to normalize it), and then **cube** the result.",
        "Cubing the value is the secret! Unlike squaring (which makes everything positive), cubing preserves the sign (positive or negative).",
        "See the LaTeX panel below for the formal mathematical equation defining Sample Skewness."
      ],
      formulas: [
        [ "\\text{Sample Skewness } (\\gamma_1) = \\frac{n}{(n-1)(n-2)} \\sum_{i=1}^n \\left(\\frac{x_i - \\bar{x}}{s}\\right)^3" ],
        [ "\\text{Normal Distribution: } \\gamma_1 = 0" ],
        [ "\\text{Positive Skew: } \\gamma_1 > 0 \\text{ (Long Right Tail)}" ],
        [ "\\text{Negative Skew: } \\gamma_1 < 0 \\text{ (Long Left Tail)}" ]
      ]
    },
    {
      id: 'l10-p2-skewness-visual',
      title: 'Phase 2: Divergence of the Mean and Median',
      kind: 'distribution-curve',
      visibleParams: [],
      overrideParams: { sigma: 0.2, u: 4 }, // High positive skew
      stepTexts: [
        "Let's look at a **Positively Skewed** distribution. Notice how the long tail stretches out to the right.",
        "The peak of the curve is the **Mode**. It represents the most frequent, common outcome.",
        "Because the tail stretches right, the **Median** gets pulled slightly to the right to maintain exactly 50 percent of the area on either side.",
        "The **Mean**, however, is highly sensitive to the magnitude of the extreme outliers in the tail, dragging it out the furthest."
      ],
      formulas: [
        [ "\\text{Mode = Highest Probability Density}" ],
        [ "\\text{Median = 50th Percentile}" ],
        [ "\\text{Right-Skewed: } \\text{Mean} > \\text{Median} > \\text{Mode}" ],
        [ "\\text{Left-Skewed: } \\text{Mean} < \\text{Median} < \\text{Mode}" ]
      ]
    },
    {
      id: 'l10-p3-kurtosis',
      title: 'Phase 3: Kurtosis & Fat Tails',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "The fourth mathematical moment is **Kurtosis**. This measures the 'tailedness' of the distribution.",
        "To calculate it, we raise the normalized distances to the **fourth power**. This places enormous weight on extreme outliers.",
        "A standard Normal Distribution has a Kurtosis of 3. We often look at **Excess Kurtosis**, which simply subtracts 3 so that a normal distribution sits at 0.",
        "Review the math panel below to see how Excess Kurtosis is calculated and how it defines fat tails."
      ],
      formulas: [
        [ "\\text{Sample Kurtosis } = \\frac{1}{n} \\sum_{i=1}^n \\left(\\frac{x_i - \\bar{x}}{s}\\right)^4" ],
        [ "\\text{Excess Kurtosis} = \\text{Kurtosis} - 3" ],
        [ "\\text{Excess Kurtosis } > 0 \\implies \\text{Leptokurtic (Fat Tails)}" ],
        [ "\\text{Excess Kurtosis } < 0 \\implies \\text{Platykurtic (Thin Tails)}" ]
      ]
    },
    {
      id: 'l10-p4-kurtosis-visual',
      title: 'Phase 4: Visualizing Fat Tails on a Q-Q Plot',
      kind: 'qq-plot',
      visibleParams: [],
      overrideParams: { sigma: 0.2, u: 4 }, // Fat tails trigger
      stepTexts: [
        "Let's see what a **Leptokurtic** (fat-tailed) distribution looks like on a Q-Q plot compared to a theoretical normal distribution (the red line).",
        "Look at the center of the plot. The empirical data hugs the red line quite well. The middle 90 percent of trading days often look perfectly normal!",
        "Now look at the extremes. The yellow sample points diverge sharply away from the red line. The actual losses (left side) and actual gains (right side) are much larger than the normal distribution mathematically expects."
      ],
      formulas: [
        [ "\\text{Empirical Quantiles } < \\text{ Theoretical (Left Tail)}" ],
        [ "\\text{Empirical Quantiles } > \\text{ Theoretical (Right Tail)}" ],
        [ "\\implies \\text{Black Swan Events are systematically underpriced!}" ]
      ]
    },
    {
      id: 'l10-p5-skew-t',
      title: 'Phase 5: The Skew-t Distribution',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "If the normal distribution fails to capture skewness and kurtosis, what should we use instead?",
        "The **Student's t-distribution** is naturally fat-tailed. The 'degrees of freedom' parameter controls how fat the tails are. As this parameter grows toward infinity, the t-distribution becomes a normal distribution.",
        "To also capture asymmetry, quants use the **Skew-t Distribution**. It introduces a dedicated skew parameter.",
        "See the math panel below for the formal mathematical definition of these complex distributions."
      ],
      formulas: [
        [ "\\text{Standard t-Distribution PDF } (\\text{symmetric, fat tails}):" ],
        [ "f(x | \\nu) = \\frac{\\Gamma(\\frac{\\nu+1}{2})}{\\sqrt{\\nu\\pi}\\Gamma(\\frac{\\nu}{2})} \\left(1 + \\frac{x^2}{\\nu}\\right)^{-\\frac{\\nu+1}{2}}" ],
        [ "\\text{Skew-t Distribution } (\\text{asymmetric, fat tails}):" ],
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
