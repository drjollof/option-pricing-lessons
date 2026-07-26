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

interface CopulaVisualizerProps {
  currentFrame: number;
  params: {
    sigma?: number;
  };
}

// Simple approximation for Normal CDF
function normalCDF(x: number) {
  const p = 0.3275911;
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.sqrt(2);
  const tVal = 1 / (1 + p * absX);
  const erf = 1 - (((((a5 * tVal + a4) * tVal) + a3) * tVal + a2) * tVal + a1) * tVal * Math.exp(-absX * absX);
  return 0.5 * (1 + sign * erf);
}

export const CopulaVisualizer: React.FC<CopulaVisualizerProps> = ({ currentFrame, params }) => {
  const { sigma = 0.2 } = params;

  // Generate synthetic data
  const data = useMemo(() => {
    const rawPts = [];
    const n = 200;
    
    for (let i = 0; i < n; i++) {
      // Generate standard normal
      const u1 = Math.random();
      const u2 = Math.random();
      const r = Math.sqrt(-2 * Math.log(u1));
      const theta = 2 * Math.PI * u2;
      const z1 = r * Math.cos(theta);
      const z2 = r * Math.sin(theta);
      
      // Correlate them (Gaussian copula)
      const rho = 0.8; // High correlation
      const correlated_z2 = rho * z1 + Math.sqrt(1 - rho*rho) * z2;
      
      // Make marginals different:
      // Margin X: Normal(100, 15)
      // Margin Y: Lognormal (creates fat tail)
      const rawX = 100 + 15 * z1;
      const rawY = Math.exp(correlated_z2 * (sigma) + 2);
      
      // Calculate empirical CDF for Copula Space (Uniform [0,1])
      // We will sort and rank them, dividing by n
      rawPts.push({ id: i, rawX, rawY, z1, correlated_z2 });
    }
    
    const sortedX = [...rawPts].sort((a, b) => a.rawX - b.rawX);
    const sortedY = [...rawPts].sort((a, b) => a.rawY - b.rawY);
    
    const finalPts = rawPts.map(pt => {
      const uX = (sortedX.findIndex(p => p.id === pt.id) + 1) / n;
      const uY = (sortedY.findIndex(p => p.id === pt.id) + 1) / n;
      return {
        ...pt,
        uX,
        uY
      };
    });
    
    return { pts: finalPts };
  }, [sigma]);

  // Frame 0: Raw Data (Marginals have their own arbitrary scale and shape)
  // Frame 1: Transform X to Uniform CDF (Sklar's Theorem)
  // Frame 2: Transform Y to Uniform CDF -> The Copula

  const plotData = data.pts.map(pt => {
    let displayX = pt.rawX;
    let displayY = pt.rawY;
    
    if (currentFrame >= 1) displayX = pt.uX;
    if (currentFrame >= 2) displayY = pt.uY;
    
    return {
      ...pt,
      displayX,
      displayY
    };
  });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-xl p-4">
      <h3 className="text-xl font-bold text-slate-200 mb-4 tracking-wider">
        {currentFrame === 0 ? "Raw Joint Distribution" : currentFrame === 1 ? "Mapping X to Uniform CDF" : "The Copula Space (Uniform Marginals)"}
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
              domain={currentFrame >= 1 ? [0, 1] : ['auto', 'auto']}
              label={{ value: currentFrame >= 1 ? "CDF of X (Uniform 0 to 1)" : "Asset X Returns", position: "bottom", fill: "#94a3b8" }}
            />
            <YAxis 
              type="number" 
              dataKey="displayY" 
              name="Y" 
              stroke="#94a3b8" 
              domain={currentFrame >= 2 ? [0, 1] : ['auto', 'auto']}
              label={{ value: currentFrame >= 2 ? "CDF of Y (Uniform 0 to 1)" : "Asset Y Returns (Log-Normal)", angle: -90, position: "left", fill: "#94a3b8" }}
            />
            <ZAxis range={[20, 20]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            />
            <Scatter name="Data" data={plotData} isAnimationActive={true} animationDuration={1000}>
              {plotData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#8b5cf6" opacity={0.6} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center text-slate-400 text-sm max-w-md">
        {currentFrame === 0 && "These two assets are correlated, but their raw distributions are completely different (Normal vs Log-Normal)."}
        {currentFrame === 1 && "Sklar's Theorem says we can isolate the dependence by stripping away the marginal distributions. We map X to a Uniform CDF [0, 1]."}
        {currentFrame >= 2 && "We map Y to a Uniform CDF [0, 1]. The resulting square is the COPULA! It purely represents how the variables depend on each other, entirely independent of their original scales."}
      </div>
    </div>
  );
};
