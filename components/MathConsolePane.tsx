"use client";

import React, { useEffect, useRef, useState } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { useLessonStore } from '@/store/lessonStore';
import { motion, AnimatePresence } from 'framer-motion';

interface MathConsolePaneProps {
  stepText: string[];
  formulas: (string | string[])[];
  codeSnippet?: string;
}

export const MathConsolePane: React.FC<MathConsolePaneProps> = ({ stepText, formulas, codeSnippet }) => {
  const { currentFrame } = useLessonStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'math' | 'code'>('math');

  // Auto-scroll to bottom when new items are added
  useEffect(() => {
    if (bottomRef.current && viewMode === 'math') {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentFrame, viewMode]);

  return (
    <div className="flex flex-col p-6 border border-slate-800 rounded-2xl bg-slate-900 text-slate-100 shadow-xl w-full h-full relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <span className="ml-2 text-xs font-semibold tracking-widest text-slate-400">
            {viewMode === 'math' ? 'MATH CONSOLE' : 'SOURCE CODE'}
          </span>
        </div>
        
        {codeSnippet && (
          <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
            <button 
              onClick={() => setViewMode('math')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${viewMode === 'math' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Math
            </button>
            <button 
              onClick={() => setViewMode('code')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${viewMode === 'code' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Code
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-6">
        {viewMode === 'math' ? (
          <>
            <AnimatePresence mode="popLayout">
              {stepText.slice(0, currentFrame + 1).map((text, idx) => (
                <motion.div
                  key={`block-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-3"
                >
                  <p className="text-[15px] leading-relaxed text-slate-300 font-medium">
                    {text}
                  </p>
                  
                  {formulas[idx] && (
                    <div className="bg-slate-950/50 backdrop-blur-md border border-slate-800/60 p-4 rounded-xl shadow-inner flex flex-col gap-2 overflow-x-auto">
                      {Array.isArray(formulas[idx]) ? (
                        (formulas[idx] as string[]).map((f, i) => (
                          <div key={i} className="text-sm md:text-base">
                            <BlockMath math={f} />
                          </div>
                        ))
                      ) : (
                        <div className="text-sm md:text-base">
                          <BlockMath math={formulas[idx] as string} />
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={bottomRef} />
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-x-auto h-full"
          >
            <pre className="font-mono text-[13px] leading-relaxed text-emerald-400">
              <code>{codeSnippet}</code>
            </pre>
          </motion.div>
        )}
      </div>
    </div>
  );
};
