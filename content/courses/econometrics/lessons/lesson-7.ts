import { Lesson } from '../../../types';

export const lesson7: Lesson = {
  id: 'lesson-7',
  title: 'Penalized Regression (Ridge & Lasso)',
  description: 'Combat overfitting and multicollinearity by shrinking coefficients using L1 and L2 penalties.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, T: 1, N: 50, u: 1.1, d: 0.9
  },
  phases: [
    {
      id: 'overfitting-problem',
      title: 'The Overfitting Problem',
      description: 'Why complex models fail out-of-sample.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In machine learning and econometrics, adding more variables to a model always increases $R^2$ (in-sample fit).",
        "However, too many variables lead to **overfitting**. The model begins to memorize the noise in the training data rather than the underlying signal.",
        "As a result, the model performs terribly on new, unseen data (out-of-sample).",
        "To prevent this, we introduce **Regularization** (or Penalization). We add a penalty term to the OLS loss function that punishes the model for having large coefficients."
      ],
      formulas: [
        [ "\\text{OLS Loss: } \\sum_{i=1}^n (Y_i - \\hat{Y}_i)^2" ],
        [ "\\text{If coefficients } \\beta_j \\text{ grow too large, variance explodes.}" ],
        [ "\\text{Overfitting: Memorizing noise instead of signal.}" ],
        [ "\\text{Solution: Regularization (Penalties).}" ]
      ]
    },
    {
      id: 'ridge-regression',
      title: 'Ridge Regression (L2 Penalty)',
      description: 'Shrinking coefficients asymptotically.',
      kind: 'penalty-path',
      visibleParams: ['sigma'],
      stepTexts: [
        "**Ridge Regression** adds an L2 penalty to the loss function: the sum of the *squared* coefficients.",
        "This penalty forces the model to shrink all coefficients towards zero. The strength of the shrinkage is controlled by a tuning parameter, $\\lambda$.",
        "Look at the visualizer (simulate Ridge by setting `sigma < 0.2`). As $\\lambda$ (the penalty) increases, the coefficients decay asymptotically towards zero, but they never *exactly* reach zero.",
        "Ridge is excellent for dealing with severe multicollinearity, as it shrinks correlated variables together."
      ],
      formulas: [
        [ "\\text{Ridge Loss: } \\text{OLS} + \\lambda \\sum_{j=1}^p \\beta_j^2" ],
        [ "\\text{Shrinkage controlled by } \\lambda." ],
        [ "\\lambda \\to \\infty \\implies \\beta_j \\to 0" ],
        [ "\\text{Good for handling Multicollinearity.}" ]
      ]
    },
    {
      id: 'lasso-regression',
      title: 'Lasso Regression (L1 Penalty)',
      description: 'Feature selection by forcing coefficients to zero.',
      kind: 'penalty-path',
      visibleParams: ['sigma'],
      stepTexts: [
        "**Lasso Regression** (Least Absolute Shrinkage and Selection Operator) adds an L1 penalty: the sum of the *absolute values* of the coefficients.",
        "Because of the geometry of the absolute value function, Lasso does something Ridge cannot do: it forces some coefficients to become *exactly zero*.",
        "Look at the visualizer (simulate Lasso by setting `sigma > 0.2`). Notice how the paths hit exactly zero and stay there.",
        "This makes Lasso a powerful tool for **feature selection**. If you have 1,000 variables but only 10 are useful, Lasso will zero out the other 990."
      ],
      formulas: [
        [ "\\text{Lasso Loss: } \\text{OLS} + \\lambda \\sum_{j=1}^p |\\beta_j|" ],
        [ "\\text{Geometry causes sparse solutions (many } \\beta_j = 0 \\text{).}" ],
        [ "\\text{Some paths hit exactly zero.}" ],
        [ "\\text{Lasso performs Feature Selection.}" ]
      ]
    },
    {
      id: 'code-implementation-7',
      title: 'Python Implementation',
      description: 'Using scikit-learn for Ridge and Lasso.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Because regularized models penalize coefficient size, **you must standardize your data first**. Otherwise, variables with small scales (and thus large coefficients) will be unfairly penalized.",
        "We use `scikit-learn` to fit `Ridge` and `Lasso` models.",
        "The hyperparameter $\\alpha$ (equivalent to $\\lambda$ in our math) controls the penalty strength.",
        "In practice, we use Cross-Validation (`RidgeCV`, `LassoCV`) to automatically find the optimal $\\alpha$ that minimizes out-of-sample error."
      ],
      codeSnippet: `from sklearn.linear_model import RidgeCV, LassoCV
from sklearn.preprocessing import StandardScaler

# 1. Standardize the features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 2. Fit Ridge with Cross-Validation
ridge = RidgeCV(alphas=[0.1, 1.0, 10.0])
ridge.fit(X_scaled, Y)
print("Optimal Ridge Alpha:", ridge.alpha_)
print("Ridge Coefficients:", ridge.coef_)

# 3. Fit Lasso with Cross-Validation
lasso = LassoCV(cv=5)
lasso.fit(X_scaled, Y)
print("Optimal Lasso Alpha:", lasso.alpha_)
print("Lasso Coefficients (Many are 0):", lasso.coef_)`
    }
  ]
};
