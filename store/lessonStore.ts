import { create } from 'zustand';
import { TreeParams } from '@/lib/binomial';

export const DEFAULT_PARAMS: TreeParams = { S0: 100, K: 100, u: 1.15, d: 0.85, r: 0.05, T: 1, N: 3, sigma: 0.2 };

interface LessonState {
  currentFrame: number;
  maxFrames: number;
  isPlaying: boolean;
  playbackSpeed: number;
  params: TreeParams;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  setFrame: (frame: number) => void;
  setSpeed: (speed: number) => void;
  setMaxFrames: (max: number) => void;
  updateParams: (newParams: Partial<TreeParams>) => void;
}

export const useLessonStore = create<LessonState>((set) => ({
  currentFrame: 0,
  maxFrames: 0,
  isPlaying: false,
  playbackSpeed: 2000,
  params: DEFAULT_PARAMS,
  play: () => set((state) => {
    if (state.currentFrame >= state.maxFrames) {
      return { isPlaying: true, currentFrame: 0 };
    }
    return { isPlaying: true };
  }),
  pause: () => set({ isPlaying: false }),
  stepForward: () => set((state) => ({ 
    currentFrame: Math.min(state.currentFrame + 1, state.maxFrames) 
  })),
  stepBackward: () => set((state) => ({ 
    currentFrame: Math.max(state.currentFrame - 1, 0) 
  })),
  setFrame: (frame) => set({ currentFrame: frame }),
  setSpeed: (speed) => set({ playbackSpeed: speed }),
  setMaxFrames: (max) => set({ maxFrames: max }),
  updateParams: (newParams) => set((state) => ({
    params: { ...state.params, ...newParams },
    isPlaying: false
  })),
}));
