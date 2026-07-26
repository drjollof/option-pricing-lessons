"use client";
import React from 'react';
import Link from 'next/link';
import { coursesRegistry } from '@/content/coursesRegistry';
import { DarkModeToggle } from '@/components/DarkModeToggle';

export default function GlobalHome() {
  const courses = Object.values(coursesRegistry).map(c => c.course);

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-6 md:p-12 font-sans selection:bg-blue-200 transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-end mb-4">
          <DarkModeToggle />
        </div>
        
        <header className="mb-16 mt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Quantitative Finance <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Academy</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Master the mathematics of markets with our interactive, visually-driven curriculum. Select a course below to begin.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {courses.map((course) => (
            <Link 
              href={`/courses/${course.id}`} 
              key={course.id}
              className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-2">
                {course.title}
              </h2>
              
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                {course.description}
              </p>
              
              <div className="text-sm font-semibold text-white bg-slate-900 dark:bg-slate-800 py-2.5 px-4 rounded-xl flex items-center justify-between group-hover:bg-blue-600 transition-colors">
                <span>View Curriculum</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
          
          {/* Coming Soon Placeholder */}
          <div className="group flex flex-col bg-slate-50 dark:bg-slate-900/50 border border-slate-200 border-dashed dark:border-slate-800 rounded-3xl p-6 opacity-70">
            <h2 className="text-xl font-bold text-slate-400 dark:text-slate-500 mb-3 mt-2">
              Financial Econometrics
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
              Time series analysis, OLS regression, ARMA/GARCH models, and volatility clustering.
            </p>
            <div className="text-sm font-semibold text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800/50 py-2.5 px-4 rounded-xl flex items-center justify-center">
              <span>Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
