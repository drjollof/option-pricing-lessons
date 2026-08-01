"use client";
import React from 'react';
import { useLessonStore } from '@/store/lessonStore';

interface EconometricsParamControlsProps {
  visualizer: string;
}

export const EconometricsParamControls: React.FC<EconometricsParamControlsProps> = ({ visualizer }) => {
  const { params, updateParams } = useLessonStore();

  const handleSlider = (key: keyof typeof params, value: number) => {
    updateParams({ [key]: value });
  };

  const renderSlider = (key: keyof typeof params, label: string, min: number, max: number, step: number, value: number, displayValue: string | number) => (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
        <span>{label}</span>
        <span className="text-blue-600 dark:text-blue-400">{displayValue}</span>
      </label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => handleSlider(key, parseFloat(e.target.value))} className="accent-blue-600" />
    </div>
  );

  let controls = null;

  switch (visualizer) {
    case 'scatter-plot':
      controls = (
        <>
          {renderSlider('N', 'Sample Size', 10, 500, 10, Math.min(500, Math.max(10, params.N)), params.N)}
          {renderSlider('sigma', 'Noise Variance', 0.05, 3.00, 0.05, params.sigma || 0.2, (params.sigma || 0.2).toFixed(2))}
          {renderSlider('u', 'True Beta (Slope)', -5, 5, 0.1, params.u, params.u.toFixed(2))}
          {renderSlider('S0', 'True Alpha (Intercept)', -50, 150, 5, params.S0, params.S0)}
        </>
      );
      break;
    case 'distribution-curve':
      controls = (
        <>
          {renderSlider('u', 'Skewness', -5, 5, 0.1, params.u, params.u.toFixed(2))}
          {renderSlider('d', 'Kurtosis', -5, 5, 0.1, params.d, params.d.toFixed(2))}
          {renderSlider('sigma', 'Standard Deviation', 0.05, 3.00, 0.05, params.sigma || 0.2, (params.sigma || 0.2).toFixed(2))}
        </>
      );
      break;
    case 'machine-learning':
      controls = (
        <>
          {renderSlider('N', 'Data Points', 10, 100, 10, Math.min(100, Math.max(10, params.N)), params.N)}
          {renderSlider('sigma', 'Cluster Spread', 0.05, 1.00, 0.05, params.sigma || 0.2, (params.sigma || 0.2).toFixed(2))}
        </>
      );
      break;
    case 'arima-signature':
      controls = (
        <>
          {renderSlider('r', 'AR(1) Coefficient', -0.99, 0.99, 0.01, params.r, params.r.toFixed(2))}
          {renderSlider('u', 'MA(1) Coefficient', -5, 5, 0.1, params.u, (params.u / 5).toFixed(2))}
        </>
      );
      break;
    case 'copula-3d':
      controls = (
        <>
          {renderSlider('r', 'Correlation (Dependence)', -0.99, 0.99, 0.01, params.r, params.r.toFixed(2))}
        </>
      );
      break;
    case 'stochastic-path':
    case 'qq-plot':
    case 'pca-scree':
    case 'network-theory':
    case 'correlation-heatmap':
      // Some visualizers might not have tunable parameters yet, or they don't need them.
      controls = <div className="col-span-full text-slate-500 text-sm italic py-4">No tunable parameters for this visualizer yet.</div>;
      break;
    default:
      controls = <div className="col-span-full text-slate-500 text-sm italic py-4">Select a visualizer.</div>;
      break;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 shadow-sm mb-8">
      {controls}
    </div>
  );
};
