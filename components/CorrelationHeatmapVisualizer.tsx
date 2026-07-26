"use client";
import React, { useMemo } from 'react';
import { useLessonStore } from '@/store/lessonStore';

export const CorrelationHeatmapVisualizer: React.FC = () => {
  const { params } = useLessonStore();
  
  // Create a synthetic correlation matrix based on params.
  // We'll have 4 variables: Y, X1, X2, X3
  const variables = ['Y', 'X1', 'X2', 'X3'];
  
  const matrix = useMemo(() => {
    // If noise (sigma) is high, correlation drops.
    // If N is high, maybe the correlation is stable.
    const baseCorr = Math.max(0.1, 1 - (params.sigma || 0.2));
    
    // Simulate multicollinearity between X1 and X2
    const x1x2Corr = Math.min(0.95, baseCorr + 0.3);

    return [
      [1.00, baseCorr, baseCorr * 0.8, -0.4],
      [baseCorr, 1.00, x1x2Corr, -0.2],
      [baseCorr * 0.8, x1x2Corr, 1.00, -0.1],
      [-0.4, -0.2, -0.1, 1.00]
    ];
  }, [params.sigma]);

  const getColor = (value: number) => {
    // value ranges from -1 to 1
    // Color scale: Red (-1) to White (0) to Blue (1)
    if (value > 0) {
      const intensity = Math.round(value * 255);
      return `rgb(${255 - intensity}, ${255 - (intensity/2)}, 255)`;
    } else {
      const intensity = Math.round(Math.abs(value) * 255);
      return `rgb(255, ${255 - intensity}, ${255 - intensity})`;
    }
  };

  const getDarkColor = (value: number) => {
    if (value > 0) {
      const intensity = Math.max(20, Math.round(value * 150));
      return `rgb(10, 30, ${intensity + 50})`;
    } else {
      const intensity = Math.max(20, Math.round(Math.abs(value) * 150));
      return `rgb(${intensity + 50}, 20, 20)`;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">Correlation Matrix Heatmap</h3>
      <div className="grid grid-cols-5 gap-2 w-full max-w-md">
        <div className="col-span-1"></div>
        {variables.map(v => (
          <div key={v} className="col-span-1 text-center font-semibold text-slate-600 dark:text-slate-400">
            {v}
          </div>
        ))}

        {variables.map((rowVar, i) => (
          <React.Fragment key={rowVar}>
            <div className="col-span-1 flex items-center justify-end pr-4 font-semibold text-slate-600 dark:text-slate-400">
              {rowVar}
            </div>
            {variables.map((colVar, j) => {
              const val = matrix[i][j];
              const isHighCorr = Math.abs(val) > 0.8 && i !== j;
              return (
                <div 
                  key={`${rowVar}-${colVar}`} 
                  className={`col-span-1 aspect-square rounded-xl flex items-center justify-center font-mono text-sm font-medium transition-all ${isHighCorr ? 'ring-2 ring-red-500 scale-105 shadow-md z-10' : ''}`}
                  style={{
                    backgroundColor: getColor(val),
                  }}
                >
                  <span className={`drop-shadow-sm ${Math.abs(val) > 0.6 ? 'text-white' : 'text-slate-900'}`}>
                    {val.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-8 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-4">
        <span>Legend:</span>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-200 rounded"></div> Negative</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white border border-slate-200 rounded"></div> Zero</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-200 rounded"></div> Positive</div>
      </div>
    </div>
  );
};
