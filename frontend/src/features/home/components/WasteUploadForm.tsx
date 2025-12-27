// src/features/home/components/WasteUploadForm.tsx
import React, { useState } from 'react';
import { analyzeWasteImage } from '../../../services/api';

export const WasteUploadForm = ({ onAnalysisComplete }: { onAnalysisComplete: (data: any) => void }) => {
  const [loading, setLoading] = useState(false);
  // Değişiklik: path (string) yerine selectedFile (File) tutuyoruz
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      // Artık string değil, binary File objesini gönderiyoruz
      const data = await analyzeWasteImage(selectedFile); 
      onAnalysisComplete(data);
    } catch (err) {
      alert("AI Servisi (8081) çalışmıyor olabilir!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl max-w-2xl mx-auto my-12 border border-primary/20">
      <div className="flex flex-col items-center gap-6">
        {/* Değişiklik: type="text" yerine type="file" */}
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="w-full bg-background-dark border border-border-dark rounded-xl p-4 text-white"
        />
        <button 
          onClick={handleStartAnalysis}
          disabled={loading || !selectedFile}
          className="w-full h-14 bg-primary text-background-dark font-black rounded-xl"
        >
          {loading ? "AI Analiz Ediyor..." : "Analiz Et ve Gönder"}
        </button>
      </div>
    </div>
  );
};