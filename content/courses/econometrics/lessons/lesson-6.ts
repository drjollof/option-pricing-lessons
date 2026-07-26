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
        "In Lesson 1, we learned that Ordinary Least Squares (OLS) minimizes the *sum of squared residuals*.",
        "Because errors are squared ($e_i^2$), an outlier that is far from the line receives a massive penalty. To minimize this penalty, OLS heavily tilts the regression line toward the outlier.",
        "Look at the visualizer. A single extreme outlier (the red triangle) completely skews the OLS line (red dashed line) away from the true trend of the data.",
        "In finance, markets often exhibit 'fat tails'—extreme events that are more common than a normal distribution predicts. OLS is highly vulnerable to these events."
      ],
      formulas: [
        [ "\\text{OLS Loss Function: } \\rho(e_i) = e_i^2" ],
        [ "\\text{Derivative (Influence): } \\psi(e_i) = 2e_i" ],
        [ "\\text{Influence grows linearly with error size without bound.}" ],
        [ "\\text{Fat tails cause OLS to fail.}" ]
      ]
    },
    {
      id: 'm-estimation',
      title: 'M-Estimation and Huber Loss',
      description: 'Bounding the influence of outliers.',
      kind: 'robust-regression',
      visibleParams: [],
      stepTexts: [
        "**Robust Regression** techniques, like M-Estimation, replace the squared loss function of OLS with a different function that is less sensitive to extreme values.",
        "The **Huber Loss** function behaves like OLS for small errors (it squares them), but for large errors (beyond a threshold $c$), it switches to absolute value.",
        "This means the influence of an outlier is capped. It can only pull the line so much.",
        "Notice how the green Robust line ignores the extreme pull of the outlier and stays true to the majority of the data."
      ],
      formulas: [
        [ "\\text{Replace squared loss with M-Estimators.}" ],
        [ "\\text{Huber Loss: } \\rho(e) = \\begin{cases} \\frac{1}{2} e^2 & \\text{for } |e| \\le c \\\\ c|e| - \\frac{1}{2} c^2 & \\text{for } |e| > c \\end{cases}" ],
        [ "\\text{Influence } \\psi(e) \\text{ is bounded by } \\pm c." ],
        [ "\\text{Robust line ignores extreme pull.}" ]
      ]
    },
    {
      id: 'tukey-biweight',
      title: 'Tukey Biweight',
      description: 'Completely ignoring extreme outliers.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "While Huber Loss limits the influence of an outlier, it still gives it *some* influence.",
        "The **Tukey Biweight** (or Bisquare) loss function goes a step further. If an error is beyond a certain threshold, its influence drops entirely to zero.",
        "This means extreme outliers are completely ignored by the model, as if they were removed from the dataset.",
        "Robust regression is iteratively reweighted (IRLS); the algorithm assigns weights to points based on their errors, updates the line, and repeats until convergence."
      ],
      formulas: [
        [ "\\text{Huber still allows some influence.}" ],
        [ "\\text{Tukey Influence: } \\psi(e) = e \\left(1 - \\left(\\frac{e}{c}\\right)^2\\right)^2 \\text{ for } |e| \\le c" ],
        [ "\\psi(e) = 0 \\text{ for } |e| > c" ],
        [ "\\text{Iteratively Reweighted Least Squares (IRLS)}" ]
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
        "By default, `sm.RLM` uses the Huber norm.",
        "We can specify the Tukey Biweight norm by passing `M=sm.robust.norms.TukeyBiweight()`.",
        "This allows us to rapidly compare OLS coefficients against Robust coefficients to check for outlier influence."
      ],
      codeSnippet: `import statsmodels.api as sm

# Fit standard OLS for comparison
ols_model = sm.OLS(Y, X).fit()
print("OLS Beta:", ols_model.params)

# Fit Robust Regression (Huber by default)
rlm_huber = sm.RLM(Y, X, M=sm.robust.norms.HuberT()).fit()
print("Huber Beta:", rlm_huber.params)

# Fit Robust Regression (Tukey Biweight)
rlm_tukey = sm.RLM(Y, X, M=sm.robust.norms.TukeyBiweight()).fit()
print("Tukey Beta:", rlm_tukey.params)`
    }
  ]
};
