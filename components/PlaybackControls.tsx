"use client";

import React, { useEffect } from 'react';
import { useLessonStore } from '@/store/lessonStore';

export const PlaybackControls: React.FC = () => {
  const { 
    currentFrame, 
    maxFrames, 
    isPlaying, 
    playbackSpeed, 
    play, 
    pause, 
    stepForward, 
    stepBackward, 
    setFrame,
    setSpeed 
  } = useLessonStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentFrame < maxFrames) {
      interval = setInterval(() => {
        stepForward();
      }, playbackSpeed);
    } else if (isPlaying && currentFrame >= maxFrames) {
      pause();
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentFrame, maxFrames, playbackSpeed, stepForward, pause]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm mt-6">
      {/* Playback Buttons */}
      <div className="flex items-center gap-2">
        <button 
          onClick={stepBackward} 
          disabled={currentFrame === 0}
          className="p-2 rounded-lg text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
        </button>
        <button 
          onClick={isPlaying ? pause : play} 
          className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          {isPlaying ? (
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          ) : currentFrame >= maxFrames ? (
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
          ) : (
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          )}
        </button>
        <button 
          onClick={stepForward} 
          disabled={currentFrame === maxFrames}
          className="p-2 rounded-lg text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
        </button>
      </div>

      {/* Scrubber */}
      <div className="flex-1 flex items-center gap-3 w-full">
        <span className="text-xs font-mono text-slate-500 min-w-12">Step {currentFrame}</span>
        <input 
          type="range" 
          min={0} 
          max={maxFrames} 
          value={currentFrame} 
          onChange={(e) => setFrame(parseInt(e.target.value))}
          className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="text-xs font-mono text-slate-500 min-w-12">Max {maxFrames}</span>
      </div>

      {/* Speed Control */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Speed:</span>
        <select 
          value={playbackSpeed} 
          onChange={(e) => setSpeed(parseInt(e.target.value))}
          className="text-sm text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border-none rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={2000}>0.5x (Slow)</option>
          <option value={1000}>1.0x (Normal)</option>
          <option value={500}>2.0x (Fast)</option>
        </select>
      </div>
    </div>
  );
};
