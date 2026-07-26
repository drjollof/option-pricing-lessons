"use client";
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLessonStore } from '@/store/lessonStore';

export const PenaltyPathVisualizer: React.FC = () => {
  const { params } = useLessonStore();
  
  // Synthetic data for Penalty paths (e.g. Ridge or Lasso)
  // X-axis is Lambda (penalty strength). Y-axis is Coefficient Value.
  const data = useMemo(() => {
    // Sigma will control if it acts like Lasso (fast to zero) or Ridge (slow to zero)
    // We'll simulate 3 coefficients
    const isLasso = (params.sigma || 0.2) > 0.2; // arbitrary toggle just for visual simulation
    
    let generatedData = [];
    
    for (let lambda = 0; lambda <= 100; lambda += 5) {
      let beta1 = 5;
      let beta2 = -3;
      let beta3 = 1;
      
      if (isLasso) {
        // Lasso (L1) pulls exactly to zero
        beta1 = Math.max(0, 5 - lambda * 0.1);
        beta2 = Math.min(0, -3 + lambda * 0.08);
        beta3 = Math.max(0, 1 - lambda * 0.05);
      } else {
        // Ridge (L2) decays asymptotically
        beta1 = 5 / (1 + lambda * 0.05);
        beta2 = -3 / (1 + lambda * 0.05);
        beta3 = 1 / (1 + lambda * 0.05);
      }
      
      generatedData.push({
        lambda,
        beta1: parseFloat(beta1.toFixed(2)),
        beta2: parseFloat(beta2.toFixed(2)),
        beta3: parseFloat(beta3.toFixed(2))
      });
    }
    
    return generatedData;
  }, [params.sigma]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">Coefficient Shrinkage Path</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="lambda" name="Penalty (Lambda)" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
          <YAxis tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
          <Tooltip 
             cursor={{ fill: 'rgba(0,0,0,0.05)' }}
             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Legend />
          
          <Line type="monotone" dataKey="beta1" name="Beta 1" stroke="#3b82f6" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="beta2" name="Beta 2" stroke="#ef4444" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="beta3" name="Beta 3" stroke="#10b981" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
