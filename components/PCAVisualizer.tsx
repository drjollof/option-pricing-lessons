"use client";
import React, { useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLessonStore } from '@/store/lessonStore';

export const PCAVisualizer: React.FC = () => {
  const { params } = useLessonStore();
  
  // Synthetic PCA data
  const data = useMemo(() => {
    const componentsCount = Math.min(20, Math.max(2, params.N || 10));
    
    // the steeper the decay, the better PCA works (controlled by u in our lesson)
    const decay = params.u !== undefined ? params.u : 0.2; 
    
    let currentCumulative = 0;
    const generatedData = [];
    
    let remainingVariance = 100;
    
    for (let i = 1; i <= componentsCount; i++) {
      // Simulate eigenvalue proportion
      let explained = remainingVariance * (0.5 + (0.5 - decay)); 
      if (i === componentsCount) explained = remainingVariance; // remaining
      
      currentCumulative += explained;
      remainingVariance -= explained;
      
      generatedData.push({
        name: `PC${i}`,
        explainedVariance: parseFloat(explained.toFixed(2)),
        cumulativeVariance: parseFloat(currentCumulative.toFixed(2)),
      });
    }
    
    return generatedData;
  }, [params.N, params.u]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">PCA Scree Plot</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} unit="%" />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} unit="%" domain={[0, 100]} />
          
          <defs>
            <linearGradient id="colorVariance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorCum" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
              <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
            </linearGradient>
          </defs>
          <Tooltip 
             cursor={{ fill: 'rgba(0,0,0,0.05)' }}
             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          <Bar yAxisId="left" dataKey="explainedVariance" name="Explained Variance" fill="url(#colorVariance)" radius={[6, 6, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="cumulativeVariance" name="Cumulative Variance" stroke="url(#colorCum)" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 7, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
