"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { lessons } from '@/content/lessons-index';
import { useProgressStore } from '@/store/progressStore';
import { DarkModeToggle } from '@/components/DarkModeToggle';

export default function Home() {
  const { completedLessons } = useProgressStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-6 md:p-12 font-sans selection:bg-blue-200 transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-end mb-4">
          <DarkModeToggle />
        </div>
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Option Pricing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Masterclass</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Interactive, visual, and code-driven lessons to master quantitative finance. From binomial lattices to Black-Scholes.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson, idx) => {
            const isCompleted = mounted && completedLessons.includes(lesson.id);
            return (
              <Link 
                href={`/lessons/${lesson.id}`} 
                key={lesson.id}
                className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </div>
                  {isCompleted && (
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-1.5 rounded-full" title="Completed">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {lesson.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-grow">
                  {lesson.description}
                </p>
                
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Start Lesson <span>→</span>
                </div>
              </Link>
            );
          })}
          
          <Link 
            href="/sandbox"
            className="group flex flex-col bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Sandbox Explorer
            </h2>
            <p className="text-indigo-100 text-sm leading-relaxed mb-4 flex-grow">
              Pure exploration. Choose any visualizer, adjust parameters without constraints, and see how the model behaves.
            </p>
            
            <div className="text-sm font-semibold text-white flex items-center gap-1 group-hover:gap-2 transition-all">
              Enter Sandbox <span>→</span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
