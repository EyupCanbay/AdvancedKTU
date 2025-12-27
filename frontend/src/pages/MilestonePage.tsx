import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * MilestonePage - AI Servisinden gelen 17 çevresel veriyi 
 * projenin görsel kimliğiyle sunar.
 */
export const MilestonePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // 8081/upload endpoint'inden gelen analiz verileri
  const stats = state?.stats || {}; 
  const wasteID = state?.wasteID || ''; // Waste ID'yi state'den alıyoruz
  
  // Ana metrik olarak CO2 emisyonunu kullan (kg cinsinden)
  const totalRecycled = stats.CO2Emission || stats.cost || 0;
  const unit = stats.CO2Emission ? 'kg CO₂' : 'USD';

  return (
    <div className="bg-background-dark text-white font-display overflow-x-hidden min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-border-dark px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold">
              <span className="material-symbols-outlined text-xl">recycling</span>
            </div>
            <h2 className="text-white text-xl font-bold tracking-tight">E-Atık Koruyucuları</h2>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center justify-center size-10 rounded-lg bg-surface-dark border border-border-dark text-primary hover:bg-border-dark transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="flex items-center justify-center size-10 rounded-lg bg-surface-dark border border-border-dark text-primary hover:bg-border-dark transition-colors">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Ana İçerik */}
      <main className="flex-grow flex flex-col items-center justify-start py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full gap-10">
        
        {/* Başlık Bölümü */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-base">military_tech</span>
            Milestone Unlocked
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white glow-text">
            {totalRecycled > 0 ? `${totalRecycled} ${unit}` : 'Geri Dönüşüm Başarısı'}
          </h1>
          <p className="text-text-subtle text-lg max-w-2xl mx-auto">Elite Recycler olma yolundaki başarını kutluyoruz. Etkin gerçek ve ölçülebilir.</p>
        </div>

        {/* Hero: 18 Sayacı ve Risk Derecesi */}
        <div className="relative flex items-center justify-center py-6">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl transform scale-150"></div>
          <div className="relative size-64 md:size-80">
            <svg className="size-full" viewBox="0 0 100 100">
              <circle className="text-surface-dark stroke-current" cx="50" cy="50" fill="transparent" r="42" strokeWidth="6"></circle>
              <circle 
                className="text-primary progress-ring__circle" 
                cx="50" cy="50" fill="transparent" r="42" 
                strokeDasharray="264" 
                strokeDashoffset="0" 
                strokeLinecap="round" 
                strokeWidth="6" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(20, 170, 184, 0.6))' }}
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-7xl md:text-8xl font-bold text-white tracking-tighter glow-text leading-none">
                {totalRecycled > 0 ? totalRecycled : '-'}
              </span>
              <span className="text-primary font-bold text-sm uppercase tracking-widest mt-2">
                {totalRecycled > 0 ? `${unit} Geri Dönüştürüldü` : 'Veri Bekleniyor'}
              </span>
              <div className="mt-4 px-3 py-1 bg-accent/20 border border-accent/40 rounded text-accent text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                Tehlike Skoru: {stats.riskDegree || 0}/10
              </div>
            </div>
          </div>
        </div>

        {/* Birincil Etki Tablosu (4 Ana Kart) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="CO2 Emisyonu" 
            value={stats.CO2Emission} 
            unit="kg" 
            icon="cloud_off" 
            subIcon="co2"
            color="white" 
            desc="Engellenen Karbon"
          />
          <MetricCard 
            title="Korunan Su" 
            value={stats.cleanWater} 
            unit="L" 
            icon="water_drop" 
            subIcon="water_drop"
            color="primary" 
            desc="Temiz Su Kaynağı"
          />
          <MetricCard 
            title="Kazanılan Değer" 
            value={stats.cost} 
            unit="USD" 
            icon="currency_exchange" 
            subIcon="payments"
            color="white" 
            desc="Ekonomik Geri Kazanım"
          />
          <MetricCard 
            title="Yeraltı Suyu" 
            value={stats.contaminatingGroundwater} 
            unit="L" 
            icon="security" 
            subIcon="warning"
            color="[#fa5c38]" 
            desc="Önlenen Kirlilik"
          />
        </div>

        {/* Eşdeğer Etki Bölümü (Hayatın İçinden Kıyaslamalar) */}
        <div className="w-full space-y-6">
          <h3 className="text-2xl font-bold text-white border-l-4 border-primary pl-4 font-display italic">Equivalent Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ComparisonItem 
              icon="smartphone" 
              value={`${stats.fullyChargingPhones}x`} 
              label="Tam Şarj Edilmiş Telefon" 
              color="primary" 
            />
            <ComparisonItem 
              icon="directions_car" 
              value={`${stats.drivingCar} km`} 
              label="Araba Yolculuğu Emisyonu" 
              color="accent" 
            />
            <ComparisonItem 
              icon="forest" 
              value={`${stats.annualCarbonSequestrationCapacityTree} Yıl`} 
              label="Ağaç Karbon Tutma Kapasitesi" 
              color="[#10b981]" 
            />
            <ComparisonItem 
              icon="groups" 
              value={`${stats.dailyWaterConsumptionPeople} Kişi`} 
              label="Günlük Su Tüketimi Karşılandı" 
              color="blue-400" 
            />
            <ComparisonItem 
              icon="home" 
              value={`${stats.householdElectricityConsumption} Saat`} 
              label="Ev Elektrik Tüketimi Karşılandı" 
              color="white" 
            />
            <ComparisonItem 
              icon="history_edu" 
              value={`${stats.humanCarbonFootprintOneDay} Gün`} 
              label="Bireysel Karbon Ayak İzi Dengelendi" 
              color="primary" 
            />
          </div>
        </div>

        {/* Devam Et Butonu */}
        <div className="w-full py-6">
          <button 
            onClick={() => {
              // 🔒 Harita için login kontrolü
              const token = localStorage.getItem('token');
              if (!token) {
                alert('🔒 Toplama merkezi seçmek için lütfen giriş yapın.\n\nSonuçlarınızı görmek serbest, ancak teslimat işlemi için oturum açmanız gerekmektedir.');
                navigate('/login');
                return;
              }
              // Token varsa harita sayfasına git
              navigate('/select-center', { state: { stats, wasteID } });
            }}
            className="group relative w-full overflow-hidden rounded-2xl bg-primary p-1 text-center font-bold text-white shadow-[0_0_30px_-5px_rgba(20,170,184,0.4)] transition-all hover:scale-[1.01]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="relative flex items-center justify-center gap-3 rounded-xl bg-background-dark/20 backdrop-blur-sm px-8 py-6 text-xl md:text-2xl uppercase tracking-widest border border-white/20">
              Teslimat Merkezi Seç
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </button>
        </div>
      </main>

      {/* Ticker Footer (Mikro İstatistikler - Kayan Yazı) */}
      <footer className="w-full glass-panel border-t border-border-dark mt-auto overflow-hidden py-4">
        <div className="relative w-full flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-12 text-sm text-text-subtle font-medium items-center px-4">
            <TickerItem icon="water" label="Mikroplastik Engellenen:" value={`${stats.microplasticPollutionMarineLife}g`} />
            <TickerItem icon="landscape" label="Toprak Kaybı Durdurulan:" value={`${stats.soilDegradation}m²`} />
            <TickerItem icon="memory" label="Nadir Element Geri Kazanımı:" value={`${stats.lossRareEarthElements}kg`} />
            <TickerItem icon="factory" label="Atölye Enerji Tasarrufu:" value={`${stats.energyConsumptionOfSmallWorkshop} Saat`} />
            <TickerItem icon="lightbulb" label="LED Aydınlatma Eşdeğeri:" value={`${stats.ledLighting} Saat`} />
            <TickerItem icon="shutter_speed" label="Geleneksel Işık Süresi:" value={`${stats.lightHours} Saat`} />
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Alt Bileşenler ---

