import React from 'react';
import { lessons } from '@/content/lessons-index';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { DarkModeToggle } from '@/components/DarkModeToggle';

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    lessonId: lesson.id,
  }));
}

export default async function TextbookChapter({ params }: { params: Promise<{ lessonId: string }> }) {
  const resolvedParams = await params;
  const lessonIndex = lessons.findIndex((l) => l.id === resolvedParams.lessonId);
  
  if (lessonIndex === -1) {
    notFound();
  }
  
  const lesson = lessons[lessonIndex];
  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-6 md:p-12 font-sans selection:bg-blue-200 transition-colors">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:underline font-semibold text-sm transition-colors">
            ← Back to Home
          </Link>
          <DarkModeToggle />
        </header>

        {/* Chapter Header */}
        <div className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">
            Chapter {lessonIndex + 1}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
            {lesson.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            {lesson.description}
          </p>
        </div>

        {/* Sections (Phases) */}
        <article className="prose prose-slate dark:prose-invert prose-lg max-w-none">
          {lesson.phases.map((phase, idx) => (
            <section key={phase.id} className="mb-16">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-sm">
                  {idx + 1}
                </span>
                {phase.title}
              </h2>
              
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
                {phase.description}
              </p>

              {/* Steps and Formulas */}
              {phase.stepTexts && phase.stepTexts.map((stepText, stepIdx) => (
                <div key={stepIdx} className="mb-8">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    {stepText.replace(/^Step \d+: /, '')}
                  </p>
                  
                  {phase.formulas && phase.formulas[stepIdx] && (
                    <div className="my-6 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-x-auto">
                      {Array.isArray(phase.formulas[stepIdx]) ? (
                        (phase.formulas[stepIdx] as string[]).map((f, i) => (
                          <div key={i} className="my-2">
                            <BlockMath math={f} />
                          </div>
                        ))
                      ) : (
                        <BlockMath math={phase.formulas[stepIdx] as string} />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </section>
          ))}
        </article>

        {/* Pagination */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          {prevLesson ? (
            <Link 
              href={`/textbook/${prevLesson.id}`}
              className="group flex flex-col items-start px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 transition-colors w-[48%]"
            >
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">Previous Chapter</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate w-full">{prevLesson.title}</span>
            </Link>
          ) : (
            <div className="w-[48%]"></div>
          )}
          
          {nextLesson ? (
            <Link 
              href={`/textbook/${nextLesson.id}`}
              className="group flex flex-col items-end px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 transition-colors w-[48%] text-right"
            >
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">Next Chapter</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate w-full">{nextLesson.title}</span>
            </Link>
          ) : (
            <Link 
              href="/textbook"
              className="group flex flex-col items-end px-6 py-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl hover:border-emerald-500 transition-colors w-[48%] text-right"
            >
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1 group-hover:text-emerald-500 transition-colors">End of Textbook</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate w-full group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Back to Table of Contents</span>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
