import { Lesson } from '../../../types';

export const lesson14: Lesson = {
  id: 'lesson-14',
  title: 'Black-Scholes-Merton & The Greeks',
  description: 'Solve the Geometric Brownian Motion equation analytically and derive the famous Black-Scholes option pricing formula.',
  defaultParams: { S0: 100, K: 100, u: 0, d: 0, sigma: 0.2, r: 0.05, T: 1, N: 100 },
  phases: [
    {
      id: 'log-normal-property',
      title: 'The Log-Normal Property',
      description: "If stock prices follow Geometric Brownian Motion, their future distribution is log-normal. Because returns compound, the right tail extends infinitely (a stock can go to \\$1,000,000), but the left tail is bounded by zero.",
      kind: 'distribution-curve',
      showParamControls: false,
      visibleParams: [],
      overrideParams: { u: 2.5, d: 1 }, // Skewed log-normal-esque shape
      stepTexts: [
        "A log-normal distribution is simply a normal distribution that has been exponentiated.",
        "Notice the positive skew: the mean is higher than the median, and the long tail extends to the right.",
        "This perfectly matches reality: your maximum loss is 100% (the stock goes to zero), but your maximum gain is theoretically infinite."
      ],
      formulas: [
        [ `S_T = S_0 e^{(...)}` ],
        [ `\\text{Mean} > \\text{Median}` ],
        [ `S_T \\in (0, \\infty)` ]
      ]
    },
    {
      id: 'itos-lemma',
      title: "Itô's Lemma",
      description: "Standard calculus doesn't work on functions with random noise. To find the derivative of a function of a stochastic process, we must use Itô's Lemma. This allows us to take the natural log of our stock price and solve the GBM equation.",
      kind: 'static-slides',
      showParamControls: false,
      visibleParams: [],
      stepTexts: [
        "In standard calculus, Taylor expansions ignore squared time ($dt^2$) because squaring a tiny fraction makes it vanish.",
        "But Brownian noise scales with the square root of time! If we square the noise, it doesn't vanish; it perfectly equals our time step.",
        "Because this squared noise doesn't disappear, Itô's Lemma proves that volatility actively drags down the expected compound growth rate by exactly half the variance."
      ],
      formulas: [
        [ `dt = 0.01 \\implies dt^2 = 0.0001 \\approx 0` ],
        [ `\\text{Noise} = \\sqrt{0.01} = 0.10 \\implies \\text{Noise}^2 = 0.01 = dt` ],
        [ `\\text{Compound Growth} = \\mu - \\frac{\\sigma^2}{2}` ]
      ]
    },
    {
      id: 'bsm-assumptions',
      title: 'BSM Assumptions & Risk-Neutral Valuation',
      description: "The Black-Scholes-Merton model makes strict assumptions: markets are perfectly liquid, there are no transaction costs, and drift and volatility are constant. But its most powerful trick is Risk-Neutral Valuation.",
      kind: 'static-slides',
      showParamControls: false,
      visibleParams: [],
      stepTexts: [
        "By constructing a riskless hedging portfolio (long the stock, short the option), Black, Scholes, and Merton realized the portfolio must earn the risk-free rate $r$.",
        "Why? If a hedged portfolio guarantees a riskless \\$5 profit on a \\$100 investment, it MUST be earning the exact 5% risk-free rate, otherwise arbitrageurs would exploit it.",
        "Because of this, the stock's actual expected growth ($\\mu$) completely mathematically cancels out of the pricing equation!",
        "In a risk-neutral world, we assume all expected payoffs can simply be discounted at the risk-free rate $r$."
      ],
      formulas: [
        [ `\\text{Portfolio: } \\Pi = -V + \\Delta S` ],
        [ `\\text{Riskless Profit} \\implies d\\Pi = r \\Pi dt` ],
        [ `\\mu \\to r \\text{ (Drift is eliminated)}` ]
      ]
    },
    {
      id: 'bsm-formula',
      title: 'The Black-Scholes Formula',
      description: "By solving the Black-Scholes PDE, we get the explicit formula for a European Call Option. Let's break down the mechanics using a \\$100 stock.",
      kind: 'static-slides',
      showParamControls: false,
      visibleParams: ['S0', 'K', 'r', 'sigma', 'T'],
      overrideParams: { S0: 100, K: 100, r: 0.05, sigma: 0.2, T: 1 },
      stepTexts: [
        "Let's calculate the explicit price for an At-The-Money Call option using explicit variables: $S_0, K, r, \\sigma$, and $T$.",
        "First we calculate the $d_1$ parameter and find its cumulative normal probability $\\mathcal{N}(d_1)$.",
        "Next we calculate $d_2$ and find its cumulative probability $\\mathcal{N}(d_2)$.",
        "Finally, we plug everything into the BSM formula to find the call price $C$."
      ],
      formulas: [
        [ `d_1 = \\frac{\\ln(100/100) + (0.05 + 0.2^2/2)1}{0.2\\sqrt{1}} = 0.35 \\implies \\mathcal{N}(0.35) = 0.6368` ],
        [ `d_2 = 0.35 - 0.20 = 0.15 \\implies \\mathcal{N}(0.15) = 0.5596` ],
        [ `C = (\\$100 \\times 0.6368) - (\\$100 \\times 0.9512 \\times 0.5596) = \\$10.45` ]
      ]
    },
    {
      id: 'the-greeks',
      title: 'The Greeks',
      description: "The Greeks measure how sensitive the option price is to changes in the underlying parameters. They are the partial derivatives of the Black-Scholes formula.",
      kind: 'static-slides',
      showParamControls: false,
      visibleParams: [],
      stepTexts: [
        "Assume we have a call option priced at ten dollars. Delta ($\\Delta$) measures price sensitivity. If the stock goes up by one dollar, we add the Delta to the option price.",
        "Gamma ($\\Gamma$) measures how fast Delta changes (convexity). After that one dollar stock increase, our new Delta increases by the Gamma.",
        "Vega ($\\nu$) measures sensitivity to implied volatility. A one percent spike in volatility increases the option price by the Vega.",
        "Theta ($\\Theta$) measures time decay. Passing exactly one day destroys option value by the Theta amount.",
        "Rho ($\\rho$) measures sensitivity to the risk-free interest rate."
      ],
      formulas: [
        [ `\\Delta = 0.60 \\implies \\text{New Price} = \\$10.00 + \\$0.60 = \\$10.60` ],
        [ `\\Gamma = 0.05 \\implies \\text{New } \\Delta = 0.60 + 0.05 = 0.65` ],
        [ `\\nu = 0.20 \\implies \\text{New Price} = \\$10.00 + \\$0.20 = \\$10.20` ],
        [ `\\Theta = -0.04 \\implies \\text{New Price} = \\$10.00 - \\$0.04 = \\$9.96` ],
        [ `\\rho = 0.15 \\implies \\text{New Price} = \\$10.00 + \\$0.15 = \\$10.15` ]
      ]
    },
    {
      id: 'python-bsm',
      title: 'Python Simulation: BSM',
      description: "Let's implement the Black-Scholes analytical formula programmatically using `scipy.stats.norm`.",
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "We import `norm` from `scipy.stats` to calculate the cumulative normal distribution $\\mathcal{N}(d)$.",
        "We calculate $d_1$ and $d_2$ using standard `numpy` math functions.",
        "We return the final Call price using the closed-form equation.",
        "This analytical approach is extremely fast, requiring no iterative simulations."
      ],
      formulas: [
        [ `\\text{Import SciPy}` ],
        [ `\\text{Calculate } d_1, d_2` ],
        [ `\\text{Calculate Call Price}` ],
        [ `O(1) \\text{ Time Complexity}` ]
      ],
      codeSnippet: `import numpy as np
from scipy.stats import norm

def bs_call_price(S0, K, r, sigma, T):
    # Calculate d1 and d2
    d1 = (np.log(S0 / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    
    # Calculate analytical call price
    call_price = (S0 * norm.cdf(d1)) - (K * np.exp(-r * T) * norm.cdf(d2))
    
    # Calculate Delta
    delta = norm.cdf(d1)
    
    return call_price, delta

price, delta = bs_call_price(100, 100, 0.05, 0.2, 1)
print(f"Call Price: {price:.2f}, Delta: {delta:.2f}")`
    }
  ]
};
