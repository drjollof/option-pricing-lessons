"use client";
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useLessonStore } from '@/store/lessonStore';
import { blackScholes } from '@/lib/blackscholes';

export const MCConvergenceVisualizer: React.FC<{ optionType?: 'call' | 'put' }> = ({ optionType = 'call' }) => {
  const storeParams = useLessonStore(state => state.params);
  
  const S = storeParams.S0 ?? 100;
  const K = storeParams.K ?? 100;
  const r = storeParams.r ?? 0.05;
  const sigma = storeParams.sigma ?? 0.2;
  const T = storeParams.T ?? 1;

  // Analytical BS Price
  const bsPrice = blackScholes(S, K, r, sigma, T, optionType).price;

  // Generate Monte Carlo Convergence Data
  const data = useMemo(() => {
    const result = [];
    
    // Using a simple Box-Muller transform for standard normal random variables
    const randomNormal = () => {
      let u = 0, v = 0;
      while(u === 0) u = Math.random();
      while(v === 0) v = Math.random();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    };

    const drift = (r - 0.5 * sigma * sigma) * T;
    const vol = sigma * Math.sqrt(T);
    const df = Math.exp(-r * T);

    let cumulativePayoff = 0;
    
    // Checkpoints for the chart to keep data points reasonable
    // Instead of plotting every single path, we plot the average at specific intervals
    const maxPaths = 5000;
    const plotIntervals = [1, 10, 50, 100, 200, 500, 1000, 2000, 3000, 4000, 5000];

    for (let i = 1; i <= maxPaths; i++) {
      const z = randomNormal();
      const ST = S * Math.exp(drift + vol * z);
      
      const payoff = optionType === 'call' 
        ? Math.max(0, ST - K) 
        : Math.max(0, K - ST);
        
      cumulativePayoff += payoff;

      if (plotIntervals.includes(i)) {
        const mcPrice = df * (cumulativePayoff / i);
        result.push({
          simulations: i,
          mcPrice: Math.round(mcPrice * 1000) / 1000,
          bsPrice: Math.round(bsPrice * 1000) / 1000
        });
      }
    }
    
    return result;
  }, [S, K, r, sigma, T, optionType, bsPrice]);

  const finalMC = data[data.length - 1]?.mcPrice || 0;
  const error = Math.abs(finalMC - bsPrice);
  const errorPct = bsPrice === 0 ? 0 : (error / bsPrice) * 100;

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-200">
            Monte Carlo Convergence
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Simulating {data[data.length - 1]?.simulations} paths vs. Black-Scholes Formula
          </p>
        </div>
        <span className="text-sm font-semibold px-3 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 uppercase tracking-widest">
          {optionType} Option
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-900/20 flex flex-col items-center">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Black-Scholes Exact</span>
          <span className="text-2xl font-mono font-bold text-white">{bsPrice.toFixed(4)}</span>
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-900/20 flex flex-col items-center">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Monte Carlo (N=5000)</span>
          <span className="text-2xl font-mono font-bold text-white">{finalMC.toFixed(4)}</span>
        </div>
        <div className="col-span-2 md:col-span-1 p-4 rounded-xl border border-slate-700 bg-slate-800/50 flex flex-col items-center">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Pricing Error</span>
          <span className="text-2xl font-mono font-bold text-slate-300">
            {error.toFixed(4)} <span className="text-sm text-slate-500">({errorPct.toFixed(2)}%)</span>
          </span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="simulations" 
              stroke="#94a3b8" 
              type="number"
              domain={['dataMin', 'dataMax']}
              label={{ value: 'Number of Simulations (N)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} 
            />
            <YAxis 
              stroke="#94a3b8" 
              domain={['auto', 'auto']}
              tickFormatter={(val) => val.toFixed(2)}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <ReferenceLine y={bsPrice} stroke="#3b82f6" strokeDasharray="5 5" label={{ value: 'Black-Scholes', fill: '#3b82f6', position: 'top' }} />
            <Line 
              type="monotone" 
              dataKey="mcPrice" 
              name="MC Estimate"
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
