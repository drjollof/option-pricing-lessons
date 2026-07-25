"use client";

import React, { useMemo, useEffect } from 'react';
import { LatticePane } from './LatticePane';
import { ArrayGridPane } from './ArrayGridPane';
import { MathConsolePane } from './MathConsolePane';
import { PlaybackControls } from './PlaybackControls';
import { buildStockTree, priceEuropeanOption, priceAmericanOption, buildDeltaTree } from '@/lib/binomial';
import { useLessonStore } from '@/store/lessonStore';
import { LessonPhase } from '@/content/types';

import { ConvergenceChartPane } from './ConvergenceChartPane';
import { PathExplorerPane } from './PathExplorerPane';
import { MonteCarloPane } from './MonteCarloPane';

interface ThreePanePlayerProps {
  phase: LessonPhase;
}

export const ThreePanePlayer: React.FC<ThreePanePlayerProps> = ({ phase }) => {
  const { params, setMaxFrames, setFrame, pause, maxFrames } = useLessonStore();
  
  const stockTree = useMemo(() => buildStockTree(params), [params]);
  const optionResult = useMemo(() => {
    return phase.isAmerican 
      ? priceAmericanOption(params, phase.optionType || 'call')
      : priceEuropeanOption(params, phase.optionType || 'call');
  }, [params, phase.optionType, phase.isAmerican]);
  
  const optionTree = optionResult.optionTree;
  const exerciseTree = ('exerciseTree' in optionResult ? (optionResult as any).exerciseTree : undefined) as boolean[][] | undefined;
  
  const deltaTree = useMemo(() => buildDeltaTree(params, optionTree, stockTree), [params, optionTree, stockTree]);

  useEffect(() => {
    pause(); 
    const maxF = phase.kind === 'derivation-steps' 
      ? (phase.stepTexts?.length || 1) - 1 
      : (phase.reveals === 'delta_tree' ? params.N - 1 : params.N);
    setMaxFrames(maxF);
    setFrame(0);
  }, [params.N, phase, setMaxFrames, setFrame, pause]);

  if (phase.kind === 'convergence-sweep') {
    return (
      <div className="w-full h-[500px]">
        <ConvergenceChartPane maxN={100} />
      </div>
    );
  }

  if (phase.kind === 'path-explorer') {
    return (
      <div className="w-full h-[500px]">
        <PathExplorerPane />
      </div>
    );
  }

  if (phase.kind === 'monte-carlo') {
    return (
      <div className="w-full h-[500px]">
        <MonteCarloPane />
      </div>
    );
  }

  const treeToRender = 
    phase.reveals === 'delta_tree' ? deltaTree :
    phase.reveals === 'option_tree' ? optionTree : 
    stockTree;

  return (
    <div className="flex flex-col gap-6 w-full mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {phase.kind === 'derivation-steps' ? (
          <>
            <div className="lg:col-span-12 h-[400px] lg:h-[500px] order-1">
              <MathConsolePane stepText={phase.stepTexts || []} formulas={phase.formulas || []} codeSnippet={phase.codeSnippet} />
            </div>
            {maxFrames > 0 && (
              <div className="lg:col-span-12 order-2 mt-2 lg:mt-0">
                <PlaybackControls />
              </div>
            )}
          </>
        ) : (
          <>
            {/* Math Console: 1st on mobile, 1st on desktop */}
            <div className="lg:col-span-5 h-[400px] lg:h-[500px] order-1">
              <MathConsolePane stepText={phase.stepTexts || []} formulas={phase.formulas || []} codeSnippet={phase.codeSnippet} />
            </div>

            {maxFrames > 0 && (
              <div className="lg:col-span-12 order-2 lg:order-4 mt-2 lg:mt-0">
                <PlaybackControls />
              </div>
            )}

            {/* Lattice: 3rd on mobile, 2nd on desktop */}
            <div className="lg:col-span-4 h-[400px] lg:h-[500px] order-3 lg:order-2">
              {treeToRender ? (
                <LatticePane tree={treeToRender} direction={phase.direction || 'forward'} highlightTree={phase.reveals === 'option_tree' ? exerciseTree : undefined} />
              ) : (
                <div className="flex items-center justify-center w-full h-full border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-slate-400">
                  No tree data available
                </div>
              )}
            </div>

            {/* Array Grid: 4th on mobile, 3rd on desktop */}
            <div className="lg:col-span-3 h-[400px] lg:h-[500px] order-4 lg:order-3">
              {treeToRender ? (
                <ArrayGridPane tree={treeToRender} direction={phase.direction || 'forward'} highlightTree={phase.reveals === 'option_tree' ? exerciseTree : undefined} />
              ) : (
                <div className="flex items-center justify-center w-full h-full border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-slate-400">
                  No array data available
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
