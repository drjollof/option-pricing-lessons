import { Lesson } from '../../../types';

export const lesson11: Lesson = {
  id: 'lesson-11',
  title: 'Pricing a European Call in the Trinomial Framework',
  description: 'A complete walkthrough of pricing a European Call option from scratch using the trinomial framework, consolidating the mathematical theory into a unified algorithm.',
  defaultParams: { S0: 100, K: 100, u: 1.15, d: 0.869, r: 0.05, T: 1, N: 3 },
  phases: [
    {
      id: 'the-four-steps',
      title: 'The Four-Step Pricing Algorithm',
      description: 'Pricing any standard derivative on a recombining tree follows a strict four-step procedural algorithm. We will apply this to a European Call option.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "Step 1: Model the evolution of the underlying asset to find all possible terminal stock prices.",
        "Step 2: Calculate the derivative's intrinsic payoff at maturity for each terminal node.",
        "Step 3: Compute the unique risk-neutral probabilities (p_u, p_m, p_d) via variance matching.",
        "Step 4: Traverse the tree backward, computing the expected discounted payoff at each node until we reach the root (t=0)."
      ],
      formulas: [
        `S_T \\in \\{S_0 u^N, ..., S_0 d^N\\}`,
        `C_T = \\max(0, S_T - K)`,
        `p_u, p_m, p_d \\text{ from FTAP II}`,
        `C_t = e^{-r \\Delta t} (p_u C_{t+1}^{up} + p_m C_{t+1}^{mid} + p_d C_{t+1}^{down})`
      ]
    },
    {
      id: 'terminal-payoff-calc',
      title: 'Terminal Payoffs',
      description: 'First, we generate the array of final stock prices and evaluate the European Call payoff function: max(0, S_T - K).',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: ['S0', 'K', 'u', 'd', 'N'],
      stepTexts: [
        "With N=3, we have 2(3) + 1 = 7 terminal nodes.",
        "The highest possible stock price is S0 * u^3 = 100 * 1.15^3 = 152.09.",
        "The payoff at this highest node is max(0, 152.09 - 100) = 52.09.",
        "We compute this for all 7 nodes to create our terminal payoff array."
      ],
      formulas: [
        `N = 3 \\implies 7 \\text{ Terminal Nodes}`,
        `S_{T, \\text{max}} = 100 \\times 1.15^3 = 152.09`,
        `C_{T, \\text{max}} = \\max(0, 152.09 - 100) = 52.09`,
        `C_T = [52.09, 32.25, ..., 0, 0]`
      ]
    },
    {
      id: 'backward-induction-trinomial',
      title: 'Backward Induction',
      description: 'Starting from the terminal payoffs, we iteratively step backward. The value at any node is the discounted expectation of the three subsequent nodes it connects to.',
      kind: 'static-slides',
      showParamControls: true,
      showAllInstantly: true,
      visibleParams: ['r'],
      stepTexts: [
        "We collapse the array of size 2i+1 into an array of size 2(i-1)+1 at the previous step.",
        "For each node, we multiply the three future possible payoffs by p_u, p_m, and p_d respectively.",
        "We sum these probability-weighted outcomes and discount by the risk-free rate.",
        "After iterating this process N times, the array reduces to a single value: the fair price today."
      ],
      formulas: [
        `\\text{Array Size: } 7 \\to 5 \\to 3 \\to 1`,
        `E^Q[C_{t+1}] = p_u C_{t+1}^{up} + p_m C_{t+1}^{mid} + p_d C_{t+1}^{down}`,
        `C_t = e^{-r \\Delta t} E^Q[C_{t+1}]`,
        `C_0 \\approx \\$12.35`
      ],
      codeSnippet: `def trinomial_price_call(S0, K, u, d, r, T, N, pu, pm, pd):
    dt = T / N
    df = np.exp(-r * dt)
    
    # Step 1 & 2: Terminal Stock Prices & Payoffs
    j = np.arange(N, -N - 1, -1)
    S_T = S0 * (u ** j)
    C_T = np.maximum(0, S_T - K)
    
    # Step 4: Backward Induction
    for i in range(N - 1, -1, -1):
        # We need to collapse array of size (2*i + 3) to (2*i + 1)
        C_up = C_T[:-2]
        C_mid = C_T[1:-1]
        C_down = C_T[2:]
        
        C_T = df * (pu * C_up + pm * C_mid + pd * C_down)
        
    return C_T[0]`
    },
    {
      id: 'convergence',
      title: 'Price Convergence',
      description: 'As we increase the number of time steps (N), the discrete trinomial tree approximates continuous Geometric Brownian Motion. The option price converges rapidly to the true theoretical value.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "With a small N (like N=3), the price estimate is rough because the distribution is highly discrete.",
        "As N increases to 50 or 100, the calculated option price stabilizes.",
        "Because the trinomial tree has three branches per node, it converges much faster and smoother than the binomial tree.",
        "We can visualize this stabilization by running our Python function in a loop over increasing N and plotting the results with matplotlib."
      ],
      formulas: [
        `N = 3 \\implies \\text{Rough Estimate}`,
        `N \\to \\infty \\implies \\text{Black-Scholes Price}`,
        `O(N^2) \\text{ Nodes in Trinomial vs } O(N) \\text{ in Binomial}`,
        null
      ],
      codeSnippet: `import matplotlib.pyplot as plt

N_values = range(5, 100, 5)
prices = []

for N in N_values:
    # Assume pu, pm, pd are calculated here
    price = trinomial_price_call(100, 100, 1.15, 1/1.15, 0.05, 1, N, pu, pm, pd)
    prices.append(price)

plt.plot(N_values, prices, marker='o')
plt.title("Convergence of Trinomial Call Price")
plt.xlabel("Number of Time Steps (N)")
plt.ylabel("Option Price ($)")
plt.show()`
    }
  ]
};
