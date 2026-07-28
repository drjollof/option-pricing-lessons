import { Lesson } from '@/content/types';

export const lesson25: Lesson = {
  id: 'lesson-25',
  title: 'VECM and Johansen Test',
  description: 'Upgrade to the Vector Error Correction Model (VECM) for multiple cointegrated variables, and learn the Johansen Test for matrix rank.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l25-p1-why-vecm',
      title: 'Why VECM?',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "The basic ECM we built during our study of Cointegration works well for two variables, assuming one is 'dependent' (it adjusts) and one is 'independent' (it doesn't).",
        "In reality, both variables usually adjust! If the spread between Stock A and Stock B is too wide, Stock A might drop AND Stock B might rise simultaneously.",
        "The **Vector Error Correction Model (VECM)** handles this by allowing a matrix of adjustments for an entire system of variables, acting like a Cointegrated version of a VAR model."
      ],
      formulas: [
        [ "\\text{ECM: } \\Delta y_t = \\alpha e_{t-1} + \\dots" ],
        [ "\\text{VECM: } \\Delta Y_t = \\Pi Y_{t-1} + \\dots" ],
        [ "\\text{Where } \\Pi \\text{ is a matrix capturing the error corrections.}" ]
      ]
    },
    {
      id: 'l25-p2-vecm-math',
      title: 'The Pi Matrix',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "The core of the VECM is the $\\Pi$ matrix. It is actually factored into two smaller matrices: $\\Pi = \\alpha \\beta'$.",
        "$\\beta$ contains the **Cointegrating Vectors** (the long-term equilibrium relationships, like $A - 2B = 0$).",
        "$\\alpha$ contains the **Speed of Adjustment** coefficients for every variable in the system."
      ],
      formulas: [
        [ "\\Pi = \\alpha \\beta'" ],
        [ "\\alpha = \\text{Speeds of Adjustment}" ],
        [ "\\beta = \\text{Cointegrating Relationships}" ]
      ]
    },
    {
      id: 'l25-p3-vecm-calculation',
      title: 'VECM Numeric Calculation',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Let's trace a VECM step manually for Stock A and Stock B.",
        "The spread yesterday was $e_{t-1} = A - 2B = 10$. (Stock A is priced $\\$10$ too high).",
        "The vector $\\alpha$ has two speeds: $\\alpha_A = -0.2$ and $\\alpha_B = +0.1$.",
        "**Calculation:** $\\Delta A_t = -0.2(10) = -2.0$. Stock A drops by $\\$2.00$.",
        "**Calculation:** $\\Delta B_t = +0.1(10) = +1.0$. Stock B rises by $\\$1.00$.",
        "Notice that $\\alpha_B$ is *positive*. Because B is subtracted in the spread ($A - 2B$), B must go *up* to help shrink a positive spread!"
      ],
      formulas: [
        [ "\\text{Spread: } e_{t-1} = 10" ],
        [ "\\Delta A_t = \\alpha_A (e_{t-1}) = -0.2(10) = -2.0" ],
        [ "\\Delta B_t = \\alpha_B (e_{t-1}) = 0.1(10) = 1.0" ]
      ]
    },
    {
      id: 'l25-p4-johansen-test',
      title: 'The Johansen Test',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "The Engle-Granger method from our previous lesson on Cointegration only finds 1 cointegrating relationship. But a system of 5 variables could have up to 4 distinct relationships!",
        "The **Johansen Test** finds the exact number of relationships by checking the **Rank** of the matrix $\\Pi$. It calculates the eigenvalues of $\\Pi$.",
        "If an eigenvalue is significantly greater than zero, it represents a valid cointegrating vector.",
        "**Numeric Example:** We test $r=0$ (no relationships) and reject it because the Trace Statistic ($45.2$) > Critical Value ($29.7$). We then test $r \\leq 1$ and fail to reject it ($12.1 < 15.4$). Thus, there is exactly $1$ relationship!"
      ],
      formulas: [
        [ "\\text{Johansen Trace Test:}" ],
        [ "H_0: \\text{Rank} = r \\quad \\text{vs} \\quad H_1: \\text{Rank} > r" ],
        [ "r=0 \\implies \\text{Reject (45.2 > 29.7)}" ],
        [ "r \\leq 1 \\implies \\text{Fail to Reject (12.1 < 15.4)}" ],
        [ "\\implies \\text{Rank is exactly 1.}" ]
      ],
      codeSnippet: `import numpy as np
import pandas as pd
from statsmodels.tsa.vector_ar.vecm import coint_johansen

# Simulate 3 variables with 1 cointegrating relationship
np.random.seed(42)
X = np.cumsum(np.random.normal(0, 1, 500)) # Random Walk
Y = np.cumsum(np.random.normal(0, 1, 500)) # Random Walk
Z = 0.5 * X + 1.5 * Y + np.random.normal(0, 1, 500) # Cointegrated with X and Y

df = pd.DataFrame({'X': X, 'Y': Y, 'Z': Z})

# Run Johansen Test
# det_order = -1 (no constant/trend in cointegrating relation)
# k_ar_diff = 1 (1 lag of differences)
johansen = coint_johansen(df, det_order=-1, k_ar_diff=1)

print("Trace Statistics:")
print(johansen.lr1)
print("Critical Values (90%, 95%, 99%):")
print(johansen.cvt)`
    }
  ]
};
