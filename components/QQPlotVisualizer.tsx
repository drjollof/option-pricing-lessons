"use client";

import React, { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface QQPlotVisualizerProps {
  currentFrame: number;
  params: {
    sigma?: number;
    u: number; // Used for tail heaviness
  };
}

export const QQPlotVisualizer: React.FC<QQPlotVisualizerProps> = ({ currentFrame, params }) => {
  const { sigma = 0.2, u: tailHeaviness } = params;
  
  const isFatTailed = tailHeaviness > 1.5; // Threshold

  const data = useMemo(() => {
    // Generate theoretical normal quantiles
    // For simplicity, we just generate an array from -3 to 3
    const ptsNormal = [];
    const ptsFat = [];
    
    // We generate sorted random points to simulate QQ
    // This is deterministic for visualization
    for (let i = 1; i < 100; i++) {
      const q = (i - 0.5) / 100; // uniform
      
      // Inverse CDF (Probit) approximation for normal
      const p = q < 0.5 ? q : 1 - q;
      const t = Math.sqrt(-2 * Math.log(p));
      const x = t - (2.515517 + 0.802853 * t + 0.010328 * t * t) / (1 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t);
      const z = q < 0.5 ? -x : x;
      
      const theoretical = z;
      
      // Normal sample
      const sampleNormal = z * sigma;
      ptsNormal.push({ x: theoretical, y: sampleNormal });
      
      // Fat tailed sample (simulating t-distribution or just cubic mapping)
      // Cube the normal quantile to get extreme tails
      const sampleFat = z * sigma + (Math.pow(z, 3) * sigma * 0.5 * (isFatTailed ? 1 : 0));
      ptsFat.push({ x: theoretical, y: sampleFat });
    }
    
    return { ptsNormal, ptsFat };
  }, [sigma, isFatTailed]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-xl p-4">
      <h3 className="text-xl font-bold text-slate-200 mb-4 tracking-wider">
        Q-Q Plot (Quantile-Quantile)
      </h3>
      
      <div className="w-full h-64 md:h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Theoretical Quantiles" 
              stroke="#94a3b8" 
              domain={[-4, 4]} 
              label={{ value: "Theoretical Normal Quantiles", position: "bottom", fill: "#94a3b8", fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Sample Quantiles" 
              stroke="#94a3b8" 
              domain={[-10, 10]}
              label={{ value: "Sample Quantiles", angle: -90, position: "left", fill: "#94a3b8", fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            />
            
            {/* 45-degree reference line */}
            <ReferenceLine 
              segment={[{ x: -4, y: -4 * sigma }, { x: 4, y: 4 * sigma }]} 
              stroke="#ef4444" 
              strokeWidth={2}
              strokeDasharray="4 4"
            />
            
            {/* Normal points */}
            {currentFrame >= 1 && (
              <Scatter 
                name="Normal Distribution" 
                data={data.ptsNormal} 
                fill="#3b82f6" 
                opacity={currentFrame === 1 || !isFatTailed ? 0.8 : 0.2}
              />
            )}
            
            {/* Fat tailed points */}
            {currentFrame >= 2 && isFatTailed && (
              <Scatter 
                name="Fat-Tailed Distribution" 
                data={data.ptsFat} 
                fill="#eab308" 
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center text-slate-400 text-sm max-w-md">
        {currentFrame === 0 && "The red line represents a perfectly normal distribution."}
        {currentFrame === 1 && "Points hugging the line indicate the sample data is normally distributed."}
        {currentFrame >= 2 && isFatTailed && "Points deviating sharply at the tails indicate fat tails (e.g. Student's t-distribution)."}
      </div>
    </div>
  );
};
