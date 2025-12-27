import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';

<<<<<<< Updated upstream
<<<<<<< Updated upstream
const origin = (uri: string) => `${location.protocol}//${location.hostname}${uri}`;

=======
// Etki Analizi Veri Yapısı
>>>>>>> Stashed changes
=======
// Etki Analizi Veri Yapısı
>>>>>>> Stashed changes
interface ImpactAnalysis {
  totalCO2Saved: number;
  totalEnergyEquivalent: number;
  totalWaterSaved: number;
  treesEquivalent: number;
  carsOffRoad: number;
  phonesCharged: number;
  lightHoursTotal: number;
  totalWasteProcessed: number;
  highRiskWastes: number;
  lastUpdated: string;
}

// Rakamları 0'dan hedef değere akıtan animasyon bileşeni
const AnimatedCounter = ({ value, duration = 1500, decimals = 0 }: { value: number, duration?: number, decimals?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const endValue = value;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(progress * endValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{count.toLocaleString('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
};

export const ImpactDashboard = () => {
  const navigate = useNavigate();
  const [impact, setImpact] = useState<ImpactAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  // Veri Çekme Fonksiyonu
  const fetchImpactData = async () => {
    try {
      const response = await fetch(origin(':8081/api/impact-analysis'));
      if (response.ok) {
        const data = await response.json();
        setImpact(data);
      }
    } catch (error) {
      console.error('Etki analizi yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImpactData();
    const interval = setInterval(fetchImpactData, 30000); // 30 saniyede bir güncelle
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background-dark text-white font-display overflow-x-hidden min-h-screen flex flex-col relative">
      {/* Arka Plan Dekoratif Işıklar */}
      <div className="absolute top-0 left-1/4 size-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 size-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* MODERN NAVBAR */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-border-dark px-6 py-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          <div className="flex items-center gap-3">
            <button
=======
=======
>>>>>>> Stashed changes
          <div className="flex items-center gap-4">
            {/* ANA SAYFAYA DÖN BUTONU */}
            <button 
>>>>>>> Stashed changes
              onClick={() => navigate('/')}
              className="group flex items-center gap-3 px-4 py-2 rounded-xl bg-surface-dark border border-border-dark text-gray-300 hover:text-white hover:bg-white/5 transition-all"
            >
              <span className="material-symbols-outlined text-primary group-hover:-translate-x-1 transition-transform">arrow_back</span>
              <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                <span className="material-symbols-outlined text-xl text-primary">recycling</span>
                <span className="text-sm font-bold tracking-tight">Ana Sayfa</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">Canlı Veri</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ANA İÇERİK */}
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        {impact ? (
          <>
            {/* Başlık ve Özet */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4 uppercase">
                Toplam Çevresel <span className="text-primary italic">Etki</span>
              </h1>
              <p className="text-[#93c3c8] text-lg md:text-xl font-medium">
                {impact.totalWasteProcessed} atık işlendi • {impact.highRiskWastes} yüksek riskli atık
              </p>
              <p className="text-xs text-gray-500 mt-4 tracking-widest uppercase">
                Son Güncelleme: {new Date(impact.lastUpdated).toLocaleTimeString('tr-TR')}
              </p>
            </div>

            {/* ANA METRİKLER (Sayaçlı) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <ImpactCard
                title="CO₂ Tasarrufu"
                value={<AnimatedCounter value={impact.totalCO2Saved} decimals={1} />}
                unit="kg"
                icon="cloud_off"
                color="green"
                description="Atmosfere salınmayan karbon"
              />
              <ImpactCard
                title="Su Tasarrufu"
                value={<AnimatedCounter value={impact.totalWaterSaved} />}
                unit="Litre"
                icon="water_drop"
                color="blue"
                description="Korunan temiz su"
              />
              <ImpactCard
                title="Enerji Eşdeğeri"
                value={<AnimatedCounter value={impact.totalEnergyEquivalent} />}
                unit="kWh"
                icon="bolt"
                color="yellow"
                description="Tasarruf edilen enerji"
              />
              <ImpactCard
                title="Ağaç Eşdeğeri"
                value={<AnimatedCounter value={impact.treesEquivalent} />}
                unit="yıl"
                icon="forest"
                color="green"
                description="Karbon emilimi eşdeğeri"
              />
            </div>

            {/* İKİNCİL METRİKLER */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <SecondaryMetric icon="phone_android" value={impact.phonesCharged} label="Telefon Şarjı" color="purple" />
              <SecondaryMetric icon="lightbulb" value={Math.floor(impact.lightHoursTotal)} label="LED Aydınlatma (saat)" color="yellow" />
              <SecondaryMetric icon="directions_car" value={impact.carsOffRoad.toFixed(1)} label="Araba Mesafesi (km)" color="orange" />
              <SecondaryMetric icon="warning" value={impact.highRiskWastes} label="Yüksek Riskli Atık" color="red" />
            </div>

            {/* KARŞILAŞTIRMA VE AKSİYON */}
            <div className="glass-panel border border-border-dark rounded-[40px] p-12 bg-gradient-to-b from-white/[0.02] to-transparent">
              <h2 className="text-3xl font-black mb-12 text-center italic tracking-tighter uppercase">Bu Veriler Ne Anlama Geliyor?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
                <ComparisonCard
                  icon="home"
                  value={(impact.totalEnergyEquivalent / 30).toFixed(1)}
                  label="Ev Günlük Enerji"
                  description="Bu enerji bu kadar evin bir günlük ihtiyacını karşılar."
                />
                <ComparisonCard
                  icon="local_drink"
                  value={(impact.totalWaterSaved / 8).toFixed(0)}
                  label="Kişi Günlük Su"
                  description="Bu su bu kadar kişinin günlük su ihtiyacını karşılar."
                />
                <ComparisonCard
                  icon="park"
                  value={(impact.treesEquivalent).toFixed(0)}
                  label="Ağaç Yıllık Emilim"
                  description="Bu CO₂ miktarını emmek için bir ağacın çalışması gereken yıl."
                />
              </div>

              {/* SAYFA SONU ANA SAYFAYA DÖN BUTONU */}
              <div className="flex flex-col items-center gap-6 border-t border-white/5 pt-12">
                <p className="text-gray-400 text-sm italic">Doğayı korumaya devam etmek için yeni bir atık bildir.</p>
                <button
                  onClick={() => navigate('/')}
                  className="group relative px-12 py-5 bg-primary text-background-dark font-black rounded-2xl hover:scale-105 transition-all shadow-glow flex items-center gap-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="material-symbols-outlined">home</span>
                  SİSTEMİ KULLANMAYA DEVAM ET
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-surface-dark/30 rounded-3xl border border-dashed border-border-dark">
            <span className="material-symbols-outlined text-6xl text-gray-600 mb-4 animate-bounce">database_off</span>
            <p className="text-gray-400 text-xl font-bold italic tracking-widest">VERİ AKIŞI BEKLENİYOR...</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

// YARDIMCI BİLEŞENLER
const ImpactCard = ({ title, value, unit, icon, color, description }: any) => {
  const colorMap: any = {
    green: 'from-green-500/20 text-green-400 border-green-500/30',
    blue: 'from-blue-500/20 text-blue-400 border-blue-500/30',
    yellow: 'from-yellow-500/20 text-yellow-400 border-yellow-500/30'
  };

  return (
    <div className={`glass-panel border bg-gradient-to-br ${colorMap[color]} rounded-[32px] p-8 transition-all hover:-translate-y-2 group`}>
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">{icon}</span>
        <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="mb-4">
        <span className="text-5xl font-black text-white tracking-tighter">{value}</span>
        <span className="text-xl font-bold ml-2 opacity-60">{unit}</span>
      </div>
      <p className="text-xs text-text-subtle font-medium italic">{description}</p>
    </div>
  );
};

const SecondaryMetric = ({ icon, value, label, color }: any) => {
    const colors: any = {
        purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
        yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
        orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
        red: 'bg-red-500/10 border-red-500/20 text-red-400'
    };
    return (
        <div className={`glass-panel border ${colors[color]} rounded-2xl p-6 text-center group hover:bg-white/5 transition-all`}>
            <span className="material-symbols-outlined text-4xl mb-3 block group-hover:scale-110 transition-transform">{icon}</span>
            <div className="text-3xl font-black text-white mb-1 tracking-tight">{value}</div>
            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">{label}</div>
        </div>
    );
};

const ComparisonCard = ({ icon, value, label, description }: any) => (
  <div className="text-center group p-6 rounded-3xl hover:bg-white/5 transition-colors">
    <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-4xl">{icon}</span>
    </div>
    <div className="text-4xl font-black text-white mb-2 tracking-tighter">{value}</div>
    <div className="text-xs font-black text-primary mb-4 uppercase tracking-[0.2em]">{label}</div>
    <p className="text-sm text-gray-500 leading-relaxed italic">{description}</p>
  </div>
);

export default ImpactDashboard;