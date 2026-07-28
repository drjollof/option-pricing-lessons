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
        "For Ordinary Least Squares (OLS) to be statistically valid, a strict mathematical framework called the **Gauss-Markov Theorem** must hold.",
        "The most critical assumption is **Zero Conditional Mean**, meaning our model's errors are perfectly random and have no hidden patterns. The expected value of the error is exactly 0.",
        "The final assumption is **Homoskedasticity**. This strictly requires that the variance (spread) of our errors remains mathematically constant across all data points.",
        "If we predict $Y$ when $X=10$, and our errors fall within $\\pm 2$, Homoskedasticity demands that when $X=100$, our errors must also fall within exactly $\\pm 2$."
      ],
      formulas: [
        null,
        [ "E(\\epsilon_i | X) = 0" ],
        [ "\\text{Var}(\\epsilon_i | X) = \\sigma^2" ],
        null
      ]
    },
    {
      id: 'heteroskedasticity',
      title: 'Heteroskedasticity',
      description: 'When the variance of the errors is not constant.',
      kind: 'residual-plot',
      visibleParams: [],
      stepTexts: [
        "When the constant variance assumption fails, we suffer from **Heteroskedasticity**. This means the spread of our errors dynamically changes depending on the independent variable.",
        "Look at the Residual Plot visualization. As $X$ increases, the spread of the errors violently fans out into a massive cone shape.",
        "A classic example is predicting spending based on income: low-income earners have highly predictable spending, while billionaires' spending can vary by millions of dollars.",
        "If the true variance for $X=100$ explodes to $2500$, but OLS blindly assumes a constant average variance of just $400$, the model will falsely report that its predictions are highly accurate. Our confidence intervals are completely ruined."
      ],
      formulas: [
        [ "\\text{Var}(\\epsilon_i | X_i) = \\sigma_i^2" ],
        null,
        null,
        null
      ]
    },
    {
      id: 'wls',
      title: 'Weighted Least Squares (WLS)',
      description: 'Correcting for non-constant variance.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "To salvage our model, we use an aggressive mathematical solution called **Weighted Least Squares (WLS)**. WLS assigns a unique weight to every single data point.",
        "This weight is strictly inversely proportional to the variance. For a low-income point where variance is $4$, the weight is high: $w_1 = 1/4 = 0.25$.",
        "For a billionaire where the variance is massive ($2500$), the weight is mathematically crushed: $w_2 = 1/2500 = 0.0004$.",
        "By penalizing the noisy points and heavily rewarding the stable points, WLS mathematically transforms the data back into a homoskedastic state, restoring our valid confidence intervals."
      ],
      formulas: [
        [ "w_i = \\frac{1}{\\sigma_i^2}" ],
        [ "\\text{Low Variance: } w_1 = \\frac{1}{4} = 0.25" ],
        [ "\\text{High Variance: } w_2 = \\frac{1}{2500} = 0.0004" ],
        [ "\\text{Minimize: } \\sum_{i=1}^n w_i (Y_i - \\hat{Y}_i)^2" ]
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
        "We then extract the residuals and use `het_breuschpagan` to test for heteroskedasticity. A low p-value (under 0.05) mathematically proves heteroskedasticity exists.",
        "To correct it, we can either re-fit the OLS model using `cov_type='HC3'` (robust standard errors) or fit a dedicated `sm.WLS` model by passing in an array of mathematical weights.",
        "Running the robust model fixes the standard errors and p-values so they are statistically trustworthy again."
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
