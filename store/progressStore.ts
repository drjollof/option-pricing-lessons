import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completedLessons: string[];
  markComplete: (lessonId: string) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedLessons: [],
      markComplete: (id) => set((state) => ({
        completedLessons: state.completedLessons.includes(id) 
          ? state.completedLessons 
          : [...state.completedLessons, id]
      })),
    }),
    { name: 'lesson-progress' }
  )
);
