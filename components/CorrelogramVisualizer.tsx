"use client";
import React, { useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

interface CorrelogramVisualizerProps {
  currentFrame: number;
  params: {
    sigma?: number;
    u?: number;
  };
}

export const CorrelogramVisualizer: React.FC<CorrelogramVisualizerProps> = ({ currentFrame, params }) => {
  const { u = 0 } = params; 

  const data = useMemo(() => {
    // Generate synthetic ACF and PACF data based on u
    // If u = 1 (AR(1) process), ACF tails off, PACF cuts off after lag 1
    // If u = -1 (MA(1) process), ACF cuts off after lag 1, PACF tails off
    // If u = 0 (White Noise), both are near 0

    const lags = 15;
    const result = [];
    const phi = 0.8;
    const theta = 0.8;

    for (let i = 0; i <= lags; i++) {
      if (i === 0) {
        result.push({ lag: 0, acf: 1.0, pacf: 1.0 });
        continue;
      }

      let acf = 0;
      let pacf = 0;

      if (u === 1) { // AR(1)
        acf = Math.pow(phi, i); // Exponential decay
        pacf = i === 1 ? phi : (Math.random() * 0.1 - 0.05); // Cut-off
      } else if (u === -1) { // MA(1)
        acf = i === 1 ? theta / (1 + theta * theta) : (Math.random() * 0.1 - 0.05); // Cut-off
        pacf = Math.pow(-theta, i) * (Math.random() * 0.2 + 0.8); // Alternating decay (simplified)
      } else { // White Noise
        acf = Math.random() * 0.15 - 0.075;
        pacf = Math.random() * 0.15 - 0.075;
      }

      // Add a little noise so it looks empirical
      if (i !== 1 || (u !== 1 && u !== -1)) {
        acf += Math.random() * 0.04 - 0.02;
        pacf += Math.random() * 0.04 - 0.02;
      }

      result.push({ lag: i, acf, pacf });
    }
    return result;
  }, [u]);

  const yDomain = [-1, 1];
  const sigLevel = 1.96 / Math.sqrt(100); // approx +/- 0.196 for N=100

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4 bg-slate-900 rounded-xl p-4">
      
      {/* ACF Plot */}
      <div className="flex-1 flex flex-col items-center relative">
        <h3 className="text-lg font-bold text-slate-200 mb-2">Autocorrelation (ACF)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="lag" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={yDomain} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
            {/* Confidence Interval Band */}
            <ReferenceArea y1={-sigLevel} y2={sigLevel} fill="#3b82f6" fillOpacity={0.15} />
            {/* Zero line */}
            <ReferenceArea y1={0} y2={0} stroke="#94a3b8" strokeOpacity={0.5} />
            
            <Bar dataKey="acf" barSize={4} fill="#8b5cf6" isAnimationActive={currentFrame > 0} />
            {/* Dots on top of bars to make stems */}
            <Line type="monotone" dataKey="acf" stroke="none" dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* PACF Plot */}
      <div className="flex-1 flex flex-col items-center relative">
        <h3 className="text-lg font-bold text-slate-200 mb-2">Partial Autocorrelation (PACF)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="lag" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={yDomain} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
            {/* Confidence Interval Band */}
            <ReferenceArea y1={-sigLevel} y2={sigLevel} fill="#3b82f6" fillOpacity={0.15} />
            {/* Zero line */}
            <ReferenceArea y1={0} y2={0} stroke="#94a3b8" strokeOpacity={0.5} />
            
            <Bar dataKey="pacf" barSize={4} fill="#10b981" isAnimationActive={currentFrame > 0} />
            <Line type="monotone" dataKey="pacf" stroke="none" dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
