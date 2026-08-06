import { Lesson } from '../../../types';

export const lesson15: Lesson = {
  id: 'lesson-15',
  title: 'Monte Carlo Options Pricing',
  description: 'Use brute-force computational power to simulate thousands of price paths and estimate the fair value of an option.',
  defaultParams: { S0: 100, K: 100, u: 0.1, d: 0.9, sigma: 0.2, r: 0.05, T: 1, N: 100 },
  phases: [
    {
      id: 'why-monte-carlo',
      title: 'The Monte Carlo Intuition',
      description: "If we have the exact Black-Scholes formula, why do we need Monte Carlo simulations? Because Black-Scholes only works for European options with simple payoffs. For complex, path-dependent derivatives (like Asian or Barrier options), no exact formula exists. We must use computational brute force.",
      kind: 'static-slides',
      showParamControls: false,
      visibleParams: [],
      stepTexts: [
        "Monte Carlo relies on the Law of Large Numbers.",
        "Instead of solving a complex integral, we randomly generate 10,000 possible futures.",
        "We calculate the option's payoff in each future.",
        "We average those payoffs, and discount that average back to today."
      ],
      formulas: [
        [ `\\text{Law of Large Numbers}` ],
        [ `N = 10,000 \\text{ Simulations}` ],
        [ `\\text{Payoff}_i = \\max(0, S_{T,i} - K)` ],
        [ `C_0 = e^{-rT} \\frac{1}{N} \\sum_{i=1}^N \\text{Payoff}_i` ]
      ]
    },
    {
      id: 'risk-neutral-euler',
      title: 'Risk-Neutral Euler Discretization',
      description: "To generate these paths, we use Euler Discretization. Crucially, because we are pricing a derivative, we must simulate the paths in the risk-neutral world. This means we replace the stock's actual expected return ($\\mu$) with the risk-free rate ($r$).",
      kind: 'stochastic-path',
      showParamControls: false,
      visibleParams: ['S0', 'r', 'sigma', 'N', 'T'],
      overrideParams: { u: 0.05, sigma: 0.2, S0: 100, T: 1, N: 252 },
      stepTexts: [
        "The risk-neutral SDE is: $dS = S(r dt + \\sigma dW_t)$. Let's calculate exactly one discrete simulation step for a 1-day jump.",
        "Using our stock price ($S_t$), risk-free rate ($r$), volatility ($\\sigma$), and 1-day time step ($\\Delta t = 1/252$), we find the deterministic growth factor.",
        "Now we roll the dice. If the random normal draw is negative ($Z = -1.5$), we compute the random shock.",
        "We sum them and exponentiate to find the new stock price."
      ],
      formulas: [
        [ `S_{t+\\Delta t} = S_t e^{(r - \\frac{\\sigma^2}{2})\\Delta t + \\sigma \\sqrt{\\Delta t} Z}` ],
        [ `\\text{Growth} = (0.05 - \\frac{0.2^2}{2}) \\times 0.004 = +0.0001` ],
        [ `\\text{Shock} = 0.20 \\times \\sqrt{0.004} \\times (-1.5) = -0.019` ],
        [ `S_{t+1} = \\$100 \\times e^{(0.0001 - 0.019)} = \\$98.13` ]
      ]
    },
    {
      id: 'mc-terminal',
      title: 'Terminal Distributions',
      description: "Let's run 50,000 risk-neutral simulations and look at the final distribution of the stock prices at expiration $T$.",
      kind: 'mc-histogram',
      showParamControls: false,
      visibleParams: [],
      stepTexts: [
        "With a small number of paths, the distribution is jagged and unpredictable.",
        "As we increase the paths, the log-normal shape emerges perfectly.",
        "The peak (mode) of the distribution is pulled left, but the long right tail balances it out.",
        "To price the option, we slice this histogram at the strike price $K$. Everything to the left is worth zero. Everything to the right has a positive payoff."
      ],
      formulas: [
        [ `N = 100` ],
        [ `N = 50,000` ],
        [ `S_T \\sim \\text{Log-Normal}` ],
        [ `\\text{Payoff} = \\max(0, S_T - K)` ]
      ]
    },
    {
      id: 'python-mc',
      title: 'Python Simulation: Monte Carlo Pricing',
      description: "Let's implement the Monte Carlo European Call pricer in Python and verify that it matches the exact Black-Scholes formula.",
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "We don't need a loop for European options! We can jump straight to $T$ using `np.exp` on an array of random numbers.",
        "We calculate the payoffs using `np.maximum`.",
        "We take the `np.mean` of the payoffs.",
        "We discount the mean by $e^{-rT}$."
      ],
      formulas: [
        [ `Z \\sim \\mathcal{N}(0, 1) \\text{ (Vectorized)}` ],
        [ `S_T = S_0 e^{(r - \\sigma^2/2)T + \\sigma \\sqrt{T} Z}` ],
        [ `\\text{Mean} = \\frac{1}{N}\\sum \\max(0, S_T - K)` ],
        [ `C = e^{-rT} \\times \\text{Mean}` ]
      ],
      codeSnippet: `import numpy as np

def bs_call_mc(S0, K, r, sigma, T, iterations=100000):
    # 1. Generate random normal numbers all at once
    Z = np.random.randn(iterations)
    
    # 2. Simulate terminal stock prices (Vectorized)
    ST = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)
    
    # 3. Calculate payoffs for all paths
    payoffs = np.maximum(0, ST - K)
    
    # 4. Average the payoffs and discount back to present
    call_price = np.exp(-r * T) * np.mean(payoffs)
    
    return call_price

mc_price = bs_call_mc(100, 100, 0.05, 0.2, 1)
print(f"Monte Carlo Price: {mc_price:.2f}")
# Output: 10.45 (Very close to exact BS price of 10.45)`
    }
  ]
};
