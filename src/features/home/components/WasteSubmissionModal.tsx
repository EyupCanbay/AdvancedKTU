import { useState } from 'react';

interface WasteSubmissionModalProps {
  onClose: () => void;
}

export const WasteSubmissionModal = ({ onClose }: WasteSubmissionModalProps) => {
  const [isBatteryWarning, setIsBatteryWarning] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* Arka Plan Karartma */}
      <div 
        className="absolute inset-0 bg-[#112022]/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Glass Card Panel */}
      <div className="w-full max-w-2xl relative z-10 animate-in fade-in zoom-in duration-300">
        <div className="backdrop-blur-xl bg-[#1a2c2e]/90 border border-[#244447]/50 rounded-2xl shadow-[0_0_40px_-10px_rgba(20,170,184,0.1)] p-8 md:p-10 relative overflow-hidden group">
          
          {/* Kapatma Butonu */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          {/* Dekoratif Üst Çizgi */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#14aab8]/50 to-transparent" />

          {/* Header Bölümü */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14aab8]/10 border border-[#14aab8]/20 text-[#14aab8] text-xs font-bold mb-4">
              <span className="material-symbols-outlined text-base">science</span>
              AI DESTEKLİ ANALİZ
            </div>
            <h2 className="font-display font-extrabold text-3xl text-white mb-3 tracking-tight">Atık Bildirim Paneli</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">Eski cihazınızı yapay zeka ile analiz edin, geri dönüşüm değerini öğrenin.</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Cihaz Bilgisi */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-300 ml-1">Cihaz Bilgisi</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#14aab8] transition-colors">devices</span>
                <input 
                  className="w-full h-12 bg-[#1a2c2e] border border-[#244447] rounded-xl pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#14aab8] focus:ring-1 focus:ring-[#14aab8] transition-all" 
                  placeholder="Örn: iPhone 11, Samsung S20"
                />
              </div>
            </div>

            {/* Fotoğraf Yükleme Alanı */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-300 ml-1">Cihaz Fotoğrafı</label>
              <div className="relative w-full group/upload cursor-pointer border-2 border-dashed border-[#346165] rounded-xl bg-[#1a2c2e]/40 hover:bg-[#1a2c2e]/80 hover:border-[#14aab8]/50 transition-all p-8 flex flex-col items-center justify-center gap-3">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="w-14 h-14 rounded-full bg-[#244447] flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-[#14aab8]">add_a_photo</span>
                </div>
                <p className="text-white font-bold">Fotoğrafı Seçin</p>
                <span className="text-xs text-gray-500">JPG, PNG - Max 5MB</span>
              </div>
            </div>

            {/* Güvenlik Kontrolü */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#1a2c2e]/50 border border-transparent hover:border-[#244447] transition-all">
                <input 
                  type="checkbox" 
                  id="bat-check" 
                  className="w-5 h-5 rounded border-[#346165] bg-transparent text-[#14aab8] focus:ring-0" 
                  onChange={(e) => setIsBatteryWarning(e.target.checked)}
                />
                <label htmlFor="bat-check" className="text-white text-sm cursor-pointer">Cihazın bataryasında şişme veya akma var mı?</label>
              </div>

              {isBatteryWarning && (
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f59e0b]/5 border border-[#f59e0b]/30 animate-in slide-in-from-top-2">
                  <span className="material-symbols-outlined text-[#f59e0b]">warning</span>
                  <p className="text-gray-300 text-xs">
                    <b className="text-[#f59e0b]">DİKKAT:</b> Şişmiş piller risk taşır. Lütfen gönderimden önce rehberimizi inceleyin.
                  </p>
                </div>
              )}
            </div>

            {/* Gönder Butonu */}
            <button className="w-full h-14 bg-[#14aab8] hover:bg-[#0e7c86] text-white font-display font-extrabold text-lg rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
              Atığı Analiz Et ve Bildir
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};