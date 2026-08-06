"use client";

import React, { useMemo, useEffect } from 'react';
import { LatticePane } from './LatticePane';
import { ArrayGridPane } from './ArrayGridPane';
import { MathConsolePane } from './MathConsolePane';
import { PlaybackControls } from './PlaybackControls';
import { buildStockTree, priceEuropeanOption, priceAmericanOption, buildDeltaTree } from '@/lib/binomial';
import { buildTrinomialStockTree, priceTrinomialOption } from '@/lib/trinomial';
import { useLessonStore } from '@/store/lessonStore';
import { LessonPhase } from '@/content/types';

import { ConvergenceChartPane } from './ConvergenceChartPane';
import { PathExplorerPane } from './PathExplorerPane';
import { MonteCarloPane } from './MonteCarloPane';
import { BSMGreeksVisualizer } from './BSMGreeksVisualizer';
import { MCConvergenceVisualizer } from './MCConvergenceVisualizer';
import { ScatterPlotVisualizer } from './ScatterPlotVisualizer';
import { CorrelationHeatmapVisualizer } from './CorrelationHeatmapVisualizer';
import { PCAVisualizer } from './PCAVisualizer';
import { MonteCarloHistogramVisualizer } from './MonteCarloHistogramVisualizer';
import { ResidualPlotVisualizer } from './ResidualPlotVisualizer';
import { RobustRegressionVisualizer } from './RobustRegressionVisualizer';
import { PenaltyPathVisualizer } from './PenaltyPathVisualizer';
import { LoessVisualizer } from './LoessVisualizer';
import { DistributionVisualizer } from './DistributionVisualizer';
import { QQPlotVisualizer } from './QQPlotVisualizer';
import { RankCorrelationVisualizer } from './RankCorrelationVisualizer';
import { CopulaVisualizer } from './CopulaVisualizer';
import { Copula3DVisualizer } from './Copula3DVisualizer';
import { CorrelogramVisualizer } from './CorrelogramVisualizer';
import { StochasticPathVisualizer } from './StochasticPathVisualizer';
import { ArimaSignatureVisualizer } from './ArimaSignatureVisualizer';
import { FactorAnalysisVisualizer } from './FactorAnalysisVisualizer';
import { NetworkTheoryVisualizer } from './NetworkTheoryVisualizer';
import { GrangerCausalityVisualizer } from './GrangerCausalityVisualizer';
import { MachineLearningVisualizer } from './MachineLearningVisualizer';

interface ThreePanePlayerProps {
  phase: LessonPhase;
}

