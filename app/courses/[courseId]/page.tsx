"use client";
import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { coursesRegistry } from '@/content/coursesRegistry';
import { useProgressStore } from '@/store/progressStore';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { notFound } from 'next/navigation';

export default function CourseHome({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const courseData = coursesRegistry[courseId];
  
  if (!courseData) {
    notFound();
  }
  const course = courseData.course;

  const { completedLessons } = useProgressStore();
  const [mounted, setMounted] = useState(false);
  const [lastLessonId, setLastLessonId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(`last-lesson-${courseId}`);
    if (saved) {
      setLastLessonId(saved);
    }
  }, [courseId]);

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-6 md:p-12 font-sans selection:bg-blue-200 transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:underline font-semibold text-sm transition-colors">
            ← Back to Course Catalog
          </Link>
          <DarkModeToggle />
        </div>
        <header className="mb-12 mt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {course.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {course.description}
          </p>
          
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {lastLessonId && (
              <Link 
                href={`/courses/${courseId}/lessons/${lastLessonId}`}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Resume Course
              </Link>
            )}
            <Link 
              href={`/courses/${courseId}/sandbox`}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Sandbox Explorer
            </Link>
            
            <Link 
              href={`/courses/${courseId}/textbook`}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
              Textbook Mode
            </Link>
          </div>
        </header>

        {course.modules.map((module) => (
          <div key={module.id} className="mb-16">
            <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{module.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {module.lessons.map((lesson, idx) => {
                const globalLessonId = `${courseId}-${lesson.id}`;
                const isCompleted = mounted && completedLessons.includes(globalLessonId);
                return (
                  <Link 
                    href={`/courses/${courseId}/lessons/${lesson.id}`} 
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
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
