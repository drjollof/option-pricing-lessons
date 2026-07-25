import { Lesson } from '../types';

export const lesson7: Lesson = {
  id: 'lesson-7',
  title: 'Asian Options & Path Dependency',
  description: 'Discover Exotic Options! Learn why options based on the average stock price break our standard recombining tree, introducing the Curse of Dimensionality.',
  defaultParams: { S0: 100, K: 100, u: 1.15, d: 0.85, r: 0.05, T: 1, N: 3 },
  phases: [
    {
      id: 'what-is-asian-option',
      title: 'What is an Asian Option?',
      description: "So far we've priced 'Vanilla' options where the payoff depends ONLY on the final stock price at expiration. An Asian Option is an 'Exotic' option where the payoff depends on the AVERAGE price of the stock over its life.",
      kind: 'static-slides',
      showParamControls: false,
      stepTexts: [
        "Step 0: European Call Payoff = max(0, Final Price - K).",
        "Step 1: Asian Call Payoff = max(0, Average Price - K).",
        "Step 2: Why buy an Asian option? They are cheaper! Averaging smooths out volatility, making them less risky.",
        "Step 3: They also prevent market manipulation. You can't just spike the stock price on expiration day to profit; you'd have to manipulate the price for the entire life of the option!"
      ],
      formulas: [
        [ `\\text{European Call} = \\max(0, S_T - K)` ],
        [ `\\text{Asian Call} = \\max(0, A_T - K)` ],
        [ `A_T = \\frac{1}{N+1} \\sum_{i=0}^N S_i` ],
        [ `\\text{Volatility of } A_T < \\text{Volatility of } S_T` ]
      ]
    },
    {
      id: 'curse-of-dimensionality',
      title: 'The Recombining Tree Fails',
      description: "Our standard binomial tree 'recombines'. An Up-then-Down move gets you to the same final price as a Down-then-Up move. This makes the tree extremely efficient. But for an Asian option, the AVERAGE price of those two paths is different!",
      kind: 'static-slides',
      showParamControls: false,
      stepTexts: [
        "Step 0: Consider two paths: Path 1 (Up, Down) and Path 2 (Down, Up).",
        "Step 1: In our tree, S0=100. Path 1: 100 → 115 → 97.7. Path 2: 100 → 85 → 97.7.",
        "Step 2: Both end at 97.7. But Path 1 average is 104.2, and Path 2 average is 94.2!",
        "Step 3: Because the averages are different, the payoffs are different. The tree no longer recombines! We must evaluate every single path."
      ],
      formulas: [
        [ `\\text{Path 1 (UD): } S_0=100, S_1=115, S_2=97.7` ],
        [ `\\text{Path 2 (DU): } S_0=100, S_1=85, S_2=97.7` ],
        [ `A_{UD} = \\frac{100 + 115 + 97.7}{3} = 104.2 \\quad A_{DU} = 94.2` ],
        [ `\\text{Recombination is impossible!}` ]
      ]
    },
    {
      id: 'path-explorer',
      title: 'The Path Explorer',
      description: "Instead of a recombined tree, let's look at the explicit paths. For N=3, there are exactly 2^3 = 8 possible paths. Scroll through them below and notice how every path has a unique sequence, average price, and Asian Call payoff (K=100).",
      kind: 'path-explorer',
      showParamControls: true
    },
    {
      id: 'asian-pricing-math',
      title: 'Pricing the Asian Option',
      description: "To find the fair value of the Asian option today, we calculate the expected value of the payoffs across all 2^N paths, multiplying each payoff by its specific path probability, and discounting it to present value.",
      kind: 'static-slides',
      showParamControls: false,
      stepTexts: [
        "Step 0: We sum the probability-weighted Asian payoffs for all paths.",
        "Step 1: Then we multiply by the continuous discount factor e^{-rT}.",
        "Step 2: For N=3 (8 paths), this is easy for a computer.",
        "Step 3: But what if N=100? There are 2^100 paths (more than the atoms in the universe!). We cannot compute this explicitly. We need a new technique: Monte Carlo Simulation (Lesson 8)."
      ],
      formulas: [
        [ `\\text{Expected Payoff} = \\sum_{i=1}^{2^N} \\text{Prob}_i \\times \\text{Payoff}_i` ],
        [ `\\text{Fair Value} = e^{-rT} \\times \\text{Expected Payoff}` ],
        [ `N=3 \\implies 8 \\text{ paths (Easy)}` ],
        [ `N=100 \\implies 1.26 \\times 10^{30} \\text{ paths (Impossible!)}` ]
      ]
    }
  ]
};
