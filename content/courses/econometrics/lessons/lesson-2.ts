import { Lesson } from '../../../types';

export const lesson2: Lesson = {
  id: 'lesson-2',
  title: 'Correlation and Multicollinearity',
  description: 'Understand the impact of multicollinearity on regression models using covariance, correlation matrices, and the Variance Inflation Factor (VIF).',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, T: 1, N: 50, u: 1.1, d: 0.9
  },
  phases: [
    {
      id: 'covariance-correlation',
      title: 'Covariance & Correlation',
      description: 'Understanding how variables move together.',
      kind: 'correlation-heatmap',
      visibleParams: ['sigma'],
      stepTexts: [
        "Before fitting a multiple regression model, we must check if our exogenous variables (X) are highly related to each other.",
        "**Covariance** measures the directional relationship between two variables. However, its scale is arbitrary, making it hard to interpret.",
        "**Correlation ($r$)** standardizes covariance by dividing it by the product of the variables' standard deviations. It always ranges from -1 to 1.",
        "**Example Calculation**: If $X$ and $Y$ have a covariance of $0.08$, with $\\sigma_X = 0.2$, and $\\sigma_Y = 0.5$, we can solve for $r$.",
        "This $0.80$ is a strong positive correlation. Notice the heatmap: adjust the noise (`sigma`) to see the correlations change visually."
      ],
      formulas: [
        [ "\\text{Cov}(X,Y) = \\frac{\\sum (X_i - \\bar{X})(Y_i - \\bar{Y})}{n-1}" ],
        [ "r = \\frac{\\text{Cov}(X,Y)}{\\sigma_X \\sigma_Y}" ],
        [ "-1 \\le r \\le 1" ],
        [ "r = \\frac{0.08}{0.2 \\times 0.5} = \\frac{0.08}{0.10} = 0.80" ],
        [ "\\text{Strong Positive Correlation}" ]
      ]
    },
    {
      id: 'multicollinearity-effects',
      title: 'The Multicollinearity Problem',
      description: 'How highly correlated variables damage regression models.',
      kind: 'correlation-heatmap',
      visibleParams: ['sigma'],
      stepTexts: [
        "**Multicollinearity** occurs when two or more independent variables are highly correlated (e.g., $X_1$ and $X_2$ in the heatmap).",
        "Why is this a problem? If $X_1$ and $X_2$ move together perfectly, the OLS model cannot distinguish the individual effect of $X_1$ on $Y$ from the effect of $X_2$.",
        "Mathematically, this causes the standard errors of the $\\beta$ coefficients to inflate.",
        "Inflated standard errors lead to wider confidence intervals and lower t-statistics, making significant variables appear statistically insignificant."
      ],
      formulas: [
        "\\text{Var}(\\hat{\\beta}_j) = \\frac{\\sigma^2}{\\sum (X_{ij} - \\bar{X}_j)^2 (1 - R_j^2)}",
        "\\text{Where } R_j^2 \\text{ is the } R^2 \\text{ from regressing } X_j \\text{ on all other X variables.}"
      ]
    },
    {
      id: 'vif',
      title: 'Variance Inflation Factor (VIF)',
      description: 'Measuring and addressing multicollinearity.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "To detect multicollinearity, we calculate the **Variance Inflation Factor (VIF)** for each exogenous variable.",
        "VIF measures how much the variance of an estimated regression coefficient increases when your predictors are correlated.",
        "A VIF of 1 indicates no correlation. A VIF between 1 and 5 is moderate. A VIF > 5 (or 10) indicates high multicollinearity.",
        "**Example Calculation**: If regressing $X_1$ on the other variables yields an $R^2$ of $0.90$, we can calculate the VIF.",
        "Since $10 > 5$, $X_1$ suffers from severe multicollinearity. We typically drop one of the highly correlated variables to fix this."
      ],
      formulas: [
        [ "\\text{VIF}_j = \\frac{1}{1 - R_j^2}" ],
        [ "\\text{If } R_j^2 \\text{ is high, VIF explodes toward infinity.}" ],
        [ "\\text{VIF} = 1 \\text{ (None), } > 5 \\text{ (High)}" ],
        [ "\\text{VIF} = \\frac{1}{1 - 0.90} = \\frac{1}{0.10} = 10" ],
        [ "10 > 5 \\implies \\text{Severe Multicollinearity}" ]
      ]
    },
    {
      id: 'code-implementation-2',
      title: 'Python Implementation',
      description: 'Calculating VIF using statsmodels.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In Python, we can generate a correlation matrix using `pandas` and calculate VIF using `statsmodels`.",
        "First, we call `df.corr()` to spot pairwise correlations.",
        "Then, we loop through our independent variables and calculate the VIF for each using `variance_inflation_factor`.",
        "Variables with a VIF > 5 should be flagged for potential removal."
      ],
      codeSnippet: `import pandas as pd
from statsmodels.stats.outliers_influence import variance_inflation_factor

# 1. Load data
df = pd.read_csv('financial_data.csv')
X = df[['interest_rate', 'inflation', 'gdp_growth']]

# 2. View Correlation Matrix Heatmap
corr_matrix = X.corr()
print(corr_matrix)

# 3. Calculate VIF
vif_data = pd.DataFrame()
vif_data["Variable"] = X.columns
vif_data["VIF"] = [variance_inflation_factor(X.values, i) 
                   for i in range(len(X.columns))]

print(vif_data)`
    }
  ]
};
