import { Lesson } from '../types';

export const lesson5: Lesson = {
  id: 'lesson-5',
  title: 'American Options & Early Exercise',
  description: 'Understand the distinct payoff structures of American options, evaluate the trade-off of early exercise, and write the Python logic to compute American option prices.',
  defaultParams: { S0: 100, K: 100, u: 1.15, d: 0.85, r: 0.05, T: 1, N: 3 },
  phases: [
    {
      id: 'american-intro',
      title: 'The American Option',
      description: "Unlike European options which can only be exercised at maturity, American options give the holder the right to exercise early at ANY node in the tree. To price them, we must explicitly check if the immediate intrinsic payoff is greater than the discounted expected continuation value.",
      kind: 'static-slides',
      showParamControls: false,
      stepTexts: [
        "Step 0: We still calculate the terminal payoffs at maturity just like European options.",
        "Step 1: As we step backward, we calculate the expected continuation value.",
        "Step 2: We then calculate the immediate intrinsic payoff (S - K for calls, K - S for puts).",
        "Step 3: The node value becomes the MAXIMUM of the continuation value and the intrinsic value."
      ],
      formulas: [
        [
          `V_{continuation} = e^{-r \\Delta t} (q V_{up} + (1-q) V_{down})`
        ],
        [
          `V_{intrinsic\\ (Call)} = \\max(0, S - K)`,
          `V_{intrinsic\\ (Put)} = \\max(0, K - S)`
        ],
        [
          `V_{node} = \\max(V_{continuation}, V_{intrinsic})`
        ]
      ]
    },
    {
      id: 'american-premium',
      title: 'The American Premium',
      description: "Because an American option gives you strictly MORE rights than a European option (the right to exercise early), its fair value must be greater than or equal to the European option. The difference in price is known as the 'Early Exercise Premium'.",
      kind: 'static-slides',
      showParamControls: false,
      stepTexts: [
        "Step 0: Let's compare the European Put and American Put prices we calculated.",
        "Step 1: The European Put (Lesson 2) was worth $8.50 today.",
        "Step 2: The American Put is worth $8.80 today.",
        "Step 3: Therefore, the market is pricing the 'Early Exercise Premium' at $0.30. This is exactly how much you are paying for the privilege to exercise early if the stock crashes."
      ],
      formulas: [
        [ `P_{European} = 8.50` ],
        [ `P_{American} = 8.80` ],
        [ `\\text{Premium} = P_{American} - P_{European}` ],
        [ `\\text{Premium} = 8.80 - 8.50 = \\$0.30` ]
      ]
    },
    {
      id: 'american-put',
      title: 'Optimal Early Exercise (Put)',
      description: "Let's price an American Put. Watch the tree carefully! Nodes highlighted in RED indicate points where the intrinsic payoff exceeds the continuation value. If the stock drops significantly, it becomes optimal to exercise early to capture the guaranteed payoff now rather than waiting and risking a rebound.",
      kind: 'tree-reveal',
      reveals: 'option_tree',
      direction: 'backward',
      optionType: 'put',
      isAmerican: true,
      showParamControls: true,
      stepTexts: [
        "Step 0 (Terminal): Calculate intrinsic value at expiration. Payoff = max(0, K - S).",
        "Step 1 (Step 2): Step backward. Calculate continuation value. Compare to intrinsic. Note the red early exercise node at the bottom!",
        "Step 2 (Step 1): Step backward again. The option value is the max of continuation and intrinsic.",
        "Step 3 (Step 0): We arrive at the root node. This is the fair value of the American Put option today."
      ],
      formulas: [
        [
          `P_{3,0} = \\max(0, 100 - 61.4) = 38.6`
        ],
        [
          `\\text{Continuation}_{2,0} = 26.1`,
          `\\text{Intrinsic}_{2,0} = \\max(0, 100 - 72.2) = 27.8`,
          `P_{2,0} = \\max(26.1, 27.8) = 27.8 \\quad (\\color{red}\\text{Early Exercise!}\\color{black})`
        ],
        [
          `\\text{Continuation}_{1,0} = 0.9835 (0.556 (7.4) + 0.444 (27.8)) = 16.2`,
          `\\text{Intrinsic}_{1,0} = \\max(0, 100 - 85) = 15.0`,
          `P_{1,0} = \\max(16.2, 15.0) = 16.2`
        ],
        [
          `P_0 = 8.8`
        ]
      ],
      codeSnippet: `def price_american_option(stock_tree, K, r, dt, p, is_call=True):
    """Prices an American option using backward induction with early exercise check."""
    N = len(stock_tree) - 1
    option_tree = [[] for _ in range(N + 1)]
    
    # Step 1: Calculate intrinsic payoff at maturity (N)
    for j in range(N + 1):
        S = stock_tree[N][j]
        payoff = max(S - K, 0) if is_call else max(K - S, 0)
        option_tree[N].append(payoff)
        
    # Step 2: Backward induction with early exercise check
    df = math.exp(-r * dt)
    
    for i in range(N - 1, -1, -1):
        for j in range(i + 1):
            # 2a. Expected continuation value
            C_up = option_tree[i + 1][j]
            C_down = option_tree[i + 1][j + 1]
            continuation = df * (p * C_up + (1 - p) * C_down)
            
            # 2b. Immediate intrinsic value
            S = stock_tree[i][j]
            intrinsic = max(S - K, 0) if is_call else max(K - S, 0)
            
            # 2c. Option value is the maximum of both
            option_tree[i].append(max(continuation, intrinsic))
            
    return option_tree`
    },
    {
      id: 'american-call-proof',
      title: 'Why Never Exercise Calls?',
      description: "You'll notice that for American Calls on non-dividend paying stocks, the tree NEVER shows any red early exercise nodes. Why? Because the time value of money and the option's built-in downside protection make the continuation value strictly greater than the intrinsic value prior to expiration.",
      kind: 'derivation-steps',
      showParamControls: false,
      stepTexts: [
        "Step 0: Consider the intrinsic value of a Call: S - K.",
        "Step 1: If we hold the option to maturity, the minimum value is S - K, but K is paid later. Since money today is worth more than money tomorrow, delaying the payment of strike K is beneficial.",
        "Step 2: Furthermore, if the stock crashes below K, holding the option limits our loss to 0, whereas exercising early would lock in the loss.",
        "Step 3: Therefore, Continuation Value > Intrinsic Value always, and an American Call is mathematically identical to a European Call (unless dividends are paid!)."
      ],
      formulas: [
        [
          `V_{intrinsic} = S - K`
        ],
        [
          `\\text{PV of Strike} = K e^{-r(T-t)} < K`
        ],
        [
          `\\text{Delaying payment is profitable.}`
        ],
        [
          `C_{American} = C_{European}`
        ]
      ]
    }
  ]
};
