"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useLessonStore } from '@/store/lessonStore';

interface LatticePaneProps {
  tree: number[][];
  direction?: 'forward' | 'backward';
  highlightTree?: boolean[][];
}

export const LatticePane: React.FC<LatticePaneProps> = ({ tree, direction = 'forward', highlightTree }) => {
  const { currentFrame } = useLessonStore();
  const N = tree.length - 1;
  
  if (N > 6) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm w-full h-full text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mb-4"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">N is too large for tree visualization</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">Rendering a lattice with N={N} causes nodes to overlap and obscures the connecting lines! Please reduce N to 6 or less, or use the Convergence Chart.</p>
      </div>
    );
  }

  const isTrinomial = tree.length > 1 && tree[1].length === 3;
  const width = 400;
  const height = 400;
  const padding = 40;
  
  const getX = (i: number) => N === 0 ? width / 2 : padding + (i / N) * (width - 2 * padding);
  const getY = (i: number, j: number) => {
    if (i === 0) return height / 2;
    const spread = (width - 2 * padding) * (i / N);
    const topY = height / 2 - spread / 2;
    const maxGaps = isTrinomial ? 2 * i : i;
    const step = maxGaps === 0 ? 0 : spread / maxGaps;
    return topY + (maxGaps - j) * step;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm w-full h-full relative overflow-hidden">
      <div className="absolute top-4 left-4 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
        LATTICE VIEW
      </div>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible mt-6">
        {/* Draw edges */}
        {tree.map((layer, i) => {
          if (i === N) return null;
          const isVisible = direction === 'backward' 
            ? (i >= N - currentFrame)
            : (currentFrame > i);

          return layer.map((_, j) => {
            const x1 = getX(i);
            const y1 = getY(i, j);

            if (isTrinomial) {
              const upX = getX(i + 1);
              const upY = getY(i + 1, j + 2);
              const midX = getX(i + 1);
              const midY = getY(i + 1, j + 1);
              const downX = getX(i + 1);
              const downY = getY(i + 1, j);
              
              return (
                <motion.g 
                  key={`edge-${i}-${j}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isVisible ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <line x1={x1} y1={y1} x2={upX} y2={upY} stroke="#cbd5e1" strokeWidth={2} className="dark:stroke-slate-700" />
                  <line x1={x1} y1={y1} x2={midX} y2={midY} stroke="#cbd5e1" strokeWidth={2} className="dark:stroke-slate-700" />
                  <line x1={x1} y1={y1} x2={downX} y2={downY} stroke="#cbd5e1" strokeWidth={2} className="dark:stroke-slate-700" />
                </motion.g>
              );
            } else {
              const upX = getX(i + 1);
              const upY = getY(i + 1, j + 1);
              const downX = getX(i + 1);
              const downY = getY(i + 1, j);

              return (
                <motion.g 
                  key={`edge-${i}-${j}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isVisible ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <line x1={x1} y1={y1} x2={upX} y2={upY} stroke="#cbd5e1" strokeWidth={2} className="dark:stroke-slate-700" />
                  <line x1={x1} y1={y1} x2={downX} y2={downY} stroke="#cbd5e1" strokeWidth={2} className="dark:stroke-slate-700" />
                </motion.g>
              );
            }
          });
        })}

        {/* Draw nodes */}
        {tree.map((layer, i) => {
          const isVisible = direction === 'backward' 
            ? (i >= N - currentFrame) 
            : (currentFrame >= i);

          return layer.map((val, j) => {
            const isHighlighted = highlightTree?.[i]?.[j] ?? false;
            
            return (
              <motion.g 
                key={`node-${i}-${j}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.5 }}
                transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
              >
                <circle 
                  cx={getX(i)} 
                  cy={getY(i, j)} 
                  r={22} 
                  className={`shadow-sm transition-transform hover:scale-110 cursor-pointer ${
                    isHighlighted 
                      ? 'fill-red-50 dark:fill-red-950/30 stroke-red-500 dark:stroke-red-400' 
                      : 'fill-blue-50 dark:fill-slate-800 stroke-blue-500 dark:stroke-blue-400'
                  }`}
                  strokeWidth={isHighlighted ? 3.5 : 2.5} 
                />
                <text 
                  x={getX(i)} 
                  y={getY(i, j)} 
                  textAnchor="middle" 
                  dy=".3em" 
                  fontSize="13" 
                  fontWeight="600" 
                  className={`font-mono pointer-events-none ${
                    isHighlighted ? 'fill-red-700 dark:fill-red-300' : 'fill-slate-700 dark:fill-slate-200'
                  }`}
                >
                  {val.toFixed(1)}
                </text>
              </motion.g>
            );
          });
        })}
      </svg>
    </div>
  );
};
