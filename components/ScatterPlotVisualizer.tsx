"use client";
import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useLessonStore } from '@/store/lessonStore';

interface ScatterPlotVisualizerProps {
  showRegressionLine?: boolean;
  highlightOutliers?: boolean;
}

export const ScatterPlotVisualizer: React.FC<ScatterPlotVisualizerProps> = ({ showRegressionLine = false, highlightOutliers = false }) => {
  const { params } = useLessonStore();

  // Generate synthetic data based on params for the lesson
  // Y = beta * X + alpha + noise
  const data = useMemo(() => {
    const N = params.N > 10 ? params.N : 50; // default to 50 for good scatter
    const noiseLevel = params.sigma || 0.2;
    const slope = 1.5;
    const intercept = 10;
    
    let generatedData = [];
    for (let i = 0; i < N; i++) {
      // Random X between 0 and 100
      const x = (Math.sin(i * 123.456) + 1) * 50; 
      // Pseudo-random normal noise
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      
      const noise = z0 * noiseLevel * 50;
      let y = slope * x + intercept + noise;
      
      let isOutlier = false;
      // Introduce an outlier if highlightOutliers is true and we're at a specific index
      if (highlightOutliers && i === Math.floor(N / 2)) {
        y += 300; // Massive outlier
        isOutlier = true;
      }
      
      generatedData.push({ x, y, isOutlier });
    }
    return generatedData;
  }, [params.N, params.sigma, highlightOutliers]);

  // Calculate regression line OLS
  const { slope, intercept } = useMemo(() => {
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

  const lineData = [
    { x: 0, y: intercept },
    { x: 100, y: slope * 100 + intercept }
  ];

  return (
    <div className="w-full h-full flex items-center justify-center bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis type="number" dataKey="x" name="Independent (X)" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={{ stroke: '#cbd5e1' }} />
          <YAxis type="number" dataKey="y" name="Dependent (Y)" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={{ stroke: '#cbd5e1' }} />
          <Tooltip 
             cursor={{ strokeDasharray: '3 3' }}
             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          
          {/* Main Data points */}
          <Scatter name="Data" data={data.filter(d => !d.isOutlier)} fill="#3b82f6" />
          
          {/* Outliers */}
          {highlightOutliers && (
            <Scatter name="Outliers" data={data.filter(d => d.isOutlier)} fill="#ef4444" />
          )}

          {/* Regression Line */}
          {showRegressionLine && (
            <ReferenceLine 
              segment={[{ x: 0, y: intercept }, { x: 100, y: slope * 100 + intercept }]} 
              stroke="#10b981" 
              strokeWidth={3} 
              ifOverflow="hidden"
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
