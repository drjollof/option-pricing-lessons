"use client";

import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

import { useLessonStore } from '@/store/lessonStore';

interface DistributionVisualizerProps {
  currentFrame: number;
  params?: {
    sigma?: number;
    u?: number;
    d?: number;
    T?: number;
  };
}

export const DistributionVisualizer: React.FC<DistributionVisualizerProps> = ({ currentFrame, params }) => {
  const storeParams = useLessonStore(state => state.params);
  
  const sigma = params?.sigma ?? storeParams.sigma ?? 0.2;
  const skew = params?.u ?? storeParams.u ?? 0;
  const kurtosis = params?.d ?? storeParams.d ?? 0;
  const T = params?.T ?? storeParams.T ?? 1;
  // sigma*sqrt(T) is the BSM standard deviation of log-returns — T widens the curve
  const effectiveSigma = sigma * Math.sqrt(T);

  // Unnormalized Probability Density Function for Skew-Generalized-Normal
  const skewGenNormalPDF = (x: number, mean: number, std: number, sk: number, kurt: number) => {
    const t = (x - mean) / std;
    
    // Map kurtosis (-5 to +5) to p (3 to 1) for Generalized Normal
    const p_power = Math.max(0.5, 2 - (kurt / 5));
    const phi = Math.exp(-0.5 * Math.pow(Math.abs(t), p_power));
    
    // Normal CDF approximation for skew
    const approxCDF = (z: number) => {
      const p_const = 0.3275911;
      const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
      const sign = z < 0 ? -1 : 1;
      const absZ = Math.abs(z) / Math.sqrt(2);
      const tVal = 1 / (1 + p_const * absZ);
      const erf = 1 - (((((a5 * tVal + a4) * tVal) + a3) * tVal + a2) * tVal + a1) * tVal * Math.exp(-absZ * absZ);
      return 0.5 * (1 + sign * erf);
    };
    
    const Phi = approxCDF(sk * t);
    return phi * Phi;
  };

  const data = useMemo(() => {
    let rawPts = [];
    let integral = 0;
    
    for (let i = -100; i <= 100; i++) {
      const x = i / 20;
      const pdf = skewGenNormalPDF(x, 0, effectiveSigma, skew, kurtosis);
      rawPts.push({ x, pdf });
      integral += pdf * (1/20);
    }
    
    const pts = [];
    let maxPdf = 0;
    let modeX = 0;
    let sumVal = 0;
    let sumPdf = 0;
    
    for (let i = 0; i < rawPts.length; i++) {
      const x = rawPts[i].x;
      // Normalize
      const pdf = rawPts[i].pdf / integral;
      
      if (pdf > maxPdf) {
        maxPdf = pdf;
        modeX = x;
      }
      
      sumVal += x * pdf;
      sumPdf += pdf;
      
      pts.push({ x, pdf });
    }
    
    const meanX = sumVal / sumPdf;
    
    // CDF to find median
    let cumulative = 0;
    let medianX = 0;
    for (const pt of pts) {
      cumulative += pt.pdf / sumPdf;
      if (cumulative >= 0.5 && medianX === 0) {
        medianX = pt.x;
      }
    }

    return { pts, meanX, medianX, modeX };
  }, [effectiveSigma, skew, kurtosis]);

  // Animation based on currentFrame
  // Frame 0: Just curve
  // Frame 1: Add Mode
  // Frame 2: Add Median
  // Frame 3: Add Mean

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-xl p-4">
      <h3 className="text-xl font-bold text-slate-200 mb-4 tracking-wider">
        {skew === 0 ? 'Normal Distribution' : 'Skewed Distribution'}
      </h3>
      <p className="text-xs text-slate-400 mb-2">σ={sigma.toFixed(2)} · T={T.toFixed(2)}yr · σ√T={effectiveSigma.toFixed(3)}</p>
      
      <div className="w-full h-64 md:h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.pts} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPdf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="x" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              labelFormatter={(val) => `X: ${Number(val).toFixed(2)}`}
            />
            <Area 
              type="monotone" 
              dataKey="pdf" 
              stroke="#60a5fa" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPdf)" 
              isAnimationActive={true}
            />
            
            {currentFrame >= 1 && skew !== 0 && (
              <ReferenceLine x={data.modeX} stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" label={{ position: 'top', value: 'Mode', fill: '#ef4444', fontSize: 12 }} />
            )}
            {currentFrame >= 2 && skew !== 0 && (
              <ReferenceLine x={data.medianX} stroke="#eab308" strokeWidth={2} strokeDasharray="4 4" label={{ position: 'insideTopLeft', value: 'Median', fill: '#eab308', fontSize: 12 }} />
            )}
            {currentFrame >= 3 && skew !== 0 && (
              <ReferenceLine x={data.meanX} stroke="#22c55e" strokeWidth={2} strokeDasharray="4 4" label={{ position: 'insideTopRight', value: 'Mean', fill: '#22c55e', fontSize: 12 }} />
            )}
            
            {currentFrame >= 1 && skew === 0 && (
              <ReferenceLine x={0} stroke="#22c55e" strokeWidth={2} strokeDasharray="4 4" label={{ position: 'top', value: 'Mean = Median = Mode', fill: '#22c55e', fontSize: 12 }} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
        <div className="bg-slate-800 px-4 py-2 rounded-lg text-slate-300 shadow-md">
          <span className="font-semibold text-slate-400">Volatility (σ):</span> {sigma.toFixed(2)}
        </div>
        {skew !== 0 && (
          <div className="bg-slate-800 px-4 py-2 rounded-lg text-slate-300 shadow-md">
            <span className="font-semibold text-slate-400">Skewness:</span> {skew.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
};
