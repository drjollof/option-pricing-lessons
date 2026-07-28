import { Lesson } from '@/content/types';

export const lesson21: Lesson = {
  id: 'lesson-21',
  title: 'Bayesian Updating',
  description: "Dive deeper into the Kalman Filter's recursive Bayesian update and learn how the Kalman Smoother refines past estimates.",
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l21-p1-kalman-is-bayes',
      title: 'Kalman Filter as Bayesian Inference',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Previously, we learned that Bayesian Inference combines a **Prior Belief** with a **Likelihood (Data)** to form a **Posterior Estimate**.",
        "The Kalman Filter we built during our State Space Model Construct is the exact mathematical equivalent of recursive Bayesian updating for normal distributions!",
        "1. The **Prior** is the Prediction Step (what we guess before seeing data).",
        "2. The **Likelihood** is the new Observation (the data point).",
        "3. The **Posterior** is the Update Step (our final state estimate)."
      ],
      formulas: [
        [ "\\text{Bayesian Mapping to Kalman:}" ],
        [ "\\text{Prior: } P(x_t | y_{1:t-1}) \\implies \\text{Predict Step}" ],
        [ "\\text{Likelihood: } P(y_t | x_t) \\implies \\text{Observation}" ],
        [ "\\text{Posterior: } P(x_t | y_{1:t}) \\implies \\text{Update Step}" ]
      ]
    },
    {
      id: 'l21-p2-precision-weighting',
      title: 'Precision Weighting Revisited',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "Just like in our Bayesian GARCH example, the Kalman Gain is simply a precision-weighted average.",
        "Let's say our Prior (Prediction) state is $100.00$ with a variance of $2.0$. Its Precision is $1/2.0 = 0.50$.",
        "Our Likelihood (Observation) is $104.00$ with a noise variance of $8.0$. Its Precision is $1/8.0 = 0.125$.",
        "The Posterior State is calculated by weighting them: $(100.00 \\times 0.50 + 104.00 \\times 0.125) / (0.50 + 0.125)$.",
        "This gives $(50.0 + 13.0) / 0.625 = 63.0 / 0.625 = 100.80$. Because the observation was extremely noisy, we largely ignored it and stayed close to our Prior!"
      ],
      formulas: [
        [ "\\text{Posterior } = \\frac{\\text{Prior} \\times \\text{Prior Precision} + \\text{Obs} \\times \\text{Obs Precision}}{\\text{Total Precision}}" ],
        [ "\\text{Prior Precision} = 1 / 2.0 = 0.50" ],
        [ "\\text{Obs Precision} = 1 / 8.0 = 0.125" ],
        [ "\\text{Total Precision} = 0.50 + 0.125 = 0.625" ],
        [ "\\text{Posterior } = \\frac{(100.00 \\times 0.50) + (104.00 \\times 0.125)}{0.625} = 100.80" ]
      ]
    },
    {
      id: 'l21-p3-kalman-smoother',
      title: 'The Kalman Smoother',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "The standard Kalman Filter runs *forward* in time. At time $t=5$, it only uses data from days $1$ through $5$.",
        "However, what if we want to know what the true state was on day $5$, and we are currently on day $10$? We can use the data from days $6$ through $10$ to go back and refine our guess for day $5$.",
        "This is called the **Kalman Smoother** (or the Rauch-Tung-Striebel Smoother). It runs *backwards* from the end of the dataset to the beginning."
      ],
      formulas: [
        [ "\\text{Kalman Filter (Forward): } P(x_t | y_{1:t})" ],
        [ "\\text{Kalman Smoother (Backward): } P(x_t | y_{1:T})" ],
        [ "\\text{Where } T \\text{ is the final time period.}" ]
      ]
    },
    {
      id: 'l21-p4-smoother-example',
      title: 'Smoothing Example',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "**Numeric Example:** On Day 1, we predict the true state is $100$. The observation is $105$. The Filter updates the state to $103$.",
        "On Day 2, the observation drops heavily to $98$. The Filter updates the state for Day 2 to $99$.",
        "The Smoother now looks backwards. It sees that Day 2 dropped to $99$. This implies that the Day 1 observation of $105$ was likely a massive noise spike (a fluke).",
        "The Smoother revises the Day 1 estimate down from $103$ to $101$, pulling it closer to the reality revealed by future data!"
      ],
      formulas: [
        [ "\\text{Day 1 Filter Estimate: } 103" ],
        [ "\\text{Day 2 Filter Estimate: } 99" ],
        [ "\\text{Day 1 Smoothed Estimate: } 101" ],
        [ "\\text{Future data fixes past mistakes!}" ]
      ],
      codeSnippet: `import numpy as np

# A conceptual backward smoothing pass (RTS Smoother)
def kalman_smoother(filter_states, filter_vars, pred_states, pred_vars, transition_matrix):
    n = len(filter_states)
    smoothed_states = [0] * n
    smoothed_vars = [0] * n
    
    # The last state is identical to the filter state
    smoothed_states[-1] = filter_states[-1]
    smoothed_vars[-1] = filter_vars[-1]
    
    # Run backwards
    for t in range(n - 2, -1, -1):
        # Smoothing Gain (J)
        J = filter_vars[t] * transition_matrix / pred_vars[t+1]
        
        # Update smoothed state using the future state
        smoothed_states[t] = filter_states[t] + J * (smoothed_states[t+1] - pred_states[t+1])
        smoothed_vars[t] = filter_vars[t] + J**2 * (smoothed_vars[t+1] - pred_vars[t+1])
        
    return smoothed_states

# Example usage (requires storing predict/update variables from the forward pass)
# smoothed = kalman_smoother(states, vars, preds, pred_vars, 1.0)`
    }
  ]
};
