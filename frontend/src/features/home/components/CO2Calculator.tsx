import React, { useState, useMemo } from 'react';

export const CO2Calculator = () => {
  const [wasteType, setWasteType] = useState('mobile_phone');
  const [amount, setAmount] = useState(1);

  const wasteCategories = useMemo(() => ({
    'mobile_phone': { label: 'Akıllı Telefon', factor: 60 },
    'laptop': { label: 'Dizüstü Bilgisayar', factor: 250 },
    'desktop_pc': { label: 'Masaüstü Bilgisayar', factor: 420 },
    'monitor_lcd': { label: 'LCD Monitör', factor: 100 },
    'battery': { label: 'Batarya / Pil (kg)', factor: 2.5 },
    'refrigerator': { label: 'Buzdolabı', factor: 500 },
    'washing_machine': { label: 'Çamaşır Makinesi', factor: 350 },
    'tv_led': { label: 'LED TV', factor: 180 },
    'modem_router': { label: 'Modem / Router', factor: 30 }
  }), []);

  const currentFactor = (wasteCategories as any)[wasteType]?.factor || 0;
  const totalCo2 = currentFactor * amount;

  return (
    <section className="py-32 px-6 md:px-10 border-t border-border-dark bg-[#112022] relative overflow-hidden">
      {/* Dekoratif Arka Plan Işığı */}
      <div className="absolute top-0 right-0 size-[600px] bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>

      <div className="max-w-[1280px] mx-auto text-center relative z-10">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase">
            CO₂ Emisyon <span className="text-accent italic">Etkisi</span>
          </h2>
          <p className="text-[#93c3c8] text-xl font-medium">Mol-e ile atıklarınızın doğadaki izdüşümünü keşfedin.</p>
        </div>

        {/* Gelişmiş Giriş Paneli */}
        <div className="glass-panel p-10 rounded-[40px] mb-20 flex flex-col md:flex-row gap-8 items-center justify-center border border-white/10 shadow-glow bg-[#1a2c2e]/50 backdrop-blur-xl">
          <div className="flex flex-col gap-3 text-left w-full md:w-96">
            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-2">E-Atık Kategorisi</label>
            <select 
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value)}
              className="w-full bg-background-dark border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-primary font-bold appearance-none cursor-pointer transition-all hover:bg-surface-dark"
            >
              {Object.entries(wasteCategories).map(([key, data]) => (
                <option key={key} value={key}>{data.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-3 text-left w-full md:w-32">
            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-2">Miktar</label>
            <input 
              type="number" min="1" value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-background-dark border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-primary text-center font-black text-xl"
            />
          </div>
          <div className="md:mt-7 px-10 py-5 bg-primary rounded-2xl flex items-center gap-4 shadow-glow active:scale-95 transition-transform">
             <span className="text-background-dark font-black text-3xl">{totalCo2.toLocaleString()}</span>
             <span className="text-background-dark/80 font-black uppercase text-xs tracking-tighter leading-none">kg CO₂<br/>Tasarrufu</span>
          </div>
        </div>

        {/* SONUÇ KARTLARI (Büyük ve Modern Tasarım) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <CalculatorResultCard 
            value={Math.floor(totalCo2 * 125)} 
            unit="Adet" 
            label="Akıllı telefonun tam şarj edilmesine eşdeğer enerji" 
            icon="bolt" 
            color="text-primary"
            glowColor="from-primary/20"
          />
          <CalculatorResultCard 
            value={Math.floor(totalCo2 * 10)} 
            unit="Saat" 
            label="Bir LED ampulün kesintisiz yanma süresine eşdeğer" 
            icon="lightbulb" 
            color="text-accent"
            glowColor="from-accent/20"
          />
          <CalculatorResultCard 
            value={Math.floor(totalCo2 * 5)} 
            unit="Km" 
            label="Binek bir aracın yol açtığı emisyona eşdeğer" 
            icon="route" 
            color="text-white"
            glowColor="from-white/10"
          />
        </div>
      </div>
    </section>
  );
};

const CalculatorResultCard = ({ value, unit, label, icon, color, glowColor }: any) => (
  <div className="glass-panel group relative flex flex-col items-center p-12 rounded-[50px] border border-white/5 transition-all duration-700 hover:scale-[1.03] hover:border-primary/40 overflow-hidden">
    
    {/* Arka Plan Radyal Parlama */}
    <div className={`absolute inset-0 bg-gradient-radial ${glowColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

    {/* GÖRSEL ALANI - Burası Tasarımın Kalbi */}
    <div className="relative z-10 mb-10 group-hover:animate-float-visual">
       {/* Parlama Efekti */}
       <div className={`absolute inset-0 blur-[60px] opacity-20 group-hover:opacity-60 transition-opacity duration-700 ${color === 'text-primary' ? 'bg-primary' : color === 'text-accent' ? 'bg-accent' : 'bg-white'}`}></div>
       
       <div className={`size-40 md:size-48 rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-3xl shadow-2xl relative overflow-hidden group-hover:border-primary/50`}>
          {/* İkon / Fotoğraf */}
          <span className={`material-symbols-outlined text-8xl md:text-9xl ${color} filter drop-shadow-[0_0_20px_currentColor]`}>
            {icon}
          </span>
          {/* Cam Üzerindeki Işık Süzmesi */}
          <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:left-[100%] transition-all duration-1000"></div>
       </div>
    </div>

    {/* VERİ ALANI */}
    <div className="relative z-10 text-center space-y-2">
      <div className="flex items-baseline justify-center gap-2">
        <span className={`text-6xl md:text-7xl font-black tracking-tighter ${color}`}>
          {value.toLocaleString()}
        </span>
        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{unit}</span>
      </div>
      <p className="text-gray-400 font-bold text-lg leading-snug max-w-[200px] mx-auto pt-4 border-t border-white/5">
        {label}
      </p>
    </div>

    {/* Küçük Bilgi Etiketi */}
    <div className="absolute bottom-6 right-8 opacity-20 text-[10px] font-black uppercase tracking-widest text-white">
      Mol-e Analysis
    </div>
  </div>
);