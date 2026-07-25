import React, { useMemo } from 'react';
import { useLessonStore } from '@/store/lessonStore';
import { generatePaths } from '@/lib/binomial';
import { motion } from 'framer-motion';

export const PathExplorerPane: React.FC = () => {
  const { params } = useLessonStore();
  
  const paths = useMemo(() => generatePaths(params), [params]);
  
  if (params.N > 5) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full border border-yellow-200 dark:border-yellow-900 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 p-6 text-center">
        <svg className="w-12 h-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="font-semibold text-lg mb-2">N is too large for explicit paths</p>
        <p className="text-sm opacity-80 max-w-sm">For N &gt; 5, the number of paths ({Math.pow(2, params.N).toLocaleString()}) makes explicit enumeration inefficient. Please reduce N to 5 or less.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-inner p-4 custom-scrollbar">
      <div className="grid grid-cols-[100px_1fr_100px_100px_100px] gap-4 mb-4 px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-10">
        <div>Sequence</div>
        <div>Price Path</div>
        <div className="text-right">Average (A)</div>
        <div className="text-right">Call Payoff</div>
        <div className="text-right">Probability</div>
      </div>
      
      <div className="flex flex-col gap-2">
        {paths.map((path, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="grid grid-cols-[100px_1fr_100px_100px_100px] gap-4 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl items-center text-sm font-mono border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex gap-1">
              {path.sequence.split('-').map((move, i) => (
                <span key={i} className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  move === 'U' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                }`}>
                  {move}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 overflow-x-auto custom-scrollbar pb-1">
              {path.prices.map((p, i) => (
                <React.Fragment key={i}>
                  <span>{p.toFixed(1)}</span>
                  {i < path.prices.length - 1 && <span className="opacity-30">→</span>}
                </React.Fragment>
              ))}
            </div>
            
            <div className="text-right font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
              {path.average.toFixed(2)}
            </div>
            
            <div className={`text-right font-semibold ${path.asianCallPayoff > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
              {path.asianCallPayoff.toFixed(2)}
            </div>
            
            <div className="text-right text-slate-500 dark:text-slate-400">
              {(path.prob * 100).toFixed(1)}%
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
