/**
 * DeviceForm Component - Simplified Description Input
 * Sadece cihaz açıklaması alır
 */

import React, { useState } from 'react';

interface DeviceFormProps {
  onSubmit: (description: string) => void;
  onCancel: () => void;
}

export const DeviceForm: React.FC<DeviceFormProps> = ({ onSubmit, onCancel }) => {
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const validateForm = (): boolean => {
    if (!description.trim()) {
      setError('Cihaz açıklaması gereklidir');
      return false;
    }
    if (description.trim().length < 5) {
      setError('Açıklama en az 5 karakter olmalı');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(description.trim());

    // Form temizle
    setDescription('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-background-dark/50 rounded-xl border border-border-dark">
      {/* Açıklama Alanı */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Cihazlar Hakkında Açıklama *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Örn: 3 adet eski telefon, 2 adet tablet, 1 eski laptop..."
          rows={6}
          className={`w-full px-4 py-3 bg-surface-dark border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none ${
            error ? 'border-red-500' : 'border-border-dark'
          }`}
        />
        <p className="text-gray-400 text-xs mt-2">
          {description.length} / 1000 karakter
        </p>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>

      {/* Butonlar */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 h-10 bg-primary hover:bg-primary-dark text-background-dark font-bold rounded-lg transition-all active:scale-95"
        >
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">check</span>
            Kaydet
          </span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-10 bg-border-dark hover:bg-gray-700 text-white font-bold rounded-lg transition-all active:scale-95"
        >
          İptal
        </button>
      </div>
    </form>
  );
};
