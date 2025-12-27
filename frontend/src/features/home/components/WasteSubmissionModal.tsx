import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeWasteImage } from '../../../services/api';
import { MultiDeviceSelector } from './MultiDeviceSelector';

type SubmissionMode = 'initial' | 'single' | 'multiple';

export const WasteSubmissionModal = ({ onClose, onAnalysisComplete }: any) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<SubmissionMode>('initial');
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

  const handleMultipleDevicesSelected = (data: any) => {
    console.log('Cihazlar başarıyla gönderildi:', data);
    setSuccess(true);

    setTimeout(() => {
      // Harita sayfasına yönlendir
      navigate('/select-center', { 
        state: { 
          data: data,
          submissionType: 'multiple'
        } 
      }); 
      onClose();
    }, 2000);
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
    <>
      {/* ÇOKLU CİHAZ SEÇİM PANELI */}
      {mode === 'multiple' && (
        <MultiDeviceSelector
          onDevicesSelected={handleMultipleDevicesSelected}
          onCancel={() => setMode('initial')}
        />
      )}

      {/* BAŞLANGIÇ EKRANI - MOD SEÇİMİ */}
      {mode === 'initial' && (
        <div className="glass-panel p-8 rounded-3xl w-full max-w-lg bg-[#1a2c2e]/95 backdrop-blur-2xl border border-white/10 shadow-glow">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-accent">eco</span>
              Atık Bildirimi
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Tek Atık Kartı */}
            <button
              onClick={() => setMode('single')}
              className="w-full p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 hover:border-primary hover:from-primary/20 rounded-2xl transition-all group text-left"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                  <span className="material-symbols-outlined text-primary text-2xl">image</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">Fotoğraf ile Analiz Et</h3>
                  <p className="text-gray-400 text-sm">Tek bir cihazın fotoğrafını yükleme</p>
                </div>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </button>

            {/* Çoklu Atık Kartı */}
            <button
              onClick={() => setMode('multiple')}
              className="w-full p-6 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 hover:border-accent hover:from-accent/20 rounded-2xl transition-all group text-left"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/20 rounded-lg group-hover:bg-accent/30 transition-colors">
                  <span className="material-symbols-outlined text-accent text-2xl">devices</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">3+ Cihaz Ekle</h3>
                  <p className="text-gray-400 text-sm">Birden fazla cihaz için detaylı bilgiler gir</p>
                </div>
                <span className="material-symbols-outlined text-accent group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm flex items-start gap-2">
              <span className="material-symbols-outlined text-sm flex-shrink-0">info</span>
              Her iki seçenek de doğaya olan etkini ölçmeye yardımcı olur.
            </p>
          </div>
        </div>
      )}

      {/* TEK ATIK KARTINI ANALIZ EKRANI */}
      {mode === 'single' && (
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
                <div className="flex gap-2">
                  {!loading && (
                    <>
                      <button 
                        onClick={() => setMode('initial')}
                        className="text-gray-500 hover:text-white transition-colors"
                        title="Geri dön"
                      >
                        <span className="material-symbols-outlined">arrow_back</span>
                      </button>
                      <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </>
                  )}
                </div>
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
      )}
    </>
  );
};