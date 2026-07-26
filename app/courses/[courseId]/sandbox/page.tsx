"use client";
import React, { useState, use } from 'react';
import { ThreePanePlayer } from '@/components/ThreePanePlayer';
import { ParamControls } from '@/components/ParamControls';
import { LessonPhase } from '@/content/types';
import Link from 'next/link';
import { useLessonStore } from '@/store/lessonStore';
import { DarkModeToggle } from '@/components/DarkModeToggle';

export default function SandboxPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const [visualizer, setVisualizer] = useState<'stock_tree' | 'option_tree' | 'delta_tree' | 'convergence-sweep' | 'path-explorer' | 'monte-carlo'>('stock_tree');
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');

  let stepTexts: string[] = [];
  let formulas: string[][] = [];
  let codeSnippet: string | undefined = undefined;

  if (visualizer === 'stock_tree') {
    stepTexts = [
      "Welcome to the Sandbox! This is the Stock Tree.",
      "Adjust S0, u, and d below to see how the asset price evolves over time."
    ];
    formulas = [
      ["S_{up} = S \\times u", "S_{down} = S \\times d"],
      ["S_{0} = \\text{Initial Price}"]
    ];
    codeSnippet = `def build_stock_tree(S0, u, d, N):
    tree = [[0.0 for j in range(i + 1)] for i in range(N + 1)]
    for i in range(N + 1):
        for j in range(i + 1):
            tree[i][j] = S0 * (u ** j) * (d ** (i - j))
    return tree`;
  } else if (visualizer === 'option_tree') {
    stepTexts = [
      `Welcome to the Sandbox! This is the Option Tree for a ${optionType}.`,
      "Adjust K and r to see how the option payoff changes at expiration and propagates backwards."
    ];
    formulas = [
      [optionType === 'call' ? "C_T = \\max(0, S_T - K)" : "P_T = \\max(0, K - S_T)"],
      ["V = e^{-r\\Delta t} [p V_{up} + (1-p) V_{down}]"]
    ];
    codeSnippet = `def backward_induct(stock_tree, K, r, T, N, is_call=True):
    dt = T / N
    # ... setup risk-neutral probability p ...
    # Terminal payoffs
    option_tree = # ... initialized ...
    for j in range(N + 1):
        option_tree[N][j] = max(0, stock_tree[N][j] - K) if is_call else max(0, K - stock_tree[N][j])
    
    # Backward induction
    for i in range(N - 1, -1, -1):
        for j in range(i + 1):
            option_tree[i][j] = exp(-r*dt) * (p * option_tree[i+1][j+1] + (1-p) * option_tree[i+1][j])
    return option_tree`;
  } else if (visualizer === 'delta_tree') {
    stepTexts = [
      "Welcome to the Sandbox! This is the Delta Tree.",
      "Adjust parameters to see how the required hedging ratio changes at each node."
    ];
    formulas = [
      ["\\Delta = \\frac{V_{up} - V_{down}}{S_{up} - S_{down}}"]
    ];
    codeSnippet = `def calculate_delta_tree(stock_tree, option_tree, N):
    delta_tree = [[0.0 for j in range(i + 1)] for i in range(N)]
    for i in range(N):
        for j in range(i + 1):
            dS = stock_tree[i+1][j+1] - stock_tree[i+1][j]
            dV = option_tree[i+1][j+1] - option_tree[i+1][j]
            delta_tree[i][j] = dV / dS
    return delta_tree`;
  } else if (visualizer === 'convergence-sweep') {
    stepTexts = [
      "Convergence Sweep visualizer.",
      "See how the binomial model converges to Black-Scholes as N increases."
    ];
    formulas = [["\\lim_{N \\to \\infty} V_{Binomial} = V_{Black-Scholes}"]];
  } else if (visualizer === 'path-explorer') {
    stepTexts = [
      "Path Explorer visualizer.",
      "Follow a specific path through the tree."
    ];
    formulas = [["S_t = S_0 u^k d^{t-k}"]];
  } else if (visualizer === 'monte-carlo') {
    stepTexts = [
      "Monte Carlo Simulation.",
      "Simulate continuous asset price paths using geometric Brownian motion."
    ];
    formulas = [["dS_t = \\mu S_t dt + \\sigma S_t dW_t"]];
  }

  const dummyPhase: LessonPhase = {
    id: 'sandbox-phase',
    title: 'Sandbox Explorer',
    kind: visualizer === 'convergence-sweep' ? 'convergence-sweep' : visualizer === 'path-explorer' ? 'path-explorer' : visualizer === 'monte-carlo' ? 'monte-carlo' : 'tree-reveal',
    reveals: visualizer === 'convergence-sweep' || visualizer === 'path-explorer' || visualizer === 'monte-carlo' ? undefined : visualizer,
    optionType,
    stepTexts,
    formulas,
    codeSnippet
  };

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
               <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Sandbox Explorer</h1>
               <p className="text-slate-600 dark:text-slate-400 mt-1">Experiment freely with the pricing engine.</p>
             </div>
             
             <div className="flex gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-lg">
               {(['stock_tree', 'option_tree', 'delta_tree', 'convergence-sweep', 'path-explorer', 'monte-carlo'] as const).map(v => (
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

        {(visualizer === 'option_tree' || visualizer === 'delta_tree' || visualizer === 'convergence-sweep' || visualizer === 'path-explorer' || visualizer === 'monte-carlo') && (
           <div className="mb-6 flex gap-2">
             <button onClick={() => setOptionType('call')} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${optionType === 'call' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800' : 'bg-white text-slate-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-750'}`}>Call Option</button>
             <button onClick={() => setOptionType('put')} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${optionType === 'put' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800' : 'bg-white text-slate-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-750'}`}>Put Option</button>
           </div>
        )}

        <ParamControls maxN={visualizer === 'convergence-sweep' ? 100 : visualizer === 'path-explorer' ? 5 : 6} />
        
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
