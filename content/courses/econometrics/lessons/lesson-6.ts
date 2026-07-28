import { Lesson } from '../../../types';

export const lesson6: Lesson = {
  id: 'lesson-6',
  title: 'Robust Regression',
  description: 'Explore how to handle severe outliers using M-Estimation, Huber Loss, and Tukey Biweight models.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, T: 1, N: 50, u: 1.1, d: 0.9
  },
  phases: [
    {
      id: 'ols-vulnerability',
      title: 'The Vulnerability of OLS',
      description: 'Why OLS fails in the presence of extreme outliers.',
      kind: 'robust-regression',
      visibleParams: [],
      stepTexts: [
        "Imagine we have 5 data points that perfectly form the line $Y = X$. The true slope is exactly 1.0.",
        "Now, a data entry error occurs: a 6th point is recorded as $X=10, Y=1000$ (a massive outlier). The error for this point is $e = 1000 - 10 = 990$.",
        "Because OLS minimizes the *sum of squared residuals*, this single point generates a massive mathematical penalty of $990^2 = 980,100$!",
        "To minimize this apocalyptic penalty, OLS is forced to violently tilt the regression line toward the outlier, destroying the true slope. In finance, where extreme 'fat tail' crashes happen constantly, OLS is highly vulnerable."
      ],
      formulas: [
        [ "\\text{True Slope } \beta = 1.0" ],
        [ "\\text{Error: } e = 1000 - 10 = 990" ],
        [ "\\text{OLS Penalty} = 990^2 = 980,100" ],
        null
      ]
    },
    {
      id: 'm-estimation',
      title: 'M-Estimation and Huber Loss',
      description: 'Bounding the influence of outliers.',
      kind: 'robust-regression',
      visibleParams: [],
      stepTexts: [
        "**Robust Regression** (M-Estimation) fixes this by replacing the strict squared penalty. The **Huber Loss** function is a brilliant hybrid.",
        "For small, normal errors (e.g., $e \\le 2$), Huber acts exactly like OLS and squares them ($2^2 = 4$).",
        "But for our extreme error $e = 990$, it crosses a mathematical threshold. Instead of squaring it to 980,100, Huber switches to a linear penalty (e.g., $2 \\times 990 = 1,980$).",
        "By mathematically capping the *influence* of the outlier ($1,980 \\ll 980,100$), the green Robust line in the visualizer can safely ignore the extreme pull and maintain the true slope."
      ],
      formulas: [
        [ "\\text{Huber (Small } e): \\frac{1}{2} e^2" ],
        [ "\\text{Huber (Extreme } e): c|e| - \\frac{1}{2} c^2" ],
        [ "\\text{Huber Penalty} \\approx 1,980" ],
        [ "1980 \\ll 980100" ]
      ]
    },
    {
      id: 'tukey-biweight',
      title: 'Tukey Biweight',
      description: 'Completely ignoring extreme outliers.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "While Huber Loss limits the influence of our 990 outlier, it still forces the line to pay *some* attention to it (a penalty of 1,980).",
        "The **Tukey Biweight** loss function goes a radical step further. If a data point's error is beyond a certain extreme threshold, its mathematical weight drops to exactly zero.",
        "This means truly extreme market outliers are completely deleted by the algorithm in real-time, effectively automating outlier removal without any manual data scrubbing.",
        "These robust models are solved using Iteratively Reweighted Least Squares (IRLS). The algorithm fits a line, dynamically calculates the robust weights, and repeats until the line perfectly stabilizes on the true slope of 1.0."
      ],
      formulas: [
        null,
        [ "\\text{Tukey Weight (Extreme } e=990) = 0" ],
        [ "\\text{Outlier Influence} = 0" ],
        null
      ]
    },
    {
      id: 'code-implementation-6',
      title: 'Python Implementation',
      description: 'Fitting Robust Regression in statsmodels.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "We can easily fit robust models using `statsmodels` via `sm.RLM` (Robust Linear Models).",
        "By default, `sm.RLM` uses the Huber norm, capping the penalty of extreme errors.",
        "We can specify the Tukey Biweight norm by passing `M=sm.robust.norms.TukeyBiweight()`, forcing the model to assign a weight of exactly 0 to extreme anomalies.",
        "This allows us to rapidly compare OLS coefficients against Robust coefficients to check how much our data is being manipulated by outliers."
      ],
      codeSnippet: `import statsmodels.api as sm

# Fit standard OLS for comparison (highly vulnerable)
ols_model = sm.OLS(Y, X).fit()
print("OLS Beta:", ols_model.params)

# Fit Robust Regression (Huber by default, caps influence)
rlm_huber = sm.RLM(Y, X, M=sm.robust.norms.HuberT()).fit()
print("Huber Beta:", rlm_huber.params)

# Fit Robust Regression (Tukey Biweight, zeroes influence)
rlm_tukey = sm.RLM(Y, X, M=sm.robust.norms.TukeyBiweight()).fit()
print("Tukey Beta:", rlm_tukey.params)`
    }
  ]
};
