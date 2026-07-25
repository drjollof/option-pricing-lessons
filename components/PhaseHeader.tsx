"use client";
import React from 'react';
import { useLessonStore } from '@/store/lessonStore';

interface PhaseHeaderProps {
  title: string;
  description?: string;
}

export const PhaseHeader: React.FC<PhaseHeaderProps> = ({ title, description }) => {
  const { params } = useLessonStore();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{title}</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-3xl leading-relaxed">
          {description || `Given an initial stock price S0 = ${params.S0}, we project its future value across ${params.N} steps.`}
        </p>
      </div>
      <div className="flex gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono text-slate-600 dark:text-slate-400 shadow-sm">
          u = {params.u.toFixed(2)}
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono text-slate-600 dark:text-slate-400 shadow-sm">
          d = {params.d.toFixed(2)}
        </div>
      </div>
    </div>
  );
};
