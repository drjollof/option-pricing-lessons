import { Lesson } from '../../../types';

export const lesson11: Lesson = {
  id: 'lesson-11',
  title: 'Pricing a European Call in the Trinomial Framework',
  description: 'A complete walkthrough of pricing a European Call option from scratch using the trinomial framework, consolidating the mathematical theory into a unified algorithm.',
  defaultParams: { S0: 100, K: 100, u: 1.25, d: 0.8, r: 0.05, T: 2, N: 2, sigma: 0.2 },
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
        "Step 3: Compute the unique risk-neutral probabilities ($p_u, p_m, p_d$) via variance matching.",
        "Step 4: Traverse the tree backward, computing the expected discounted payoff at each node until we reach the root ($t=0$)."
      ],
      formulas: [
        `S_T \\in \\{S_0 u^N, \\dots, S_0 d^N\\}`,
        `C_T = \\max(0, S_T - K)`,
        `p_u, p_m, p_d \\text{ from FTAP II}`,
        `C_t = e^{-r \\Delta t} (p_u C_{t+1}^{up} + p_m C_{t+1}^{mid} + p_d C_{t+1}^{down})`
      ]
    },
    {
      id: 'terminal-payoff-calc',
      title: 'Terminal Payoffs',
      description: 'First, we generate the array of final stock prices and evaluate the European Call payoff function: max(0, S_T - K).',
      kind: 'tree-reveal',
      treeType: 'trinomial',
      reveals: 'option_tree',
      showParamControls: false,
      visibleParams: [],
      overrideParams: { N: 2 },
      stepTexts: [
        "With $N=2$, a trinomial tree produces $2(2) + 1 = 5$ terminal nodes.",
        "The highest possible stock price is $S_0 u^2 = 100 \\times 1.25^2 = 156.25$.",
        "The payoff at this highest node is $\\max(0, 156.25 - 100) = 56.25$.",
        "We compute this for all 5 nodes to create our terminal payoff array."
      ],
      formulas: [
        `N = 2 \\implies 5 \\text{ Terminal Nodes}`,
        `S_{T, \\text{max}} = 100 \\times 1.25^2 = 156.25`,
        `C_{T, \\text{max}} = \\max(0, 156.25 - 100) = 56.25`,
        `C_T = [56.25, 25.00, 0, 0, 0]`
      ]
    },
    {
      id: 'backward-induction-trinomial',
      title: 'Backward Induction',
      description: 'Starting from the terminal payoffs, we iteratively step backward. The value at any node is the discounted expectation of the three subsequent nodes it connects to.',
      kind: 'derivation-steps',
      treeType: 'trinomial',
      showParamControls: false,
      visibleParams: [],
      overrideParams: { N: 2 },
      stepTexts: [
        "At step $i=1$, we collapse the 5 terminal nodes into 3 intermediate nodes.",
        "For the top node at $i=1$, the expected value uses the top three nodes from $i=2$.",
        "We multiply by $p_u, p_m, p_d$ (which we derived as $0.231, 0.511, 0.258$ respectively).",
        "Finally, we discount by $e^{-r \\Delta t}$ to bring the expected value back in time.",
        "Repeating this process brings us to the root node, yielding the fair price of the option today!"
      ],
      formulas: [
        `C_t = e^{-r \\Delta t} (p_u C_{t+1}^{up} + p_m C_{t+1}^{mid} + p_d C_{t+1}^{down})`,
        `C_{1}^{\\text{top}} = e^{-0.05} (0.231(56.25) + 0.511(25) + 0.258(0))`,
        `C_{1}^{\\text{top}} = 0.9512 \\times (12.99 + 12.77 + 0) = 24.51`,
        `C_0 = 12.87`,
        `\\text{Fair Price } = 12.87`
      ]
    }
  ]
};
