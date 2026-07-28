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
      description: 'Understanding the relationship between dependent (endogenous) and independent (exogenous) variables.',
      kind: 'scatter-plot',
      visibleParams: [],
      stepTexts: [
        "In the world of finance and econometrics, we are constantly trying to figure out what drives certain outcomes. For example, what causes a specific company's stock price to go up or down?",
        "To answer this, we classify our data into two distinct categories. First, we have the **Endogenous Variable**. This is the outcome we are trying to predict or explain. It is often referred to as the 'Dependent Variable' and is universally denoted as **Y**.",
        "In our real-world example, the Endogenous Variable ($Y$) could be the daily percentage return of Apple's stock (AAPL).",
        "Second, we have the **Exogenous Variables**. These are the external factors or inputs that we believe influence our outcome. They are also known as 'Independent Variables' or 'Predictors', and are denoted as **X**.",
        "Continuing our example, a logical Exogenous Variable ($X$) to predict Apple's stock return would be the overall return of the broader market index, like the S&P 500.",
        "Before doing any complex math, the very first step a quantitative analyst takes is to visually inspect the data. We do this using a **scatter plot**, plotting our exogenous variable ($X$) on the horizontal axis against our endogenous variable ($Y$) on the vertical axis.",
        "Look at the data points in the visualization. Even without a trendline, you can visually inspect whether the points seem completely random, or if there is a general direction (a trend) implying that as $X$ increases, $Y$ tends to increase as well."
      ],
      formulas: [
        null,
        null,
        null,
        null,
        null,
        null,
        [ "Y_i = \\beta_0 + \\beta_1 X_i + \\epsilon_i" ]
      ]
    },
    {
      id: 'regression-line',
      title: 'Ordinary Least Squares (OLS)',
      description: 'Fitting a line of best fit to minimize the sum of squared residuals.',
      kind: 'scatter-plot',
      visibleParams: ['N', 'sigma'],
      stepTexts: [
        "While eyeballing a scatter plot is useful, we need a rigorous mathematical way to define the relationship. We achieve this by drawing a 'line of best fit' through the data points using a method called **Ordinary Least Squares (OLS)**.",
        "The OLS equation has three critical components. The first is **Beta Zero ($\\beta_0$)**, also known as the intercept or Alpha. This tells us the expected value of our Endogenous variable ($Y$) when the Exogenous variable ($X$) is exactly zero.",
        "The second component is **Beta One ($\\beta_1$)**, the slope. This is the core of our analysis. It tells us precisely how much $Y$ is expected to change for a one-unit increase in $X$. If $\\beta_1 = 1.5$, then a 1% increase in the S&P 500 ($X$) implies a 1.5% increase in Apple's stock ($Y$).",
        "However, the real world is messy. Our line will never perfectly hit every single data point. The vertical distance between a real data point and our predicted line is called the **Residual**, or the Error Term ($\\epsilon_i$).",
        "The goal of the OLS algorithm is to find the exact values for $\\beta_0$ and $\\beta_1$ that minimize the *sum of the squared residuals*. Squaring them ensures that negative errors (points below the line) don't cancel out positive errors (points above the line), and it heavily penalizes massive outliers.",
        "Let's look at a concrete calculation. If our OLS algorithm determines that $\\beta_0 = 5$ and $\\beta_1 = 2$, our predictive model becomes $\\hat{Y} = 5 + 2X$.",
        "If a specific data point occurred where $X = 3$ and $Y = 13$, our model would predict a $Y$ of 11. Since the actual $Y$ was 13, our residual (error) for that specific point is 2."
      ],
      formulas: [
        [ "\\hat{Y}_i = \\hat{\\beta}_0 + \\hat{\\beta}_1 X_i" ],
        null, // No formula for Beta Zero explanation
        null, // No formula for Beta One explanation
        [ "\\text{Residual: } e_i = Y_i - \\hat{Y}_i" ],
        [ "\\text{OLS Objective: Minimize } \\sum_{i=1}^n e_i^2" ],
        [ "\\text{If } \\hat{\\beta}_0 = 5 \\text{ and } \\hat{\\beta}_1 = 2, \\text{ then } \\hat{Y} = 5 + 2(3) = 11" ],
        [ "e_i = 13 - 11 = 2" ]
      ]
    },
    {
      id: 'model-fitness',
      title: 'Model Fitness & P-Values',
      description: 'Evaluating how well our model explains the variance in the dependent variable.',
      kind: 'scatter-plot',
      visibleParams: ['N', 'sigma'],
      stepTexts: [
        "Just because we *can* draw a line through data doesn't mean the line is actually useful. We must evaluate the statistical quality of our OLS model.",
        "Our primary metric for model fitness is **R-squared ($R^2$)**. This score ranges from 0 to 1 (or 0% to 100%) and tells us exactly what proportion of the variance in $Y$ is successfully explained by $X$.",
        "If our $R^2$ is 0.80, it means 80% of the movement in Apple's stock ($Y$) is explained by the movement in the S&P 500 ($X$). The remaining 20% is driven by idiosyncratic noise (like company-specific news) captured in the residuals.",
        "Mathematically, $R^2$ compares the Residual Sum of Squares (SSR)—the variance of our errors—against the Total Sum of Squares (SST)—the total variance of the raw $Y$ data. If our SSR is 20 and our SST is 100, the math results in an $R^2$ of 0.80.",
        "While $R^2$ tells us about the overall model, we also need to test the individual coefficients. We use **p-values** to test the 'null hypothesis' that our slope ($\\beta_1$) is actually zero (meaning $X$ has zero real effect on $Y$).",
        "If the calculated p-value for our $\\beta_1$ coefficient is less than 0.05, we confidently reject the null hypothesis and declare that our variable is 'statistically significant'."
      ],
      formulas: [
        null,
        null,
        [ "R^2 = 1 - \\left(\\frac{20}{100}\\right) = 1 - 0.20 = 0.80 \\quad (80\\%)" ],
        [ "R^2 = 1 - \\frac{\\text{SSR}}{\\text{SST}}" ],
        [ "\\text{Null Hypothesis } (H_0): \\beta_1 = 0" ],
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
        "Simple linear regression is powerful, but it assumes only one factor drives our outcome. In reality, financial markets are driven by a complex web of interconnected factors.",
        "**Multiple OLS Regression** extends our equation to accommodate two, three, or even hundreds of independent variables simultaneously.",
        "Instead of just using the S&P 500 to predict Apple's stock, we could add variables for Interest Rates ($\\beta_2$), Inflation ($\\beta_3$), and Tech-Sector Momentum ($\\beta_4$).",
        "The mathematical objective remains exactly the same: minimize the sum of squared residuals. However, because we are now operating in multi-dimensional space, the math requires Linear Algebra and matrix multiplication to solve for all the Betas simultaneously.",
        "A critical danger in Multiple OLS is **Overfitting**. By the mathematical definition of $R^2$, simply adding *any* random variable (even coin flips) to your model will increase the $R^2$ score slightly. It never goes down.",
        "To protect against this illusion of improvement, quants use **Adjusted R-squared**. This metric introduces a mathematical penalty for every new variable added. Your Adjusted $R^2$ will only increase if the new variable adds significant predictive power that outweighs the penalty."
      ],
      formulas: [
        null,
        [ "Y_i = \\beta_0 + \\beta_1 X_{1i} + \\beta_2 X_{2i} + \\dots + \\beta_k X_{ki} + \\epsilon_i" ],
        null,
        [ "\\text{Matrix Notation: } Y = X\\beta + \\epsilon", "\\text{OLS Estimator: } \\hat{\\beta} = (X^T X)^{-1} X^T Y" ],
        null,
        [ "\\text{Adjusted } R^2 = 1 - \\left[ \\frac{(1-R^2)(n-1)}{n-k-1} \\right]" ]
      ]
    },
    {
      id: 'outliers',
      title: "Outliers and Cook's Distance",
      description: 'Identifying extreme data points that disproportionately influence the regression line.',
      kind: 'scatter-plot',
      visibleParams: ['N', 'sigma'],
      stepTexts: [
        "In a perfect dataset, all points are drawn from a normal distribution. In the real world, datasets contain extreme anomalies known as **outliers**.",
        "Because OLS minimizes the *squared* residuals, a data point that is extremely far from the regression line generates a massive squared penalty. To minimize this penalty, the OLS algorithm will literally twist and pull the entire regression line toward the outlier.",
        "We classify extreme points based on their position. An outlier in the vertical ($Y$) direction is just an anomaly. But an outlier in the horizontal ($X$) direction has high **leverage**, meaning it acts like a wrench, exerting disproportionate torque on the slope of the line.",
        "To measure how much damage a single outlier is doing to our model, statisticians use **Cook's Distance**.",
        "Cook's Distance mathematically compares the regression line calculated with all data points against a hypothetical regression line calculated with the suspicious data point completely removed.",
        "If a point has a high Cook's Distance (typically $> 1$), removing it drastically changes the slope or intercept. Quants must then investigate: was this outlier a valid market crash (keep it), or a data entry typo (drop it)?",
        "Look at the chart visualization. A massive outlier has been artificially injected into the dataset (highlighted in red). The dashed gray line shows where the regression line *should* be (the true fit), while the solid red line shows how violently the single outlier pulls the final OLS equation."
      ],
      formulas: [
        null,
        null,
        null,
        [ "D_i = \\frac{\\sum_{j=1}^n (\\hat{Y}_j - \\hat{Y}_{j(i)})^2}{p \\cdot MSE}" ],
        [ "\\text{Where: } \\hat{Y}_{j(i)} = \\text{Prediction without point } i, \\quad p = \\text{parameters}" ],
        [ "\\text{Rule of Thumb: Investigate if } D_i > \\frac{4}{n}" ],
        null
      ],
      codeSnippet: `import numpy as np
import statsmodels.api as sm
import matplotlib.pyplot as plt

# 1. Generate normal market data
np.random.seed(42)
X = np.random.normal(0, 1, 50)
Y = 2.5 * X + np.random.normal(0, 1, 50)

# 2. Inject a high-leverage outlier
X = np.append(X, 5.0)  # Extreme X value
Y = np.append(Y, -10.0) # Extreme opposing Y value

# 3. Fit OLS Model
X_with_const = sm.add_constant(X)
model = sm.OLS(Y, X_with_const).fit()

# 4. Calculate Cook's Distance
influence = model.get_influence()
cooks_d = influence.cooks_distance[0]

# Print the maximum Cook's Distance found
max_cooks_idx = np.argmax(cooks_d)
print(f"Max Cook's Distance at index {max_cooks_idx}: {cooks_d[max_cooks_idx]:.4f}")

# (Optional) Plotting influence
# sm.graphics.influence_plot(model)
# plt.show()`
    }
  ]
};
