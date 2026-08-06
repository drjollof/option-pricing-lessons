"use client";
import React, { useState, use, useEffect } from 'react';
import { ThreePanePlayer } from '@/components/ThreePanePlayer';
import { ParamControls } from '@/components/ParamControls';
import { EconometricsParamControls } from '@/components/EconometricsParamControls';
import { LessonPhase } from '@/content/types';
import Link from 'next/link';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { useLessonStore } from '@/store/lessonStore';

const optionsVisualizers = ['stock_tree', 'option_tree', 'delta_tree', 'convergence-sweep', 'path-explorer', 'monte-carlo', 'stochastic-path', 'mc-histogram', 'distribution-curve', 'bsm-greeks', 'mc-convergence'] as const;
const econometricsVisualizers = ['scatter-plot', 'correlation-heatmap', 'pca-scree', 'distribution-curve', 'machine-learning', 'arima-signature', 'copula-3d', 'network-theory', 'stochastic-path', 'qq-plot'] as const;

export default function SandboxPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const isEconometrics = courseId === 'econometrics';
  const defaultVis = isEconometrics ? 'scatter-plot' : 'stock_tree';
  
  const [visualizer, setVisualizer] = useState<string>(defaultVis);
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');
  const [simModel, setSimModel] = useState<'gbm' | 'vasicek'>('gbm');
  const updateParams = useLessonStore(state => state.updateParams);

  const activeVisualizers = isEconometrics ? econometricsVisualizers : optionsVisualizers;

  // Make sure visualizer state is valid for the current course
  if (isEconometrics && !econometricsVisualizers.includes(visualizer as any)) {
    setVisualizer('scatter-plot');
  } else if (!isEconometrics && !optionsVisualizers.includes(visualizer as any)) {
    setVisualizer('stock_tree');
  }

  let stepTexts: string[] = [];
  let formulas: (string | string[] | null)[] = [];
  let codeSnippet: string | undefined = undefined;
  let kind: LessonPhase['kind'] = 'tree-reveal';
  let reveals: any = undefined;
  let overrideParams: any = undefined;

  // Options Visualizers
  if (visualizer === 'stock_tree') {
    kind = 'tree-reveal'; reveals = 'stock_tree';
    stepTexts = [
      "Welcome to the Sandbox! This is the Stock Tree.",
      "Adjust S0, u, and d below to see how the asset price evolves over time."
    ];
    formulas = [
      ["S_{up} = S \\times u", "S_{down} = S \\times d"],
      ["S_{0} = \\text{Initial Price}"]
    ];
    codeSnippet = `def build_stock_tree(S0, u, d, N):\n    tree = [[0.0 for j in range(i + 1)] for i in range(N + 1)]\n    for i in range(N + 1):\n        for j in range(i + 1):\n            tree[i][j] = S0 * (u ** j) * (d ** (i - j))\n    return tree`;
  } else if (visualizer === 'option_tree') {
    kind = 'tree-reveal'; reveals = 'option_tree';
    stepTexts = [
      `Welcome to the Sandbox! This is the Option Tree for a ${optionType}.`,
      "Adjust K and r to see how the option payoff changes at expiration and propagates backwards."
    ];
    formulas = [
      [optionType === 'call' ? "C_T = \\max(0, S_T - K)" : "P_T = \\max(0, K - S_T)"],
      ["V = e^{-r\\Delta t} [p V_{up} + (1-p) V_{down}]"]
    ];
    codeSnippet = `def backward_induct(stock_tree, K, r, T, N, is_call=True):\n    dt = T / N\n    # ... setup risk-neutral probability p ...\n    # Terminal payoffs\n    option_tree = [[0.0 for j in range(i + 1)] for i in range(N + 1)]\n    for j in range(N + 1):\n        option_tree[N][j] = max(0, stock_tree[N][j] - K) if is_call else max(0, K - stock_tree[N][j])\n    \n    # Backward induction\n    for i in range(N - 1, -1, -1):\n        for j in range(i + 1):\n            option_tree[i][j] = exp(-r*dt) * (p * option_tree[i+1][j+1] + (1-p) * option_tree[i+1][j])\n    return option_tree`;
  } else if (visualizer === 'delta_tree') {
    kind = 'tree-reveal'; reveals = 'delta_tree';
    stepTexts = [
      "Welcome to the Sandbox! This is the Delta Tree.",
      "Adjust parameters to see how the required hedging ratio changes at each node."
    ];
    formulas = [
      ["\\Delta = \\frac{V_{up} - V_{down}}{S_{up} - S_{down}}"]
    ];
    codeSnippet = `def calculate_delta_tree(stock_tree, option_tree, N):\n    delta_tree = [[0.0 for j in range(i + 1)] for i in range(N)]\n    for i in range(N):\n        for j in range(i + 1):\n            dS = stock_tree[i+1][j+1] - stock_tree[i+1][j]\n            dV = option_tree[i+1][j+1] - option_tree[i+1][j]\n            delta_tree[i][j] = dV / dS\n    return delta_tree`;
  } else if (visualizer === 'convergence-sweep') {
    kind = 'convergence-sweep';
    stepTexts = [
      "Convergence Sweep visualizer.",
      "See how the binomial model converges to Black-Scholes as N increases."
    ];
    formulas = [["\\lim_{N \\to \\infty} V_{Binomial} = V_{Black-Scholes}"]];
  } else if (visualizer === 'path-explorer') {
    kind = 'path-explorer';
    stepTexts = [
      "Path Explorer visualizer.",
      "Follow a specific path through the tree."
    ];
    formulas = [["S_t = S_0 u^k d^{t-k}"]];
  } else if (visualizer === 'monte-carlo') {
    kind = 'monte-carlo';
    stepTexts = [
      "Monte Carlo Simulation.",
      "Simulate continuous asset price paths using geometric Brownian motion."
    ];
    formulas = [["dS_t = \\mu S_t dt + \\sigma S_t dW_t"]];
  } else if (visualizer === 'stochastic-path') {
    kind = 'stochastic-path';
    if (simModel === 'gbm') {
      stepTexts = [
        "Geometric Brownian Motion (GBM) Path",
        "Observe a continuous stochastic price path with drift and volatility."
      ];
      formulas = [["dS = S(\\mu dt + \\sigma dW_t)"]];
      overrideParams = { u: 2.1, sigma: 0.2, S0: 100, T: 1, modelMode: undefined };
    } else {
      stepTexts = [
        "Vasicek Interest Rate Model",
        "Observe a mean-reverting stochastic path for interest rates."
      ];
      formulas = [["dr_t = k(\\theta - r_t)dt + \\sigma dW_t"]];
      overrideParams = { u: 0.05, S0: 0.10, K: 0.5, sigma: 0.02, modelMode: 'vasicek' };
    }
  } else if (visualizer === 'mc-histogram') {
    kind = 'mc-histogram';
    if (simModel === 'gbm') {
      stepTexts = [
        "GBM Terminal Distribution",
        "Observe the lognormal distribution of stock prices."
      ];
      formulas = [["\\ln(S_T) \\sim \\mathcal{N}"]];
      overrideParams = { u: 2.1, sigma: 0.2, S0: 100, T: 1, modelMode: undefined };
    } else {
      stepTexts = [
        "Vasicek Terminal Distribution",
        "Observe the normal distribution of mean-reverting interest rates."
      ];
      formulas = [["r_T \\sim \\mathcal{N}"]];
      overrideParams = { u: 0.05, S0: 0.10, K: 0.5, sigma: 0.02, modelMode: 'vasicek' };
    }
  } else if (visualizer === 'distribution-curve') {
    kind = 'distribution-curve';
    stepTexts = [
      "Analytical Distribution Curves",
      "Observe the standard normal curves utilized in Black-Scholes."
    ];
    formulas = [["N(d_1), N(d_2)"]];
  } else if (visualizer === 'bsm-greeks') {
    kind = 'bsm-greeks';
    stepTexts = [
      "Black-Scholes-Merton & The Greeks",
      "Adjust analytical parameters to see how option prices and their risk metrics (Greeks) change."
    ];
    formulas = [
      ["C = S \\mathcal{N}(d_1) - K e^{-rT} \\mathcal{N}(d_2)"],
      ["\\Delta, \\Gamma, \\nu, \\Theta, \\rho"]
    ];
  } else if (visualizer === 'mc-convergence') {
    kind = 'mc-convergence';
    stepTexts = [
      "Monte Carlo Convergence",
      "Observe how Monte Carlo price estimates converge to the exact Black-Scholes analytical price as N increases."
    ];
    formulas = [["C_0 = e^{-rT} \\frac{1}{N} \\sum \\max(0, S_T - K)"]];
  }
  
  // Econometrics Visualizers
  else if (visualizer === 'scatter-plot') {
    kind = 'scatter-plot';
    stepTexts = [
      "OLS Regression Simulator",
      "Observe how the regression line fits the synthetic data."
    ];
    formulas = [
      ["\\hat{Y}_i = \\hat{\\beta}_0 + \\hat{\\beta}_1 X_i"],
      ["\\text{OLS Objective: Minimize } \\sum_{i=1}^n e_i^2"]
    ];
  } else if (visualizer === 'correlation-heatmap') {
    kind = 'correlation-heatmap';
    stepTexts = ["Correlation Heatmap", "Explore relationships across multiple variables."];
    formulas = [["\\rho_{X,Y} = \\frac{Cov(X,Y)}{\\sigma_X \\sigma_Y}"]];
  } else if (visualizer === 'pca-scree') {
    kind = 'pca-scree';
    stepTexts = ["PCA Scree Plot", "Analyze variance explained by principal components."];
    formulas = [["\\mathbf{X} = \\mathbf{W} \\mathbf{Z} + \\boldsymbol{\\mu}"]];
  } else if (visualizer === 'distribution-curve') {
    kind = 'distribution-curve';
    stepTexts = ["Distributions & Moments", "Observe the effects of skewness and kurtosis."];
    formulas = [["\\gamma_1 = \\frac{E[(X-\\mu)^3]}{\\sigma^3}", "\\kappa = \\frac{E[(X-\\mu)^4]}{\\sigma^4}"]];
  } else if (visualizer === 'machine-learning') {
    kind = 'machine-learning';
    stepTexts = ["Clustering & Classification", "Observe how algorithms like K-Means cluster data points."];
    formulas = [["\\text{Minimize: } \\sum_{i=1}^{K} \\sum_{x \\in C_i} ||x - \\mu_i||^2"]];
  } else if (visualizer === 'arima-signature') {
    kind = 'arima-signature';
    stepTexts = ["Time Series Forecasting", "Identify ACF and PACF signatures for ARIMA models."];
    formulas = [["Y_t = c + \\phi_1 Y_{t-1} + \\dots + \\theta_1 \\epsilon_{t-1} + \\epsilon_t"]];
  } else if (visualizer === 'copula-3d') {
    kind = 'copula-3d';
    stepTexts = ["3D Copula Visualization", "Explore complex joint dependencies between variables."];
    formulas = [["C(u, v) = P(U \\le u, V \\le v)"]];
  } else if (visualizer === 'network-theory') {
    kind = 'network-theory';
    stepTexts = ["Network Theory & Contagion", "Visualize how shocks propagate through highly connected nodes."];
    formulas = [["C_D(v) = \\frac{\\text{deg}(v)}{N-1}"]];
  } else if (visualizer === 'stochastic-path') {
    kind = 'stochastic-path';
    stepTexts = ["Stochastic Paths", "Observe mean-reverting processes like the Ornstein-Uhlenbeck model."];
    formulas = [["dr_t = \\kappa(\\theta - r_t)dt + \\sigma dW_t"]];
  } else if (visualizer === 'qq-plot') {
    kind = 'qq-plot';
    stepTexts = ["Q-Q Plot", "Compare the empirical quantiles against a theoretical normal distribution."];
    formulas = [["Q_{\\text{data}}(p) = Q_{\\text{normal}}(p)"]];
  }

  const isTreeVisualizer = visualizer === 'stock_tree' || visualizer === 'option_tree' || visualizer === 'delta_tree';

  const dummyPhase: LessonPhase = {
    id: 'sandbox-phase',
    title: isEconometrics ? 'Econometrics Sandbox' : 'Pricing Sandbox',
    kind,
    reveals,
    optionType,
    stepTexts,
    formulas,
    codeSnippet,
    overrideParams,
    showAllInstantly: !isTreeVisualizer
  };

  // Sync override params with global state when visualizer changes
  useEffect(() => {
    if (overrideParams) {
      updateParams(overrideParams);
    }
  }, [visualizer, simModel]); // Only run when these change, to apply defaults but allow user overrides after

  // Determine what parameters to show
  let currentVisibleParams: string[] | undefined;
  if (!isEconometrics) {
    switch (visualizer) {
      case 'stock_tree':
        currentVisibleParams = ['S0', 'u', 'd', 'N'];
        break;
      case 'option_tree':
      case 'delta_tree':
      case 'path-explorer':
        currentVisibleParams = ['S0', 'K', 'u', 'd', 'r', 'N', 'T'];
        break;
      case 'convergence-sweep':
      case 'monte-carlo':
      case 'bsm-greeks':
      case 'mc-convergence':
        currentVisibleParams = ['S0', 'K', 'r', 'sigma', 'T'];
        break;
      case 'distribution-curve':
        // DistributionVisualizer only reads sigma and T (effectiveSigma = sigma * sqrt(T))
        currentVisibleParams = ['sigma', 'T'];
        break;
      case 'stochastic-path':
      case 'mc-histogram':
        currentVisibleParams = ['S0', 'sigma', 'T', 'u'];
        break;
      default:
        currentVisibleParams = undefined;
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-6 md:p-10 font-sans selection:bg-blue-200 transition-colors">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
           <div className="flex justify-between items-center mb-4">
             <Link href={`/courses/${courseId}`} className="inline-flex items-center text-blue-600 hover:underline font-semibold text-sm transition-colors">
               ← Back to Course
             </Link>
             <DarkModeToggle />
           </div>
           
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
               <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                 {isEconometrics ? 'Econometrics Sandbox' : 'Sandbox Explorer'}
               </h1>
               <p className="text-slate-600 dark:text-slate-400 mt-1">
                 {isEconometrics ? 'Experiment freely with the econometric models.' : 'Experiment freely with the pricing engine.'}
               </p>
             </div>
             
             <div className="flex flex-wrap gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-lg max-w-2xl justify-end">
               {activeVisualizers.map(v => (
                 <button
                   key={v}
                   onClick={() => setVisualizer(v)}
                   className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${visualizer === v ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/50 dark:hover:bg-slate-700/50'}`}
                 >
                   {v.replace('_', ' ').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                 </button>
               ))}
             </div>
           </div>
        </header>

        {!isEconometrics && (visualizer === 'option_tree' || visualizer === 'delta_tree' || visualizer === 'convergence-sweep' || visualizer === 'path-explorer' || visualizer === 'monte-carlo' || visualizer === 'bsm-greeks' || visualizer === 'mc-convergence') && (
           <div className="mb-6 flex flex-wrap gap-2">
             <button onClick={() => setOptionType('call')} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${optionType === 'call' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800' : 'bg-white text-slate-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-750'}`}>Call Option</button>
             <button onClick={() => setOptionType('put')} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${optionType === 'put' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800' : 'bg-white text-slate-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-750'}`}>Put Option</button>
           </div>
        )}

        {!isEconometrics && (visualizer === 'stochastic-path' || visualizer === 'mc-histogram') && (
           <div className="mb-6 flex flex-wrap gap-2">
             <button onClick={() => setSimModel('gbm')} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${simModel === 'gbm' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800' : 'bg-white text-slate-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-750'}`}>Geometric Brownian Motion</button>
             <button onClick={() => setSimModel('vasicek')} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${simModel === 'vasicek' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800' : 'bg-white text-slate-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-750'}`}>Vasicek Model</button>
           </div>
        )}

        {!isEconometrics ? (
          <ParamControls 
            maxN={visualizer === 'convergence-sweep' ? 100 : visualizer === 'path-explorer' ? 5 : 6} 
            visibleParams={currentVisibleParams}
          />
        ) : (
          <EconometricsParamControls visualizer={visualizer} />
        )}
        
        <div className="mt-8">
          <ThreePanePlayer 
             phase={dummyPhase} 
             key={visualizer + optionType}
          />
        </div>
      </div>
    </main>
  );
}
