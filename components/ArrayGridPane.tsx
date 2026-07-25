"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useLessonStore } from '@/store/lessonStore';

interface ArrayGridPaneProps {
  tree: number[][];
  direction?: 'forward' | 'backward';
}

export const ArrayGridPane: React.FC<ArrayGridPaneProps> = ({ tree, direction = 'forward' }) => {
  const { currentFrame } = useLessonStore();
  const N = tree.length - 1;
  
  if (N > 6) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm w-full h-full text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mb-4"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">N is too large for grid visualization</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">Rendering a {N}x{N} grid becomes unreadable! Please reduce N to 6 or less, or use the Convergence Chart to visualize large step counts.</p>
      </div>
    );
  }

  const maxVal = Math.max(...tree.flat());
  const minVal = Math.min(...tree.flat());

  const getBackgroundColor = (val: number) => {
    if (val === 0) return 'transparent';
    const intensity = (val - minVal) / (maxVal - minVal + 1e-6);
    const lightness = 96 - intensity * 40;
    return `hsl(217, 91%, ${lightness}%)`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm w-full h-full relative overflow-hidden">
      <div className="absolute top-4 left-4 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
        ARRAY VIEW
      </div>
      <div className="w-full flex-1 flex items-center justify-center mt-6">
        <div 
          className="grid gap-1.5 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 shadow-inner"
          style={{ gridTemplateColumns: `repeat(${N + 1}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: N + 1 }).map((_, r) => {
            const j = N - r; // top row is highest j
            return (
              <React.Fragment key={`row-${j}`}>
                {Array.from({ length: N + 1 }).map((_, i) => {
                  const cellVal = i >= j ? tree[i][j] : null;
                  const isVisible = direction === 'backward' 
                    ? (i >= N - currentFrame) 
                    : (currentFrame >= i);

                  return (
                    <motion.div 
                      key={`cell-${i}-${j}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: cellVal !== null && isVisible ? 1 : 0, 
                        scale: cellVal !== null && isVisible ? 1 : 0.8 
                      }}
                      transition={{ duration: 0.4 }}
                      className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg text-xs sm:text-sm font-mono font-semibold transition-all hover:scale-105 cursor-pointer shadow-sm"
                      style={{ 
                        backgroundColor: cellVal !== null ? getBackgroundColor(cellVal) : 'transparent',
                        color: cellVal !== null ? '#1e293b' : 'transparent',
                        border: cellVal !== null ? '1px solid rgba(148, 163, 184, 0.4)' : 'none',
                        boxShadow: cellVal !== null ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                      }}
                    >
                      {cellVal !== null ? cellVal.toFixed(1) : ''}
                    </motion.div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
