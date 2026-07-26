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
      title: 'The Curse of Dimensionality',
      description: 'Why having too many variables is a problem.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In modern finance, we often have hundreds of potential predictors (e.g., macroeconomic indicators, stock fundamentals, sentiment scores).",
        "Including all of them in an OLS regression leads to the **Curse of Dimensionality**: models overfit the noise in the training data and fail to generalize.",
        "Furthermore, many of these variables are highly correlated (multicollinearity), which destabilizes our regression coefficients, as we saw in the previous lesson.",
        "**Dimensionality reduction** techniques aim to compress this large set of variables into a smaller, uncorrelated set that still retains most of the original information."
      ],
      formulas: [
        [ "\\text{Model: } Y = \\beta_0 + \\beta_1 X_1 + \\dots + \\beta_p X_p" ],
        [ "\\text{Overfitting occurs when } p \\text{ is large.}" ],
        [ "\\text{Multicollinearity destabilizes } \\beta." ],
        [ "\\text{Dimensionality Reduction shrinks feature space.}" ]
      ]
    },
    {
      id: 'pca-math',
      title: 'Eigenvectors and Eigenvalues',
      description: 'The mathematics behind PCA.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "**Principal Component Analysis (PCA)** works by finding the directions (vectors) in the data that maximize variance.",
        "Mathematically, we calculate the covariance matrix of our features, and then find its **Eigenvectors** and **Eigenvalues**.",
        "The Eigenvectors represent the directions of the new feature space (the Principal Components). They are orthogonal (uncorrelated) to each other.",
        "The Eigenvalues represent the magnitude of variance explained by each corresponding Principal Component."
      ],
      formulas: [
        [ "\\text{Covariance Matrix: } \\Sigma = \\frac{1}{n-1} X^T X" ],
        [ "\\text{Eigen Decomposition: } \\Sigma v = \\lambda v" ],
        [ "v = \\text{Eigenvector (Principal Component)}" ],
        [ "\\lambda = \\text{Eigenvalue (Variance Explained)}" ]
      ]
    },
    {
      id: 'scree-plot',
      title: 'Explained Variance & The Scree Plot',
      description: 'Choosing how many components to keep.',
      kind: 'pca-scree',
      visibleParams: ['sigma'],
      stepTexts: [
        "Once we calculate the Principal Components, we sort them by their Eigenvalues in descending order.",
        "The first component (PC1) captures the most variance, PC2 captures the second most, and so on. Because they are orthogonal, there is zero multicollinearity between them.",
        "A **Scree Plot** visualizes the percentage of total variance explained by each component. The green line shows the cumulative variance.",
        "We usually look for an 'elbow' in the plot or select enough components to explain a target threshold (e.g., 90%) of the variance. Adjust the `sigma` slider to simulate steeper or flatter variance decay."
      ],
      formulas: [
        [ "\\text{Sort Components by } \\lambda_i \\text{ descending.}" ],
        [ "\\text{Proportion of Variance} = \\frac{\\lambda_i}{\\sum_{j=1}^p \\lambda_j}" ],
        [ "\\text{Cumulative Variance} = \\frac{\\sum_{i=1}^k \\lambda_i}{\\sum_{j=1}^p \\lambda_j}" ],
        [ "\\text{Look for the 'elbow' to select } k." ]
      ]
    },
    {
      id: 'box-cox',
      title: 'Data Transformation (Box-Cox)',
      description: 'Preparing data for PCA.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "PCA is highly sensitive to the scale of the data. If one variable is measured in millions and another in decimals, the larger one will dominate the variance.",
        "Therefore, we must **standardize** the data (mean = 0, variance = 1) before running PCA.",
        "Additionally, PCA assumes linear relationships. If variables are highly skewed, we apply transformations like the **Box-Cox transformation** or log transforms to normalize them.",
        "Only after cleaning, standardizing, and transforming the data can PCA extract meaningful, orthogonal features."
      ],
      formulas: [
        [ "\\text{Variables with large scales dominate PCA.}" ],
        [ "\\text{Standardization: } Z = \\frac{X - \\mu}{\\sigma}" ],
        [ "\\text{Box-Cox: } Y^{(\\lambda)} = \\begin{cases} \\frac{Y^\\lambda - 1}{\\lambda} & (\\lambda \\neq 0) \\\\ \\ln(Y) & (\\lambda = 0) \\end{cases}" ],
        [ "\\text{PCA requires clean, orthogonal targets.}" ]
      ]
    },
    {
      id: 'code-implementation-3',
      title: 'Python Implementation',
      description: 'Running PCA using scikit-learn.',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "We use `scikit-learn` in Python to standardize the data and perform PCA.",
        "First, `StandardScaler` is applied to our feature matrix.",
        "Then, we initialize `PCA()` and `fit_transform` the scaled data to get the new principal components.",
        "Finally, we can access the `explained_variance_ratio_` attribute to plot our scree plot."
      ],
      codeSnippet: `import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

# 1. Load and Standardize data
df = pd.read_csv('features.csv')
X = df.values
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 2. Fit PCA
pca = PCA() # Keep all components for plotting
X_pca = pca.fit_transform(X_scaled)

# 3. Plot Scree Plot
explained_variance = pca.explained_variance_ratio_
cumulative_variance = explained_variance.cumsum()

plt.bar(range(1, len(explained_variance)+1), explained_variance)
plt.plot(range(1, len(cumulative_variance)+1), cumulative_variance, 'r-')
plt.title('PCA Scree Plot')
plt.show()`
    }
  ]
};
