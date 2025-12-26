import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { MapSidebar } from '../features/home/components/MapSideBar'; // Yolunu kontrol et

const CentersPage = () => {
  return (
    <div className="bg-background-dark min-h-screen flex flex-col font-display">
      <Navbar />
      <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
        {/* Sol Kenar Çubuğu (Filtreler ve Liste) */}
        <MapSidebar />

        {/* Sağ Taraf: Harita Alanı */}
        <main className="flex-grow relative bg-[#0f1a1c] flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-border-dark mb-4">map</span>
            <h3 className="text-white text-xl font-bold">İnteraktif Harita</h3>
            <p className="text-gray-500 text-sm mt-2">Yakınınızdaki geri dönüşüm merkezleri burada görünecek.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CentersPage;