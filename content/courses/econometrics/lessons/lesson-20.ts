import { Lesson } from '@/content/types';

export const lesson20: Lesson = {
  id: 'lesson-20',
  title: 'State Space Model Construct',
  description: 'Explore how State Space Models separate true underlying variables (like the true price) from noisy market observations using the Kalman Filter framework.',
  defaultParams: {
    S0: 100, K: 100, r: 0.05, sigma: 0.2, u: 0, d: 3, N: 3, T: 1
  },
  phases: [
    {
      id: 'l20-p1-hidden-states',
      title: 'Hidden States vs Observations',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "In finance, the prices we see on an exchange are often 'noisy' due to bid-ask bounce, temporary liquidity shocks, or market microstructure.",
        "A **State Space Model** assumes there is a 'True', hidden variable (the **State**) that we cannot see directly. We only see the **Observation**, which is the True State corrupted by noise.",
        "**Numeric Example:** Suppose the *True* fundamental value of a stock is exactly $\\$100.00$. Due to a burst of random market noise ($\\$2.00$), the *Observed* price on your screen is $\\$102.00$."
      ],
      formulas: [
        [ "\\text{Observation} = \\text{True State} + \\text{Noise}" ],
        [ "\\$102.00 = \\$100.00 + \\$2.00" ]
      ]
    },
    {
      id: 'l20-p2-the-two-equations',
      title: 'The Two Equations',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "A State Space Model relies on two core equations.",
        "1. **The State Equation (Transition):** How does the hidden truth evolve over time? If yesterday's true value was $100.00$, and it evolves as a random walk, today's true value might step up by $0.50$ to $100.50$.",
        "2. **The Observation Equation (Measurement):** How does the truth translate into what we see? If today's true value is $100.50$, and measurement noise hits at $-1.50$, we observe a price of $99.00$."
      ],
      formulas: [
        [ "\\text{1. State Equation: } x_t = A x_{t-1} + w_t" ],
        [ "\\text{Example: } x_t = 1(100.00) + 0.50 = 100.50" ],
        [ "\\text{2. Observation Equation: } y_t = H x_t + v_t" ],
        [ "\\text{Example: } y_t = 1(100.50) + (-1.50) = 99.00" ]
      ]
    },
    {
      id: 'l20-p3-kalman-predict',
      title: 'The Kalman Filter: Predict Step',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "The **Kalman Filter** is the algorithm used to solve State Space models. It works in two steps: Predict, then Update.",
        "**Predict Step:** Before the market opens today, what is our best guess of the true state? Since it's a random walk, our best guess for today is yesterday's true state.",
        "**Numeric Example:** If our estimate for yesterday was $100.00$, our prediction for today is $100.00$.",
        "However, because time has passed, our uncertainty (variance) *increases*. If yesterday's variance was $2.0$, and the random walk adds $1.0$ of variance, our new Prediction Variance is $3.0$."
      ],
      formulas: [
        [ "\\text{Predict State: } \\hat{x}_{t|t-1} = A \\hat{x}_{t-1}" ],
        [ "\\hat{x}_{t|t-1} = 1(100.00) = 100.00" ],
        [ "\\text{Predict Variance: } P_{t|t-1} = A^2 P_{t-1} + Q" ],
        [ "P_{t|t-1} = 1^2(2.0) + 1.0 = 3.0" ]
      ]
    },
    {
      id: 'l20-p4-kalman-update',
      title: 'The Kalman Filter: Update Step',
      kind: 'static-slides',
      visibleParams: [],
      stepTexts: [
        "**Update Step:** The market opens, and we observe a price of $99.00$. Do we throw away our $100.00$ prediction? No!",
        "We calculate the **Kalman Gain (K)**, which decides how much to trust the observation vs our prediction. It's a ratio of our Prediction Variance to the Total Variance (Prediction + Measurement Noise).",
        "Suppose K is calculated as $0.4$. This means we trust the observation $40\\%$ and our prediction $60\\%$.",
        "**Numeric Example:** Our new True State is our Prediction ($100.00$) plus $40\\%$ of the 'surprise' ($99.00 - 100.00 = -1.00$). The new state is $100.00 + 0.4(-1.00) = 99.60$."
      ],
      formulas: [
        [ "\\text{Kalman Gain: } K_t = \\frac{\\text{Prediction Variance}}{\\text{Total Variance}}" ],
        [ "\\text{Example: } K_t = 0.4" ],
        [ "\\text{Update State: } \\hat{x}_t = \\text{Prediction} + K_t (\\text{Observation} - \\text{Prediction})" ],
        [ "\\hat{x}_t = 100.00 + 0.4(99.00 - 100.00)" ],
        [ "\\hat{x}_t = 100.00 - 0.40 = 99.60" ]
      ],
      codeSnippet: `import numpy as np

# A very simple 1D Kalman Filter
def kalman_filter(observations, initial_state, initial_variance, noise_var, process_var):
    states = []
    state = initial_state
    variance = initial_variance
    
    for y in observations:
        # 1. Predict
        pred_state = state
        pred_var = variance + process_var
        
        # 2. Update
        K = pred_var / (pred_var + noise_var) # Kalman Gain
        state = pred_state + K * (y - pred_state)
        variance = (1 - K) * pred_var
        
        states.append(state)
        
    return states

obs = [102.0, 99.0, 101.5]
true_states = kalman_filter(obs, 100.0, 2.0, noise_var=2.0, process_var=1.0)
print([round(s, 2) for s in true_states])`
    }
  ]
};
