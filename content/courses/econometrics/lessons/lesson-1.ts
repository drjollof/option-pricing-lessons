import { Lesson } from '../../../types';

export const lesson1: Lesson = {
  id: 'lesson-1',
  title: 'Linear Regression Analysis',
  description: 'Learn the foundational concepts of econometrics through Ordinary Least Squares (OLS) linear regression, including variable significance, model fitness, and influential data points.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, T: 1, N: 50, u: 1.1, d: 0.9
  },
  phases: [
    {
      id: 'scatter-plot-intro',
      title: 'Endogenous vs. Exogenous Variables',
      description: 'Understanding the relationship between dependent (endogenous) and independent (exogenous) variables using a scatter plot.',
      kind: 'scatter-plot',
      visibleParams: ['N', 'sigma'],
      stepTexts: [
        "In econometrics, we seek to understand how certain factors influence an outcome. The outcome is called the **endogenous variable** (dependent, usually denoted as Y).",
        "The factors that influence it are the **exogenous variables** (independent, denoted as X).",
        "A **scatter plot** is the first step in analysis. It allows us to visually inspect the data for linear relationships, independence, or obvious patterns.",
        "Notice how the data points cluster. Is there a visible trend? Adjust the noise (`sigma`) or sample size (`N`) to see how the cluster changes."
      ],
      formulas: [
        "Y_i = \\beta_0 + \\beta_1 X_i + \\epsilon_i",
        "\\text{Where:}",
        "Y_i = \\text{Endogenous Variable}",
        "X_i = \\text{Exogenous Variable}",
        "\\epsilon_i = \\text{Error Term (Noise)}"
      ]
    },
    {
      id: 'regression-line',
      title: 'Ordinary Least Squares (OLS)',
      description: 'Fitting a line of best fit to minimize the sum of squared residuals.',
      kind: 'scatter-plot',
      visibleParams: ['N', 'sigma'],
      stepTexts: [
        "Ordinary Least Squares (OLS) is a method for estimating the unknown parameters ($\\beta_0$ and $\\beta_1$) in a linear regression model.",
        "The goal of OLS is to minimize the sum of the squared differences (residuals) between the observed values and the values predicted by the model.",
        "**Example Calculation**: If our model predicts $\\hat{Y} = 5 + 2X$, and we have a data point $(X=3, Y=13)$, we can calculate our prediction and residual.",
        "OLS tries to make the sum of these squared residuals ($e_i^2$) as small as possible across all data points."
      ],
      formulas: [
        [ "\\hat{Y}_i = \\hat{\\beta}_0 + \\hat{\\beta}_1 X_i" ],
        [ "\\text{Residual: } e_i = Y_i - \\hat{Y}_i" ],
        [ "\\hat{Y} = 5 + 2(3) = 11", "e_i = 13 - 11 = 2" ],
        [ "\\text{Minimize: } \\sum_{i=1}^n e_i^2" ]
      ]
    },
    {
      id: 'model-fitness',
      title: 'Model Fitness & P-Values',
      description: 'Evaluating how well our model explains the variance in the dependent variable.',
      kind: 'scatter-plot',
      visibleParams: ['N', 'sigma'],
      stepTexts: [
        "Once a model is fit, we must evaluate its quality. **R-squared ($R^2$)** measures the proportion of the variance in $Y$ that is predictable from $X$.",
        "**Example Calculation**: If the Residual Sum of Squares (SSR) is $20$ and the Total Sum of Squares (SST) is $100$, we can calculate the $R^2$.",
        "However, adding more variables always increases $R^2$. To counter this, we use **Adjusted R-squared**, which penalizes the addition of useless variables.",
        "We also use **p-values** to test the null hypothesis that a coefficient (like $\\beta_1$) is equal to zero (i.e., it has no effect). If a p-value is $< 0.05$, we reject the null hypothesis and conclude the variable is significant."
      ],
      formulas: [
        [ "R^2 = 1 - \\frac{\\text{SSR}}{\\text{SST}}" ],
        [ "R^2 = 1 - \\left(\\frac{20}{100}\\right)", "R^2 = 1 - 0.20 = 0.80 \\quad (80\\%)" ],
        [ "\\text{Adj } R^2 = 1 - \\left[ \\frac{(1-R^2)(n-1)}{n-k-1} \\right]" ],
        [ "\\text{Reject } H_0 \\text{ if p-value } < 0.05" ]
      ]
    },
    {
      id: 'multiple-ols',
      title: 'Multiple OLS Regression',
      description: 'Expanding the model to include multiple exogenous variables.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Simple linear regression uses one exogenous variable. **Multiple OLS Regression** extends this to accommodate multiple independent factors.",
        "In finance, asset returns are often modeled against multiple factors (like market risk, interest rates, and inflation) simultaneously.",
        "The formula simply expands to include additional $\\beta$ coefficients for each new $X$ variable.",
        "When using multiple variables, it becomes critical to check for multicollinearity (variables moving together) and use Adjusted R-squared to prevent overfitting."
      ],
      formulas: [
        "Y_i = \\beta_0 + \\beta_1 X_{1i} + \\beta_2 X_{2i} + \\dots + \\beta_k X_{ki} + \\epsilon_i",
        "\\text{Matrix Form: } Y = X\\beta + \\epsilon",
        "\\hat{\\beta} = (X^T X)^{-1} X^T Y"
      ]
    },
    {
      id: 'outliers',
      title: "Outliers and Cook's Distance",
      description: 'Identifying extreme data points that disproportionately influence the regression line.',
      kind: 'scatter-plot',
      visibleParams: ['N', 'sigma'],
      stepTexts: [
        "Not all data points are created equal. Extreme values, known as **outliers**, can heavily skew OLS estimates.",
        "A leverage point is an outlier in the X-direction. If an outlier has high leverage, it can 'pull' the regression line toward it.",
        "**Cook's Distance** is a metric used to measure the influence of a single data point. A high Cook's Distance indicates that removing the point would significantly change the regression coefficients.",
        "Notice the highlighted red data point. Because OLS minimizes *squared* errors, such points are heavily penalized and thus exert excessive pull on the trendline."
      ],
      formulas: [
        "D_i = \\frac{\\sum_{j=1}^n (\\hat{Y}_j - \\hat{Y}_{j(i)})^2}{p \\cdot MSE}",
        "\\text{Where } \\hat{Y}_{j(i)} \\text{ is the prediction without observation } i."
      ]
    },
    {
      id: 'code-implementation',
      title: 'Python Implementation',
      description: 'Fitting an OLS model and checking for influential points using statsmodels.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "To perform this analysis in practice, we use the `statsmodels` library in Python.",
        "First, we load the financial data using `pandas`. Then, we define our endogenous (Y) and exogenous (X) variables, explicitly adding a constant to X for the intercept.",
        "We fit the OLS model and print the summary to evaluate the p-values and R-squared.",
        "Finally, we extract influence metrics to calculate and visualize Cook's Distance."
      ],
      codeSnippet: `import pandas as pd
import statsmodels.api as sm
import matplotlib.pyplot as plt

# 1. Load data
df = pd.read_csv('financial_data.csv')
Y = df['dependent_var']
X = df['independent_vars'] # Can be a DataFrame with multiple columns

# 2. Add constant for the intercept (beta_0)
X_sm = sm.add_constant(X)

# 3. Fit Multiple OLS model
model = sm.OLS(Y, X_sm).fit()
print(model.summary()) # View R-squared and p-values

# 4. Calculate Cook's Distance
influence = model.get_influence()
cooks_d = influence.cooks_distance[0]

# 5. Plot Cook's Distance
plt.stem(cooks_d)
plt.title("Cook's Distance")
plt.show()`
    }
  ]
};
