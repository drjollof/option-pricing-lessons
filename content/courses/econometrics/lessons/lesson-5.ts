import { Lesson } from '../../../types';

export const lesson5: Lesson = {
  id: 'lesson-5',
  title: 'OLS Assumptions and Heteroskedasticity',
  description: 'Learn the strict assumptions required for OLS to be the Best Linear Unbiased Estimator (BLUE), and how to correct for heteroskedasticity using WLS.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, T: 1, N: 50, u: 1.1, d: 0.9
  },
  phases: [
    {
      id: 'ols-assumptions',
      title: 'The Gauss-Markov Assumptions',
      description: 'The strict rules that make OLS work.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "For Ordinary Least Squares (OLS) to be the Best Linear Unbiased Estimator (BLUE), a strict set of assumptions (the Gauss-Markov theorem) must hold.",
        "1. **Linearity**: The parameters must be linear.",
        "2. **Random Sampling**: The data must be a random sample from the population.",
        "3. **No Perfect Multicollinearity**: Independent variables cannot be perfectly correlated (which we solved with PCA in earlier lessons).",
        "4. **Zero Conditional Mean**: The error term $\\epsilon$ has an expected value of 0 given any value of $X$.",
        "5. **Homoskedasticity**: The variance of the error term is constant."
      ],
      formulas: [
        [ "\\text{BLUE: Best Linear Unbiased Estimator}" ],
        [ "\\text{Linearity, Random Sampling}" ],
        [ "\\text{No Perfect Multicollinearity}" ],
        [ "E(\\epsilon_i | X) = 0" ],
        [ "\\text{Var}(\\epsilon_i | X) = \\sigma^2" ]
      ]
    },
    {
      id: 'heteroskedasticity',
      title: 'Heteroskedasticity',
      description: 'When the variance of the errors is not constant.',
      kind: 'residual-plot',
      visibleParams: ['sigma'],
      stepTexts: [
        "When Assumption 5 fails, we have **Heteroskedasticity**. This means the spread of the residuals changes as the independent variable changes.",
        "Notice the Residual Plot. As X increases, the spread of the errors (residuals) fans out. Adjust the `sigma` slider to increase or decrease this fanning effect.",
        "Heteroskedasticity does *not* make OLS biased, but it makes it **inefficient**. The standard errors are calculated incorrectly, which invalidates our p-values and confidence intervals.",
        "We can test for this using the Breusch-Pagan or White tests."
      ],
      formulas: [
        [ "\\text{Assumption 5 Fails.}" ],
        [ "\\text{Var}(\\epsilon_i | X_i) = \\sigma_i^2" ],
        [ "\\text{Note the subscript } i \\text{ on } \\sigma, \\text{ meaning variance changes per observation.}" ],
        [ "\\text{Breusch-Pagan Test}" ]
      ]
    },
    {
      id: 'wls',
      title: 'Weighted Least Squares (WLS)',
      description: 'Correcting for non-constant variance.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "To fix Heteroskedasticity, we can use robust standard errors (like White's standard errors) which adjust the standard error calculation without changing the coefficients.",
        "Alternatively, we can use **Weighted Least Squares (WLS)**. WLS assigns a weight to each observation, inversely proportional to its variance.",
        "Points with high variance (lots of noise) are given less weight, and points with low variance (highly accurate) are given more weight.",
        "This transforms the model back into a homoskedastic one, restoring the BLUE property."
      ],
      formulas: [
        [ "\\text{Robust Standard Errors (HC1, HC3)}" ],
        [ "\\text{Weight: } w_i = \\frac{1}{\\sigma_i^2}" ],
        [ "\\text{Minimize: } \\sum_{i=1}^n w_i (Y_i - \\hat{Y}_i)^2" ],
        [ "\\hat{\\beta}_{WLS} = (X^T W X)^{-1} X^T W Y" ]
      ]
    },
    {
      id: 'code-implementation-5',
      title: 'Python Implementation',
      description: 'Testing for heteroskedasticity and applying WLS.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In Python with `statsmodels`, we first run a standard OLS regression.",
        "We then extract the residuals and use `het_breuschpagan` to test for heteroskedasticity. A low p-value means we reject the null of homoskedasticity.",
        "To correct it, we can either re-fit the OLS model using `cov_type='HC3'` (robust standard errors) or fit a `sm.WLS` model by passing in an array of weights."
      ],
      codeSnippet: `import statsmodels.api as sm
from statsmodels.stats.diagnostic import het_breuschpagan

# 1. Fit standard OLS
model = sm.OLS(Y, X).fit()

# 2. Test for Heteroskedasticity (Breusch-Pagan)
bp_test = het_breuschpagan(model.resid, X)
labels = ['LM Statistic', 'LM-Test p-value', 'F-Statistic', 'F-Test p-value']
print(dict(zip(labels, bp_test)))

# 3. Fix 1: Robust Standard Errors
robust_model = model.get_robustcov_results(cov_type='HC3')
print(robust_model.summary())

# 4. Fix 2: Weighted Least Squares (WLS)
# Assuming we estimate weights inversely proportional to X
weights = 1 / X['feature_causing_variance']
wls_model = sm.WLS(Y, X, weights=weights).fit()
print(wls_model.summary())`
    }
  ]
};
