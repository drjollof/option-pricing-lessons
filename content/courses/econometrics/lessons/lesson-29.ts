import { Lesson } from '@/content/types';

export const lesson29: Lesson = {
  id: 'lesson-29',
  title: 'Supervised & Unsupervised Learning',
  description: 'Discover how to classify financial states and cluster similar assets using LDA, K-Means, and Hierarchical clustering.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l29-p1-supervised-vs-unsupervised',
      title: 'Supervised vs Unsupervised',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Machine Learning tasks fall into two main categories.",
        "**Supervised Learning:** You have data WITH labels. For example, you have a dataset of $500$ companies, and you know exactly which ones went bankrupt (Label = $1$) and which survived (Label = $0$). You train a model to predict the label of a *new* company.",
        "**Unsupervised Learning:** You have data WITHOUT labels. You just have the daily returns of $500$ stocks. You ask the algorithm to naturally group them together based on their mathematical similarities."
      ],
      formulas: [
        [ "\\text{Supervised: } Y = f(X) \\quad (Y \\text{ is known during training})" ],
        [ "\\text{Unsupervised: Find hidden structure in } X \\quad (Y \\text{ is unknown})" ]
      ]
    },
    {
      id: 'l29-p2-lda',
      title: 'Linear Discriminant Analysis (LDA)',
      kind: 'machine-learning',
      overrideParams: { mode: 'lda' } as any,
      visibleParams: [],
      stepTexts: [
        "**LDA** is a Supervised classification method.",
        "Imagine plotting Bankrupt companies and Healthy companies on a chart based on their Debt and Cash Flow.",
        "LDA draws a linear boundary (a hyperplane) right through the data. It calculates the boundary that *maximizes* the distance between the two group means, while *minimizing* the variance within each group.",
        "**Numeric Example:** If a new company has high Debt and low Cash Flow, it falls on the 'Bankrupt' side of the LDA boundary, and the model classifies it as high risk!"
      ],
      formulas: [
        [ "\\text{LDA Objective:}" ],
        [ "\\max \\frac{\\text{Variance Between Classes}}{\\text{Variance Within Classes}}" ],
        null,
        null
      ]
    },
    {
      id: 'l29-p3-kmeans',
      title: 'K-Means Clustering',
      kind: 'machine-learning',
      overrideParams: { mode: 'kmeans' } as any,
      visibleParams: [],
      stepTexts: [
        "**K-Means** is an Unsupervised method. You must tell the algorithm how many clusters ($K$) you want to find.",
        "1. It randomly places $K$ 'centroids' (center points) on the data.",
        "2. Every stock is assigned to the centroid it is closest to.",
        "3. The centroid then moves to the mathematical average (mean) of all the stocks assigned to it.",
        "4. This repeats until the centroids stop moving.",
        "**Result:** Without giving it any labels, it might group the stocks into 'High Volatility Tech', 'Stable Utilities', and 'Cyclical Industrials'!"
      ],
      formulas: [
        [ "\\text{Minimize: } \\sum_{i=1}^{K} \\sum_{x \\in C_i} ||x - \\mu_i||^2" ],
        [ "\\text{Where } \\mu_i \\text{ is the mean of cluster } C_i" ],
        null,
        null,
        null,
        null
      ]
    },
    {
      id: 'l29-p4-hierarchical',
      title: 'Hierarchical Clustering',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "What if you don't know what $K$ should be? Enter **Hierarchical Clustering**.",
        "This algorithm starts by treating every single stock as its own cluster. It then finds the two most mathematically similar stocks and merges them.",
        "It repeats this merging process over and over until every stock is merged into one giant cluster.",
        "This builds a tree called a **Dendrogram**. You can literally look at the tree and slice it at any height to choose the perfect number of clusters for your portfolio!"
      ],
      formulas: [
        [ "\\text{Distance Metrics:}" ],
        [ "\\text{Euclidean: } d(p,q) = \\sqrt{\\sum (q_i - p_i)^2}" ],
        [ "\\text{Linkage: How to measure distance between merged clusters (e.g., Ward\\'s method).}" ]
      ],
      codeSnippet: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis

# Simulate Data
np.random.seed(42)
# Healthy Companies (High Cash Flow, Low Debt)
healthy = np.random.normal([5, 1], 1, size=(50, 2))
# Bankrupt Companies (Low Cash Flow, High Debt)
bankrupt = np.random.normal([1, 5], 1, size=(50, 2))

X = np.vstack([healthy, bankrupt])
y = np.array([0]*50 + [1]*50) # 0 = Healthy, 1 = Bankrupt

# --- SUPERVISED: LDA ---
lda = LinearDiscriminantAnalysis()
lda.fit(X, y)
new_company = np.array([[2, 4]]) # Low Cash Flow, High Debt
prediction = lda.predict(new_company)
print(f"LDA Prediction (0=Healthy, 1=Bankrupt): {prediction[0]}")

# --- UNSUPERVISED: K-Means ---
# Pretend we don't know the labels (y), just the data (X)
kmeans = KMeans(n_clusters=2, random_state=42, n_init='auto')
kmeans.fit(X)
print(f"K-Means cluster assignments for first 5 healthy companies: {kmeans.labels_[:5]}")
# It naturally separates them into two distinct groups based purely on distance!`
    }
  ]
};