const MetricCard = ({ title, value, unit, icon, subIcon, color, desc }: any) => (
  <div className="glass-panel rounded-xl p-6 flex flex-col gap-3 hover:border-primary/50 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
      <span className="material-symbols-outlined text-6xl text-white">{subIcon}</span>
    </div>
    <div className={`size-10 rounded-lg bg-surface-dark flex items-center justify-center border border-border-dark text-${color} mb-1`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div>
      <p className="text-text-subtle text-sm font-medium uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="text-lg text-text-subtle">{unit}</span>
      </div>
      <div className="flex items-center gap-1 text-accent text-sm font-bold mt-1">
        <span className="material-symbols-outlined text-sm">trending_up</span>
        <span>{desc}</span>
      </div>
    </div>
  </div>
);

const ComparisonItem = ({ icon, value, label, color }: any) => (
  <div className="glass-panel p-4 flex items-center gap-4 rounded-lg border-l-4 border-l-primary/30 hover:border-l-primary transition-all">
    <div className={`size-14 rounded-full bg-${color}/20 flex items-center justify-center text-${color} shrink-0`}>
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-white text-xl font-bold">{value}</span>
      <span className="text-text-subtle text-sm">{label}</span>
    </div>
  </div>
);

const TickerItem = ({ icon, label, value }: any) => (
  <span className="flex items-center gap-2">
    <span className="material-symbols-outlined text-accent text-lg">{icon}</span>
    {label} <span className="text-white font-bold">{value}</span>
  </span>
);