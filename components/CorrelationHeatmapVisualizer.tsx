"use client";
import React, { useMemo } from 'react';
import { useLessonStore } from '@/store/lessonStore';
import { TreeParams } from '@/lib/binomial';

interface CorrelationHeatmapVisualizerProps {
  staticParams?: Partial<TreeParams>;
}

export const CorrelationHeatmapVisualizer: React.FC<CorrelationHeatmapVisualizerProps> = ({ staticParams }) => {
  const storeParams = useLessonStore(state => state.params);
  const params = staticParams || storeParams;
  
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
    // Red-Blue diverging scale. Red = -1, White = 0, Blue = 1
    // More vibrant colors!
    if (value === 1) return `rgb(37, 99, 235)`; // Tailwind blue-600 for max correlation
    if (value === -1) return `rgb(220, 38, 38)`; // Tailwind red-600 for min correlation
    
    if (value > 0) {
      // White to Blue
      const intensity = Math.round(value * 255);
      return `rgb(${255 - intensity}, ${255 - Math.round(intensity * 0.6)}, 255)`;
    } else {
      // White to Red
      const intensity = Math.round(Math.abs(value) * 255);
      return `rgb(255, ${255 - intensity}, ${255 - intensity})`;
    }
  };

  const getDarkColor = (value: number) => {
    // Dark mode diverging scale
    if (value === 1) return `rgb(59, 130, 246)`; // Tailwind blue-500
    if (value === -1) return `rgb(239, 68, 68)`; // Tailwind red-500

    if (value > 0) {
      const intensity = Math.max(30, Math.round(value * 200));
      return `rgb(15, 23, ${intensity + 55})`;
    } else {
      const intensity = Math.max(30, Math.round(Math.abs(value) * 200));
      return `rgb(${intensity + 55}, 15, 23)`;
    }
  };

  const getTextColor = (value: number) => {
    // Return white text for extreme values to ensure readability, dark text for values near 0
    return Math.abs(value) > 0.6 ? 'text-white' : 'text-slate-800 dark:text-slate-200';
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden relative">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">Correlation Matrix Heatmap</h3>
      <div className="grid grid-cols-5 gap-3 w-full max-w-md">
        <div className="col-span-1"></div>
        {variables.map(v => (
          <div key={v} className="col-span-1 text-center font-bold text-slate-700 dark:text-slate-300">
            {v}
          </div>
        ))}

        {variables.map((rowVar, i) => (
          <React.Fragment key={`row-${rowVar}`}>
            <div className="col-span-1 flex items-center justify-end pr-4 font-bold text-slate-700 dark:text-slate-300">
              {rowVar}
            </div>
            {variables.map((colVar, j) => {
              const val = matrix[i][j];
              return (
                <div 
                  key={`${rowVar}-${colVar}`} 
                  className="col-span-1 aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:z-10 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                  style={{
                    backgroundColor: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches 
                      ? getDarkColor(val) 
                      : getColor(val)
                  }}
                >
                  <span className={`text-sm md:text-base font-extrabold ${getTextColor(val)}`}>
                    {val.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
