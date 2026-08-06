import { Lesson } from '../../../types';

export const lesson1: Lesson = {
  id: 'lesson-1',
  title: 'Derivatives, the Binomial Model & Risk-Neutral Pricing',
  description: 'Understand the core mechanics of pricing options using a discrete-time binomial tree.',
  defaultParams: { S0: 100, K: 100, u: 1.15, d: 0.85, r: 0.05, T: 1, N: 3 },
  phases: [
    {
      id: 'what-is-an-option',
      title: 'What is an Option?',
      description: "Before we price anything, let's establish what a derivative is. An option is a contract that gives you the RIGHT, but not the obligation, to buy (Call) or sell (Put) an underlying stock at a fixed Strike Price (K) on a specific Expiration Date (T).",
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: ['K'],
      stepTexts: [
        "If you buy a Call option, you are betting the stock goes UP.",
        "If the stock is above K at expiration, your payoff is S - K.",
        "If the stock is below K, the option expires worthless (payoff = 0).",
        "Because the future is uncertain, how much should you pay for this contract today? That is the core problem of quantitative finance."
      ],
      formulas: [
        [ `\\text{Call Payoff} = \\max(0, S_T - K)` ],
        [ `\\text{If } S_T > K, \\text{ Payoff } > 0` ],
        [ `\\text{If } S_T \\leq K, \\text{ Payoff } = 0` ],
        [ `\\text{Fair Value Today } (C_0) = ?` ]
      ]
    },
    {
      id: 'stock-build',
      title: 'Building the Stock Tree',
      description: "The binomial model simplifies reality by assuming that over any small time period, the stock price can only move to one of two possible states: 'up' or 'down'. By compounding these discrete steps, we can model the entire distribution of future stock prices.",
      kind: 'tree-reveal',
      reveals: 'stock_tree',
      direction: 'forward',
      showParamControls: false,
      visibleParams: ['S0', 'u', 'd'],
      stepTexts: [
        "We begin with the initial stock price S₀ = 100. This is the root node of our binomial tree.",
        "At step 1, the stock can branch up (multiplied by u) or down (multiplied by d) from the root.",
        "At step 2, the stock continues to branch from each of the nodes in step 1.",
        "By step 3, we have 4 possible terminal stock prices at expiration."
      ],
      formulas: [
        [
          `S_0 = 100`
        ],
        [
          `S_{1, 1} = 100 \\cdot 1.15 = 115`,
          `S_{1, 0} = 100 \\cdot 0.85 = 85`
        ],
        [
          `S_{2, 2} = 115 \\cdot 1.15 = 132.2`,
          `S_{2, 1} = 115 \\cdot 0.85 = 97.7`,
          `S_{2, 0} = 85 \\cdot 0.85 = 72.2`
        ],
        [
          `S_{3, 3} = 132.2 \\cdot 1.15 = 152.1`,
          `S_{3, 2} = 132.2 \\cdot 0.85 = 112.4`,
          `S_{3, 1} = 97.7 \\cdot 0.85 = 83.1`,
          `S_{3, 0} = 72.2 \\cdot 0.85 = 61.4`
        ]
      ],
      codeSnippet: `def build_stock_tree(S0, u, d, N):
    tree = [[S0]]
    for i in range(1, N + 1):
        # The i-th step has i+1 nodes
        # j represents the number of 'down' moves
        layer = [S0 * (u ** (i - j)) * (d ** j) for j in range(i + 1)]
        tree.append(layer)
    return tree`
    },
    {
      id: 'real-prob-problem',
      title: 'The Problem with Real Probabilities',
      description: "You might think: 'To find the expected value, I just need to predict the real probability (p) that the stock goes up.' But here's the catch: Different investors have different risk tolerances. Even if two investors agree on 'p', they will disagree on the price of the option because they require different compensation for risk.",
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "A risk-averse investor might demand a huge discount to take on the risk of the option.",
        "A risk-seeking investor might pay a premium because they love the leverage.",
        "If price depends on individual risk tolerance, we can't find a single fair market value.",
        "So how do market makers price options consistently? By removing risk entirely from the equation."
      ],
      formulas: [
        [ `p_{real} = 0.60 \\quad (\\text{Your belief})` ],
        [ `p_{real} = 0.40 \\quad (\\text{Friend's belief})` ],
        [ `\\text{Expected Value} = \\text{Subjective!}` ],
        [ `\\text{Prices must be objective.}` ]
      ]
    },
    {
      id: 'no-arbitrage',
      title: 'Risk-Neutral Probability',
      description: "To prevent risk-free profits (arbitrage), options must be priced as if investors are completely indifferent to risk. This introduces a synthetic 'risk-neutral probability' (q), which is the exact mathematical probability required for the expected return of the stock to equal the risk-free rate.",
      kind: 'derivation-steps',
      showParamControls: false,
      showAllInstantly: false,
      visibleParams: ['u', 'd', 'r', 'dt'],
      stepTexts: [
        "We want to price an option without guessing the true probability of the stock going up or down.",
        "Because arbitrageurs force options to be priced fairly against a risk-free bank account, the expected payout of the stock must exactly match the bank's return.",
        "Let's assume our bank account grows by 1.0168 (drift). Our stock's expected payout must match this:",
        "By solving that simple algebra equation for q, we isolate the exact 'risk-neutral probability'. The messy formula below is just the generalized version of that exact algebra!"
      ],
      formulas: [
        `\\text{Stock Payout} = \\text{Bank Return}`,
        `E[S] = S_0 e^{r \\Delta t}`,
        `115q + 85(1-q) = 101.68`,
        `q = \\frac{e^{r \\Delta t} - d}{u - d} \\approx 0.556`
      ]
    },
    {
      id: 'backward-induction',
      title: 'Call Option & Backward Induction',
      description: "European options are only exercised at expiration (Step 3). To find their present value today (Step 0), we calculate all possible terminal payoffs and iteratively discount the expected values backward through the tree using the risk-neutral probability q.",
      kind: 'tree-reveal',
      reveals: 'option_tree',
      direction: 'backward',
      showParamControls: false,
      visibleParams: ['S0', 'K', 'u', 'd', 'r', 'dt'],
      stepTexts: [
        "First, we calculate the intrinsic value of the Call option at expiration (Step 3). Payoff = max(0, S - K).",
        "Next, we step backward. For each node, the option value is the discounted expected value of the two future nodes.",
        "We continue discounting the expected values backward using the risk-neutral probability q.",
        "We arrive at the root node. This is the fair present value of the European Call option today."
      ],
      formulas: [
        [
          `C_{3,3} = \\max(0, 152.1 - 100) = 52.1`,
          `C_{3,2} = \\max(0, 112.4 - 100) = 12.4`,
          `C_{3,1} = \\max(0, 83.1 - 100) = 0`,
          `C_{3,0} = \\max(0, 61.4 - 100) = 0`
        ],
        [
          `\\begin{aligned} C_{2,2} &= e^{-r \\Delta t} (q C_{3,3} + (1-q) C_{3,2}) \\\\ &= 0.9835 (0.556 \\times 52.1 + 0.444 \\times 12.4) = 33.9 \\end{aligned}`,
          `\\begin{aligned} C_{2,1} &= e^{-r \\Delta t} (q C_{3,2} + (1-q) C_{3,1}) \\\\ &= 0.9835 (0.556 \\times 12.4 + 0.444 \\times 0) = 6.8 \\end{aligned}`,
          `\\begin{aligned} C_{2,0} &= e^{-r \\Delta t} (q C_{3,1} + (1-q) C_{3,0}) \\\\ &= 0.9835 (0.556 \\times 0 + 0.444 \\times 0) = 0 \\end{aligned}`
        ],
        [
          `\\begin{aligned} C_{1,1} &= e^{-r \\Delta t} (q C_{2,2} + (1-q) C_{2,1}) \\\\ &= 0.9835 (0.556 \\times 33.9 + 0.444 \\times 6.8) = 21.5 \\end{aligned}`,
          `\\begin{aligned} C_{1,0} &= e^{-r \\Delta t} (q C_{2,1} + (1-q) C_{2,0}) \\\\ &= 0.9835 (0.556 \\times 6.8 + 0.444 \\times 0) = 3.7 \\end{aligned}`
        ],
        [
          `\\begin{aligned} C_0 &= e^{-r \\Delta t} (q C_{1,1} + (1-q) C_{1,0}) \\\\ &= 0.9835 (0.556 \\times 21.5 + 0.444 \\times 3.7) \\\\ &= 0.9835 (11.954 + 1.643) \\\\ &= 13.37 \\end{aligned}`
        ]
      ],
      codeSnippet: `def price_european_option(stock_tree, K, r, dt, p, is_call=True):
    """Prices option using backward induction from maturity."""
    N = len(stock_tree) - 1
    option_tree = [[] for _ in range(N + 1)]
    
    # Step 1: Calculate intrinsic payoff at maturity (N)
    for j in range(N + 1):
        S = stock_tree[N][j]
        payoff = max(S - K, 0) if is_call else max(K - S, 0)
        option_tree[N].append(payoff)
        
    # Step 2: Backward induction (N-1 down to 0)
    df = math.exp(-r * dt) # Discount factor
    
    for i in range(N - 1, -1, -1):
        for j in range(i + 1):
            # Expected value of future nodes
            C_up = option_tree[i + 1][j]
            C_down = option_tree[i + 1][j + 1]
            
            # Risk-neutral expectation discounted to present
            price = df * (p * C_up + (1 - p) * C_down)
            option_tree[i].append(price)
            
    return option_tree`
    }
  ]
};
