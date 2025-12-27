import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { FeatureCard } from '../features/home/components/FeatureCard';
import { ImpactAwareness } from '../features/home/components/ImpactAwareness';
import { ImpactDashboard } from '../features/home/components/ImpactDashboard';
import { WasteSubmissionModal } from '../features/home/components/WasteSubmissionModal';
import { ChatBot } from '../components/ChatBot';

// --- SADECE BU SATIRI EKLEDİK (Dışarıdaki güncel hesaplayıcı) ---
import { CO2Calculator } from '../features/home/components/CO2Calculator'; 

// --- 1. Bölüm: AI Yolculuğu (DOKUNULMADI - SENİN KODUN) ---
const AIJourneySection = ({ onStartClick }: { onStartClick: () => void }) => {
  const steps = [
    { icon: 'photo_camera', title: '1. Fotoğrafla', desc: 'Eski cihazının fotoğrafını sisteme yükle veya kameranla tara.', color: 'text-primary' },
    { icon: 'psychology', title: '2. AI Analiz', desc: 'Gemini AI, cihazındaki nadir metalleri ve karbon salınımını hesaplasın.', color: 'text-accent' },
    { icon: 'workspace_premium', title: '3. Etkini Gör', desc: '18 atık hedefine yaklaşırken doğaya kazandırdığın değerleri raporla.', color: 'text-white' }
  ];

  return (
    <section className="py-24 px-6 md:px-10 border-t border-border-dark bg-background-dark/30">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">
            3 Adımda Dünyayı <span className="text-primary italic">Değiştir</span>
          </h2>
          <p className="text-gray-400 text-lg">Atığını yükle, AI analiz etsin, çevresel etkini saniyeler içinde gör.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="glass-panel p-8 rounded-[32px] border border-white/5 hover:border-primary/50 transition-all group relative text-left">
              {index < 2 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 text-primary z-10 animate-pulse">
                  <span className="material-symbols-outlined text-4xl font-bold">chevron_right</span>
                </div>
              )}
              <div className={`size-16 rounded-2xl bg-white/5 flex items-center justify-center ${step.color} mb-6 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-4xl">{step.icon}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button onClick={onStartClick} className="group relative px-10 py-5 bg-primary rounded-2xl font-black text-background-dark uppercase tracking-widest hover:scale-105 transition-all shadow-glow">
            Sistemi Hemen Dene
            <span className="material-symbols-outlined ml-2 align-middle group-hover:translate-x-1 transition-transform">rocket_launch</span>
          </button>
        </div>
      </div>
    </section>
  );
};

// --- (CO2Calculator ve CalculatorCard yerel tanımları buradan kaldırıldı, üstteki import kullanılıyor) ---

// --- Ana Sayfa Bileşeni (TASARIMINA DOKUNULMADI) ---
const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  return (
    <div className="bg-background-dark min-h-screen font-display text-white relative overflow-x-hidden">
      <Navbar onAtikBildirClick={() => setIsModalOpen(true)} />
      
      <main>
        {/* HERO SECTION - SENİN TASARIMIN */}
        <section className="max-w-[1280px] mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2 flex flex-col gap-6 text-left">
            <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold w-fit border border-accent/20 uppercase tracking-widest">Geleceğini Koru</span>
            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
              E-Atıklar <span className="text-primary italic">Çöp Değildir.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-[540px]">
              Eski cihazlarını AI ile analiz et, içindeki değerli metalleri keşfet ve doğaya kazandırdığın değeri anında gör.
            </p>
            <div className="flex gap-4 mt-4">
              <button onClick={() => setIsModalOpen(true)} className="px-8 py-4 bg-primary text-background-dark font-black rounded-xl hover:scale-105 transition-all shadow-glow flex items-center gap-2">
                Analizi Başlat <span className="material-symbols-outlined">analytics</span>
              </button>
            </div>
          </div>

          {/* SAĞ TARAF: MORPHING ANIMASYONU - SENİN TASARIMIN */}
          <div className="lg:w-1/2 relative h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
            <div className="relative z-10 w-[400px] h-[400px]">
              <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-24 bg-background-dark border-2 border-primary rounded-full flex items-center justify-center shadow-glow">
                  <span className="material-symbols-outlined text-5xl text-primary animate-spin-slow">sync</span>
                </div>
                <div className="absolute -top-10 p-4 bg-accent/20 rounded-full border border-accent/50 shadow-glow animate-bounce">
                  <span className="material-symbols-outlined text-4xl text-accent">eco</span>
                </div>
                <div className="absolute bottom-10 right-0 p-4 bg-primary/20 rounded-full border border-primary/50 shadow-glow animate-pulse">
                  <span className="material-symbols-outlined text-4xl text-primary">water_drop</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 1. SÜREÇ BÖLÜMÜ */}
        <AIJourneySection onStartClick={() => setIsModalOpen(true)} />

        {/* 2. CO2 HESAPLAYICI (ARTIK DIŞARIDAKİ GÜNCEL DOSYADAN GELİYOR) */}
        <CO2Calculator />

        {/* 3. DİNAMİK DASHBOARD */}
        {analysisData && (
          <ImpactDashboard 
            riskScore={analysisData.riskDegree} 
            co2Emission={analysisData.CO2Emission}
            recoveredValue={analysisData.cost}
            waterImpact={analysisData.cleanWater}
          />
        )}

        {/* 4. BİLGİLENDİRME KARTLARI (Sessiz Felaket) */}
        <ImpactAwareness />
        
        {/* ÖZELLİK KARTLARI - SENİN TASARIMIN */}
        <section className="max-w-[1280px] mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <FeatureCard 
              title="Güvenli Geri Dönüşüm"
              description="Verilerinizin güvenliğini sağlıyor ve pillerdeki zehirli maddeleri kontrol altında tutuyoruz."
              mainIcon="security"
              subFeatures={[
                { icon: 'lock', title: 'Veri İmhası', description: 'Cihazlarınızdaki tüm kişisel veriler fiziksel olarak yok edilir.' },
                { icon: 'battery_alert', title: 'Pil Güvenliği', description: 'Şişmiş piller için özel güvenlik rehberi al.', iconColor: 'text-amber-500' }
              ]}
            />
            <FeatureCard 
              title="Akıllı Toplama Sistemi"
              description="Teknoloji destekli lojistik ağımız ile karbon ayak izini en aza indiriyoruz."
              mainIcon="hub"
              subFeatures={[
                { icon: 'map', title: 'Bölgesel Kümelenme', description: 'Mahalledeki talepleri birleştirerek lojistik verimliliğini artırıyoruz.' },
                { icon: 'alt_route', title: 'Rota Optimizasyonu', description: 'Yapay zeka ile kuryelerimiz için en kısa rotalar.' }
              ]}
            />
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <WasteSubmissionModal 
            onClose={() => setIsModalOpen(false)} 
            onAnalysisComplete={(data: any) => {
              setAnalysisData(data);
              setIsModalOpen(false);
            }} 
          />
        </div>
      )}

      {/* CarboBot Chatbot */}
      <ChatBot />
    </div>
  );
};

export default Home;