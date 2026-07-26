"use client";
import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { useLessonStore } from '@/store/lessonStore';

export const RobustRegressionVisualizer: React.FC = () => {
  const { params } = useLessonStore();
  
  const data = useMemo(() => {
    const N = 20; 
    const slope = 1.0;
    const intercept = 10;
    
    let generatedData = [];
    
    for (let i = 0; i < N; i++) {
      const x = i * 5; 
      // Add one massive outlier at the end
      if (i === N - 1) {
        generatedData.push({ x: 90, y: 10, isOutlier: true }); // Outlier pulls OLS down
      } else {
        const noise = (Math.random() - 0.5) * 20;
        generatedData.push({ x, y: slope * x + intercept + noise, isOutlier: false });
      }
    }
    return generatedData;
  }, []);

  // OLS Line (affected by outlier)
  const ols = useMemo(() => {
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    data.forEach(d => {
      sumX += d.x;
      sumY += d.y;
      sumXY += d.x * d.y;
      sumX2 += d.x * d.x;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
  }, [data]);

  // Robust Line (ignoring outlier roughly)
  const robust = useMemo(() => {
    // Exclude outlier for a crude "robust" line simulation
    const cleanData = data.filter(d => !d.isOutlier);
    const n = cleanData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    cleanData.forEach(d => {
      sumX += d.x;
      sumY += d.y;
      sumXY += d.x * d.y;
      sumX2 += d.x * d.x;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
  }, [data]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">OLS vs Robust Regression</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis type="number" dataKey="x" name="X" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
          <YAxis type="number" dataKey="y" name="Y" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
          <Tooltip 
             cursor={{ strokeDasharray: '3 3' }}
             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Legend />
          
          <Scatter name="Data Points" data={data.filter(d => !d.isOutlier)} fill="#3b82f6" shape="circle" />
          <Scatter name="Outlier" data={data.filter(d => d.isOutlier)} fill="#ef4444" shape="triangle" />
          
          {/* OLS Line */}
          <ReferenceLine 
            segment={[{ x: 0, y: ols.intercept }, { x: 100, y: ols.slope * 100 + ols.intercept }]} 
            stroke="#ef4444" 
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{ position: 'insideTopLeft', value: 'OLS (Biased)', fill: '#ef4444' }}
            ifOverflow="hidden"
          />
          
          {/* Robust Line */}
          <ReferenceLine 
            segment={[{ x: 0, y: robust.intercept }, { x: 100, y: robust.slope * 100 + robust.intercept }]} 
            stroke="#10b981" 
            strokeWidth={3}
            label={{ position: 'insideBottomRight', value: 'Robust (Huber)', fill: '#10b981' }}
            ifOverflow="hidden"
          />
          
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
