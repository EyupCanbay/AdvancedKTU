import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeWasteImage } from '../../../services/api';

export const WasteSubmissionModal = ({ onClose, onAnalysisComplete }: any) => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0); // Simülasyon adımları
  const [success, setSuccess] = useState(false);

  const steps = [
    "Görsel verisi taranıyor...",
    "AI modeli ile nesne tanımlanıyor...",
    "Çevresel etki metrikleri hesaplanıyor...",
    "Final raporu hazırlanıyor..."
  ];

  // Dosya seçildiğinde önizleme oluştur
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file); // Binary dosyadan geçici URL
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async () => {
  if (!selectedFile) return;
  setLoading(true);

  try {
    const response = await analyzeWasteImage(selectedFile); 
    // Backend'den dönen 'response' bir Waste objesidir.
    
    if (response && response.ai_analysis) { 
      setSuccess(true);
      // SADECE analiz kısmını gönderiyoruz
      onAnalysisComplete(response.ai_analysis); 

      setTimeout(() => {
        // Milestone sayfasına stats ve wasteID gönderiyoruz
        navigate('/milestone', { 
          state: { 
            stats: response.ai_analysis,
            wasteID: response.id // Waste ID'yi ekledik
          } 
        }); 
        onClose();
      }, 2000);
    }
  } catch (error) {
    console.error("Hata:", error);
    setLoading(false);
  }
};

  return (
    <div className="glass-panel p-8 rounded-3xl w-full max-w-lg bg-[#1a2c2e]/95 backdrop-blur-2xl border border-white/10 shadow-glow">
      {success ? (
        // BAŞARI EKRANI
        <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in duration-500">
          <div className="size-24 bg-accent/20 rounded-full flex items-center justify-center text-accent mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <span className="material-symbols-outlined text-6xl">verified</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Analiz Tamam!</h2>
          <p className="text-text-subtle text-center">Doğaya katkın ölçüldü. Milestone sayfasına aktarılıyorsun...</p>
        </div>
      ) : (
        // FORM VE LOADING EKRANI
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">psychology</span>
              AI Atık Analizi
            </h2>
            {!loading && (
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>

          {/* FOTOĞRAF ÖNİZLEME ALANI */}
          <div className="relative group border-2 border-dashed border-border-dark rounded-2xl h-64 flex items-center justify-center overflow-hidden bg-background-dark/50">
            {previewUrl ? (
              <img src={previewUrl} alt="Atık Önizleme" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-500">
                <span className="material-symbols-outlined text-5xl">add_a_photo</span>
                <p className="text-sm font-bold">Analiz edilecek fotoğrafı seçin</p>
              </div>
            )}
            {!loading && (
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-20" 
              />
            )}
          </div>

          {/* LOADING SİMÜLASYONU */}
          {loading ? (
            <div className="mt-8 space-y-4">
              <div className="w-full bg-surface-dark h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-500" 
                  style={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-primary font-bold text-center animate-pulse flex items-center justify-center gap-2">
                <span className="animate-spin material-symbols-outlined text-sm">sync</span>
                {steps[loadingStep]}
              </p>
            </div>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={!selectedFile}
              className={`w-full h-16 mt-8 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                selectedFile ? "bg-primary text-background-dark shadow-glow hover:scale-[1.02]" : "bg-border-dark text-gray-600 cursor-not-allowed"
              }`}
            >
              Atığı Analiz Et ve Bildir <span className="material-symbols-outlined">analytics</span>
            </button>
          )}
        </>
      )}
    </div>
  );
};