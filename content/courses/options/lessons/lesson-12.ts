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
        "The base class TrinomialModel stores the core parameters (S0, r, T, N, etc.) in its constructor.",
        "It contains methods to compute probabilities via variance matching.",
        "It implements the backward induction loop exactly as we did before.",
        "However, when it needs to calculate the terminal payoff, it calls a placeholder method self.payoff(), which is not defined in the base class."
      ],
      formulas: [
        `\\text{class } TrinomialModel:`,
        `\\quad \\text{def } \\_\\_init\\_\\_(self, S0, r, T, N, \\dots):`,
        `\\quad \\text{def price(self):}`,
        `\\quad \\text{def payoff(self, S\\_T): raise NotImplementedError}`
      ],
      codeSnippet: `import numpy as np

class TrinomialModel:
    def __init__(self, S0, r, T, N, u, d, pu, pm, pd):
        self.S0 = S0
        self.r = r
        self.T = T
        self.N = N
        self.u = u
        self.d = d
        self.pu = pu
        self.pm = pm
        self.pd = pd
        
    def payoff(self, S_T):
        # To be implemented by subclasses
        raise NotImplementedError("Subclass must implement abstract method")
        
    def price(self):
        dt = self.T / self.N
        df = np.exp(-self.r * dt)
        
        j = np.arange(self.N, -self.N - 1, -1)
        S_T = self.S0 * (self.u ** j)
        
        # Call the subclass-specific payoff
        V = self.payoff(S_T)
        
        for i in range(self.N - 1, -1, -1):
            V_up = V[:-2]
            V_mid = V[1:-1]
            V_down = V[2:]
            V = df * (self.pu * V_up + self.pm * V_mid + self.pd * V_down)
            
        return V[0]`
    },
    {
      id: 'subclass-inheritance',
      title: 'Inheritance and Subclasses',
      description: 'With our engine built, creating a new derivative is incredibly simple. We create a subclass that inherits from TrinomialModel and strictly defines its own unique payoff structure.',
      kind: 'static-slides',
      showParamControls: false,
      showAllInstantly: true,
      visibleParams: [],
      stepTexts: [
        "We create a class TrinomialCall that inherits from TrinomialModel.",
        "Its constructor simply passes the parameters up to the parent class and stores the Strike Price K.",
        "It overrides the payoff() method with the specific Call logic: max(0, S - K).",
        "We can now price the option by instantiating the subclass and calling the inherited price() method."
      ],
      formulas: [
        `\\text{class } TrinomialCall(TrinomialModel):`,
        `\\quad \\text{def } \\_\\_init\\_\\_(self, S0, K, \\dots):`,
        `\\quad \\text{def payoff(self, S\\_T): return max(0, S\\_T - K)}`,
        `call = TrinomialCall(...); call.price()`
      ],
      codeSnippet: `class TrinomialCall(TrinomialModel):
    def __init__(self, S0, K, r, T, N, u, d, pu, pm, pd):
        super().__init__(S0, r, T, N, u, d, pu, pm, pd)
        self.K = K
        
    def payoff(self, S_T):
        return np.maximum(0, S_T - self.K)

# Pricing is now clean and modular
my_call = TrinomialCall(S0=100, K=100, r=0.05, T=1, N=100, 
                        u=1.15, d=1/1.15, pu=0.3, pm=0.4, pd=0.3)
print(f"Option Price: \${my_call.price():.2f}")`
    }
  ]
};
