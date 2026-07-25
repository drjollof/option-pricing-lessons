import { Lesson } from '../types';

export const lesson2: Lesson = {
  id: 'lesson-2',
  title: 'Put Options & Put-Call Parity',
  description: 'Explore the relationship between calls and puts using Put-Call parity, and visualize the Put option tree.',
  defaultParams: { S0: 100, K: 100, u: 1.15, d: 0.85, r: 0.05, T: 1, N: 3 },
  phases: [
    {
      id: 'put-backward-induction',
      title: 'Put Option & Backward Induction',
      description: "A Put option gives the holder the right to sell the stock at the strike price K. Similar to a Call option, we calculate its terminal payoffs at expiration as max(0, K - S) and discount them backward to find the fair value today.",
      kind: 'tree-reveal',
      reveals: 'option_tree',
      direction: 'backward',
      optionType: 'put',
      showParamControls: false,
      stepTexts: [
        "Step 0 (Terminal): Calculate the intrinsic value of the Put option at expiration (Step 3). Payoff = max(0, K - S).",
        "Step 1 (Step 2): Step backward. The put value is the discounted expected value of the two future nodes.",
        "Step 2 (Step 1): Continue discounting the expected values backward using the risk-neutral probability q.",
        "Step 3 (Step 0): We arrive at the root node. This is the fair present value of the European Put option today."
      ],
      formulas: [
        [
          `\\begin{aligned} P_{3,3} &= \\max(0, 100 - 152.1) = 0 \\end{aligned}`,
          `\\begin{aligned} P_{3,2} &= \\max(0, 100 - 112.4) = 0 \\end{aligned}`,
          `\\begin{aligned} P_{3,1} &= \\max(0, 100 - 83.1) = 16.9 \\end{aligned}`,
          `\\begin{aligned} P_{3,0} &= \\max(0, 100 - 61.4) = 38.6 \\end{aligned}`
        ],
        [
          `\\begin{aligned} P_{2,2} &= 0.9835 (0.556 \\times 0 \\\\ &\\quad + 0.444 \\times 0) = 0 \\end{aligned}`,
          `\\begin{aligned} P_{2,1} &= 0.9835 (0.556 \\times 0 \\\\ &\\quad + 0.444 \\times 16.9) = 7.4 \\end{aligned}`,
          `\\begin{aligned} P_{2,0} &= 0.9835 (0.556 \\times 16.9 \\\\ &\\quad + 0.444 \\times 38.6) = 26.1 \\end{aligned}`
        ],
        [
          `\\begin{aligned} P_{1,1} &= 0.9835 (0.556 \\times 0 \\\\ &\\quad + 0.444 \\times 7.4) = 3.2 \\end{aligned}`,
          `\\begin{aligned} P_{1,0} &= 0.9835 (0.556 \\times 7.4 \\\\ &\\quad + 0.444 \\times 26.1) = 15.4 \\end{aligned}`
        ],
        [
          `\\begin{aligned} P_{0,0} &= 0.9835 (0.556 \\times 3.2 \\\\ &\\quad + 0.444 \\times 15.4) = 8.5 \\end{aligned}`
        ]
      ]
    },
    {
      id: 'put-call-parity',
      title: 'Verifying Put-Call Parity',
      description: "Put-Call Parity is a fundamental principle in quantitative finance. It states that holding a Call option and shorting a Put option is financially identical to holding the underlying stock and borrowing the present value of the strike price. If this equation breaks down, arbitrageurs will instantly exploit the discrepancy.",
      kind: 'derivation-steps',
      showParamControls: false,
      stepTexts: [
        "Step 0: European Calls and Puts with the same strike (K) and expiration (T) are mathematically linked by Put-Call Parity.",
        "Step 1: The relationship is C - P = S₀ - Ke^{-rT}.",
        "Step 2: Let's verify this using our calculated prices from Lesson 1 (Call) and Lesson 2 (Put).",
        "Step 3: The left side (C - P) equals the right side! The minor 0.02 difference is simply due to rounding intermediate steps."
      ],
      formulas: [
        [
          `C_0 = 13.4 \\quad (\\text{from Lesson 1})`,
          `P_0 = 8.5 \\quad (\\text{from previous phase})`,
          `S_0 = 100 \\quad K = 100`,
          `r = 0.05 \\quad T = 1`
        ],
        [
          `C_0 - P_0 = S_0 - K e^{-r T}`
        ],
        [
          `\\text{Left Side: } 13.4 - 8.5 = 4.9`,
          `\\text{Right Side: } 100 - 100 e^{-0.05 \\times 1}`
        ],
        [
          `\\text{Right Side: } 100 - 100 (0.9512) = 4.88`,
          `4.9 \\approx 4.88 \\quad \\checkmark`
        ]
      ]
    }
  ]
};
