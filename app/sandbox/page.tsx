"use client";
import React, { useState } from 'react';
import { ThreePanePlayer } from '@/components/ThreePanePlayer';
import { ParamControls } from '@/components/ParamControls';
import { LessonPhase } from '@/content/types';
import Link from 'next/link';
import { useLessonStore } from '@/store/lessonStore';
import { DarkModeToggle } from '@/components/DarkModeToggle';

export default function SandboxPage() {
  const [visualizer, setVisualizer] = useState<'stock_tree' | 'option_tree' | 'delta_tree' | 'convergence-sweep'>('stock_tree');
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');

  const phase: LessonPhase = {
    id: 'sandbox',
    title: 'Sandbox Explorer',
    kind: visualizer === 'convergence-sweep' ? 'convergence-sweep' : 'tree-reveal',
    reveals: visualizer !== 'convergence-sweep' ? visualizer : undefined,
    direction: 'forward',
    optionType: optionType,
    showParamControls: true,
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
              <option value="convergence-sweep">Convergence Chart</option>
            </select>

            {visualizer === 'option_tree' && (
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
            <ParamControls />
          </div>
        </div>
      </div>
    </main>
  );
}
