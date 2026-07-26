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
  ZAxis,
  Cell
} from 'recharts';

interface RankCorrelationVisualizerProps {
  currentFrame: number;
  params: {
    sigma?: number;
  };
}

export const RankCorrelationVisualizer: React.FC<RankCorrelationVisualizerProps> = ({ currentFrame, params }) => {
  const { sigma = 0.2 } = params;

  // Generate synthetic data
  const data = useMemo(() => {
    const rawPts = [];
    const n = 15;
    
    // Generate an exponential relationship to show difference between Pearson and Spearman
    for (let i = 0; i < n; i++) {
      const x = i;
      // Exponential + noise
      const noise = (Math.random() - 0.5) * sigma * 20;
      const y = Math.pow(1.3, x) + noise;
      rawPts.push({ id: i, x, y });
    }
    
    // Sort and calculate ranks
    const sortedX = [...rawPts].sort((a, b) => a.x - b.x);
    const sortedY = [...rawPts].sort((a, b) => a.y - b.y);
    
    const rankPts = rawPts.map(pt => {
      const rankX = sortedX.findIndex(p => p.id === pt.id) + 1;
      const rankY = sortedY.findIndex(p => p.id === pt.id) + 1;
      return {
        id: pt.id,
        rawX: pt.x,
        rawY: pt.y,
        rankX: rankX,
        rankY: rankY
      };
    });
    
    return { rawPts: rankPts };
  }, [sigma]);

  // Frame 0: Raw Data (Exponential curve) - Pearson sees non-linear
  // Frame 1: Transform X to Rank X
  // Frame 2: Transform Y to Rank Y - Spearman sees perfect linear relationship!

  const plotData = data.rawPts.map(pt => {
    let displayX = pt.rawX;
    let displayY = pt.rawY;
    
    if (currentFrame >= 1) displayX = pt.rankX;
    if (currentFrame >= 2) displayY = pt.rankY;
    
    return {
      ...pt,
      displayX,
      displayY
    };
  });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-xl p-4">
      <h3 className="text-xl font-bold text-slate-200 mb-4 tracking-wider">
        {currentFrame === 0 ? "Raw Data (Non-Linear)" : "Rank-Transformed Data (Linear)"}
      </h3>
      
      <div className="w-full h-64 md:h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              type="number" 
              dataKey="displayX" 
              name="X" 
              stroke="#94a3b8" 
              label={{ value: currentFrame >= 1 ? "Rank(X)" : "X (Raw)", position: "bottom", fill: "#94a3b8" }}
            />
            <YAxis 
              type="number" 
              dataKey="displayY" 
              name="Y" 
              stroke="#94a3b8" 
              label={{ value: currentFrame >= 2 ? "Rank(Y)" : "Y (Raw)", angle: -90, position: "left", fill: "#94a3b8" }}
            />
            <ZAxis range={[60, 60]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            />
            <Scatter name="Data" data={plotData} isAnimationActive={true} animationDuration={800}>
              {plotData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#10b981" />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center text-slate-400 text-sm max-w-md">
        {currentFrame === 0 && "Pearson correlation struggles here because the relationship is exponential, not linear."}
        {currentFrame === 1 && "By sorting X values into Ranks (1st, 2nd, 3rd...), we remove the magnitude of the gaps."}
        {currentFrame >= 2 && "By sorting Y into Ranks, the exponential curve becomes a perfect straight line! This is Spearman's Rank Correlation."}
      </div>
    </div>
  );
};
