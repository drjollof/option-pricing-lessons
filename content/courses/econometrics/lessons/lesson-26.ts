import { Lesson } from '@/content/types';

export const lesson26: Lesson = {
  id: 'lesson-26',
  title: 'Factor Analysis',
  description: 'Discover how to uncover latent, unobservable variables driving market movements using Confirmatory Factor Analysis.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'fa-intuition',
      title: 'Latent Factors vs Observed Variables',
      kind: 'factor-analysis',
      visibleParams: [],
      stepTexts: [
        "In finance, we often talk about 'Market Sentiment' or 'Tech Momentum'. But you cannot measure these directly. They are **Latent Variables** (hidden).",
        "What we CAN measure are **Manifest Variables**: the actual daily returns of stocks like Apple, Microsoft, and Google.",
        "**Factor Analysis** assumes that the manifest variables we see are just reflections of a few underlying latent factors, plus some unique, idiosyncratic noise (measurement error)."
      ],
      formulas: [
        [ "\\text{Manifest: } X = \\text{Observed Stock Returns}" ],
        [ "\\text{Latent: } F = \\text{Hidden Market Factors}" ]
      ]
    },
    {
      id: 'l26-p2-factor-equation',
      title: 'The Factor Equation',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "The mathematical model connects the visible to the hidden using a **Factor Loading Matrix** ($\\Lambda$).",
        "Equation: $X = \\Lambda F + \\epsilon$.",
        "**Numeric Example:** Suppose we have a 'Tech Factor'. Apple has a loading of $\\Lambda = 1.5$. This means if the Tech Factor moves by $1\\%$, Apple's return is driven up by $1.5\\%$.",
        "The $\\epsilon$ term is Apple's unique idiosyncratic return (e.g. an earnings beat), completely unrelated to the broader Tech Factor."
      ],
      formulas: [
        [ "\\text{Factor Model: } X = \\Lambda F + \\epsilon" ],
        [ "\\text{Where:}" ],
        [ "\\Lambda = \\text{Factor Loadings (Sensitivities)}" ],
        [ "F = \\text{Latent Factors}" ],
        [ "\\epsilon = \\text{Idiosyncratic Errors}" ]
      ]
    },
    {
      id: 'l26-p3-efa-vs-cfa',
      title: 'Exploratory vs Confirmatory',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "There are two main types of Factor Analysis.",
        "**Exploratory Factor Analysis (EFA):** The algorithm is blind. It looks at the correlation matrix of 500 stocks and guesses how many factors exist and what their loadings are.",
        "**Confirmatory Factor Analysis (CFA):** You impose a theory. You tell the model: 'Apple and Google ONLY load on Factor 1. Ford and GM ONLY load on Factor 2.'",
        "CFA then tests if your strict theory actually fits the observed covariance matrix. If it does, your structural theory is confirmed!"
      ],
      formulas: [
        [ "\\text{EFA: Let the data decide the structure.}" ],
        [ "\\text{CFA: Test a strict theoretical structure.}" ]
      ]
    },
    {
      id: 'l26-p4-numeric-example',
      title: 'Calculating Returns from Factors',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Let's calculate specific returns based on a 2-factor CFA model.",
        "Today, the Latent Factors move: Tech Factor ($F_1$) is $+2.0\\%$. Value Factor ($F_2$) is $-1.0\\%$.",
        "**Stock A (Apple):** Loads strictly on Tech ($\\Lambda_{A1} = 1.2, \\Lambda_{A2} = 0.0$). Apple's expected return is $1.2(2.0\\%) + 0.0(-1.0\\%) = +2.4\\%$.",
        "**Stock B (Ford):** Loads strictly on Value ($\\Lambda_{B1} = 0.0, \\Lambda_{B2} = 0.8$). Ford's expected return is $0.0(2.0\\%) + 0.8(-1.0\\%) = -0.8\\%$.",
        "Any deviation from these expected returns is captured by their unique $\\epsilon$!"
      ],
      formulas: [
        [ "\\text{Factors: } F_1 = 2.0\\%, F_2 = -1.0\\%" ],
        [ "\\text{Apple: } R_A = 1.2(2.0\\%) + 0 = 2.4\\%" ],
        [ "\\text{Ford: } R_B = 0 + 0.8(-1.0\\%) = -0.8\\%" ]
      ],
      codeSnippet: `import numpy as np
import pandas as pd
from factor_analyzer import FactorAnalyzer

# Simulate Data: 3 Tech Stocks, 3 Value Stocks
np.random.seed(42)
F_tech = np.random.normal(0, 1, 500)
F_value = np.random.normal(0, 1, 500)

# Generate Manifest Variables with specific loadings
T1 = 1.5 * F_tech + np.random.normal(0, 0.5, 500)
T2 = 1.2 * F_tech + np.random.normal(0, 0.5, 500)
T3 = 1.0 * F_tech + np.random.normal(0, 0.5, 500)
V1 = 0.9 * F_value + np.random.normal(0, 0.5, 500)
V2 = 1.1 * F_value + np.random.normal(0, 0.5, 500)
V3 = 0.8 * F_value + np.random.normal(0, 0.5, 500)

df = pd.DataFrame({'T1': T1, 'T2': T2, 'T3': T3, 'V1': V1, 'V2': V2, 'V3': V3})

# Perform Exploratory Factor Analysis (EFA) expecting 2 factors
fa = FactorAnalyzer(n_factors=2, rotation='varimax')
fa.fit(df)

# Check the Loadings Matrix (Lambda)
loadings = pd.DataFrame(fa.loadings_, index=df.columns, columns=['Factor 1', 'Factor 2'])
print("Factor Loadings (Lambda):")
print(np.round(loadings, 2))
# Notice how T1,T2,T3 heavily load on one factor, and V1,V2,V3 on the other!`
    }
  ]
};
