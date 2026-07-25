import { Lesson } from '../types';

export const lesson6: Lesson = {
  id: 'lesson-6',
  title: 'American Delta Hedging',
  description: 'Understand how the possibility of early exercise dramatically alters the replication portfolio and delta hedge ratio of American options.',
  defaultParams: { S0: 100, K: 100, u: 1.15, d: 0.85, r: 0.05, T: 1, N: 3 },
  phases: [
    {
      id: 'european-delta',
      title: 'European Put Delta',
      description: "First, let's look at the Delta matrix for a European Put. Remember that Delta (Δ) is the sensitivity of the option price to the stock price. Notice how the delta approaches 0 when the option is deep out-of-the-money (top nodes) and approaches -1 when deep in-the-money (bottom nodes).",
      kind: 'tree-reveal',
      reveals: 'delta_tree',
      direction: 'forward',
      optionType: 'put',
      isAmerican: false,
      showParamControls: false,
      stepTexts: [
        "Step 0: At the root node, the European Put delta is -0.40.",
        "Step 1: If the stock drops, delta becomes more negative (-0.72) as the put moves into the money.",
        "Step 2: If the stock crashes again, the delta approaches -1.00."
      ],
      formulas: [
        [
          `\\Delta_{0,0} = \\frac{3.2 - 15.4}{115 - 85} = -0.41`
        ],
        [
          `\\Delta_{1,1} = \\frac{0 - 7.4}{132.2 - 97.7} = -0.21`,
          `\\Delta_{1,0} = \\frac{7.4 - 26.1}{97.7 - 72.2} = -0.73`
        ],
        [
          `\\Delta_{2,2} = 0`,
          `\\Delta_{2,1} = \\frac{0 - 16.9}{112.4 - 83.1} = -0.58`,
          `\\Delta_{2,0} = \\frac{16.9 - 38.6}{83.1 - 61.4} = -1.00`
        ]
      ]
    },
    {
      id: 'american-delta',
      title: 'American Put Delta',
      description: "Now let's switch to an American Put. The math for calculating Delta is identical: (Cu - Cd) / (Su - Sd). However, because the future continuation values (Cu and Cd) have been inflated by the early exercise boundary, the resulting Delta matrix is completely different! Notice how the bottom nodes now hit a perfect -1.00 much earlier.",
      kind: 'tree-reveal',
      reveals: 'delta_tree',
      direction: 'forward',
      optionType: 'put',
      isAmerican: true,
      showParamControls: true,
      stepTexts: [
        "Step 0: The root delta is slightly more negative (-0.43) than the European put because the option is fundamentally more valuable.",
        "Step 1: If the stock drops (Node 1,0), the delta instantly slams to -1.00!",
        "Step 2: Why? Because at step 2, BOTH the up and down scenarios trigger optimal early exercise. The option payoff is moving 1:1 inversely with the stock."
      ],
      formulas: [
        [
          `\\text{American } \\Delta_{0,0} = -0.43`
        ],
        [
          `\\Delta_{1,1} = -0.21`,
          `\\Delta_{1,0} = -1.00 \\quad (\\text{European was } -0.73!)`
        ],
        [
          `\\Delta_{2,2} = 0`,
          `\\Delta_{2,1} = -0.58`,
          `\\Delta_{2,0} = -1.00`
        ]
      ]
    },
    {
      id: 'dynamic-hedging-implications',
      title: 'Dynamic Hedging Implications',
      description: "This difference is crucial for risk management. If a market maker shorts an American put to a client, they must short MORE shares of the underlying stock to remain delta-neutral compared to a European put. If they use the European delta to hedge an American option, they will be severely under-hedged and exposed to massive losses during a market crash.",
      kind: 'static-slides',
      showParamControls: false,
      stepTexts: [
        "Step 0: Market Makers delta-hedge to remove directional risk.",
        "Step 1: American options have early exercise risk.",
        "Step 2: This risk inflates the option's value and forces the delta toward -1.0 (or +1.0 for calls) much faster.",
        "Step 3: Conclusion: You must ALWAYS use the American delta matrix when hedging American options."
      ],
      formulas: [
        [
          `\\text{Portfolio} = \\text{Short Option} + \\Delta \\text{ Shares}`
        ],
        [
          `\\Delta_{American} \\neq \\Delta_{European}`
        ],
        [
          `|\\Delta_{American}| \\geq |\\Delta_{European}|`
        ],
        [
          `\\text{Risk Management requires precise } \\Delta`
        ]
      ]
    },
    {
      id: 'gamma-trap',
      title: 'The Gamma Trap',
      description: "While Delta tells us how much our portfolio value changes, Gamma (Γ) tells us how fast our DELTA changes. For American options near the exercise boundary, Gamma explodes to infinity. This is the 'Gamma Trap'.",
      kind: 'static-slides',
      showParamControls: false,
      stepTexts: [
        "Step 0: Remember how the American Put Delta slammed from -0.43 to -1.00 in a single step?",
        "Step 1: That violent jump in Delta means the option has extremely high Gamma.",
        "Step 2: If a Market Maker is short this option, they are short Gamma. As the stock drops, they are forced to aggressively short MORE shares into a falling market.",
        "Step 3: This creates a dangerous feedback loop. The threat of early exercise turns manageable risks into explosive, discontinuous jumps in exposure."
      ],
      formulas: [
        [ `\\Gamma = \\frac{\\Delta_{up} - \\Delta_{down}}{S_{up} - S_{down}}` ],
        [ `\\text{American } \\Gamma \\gg \\text{European } \\Gamma \\text{ (near boundary)}` ],
        [ `\\text{Short Gamma} \\implies \\text{Buy High, Sell Low}` ],
        [ `\\text{Violent rebalancing = High risk}` ]
      ]
    }
  ]
};
