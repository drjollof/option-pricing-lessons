import { Lesson } from '@/content/types';

export const lesson19: Lesson = {
  id: 'lesson-19',
  title: 'Bayesian Estimation for GARCH',
  description: 'Discover how Bayesian inference allows us to estimate GARCH volatility parameters by combining prior beliefs with observed market data.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l19-p1-frequentist-vs-bayesian',
      title: 'MLE vs Bayesian',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Traditionally, GARCH models are estimated using **Maximum Likelihood Estimation (MLE)**, which finds the parameters that make the observed data most probable.",
        "However, when data is scarce or highly erratic, MLE can crash or return impossible parameters (like persistence $\\alpha_1 + \\beta_1 > 1$, which violates stationarity).",
        "**Bayesian Estimation** solves this by injecting *Prior Beliefs* into the math. If we mathematically inform the model that $\\alpha_1$ is usually around $0.2$, the model requires overwhelming data evidence to stray far from that number."
      ],
      formulas: [
        [ "\\text{Bayes\\' Theorem:}" ],
        [ "P(\\theta | \\text{Data}) = \\frac{P(\\text{Data} | \\theta) \\times P(\\theta)}{P(\\text{Data})}" ],
        [ "\\text{Posterior} \\propto \\text{Likelihood} \\times \\text{Prior}" ]
      ]
    },
    {
      id: 'l19-p2-the-prior',
      title: 'Setting the Prior',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Let's trace a concrete Bayesian update for a single GARCH parameter: $\\alpha_1$ (the reaction to yesterday's shock).",
        "**The Prior:** Before looking at any data, we believe $\\alpha_1$ is typically around $0.20$. We aren't completely certain, so we assign a variance of $0.04$.",
        "Mathematically, our Prior is a Normal distribution: $\\mu_0 = 0.20$, $\\sigma_0^2 = 0.04$.",
        "The **Precision** of our belief is the inverse of variance: $1 / 0.04 = 25$. High precision means we are very confident."
      ],
      formulas: [
        [ "\\text{Prior Belief for } \\alpha_1:" ],
        [ "\\mu_0 = 0.20" ],
        [ "\\sigma_0^2 = 0.04" ],
        [ "\\text{Prior Precision } (\\tau_0) = \\frac{1}{\\sigma_0^2} = \\frac{1}{0.04} = 25" ]
      ]
    },
    {
      id: 'l19-p3-the-likelihood',
      title: 'The Likelihood (The Data)',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Now we look at the actual market data. We observe a month of wild, clustering volatility.",
        "**The Likelihood:** If we only used the data (MLE), the math suggests a much higher reaction parameter: $\\alpha_{MLE} = 0.50$, with a variance of $0.06$.",
        "The data is quite noisy, so its Precision is $1 / 0.06 = 16.67$.",
        "Notice that our Prior Precision ($25$) is higher than the Data Precision ($16.67$). We trust our prior slightly more than this noisy dataset."
      ],
      formulas: [
        [ "\\text{Data (Likelihood) for } \\alpha_1:" ],
        [ "\\alpha_{MLE} = 0.50" ],
        [ "\\sigma_{MLE}^2 = 0.06" ],
        [ "\\text{Data Precision } (\\tau_{MLE}) = \\frac{1}{\\sigma_{MLE}^2} = \\frac{1}{0.06} \\approx 16.67" ]
      ]
    },
    {
      id: 'l19-p4-posterior-calculation',
      title: 'Calculating the Posterior',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "The magic of Bayesian inference is the **Posterior**. For a Normal distribution, the Posterior Mean is simply a *precision-weighted average* of the Prior and the Likelihood.",
        "Let's calculate the weights: We multiply the Prior ($0.20$) by its precision ($25$), and the Data ($0.50$) by its precision ($16.67$).",
        "We divide the sum by the total precision ($25 + 16.67 = 41.67$).",
        "The resulting Bayesian estimate for $\\alpha_1$ is **$0.32$**. The Bayesian method gracefully pulled the erratic data estimate ($0.50$) down toward our logical prior ($0.20$)!"
      ],
      formulas: [
        [ "\\text{Posterior Mean } (\\mu_n) = \\frac{\\tau_0 \\mu_0 + \\tau_{MLE} \\alpha_{MLE}}{\\tau_0 + \\tau_{MLE}}" ],
        [ "\\mu_n = \\frac{(25 \\times 0.20) + (16.67 \\times 0.50)}{25 + 16.67}" ],
        [ "\\mu_n = \\frac{5.0 + 8.335}{41.67}" ],
        [ "\\mu_n = \\frac{13.335}{41.67} = 0.32" ],
        [ "\\text{Final Estimate: } \\alpha_1 = 0.32" ]
      ]
    },
    {
      id: 'l19-p5-mcmc',
      title: 'MCMC in Practice',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In our previous example, we used a simple precision-weighted average. But real GARCH models are highly non-linear, meaning we cannot use simple algebra to find the Posterior.",
        "Instead, econometricians use **Markov Chain Monte Carlo (MCMC)** algorithms (like the Metropolis-Hastings algorithm).",
        "MCMC works by randomly guessing thousands of parameter combinations, accepting or rejecting them based on how well they fit the Prior and Likelihood.",
        "The result is a rich, numerical distribution of possible GARCH parameters, giving us not just a single estimate, but a full measure of uncertainty!"
      ],
      formulas: [
        [ "\\text{Metropolis-Hastings Acceptance Ratio:}" ],
        [ "\\alpha = \\min \\left( 1, \\frac{P(\\text{Data} | \\theta_{new}) P(\\theta_{new})}{P(\\text{Data} | \\theta_{old}) P(\\theta_{old})} \\right)" ],
        [ "\\text{If the new guess is better, accept it.}" ],
        null
      ],
      codeSnippet: `import numpy as np
import pymc as pm
import pandas as pd

# Example: Bayesian estimation of a GARCH(1,1) using PyMC
# Note: Actual GARCH modeling in PyMC requires custom log-likelihoods, 
# but this shows the conceptual structure.

returns = np.random.normal(0, 1, 500) # Placeholder data

with pm.Model() as garch_model:
    # 1. Define Priors (What we believe before seeing data)
    # We restrict alpha and beta to be between 0 and 1
    omega = pm.HalfNormal('omega', sigma=1.0)
    alpha = pm.Beta('alpha', alpha=2.0, beta=5.0) # Prior peaks around 0.28
    beta = pm.Beta('beta', alpha=5.0, beta=2.0)   # Prior peaks around 0.71
    
    # Ensure Stationarity: alpha + beta < 1
    pm.Potential('stationarity', pm.math.switch(alpha + beta < 1, 0, -np.inf))
    
    # 2. Likelihood (How the data fits the parameters)
    # (Custom recursive GARCH likelihood goes here...)
    
    # 3. Sample using MCMC
    # trace = pm.sample(2000, tune=1000, cores=2)
    # print(pm.summary(trace))`
    }
  ]
};
