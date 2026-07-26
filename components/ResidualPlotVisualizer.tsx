"use client";
import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useLessonStore } from '@/store/lessonStore';

export const ResidualPlotVisualizer: React.FC = () => {
  const { params } = useLessonStore();
  
  const data = useMemo(() => {
    const N = params.N > 10 ? params.N : 100; 
    
    // Heteroskedasticity controlled by sigma. 
    // Higher sigma = wider spread at higher X values
    const heteroskedasticityFactor = params.sigma || 0.2; 
    
    let generatedData = [];
    
    for (let i = 0; i < N; i++) {
      // Random X between 0 and 100
      const x = (Math.sin(i * 123.456) + 1) * 50; 
      
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      
      // The variance of the noise increases as X increases (Heteroskedasticity)
      // At x=0, noise is small. At x=100, noise is large
      const varianceFactor = 1 + (x * heteroskedasticityFactor);
      
      const residual = z0 * varianceFactor;
      
      generatedData.push({ x, residual });
    }
    return generatedData;
  }, [params.N, params.sigma]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">Residual Plot (Heteroskedasticity)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis type="number" dataKey="x" name="Fitted Values / X" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
          <YAxis type="number" dataKey="residual" name="Residuals (e)" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
          <Tooltip 
             cursor={{ strokeDasharray: '3 3' }}
             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          
          <ReferenceLine y={0} stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" />
          
          <Scatter name="Residuals" data={data} fill="#3b82f6" shape="circle" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
