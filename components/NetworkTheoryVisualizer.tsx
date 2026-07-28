"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface NetworkTheoryVisualizerProps {
  currentFrame: number;
}

export const NetworkTheoryVisualizer: React.FC<NetworkTheoryVisualizerProps> = ({ currentFrame }) => {
  const width = 800;
  const height = 500;

  // Nodes (Banks/Firms)
  const nodes = [
    { id: 'A', label: 'Bank A (Core)', x: 400, y: 250, r: 40 },
    { id: 'B', label: 'Bank B', x: 250, y: 150, r: 30 },
    { id: 'C', label: 'Bank C', x: 550, y: 150, r: 30 },
    { id: 'D', label: 'Bank D', x: 200, y: 350, r: 25 },
    { id: 'E', label: 'Bank E', x: 600, y: 350, r: 25 },
    { id: 'F', label: 'Firm F', x: 100, y: 200, r: 20 },
    { id: 'G', label: 'Firm G', x: 700, y: 200, r: 20 },
  ];

  // Directed edges (Borrower -> Lender, meaning exposure/risk flows Lender -> Borrower)
  // Let's say A owes money to B and C. If A fails, B and C take losses.
  // We'll draw arrows representing "Risk Exposure" from A to B (A defaults, hurts B).
  const edges = [
    { source: 'A', target: 'B', weight: 4, label: 'Loans' },
    { source: 'A', target: 'C', weight: 4, label: 'Derivatives' },
    { source: 'B', target: 'D', weight: 2, label: 'Interbank' },
    { source: 'C', target: 'E', weight: 2, label: 'Interbank' },
    { source: 'B', target: 'F', weight: 1, label: 'Credit' },
    { source: 'C', target: 'G', weight: 1, label: 'Credit' },
    { source: 'D', target: 'E', weight: 1, label: 'Swaps' },
  ];

  // Contagion logic
  // Frame 0: All healthy
  // Frame 1: A is shocked
  // Frame 2: A defaults, B & C take hits
  // Frame 3: B & C default, D, E, F, G take hits
  const getNodeState = (id: string) => {
    if (currentFrame === 0) return 'healthy';
    if (currentFrame === 1 && id === 'A') return 'shocked';
    if (currentFrame >= 2 && id === 'A') return 'defaulted';
    if (currentFrame === 2 && (id === 'B' || id === 'C')) return 'shocked';
    if (currentFrame >= 3 && (id === 'B' || id === 'C')) return 'defaulted';
    if (currentFrame >= 3 && ['D', 'E', 'F', 'G'].includes(id)) return 'shocked';
    return 'healthy';
  };

  const getEdgeState = (source: string, target: string) => {
    if (currentFrame >= 2 && source === 'A') return 'active-shock';
    if (currentFrame >= 3 && (source === 'B' || source === 'C')) return 'active-shock';
    return 'normal';
  };

  const getNodeColor = (state: string) => {
    switch (state) {
      case 'healthy': return '#334155'; // slate-700
      case 'shocked': return '#f59e0b'; // amber-500
      case 'defaulted': return '#ef4444'; // red-500
      default: return '#334155';
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-xl p-4">
      <h3 className="text-xl font-bold text-slate-200 mb-2 tracking-wider">
        {currentFrame === 0 && "Financial Network (Interconnectedness)"}
        {currentFrame === 1 && "Exogenous Shock hits Core Bank"}
        {currentFrame === 2 && "First-Degree Contagion (Direct Counterparties)"}
        {currentFrame >= 3 && "Second-Degree Contagion (Systemic Risk)"}
      </h3>
      
      <div className="w-full max-w-3xl aspect-[16/10] relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          
          {/* Arrow marker definition */}
          <defs>
            <marker id="arrowhead-normal" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
            </marker>
            <marker id="arrowhead-shock" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((edge, idx) => {
            const s = nodes.find(n => n.id === edge.source)!;
            const t = nodes.find(n => n.id === edge.target)!;
            const state = getEdgeState(edge.source, edge.target);
            
            const isShock = state === 'active-shock';
            
            return (
              <g key={`edge-${idx}`}>
                <motion.line
                  x1={s.x}
                  y1={s.y}
                  x2={t.x}
                  y2={t.y}
                  stroke={isShock ? '#ef4444' : '#64748b'}
                  strokeWidth={edge.weight * 1.5}
                  markerEnd={`url(#arrowhead-${isShock ? 'shock' : 'normal'})`}
                  animate={{ 
                    stroke: isShock ? '#ef4444' : '#64748b',
                    strokeWidth: isShock ? edge.weight * 2.5 : edge.weight * 1.5
                  }}
                  transition={{ duration: 0.5 }}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((n, idx) => {
            const state = getNodeState(n.id);
            const fillColor = getNodeColor(state);
            
            return (
              <motion.g 
                key={n.id}
                animate={{
                  scale: state === 'shocked' ? [1, 1.1, 1] : 1
                }}
                transition={{
                  duration: 0.5,
                  repeat: state === 'shocked' ? Infinity : 0,
                  repeatType: "reverse"
                }}
              >
                <circle 
                  cx={n.x} 
                  cy={n.y} 
                  r={n.r} 
                  fill={fillColor} 
                  stroke={state === 'defaulted' ? '#991b1b' : '#1e293b'} 
                  strokeWidth={3} 
                  style={{ transition: 'fill 0.5s ease' }}
                />
                <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" fill="#f8fafc" fontSize="12" fontWeight="bold">
                  {n.id}
                </text>
                <text x={n.x} y={n.y + n.r + 15} textAnchor="middle" dominantBaseline="middle" fill="#cbd5e1" fontSize="12">
                  {n.label.replace(`Bank ${n.id}`, '').replace(`Firm ${n.id}`, '') || `Bank ${n.id}`}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 flex gap-6 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-700"></div> Healthy
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div> Distressed (Shocked)
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div> Defaulted
        </div>
      </div>
    </div>
  );
};
