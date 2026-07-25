import React, { useMemo, useState, useEffect } from 'react';
import { useLessonStore } from '@/store/lessonStore';
import { generateMonteCarloPaths } from '@/lib/montecarlo';

export const MonteCarloPane: React.FC = () => {
  const { params } = useLessonStore();
  const [numPaths, setNumPaths] = useState(50);
  const [steps, setSteps] = useState(100);
  
  // Re-generate paths only when params, numPaths, or steps change
  const mcResult = useMemo(() => {
    return generateMonteCarloPaths(params, numPaths, steps);
  }, [params, numPaths, steps]);

  const width = 800;
  const height = 400;
  const padding = 50;

  // Find max and min across all paths to set the scale
  let minPrice = 0;
  let maxPrice = 0;
  
  if (mcResult.paths.length > 0) {
    const allPrices = mcResult.paths.flatMap(p => p.prices);
    let minP = allPrices[0];
    let maxP = allPrices[0];
    for (let i = 1; i < allPrices.length; i++) {
      if (allPrices[i] < minP) minP = allPrices[i];
      if (allPrices[i] > maxP) maxP = allPrices[i];
    }
    minPrice = minP * 0.95;
    maxPrice = maxP * 1.05;
  } else {
    minPrice = params.S0 * 0.5;
    maxPrice = params.S0 * 1.5;
  }

  const innerHeight = height - 2 * padding;
  const innerWidth = width - 2 * padding;

  const getX = (stepIndex: number) => padding + (stepIndex / steps) * innerWidth;
  const getY = (price: number) => height - padding - ((price - minPrice) / (maxPrice - minPrice)) * innerHeight;

  // Animation effect to draw paths
  const [drawProgress, setDrawProgress] = useState(0);

  useEffect(() => {
    setDrawProgress(0);
    const duration = 1500; // ms
    const startTime = performance.now();
    
    let animationFrameId: number;
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDrawProgress(progress);
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mcResult]);

  return (
    <div className="flex flex-col gap-4 w-full h-full p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-inner">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Monte Carlo Simulation</h3>
        <div className="flex gap-4">
          <label className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
            Paths:
            <select 
              value={numPaths} 
              onChange={(e) => setNumPaths(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 outline-none"
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
          </label>
          <label className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
            Steps:
            <select 
              value={steps} 
              onChange={(e) => setSteps(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 outline-none"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={252}>252 (Daily)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex-1 w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden relative">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="2" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="2" />
          
          {/* Strike Price Line */}
          <line 
            x1={padding} 
            y1={getY(params.K)} 
            x2={width - padding} 
            y2={getY(params.K)} 
            stroke="red" 
            strokeDasharray="5,5" 
            strokeWidth="1.5" 
            opacity="0.5" 
          />
          <text x={padding + 5} y={getY(params.K) - 5} fill="red" fontSize="12" opacity="0.7">Strike (K = {params.K})</text>

          {/* Paths */}
          {mcResult.paths.map((path, idx) => {
            // Only draw up to the current progress
            const maxStepToDraw = Math.floor(drawProgress * steps);
            if (maxStepToDraw === 0) return null;
            
            const points = path.prices
              .slice(0, maxStepToDraw + 1)
              .map((price, stepIdx) => `${getX(stepIdx)},${getY(price)}`)
              .join(' ');
              
            return (
              <polyline 
                key={idx} 
                points={points} 
                fill="none" 
                stroke="currentColor" 
                className="text-blue-500 dark:text-blue-400" 
                strokeWidth={numPaths > 100 ? "0.5" : "1.5"} 
                opacity={numPaths > 100 ? 0.1 : 0.25} 
              />
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-2">
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 text-center">
          <div className="text-xs text-slate-500 uppercase font-bold mb-1">Euro Call</div>
          <div className="text-lg font-mono font-bold text-slate-800 dark:text-slate-100">${mcResult.europeanCallPrice.toFixed(2)}</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 text-center">
          <div className="text-xs text-slate-500 uppercase font-bold mb-1">Euro Put</div>
          <div className="text-lg font-mono font-bold text-slate-800 dark:text-slate-100">${mcResult.europeanPutPrice.toFixed(2)}</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 text-center">
          <div className="text-xs text-slate-500 uppercase font-bold mb-1">Asian Call</div>
          <div className="text-lg font-mono font-bold text-slate-800 dark:text-slate-100">${mcResult.asianCallPrice.toFixed(2)}</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 text-center">
          <div className="text-xs text-slate-500 uppercase font-bold mb-1">Asian Put</div>
          <div className="text-lg font-mono font-bold text-slate-800 dark:text-slate-100">${mcResult.asianPutPrice.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};
