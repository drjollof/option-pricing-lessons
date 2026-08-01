import { Lesson } from '../../../types';

export const lesson12: Lesson = {
  id: 'lesson-12',
  title: 'Object-Oriented Derivative Pricing',
  description: 'Transition from procedural scripts to an Object-Oriented Programming (OOP) architecture to build a scalable and modular derivative pricing engine.',
  defaultParams: { S0: 100, K: 100, u: 1.15, d: 0.869, r: 0.05, T: 1, N: 3 },
  phases: [
    {
      id: 'procedural-limitations',
      title: 'The Limits of Procedural Code',
      description: 'So far, we have written single, monolithic functions to price our options. While fine for learning, this becomes a nightmare to maintain when you have dozens of different derivatives.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "In our procedural function, the stock dynamics, probability calculations, and the specific Call payoff were completely intertwined.",
        "If we wanted to price a Put, a Binary Option, or a Barrier Option, we would have to copy-paste the entire function and change just two lines.",
        "This violates the DRY (Don't Repeat Yourself) principle. The underlying asset dynamics are identical regardless of the derivative resting on top of it.",
        "We need an architecture that separates the 'Engine' (the tree generation and induction) from the 'Contract' (the specific payoff rules)."
      ],
      formulas: [
        `\\text{Tree Logic} + \\text{Payoff} = \\text{Monolith}`,
        `\\text{Duplicate Code for Put, Barrier, etc.}`,
        `\\text{DRY Principle Violated}`,
        `\\text{Solution: Object-Oriented Design}`
      ]
    },
    {
      id: 'base-class',
      title: 'The TrinomialModel Base Class',
      description: 'We construct a base class that handles all the heavy lifting: initializing parameters, computing risk-neutral probabilities, generating terminal stock prices, and executing the backward induction loop.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "The base class `TrinomialModel` stores the core parameters ($S_0, r, T, N$, etc.) in its constructor.",
        "It contains methods to compute probabilities via variance matching.",
        "It implements the backward induction loop exactly as we did before.",
        "However, when it needs to calculate the terminal payoff, it calls a placeholder method `self.payoff()`, which is not defined in the base class."
      ],
      formulas: [
        `\\text{class } \\text{TrinomialModel}:`,
        `\\quad \\text{def } \\_\\_init\\_\\_(self, S_0, r, T, N, \\dots):`,
        `\\quad \\text{def price(self):}`,
        `\\quad \\text{def payoff(self, S_T): raise NotImplementedError}`
      ],
      codeSnippet: `import numpy as np

class TrinomialModel:
    def __init__(self, S0, r, T, N, sigma):
        self.S0 = S0
        self.r = r
        self.T = T
        self.N = N
        self.sigma = sigma
        self.dt = T / N
        
        # We can compute u, d, pu, pm, pd here using Variance Matching

    def payoff(self, S_T):
        """To be implemented by child classes"""
        raise NotImplementedError("Payoff function must be defined by subclass.")
        
    def price(self):
        # 1. Generate Terminal Stock Prices
        # 2. Call self.payoff(S_T)
        # 3. Perform Backward Induction
        pass`
    },
    {
      id: 'inheritance',
      title: 'Polymorphism via Inheritance',
      description: 'To price a specific derivative, we create a child class that inherits from TrinomialModel. The child only needs to define the payoff() method.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "We create a `EuropeanCall` class that inherits from `TrinomialModel`.",
        "Its constructor accepts all the stock parameters, plus the strike price $K$.",
        "It overrides the `payoff()` method to return $\\max(0, S_T - K)$.",
        "When we call `price()` on the European Call object, the parent class handles the tree logic, but dynamically calls the child's `payoff()` method!"
      ],
      formulas: [
        `\\text{class EuropeanCall(TrinomialModel):}`,
        `\\quad \\text{def } \\_\\_init\\_\\_(self, S_0, K, \\dots):`,
        `\\quad \\text{def payoff(self, S_T):}`,
        `\\quad \\quad \\text{return np.maximum}(0, S_T - K)`
      ],
      codeSnippet: `class EuropeanCall(TrinomialModel):
    def __init__(self, S0, K, r, T, N, sigma):
        super().__init__(S0, r, T, N, sigma)
        self.K = K
        
    def payoff(self, S_T):
        return np.maximum(0, S_T - self.K)

# Pricing is now incredibly clean:
call_option = EuropeanCall(S0=100, K=100, r=0.05, T=1, N=100, sigma=0.2)
fair_value = call_option.price()
print(f"Fair Value: {fair_value:.4f}")`
    },
    {
      id: 'extensibility',
      title: 'Infinite Extensibility',
      description: 'Because the engine is decoupled from the contract, adding a new derivative type takes mere seconds.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "Want to price a European Put? Just inherit and change the payoff.",
        "Want to price a Digital Option? Just inherit and return 1 if $S_T > K$, else 0.",
        "This OOP architecture is how industrial-grade quantitative libraries (like QuantLib) are structured.",
        "It allows quants to model complex, bespoke exotic options without ever touching the core stochastic engine."
      ],
      formulas: [
        `\\text{European Put:} \\max(0, K - S_T)`,
        `\\text{Digital Call:} \\begin{cases} 1 & \\text{if } S_T > K \\\\ 0 & \\text{if } S_T \\le K \\end{cases}`,
        `\\text{Industrial Standard (QuantLib)}`,
        `\\text{Maximum Reusability}`
      ],
      codeSnippet: `class DigitalCall(TrinomialModel):
    def __init__(self, S0, K, r, T, N, sigma):
        super().__init__(S0, r, T, N, sigma)
        self.K = K
        
    def payoff(self, S_T):
        return np.where(S_T > self.K, 1.0, 0.0)

digital = DigitalCall(S0=100, K=100, r=0.05, T=1, N=100, sigma=0.2)
print(f"Digital Option Value: {digital.price():.4f}")`
    }
  ]
};
