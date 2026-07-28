"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface FactorAnalysisVisualizerProps {
  currentFrame: number;
}

export const FactorAnalysisVisualizer: React.FC<FactorAnalysisVisualizerProps> = ({ currentFrame }) => {
  const width = 800;
  const height = 400;

  // 5 Observed Variables (e.g. Stocks)
  const variables = [
    { id: 'v1', label: 'Tech Stock A', x: 100 },
    { id: 'v2', label: 'Tech Stock B', x: 250 },
    { id: 'v3', label: 'Bank Stock C', x: 400 },
    { id: 'v4', label: 'Bank Stock D', x: 550 },
    { id: 'v5', label: 'Energy Stock E', x: 700 },
  ];

  // 2 Latent Factors
  const factors = [
    { id: 'f1', label: 'Market Factor', x: 250 },
    { id: 'f2', label: 'Industry Factor', x: 550 },
  ];

  // Loadings (connections)
  const links = [
    { source: 'v1', target: 'f1', weight: 0.8 },
    { source: 'v1', target: 'f2', weight: 0.9 },
    { source: 'v2', target: 'f1', weight: 0.7 },
    { source: 'v2', target: 'f2', weight: 0.8 },
    
    { source: 'v3', target: 'f1', weight: 0.6 },
    { source: 'v3', target: 'f2', weight: -0.5 },
    { source: 'v4', target: 'f1', weight: 0.7 },
    { source: 'v4', target: 'f2', weight: -0.6 },
    
    { source: 'v5', target: 'f1', weight: 0.5 },
    { source: 'v5', target: 'f2', weight: 0.1 },
  ];

  // Animation staging based on currentFrame (0 to 3)
  const showVariables = currentFrame >= 0;
  const showFactors = currentFrame >= 1;
  const showLinks = currentFrame >= 2;
  const highlightIndustry = currentFrame >= 3;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-xl p-4">
      <h3 className="text-xl font-bold text-slate-200 mb-4 tracking-wider">
        {currentFrame === 0 && "Observed Variables"}
        {currentFrame === 1 && "Extracting Latent Factors"}
        {currentFrame === 2 && "Factor Loadings (Weights)"}
        {currentFrame >= 3 && "Industry Rotation Interpretation"}
      </h3>
      
      <div className="w-full max-w-3xl aspect-[2/1] relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Edges */}
          {showLinks && links.map((link, idx) => {
            const v = variables.find(v => v.id === link.source)!;
            const f = factors.find(f => f.id === link.target)!;
            
            // If highlighting industry, fade out market factor links
            const isHighlighted = highlightIndustry && link.target === 'f2';
            const isFaded = highlightIndustry && link.target === 'f1';
            
            const strokeColor = link.weight > 0 ? (isHighlighted ? '#10b981' : '#3b82f6') : '#ef4444';
            const strokeWidth = Math.abs(link.weight) * 5;
            
            return (
              <motion.line
                key={`link-${idx}`}
                x1={v.x}
                y1={280}
                x2={f.x}
                y2={120}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeOpacity={isFaded ? 0.1 : 0.6}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isFaded ? 0.1 : 0.6 }}
                transition={{ duration: 1, delay: idx * 0.1 }}
              />
            );
          })}

          {/* Factors */}
          {showFactors && factors.map((f, idx) => (
            <motion.g 
              key={f.id} 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              <circle cx={f.x} cy={100} r={40} fill="#1e293b" stroke="#8b5cf6" strokeWidth={3} />
              <text x={f.x} y={95} textAnchor="middle" dominantBaseline="middle" fill="#e2e8f0" fontSize="14" fontWeight="bold">
                {f.label.split(' ')[0]}
              </text>
              <text x={f.x} y={111} textAnchor="middle" dominantBaseline="middle" fill="#e2e8f0" fontSize="14" fontWeight="bold">
                {f.label.split(' ')[1]}
              </text>
            </motion.g>
          ))}

          {/* Variables */}
          {showVariables && variables.map((v, idx) => (
            <motion.g 
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <rect x={v.x - 50} y={280} width={100} height={40} rx={8} fill="#334155" stroke="#475569" strokeWidth={2} />
              <text x={v.x} y={300} textAnchor="middle" dominantBaseline="middle" fill="#cbd5e1" fontSize="12">
                {v.label}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
      
      {showLinks && (
        <div className="mt-4 flex gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-500"></div> Positive Loading
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-red-500"></div> Negative Loading
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-emerald-500"></div> Highlighted Factor
          </div>
        </div>
      )}
    </div>
  );
};
