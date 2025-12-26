import React from 'react';

export const NearestCenterCard = () => (
  <div className="glass-panel rounded-xl p-4 border-l-4 border-l-primary relative overflow-hidden group hover:border-l-accent transition-all cursor-pointer text-left mt-auto">
    <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-2">
      En Yakın Merkez
    </span>
    <h4 className="text-lg font-bold text-white mb-1 font-display">Kadıköy Geri Dönüşüm Üssü</h4>
    <p className="text-gray-400 text-sm mb-3 font-body">Caferağa Mah. Moda Cd. No:12</p>
    <div className="flex gap-4 text-sm border-t border-border-dark pt-3">
      <span className="flex items-center gap-1 text-white">
        <span className="material-symbols-outlined text-primary text-lg">local_shipping</span> 12
      </span>
      <span className="flex items-center gap-1 text-white">
        <span className="material-symbols-outlined text-accent text-lg">eco</span> 850kg
      </span>
    </div>
  </div>
);