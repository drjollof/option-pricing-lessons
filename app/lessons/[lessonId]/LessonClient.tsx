"use client";
import React, { useState, useEffect } from 'react';
import { Lesson } from '@/content/types';
import { ThreePanePlayer } from '@/components/ThreePanePlayer';
import { ParamControls } from '@/components/ParamControls';
import { PhaseHeader } from '@/components/PhaseHeader';
import { useLessonStore } from '@/store/lessonStore';
import { useProgressStore } from '@/store/progressStore';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import Link from 'next/link';

export const LessonClient: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const activePhase = lesson.phases[activePhaseIndex];
  const { updateParams } = useLessonStore();
  const { markComplete } = useProgressStore();

  useEffect(() => {
    updateParams(lesson.defaultParams);
    setActivePhaseIndex(0);
  }, [lesson, updateParams]);

  useEffect(() => {
    if (activePhaseIndex === lesson.phases.length - 1) {
      markComplete(lesson.id);
    }
  }, [activePhaseIndex, lesson.id, lesson.phases.length, markComplete]);

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-6 md:p-10 font-sans selection:bg-blue-200 transition-colors">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
           <div className="flex justify-between items-center mb-4">
             <Link href="/" className="inline-flex items-center text-blue-600 hover:underline font-semibold text-sm transition-colors">
               ← Back to Lessons
             </Link>
             <DarkModeToggle />
           </div>
           <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{lesson.title}</h1>
           <p className="text-lg text-slate-600 dark:text-slate-400">{lesson.description}</p>
        </header>
        
        
        {/* Phase Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:px-6 shadow-sm mb-6 gap-4">
          <button 
            disabled={activePhaseIndex === 0} 
            onClick={() => setActivePhaseIndex(i => i - 1)}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Previous Phase
          </button>
          
          <span className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200 text-center">
            Phase {activePhaseIndex + 1} of {lesson.phases.length}: {activePhase.title}
          </span>
          
          <button 
            disabled={activePhaseIndex === lesson.phases.length - 1} 
            onClick={() => setActivePhaseIndex(i => i + 1)}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Next Phase
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 p-6 md:p-8 backdrop-blur-xl mb-12">
          <PhaseHeader title={activePhase.title} description={activePhase.description} />
          
          <ThreePanePlayer phase={activePhase} key={activePhase.id} />
          
          {activePhase.showParamControls && (
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Adjust Parameters Below</h3>
              <ParamControls maxN={activePhase.kind === 'convergence-sweep' ? 100 : activePhase.kind === 'path-explorer' ? 5 : 6} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
