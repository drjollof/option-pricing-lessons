import { Lesson } from '../../../types';

export const lesson9: Lesson = {
  id: 'lesson-9',
  title: 'The Trinomial Framework and FTAP I',
  description: 'Extend the binomial model to a trinomial framework, introducing upward, mid, and downward stock movements, and explore the First Fundamental Theorem of Asset Pricing.',
  defaultParams: { S0: 100, K: 100, u: 1.15, d: 0.869, r: 0.05, T: 1, N: 1 },
  phases: [
    {
      id: 'trinomial-extension',
      title: 'Extending to Three States',
      description: 'The binomial model forces the stock to move either up or down. A trinomial framework adds a third possibility: the stock price remains unchanged (or grows exactly at the risk-free rate). This mid-step adds realism and stability to the model.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "In a binomial tree, we used an up factor $u$ and a down factor $d$.",
        "A trinomial tree introduces a mid factor $m$. For simplicity, we often set $m = 1.0$, meaning the stock goes sideways.",
        "This gives us three risk-neutral probabilities: $p_u$, $p_m$, and $p_d$, which must sum to 1.",
        "We also need the downward movement to be the inverse of the upward movement to ensure the tree recombines smoothly.",
        "This means the stock price at the next step has exactly three possible values."
      ],
      formulas: [
        null,
        `m = 1.0`,
        `p_u + p_m + p_d = 1`,
        `d = \\frac{1}{u}`,
        `S_{t+\\Delta t} \\in \\{S_t u, S_t m, S_t d\\}`
      ]
    },
    {
      id: 'trinomial-visual',
      title: 'Visualizing a 1-Step Trinomial Tree',
      description: 'Let us generate a concrete 1-step trinomial tree. Notice how a single starting node instantly splits into three possible future states.',
      kind: 'tree-reveal',
      treeType: 'trinomial',
      reveals: 'stock_tree',
      showParamControls: false,
      visibleParams: [],
      overrideParams: { N: 1, S0: 100, u: 1.15, d: 0.869 },
      stepTexts: [
        "We start at $t=0$ with a stock price of $S_0 = 100$.",
        "At $t=1$, it instantly splits into three states: $115.00$ (up), $100.00$ (mid), and $86.90$ (down). If we expand to $N=2$ steps, the branches recombine!"
      ],
      formulas: [
        `S_0 = 100`,
        `S_1 \\in \\{115, 100, 86.90\\}`
      ]
    },
    {
      id: 'martingale-condition',
      title: 'The Martingale Condition and FTAP I',
      description: 'The First Fundamental Theorem of Asset Pricing (FTAP I) states that to prevent arbitrage (free money), there must exist at least one set of risk-neutral probabilities. Let us see exactly what this means using real numbers.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "Imagine you put \\$100 into a risk-free bank account at a 5% interest rate. After 1 year, you would have exactly \\$105.13 (since $100 \\times e^{0.05} = 105.13$).",
        "A 'Martingale' is simply a mathematically 'fair game'. In a risk-neutral world, the stock market is forced to be a fair game against the bank account.",
        "This means the expected future payout of our stock must exactly match the bank account: \\$105.13. If it didn't, traders would endlessly borrow from the bank to buy the stock (or vice versa) for guaranteed profit!",
        "So, the weighted average of our three future states must equal the bank's return: $p_u(115) + p_m(100) + p_d(86.90) = 105.13$.",
        "We also know the probabilities must sum to 1. But wait... we have 3 unknown probabilities and only 2 equations. This means there are an infinite number of valid solutions! The market is arbitrage-free, but 'incomplete'."
      ],
      formulas: [
        `\\text{Bank Account} = 100 e^{0.05} = 105.13`,
        `E^Q[S_{t+\\Delta t}] = S_t e^{r \\Delta t}`,
        `\\text{Stock Expected Return} = 105.13`,
        `115 p_u + 100 p_m + 86.9 p_d = 105.13`,
        `\\text{2 Equations, 3 Unknowns}`
      ]
    },
    {
      id: 'trinomial-tree-code',
      title: 'Modeling the Trinomial Tree in Python',
      description: 'Let\'s translate this structure into a programmatic tree. Using NumPy, we can efficiently compute the terminal stock values by combining upward and downward factors.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "To model a recombining trinomial tree, we need to track the number of up and down moves.",
        "At step $N$, the maximum number of up moves is $N$, and the maximum down moves is $N$.",
        "Because $m=1$, the mid moves don't change the price, so we only care about the net difference between up and down moves.",
        "We can generate an array of indices from $-N$ to $+N$, where the index represents the net number of up moves.",
        "The terminal stock price for index $j$ is simply $S_0 u^j$."
      ],
      formulas: [
        `\\text{Net up moves } j \\in [-N, N]`,
        `\\text{Total Nodes } = 2N + 1`,
        null,
        null,
        `S_T[j] = S_0 u^j`
      ],
      codeSnippet: `import numpy as np

def build_trinomial_terminal_nodes(S0, u, N):
    # Generates indices from -N to +N
    # e.g. for N=2: [-2, -1, 0, 1, 2]
    j_indices = np.arange(-N, N + 1)
    
    # Calculate terminal stock prices using broadcasting
    # Note: j can be negative, which acts exactly like multiplying by d (since d = 1/u)
    S_T = S0 * (u ** j_indices)
    
    return S_T

print(build_trinomial_terminal_nodes(100, 1.15, 2))
# Output: [ 75.61  86.96 100.   115.   132.25]`
    }
  ]
};
