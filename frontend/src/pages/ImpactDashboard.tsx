import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export const ImpactDashboard = () => {
  const navigate = useNavigate();
  const [impact, setImpact] = useState<ImpactAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImpactData();
    // Her 30 saniyede bir güncelle
    const interval = setInterval(fetchImpactData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchImpactData = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/impact-analysis');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background-dark text-white font-display overflow-x-hidden min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-border-dark px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="size-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold hover:scale-110 transition-transform"
            >
              <span className="material-symbols-outlined text-xl">recycling</span>
            </button>
            <h2 className="text-white text-xl font-bold tracking-tight">Gerçek Zamanlı Etki Analizi</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-sm font-medium">Canlı</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Ana İçerik */}
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {impact ? (
          <>
            {/* Başlık */}
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white glow-text mb-2">
                Toplam Çevresel Etki
              </h1>
              <p className="text-text-subtle text-lg">
                {impact.totalWasteProcessed} atık işlendi • {impact.highRiskWastes} yüksek riskli atık
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Son Güncelleme: {new Date(impact.lastUpdated).toLocaleString('tr-TR')}
              </p>
            </div>

            {/* Ana Metrikler */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <ImpactCard
                title="CO₂ Tasarrufu"
                value={impact.totalCO2Saved.toFixed(1)}
                unit="kg"
                icon="cloud_off"
                color="green"
                description="Atmosfere salınmayan karbon"
              />
              <ImpactCard
                title="Su Tasarrufu"
                value={impact.totalWaterSaved.toFixed(0)}
                unit="Litre"
                icon="water_drop"
                color="blue"
                description="Korunan temiz su"
              />
              <ImpactCard
                title="Enerji Eşdeğeri"
                value={impact.totalEnergyEquivalent.toFixed(0)}
                unit="kWh"
                icon="bolt"
                color="yellow"
                description="Tasarruf edilen enerji"
              />
              <ImpactCard
                title="Ağaç Eşdeğeri"
                value={impact.treesEquivalent.toFixed(0)}
                unit="yıl"
                icon="forest"
                color="green"
                description="Karbon emilimi eşdeğeri"
              />
            </div>

            {/* İkincil Metrikler */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SecondaryMetric
                icon="phone_android"
                value={impact.phonesCharged}
                label="Telefon Şarjı"
                color="purple"
              />
              <SecondaryMetric
                icon="lightbulb"
                value={impact.lightHoursTotal.toFixed(0)}
                label="LED Aydınlatma (saat)"
                color="yellow"
              />
              <SecondaryMetric
                icon="directions_car"
                value={impact.carsOffRoad.toFixed(1)}
                label="Araba Mesafesi (km)"
                color="orange"
              />
              <SecondaryMetric
                icon="warning"
                value={impact.highRiskWastes}
                label="Yüksek Riskli Atık"
                color="red"
              />
            </div>

            {/* Karşılaştırma Bölümü */}
            <div className="mt-10 glass-panel border border-border-dark rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Bu Ne Anlama Geliyor?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ComparisonCard
                  icon="home"
                  value={(impact.totalEnergyEquivalent / 30).toFixed(1)}
                  label="Ev günlük enerji"
                  description="Bu enerji yaklaşık bu kadar evin bir günlük ihtiyacını karşılar"
                />
                <ComparisonCard
                  icon="local_drink"
                  value={(impact.totalWaterSaved / 8).toFixed(0)}
                  label="Kişi günlük su"
                  description="Bu su yaklaşık bu kadar kişinin günlük su ihtiyacını karşılar"
                />
                <ComparisonCard
                  icon="park"
                  value={(impact.treesEquivalent).toFixed(0)}
                  label="Ağaç yıllık emilim"
                  description="Bu CO₂ miktarını emmek için bir ağacın çalışması gereken yıl"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-text-subtle text-xl">Henüz veri bulunmuyor</p>
          </div>
        )}
      </main>
    </div>
  );
};

// Yardımcı Komponentler
interface ImpactCardProps {
  title: string;
  value: string;
  unit: string;
  icon: string;
  color: string;
  description: string;
}

const ImpactCard: React.FC<ImpactCardProps> = ({ title, value, unit, icon, color, description }) => {
  const colorClasses = {
    green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
  };

  return (
    <div className={`glass-panel border bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-xl p-6 transition-transform hover:scale-105`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="mb-2">
        <span className="text-4xl font-black text-white">{value}</span>
        <span className="text-xl font-semibold ml-2">{unit}</span>
      </div>
      <p className="text-sm text-text-subtle">{description}</p>
    </div>
  );
};

interface SecondaryMetricProps {
  icon: string;
  value: string | number;
  label: string;
  color: string;
}

const SecondaryMetric: React.FC<SecondaryMetricProps> = ({ icon, value, label, color }) => {
  const colorClasses = {
    purple: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
    yellow: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    orange: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
    red: 'bg-red-500/20 border-red-500/30 text-red-400',
  };

  return (
    <div className={`glass-panel border ${colorClasses[color as keyof typeof colorClasses]} rounded-xl p-6 text-center`}>
      <span className="material-symbols-outlined text-4xl mb-3 block">{icon}</span>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-medium text-text-subtle">{label}</div>
    </div>
  );
};

interface ComparisonCardProps {
  icon: string;
  value: string;
  label: string;
  description: string;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ icon, value, label, description }) => {
  return (
    <div className="text-center">
      <span className="material-symbols-outlined text-5xl text-primary mb-3 block">{icon}</span>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-bold text-primary mb-2 uppercase tracking-wider">{label}</div>
      <p className="text-xs text-text-subtle">{description}</p>
    </div>
  );
};

export default ImpactDashboard;
