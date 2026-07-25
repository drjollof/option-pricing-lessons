"use client";
import React, { useMemo } from 'react';
import { useLessonStore } from '@/store/lessonStore';
import { convergenceSeries } from '@/lib/binomial';

export const ConvergenceChartPane: React.FC<{ maxN?: number }> = ({ maxN = 100 }) => {
  const { params } = useLessonStore();
  
  const series = useMemo(() => {
    return convergenceSeries(params, maxN, true, params.sigma || 0.2);
  }, [params, maxN]);

  const width = 800;
  const height = 400;
  const padding = 50;
  
  const minPrice = Math.min(...series.map(s => s.price)) * 0.98;
  const maxPrice = Math.max(...series.map(s => s.price)) * 1.02;
  const innerHeight = height - 2 * padding;
  const innerWidth = width - 2 * padding;

  const points = series.map((s) => {
    const x = padding + (s.N / maxN) * innerWidth;
    const y = height - padding - ((s.price - minPrice) / (maxPrice - minPrice)) * innerHeight;
    return `${x},${y}`;
  }).join(' ');

  const finalPrice = series[series.length - 1].price;
  const finalY = height - padding - ((finalPrice - minPrice) / (maxPrice - minPrice)) * innerHeight;

  // Highlight current N parameter
  const currentN = params.N;
  const currentPoint = series.find(s => s.N === currentN);
  const currentX = currentPoint ? padding + (currentPoint.N / maxN) * innerWidth : padding;
  const currentY = currentPoint ? height - padding - ((currentPoint.price - minPrice) / (maxPrice - minPrice)) * innerHeight : height - padding;

  return (
    <div className="flex flex-col items-center justify-center p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm w-full h-full relative overflow-hidden">
      <div className="absolute top-4 left-4 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 z-10">
        CONVERGENCE CHART (Price vs N)
      </div>
      
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full mt-6">
        {/* Grid lines */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="2" className="dark:stroke-slate-800" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="2" className="dark:stroke-slate-800" />
        
        {/* Asymptote (BS approximation) */}
        <line x1={padding} y1={finalY} x2={width - padding} y2={finalY} stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" className="opacity-60" />
        <text x={width - padding + 5} y={finalY} textAnchor="start" alignmentBaseline="middle" fill="#ef4444" fontSize="13" fontWeight="bold">
          ~${finalPrice.toFixed(2)}
        </text>

        {/* Path */}
        <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
        
        {/* Highlight final point */}
        <circle cx={padding + innerWidth} cy={finalY} r="5" fill="#3b82f6" />

        {/* Current N Highlight */}
        {currentPoint && (
          <>
            <line x1={currentX} y1={padding} x2={currentX} y2={height - padding} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" className="opacity-80" />
            <circle cx={currentX} cy={currentY} r="6" fill="#f59e0b" className="animate-pulse" />
            <text x={currentX + 10} y={currentY - 10} fill="#f59e0b" fontSize="13" fontWeight="bold">N={currentN}</text>
          </>
        )}
        
        {/* Axes Labels */}
        <text x={width/2} y={height - 10} textAnchor="middle" fontSize="13" fontWeight="600" className="fill-slate-500 dark:fill-slate-400">Number of Steps (N)</text>
        <text x={padding - 35} y={height/2} transform={`rotate(-90 ${padding - 35} ${height/2})`} textAnchor="middle" fontSize="13" fontWeight="600" className="fill-slate-500 dark:fill-slate-400">Option Price ($)</text>
        
        {/* Min/Max Y Labels */}
        <text x={padding - 10} y={height - padding} textAnchor="end" alignmentBaseline="middle" fontSize="11" className="fill-slate-400">${minPrice.toFixed(2)}</text>
        <text x={padding - 10} y={padding} textAnchor="end" alignmentBaseline="middle" fontSize="11" className="fill-slate-400">${maxPrice.toFixed(2)}</text>
      </svg>
    </div>
  );
};
