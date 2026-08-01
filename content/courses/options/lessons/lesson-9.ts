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
        "We also need the downward movement to be the inverse of the upward movement to ensure the tree recombines smoothly."
      ],
      formulas: [
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
      showParamControls: true,
      visibleParams: ['S0', 'u', 'd'],
      overrideParams: { N: 1, S0: 100, u: 1.15, d: 0.869 },
      stepTexts: [
        "We start at $t=0$ with a stock price of $S_0 = 100$.",
        "In the up-state, the stock price grows by 15% to $S_u = 100 \\times 1.15 = 115.00$.",
        "In the mid-state, the stock price goes sideways, remaining at $S_m = 100 \\times 1.0 = 100.00$.",
        "In the down-state, the stock price drops to $S_d = 100 \\times 0.869 = 86.90$.",
        "If we expand this to $N=2$ steps, the tree would recombine, yielding 5 terminal nodes instead of $3^2 = 9$."
      ],
      formulas: [
        `S_0 = 100`,
        `S_u = 100 \\times 1.15 = 115`,
        `S_m = 100 \\times 1.00 = 100`,
        `S_d = 100 \\times 0.869 = 86.9`,
        `\\text{Nodes at step } i = 2i + 1`
      ]
    },
    {
      id: 'martingale-condition',
      title: 'The Martingale Condition and FTAP I',
      description: 'For a market to be free of arbitrage, there must exist at least one risk-neutral probability measure (The First Fundamental Theorem of Asset Pricing). Under this measure, the discounted stock price is a Martingale.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "A Martingale is a mathematical process where the expected future value, given all present information, is exactly equal to the present value.",
        "In a risk-neutral world, investors require no risk premium, so all assets grow at the risk-free rate $r$.",
        "This means the expected return of the stock must equal the risk-free rate, establishing our first constraint.",
        "Because we have three probabilities but only two equations (sum to 1, and the expected return), we have an infinite number of solutions. The market is arbitrage-free but incomplete."
      ],
      formulas: [
        `E^Q[S_{t+\\Delta t}] = S_t e^{r \\Delta t}`,
        `p_u S_t u + p_m S_t (1) + p_d S_t d = S_t e^{r \\Delta t}`,
        `p_u u + p_m + p_d d = e^{r \\Delta t}`,
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