export const ThreePanePlayer: React.FC<ThreePanePlayerProps> = ({ phase }) => {
  const { params, setMaxFrames, setFrame, pause, maxFrames, play, currentFrame } = useLessonStore();
  
  const stockTree = useMemo(() => {
    return phase.treeType === 'trinomial' 
      ? buildTrinomialStockTree(params) 
      : buildStockTree(params);
  }, [params, phase.treeType]);
  
  const optionResult = useMemo(() => {
    if (phase.treeType === 'trinomial') {
      return priceTrinomialOption(params, phase.optionType || 'call', phase.isAmerican);
    }
    return phase.isAmerican 
      ? priceAmericanOption(params, phase.optionType || 'call')
      : priceEuropeanOption(params, phase.optionType || 'call');
  }, [params, phase.optionType, phase.isAmerican, phase.treeType]);
  
  const optionTree = optionResult.optionTree;
  const exerciseTree = ('exerciseTree' in optionResult ? (optionResult as any).exerciseTree : undefined) as boolean[][] | undefined;
  
  const deltaTree = useMemo(() => {
    if (phase.treeType === 'trinomial') return []; // Trinomial delta not implemented yet
    return buildDeltaTree(params, optionTree, stockTree);
  }, [params, optionTree, stockTree, phase.treeType]);

  useEffect(() => {
    pause(); 

      const isStaticVisualizer = [
      'scatter-plot', 'correlation-heatmap', 'pca-scree',
      'residual-plot', 'robust-regression', 'penalty-path', 'loess-plot', 
      'qq-plot', 'copula-plot', 'copula-3d', 'rank-correlation', 
      'correlogram', 'arima-signature', 'static-slides', 'derivation-steps'
    ].includes(phase.kind);

    if (isStaticVisualizer || phase.showAllInstantly) {
      setMaxFrames(0);
      setFrame((phase.stepTexts?.length || 1) - 1);
      return;
    }

    const isStepTextAnimatedVisualizer = [
      'factor-analysis', 'network-theory', 'granger-causality', 'machine-learning',
      'stochastic-path', 'distribution-curve', 'mc-histogram'
    ].includes(phase.kind);

    if (isStepTextAnimatedVisualizer) {
      const maxF = Math.max(0, (phase.stepTexts?.length || 1) - 1);
      setMaxFrames(maxF);
      setFrame(0);
      if (maxF > 0) {
        setTimeout(() => play(), 100);
      }
      return;
    }

    const maxF = phase.reveals === 'delta_tree' ? params.N - 1 : params.N;
    setMaxFrames(maxF);
    
    // In sandbox, reveal the full tree immediately so sliders respond visually.
    // In lesson mode (id !== 'sandbox-phase'), animate step by step.
    if (phase.id === 'sandbox-phase') {
      setFrame(maxF);
    } else {
      setFrame(0);
      if (maxF > 0) {
        setTimeout(() => play(), 100);
      }
    }
    
  }, [params.N, params.u, params.d, params.S0, params.K, params.r, params.T, phase, setMaxFrames, setFrame, pause, play]);

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
        {phase.kind === 'derivation-steps' || phase.kind === 'static-slides' ? (
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

            {/* Main Visualizer Pane */}
            {phase.kind === 'scatter-plot' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <ScatterPlotVisualizer 
                  showRegressionLine={phase.id.includes('regression')} 
                  highlightOutliers={phase.id.includes('outlier')} 
                />
              </div>
            ) : phase.kind === 'mc-convergence' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <MCConvergenceVisualizer optionType={phase.optionType as 'call' | 'put' || 'call'} />
              </div>
            ) : phase.kind === 'bsm-greeks' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <BSMGreeksVisualizer optionType={phase.optionType as 'call' | 'put' || 'call'} />
              </div>
            ) : phase.kind === 'correlation-heatmap' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <CorrelationHeatmapVisualizer />
              </div>
            ) : phase.kind === 'pca-scree' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <PCAVisualizer />
              </div>
            ) : phase.kind === 'mc-histogram' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <MonteCarloHistogramVisualizer currentFrame={currentFrame} />
              </div>
            ) : phase.kind === 'residual-plot' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <ResidualPlotVisualizer />
              </div>
            ) : phase.kind === 'robust-regression' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <RobustRegressionVisualizer />
              </div>
            ) : phase.kind === 'penalty-path' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <PenaltyPathVisualizer />
              </div>
            ) : phase.kind === 'loess-plot' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <LoessVisualizer />
              </div>
            ) : phase.kind === 'distribution-curve' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <DistributionVisualizer currentFrame={currentFrame} params={params} />
              </div>
            ) : phase.kind === 'qq-plot' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <QQPlotVisualizer currentFrame={currentFrame} params={params} />
              </div>
            ) : phase.kind === 'copula-plot' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <CopulaVisualizer currentFrame={currentFrame} params={params} />
              </div>
            ) : phase.kind === 'copula-3d' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <Copula3DVisualizer currentFrame={currentFrame} />
              </div>
            ) : phase.kind === 'rank-correlation' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <RankCorrelationVisualizer currentFrame={currentFrame} params={params} />
              </div>
            ) : phase.kind === 'correlogram' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <CorrelogramVisualizer currentFrame={currentFrame} params={params} />
              </div>
            ) : phase.kind === 'stochastic-path' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <StochasticPathVisualizer currentFrame={currentFrame} params={params} />
              </div>
            ) : phase.kind === 'arima-signature' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <ArimaSignatureVisualizer currentFrame={currentFrame} />
              </div>
            ) : phase.kind === 'factor-analysis' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <FactorAnalysisVisualizer currentFrame={currentFrame} />
              </div>
            ) : phase.kind === 'network-theory' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <NetworkTheoryVisualizer currentFrame={currentFrame} />
              </div>
            ) : phase.kind === 'granger-causality' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <GrangerCausalityVisualizer currentFrame={currentFrame} />
              </div>
            ) : phase.kind === 'machine-learning' ? (
              <div className="lg:col-span-7 h-[400px] lg:h-[500px] order-3 lg:order-2">
                <MachineLearningVisualizer currentFrame={currentFrame} params={phase.overrideParams as any} />
              </div>
            ) : (
              <>
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
          </>
        )}
      </div>
    </div>
  );
};
