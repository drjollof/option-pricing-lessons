import { Lesson } from '../types';

export const lesson3: Lesson = {
  id: 'lesson-3',
  title: 'Delta Hedging',
  description: 'Learn how to construct a risk-free portfolio by dynamically hedging the option delta at each node in the tree.',
  defaultParams: { S0: 100, K: 100, u: 1.15, d: 0.85, r: 0.05, T: 1, N: 3 },
  phases: [
    {
      id: 'delta-intuition',
      title: 'The Intuition of Delta',
      description: "Before diving into the math, let's understand what Delta (Δ) represents. Delta is the probability-weighted exposure you have to the underlying stock. A Delta of 0.5 means your option position behaves exactly like owning half a share of the actual stock.",
      kind: 'static-slides',
      showParamControls: false,
      stepTexts: [
        "Step 0: If you buy 100 shares of stock, and the stock goes up $1, you make $100. Your delta is exactly 1.0 per share.",
        "Step 1: If you buy a Call option with a Delta of 0.5, and the stock goes up $1, the option's value goes up by $0.50.",
        "Step 2: Therefore, holding 1 Call option (Δ=0.5) is financially equivalent to holding 0.5 shares of stock for small price movements.",
        "Step 3: Market Makers use this to hedge. If they sell you a Call option, they are short 0.5 shares of risk. To neutralize this, they simply buy 0.5 shares of the real stock!"
      ],
      formulas: [
        [ `\\Delta_{stock} = 1.0` ],
        [ `\\Delta_{call} \\approx 0.5` ],
        [ `1 \\text{ Call Option} \\equiv 0.5 \\text{ Shares}` ],
        [ `\\text{Net Portfolio } \\Delta = -0.5 \\text{ (Short Call)} + 0.5 \\text{ (Long Stock)} = 0` ]
      ]
    },
    {
      id: 'delta-derivation',
      title: 'The Hedging Ratio (Delta)',
      description: "Delta (Δ) measures how much an option's price changes when the underlying stock moves by $1. By shorting exactly Δ shares of stock for every option held, a market maker can construct a 'delta-neutral' portfolio that is completely insulated from small market movements.",
      kind: 'derivation-steps',
      showParamControls: false,
      stepTexts: [
        "Step 0: We want to eliminate risk by creating a portfolio that is immune to stock movements.",
        "Step 1: We buy 1 option and short Δ shares of stock. To be risk-free, the portfolio value must be the same whether the stock goes up or down.",
        "Step 2: Solving the equation yields the Delta formula: Δ = (Cu - Cd) / (Su - Sd).",
        "Step 3: Let's calculate the Delta at the root node using the values from Lesson 1."
      ],
      formulas: [
        [
          `V_{up} = C_u - \\Delta S_u`,
          `V_{down} = C_d - \\Delta S_d`
        ],
        [
          `V_{up} = V_{down} \\implies C_u - \\Delta S_u = C_d - \\Delta S_d`
        ],
        [
          `\\Delta = \\frac{C_u - C_d}{S_u - S_d}`
        ],
        [
          `\\begin{aligned} \\Delta_{0,0} &= \\frac{21.5 - 3.7}{115 - 85} \\\\ &= \\frac{17.8}{30} \\\\ &\\approx 0.593 \\end{aligned}`
        ]
      ]
    },
    {
      id: 'delta-tree',
      title: 'Calculating the Delta Tree',
      description: "Because the option's value changes as time passes and the stock price moves, the required hedge ratio (Delta) is not static. It must be dynamically rebalanced at every single node. Notice that the Delta tree is one step shorter than the stock tree, because Delta looks forward to the next step—at expiration, there is no future to hedge against!",
      kind: 'tree-reveal',
      reveals: 'delta_tree',
      direction: 'forward',
      showParamControls: false,
      stepTexts: [
        "Step 0: At time t=0, we need to short 0.593 shares of stock for every option we hold.",
        "Step 1: At t=1, our delta changes! If the stock goes up, we need 0.785 shares. If it goes down, we need 0.267 shares.",
        "Step 2: At t=2, the option is close to expiration. Deep in the money options approach Δ=1, deep out of the money approach Δ=0."
      ],
      formulas: [
        [
          `\\Delta_{0,0} = \\frac{21.5 - 3.7}{115 - 85} = 0.593`
        ],
        [
          `\\begin{aligned} \\Delta_{1,1} &= \\frac{33.9 - 6.8}{132.2 - 97.7} = 0.785 \\end{aligned}`,
          `\\begin{aligned} \\Delta_{1,0} &= \\frac{6.8 - 0}{97.7 - 72.2} = 0.267 \\end{aligned}`
        ],
        [
          `\\begin{aligned} \\Delta_{2,2} &= \\frac{52.1 - 12.4}{152.1 - 112.4} = 1.000 \\end{aligned}`,
          `\\begin{aligned} \\Delta_{2,1} &= \\frac{12.4 - 0}{112.4 - 83.1} = 0.423 \\end{aligned}`,
          `\\begin{aligned} \\Delta_{2,0} &= \\frac{0 - 0}{83.1 - 61.4} = 0.000 \\end{aligned}`
        ]
      ]
    },
    {
      id: 'static-vs-dynamic',
      title: 'Static vs. Dynamic Hedging',
      description: "You might be wondering: 'If I delta-hedge my portfolio at day 1, can I just walk away and be safe?' The answer is NO. This is the difference between static and dynamic hedging.",
      kind: 'static-slides',
      showParamControls: false,
      stepTexts: [
        "Step 0: A static hedge (like buying insurance) protects you permanently once purchased.",
        "Step 1: Delta hedging is DYNAMIC. As the stock moves up and down through the tree, the delta changes constantly.",
        "Step 2: If the stock goes up, the call option's delta increases (it acts more like a full share of stock). The market maker must BUY more shares to remain hedged.",
        "Step 3: This constant buying and selling to maintain a delta of 0 is called 'Dynamic Hedging' or 'Delta Neutral Trading'. It is extremely labor-intensive."
      ],
      formulas: [
        [ `\\text{Static Hedge} = \\text{Set and Forget}` ],
        [ `\\Delta_{t=0} \\neq \\Delta_{t=1}` ],
        [ `\\text{If } S \\uparrow, \\Delta_{call} \\uparrow \\implies \\text{Buy more stock}` ],
        [ `\\text{Dynamic Hedge} = \\text{Continuous Rebalancing}` ]
      ]
    }
  ]
};
