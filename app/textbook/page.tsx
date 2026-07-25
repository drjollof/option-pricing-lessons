import Link from 'next/link';
import { lessons } from '@/content/lessons-index';
import { DarkModeToggle } from '@/components/DarkModeToggle';

export default function TextbookRoot() {
  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-6 md:p-12 font-sans selection:bg-blue-200 transition-colors">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:underline font-semibold text-sm transition-colors">
            ← Back to Home
          </Link>
          <DarkModeToggle />
        </header>

        <div className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
            Textbook Mode
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            Table of Contents
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {lessons.map((lesson, idx) => (
            <Link 
              key={lesson.id} 
              href={`/textbook/${lesson.id}`}
              className="group flex flex-col p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">
                Chapter {idx + 1}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {lesson.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {lesson.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
