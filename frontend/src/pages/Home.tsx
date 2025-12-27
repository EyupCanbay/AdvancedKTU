import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { FeatureCard } from '../features/home/components/FeatureCard';
import { ImpactAwareness } from '../features/home/components/ImpactAwareness';
import { ImpactDashboard } from '../features/home/components/ImpactDashboard';
import { WasteSubmissionModal } from '../features/home/components/WasteSubmissionModal';

const Home = () => {
  const navigate = useNavigate();
  // Modalın açık/kapalı durumunu kontrol eden state
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // AI analizinden gelen verileri tutan state
  const [analysisData, setAnalysisData] = useState<any>(null);

  return (
    <div className="bg-background-dark min-h-screen font-display text-white relative">
      {/* Navbar'a modal açma fonksiyonunu gönderiyoruz */}
      <Navbar onAtikBildirClick={() => setIsModalOpen(true)} />
      
      <main>
        {/* Hero Section */}
        <section className="max-w-[1280px] mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2 flex flex-col gap-6">
            <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold w-fit border border-accent/20">GELECEĞİNİ KORU</span>
            <h1 className="text-5xl lg:text-6xl font-black leading-tight">
              Sessiz Tehlike: <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">E-Atık Nedir?</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Evinizdeki eski elektronikler sadece çöp değil, doğa için birer saatli bomba. Gelecek nesilleri korumak için güvenli dönüşümü şimdi başlatın.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="h-12 px-8 bg-primary hover:bg-primary-dark rounded-lg font-bold shadow-lg shadow-primary/25 transition-all active:scale-95"
              >
                Hemen Dönüştür
              </button>
              <button 
                onClick={() => navigate('/impact')}
                className="h-12 px-8 border border-gray-600 hover:border-primary hover:text-primary rounded-lg font-bold transition-colors"
              >
                Gerçek Zamanlı Etki
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative aspect-[4/3] rounded-2xl overflow-hidden border border-border-dark">
            <div className="absolute inset-0 bg-gradient-to-tr from-background-dark/80 to-transparent z-10"></div>
            <img src="/hero-waste.jpg" className="w-full h-full object-cover" alt="E-Waste Transformation" />
            <div className="absolute bottom-6 left-6 z-20 glass-panel p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-1 font-bold">
                <span className="material-symbols-outlined text-accent">check_circle</span>
                Güvenli İmha
              </div>
              <p className="text-gray-300 text-xs">Verileriniz ve doğa %100 güvende.</p>
            </div>
          </div>
        </section>

        {/* Zararlar Bölümü */}
        <ImpactAwareness />

        {/* Dinamik Dashboard: AI'dan gelen veriler (riskDegree, CO2Emission vb.) buraya aktarılıyor */}
        <ImpactDashboard 
          riskScore={analysisData?.riskDegree || 0} 
          co2Emission={analysisData?.CO2Emission || 0}
          recoveredValue={analysisData?.cost || 0}
          waterImpact={analysisData?.cleanWater || 0}
        />

        {/* Feature Section: Nasıl Çalışır? */}
        <section className="max-w-[1280px] mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Nasıl Çalışır?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Teknoloji ve lojistiği birleştirerek e-atık yönetimini kolaylaştırıyoruz.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FeatureCard 
              title="Bireysel Kullanıcılar"
              description="E-atıklarınızı evinizden çıkmadan güvenle dönüştürün."
              mainIcon="person"
              subFeatures={[
                { icon: 'add_a_photo', title: 'Fotoğraf Yükle', description: 'Cihazını sisteme yükle, değerini öğren.' },
                { icon: 'battery_alert', title: 'Pil Güvenliği', description: 'Şişmiş piller için özel güvenlik rehberi al.', iconColor: 'text-amber-500' },
                { icon: 'local_shipping', title: 'Ücretsiz Alım', description: 'Kuryemiz kapına gelsin.', iconColor: 'text-accent' }
              ]}
            />
            <FeatureCard 
              title="Akıllı Toplama Sistemi"
              description="Teknoloji destekli lojistik ağımız ile karbon ayak izini en aza indiriyoruz."
              mainIcon="hub"
              subFeatures={[
                { icon: 'map', title: 'Bölgesel Kümelenme', description: 'Mahalledeki talepleri birleştirerek lojistik verimliliğini artırıyoruz.' },
                { icon: 'alt_route', title: 'Rota Optimizasyonu', description: 'Yapay zeka ile kuryelerimiz için en kısa rotalar.' },
                { icon: 'storefront', title: 'Teslim Noktaları', description: 'Dilersen en yakın güvenli toplama noktasına kendin bırak.' }
              ]}
            />
          </div>
        </section>
      </main>

      {/* ATIK BİLDİRİM MODALI: Sadece isModalOpen true olduğunda görünür */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <WasteSubmissionModal 
            onClose={() => setIsModalOpen(false)} 
            onAnalysisComplete={(data: any) => setAnalysisData(data)} 
          />
        </div>
      )}
    </div>
  );
};

export default Home;