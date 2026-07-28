import { Lesson } from '@/content/types';

export const lesson27: Lesson = {
  id: 'lesson-27',
  title: 'Network Theory',
  description: 'Map the financial system as a web of interconnected nodes to understand systemic risk and contagion using Graphical LASSO.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l27-p1-markets-as-networks',
      title: 'Markets as Networks',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "A financial market isn't just a list of isolated stocks; it is a complex **Network (or Graph)**.",
        "In this network, **Nodes** represent entities (like Banks, Stocks, or Countries).",
        "**Edges** represent the connections between them (like debt obligations, or price correlations).",
        "**Numeric Example:** If Bank A owes Bank B $\\$50M$, there is a directed edge from A to B with a weight of $50$. If a node fails, the shock travels along these edges, causing Systemic Contagion!"
      ],
      formulas: [
        [ "\\text{Graph } G = (V, E)" ],
        [ "V = \\text{Vertices (Nodes)}" ],
        [ "E = \\text{Edges (Connections)}" ]
      ]
    },
    {
      id: 'l27-p2-adjacency-matrix',
      title: 'The Adjacency Matrix',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "A network is mathematically represented by an **Adjacency Matrix** ($A$).",
        "If there are $3$ banks in the system, $A$ is a $3 \\times 3$ matrix.",
        "If row $1$, column $2$ has a value of $0.8$ (i.e., $A[1,2] = 0.8$), it means Node 1 and Node 2 are highly connected.",
        "A 'Dense' matrix has many non-zero values, meaning high systemic risk: a shock to one bank will instantly travel to almost every other bank."
      ],
      formulas: [
        [ "\\text{Adjacency Matrix } A_{i,j}" ],
        [ "\\text{If } A_{i,j} = 0 \\implies \\text{No direct connection}" ],
        [ "\\text{If } A_{i,j} \\neq 0 \\implies \\text{Direct edge exists}" ]
      ]
    },
    {
      id: 'l27-p3-precision-matrix',
      title: 'The Precision Matrix',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "If we build a network using standard Correlation, it creates *spurious* edges. If A is correlated to B, and B is correlated to C, the math makes it look like A is correlated to C, even if they never interact!",
        "Network Theory instead uses the **Precision Matrix**, which is the exact inverse of the Covariance matrix.",
        "The Precision Matrix gives the **Partial Correlation**: the connection between A and C *after mathematically removing the effect of B*.",
        "**Numeric Example:** Standard correlation of A and C is $0.6$. But after controlling for B, their Partial Correlation drops to $0.0$. The fake edge disappears!"
      ],
      formulas: [
        [ "\\text{Covariance Matrix: } \\Sigma" ],
        [ "\\text{Precision Matrix: } \\Theta = \\Sigma^{-1}" ],
        [ "\\Theta_{i,j} \\implies \\text{Direct connection, controlling for all other nodes.}" ]
      ]
    },
    {
      id: 'l27-p4-graphical-lasso',
      title: 'Graphical LASSO',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Real financial data is extremely noisy, meaning the Precision Matrix will be full of tiny, fake edges (like $0.02$).",
        "**Graphical LASSO (GLASSO)** solves this by applying an L1 penalty to the Precision Matrix. This penalty forces all the tiny, insignificant connections to become exactly $0$.",
        "This results in a **Sparse** network. By stripping away the noise, GLASSO reveals the true, structural backbone of the financial system!"
      ],
      formulas: [
        [ "\\text{GLASSO Objective:}" ],
        [ "\\max_{\\Theta} \\left( \\log \\det(\\Theta) - \\text{tr}(S\\Theta) - \\lambda ||\\Theta||_1 \\right)" ],
        [ "\\text{Where } \\lambda \\text{ forces sparsity (removes weak edges).}" ]
      ],
      codeSnippet: `import numpy as np
import pandas as pd
from sklearn.covariance import GraphicalLassoCV

# Simulate data for 5 connected banks
np.random.seed(42)
n_samples, n_features = 100, 5

# Create a sparse Precision Matrix (True Network Backbone)
true_precision = np.eye(n_features)
true_precision[0, 1] = true_precision[1, 0] = 0.6 # Edge between 0 and 1
true_precision[1, 2] = true_precision[2, 1] = 0.5 # Edge between 1 and 2
# Nodes 3 and 4 are isolated

# Generate covariance and data
true_cov = np.linalg.inv(true_precision)
X = np.random.multivariate_normal(np.zeros(n_features), true_cov, n_samples)

# Fit Graphical LASSO
# It will automatically find the best penalty (alpha) using Cross-Validation
glasso = GraphicalLassoCV()
glasso.fit(X)

print("Estimated Precision Matrix (Network Edges):")
print(np.round(glasso.precision_, 2))
# Notice how it correctly identified the strong edges and forced others near 0!`
    }
  ]
};
