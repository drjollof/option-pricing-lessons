"use client";
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useLessonStore } from '@/store/lessonStore';

interface StochasticPathVisualizerProps {
  currentFrame: number;
  params?: {
    u?: number; // drift
    sigma?: number; // volatility
    S0?: number;
    N?: number;
  };
}

export const StochasticPathVisualizer: React.FC<StochasticPathVisualizerProps> = ({ currentFrame, params }) => {
  const storeParams = useLessonStore(state => state.params);
  
  const u = params?.u ?? storeParams.u ?? 0;
  const sigma = params?.sigma ?? storeParams.sigma ?? 1;
  const S0 = params?.S0 ?? storeParams.S0 ?? 100;
  const totalSteps = Math.min(500, Math.max(10, params?.N ?? storeParams.N ?? 100));

  const data = useMemo(() => {
    // Generate base random shocks
    const shocks = Array.from({ length: totalSteps }, () => (Math.random() + Math.random() + Math.random() - 1.5) * sigma * 2);
    
    let path: Array<{t: number, wn: number, rw: number, rwd: number, ma1: number, ar1: number, arch1: number, garch11: number, arch_shock: number, garch_shock: number, h_t_garch_val: number}> = [];
    let rw = S0;
    let rwd = S0;
    
    for (let t = 0; t < totalSteps; t++) {
      const e_t = shocks[t];
      const e_t_minus_1 = t > 0 ? shocks[t - 1] : 0;
      
      // Random Walk
      rw += e_t;
      
      // RW with Drift
      rwd += u + e_t;
      
      // MA(1)
      const theta = 0.8;
      const ma1 = e_t + theta * e_t_minus_1;
      
      // AR(1)
      const phi = 0.8;
      const ar1 = t === 0 ? e_t : (path[t-1].ar1 * phi + e_t);

      // ARCH(1) Returns
      const omega = 1.0;
      const alpha_arch = 0.8; // High ARCH effect
      const z_t = e_t / (sigma * 2 || 1); // Standard normal roughly
      const h_t_arch = t === 0 ? omega : omega + alpha_arch * (path[t-1].arch_shock * path[t-1].arch_shock);
      const arch_shock = Math.sqrt(h_t_arch) * z_t;
      const arch1 = arch_shock;

      // GARCH(1,1) Returns
      const beta_garch = 0.6;
      const alpha_garch = 0.3; // alpha + beta < 1
      const h_t_garch = t === 0 ? omega : omega + alpha_garch * (path[t-1].garch_shock * path[t-1].garch_shock) + beta_garch * path[t-1].h_t_garch_val;
      const garch_shock = Math.sqrt(h_t_garch) * z_t;
      const garch11 = garch_shock;

      path.push({
        t,
        wn: e_t,
        rw: rw,
        rwd: rwd,
        ma1: ma1,
        ar1: ar1,
        arch1: arch1,
        garch11: garch11,
        arch_shock: arch_shock,
        garch_shock: garch_shock,
        h_t_garch_val: h_t_garch
      } as any);
    }
    return path;
  }, [u, sigma, S0, totalSteps]);

  // Determine what we are plotting based on 'u' parameter passed in or some state.
  // Actually, let's use `u` as an enum for the process type for this visualizer.
  // u = 0 -> White Noise
  // u = 1 -> Random Walk
  // u = 2 -> Random Walk with Drift
  // u = 3 -> MA(1)
  // u = 5 -> ARCH(1)
  // u = 6 -> GARCH(1,1)
  
  const processType = Math.floor(u);
  
  const processConfigs = [
    { key: 'wn', name: 'White Noise', color: '#94a3b8', domain: ['auto', 'auto'] },
    { key: 'rw', name: 'Random Walk', color: '#3b82f6', domain: ['auto', 'auto'] },
    { key: 'rwd', name: 'Random Walk w/ Drift', color: '#f59e0b', domain: ['auto', 'auto'] },
    { key: 'ma1', name: 'MA(1) Process', color: '#10b981', domain: ['auto', 'auto'] },
    { key: 'ar1', name: 'AR(1) Process', color: '#8b5cf6', domain: ['auto', 'auto'] },
    { key: 'arch1', name: 'ARCH(1) Returns', color: '#ef4444', domain: ['auto', 'auto'] },
    { key: 'garch11', name: 'GARCH(1,1) Returns', color: '#ec4899', domain: ['auto', 'auto'] },
  ];

  const activeConfig = processConfigs[processType] || processConfigs[0];

  // Animate drawing by slicing data based on currentFrame (0 to 10 mapped to 100)
  // Or just draw everything but the line animates. 
  // Let's draw everything and let Recharts animate it.
  // But wait, the user wants "Animates the step-by-step generation". 
  // We can use currentFrame: if maxFrames is say, 4. 
  // frame 0: 25 steps, frame 1: 50, etc.
  const visibleSteps = Math.max(5, Math.floor((currentFrame + 1) * (totalSteps / 5)));
  const visibleData = data.slice(0, visibleSteps);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-xl p-4">
      <h3 className="text-xl font-bold text-slate-200 mb-2">
        {activeConfig.name} Simulation
      </h3>
      
      <div className="w-full flex-1 min-h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visibleData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="t" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={activeConfig.domain as any} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Line 
              type="monotone" 
              dataKey={activeConfig.key} 
              stroke={activeConfig.color} 
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
