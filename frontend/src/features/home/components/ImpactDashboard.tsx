import React, { useState, useEffect } from 'react';

interface ImpactDashboardProps {
  riskScore: number;
  co2Emission: number;
  recoveredValue: number;
  waterImpact: number;
}

// Rakamları 0'dan hedef değere akıtan özel animasyon bileşeni
const AnimatedCounter = ({ value, duration = 1500 }: { value: number, duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const endValue = value;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * endValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ 
  riskScore, 
  co2Emission, 
  recoveredValue, 
  waterImpact 
}) => {
  return (
    <div className="w-full bg-[#112022] border-y border-[#244447] py-20 px-4 md:px-10">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-3">Gerçek Zamanlı Etki Analizi</h2>
          <p className="text-gray-400 text-sm">Gemini AI destekli veri modellemesi ile çevresel etkileri takip ediyoruz.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {/* Risk Skoru - riskDegree */}
          <MetricCard 
            icon="warning" 
            value={<AnimatedCounter value={riskScore} />} 
            unit="/10" 
            label="Risk Skoru" 
            color="#f59e0b" 
            status="AI-Powered" 
          />

          {/* Karbon Emisyonu - CO2Emission */}
          <MetricCard 
            icon="eco" 
            value={<AnimatedCounter value={co2Emission} />} 
            unit="kg" 
            label="Karbon Emisyonu" 
            color="#10b981" 
            status="Önlenen CO2" 
          />

          {/* Geri Kazanılan Değer - cost */}
          <MetricCard 
            icon="database" 
            value={<>$<AnimatedCounter value={recoveredValue} /></>} 
            unit="" 
            label="Ekonomik Değer" 
            color="#14aab8" 
            status="Tahmini Kazanç" 
          />

          {/* Su Etkisi - cleanWater */}
          <MetricCard 
            icon="water_drop" 
            value={<AnimatedCounter value={waterImpact} />} 
            unit="L" 
            label="Su Tasarrufu" 
            color="#3b82f6" 
            status="Temiz Su" 
          />
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, value, unit, label, color, status }: any) => (
  <div className="metric-card-glass rounded-3xl p-8 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-white/10">
    <div className="mb-4 p-3 rounded-full" style={{ backgroundColor: `${color}1A`, color }}>
      <span className="material-symbols-outlined text-4xl">{icon}</span>
    </div>
    <div className="text-4xl font-black text-white mb-2 tracking-tighter">
      {value}<span className="text-lg font-bold text-gray-500 ml-1">{unit}</span>
    </div>
    <h3 className="font-bold text-lg mb-2" style={{ color }}>{label}</h3>
    <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
      <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color }}>{status}</span>
    </div>
  </div>
);