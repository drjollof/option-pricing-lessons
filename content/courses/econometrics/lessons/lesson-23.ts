import { Lesson } from '@/content/types';

export const lesson23: Lesson = {
  id: 'lesson-23',
  title: 'Ergodicity and VAR',
  description: 'Explore Vector Autoregression (VAR) to model multiple interacting time series and understand the concept of Ergodicity.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l23-p1-ergodicity',
      title: 'What is Ergodicity?',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In statistics, a process is **Ergodic** if its statistical properties (like its mean or variance) can be deduced from a single, sufficiently long sample of the process.",
        "It means the *Time Average* (one path over a long time) equals the *Ensemble Average* (many parallel paths at one time).",
        "**Numeric Example:** If a stock returns $5\\%$ a year on average across $100$ parallel universes (Ensemble), an Ergodic process means $1$ single universe observed over $100$ years will also average exactly $5\\%$.",
        "Financial markets are often Non-Ergodic because absorbing states (like bankruptcy) mean a single long path can end at $0$, fundamentally breaking the time average!"
      ],
      formulas: [
        [ "\\text{Ergodic Condition:}" ],
        [ "\\text{Time Average} = \\text{Ensemble Average}" ]
      ]
    },
    {
      id: 'l23-p2-what-is-var',
      title: 'Vector Autoregression (VAR)',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "So far, we modeled a single variable depending on its own past (AR models). But what if two variables impact each other? For example, Inflation and Interest Rates.",
        "A **Vector Autoregression (VAR)** model handles multiple time series simultaneously. Instead of a single value $y_t$, we use a vector $Y_t$, and instead of a single coefficient $\\phi$, we use a matrix $A$.",
        "A VAR(1) model equation looks identical to an AR(1) model, but everything is in matrix form!"
      ],
      formulas: [
        [ "\\text{AR(1): } y_t = c + \\phi y_{t-1} + \\epsilon_t" ],
        [ "\\text{VAR(1): } Y_t = C + A Y_{t-1} + E_t" ],
        [ "\\text{Where } Y_t, C, E_t \\text{ are vectors, and } A \\text{ is a matrix.}" ]
      ]
    },
    {
      id: 'l23-p3-var-calculation',
      title: 'VAR Numeric Example',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Let's calculate a VAR(1) step for Inflation ($I$) and Rates ($R$).",
        "Suppose the matrix $A$ tells us: Inflation depends on past Inflation ($0.6$) and past Rates ($-0.2$). Rates depend on past Rates ($0.8$) and past Inflation ($0.4$).",
        "Yesterday, Inflation was $3.0\\%$ and Rates were $2.0\\%$.",
        "**Calculation:** Today's Inflation $= 0.6(3.0) - 0.2(2.0) = 1.8 - 0.4 = 1.4\\%$.",
        "**Calculation:** Today's Rates $= 0.8(2.0) + 0.4(3.0) = 1.6 + 1.2 = 2.8\\%$.",
        "The variables dynamically update each other!"
      ],
      formulas: [
        [ "\\text{VAR(1) System:}" ],
        [ "I_t = 0.6 I_{t-1} - 0.2 R_{t-1}" ],
        [ "R_t = 0.4 I_{t-1} + 0.8 R_{t-1}" ],
        [ "\\text{Given: } I_{t-1} = 3.0, R_{t-1} = 2.0" ],
        [ "I_t = 0.6(3.0) - 0.2(2.0) = 1.4" ],
        [ "R_t = 0.4(3.0) + 0.8(2.0) = 2.8" ]
      ]
    },
    {
      id: 'l23-p4-var-stability',
      title: 'VAR Stability',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "For an AR(1) model to be stable (stationary), $|\\phi| < 1$.",
        "For a VAR(1) model to be stable, the absolute values of the **eigenvalues** of the matrix $A$ must be strictly less than $1$.",
        "If they are less than $1$, the system is stable and shocks will eventually decay to zero. If any eigenvalue is $\\geq 1$, the entire system is unstable and will explode!",
        "Econometricians check this before proceeding to model structural shocks or policy changes."
      ],
      formulas: [
        [ "\\text{AR Stability: } |\\phi| < 1" ],
        [ "\\text{VAR Stability: } |\\lambda_i| < 1 \\quad \\forall i" ],
        [ "\\text{Where } \\lambda_i \\text{ are the eigenvalues of matrix } A." ]
      ],
      codeSnippet: `import numpy as np
from statsmodels.tsa.api import VAR
import pandas as pd

# Simulate VAR(1) Data
np.random.seed(42)
A = np.array([[0.6, -0.2], 
              [0.4,  0.8]])

# Check stability (Eigenvalues)
eigenvalues = np.linalg.eigvals(A)
print(f"Eigenvalues: {eigenvalues}")
print(f"Stable? {np.all(np.abs(eigenvalues) < 1)}")

# Generate data
data = np.zeros((500, 2))
for t in range(1, 500):
    data[t] = A @ data[t-1] + np.random.normal(0, 1, 2)

df = pd.DataFrame(data, columns=['Inflation', 'Rates'])

# Fit VAR model
model = VAR(df)
results = model.fit(1)
print(results.summary())

# Plot Impulse Response Function (IRF)
irf = results.irf(10)
# irf.plot() # In a real environment, this displays the ripple effects of shocks!`
    }
  ]
};
