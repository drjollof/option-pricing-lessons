"use client";

import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { useLessonStore } from '@/store/lessonStore';

interface MachineLearningVisualizerProps {
  currentFrame: number;
  params?: {
    mode?: 'kmeans' | 'lda';
  };
}

export const MachineLearningVisualizer: React.FC<MachineLearningVisualizerProps> = ({ currentFrame, params }) => {
  const storeParams = useLessonStore(state => state.params);
  const mode = params?.mode || 'kmeans';

  // --- K-MEANS DATA ---
  const kmeansData = useMemo(() => {
    // Two natural clusters
    const pts = [];
    const numPts = Math.min(100, Math.max(10, storeParams.N || 40));
    const noise = storeParams.sigma !== undefined ? storeParams.sigma * 40 : 20;

    for (let i = 0; i < numPts; i++) {
      pts.push({ id: i, x: Math.random() * noise + 10, y: Math.random() * noise + 10, cluster: 0 });
      pts.push({ id: i + numPts, x: Math.random() * noise + (100 - noise), y: Math.random() * noise + (100 - noise), cluster: 1 });
    }
    
    // Initial bad centroids
    const c1_init = { x: 20, y: 80 };
    const c2_init = { x: 80, y: 20 };
    
    // Assign to nearest initial centroid
    const assigned1 = pts.map(p => {
      const d1 = Math.pow(p.x - c1_init.x, 2) + Math.pow(p.y - c1_init.y, 2);
      const d2 = Math.pow(p.x - c2_init.x, 2) + Math.pow(p.y - c2_init.y, 2);
      return { ...p, assigned: d1 < d2 ? 1 : 2 };
    });
    
    // Final centroids (calculated from true clusters approx)
    const c1_final = { x: 20, y: 20 };
    const c2_final = { x: 70, y: 70 };
    
    // Assign to nearest final centroid
    const assigned2 = pts.map(p => {
      const d1 = Math.pow(p.x - c1_final.x, 2) + Math.pow(p.y - c1_final.y, 2);
      const d2 = Math.pow(p.x - c2_final.x, 2) + Math.pow(p.y - c2_final.y, 2);
      return { ...p, assigned: d1 < d2 ? 1 : 2 };
    });

    return { pts, c1_init, c2_init, assigned1, c1_final, c2_final, assigned2 };
  }, [storeParams.N, storeParams.sigma]);

  // --- LDA DATA ---
  const ldaData = useMemo(() => {
    const pts = [];
    // Two classes, highly overlapping on X, but separable if we project diagonally
    for (let i = 0; i < 30; i++) {
      // Class A
      pts.push({ id: `A${i}`, class: 'A', x: Math.random() * 40 + 20, y: Math.random() * 20 + 60 });
      // Class B
      pts.push({ id: `B${i}`, class: 'B', x: Math.random() * 40 + 40, y: Math.random() * 20 + 20 });
    }
    
    // LDA vector (rough approximation of the optimal projection line)
    // Line: y = x (slope 1)
    const projectedPts = pts.map(p => {
      // projection of (x,y) onto y=x is ((x+y)/2, (x+y)/2)
      const proj = (p.x + p.y) / 2;
      return { ...p, projX: proj, projY: proj };
    });
    
    return { pts: projectedPts };
  }, []);

  if (mode === 'kmeans') {
    let plotData = kmeansData.pts.map(p => ({ ...p, color: '#94a3b8' })); // gray
    let centroids: { x: number; y: number; color: string }[] = [];
    
    if (currentFrame === 1) {
      centroids = [
        { x: kmeansData.c1_init.x, y: kmeansData.c1_init.y, color: '#ef4444' },
        { x: kmeansData.c2_init.x, y: kmeansData.c2_init.y, color: '#3b82f6' }
      ];
    }
    
    if (currentFrame === 2) {
      centroids = [
        { x: kmeansData.c1_init.x, y: kmeansData.c1_init.y, color: '#ef4444' },
        { x: kmeansData.c2_init.x, y: kmeansData.c2_init.y, color: '#3b82f6' }
      ];
      plotData = kmeansData.assigned1.map(p => ({ 
        ...p, 
        color: p.assigned === 1 ? '#ef4444' : '#3b82f6' 
      }));
    }
    
    if (currentFrame >= 3) {
      centroids = [
        { x: kmeansData.c1_final.x, y: kmeansData.c1_final.y, color: '#ef4444' },
        { x: kmeansData.c2_final.x, y: kmeansData.c2_final.y, color: '#3b82f6' }
      ];
      plotData = kmeansData.assigned2.map(p => ({ 
        ...p, 
        color: p.assigned === 1 ? '#ef4444' : '#3b82f6' 
      }));
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-xl p-4">
        <h3 className="text-xl font-bold text-slate-200 mb-2 tracking-wider">
          {currentFrame === 0 && "1. Unlabeled Data"}
          {currentFrame === 1 && "2. Initialize Random Centroids"}
          {currentFrame === 2 && "3. Assign Points to Nearest Centroid"}
          {currentFrame >= 3 && "4. Move Centroids to Cluster Mean"}
        </h3>
        
        <div className="w-full flex-1 min-h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" dataKey="x" domain={[0, 100]} stroke="#94a3b8" />
              <YAxis type="number" dataKey="y" domain={[0, 100]} stroke="#94a3b8" />
              
              <Scatter data={plotData} isAnimationActive={false}>
                {plotData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
              
              {centroids.length > 0 && (
                <Scatter data={centroids} shape="cross" isAnimationActive={true}>
                  {centroids.map((entry, index) => (
                    <Cell key={`cent-${index}`} fill={entry.color} />
                  ))}
                </Scatter>
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // --- LDA MODE ---
  let plotData = ldaData.pts.map(p => ({
    ...p,
    plotX: currentFrame >= 2 ? p.projX : p.x,
    plotY: currentFrame >= 2 ? p.projY : p.y,
  }));

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-xl p-4">
      <h3 className="text-xl font-bold text-slate-200 mb-2 tracking-wider">
        {currentFrame === 0 && "Two overlapping classes in 2D space"}
        {currentFrame === 1 && "Finding the Optimal 1D Projection Line (LDA)"}
        {currentFrame >= 2 && "Projecting data to maximize class separation"}
      </h3>
      
      <div className="w-full flex-1 min-h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" dataKey="plotX" domain={[0, 100]} stroke="#94a3b8" />
            <YAxis type="number" dataKey="plotY" domain={[0, 100]} stroke="#94a3b8" />
            
            {currentFrame >= 1 && (
              <ReferenceLine segment={[{x: 0, y: 0}, {x: 100, y: 100}]} stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
            )}
            
            <Scatter data={plotData} isAnimationActive={true} animationDuration={1000}>
              {plotData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.class === 'A' ? '#3b82f6' : '#ef4444'} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
