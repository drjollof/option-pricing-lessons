"use client";

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

interface GrangerCausalityVisualizerProps {
  currentFrame: number;
}

export const GrangerCausalityVisualizer: React.FC<GrangerCausalityVisualizerProps> = ({ currentFrame }) => {
  // Generate 50 points of data
  // X = leading indicator, Y = lagging indicator
  // Y(t) = 0.5 * Y(t-1) + 0.8 * X(t-2) + error
  
  const data = useMemo(() => {
    const pts = [];
    let x_prev1 = 0;
    let x_prev2 = 0;
    let y_prev = 0;
    
    for (let t = 0; t < 50; t++) {
      // X is an AR(1) process
      const x_t = 0.7 * x_prev1 + (Math.random() * 2 - 1);
      
      // Y depends on its own lag and X's 2nd lag
      const err = (Math.random() * 0.5 - 0.25);
      const y_t = 0.5 * y_prev + 0.8 * x_prev2 + err;
      
      // Restricted forecast (uses only Y's history, oblivious to X)
      // If it doesn't know X, it just guesses Y based on AR(1). 
      // It will miss the variation caused by X.
      const forecast_restricted = 0.5 * y_prev;
      
      // Unrestricted forecast (uses Y's history AND X's history)
      const forecast_unrestricted = 0.5 * y_prev + 0.8 * x_prev2;
      
      pts.push({
        t,
        x: x_t,
        y: y_t,
        f_res: forecast_restricted,
        f_unres: forecast_unrestricted,
        res_err: Math.abs(y_t - forecast_restricted),
        unres_err: Math.abs(y_t - forecast_unrestricted),
      });
      
      x_prev2 = x_prev1;
      x_prev1 = x_t;
      y_prev = y_t;
    }
    return pts;
  }, []);

  const showY = currentFrame >= 0;
  const showFRes = currentFrame >= 0;
  const showX = currentFrame >= 1;
  const showFUnres = currentFrame >= 2;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-xl p-4">
      <h3 className="text-xl font-bold text-slate-200 mb-2 tracking-wider">
        {currentFrame === 0 && "Restricted Model (Predicting Y using only past Y)"}
        {currentFrame === 1 && "Introducing X (A potential leading indicator)"}
        {currentFrame >= 2 && "Unrestricted Model (Predicting Y using past Y and past X)"}
      </h3>
      
      <div className="w-full flex-1 min-h-[300px] relative mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="t" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[-4, 4]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            />
            
            {showX && (
              <Line 
                type="monotone" 
                dataKey="x" 
                name="X (Leading Indicator)"
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
                isAnimationActive={true}
              />
            )}
            
            {showY && (
              <Line 
                type="monotone" 
                dataKey="y" 
                name="Y (Actual)"
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={false}
                isAnimationActive={true}
              />
            )}
            
            {showFRes && !showFUnres && (
              <Line 
                type="monotone" 
                dataKey="f_res" 
                name="Forecast (Restricted)"
                stroke="#ef4444" 
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
            )}

            {showFUnres && (
              <Line 
                type="monotone" 
                dataKey="f_unres" 
                name="Forecast (Unrestricted)"
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-sm text-slate-400">
        {!showFUnres && "Notice the gap between Actual Y (Blue) and Restricted Forecast (Red)."}
        {showFUnres && "The Unrestricted Forecast (Yellow) closely tracks Actual Y (Blue). X Granger-Causes Y!"}
      </div>
    </div>
  );
};
