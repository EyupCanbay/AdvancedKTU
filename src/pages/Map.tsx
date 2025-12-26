import { MapSidebar } from '../features/home/components/MapSideBar';
import { Navbar } from '../components/layout/Navbar';
import { useState } from 'react';

export default function Map() {
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);

  const handleOpenWasteModal = () => {
    setIsWasteModalOpen(true);
  };

  const handleCloseWasteModal = () => {
    setIsWasteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-dark to-background-dark flex flex-col">
      <Navbar onOpenWasteModal={handleOpenWasteModal} />
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <MapSidebar />
        
        {/* Map Container */}
        <div className="flex-1 bg-gradient-to-br from-[#1a2c2e] to-[#112022] flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="material-symbols-outlined text-6xl text-primary mb-4 opacity-50">map</span>
            <h2 className="text-2xl font-display font-extrabold text-white mb-2">Harita Entegrasyonu</h2>
            <p className="text-gray-400 max-w-md">
              Buraya Google Maps veya başka bir harita servisi entegre edilecek. Atık toplama merkezleri harita üzerinde gösterilecektir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
