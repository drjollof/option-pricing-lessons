"use client";
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLessonStore } from '@/store/lessonStore';

export const MonteCarloHistogramVisualizer: React.FC = () => {
  const { params } = useLessonStore();
  
  // Synthetic data for Central Limit Theorem / Monte Carlo
  // We simulate tossing a coin or dice, or standard normal distribution
  const data = useMemo(() => {
    // Number of trials (N)
    const trials = (params.N > 10 ? params.N : 50) * 100;
    const bins = 20;
    
    // Create bins from -3 to 3 (standard normal)
    const histogram = new Array(bins).fill(0);
    const minVal = -3;
    const maxVal = 3;
    const binSize = (maxVal - minVal) / bins;
    
    for (let i = 0; i < trials; i++) {
      // Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      
      // Add some variance based on sigma
      const value = z0 * (params.sigma || 0.2) * 5; 
      
      // Determine bin
      const binIndex = Math.floor((value - minVal) / binSize);
      if (binIndex >= 0 && binIndex < bins) {
        histogram[binIndex]++;
      }
    }
    
    return histogram.map((count, i) => ({
      name: (minVal + i * binSize).toFixed(1),
      count,
    }));
  }, [params.N, params.sigma]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">Monte Carlo Distribution (CLT)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
          <YAxis tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
          <Tooltip 
             cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
