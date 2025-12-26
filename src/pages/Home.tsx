import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { ImpactDashboard } from '../features/home/components/ImpactDashboard';
import { ImpactAwareness } from '../features/home/components/ImpactAwareness';
import { WasteSubmissionModal } from '../features/home/components/WasteSubmissionModal';

export default function Home() {
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);

  const handleOpenWasteModal = () => {
    setIsWasteModalOpen(true);
  };

  const handleCloseWasteModal = () => {
    setIsWasteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-dark to-background-dark">
      <Navbar onOpenWasteModal={handleOpenWasteModal} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <ImpactDashboard />
        <ImpactAwareness />
      </main>
      {isWasteModalOpen && (
        <WasteSubmissionModal onClose={handleCloseWasteModal} />
      )}
    </div>
  );
}