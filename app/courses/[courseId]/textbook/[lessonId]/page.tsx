import React from 'react';
import { coursesRegistry } from '@/content/coursesRegistry';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { StaticPhaseVisualizer } from '@/components/StaticPhaseVisualizer';
import { ScrollRestorer } from '@/components/ScrollRestorer';

export default async function TextbookChapter({ params }: { params: Promise<{ courseId: string, lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  const courseData = coursesRegistry[courseId];
  if (!courseData) notFound();

  const lessons = courseData.fullLessons;
  const lessonIndex = lessons.findIndex((l) => l.id === lessonId);
  
  if (lessonIndex === -1) {
    notFound();
  }
  
  const lesson = lessons[lessonIndex];
  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;

  return (
    <main id="top" className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-6 md:p-12 font-sans selection:bg-blue-200 transition-colors">
      <ScrollRestorer storageKey={`textbook-scroll-${courseId}-${lesson.id}`} />
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <Link href={`/courses/${courseId}/textbook`} className="inline-flex items-center text-blue-600 hover:underline font-semibold text-sm transition-colors">
            ← Back to Table of Contents
          </Link>
          <DarkModeToggle />
        </header>

        {/* Chapter Header */}
        <div className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">
            Chapter {lessonIndex + 1}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            {lesson.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {lesson.description}
          </p>
        </div>

        <article className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-xl">
          {/* Sections (Phases) */}
          {lesson.phases.map((phase, idx) => (
            <section key={phase.id} className="mb-16">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold">
                  {idx + 1}
                </span>
                {phase.title}
              </h2>
              
              {phase.description && (
                <p className="text-xl text-slate-500 dark:text-slate-400 italic mb-8">
                  {phase.description}
                </p>
              )}

              {/* Steps and Formulas */}
              {phase.stepTexts && phase.stepTexts.map((stepText, stepIdx) => (
                <div key={stepIdx} className="mb-8 group">
                  <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {stepText}
                    </ReactMarkdown>
                  </div>
                  
                  {/* Related Formulas */}
                  {phase.formulas && phase.formulas[stepIdx] && (
                    <div className="mt-6 mb-8 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-x-auto">
                      <div className="text-slate-800 dark:text-slate-200">
                        {/* 
                          A formula block can either be a single string or an array of strings. 
                          We check if it's an array to map over it, otherwise we just render it.
                        */}
                        {Array.isArray(phase.formulas[stepIdx]) ? (
                          (phase.formulas[stepIdx] as string[]).map((f, i) => (
                            <div key={i} className={i > 0 ? "mt-4" : ""}>
                              <BlockMath math={f} />
                            </div>
                          ))
                        ) : (
                          <BlockMath math={phase.formulas[stepIdx] as string} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <StaticPhaseVisualizer phase={phase} defaultParams={lesson.defaultParams} />
            </section>
          ))}
        </article>

        {/* Back to Top */}
        <div className="mt-8 flex justify-center">
          <a href="#top" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm hover:shadow-md">
            ↑ Back to Top
          </a>
        </div>

        {/* Pagination */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          {prevLesson ? (
            <Link 
              href={`/courses/${courseId}/textbook/${prevLesson.id}`}
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
              href={`/courses/${courseId}/textbook/${nextLesson.id}`}
              className="group flex flex-col items-end px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 transition-colors w-[48%] text-right"
            >
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">Next Chapter</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate w-full">{nextLesson.title}</span>
            </Link>
          ) : (
            <Link 
              href={`/courses/${courseId}/textbook`}
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
