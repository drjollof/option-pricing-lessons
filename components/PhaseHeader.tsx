"use client";
import React from 'react';
import { useLessonStore } from '@/store/lessonStore';

interface PhaseHeaderProps {
  title: string;
  description?: string;
  visibleParams?: string[];
}

export const PhaseHeader: React.FC<PhaseHeaderProps> = ({ title, description, visibleParams }) => {
  const { params } = useLessonStore();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{title}</h2>
        {description && (
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {(!visibleParams || visibleParams.includes('S0')) && (
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono text-slate-600 dark:text-slate-400 shadow-sm">
            S₀ = {params.S0}
          </div>
        )}
        {visibleParams?.includes('K') && (
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono text-slate-600 dark:text-slate-400 shadow-sm">
            K = {params.K}
          </div>
        )}
        {(!visibleParams || visibleParams.includes('u')) && (
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono text-slate-600 dark:text-slate-400 shadow-sm">
            u = {params.u.toFixed(2)}
          </div>
        )}
        {(!visibleParams || visibleParams.includes('d')) && (
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono text-slate-600 dark:text-slate-400 shadow-sm">
            d = {params.d.toFixed(2)}
          </div>
        )}
        {visibleParams?.includes('r') && (
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono text-slate-600 dark:text-slate-400 shadow-sm">
            r = {params.r * 100}%
          </div>
        )}
        {visibleParams?.includes('dt') && (
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono text-slate-600 dark:text-slate-400 shadow-sm">
            Δt = {(params.T / params.N).toFixed(3)}
          </div>
        )}
      </div>
    </div>
  );
};
