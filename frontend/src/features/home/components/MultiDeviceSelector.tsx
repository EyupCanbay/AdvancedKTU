/**
 * MultiDeviceSelector Component - Simplified Description Input
 * Sadece cihaz açıklaması alır, sınırsız cihaz
 */

import React, { useState } from 'react';
import { DeviceForm } from './DeviceForm';
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

  const handleAddDescription = (desc: string) => {
    setDescription(desc);
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert('Lütfen cihaz açıklaması girin');
      return;
    }

    setIsSubmitting(true);
    try {
      // API'ye sadece description gönder
      const result = await submitMultipleDevices({
        description: description.trim(),
      });
      console.log('Cihazlar başarıyla gönderildi:', result);
      onDevicesSelected(result);
    } catch (error) {
      console.error('Cihaz gönderimi hatası:', error);
      alert('Cihazlar gönderilirken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
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
        </div>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-white transition-colors p-2"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Açıklama Formu */}
        <DeviceForm
          onSubmit={handleAddDescription}
          onCancel={onCancel}
        />

        {/* Gönder Butonu */}
        <div className="flex gap-3 pt-4 border-t border-border-dark">
          <button
            onClick={handleSubmit}
            disabled={!description.trim() || isSubmitting}
            className={`flex-1 h-12 font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              description.trim() && !isSubmitting
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

        {/* Bilgi Mesajı */}
        {description.trim() && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start gap-2">
            <span className="material-symbols-outlined text-blue-400 flex-shrink-0 mt-1">check_circle</span>
            <p className="text-blue-300 text-sm">
              Açıklama hazır. Göndermek için tıklayın.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
