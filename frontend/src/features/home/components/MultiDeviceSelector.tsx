/**
 * MultiDeviceSelector Component - Simplified Description Input
 * Sadece cihaz açıklaması alır, sınırsız cihaz
 */

import React, { useState, useEffect } from 'react';
import { submitMultipleDevices } from '../../../services/api';

interface MultiDeviceSelectorProps {
  onDevicesSelected: (data: any) => void;
  onCancel: () => void;
}

export const MultiDeviceSelector: React.FC<MultiDeviceSelectorProps> = ({
  onDevicesSelected,
  onCancel,
}) => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Sayfa açıldığında otomatik konum al
  useEffect(() => {
    console.log('📍 [MultiDevice] Konum alınıyor...');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(coords);
          console.log('✅ [MultiDevice] Konum alındı:', coords);
        },
        (error) => {
          console.error('❌ [MultiDevice] Konum hatası:', error);
          setLocationError('Konumunuza erişilemedi. Lütfen konum izni verin.');
        }
      );
    } else {
      setLocationError('Tarayıcınız konum özelliğini desteklemiyor.');
    }
  }, []);

  const handleAddDescription = (desc: string) => {
    setDescription(desc);
  };

  const handleSubmit = async () => {
    // Validation
    if (!description.trim()) {
      alert('Lütfen cihaz açıklaması girin');
      return;
    }

    if (description.trim().length < 5) {
      alert('Açıklama en az 5 karakter olmalıdır');
      return;
    }

    if (!location) {
      alert('Lütfen konumunuzun alındığından emin olun.\n\nKonum izni vermediyseniz, tarayıcınızın adres çubuğundaki konum simgesine tıklayın ve izin verin.');
      return;
    }

    console.log('🚀 [MultiDevice] Toplu cihaz gönderimi başlatılıyor...');
    console.log('📝 [MultiDevice] Açıklama:', description.trim());
    console.log('📍 [MultiDevice] Konum:', location);

    setIsSubmitting(true);
    try {
      // API'ye description ve konum gönder
      console.log('📤 [MultiDevice] submitMultipleDevices çağrılıyor...');
      const result = await submitMultipleDevices({
        description: description.trim(),
        latitude: location.latitude,
        longitude: location.longitude,
      });
      console.log('✅ [MultiDevice] Cihazlar başarıyla gönderildi:', result);
      onDevicesSelected(result);
    } catch (error: any) {
      console.error('❌ [MultiDevice] Cihaz gönderimi hatası:', error);
      console.error('💥 [MultiDevice] Hata detayı:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      alert(`Cihazlar gönderilirken hata oluştu:\n${error.message || 'Lütfen tekrar deneyin.'}`);
    } finally {
      setIsSubmitting(false);
      console.log('🏁 [MultiDevice] İşlem tamamlandı');
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl w-full max-w-2xl bg-[#1a2c2e]/95 backdrop-blur-2xl border border-white/10 shadow-glow">
      {/* Başlık */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-accent">devices</span>
            3+ Cihaz Bildir
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Cihazlarınız hakkında ayrıntılı açıklama yazın
          </p>
          {/* Konum Durumu */}
          {location ? (
            <div className="flex items-center gap-2 mt-2 text-green-400 text-sm">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>Konumunuz alındı</span>
            </div>
          ) : locationError ? (
            <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{locationError}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-2 text-yellow-400 text-sm">
              <span className="material-symbols-outlined text-base animate-spin">refresh</span>
              <span>Konum alınıyor...</span>
            </div>
          )}
        </div>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-white transition-colors p-2"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Açıklama Formu - Direkt Form */}
        <div className="space-y-4 p-4 bg-background-dark/50 rounded-xl border border-border-dark">
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Cihazlar Hakkında Açıklama *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Örn: 3 adet eski telefon, 2 adet tablet, 1 eski laptop..."
              rows={6}
              maxLength={1000}
              className="w-full px-4 py-3 bg-surface-dark border border-border-dark rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
            />
            <p className="text-gray-400 text-xs mt-2">
              {description.length} / 1000 karakter
            </p>
          </div>
        </div>

        {/* Gönder Butonu */}
        <div className="flex gap-3 pt-4 border-t border-border-dark">
          <button
            onClick={handleSubmit}
            disabled={!description.trim() || !location || isSubmitting}
            className={`flex-1 h-12 font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              description.trim() && location && !isSubmitting
                ? 'bg-accent hover:bg-accent-dark text-background-dark shadow-glow'
                : 'bg-border-dark text-gray-600 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                Gönderiliyor...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">check_circle</span>
                Cihazları Bildir
              </>
            )}
          </button>

          <button
            onClick={onCancel}
            className="flex-1 h-12 bg-border-dark hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
          >
            İptal
          </button>
        </div>

        {/* Bilgi Mesajları */}
        {description.trim() && location && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-2">
            <span className="material-symbols-outlined text-green-400 flex-shrink-0 mt-1">check_circle</span>
            <p className="text-green-300 text-sm">
              ✅ Açıklama ve konum hazır. Göndermek için yukarıdaki butona tıklayın.
            </p>
          </div>
        )}
        {description.trim() && !location && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2">
            <span className="material-symbols-outlined text-yellow-400 flex-shrink-0 mt-1">warning</span>
            <p className="text-yellow-300 text-sm">
              ⚠️ Konum bilgisi alınamadı. Lütfen tarayıcınızın konum iznini kontrol edin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
