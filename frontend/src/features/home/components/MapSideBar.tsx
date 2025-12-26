import React from 'react';
import { StatusCard } from './StatusCard';
import { NearestCenterCard } from './NearestCenterCard';

export const MapSidebar = () => {
  return (
    <aside className="w-full lg:w-[400px] flex flex-col border-b lg:border-b-0 lg:border-r border-border-dark bg-background-dark z-20 shadow-xl overflow-y-auto">
      <div className="p-6 lg:p-8 flex flex-col gap-6 h-full">
        {/* Başlık ve Açıklama */}
        <div className="flex flex-col gap-2 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-display">
            Atık Toplama <span className="text-primary">Noktaları</span>
          </h1>
          <p className="text-gray-400 text-sm font-body leading-relaxed">
            E-atıklarınızı güvenle geri dönüştürmek için size en yakın lisanslı toplama merkezini bulun.
          </p>
        </div>

        {/* Filtreleme Alanı */}
        <div className="flex flex-col gap-5 mt-2">
          <div className="flex flex-col gap-2 text-left">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 pl-1">
              Lokasyon Filtrele
            </label>
            <div className="relative group rounded-lg transition-all duration-300">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                location_city
              </span>
              <select className="w-full bg-surface-dark border border-border-dark text-white text-sm rounded-lg p-3.5 pl-10 appearance-none cursor-pointer outline-none focus:border-primary">
                <option>Şehir Seçiniz</option>
                <option value="istanbul">İstanbul</option>
              </select>
            </div>
          </div>
          
          <button className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary py-4 text-base font-bold text-white transition-all hover:bg-primary-dark shadow-lg active:scale-[0.98]">
            <span className="material-symbols-outlined group-hover:animate-spin">radar</span>
            Bölgeyi Tara
          </button>
        </div>

        {/* Gösterge Paneli */}
        <div className="grid grid-cols-2 gap-3">
          <StatusCard value="128" label="Aktif Merkez" color="text-accent" />
          <StatusCard value="24/7" label="Kurye Hizmeti" color="text-primary" />
        </div>

        {/* Alt Kısım: En Yakın Merkez */}
        <NearestCenterCard />
      </div>
    </aside>
  );
};