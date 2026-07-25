"use client";
import React, { useState } from 'react';
import { ThreePanePlayer } from '@/components/ThreePanePlayer';
import { ParamControls } from '@/components/ParamControls';
import { LessonPhase } from '@/content/types';
import Link from 'next/link';
import { useLessonStore } from '@/store/lessonStore';
import { DarkModeToggle } from '@/components/DarkModeToggle';

export default function SandboxPage() {
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
            expected = p * option_tree[i+1][j+1] + (1-p) * option_tree[i+1][j]
            option_tree[i][j] = math.exp(-r * dt) * expected
            
    return option_tree`;
  } else if (visualizer === 'delta_tree') {
    stepTexts = [
      "Welcome to the Sandbox! This is the Delta Tree.",
      "Notice how Delta approaches 1.0 (or -1.0) deep in the money, and 0 out of the money."
    ];
    formulas = [
      ["\\Delta = \\frac{V_{up} - V_{down}}{S_{up} - S_{down}}"],
      []
    ];
    codeSnippet = `def calculate_delta(stock_tree, option_tree, N):
    delta_tree = [[0.0 for j in range(i + 1)] for i in range(N)]
    for i in range(N):
        for j in range(i + 1):
            dV = option_tree[i+1][j+1] - option_tree[i+1][j]
            dS = stock_tree[i+1][j+1] - stock_tree[i+1][j]
            delta_tree[i][j] = dV / dS if dS != 0 else 0
    return delta_tree`;
  }

  const phase: LessonPhase = {
    id: 'sandbox',
    title: 'Sandbox Explorer',
    kind: visualizer === 'convergence-sweep' ? 'convergence-sweep' : (visualizer === 'path-explorer' ? 'path-explorer' : (visualizer === 'monte-carlo' ? 'monte-carlo' : 'tree-reveal')),
    reveals: (visualizer !== 'convergence-sweep' && visualizer !== 'path-explorer' && visualizer !== 'monte-carlo') ? visualizer : undefined,
    direction: 'forward',
    optionType: optionType,
    showParamControls: true,
    stepTexts,
    formulas,
    codeSnippet
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-6 md:p-10 font-sans selection:bg-blue-200 transition-colors">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
           <div className="flex justify-between items-center mb-4">
             <Link href="/" className="inline-flex items-center text-blue-600 hover:underline font-semibold text-sm transition-colors">
               ← Back to Home
             </Link>
             <DarkModeToggle />
           </div>
           <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Sandbox Explorer</h1>
           <p className="text-lg text-slate-600 dark:text-slate-400">Pure exploration with no constraints. Select a visualizer and adjust parameters to see how the model behaves.</p>
        </header>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 p-6 md:p-8 backdrop-blur-xl mb-12">
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <select 
              value={visualizer}
              onChange={(e) => setVisualizer(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
            >
              <option value="stock_tree">Stock Tree</option>
              <option value="option_tree">Option Tree</option>
              <option value="delta_tree">Delta Tree</option>
              <option value="path-explorer">Path Explorer (Asian)</option>
              <option value="convergence-sweep">Convergence Sweep</option>
              <option value="monte-carlo">Monte Carlo Simulation</option>
            </select>

            {visualizer !== 'convergence-sweep' && visualizer !== 'path-explorer' && visualizer !== 'monte-carlo' && (
              <select 
                value={optionType}
                onChange={(e) => setOptionType(e.target.value as 'call' | 'put')}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
              >
                <option value="call">Call Option</option>
                <option value="put">Put Option</option>
              </select>
            )}
          </div>

          <ThreePanePlayer phase={phase} key={visualizer + optionType} />
          
          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Adjust Parameters Below</h3>
            <ParamControls maxN={visualizer === 'convergence-sweep' ? 100 : visualizer === 'path-explorer' ? 5 : 6} />
          </div>
        </div>
      </div>
    </main>
  );
}
