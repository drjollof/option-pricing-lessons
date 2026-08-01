"use client";

import React, { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useLessonStore } from '@/store/lessonStore';

// Plotly needs to be dynamically imported because it relies on the window object
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface Copula3DVisualizerProps {
  currentFrame: number;
}

// Helper: Inverse Normal CDF (Acklam's approximation)
function inverseNormalCDF(p: number) {
  if (p <= 0) return -8;
  if (p >= 1) return 8;
  
  const a1 = -39.69683028665376;
  const a2 = 220.94609842452050;
  const a3 = -275.92851044696869;
  const a4 = 138.35775186726900;
  const a5 = -30.66479806614716;
  const a6 = 2.506628277459239;
  
  const b1 = -54.47609879822406;
  const b2 = 161.58583685804090;
  const b3 = -155.69897985988660;
  const b4 = 66.80131188771972;
  const b5 = -13.28068155288572;
  
  const c1 = -0.007784894002430293;
  const c2 = -0.3223964580411365;
  const c3 = -2.400758277161838;
  const c4 = -2.549732539343734;
  const c5 = 4.374664141464968;
  const c6 = 2.938163982698783;
  
  const d1 = 0.007784695709041462;
  const d2 = 0.3224671290700398;
  const d3 = 2.445134137142996;
  const d4 = 3.754408661907416;
  
  const p_low = 0.02425;
  const p_high = 1 - p_low;
  
  let x = 0;
  if (p < p_low) {
    const q = Math.sqrt(-2 * Math.log(p));
    x = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
        ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (p <= p_high) {
    const q = p - 0.5;
    const r = q * q;
    x = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
        (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
         ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
  return x;
}

export const Copula3DVisualizer: React.FC<Copula3DVisualizerProps> = ({ currentFrame }) => {
  const [mounted, setMounted] = useState(false);
  const storeParams = useLessonStore(state => state.params);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const data = useMemo(() => {
    const resolution = 40;
    const eps = 0.01;
    const uArr = [];
    const vArr = [];
    
    // Create grid for U and V (0.01 to 0.99)
    for (let i = 0; i <= resolution; i++) {
      uArr.push(eps + (1 - 2*eps) * (i / resolution));
      vArr.push(eps + (1 - 2*eps) * (i / resolution));
    }
    
    const zMatrix: number[][] = [];
    
    // Map params.r (-0.99 to 0.99) to rho and theta
    const rho = Math.max(-0.99, Math.min(0.99, storeParams.r !== undefined ? storeParams.r : 0.7));
    // Clayton theta is usually positive for positive dependence, mapping r to theta [0.1, 10]
    const theta = Math.max(0.1, (storeParams.r !== undefined ? storeParams.r + 1 : 0.8) * 5);
    
    for (let i = 0; i < uArr.length; i++) {
      const u = uArr[i];
      const zRow: number[] = [];
      for (let j = 0; j < vArr.length; j++) {
        const v = vArr[j];
        
        let density = 0;
        
        if (currentFrame === 0) {
          // Gaussian Copula Density
          const x = inverseNormalCDF(u);
          const y = inverseNormalCDF(v);
          const coeff = 1 / Math.sqrt(1 - rho*rho);
          const expTerm = Math.exp( - (rho*rho*(x*x + y*y) - 2*rho*x*y) / (2*(1 - rho*rho)) );
          density = coeff * expTerm;
        } else {
          // Clayton Copula Density -> Lower Tail Dependence
          const term1 = Math.pow(u, -theta) + Math.pow(v, -theta) - 1;
          
          if (term1 > 0) {
            density = (theta + 1) * Math.pow(u * v, -theta - 1) * Math.pow(term1, -2 - 1/theta);
          } else {
            density = 0;
          }
          // Cap density for visualization to avoid massive spikes breaking the scale
          density = Math.min(density, 15);
        }
        
        zRow.push(density);
      }
      zMatrix.push(zRow);
    }
    
    return {
      x: vArr, // Y-axis on the chart conceptually
      y: uArr, // X-axis on the chart conceptually
      z: zMatrix
    };
  }, [currentFrame, storeParams.r]);

  if (!mounted) return <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-slate-400">Loading 3D Visualizer...</div>;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-xl p-4 overflow-hidden relative">
      <h3 className="text-xl font-bold text-slate-200 mb-2 z-10 text-center">
        {currentFrame === 0 ? "Gaussian Copula (Symmetric PDF)" : "Clayton Copula (Lower-Tail PDF)"}
      </h3>
      <div className="text-slate-400 text-sm mb-2 z-10 max-w-lg text-center px-4">
        {currentFrame === 0 
          ? "Notice how the probability is perfectly symmetrical. Crashes and rallies are priced identically." 
          : "Notice the massive spike in the bottom corner (0,0). This mathematically prices in joint market crashes!"}
      </div>
      
      <div className="w-full flex-grow relative flex justify-center items-center">
        <Plot
          data={[
            {
              z: data.z,
              x: data.x,
              y: data.y,
              type: 'surface',
              colorscale: currentFrame === 0 ? 'Viridis' : 'Inferno',
              showscale: false
            }
          ]}
          layout={{
            autosize: true,
            margin: { l: 0, r: 0, b: 0, t: 0 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            scene: {
              xaxis: { title: 'Asset Y (Percentile V)', color: '#94a3b8', gridcolor: '#334155' },
              yaxis: { title: 'Asset X (Percentile U)', color: '#94a3b8', gridcolor: '#334155' },
              zaxis: { title: 'Probability Density', color: '#94a3b8', gridcolor: '#334155', range: [0, 15] },
              camera: {
                eye: { x: -1.5, y: -1.5, z: 0.5 }
              }
            }
          }}
          style={{ width: '100%', height: '100%', minHeight: '350px' }}
          config={{ responsive: true, displayModeBar: false }}
        />
      </div>
    </div>
  );
};
