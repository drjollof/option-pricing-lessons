"use client";

import React, { useMemo } from 'react';
import { LessonPhase } from '@/content/types';
import { TreeParams } from '@/lib/binomial';

// Import all visualizers
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
import { ConvergenceChartPane } from './ConvergenceChartPane';
import { PathExplorerPane } from './PathExplorerPane';
import { MonteCarloPane } from './MonteCarloPane';

interface StaticPhaseVisualizerProps {
  phase: LessonPhase;
  defaultParams: TreeParams;
}

export const StaticPhaseVisualizer: React.FC<StaticPhaseVisualizerProps> = ({ phase, defaultParams }) => {
  // Merge default params with any phase-specific overrides
  const staticParams = useMemo(() => {
    return { ...defaultParams, ...(phase.overrideParams || {}) };
  }, [defaultParams, phase.overrideParams]);

  const renderVisualizer = () => {
    switch (phase.kind) {
      case 'scatter-plot':
        return (
          <ScatterPlotVisualizer 
            showRegressionLine={phase.id.includes('regression') || phase.id.includes('outlier')} 
            highlightOutliers={phase.id.includes('outlier')} 
            staticParams={staticParams}
          />
        );
      case 'correlation-heatmap':
        return <CorrelationHeatmapVisualizer staticParams={staticParams} />;
      case 'pca-scree':
        return <PCAVisualizer />;
      case 'mc-histogram':
        return <MonteCarloHistogramVisualizer />;
      case 'residual-plot':
        return <ResidualPlotVisualizer />;
      case 'robust-regression':
        return <RobustRegressionVisualizer />;
      case 'penalty-path':
        return <PenaltyPathVisualizer />;
      case 'loess-plot':
        return <LoessVisualizer />;
      case 'distribution-curve':
        return <DistributionVisualizer currentFrame={999} params={staticParams as any} />;
      case 'qq-plot':
        return <QQPlotVisualizer currentFrame={999} params={staticParams as any} />;
      case 'rank-correlation':
        return <RankCorrelationVisualizer currentFrame={999} params={staticParams as any} />;
      case 'copula-plot':
        return <CopulaVisualizer currentFrame={999} params={staticParams as any} />;
      case 'copula-3d':
        return <Copula3DVisualizer currentFrame={999} />;
      case 'correlogram':
        return <CorrelogramVisualizer currentFrame={999} params={staticParams as any} />;
      case 'stochastic-path':
        return <StochasticPathVisualizer currentFrame={999} params={staticParams as any} />;
      case 'arima-signature':
        return <ArimaSignatureVisualizer currentFrame={999} />;
      case 'factor-analysis':
        return <FactorAnalysisVisualizer currentFrame={999} />;
      case 'network-theory':
        return <NetworkTheoryVisualizer currentFrame={999} />;
      case 'granger-causality':
        return <GrangerCausalityVisualizer currentFrame={999} />;
      case 'machine-learning':
        return <MachineLearningVisualizer currentFrame={999} params={phase.overrideParams as any} />;
      case 'convergence-sweep':
        return <ConvergenceChartPane />;
      case 'path-explorer':
        return <PathExplorerPane />;
      case 'monte-carlo':
        return <MonteCarloPane />;
      default:
        // Tree visualizers and static-slides don't easily map to a single static pane yet,
        // so we return null or a placeholder for unsupported textbook charts.
        return null;
    }
  };

  const visualizerContent = renderVisualizer();
  
  if (!visualizerContent) return null;

  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
      <div className="bg-slate-100 dark:bg-slate-800/50 px-4 py-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 tracking-wider uppercase flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
        Interactive Chart (Static Snapshot)
      </div>
      <div className="h-[400px] w-full bg-white dark:bg-slate-900">
        {visualizerContent}
      </div>
    </div>
  );
};
