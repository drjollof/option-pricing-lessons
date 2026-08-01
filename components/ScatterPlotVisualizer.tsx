"use client";
import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useLessonStore } from '@/store/lessonStore';
import { TreeParams } from '@/lib/binomial';

interface ScatterPlotVisualizerProps {
  showRegressionLine?: boolean;
  highlightOutliers?: boolean;
  staticParams?: Partial<TreeParams>;
}

// Custom tooltip to format the values nicely for beginners
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
        <p className="text-slate-700 dark:text-slate-300 font-semibold mb-1">Data Point</p>
        <p className="text-blue-600 dark:text-blue-400">X (Market): {payload[0].value.toFixed(2)}</p>
        <p className="text-emerald-600 dark:text-emerald-400">Y (Stock): {payload[1].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export const ScatterPlotVisualizer: React.FC<ScatterPlotVisualizerProps> = ({ showRegressionLine = false, highlightOutliers = false, staticParams }) => {
  const storeParams = useLessonStore(state => state.params);
  // Prefer staticParams if provided (e.g. Textbook mode), otherwise fallback to the interactive store
  const params = staticParams || storeParams;

  // Generate synthetic data based on params for the lesson
  const data = useMemo(() => {
    const N = params.N && params.N > 10 ? params.N : 50;
    const noiseLevel = params.sigma || 0.2;
    const trueSlope = params.u !== undefined ? params.u : 1.5;
    const trueIntercept = params.S0 !== undefined ? params.S0 : 10;
    
    let generatedData = [];
    for (let i = 0; i < N; i++) {
      const x = (Math.sin(i * 123.456) + 1) * 50; 
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      
      const noise = z0 * noiseLevel * 50;
      let y = trueSlope * x + trueIntercept + noise;
      
      let isOutlier = false;
      if (highlightOutliers && i === Math.floor(N / 2)) {
        y += 400; // Massive outlier
        isOutlier = true;
      }
      
      generatedData.push({ x, y, isOutlier });
    }
    return generatedData;
  }, [params.N, params.sigma, params.u, params.S0, highlightOutliers]);

  // Calculate regression line OLS & R-Squared
  const { slope, intercept, rSquared, cleanSlope, cleanIntercept } = useMemo(() => {
    // 1. Calculate OLS for ALL data (skewed by outlier)
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    data.forEach(d => {
      sumX += d.x;
      sumY += d.y;
      sumXY += d.x * d.y;
      sumX2 += d.x * d.x;
    });
    
    const meanY = sumY / n;
    const calculatedSlope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const calculatedIntercept = meanY - calculatedSlope * (sumX / n);
    
    let ssTot = 0;
    let ssRes = 0;
    data.forEach(d => {
      const yPred = calculatedSlope * d.x + calculatedIntercept;
      ssTot += Math.pow(d.y - meanY, 2);
      ssRes += Math.pow(d.y - yPred, 2);
    });
    const r2 = 1 - (ssRes / ssTot);

    // 2. Calculate OLS EXCLUDING the outlier to show the "pull"
    let cleanSlopeVal = calculatedSlope;
    let cleanInterceptVal = calculatedIntercept;
    
    if (highlightOutliers) {
      const cleanData = data.filter(d => !d.isOutlier);
      const cn = cleanData.length;
      let cSumX = 0, cSumY = 0, cSumXY = 0, cSumX2 = 0;
      cleanData.forEach(d => {
        cSumX += d.x;
        cSumY += d.y;
        cSumXY += d.x * d.y;
        cSumX2 += d.x * d.x;
      });
      cleanSlopeVal = (cn * cSumXY - cSumX * cSumY) / (cn * cSumX2 - cSumX * cSumX);
      cleanInterceptVal = (cSumY / cn) - cleanSlopeVal * (cSumX / cn);
    }

    return { 
      slope: calculatedSlope, 
      intercept: calculatedIntercept, 
      rSquared: r2,
      cleanSlope: cleanSlopeVal,
      cleanIntercept: cleanInterceptVal
    };
  }, [data, highlightOutliers]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 relative">
      
      {/* Visual Overlay of the Equation */}
      {showRegressionLine && (
        <div className="absolute top-8 left-8 bg-white/90 dark:bg-slate-800/90 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 z-10 backdrop-blur-sm">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">
            OLS Model {highlightOutliers && <span className="text-red-500 text-xs ml-2">(Skewed)</span>}
          </h4>
          <div className="flex flex-col gap-1 text-sm font-mono text-slate-600 dark:text-slate-300">
            <p>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ŷ</span> = 
              <span className="text-blue-600 dark:text-blue-400 ml-1">{intercept.toFixed(2)}</span> + 
              <span className="text-purple-600 dark:text-purple-400 ml-1">{slope.toFixed(2)}X</span>
            </p>
            <p className="mt-1 flex items-center justify-between">
              <span>R² =</span>
              <span className={`ml-2 px-2 py-0.5 rounded-md font-bold ${
                rSquared > 0.8 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                rSquared > 0.5 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {(rSquared * 100).toFixed(1)}%
              </span>
            </p>
          </div>
          
          {highlightOutliers && (
             <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-1 text-sm font-mono text-slate-400">
                <span className="text-xs font-sans text-slate-500 mb-1">Original Fit (Dashed):</span>
                <p>
                  Ŷ = {cleanIntercept.toFixed(2)} + {cleanSlope.toFixed(2)}X
                </p>
             </div>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Independent (X)" 
            tick={{ fill: '#64748b' }} 
            axisLine={{ stroke: '#cbd5e1' }} 
            tickLine={{ stroke: '#cbd5e1' }} 
            label={{ value: "Exogenous Variable (X)", position: "bottom", fill: "#64748b", offset: -10 }}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Dependent (Y)" 
            tick={{ fill: '#64748b' }} 
            axisLine={{ stroke: '#cbd5e1' }} 
            tickLine={{ stroke: '#cbd5e1' }} 
            label={{ value: "Endogenous Variable (Y)", angle: -90, position: "left", fill: "#64748b" }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          
          {/* Main Data points */}
          <Scatter name="Data" data={data.filter(d => !d.isOutlier)} fill="#3b82f6" />
          
          {/* Outliers */}
          {highlightOutliers && (
            <Scatter name="Outliers" data={data.filter(d => d.isOutlier)} fill="#ef4444" />
          )}

          {/* Clean Regression Line (if outliers highlighted) */}
          {showRegressionLine && highlightOutliers && (
            <ReferenceLine 
              segment={[{ x: 0, y: cleanIntercept }, { x: 100, y: cleanSlope * 100 + cleanIntercept }]} 
              stroke="#94a3b8" 
              strokeDasharray="5 5"
              strokeWidth={2} 
              ifOverflow="hidden"
            />
          )}

          {/* Main Regression Line */}
          {showRegressionLine && (
            <ReferenceLine 
              segment={[{ x: 0, y: intercept }, { x: 100, y: slope * 100 + intercept }]} 
              stroke={highlightOutliers ? "#ef4444" : "#10b981"} 
              strokeWidth={3} 
              ifOverflow="hidden"
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
