import { TreeParams } from '@/lib/binomial';

export type PhaseKind = 'static-slides' | 'tree-reveal' | 'derivation-steps' | 'parity-check' | 'hedge-rebalance-animation' | 'convergence-sweep' | 'calibration-form' | 'path-explorer' | 'monte-carlo' | 'placeholder' | 'scatter-plot' | 'correlation-heatmap' | 'pca-scree' | 'mc-histogram' | 'residual-plot' | 'robust-regression' | 'penalty-path' | 'loess-plot' | 'distribution-curve' | 'qq-plot' | 'copula-plot' | 'rank-correlation' | 'correlogram' | 'stochastic-path' | 'arima-signature';

export interface LessonPhase {
  id: string;
  title: string;
  description?: string;
  kind: PhaseKind;
  stepTexts?: string[];
  formulas?: (string | string[])[];
  codeSnippet?: string;
  isAmerican?: boolean;
  reveals?: 'stock_tree' | 'option_tree' | 'delta_tree';
  direction?: 'forward' | 'backward';
  showParamControls?: boolean;
  showAllInstantly?: boolean;
  visibleParams?: string[];
  optionType?: 'call' | 'put';
  overrideParams?: Partial<TreeParams>;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  defaultParams: TreeParams;
  phases: LessonPhase[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
    description: string;
  }[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: CourseModule[];
}
