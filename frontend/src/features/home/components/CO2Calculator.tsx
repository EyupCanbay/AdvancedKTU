import React, { useState, useMemo } from 'react';
import batary from '../../../assets/impact/batarya.jpg';
// Assets klasöründen ilgili görselleri import edin
// Örn: import phoneImg from '../../../assets/impact/phone-charging.jpg';
// Eğer görseller hazır değilse aşağıdaki URL'leri kullanabilirsiniz.

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
      <div className="absolute top-0 right-0 size-[600px] bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>

      <div className="max-w-[1280px] mx-auto text-center relative z-10">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase">
            CO₂ Emisyon <span className="text-accent italic">Etkisi</span>
          </h2>
          <p className="text-[#93c3c8] text-xl font-medium italic">Mol-e ile atıklarınızın doğadaki izdüşümünü keşfedin.</p>
        </div>

        {/* Giriş Paneli */}
        <div className="glass-panel p-10 rounded-[40px] mb-20 flex flex-col md:flex-row gap-8 items-center justify-center border border-white/10 shadow-glow bg-[#1a2c2e]/50 backdrop-blur-xl">
          <div className="flex flex-col gap-3 text-left w-full md:w-96">
            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-2 font-display">E-Atık Kategorisi</label>
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
            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-2 font-display">Miktar</label>
            <input 
              type="number" min="1" value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-background-dark border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-primary text-center font-black text-xl"
            />
          </div>
          <div className="md:mt-7 px-10 py-5 bg-primary rounded-2xl flex items-center gap-4 shadow-glow active:scale-95 transition-transform cursor-default">
             <span className="text-background-dark font-black text-3xl">{totalCo2.toLocaleString()}</span>
             <span className="text-background-dark/80 font-black uppercase text-xs tracking-tighter leading-none font-display">kg CO₂<br/>Tasarrufu</span>
          </div>
        </div>

        {/* FOTOĞRAFLI SONUÇ KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <CalculatorResultCard 
            value={Math.floor(totalCo2 * 125)} 
            unit="Adet" 
            label="Akıllı telefonun tam şarj edilmesine eşdeğer enerji" 
            icon="bolt" 
            // Görsel önerisi: Şarj olan telefon
            image="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800"
            tag="ENERJİ"
            color="text-primary"
            glowColor="from-primary/20"
          />
          <CalculatorResultCard 
            value={Math.floor(totalCo2 * 10)} 
            unit="Saat" 
            label="Bir LED ampulün kesintisiz yanma süresine eşdeğer" 
            icon="lightbulb" 
            // Görsel önerisi: Yanan modern bir ampul
            image={batary}
            tag="AYDINLATMA"
            color="text-accent"
            glowColor="from-accent/20"
          />
          <CalculatorResultCard 
            value={Math.floor(totalCo2 * 5)} 
            unit="Km" 
            label="Binek bir aracın yol açtığı emisyona eşdeğer" 
            icon="route" 
            // Görsel önerisi: Yolda giden bir araba veya asfalt
            image="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800"
            tag="OFSET"
            color="text-white"
            glowColor="from-white/10"
          />
        </div>
      </div>
    </section>
  );
};

const CalculatorResultCard = ({ value, unit, label, icon, image, tag, color, glowColor }: any) => (
  <div className="group relative flex flex-col h-[500px] rounded-[50px] border border-white/5 transition-all duration-700 hover:scale-[1.03] overflow-hidden shadow-2xl">
    
    {/* ARKA PLAN FOTOĞRAFI */}
    <div className="absolute inset-0 z-0">
      <img 
        src={image} 
        alt={label} 
        className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
      />
      {/* Gradyan Karartma (Overlay) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1415] via-[#0a1415]/70 to-transparent"></div>
    </div>

    {/* SAĞ ÜST BADGE */}
    <div className={`absolute top-8 right-8 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md z-20 text-[10px] font-black tracking-widest bg-black/30 ${color}`}>
      {tag}
    </div>

    {/* İÇERİK ALANI */}
    <div className="relative z-10 mt-auto p-10 flex flex-col items-center text-center">
      
      {/* İkon Rozeti */}
      <div className="mb-6 relative">
        <div className={`absolute inset-0 blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 rounded-full bg-current ${color}`}></div>
        <div className="relative z-10 size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
          <span className={`material-symbols-outlined text-3xl ${color}`}>{icon}</span>
        </div>
      </div>

      {/* VERİ ALANI */}
      <div className="space-y-1">
        <div className="flex items-baseline justify-center gap-2">
          <span className={`text-6xl font-black tracking-tighter drop-shadow-lg ${color}`}>
            {value.toLocaleString()}
          </span>
          <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{unit}</span>
        </div>
        <p className="text-gray-200 font-bold text-lg leading-snug max-w-[220px] mx-auto pt-4 border-t border-white/10">
          {label}
        </p>
      </div>
    </div>

    {/* Alt Çizgi Efekti */}
    <div className={`absolute bottom-0 left-0 h-1.5 w-0 group-hover:w-full transition-all duration-700 bg-current ${color}`}></div>
  </div>
);