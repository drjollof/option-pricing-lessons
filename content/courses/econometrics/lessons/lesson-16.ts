import { Lesson } from '@/content/types';

export const lesson16: Lesson = {
  id: 'lesson-16',
  title: 'Lesson 16: ARIMA Model',
  description: 'Synthesize AR and MA models into the powerful ARIMA framework, and master the Box-Jenkins methodology for model selection.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l16-p1-arma-model',
      title: 'Phase 1: ARMA(p,q) and Parsimony',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "By combining the Autoregressive (AR) and Moving Average (MA) components, we get the **ARMA(p, q)** model. It uses both past prices and past shocks to predict the future.",
        "Why use both? Because of the **Principle of Parsimony**. We want the simplest possible model (fewest parameters) that adequately captures the data.",
        "An ARMA(1,1) model might perfectly fit a dataset using only 2 parameters. To achieve the exact same fit using only an AR model, you might need an AR(50) model with 50 parameters! This causes massive overfitting."
      ],
      formulas: [
        [ "\\text{ARMA}(p, q):" ],
        [ "Y_t = c + \\sum_{i=1}^p \\phi_i Y_{t-i} + \\sum_{j=1}^q \\theta_j \\epsilon_{t-j} + \\epsilon_t" ]
      ]
    },
    {
      id: 'l16-p2-arima-integration',
      title: 'Phase 2: ARIMA(p,d,q) and Integration',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "ARMA models mathematically require the underlying data to be stationary. But we know real stock prices are non-stationary random walks!",
        "To solve this, we add a middle component: **I (Integrated)**, representing the degree of differencing. This creates the **ARIMA(p,d,q)** model.",
        "If the differencing degree is 1, we take the first difference of the data (Daily Returns). We then run an ARMA model on those returns, and finally 'integrate' (cumulative sum) the forecast back into standard price levels."
      ],
      formulas: [
        [ "\\text{ARIMA}(p, d, q):" ],
        [ "p = \\text{number of autoregressive lags (AR)}" ],
        [ "d = \\text{order of differencing (I)}" ],
        [ "q = \\text{number of moving average lags (MA)}" ],
        [ "\\text{If } d=1, \\text{ model is fit on } \\Delta Y_t = Y_t - Y_{t-1}" ]
      ]
    },
    {
      id: 'l16-p3-model-selection',
      title: 'Phase 3: Model Selection (AIC vs BIC)',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "How do we decide if an ARIMA(1,1,1) is better than an ARIMA(2,1,2)? We use **Information Criteria**.",
        "The **Akaike Information Criterion (AIC)** rewards a model for fitting the data well (maximizing log-likelihood), but penalizes it for using too many parameters.",
        "**Calculation Example:** Model A has a log-likelihood of -50 with 2 parameters. Model B fits better with -40 but uses 8 parameters.",
        "See the LaTeX block for the exact numerical breakdown. Lower AIC is always better, so Model B ultimately wins despite its heavier penalty."
      ],
      formulas: [
        [ "\\text{AIC} = 2k - 2\\ln(\\hat{L})" ],
        [ "\\text{Model A: } L = -50, k = 2 \\implies \\text{AIC} = 2(2) - 2(-50) = 4 + 100 = 104" ],
        [ "\\text{Model B: } L = -40, k = 8 \\implies \\text{AIC} = 2(8) - 2(-40) = 16 + 80 = 96" ],
        [ "\\text{BIC} = k\\ln(n) - 2\\ln(\\hat{L}) \\implies \\text{Penalizes complex models more heavily.}" ],
        [ "\\text{Goal: Minimize AIC/BIC.}" ]
      ]
    },
    {
      id: 'l16-p4-box-jenkins',
      title: 'Phase 4: The Box-Jenkins Methodology',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "The gold-standard workflow for time series forecasting is the **Box-Jenkins Methodology**. It has three steps:",
        "**1. Identification:** Use Augmented Dickey-Fuller tests to find the differencing degree (making it stationary). Use ACF/PACF plots to estimate initial guesses for the AR and MA lags.",
        "**2. Estimation:** Use Maximum Likelihood Estimation (MLE) or standard regression to find the exact numerical values for the AR and MA coefficients.",
        "**3. Diagnostics:** Analyze the residuals (the model's errors). If the model is good, the residuals must look exactly like White Noise!"
      ],
      formulas: [
        [ "\\text{Box-Jenkins Workflow:}" ],
        [ "\\text{1. Identify } (d, p, q)" ],
        [ "\\text{2. Estimate Parameters } (\\phi, \\theta)" ],
        [ "\\text{3. Diagnose Residuals } (\\epsilon_t \\sim \\text{White Noise})" ]
      ]
    },
    {
      id: 'l16-p5-ljung-box',
      title: 'Phase 5: Residual Diagnostics (Ljung-Box Test)',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "To formally prove our residuals are white noise, we use the **Ljung-Box Test**. Instead of testing one lag at a time, it tests a whole group of lags simultaneously.",
        "**Calculation Example:** We test 2 lags on 100 data points. The residual autocorrelations are 0.1 and -0.05.",
        "The Q-statistic squares them, divides by a degree of freedom, and sums them. Review the math panel below for the calculation.",
        "We compare the resulting Q value to a Chi-Square distribution. If the p-value is large, we *Fail to Reject* the null hypothesis, meaning the residuals are successfully proven to be pure white noise!"
      ],
      formulas: [
        [ "\\text{Ljung-Box Q-Statistic:}" ],
        [ "Q = n(n+2) \\sum_{k=1}^h \\frac{\\hat{\\rho}_k^2}{n-k}" ],
        [ "\\text{Given: } n=100, h=2, \\rho_1=0.1, \\rho_2=-0.05" ],
        [ "Q = 100(102) \\times \\left[ \\frac{0.1^2}{99} + \\frac{(-0.05)^2}{98} \\right]" ],
        [ "Q = 10200 \\times \\left[ \\frac{0.01}{99} + \\frac{0.0025}{98} \\right] = 10200 \\times [0.000101 + 0.000025]" ],
        [ "Q = 10200 \\times 0.000126 = 1.285" ],
        [ "\\text{Null Hypothesis } (H_0): \\text{Residuals are White Noise}" ],
        [ "\\text{Target: } p\\text{-value} > 0.05 \\implies \\text{Good Model}" ]
      ],
      codeSnippet: `import pandas as pd
import statsmodels.api as sm

# Load sample data (e.g., macroeconomic data)
data = sm.datasets.macrodata.load_pandas().data
inflation = data['infl'].dropna()

# 1. Fit an ARIMA(1, 1, 1) model
# order = (p, d, q)
model = sm.tsa.ARIMA(inflation, order=(1, 1, 1))
results = model.fit()

print(results.summary())

# 2. Ljung-Box Test on Residuals
residuals = results.resid
lb_test = sm.stats.acorr_ljungbox(residuals, lags=[10], return_df=True)

print("\\nLjung-Box Test (Lag 10):")
print(f"p-value: {lb_test['lb_pvalue'].iloc[0]:.4f}")
if lb_test['lb_pvalue'].iloc[0] > 0.05:
    print("-> Residuals are White Noise. Model is valid!")
else:
    print("-> Residuals have autocorrelation. Model failed.")`
    }
  ]
};
