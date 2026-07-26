"use client";
import React, { useMemo } from 'react';
import { ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLessonStore } from '@/store/lessonStore';

export const LoessVisualizer: React.FC = () => {
  const { params } = useLessonStore();
  
  const data = useMemo(() => {
    const N = params.N > 10 ? params.N : 50; 
    
    // Simulate some non-linear data (e.g., a sine wave with noise)
    const noiseLevel = params.sigma || 0.2;
    
    let generatedData = [];
    
    for (let i = 0; i < N; i++) {
      const x = (i / N) * 100;
      // True function is a sine wave
      const trueY = Math.sin(x * Math.PI / 25) * 50 + 50;
      const noise = (Math.random() - 0.5) * noiseLevel * 200;
      
      generatedData.push({ x, y: trueY + noise, trueY });
    }
    
    // Sort by X for the line chart to render correctly
    generatedData.sort((a, b) => a.x - b.x);
    
    // Very crude simulation of LOESS smoothing for visual purposes
    // We'll just do a moving average based on a window size
    // In reality, LOESS does local weighted polynomial regression
    const windowSize = Math.max(2, Math.floor(N * 0.1)); 
    
    generatedData = generatedData.map((d, i, arr) => {
      let sumY = 0;
      let count = 0;
      for (let j = Math.max(0, i - windowSize); j <= Math.min(arr.length - 1, i + windowSize); j++) {
        sumY += arr[j].y;
        count++;
      }
      return { ...d, loessY: sumY / count };
    });
    
    return generatedData;
  }, [params.N, params.sigma]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">Non-Parametric Regression (LOESS)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis type="number" dataKey="x" name="X" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
          <YAxis type="number" dataKey="y" name="Y" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
          <Tooltip 
             cursor={{ strokeDasharray: '3 3' }}
             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Legend />
          
          <Scatter name="Data Points" dataKey="y" fill="#94a3b8" shape="circle" />
          <Line type="monotone" dataKey="trueY" name="True Function" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="loessY" name="LOESS Fit" stroke="#3b82f6" strokeWidth={4} dot={false} />
          
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
