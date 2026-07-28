import { Lesson } from '../../../types';

export const lesson3: Lesson = {
  id: 'lesson-3',
  title: 'Principal Component Analysis (PCA)',
  description: 'Learn how to reduce dimensionality and eliminate multicollinearity using eigenvectors, eigenvalues, and variance-maximizing rotations.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, T: 1, N: 50, u: 1.1, d: 0.9
  },
  phases: [
    {
      id: 'dimension-reduction',
      title: 'The Dimensionality Problem',
      description: 'Why having too many variables is a problem.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In financial modeling, we often use hundreds of predictors. But what if two predictors—like 'Gross Revenue' ($X_1$) and 'Net Sales' ($X_2$)—are practically identical?",
        "If we include both in an OLS regression, the model suffers from severe multicollinearity, leading to wildly unstable predictions.",
        "Instead of randomly deleting one of the variables, we can use **Principal Component Analysis (PCA)**.",
        "PCA mathematically compresses these two correlated variables into a single, brand new variable (a Principal Component) that retains all the important information."
      ],
      formulas: [
        null,
        null,
        null,
        [ "Y = \\beta_0 + \\beta_1(PC_1) + \\epsilon" ]
      ]
    },
    {
      id: 'covariance-matrix',
      title: 'The Covariance Matrix',
      description: 'Capturing the relationship between variables.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "PCA starts by calculating the **Covariance Matrix** ($\\Sigma$) of our predictors.",
        "Let's assume the variance of Gross Revenue is 1.0, the variance of Net Sales is 1.0, and their covariance (how they move together) is highly positive at 0.90.",
        "We construct the 2x2 matrix. The diagonal holds the individual variances (1.0), and the off-diagonal holds the covariance (0.90).",
        "The total variance in our entire system is simply the sum of the diagonals: $1.0 + 1.0 = 2.0$."
      ],
      formulas: [
        null,
        null,
        [ "\\Sigma = \\begin{bmatrix} 1.0 & 0.90 \\\\ 0.90 & 1.0 \\end{bmatrix}" ],
        [ "\\text{Total Variance} = 1.0 + 1.0 = 2.0" ]
      ]
    },
    {
      id: 'eigen-math',
      title: 'Eigenvalues and Eigenvectors',
      description: 'Finding the Principal Components.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Next, we calculate the **Eigenvalues** ($\\lambda$). These numbers tell us exactly how much of the total variance is captured by each new Principal Component.",
        "For our matrix, the math reveals two Eigenvalues: $\\lambda_1 = 1.90$ and $\\lambda_2 = 0.10$.",
        "Notice that $\\lambda_1$ captures 1.90 out of the 2.0 total variance (which is exactly 95 percent!).",
        "This means the first Principal Component (PC1) successfully compressed 95% of the information from both Gross Revenue and Net Sales into a single column of data."
      ],
      formulas: [
        [ "\\text{Solve for } \\lambda: \\det(\\Sigma - \\lambda I) = 0" ],
        [ "\\lambda_1 = 1.90, \\quad \\lambda_2 = 0.10" ],
        [ "\\text{Variance Explained by PC1} = \\frac{1.90}{2.0} = 0.95" ],
        [ "\\text{We drop PC2 and use only PC1.}" ]
      ]
    },
    {
      id: 'scree-plot',
      title: 'The Scree Plot',
      description: 'Visualizing component importance.',
      kind: 'pca-scree',
      visibleParams: [],
      stepTexts: [
        "When we have 50 predictors instead of 2, we generate 50 Principal Components. We sort them by their Eigenvalues from highest to lowest.",
        "A **Scree Plot** (like the one shown) visualizes the percentage of total variance explained by each component.",
        "Look at the visualization: PC1 and PC2 capture massive amounts of variance, but the bars quickly drop to near zero. This sharp drop is called the 'elbow'.",
        "By keeping only the components before the elbow, we discard the long tail of useless noise while retaining the core financial signal."
      ],
      formulas: [
        null,
        [ "\\text{Proportion of Variance} = \\frac{\\lambda_i}{\\sum \\lambda_j}" ],
        null,
        null
      ]
    },
    {
      id: 'box-cox',
      title: 'Data Scaling and Standardization',
      description: 'Why you must standardize before PCA.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "PCA calculates variance based on raw numbers. This creates a massive problem if your variables are on vastly different scales.",
        "If you include 'Market Cap' (in billions) and 'Interest Rate' (in decimals), the variance of Market Cap will mathematically dominate the matrix.",
        "PCA will incorrectly assign an Eigenvalue of 99.9% to Market Cap simply because the numbers are bigger, not because it's actually more predictive.",
        "To prevent this, you must **Standardize** all data (force a mean of 0 and standard deviation of 1) before running PCA."
      ],
      formulas: [
        null,
        null,
        null,
        [ "Z = \\frac{X - \\mu}{\\sigma}" ]
      ]
    },
    {
      id: 'code-implementation-3',
      title: 'Python Implementation',
      description: 'Running PCA using scikit-learn.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "We use `scikit-learn` in Python to properly standardize the data and extract the Principal Components.",
        "First, `StandardScaler` perfectly scales the data so variables like Market Cap don't dominate.",
        "Then, we initialize `PCA(n_components=2)` to extract only the top 2 components (the ones before the elbow).",
        "Finally, we can access the `explained_variance_ratio_` to verify how much signal we successfully retained."
      ],
      codeSnippet: `import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# 1. Load data
# X contains ['Gross Revenue', 'Net Sales', 'Interest Rate']
df = pd.read_csv('financial_data.csv')
X = df.values

# 2. Standardize the Data (CRITICAL)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 3. Fit PCA (keep top 2 components)
pca = PCA(n_components=2)
principal_components = pca.fit_transform(X_scaled)

# 4. View Variance Explained
print("Variance Explained:", pca.explained_variance_ratio_)
print("Total Signal Retained:", sum(pca.explained_variance_ratio_))`
    }
  ]
};
