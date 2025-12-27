/**
 * DeviceList Component - Single Responsibility Principle
 * Sadece cihaz listesini gösterir ve düzenleme işlemlerini yönetir
 */

import React from 'react';
import type { Device } from '../../../types/device';

interface DeviceListProps {
  devices: Device[];
  onRemove: (deviceId: string) => void;
}

const getConditionColor = (condition?: string): string => {
  switch (condition) {
    case 'good':
      return 'text-accent';
    case 'moderate':
      return 'text-yellow-500';
    case 'poor':
      return 'text-orange-500';
    default:
      return 'text-gray-400';
  }
};

const getConditionText = (condition?: string): string => {
  switch (condition) {
    case 'good':
      return 'İyi';
    case 'moderate':
      return 'Orta';
    case 'poor':
      return 'Kötü';
    default:
      return 'Bilinmiyor';
  }
};

export const DeviceList: React.FC<DeviceListProps> = ({ devices, onRemove }) => {
  const totalWeight = devices.reduce((sum, device) => sum + (device.weight || 0), 0);

  if (devices.length === 0) {
    return (
      <div className="text-center py-8 bg-background-dark/30 rounded-xl border border-border-dark/50">
        <span className="material-symbols-outlined text-4xl text-border-dark block mb-2">inbox</span>
        <p className="text-gray-400">Henüz cihaz eklenmemiş</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
        <span className="font-bold text-white">Toplam Cihaz: {devices.length}</span>
        {totalWeight > 0 && (
          <span className="text-accent font-bold">Toplam Ağırlık: {totalWeight.toFixed(1)} kg</span>
        )}
      </div>

      <div className="space-y-2">
        {devices.map((device) => (
          <div
            key={device.id}
            className="p-3 bg-surface-dark border border-border-dark rounded-lg flex items-center justify-between hover:border-primary/50 transition-colors group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-sm text-primary">devices</span>
                <h4 className="font-bold text-white">{device.name}</h4>
              </div>
              <div className="flex gap-3 text-xs text-gray-400">
                <span className="px-2 py-1 bg-background-dark rounded">
                  {device.category}
                </span>
                {device.weight && (
                  <span className="px-2 py-1 bg-background-dark rounded">
                    {device.weight} kg
                  </span>
                )}
                <span className={`px-2 py-1 bg-background-dark rounded font-bold ${getConditionColor(device.condition)}`}>
                  {getConditionText(device.condition)}
                </span>
              </div>
            </div>

            <button
              onClick={() => onRemove(device.id)}
              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              title="Cihazı kaldır"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
