import { TreeParams } from '@/lib/binomial';

export type PhaseKind = 'static-slides' | 'tree-reveal' | 'derivation-steps' | 'parity-check' | 'hedge-rebalance-animation' | 'convergence-sweep' | 'calibration-form';

export interface LessonPhase {
  id: string;
  title: string;
  description?: string;
  kind: PhaseKind;
  stepTexts?: string[];
  formulas?: (string | string[])[];
  codeSnippet?: string;
  reveals?: 'stock_tree' | 'option_tree' | 'delta_tree';
  direction?: 'forward' | 'backward';
  showParamControls?: boolean;
  optionType?: 'call' | 'put';
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  defaultParams: TreeParams;
  phases: LessonPhase[];
}
