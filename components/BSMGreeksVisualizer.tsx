"use client";
import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLessonStore } from '@/store/lessonStore';
import { blackScholes } from '@/lib/blackscholes';

interface BSMGreeksVisualizerProps {
  optionType?: 'call' | 'put';
}

export const BSMGreeksVisualizer: React.FC<BSMGreeksVisualizerProps> = ({ optionType = 'call' }) => {
  const storeParams = useLessonStore(state => state.params);
  const [activeGreek, setActiveGreek] = useState<'price' | 'delta' | 'gamma' | 'vega' | 'theta' | 'rho'>('delta');

  const S = storeParams.S0 ?? 100;
  const K = storeParams.K ?? 100;
  const r = storeParams.r ?? 0.05;
  const sigma = storeParams.sigma ?? 0.2;
  const T = storeParams.T ?? 1;

  // Calculate current exact BSM metrics
  const bsm = blackScholes(S, K, r, sigma, T, optionType);

  // Generate curve data across a range of spot prices
  const curveData = useMemo(() => {
    const data = [];
    const minS = Math.max(1, K * 0.5);
    const maxS = K * 1.5;
    const steps = 50;
    const stepSize = (maxS - minS) / steps;
    
    for (let i = 0; i <= steps; i++) {
      const spot = minS + i * stepSize;
      const res = blackScholes(spot, K, r, sigma, T, optionType);
      data.push({
        spot: Math.round(spot * 100) / 100,
        price: res.price,
        delta: res.delta,
        gamma: res.gamma,
        vega: res.vega,
        theta: res.theta,
        rho: res.rho
      });
    }
    return data;
  }, [K, r, sigma, T, optionType]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(num);
  };

  const cards = [
    { key: 'price', label: 'Option Price', value: bsm.price, color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { key: 'delta', label: 'Delta (Δ)', value: bsm.delta, color: 'text-blue-400', border: 'border-blue-500/30' },
    { key: 'gamma', label: 'Gamma (Γ)', value: bsm.gamma, color: 'text-purple-400', border: 'border-purple-500/30' },
    { key: 'vega', label: 'Vega (ν)', value: bsm.vega, color: 'text-orange-400', border: 'border-orange-500/30' },
    { key: 'theta', label: 'Theta (Θ)', value: bsm.theta, color: 'text-red-400', border: 'border-red-500/30' },
    { key: 'rho', label: 'Rho (ρ)', value: bsm.rho, color: 'text-yellow-400', border: 'border-yellow-500/30' }
  ] as const;

  const activeColor = cards.find(c => c.key === activeGreek)?.color.replace('text-', '') || 'blue-400';
  const activeLabel = cards.find(c => c.key === activeGreek)?.label || 'Value';

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-200">
          Black-Scholes-Merton & The Greeks
        </h3>
        <span className="text-sm font-semibold px-3 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 uppercase tracking-widest">
          {optionType} Option
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map(card => (
          <button 
            key={card.key}
            onClick={() => setActiveGreek(card.key)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border bg-slate-800/50 transition-all hover:bg-slate-800 ${activeGreek === card.key ? 'ring-2 ring-slate-500 ' + card.border : 'border-slate-700/50'}`}
          >
            <span className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-1">{card.label}</span>
            <span className={`text-xl sm:text-2xl font-mono font-bold ${card.color}`}>
              {formatNumber(card.value)}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 w-full min-h-[200px] relative">
        <h4 className="text-center text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">
          {activeLabel} vs Spot Price
        </h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curveData} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="spot" 
              stroke="#94a3b8" 
              label={{ value: 'Spot Price (S)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} 
            />
            <YAxis 
              stroke="#94a3b8" 
              domain={['auto', 'auto']}
              tickFormatter={(val) => val.toFixed(2)}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value: any) => [Number(value).toFixed(4), activeLabel]}
            />
            {/* Draw current spot price reference line */}
            <Line 
              type="monotone" 
              dataKey={activeGreek} 
              stroke={`var(--color-${activeColor}, #3b82f6)`} 
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
