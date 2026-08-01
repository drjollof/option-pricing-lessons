import { Lesson } from '../../../types';

export const lesson9: Lesson = {
  id: 'lesson-9',
  title: 'The Trinomial Framework and FTAP I',
  description: 'Extend the binomial model to a trinomial framework, introducing upward, mid, and downward stock movements, and explore the First Fundamental Theorem of Asset Pricing.',
  defaultParams: { S0: 100, K: 100, u: 1.15, d: 0.869, r: 0.05, T: 1, N: 3 },
  phases: [
    {
      id: 'trinomial-extension',
      title: 'Extending to Three States',
      description: 'The binomial model forces the stock to move either up or down. A trinomial framework adds a third possibility: the stock price remains unchanged (or grows exactly at the risk-free rate). This mid-step adds realism and stability to the model.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: ['S0', 'u', 'd'],
      stepTexts: [
        "In a binomial tree, we used an up factor u and a down factor d.",
        "A trinomial tree introduces a mid factor m. For simplicity, we often set m = 1, meaning the stock goes sideways.",
        "This gives us three risk-neutral probabilities: p_u, p_m, and p_d, which must sum to 1.",
        "We also need the downward movement to be the inverse of the upward movement to ensure the tree recombines."
      ],
      formulas: [
        `m = 1.0`,
        `p_u + p_m + p_d = 1`,
        `d = \\frac{1}{u}`,
        `S_{t+\\Delta t} \\in \\{S_t u, S_t m, S_t d\\}`
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
        "In a risk-neutral world, investors require no risk premium, so all assets grow at the risk-free rate r.",
        "This means the expected return of the stock must equal the risk-free rate, establishing our first constraint.",
        "Because we have three probabilities but only two equations (sum to 1, and the expected return), we have an infinite number of solutions. The market is arbitrage-free but incomplete."
      ],
      formulas: [
        `E^Q[S_{t+\\Delta t}] = S_t e^{r \\Delta t}`,
        `p_u S_t u + p_m S_t (1) + p_d S_t d = S_t e^{r \\Delta t}`,
        `p_u u + p_m + p_d d = e^{r \\Delta t}`,
        null
      ]
    },
    {
      id: 'trinomial-tree-code',
      title: 'Modeling the Trinomial Tree in Python',
      description: 'Let\'s translate this structure into a programmatic tree. Using NumPy, we can efficiently compute the terminal stock values by combining upward and downward factors.',
      kind: 'static-slides',
      showParamControls: true,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "To model a recombining trinomial tree, we need to track the number of up and down moves.",
        "At step N, the maximum number of up moves is N, and the maximum number of down moves is N.",
        "This results in 2N + 1 terminal nodes at maturity.",
        "We can generate these stock paths using array concatenation and cumulative products in NumPy."
      ],
      formulas: [
        null,
        null,
        `\\text{Terminal Nodes} = 2N + 1`,
        null
      ],
      codeSnippet: `import numpy as np

def build_trinomial_terminal_nodes(S0, u, d, N):
    # At step N, j ranges from N (all up) down to -N (all down)
    # The stock price at node j is S0 * u^j 
    # since d = 1/u, a down move is equivalent to u^(-1)
    
    j = np.arange(N, -N - 1, -1)
    terminal_prices = S0 * (u ** j)
    return terminal_prices

S_terminal = build_trinomial_terminal_nodes(100, 1.15, 1/1.15, 3)
print(S_terminal)`
    }
  ]
};
