"use client";
import React from 'react';
import { useLessonStore } from '@/store/lessonStore';

export const EconometricsParamControls: React.FC = () => {
  const { params, updateParams } = useLessonStore();

  const handleSlider = (key: keyof typeof params, value: number) => {
    updateParams({ [key]: value });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 shadow-sm mb-8">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
          <span>Sample Size (N)</span>
          <span className="text-emerald-600 dark:text-emerald-400">{params.N}</span>
        </label>
        <input type="range" min="10" max="500" step="10" value={Math.min(500, Math.max(10, params.N))} onChange={(e) => handleSlider('N', parseFloat(e.target.value))} className="accent-emerald-600" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
          <span>Noise / Vol (σ)</span>
          <span className="text-emerald-600 dark:text-emerald-400">{(params.sigma || 0.2).toFixed(2)}</span>
        </label>
        <input type="range" min="0.05" max="3.00" step="0.05" value={params.sigma || 0.2} onChange={(e) => handleSlider('sigma', parseFloat(e.target.value))} className="accent-emerald-600" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
          <span title="Used for Slope, Skewness, or AR1">Param 1 (u)</span>
          <span className="text-emerald-600 dark:text-emerald-400">{params.u.toFixed(2)}</span>
        </label>
        <input type="range" min="-5" max="5" step="0.1" value={params.u} onChange={(e) => handleSlider('u', parseFloat(e.target.value))} className="accent-emerald-600" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
          <span title="Used for Spread, Kurtosis, or MA1">Param 2 (d)</span>
          <span className="text-emerald-600 dark:text-emerald-400">{params.d.toFixed(2)}</span>
        </label>
        <input type="range" min="-5" max="5" step="0.1" value={params.d} onChange={(e) => handleSlider('d', parseFloat(e.target.value))} className="accent-emerald-600" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
          <span title="Used for Intercept or Base Level">Base Level (S₀)</span>
          <span className="text-emerald-600 dark:text-emerald-400">{params.S0}</span>
        </label>
        <input type="range" min="-50" max="150" step="5" value={params.S0} onChange={(e) => handleSlider('S0', parseFloat(e.target.value))} className="accent-emerald-600" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
          <span title="Used for Correlation or Dependency">Correlation (r)</span>
          <span className="text-emerald-600 dark:text-emerald-400">{params.r.toFixed(2)}</span>
        </label>
        <input type="range" min="-0.99" max="0.99" step="0.01" value={params.r} onChange={(e) => handleSlider('r', parseFloat(e.target.value))} className="accent-emerald-600" />
      </div>
    </div>
  );
};
