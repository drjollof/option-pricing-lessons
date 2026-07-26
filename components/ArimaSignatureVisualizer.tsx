"use client";
import React, { useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

interface ArimaSignatureVisualizerProps {
  currentFrame: number;
}

export const ArimaSignatureVisualizer: React.FC<ArimaSignatureVisualizerProps> = ({ currentFrame }) => {

  const data = useMemo(() => {
    const lags = 12;
    const result = [];
    const phi = 0.8;
    const theta = -0.8;

    for (let i = 0; i <= lags; i++) {
      if (i === 0) {
        result.push({ lag: 0, ar_acf: 1.0, ar_pacf: 1.0, ma_acf: 1.0, ma_pacf: 1.0 });
        continue;
      }

      // AR(1) Data: ACF tails off, PACF cuts off
      const ar_acf = Math.pow(phi, i) + (Math.random() * 0.04 - 0.02);
      const ar_pacf = i === 1 ? phi : (Math.random() * 0.1 - 0.05);

      // MA(1) Data: ACF cuts off, PACF tails off
      const ma_acf = i === 1 ? theta / (1 + theta * theta) : (Math.random() * 0.1 - 0.05);
      const ma_pacf = Math.pow(-theta, i) * (Math.random() * 0.2 + 0.8) + (Math.random() * 0.04 - 0.02);

      result.push({ lag: i, ar_acf, ar_pacf, ma_acf, ma_pacf });
    }
    return result;
  }, []);

  const yDomain = [-1, 1];
  const sigLevel = 0.2; // roughly 1.96 / sqrt(N)

  // currentFrame 0: Show AR(1) ACF
  // currentFrame 1: Show AR(1) PACF too
  // currentFrame 2: Show MA(1) ACF
  // currentFrame 3: Show MA(1) PACF too

  const showArAcf = currentFrame >= 0;
  const showArPacf = currentFrame >= 1;
  const showMaAcf = currentFrame >= 2;
  const showMaPacf = currentFrame >= 3;

  const renderStemChart = (dataKey: string, title: string, color: string, visible: boolean) => (
    <div className={`flex-1 flex flex-col items-center relative transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <h4 className="text-sm font-bold text-slate-300 mb-1">{title}</h4>
      <div className="w-full h-32 md:h-40 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="lag" stroke="#94a3b8" tick={{fontSize: 10}} />
            <YAxis stroke="#94a3b8" domain={yDomain} tick={{fontSize: 10}} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }} />
            <ReferenceArea y1={-sigLevel} y2={sigLevel} fill="#3b82f6" fillOpacity={0.15} />
            <ReferenceArea y1={0} y2={0} stroke="#94a3b8" strokeOpacity={0.5} />
            
            {visible && <Bar dataKey={dataKey} barSize={3} fill={color} isAnimationActive={true} />}
            {visible && <Line type="monotone" dataKey={dataKey} stroke="none" dot={{ r: 3, fill: color, strokeWidth: 0 }} isAnimationActive={false} />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col gap-4 bg-slate-900 rounded-xl p-4 overflow-hidden">
      
      {/* AR Section */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-violet-400 mb-2 border-b border-slate-700 pb-1">AR(1) Signature</h3>
        <div className="flex flex-row gap-2 flex-1">
          {renderStemChart("ar_acf", "ACF (Tails off)", "#8b5cf6", showArAcf)}
          {renderStemChart("ar_pacf", "PACF (Cuts off)", "#8b5cf6", showArPacf)}
        </div>
      </div>

      {/* MA Section */}
      <div className="flex-1 flex flex-col mt-2">
        <h3 className="text-lg font-bold text-emerald-400 mb-2 border-b border-slate-700 pb-1">MA(1) Signature</h3>
        <div className="flex flex-row gap-2 flex-1">
          {renderStemChart("ma_acf", "ACF (Cuts off)", "#10b981", showMaAcf)}
          {renderStemChart("ma_pacf", "PACF (Tails off)", "#10b981", showMaPacf)}
        </div>
      </div>

    </div>
  );
};
