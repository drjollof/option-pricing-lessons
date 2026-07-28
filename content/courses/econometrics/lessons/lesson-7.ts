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
        "Imagine we predict a stock's return using just one variable ($X_1$). OLS finds a reasonable, stable slope of $\\beta_1 = 2.0$.",
        "Now, a data scientist adds 50 highly correlated, noisy variables. Because OLS tries to perfectly fit every historical data point, it assigns massive, unstable coefficients to these new variables (e.g., $\\beta_{50} = 400.0, \\beta_{51} = -398.0$).",
        "These massive, offsetting coefficients mean the model has memorized the training noise. When applied to new out-of-sample data, the $400.0$ coefficient will cause the predictions to wildly explode.",
        "To prevent this, we introduce **Regularization**. We add a mathematical penalty to the OLS loss function that punishes the model for having excessively large coefficients."
      ],
      formulas: [
        [ "\\text{Stable OLS: } \\beta_1 = 2.0" ],
        [ "\\text{Overfit OLS: } \\beta_{50} = 400.0, \\beta_{51} = -398.0" ],
        null,
        [ "\\text{OLS Loss: } \\sum_{i=1}^n (Y_i - \\hat{Y}_i)^2" ]
      ]
    },
    {
      id: 'ridge-regression',
      title: 'Ridge Regression (L2 Penalty)',
      description: 'Shrinking coefficients asymptotically.',
      kind: 'penalty-path',
      visibleParams: ['sigma'],
      stepTexts: [
        "**Ridge Regression** adds an L2 penalty: a tuning parameter $\\lambda$ multiplied by the *squared* coefficients.",
        "Suppose OLS wants $\\beta = 400.0$. The Ridge penalty for this coefficient is $\\lambda \\times (400)^2 = 160,000 \\lambda$.",
        "To avoid this massive $160,000$ penalty, the algorithm is mathematically forced to shrink the coefficient. If it shrinks it down to $4.0$, the penalty drops to a tiny $16 \\lambda$.",
        "Look at the visualizer. As the penalty $\\lambda$ increases, the coefficients decay asymptotically. They get incredibly small (like $0.001$), but they mathematically never reach exactly zero."
      ],
      formulas: [
        [ "\\text{Ridge Loss: } \\text{OLS} + \\lambda \\sum_{j=1}^p \\beta_j^2" ],
        [ "\\text{Penalty at 400: } 400^2 = 160,000" ],
        [ "\\text{Penalty at 4: } 4^2 = 16" ],
        [ "\\lambda \\to \\infty \\implies \\beta_j \\to 0.001" ]
      ]
    },
    {
      id: 'lasso-regression',
      title: 'Lasso Regression (L1 Penalty)',
      description: 'Feature selection by forcing coefficients to zero.',
      kind: 'penalty-path',
      visibleParams: ['sigma'],
      stepTexts: [
        "**Lasso Regression** adds an L1 penalty instead: the *absolute value* of the coefficients.",
        "For $\\beta = 400$, the Lasso penalty is $\\lambda \\times |400| = 400\\lambda$. For $\\beta = 4$, it is $4\\lambda$.",
        "Because the absolute value function creates a sharp, linear geometric constraint (a diamond shape, unlike Ridge's smooth circle), Lasso does something Ridge cannot do.",
        "Lasso forces useless coefficients to become *exactly zero*. If you feed Lasso 1,000 variables, it might shrink 990 of them to strictly $0.0$, acting as an automated feature selector."
      ],
      formulas: [
        [ "\\text{Lasso Loss: } \\text{OLS} + \\lambda \\sum_{j=1}^p |\\beta_j|" ],
        [ "\\text{Penalty at 400: } |400| = 400" ],
        [ "\\text{Penalty at 4: } |4| = 4" ],
        [ "\\text{Lasso shrinks completely to } 0.0" ]
      ]
    },
    {
      id: 'code-implementation-7',
      title: 'Python Implementation',
      description: 'Using scikit-learn for Ridge and Lasso.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Because regularized models mathematically penalize the absolute size of the coefficients, **you must standardize your data first**. Otherwise, variables with naturally small scales (like interest rates in decimals) will be unfairly penalized compared to large scales (like Market Cap).",
        "We use `scikit-learn` to fit `Ridge` and `Lasso` models.",
        "The hyperparameter $\\alpha$ (equivalent to $\\lambda$ in our math) controls the exact strength of the penalty.",
        "In practice, we use Cross-Validation (`RidgeCV`, `LassoCV`) to automatically test multiple penalties and find the optimal $\\alpha$ that minimizes out-of-sample error."
      ],
      codeSnippet: `from sklearn.linear_model import RidgeCV, LassoCV
from sklearn.preprocessing import StandardScaler

# 1. Standardize the features (CRITICAL for Penalized Regression)
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
print("Lasso Coefficients (Many are precisely 0.0):", lasso.coef_)`
    }
  ]
};
