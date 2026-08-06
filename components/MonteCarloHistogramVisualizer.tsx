"use client";
import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLessonStore } from "@/store/lessonStore";

interface MonteCarloHistogramVisualizerProps {
  currentFrame?: number;
  params?: { N?: number; sigma?: number; T?: number; S0?: number; r?: number };
}

export const MonteCarloHistogramVisualizer: React.FC<MonteCarloHistogramVisualizerProps> = ({ currentFrame = 0, params: propParams }) => {
  const storeParams = useLessonStore(state => state.params);
  const effectiveParams = propParams || storeParams;
  const sigma = effectiveParams.sigma ?? storeParams.sigma ?? 0.2;
  const T = effectiveParams.T ?? storeParams.T ?? 1;
  const S0 = effectiveParams.S0 ?? storeParams.S0 ?? 100;
  const r = effectiveParams.r ?? storeParams.r ?? 0.05;
  const kappa = storeParams.u ?? 0.05;
  const theta = storeParams.K ?? 0.10;

  // Use modelMode from global store — set when user clicks GBM/Vasicek toggle
  const isVasicek = storeParams.modelMode === 'vasicek';

  const data = useMemo(() => {
    let trials = 50000;
    if (currentFrame === 0) trials = 100;
    else if (currentFrame === 1) trials = 1000;

    const bins = 30;
    const terminalValues: number[] = [];

    for (let i = 0; i < trials; i++) {
      const u1 = Math.max(1e-10, Math.random());
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

      if (isVasicek) {
        // Vasicek analytic terminal distribution: r_T ~ N(mean_T, var_T)
        const k = Math.max(0.001, kappa);
        const expKT = Math.exp(-k * T);
        const mean_T = S0 * expKT + theta * (1 - expKT);
        const var_T = (sigma * sigma) / (2 * k) * (1 - Math.exp(-2 * k * T));
        terminalValues.push(mean_T + Math.sqrt(var_T) * z);
      } else {
        // GBM: S_T = S0 * exp((r - sigma^2/2)*T + sigma*sqrt(T)*Z)
        const logReturn = (r - 0.5 * sigma * sigma) * T + sigma * Math.sqrt(T) * z;
        terminalValues.push(S0 * Math.exp(logReturn));
      }
    }

    const minP = Math.min(...terminalValues);
    const maxP = Math.max(...terminalValues);
    const binSize = (maxP - minP) / bins || 1;
    const histogram = new Array(bins).fill(0);
    for (const p of terminalValues) {
      const binIndex = Math.min(bins - 1, Math.floor((p - minP) / binSize));
      histogram[binIndex]++;
    }
    return histogram.map((count, i) => ({
      name: isVasicek ? (minP + i * binSize).toFixed(3) : (minP + i * binSize).toFixed(0),
      count,
    }));
  }, [sigma, T, S0, r, kappa, theta, isVasicek, currentFrame]);

  const title = isVasicek ? "Vasicek Terminal Distribution" : "GBM Terminal Distribution";
  const subtitle = isVasicek
    ? `r\u2080=${S0.toFixed(3)}, \u03ba=${kappa.toFixed(3)}, \u03b8=${theta.toFixed(3)}, \u03c3=${sigma.toFixed(3)}, T=${T.toFixed(2)}yr`
    : `S\u2080=${S0}, \u03c3=${sigma.toFixed(2)}, r=${r.toFixed(2)}, T=${T.toFixed(2)}yr`;
  const barColor1 = isVasicek ? "#10b981" : "#8b5cf6";
  const barColor2 = isVasicek ? "#06b6d4" : "#3b82f6";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{subtitle}</p>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" tick={{ fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} interval={4} />
          <YAxis tick={{ fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
          <defs>
            <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={barColor1} stopOpacity={0.9} />
              <stop offset="95%" stopColor={barColor2} stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <Tooltip
            cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 16px rgb(0 0 0 / 0.12)",
              backgroundColor: "#ffffff",
              color: "#1e293b",
              fontSize: "13px",
            }}
            labelStyle={{ color: "#475569", fontWeight: 600, marginBottom: 4 }}
            itemStyle={{ color: "#4f46e5" }}
            formatter={(value: any) => [value.toLocaleString(), "Count"]}
          />
          <Bar dataKey="count" fill="url(#histGrad)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
