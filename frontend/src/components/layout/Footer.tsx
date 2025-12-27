import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0d181a] border-t border-border-dark pt-16 pb-8 px-4 md:px-10">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* LOGO VE MOTTO */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <span className="material-symbols-outlined text-3xl text-primary group-hover:rotate-180 transition-transform duration-700">
                recycling
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white">
                E-Atık <span className="text-primary">Koruyucuları</span>
              </h2>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[240px]">
              Doğa için teknoloji, gelecek için dönüşüm. Mol-e ile her atık birer kaynağa dönüşüyor.
            </p>
          </div>

          {/* HIZLI ERİŞİM */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Sistem</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-gray-500 hover:text-primary transition-colors text-sm">Ana Sayfa</Link>
              <Link to="/impact" className="text-gray-500 hover:text-primary transition-colors text-sm">Etki Dashboard</Link>
              <Link to="/centers" className="text-gray-500 hover:text-primary transition-colors text-sm">Toplama Noktaları</Link>
            </nav>
          </div>

          {/* KURUMSAL */}
<div className="flex flex-col gap-4">
  <h4 className="text-white font-bold text-sm uppercase tracking-widest">Kurumsal</h4>
  <nav className="flex flex-col gap-2">
    <Link to="/about" className="text-gray-500 hover:text-primary transition-colors text-sm">Hakkımızda</Link>
    <Link to="/privacy" className="text-gray-500 hover:text-primary transition-colors text-sm">Gizlilik Politikası</Link>
    <Link to="/terms" className="text-gray-500 hover:text-primary transition-colors text-sm">Kullanım Şartları</Link>
    <Link to="/contact" className="text-gray-500 hover:text-primary transition-colors text-sm">İletişim</Link>
  </nav>
</div>

          {/* İLETİŞİM VE SOSYAL */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Takip Edin</h4>
    <div className="flex gap-4 mb-4">
  {/* Paylaş İkonu - Tıklanılamaz hale getirildi */}
  <div className="size-10 rounded-lg bg-surface-dark flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all cursor-default">
    <span className="material-symbols-outlined text-xl">share</span>
  </div>

  {/* Mail İkonu - Tıklanılamaz hale getirildi */}
  <div className="size-10 rounded-lg bg-surface-dark flex items-center justify-center text-gray-400 hover:text-accent hover:bg-accent/10 transition-all cursor-default">
    <span className="material-symbols-outlined text-xl">mail</span>
  </div>
</div>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
              Erzurum Hackathon 2025 <br/> Advanced KTU Team
            </p>
          </div>
        </div>

        {/* ALT BİLGİ VE COPYRIGHT */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 pt-8">
          <p className="text-xs text-gray-600 font-medium">
            © {currentYear} <span className="text-white">E-Atık Koruyucuları</span>. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-2">
             <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Sistem Durumu: Aktif</span>
          </div>
        </div>
      </div>
    </footer>
  );
};