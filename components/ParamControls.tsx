"use client";
import React from 'react';
import { useLessonStore } from '@/store/lessonStore';

export const ParamControls: React.FC = () => {
  const { params, updateParams } = useLessonStore();

  const handleSlider = (key: keyof typeof params, value: number) => {
    updateParams({ [key]: value });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 shadow-sm mb-8">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
          <span>S₀ (Stock)</span>
          <span className="text-blue-600 dark:text-blue-400">{params.S0}</span>
        </label>
        <input type="range" min="50" max="150" step="5" value={params.S0} onChange={(e) => handleSlider('S0', parseFloat(e.target.value))} className="accent-blue-600" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
          <span>K (Strike)</span>
          <span className="text-blue-600 dark:text-blue-400">{params.K}</span>
        </label>
        <input type="range" min="50" max="150" step="5" value={params.K} onChange={(e) => handleSlider('K', parseFloat(e.target.value))} className="accent-blue-600" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
          <span>u (Up)</span>
          <span className="text-blue-600 dark:text-blue-400">{params.u.toFixed(2)}</span>
        </label>
        <input type="range" min="1.0" max="1.5" step="0.01" value={params.u} onChange={(e) => handleSlider('u', parseFloat(e.target.value))} className="accent-blue-600" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
          <span>d (Down)</span>
          <span className="text-blue-600 dark:text-blue-400">{params.d.toFixed(2)}</span>
        </label>
        <input type="range" min="0.5" max="1.0" step="0.01" value={params.d} onChange={(e) => handleSlider('d', parseFloat(e.target.value))} className="accent-blue-600" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
          <span>N (Steps)</span>
          <span className="text-blue-600 dark:text-blue-400">{params.N}</span>
        </label>
        <input type="range" min="1" max="100" step="1" value={params.N} onChange={(e) => handleSlider('N', parseFloat(e.target.value))} className="accent-blue-600" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
          <span>σ (Volatility)</span>
          <span className="text-blue-600 dark:text-blue-400">{(params.sigma || 0.2).toFixed(2)}</span>
        </label>
        <input type="range" min="0.05" max="0.80" step="0.01" value={params.sigma || 0.2} onChange={(e) => handleSlider('sigma', parseFloat(e.target.value))} className="accent-blue-600" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
          <span>r (Rate)</span>
          <span className="text-blue-600 dark:text-blue-400">{params.r.toFixed(2)}</span>
        </label>
        <input type="range" min="0" max="0.2" step="0.01" value={params.r} onChange={(e) => handleSlider('r', parseFloat(e.target.value))} className="accent-blue-600" />
      </div>
    </div>
  );
};
