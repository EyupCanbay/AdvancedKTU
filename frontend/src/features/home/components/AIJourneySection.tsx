import React from 'react';

/**
 * AIJourneySection - 3 Adımlı süreci animasyonlu ve 
 * holografik efektlerle sunan modernize edilmiş bileşen
 */
export const AIJourneySection = ({ onStartClick }: { onStartClick: () => void }) => {
  const steps = [
    { 
      icon: 'photo_camera', 
      title: '1. Fotoğrafla', 
      desc: 'Eski cihazının fotoğrafını sisteme yükle veya kameranla tara.', 
      color: 'text-primary',
      glow: 'shadow-primary/20',
      delay: 'delay-[100ms]'
    },
    { 
      icon: 'psychology', 
      title: '2. AI Analiz', 
      desc: 'Gemini AI, cihazındaki nadir metalleri ve karbon salınımını hesaplasın.', 
      color: 'text-accent',
      glow: 'shadow-accent/20',
      delay: 'delay-[300ms]'
    },
    { 
      icon: 'workspace_premium', 
      title: '3. Etkini Gör', 
      desc: '18 atık hedefine yaklaşırken doğaya kazandırdığın değerleri raporla.', 
      color: 'text-white',
      glow: 'shadow-white/10',
      delay: 'delay-[500ms]'
    }
  ];

  return (
    <section className="py-32 px-6 md:px-10 border-t border-border-dark bg-background-dark/30 relative overflow-hidden">
      
      {/* ARKA PLAN AMBİYANSI: Yüzen Işık Blobları */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 size-[500px] bg-primary/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 left-0 size-[500px] bg-accent/5 blur-[120px] rounded-full animate-pulse-slow"></div>
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="text-center mb-20 animate-fade-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            3 Adımda Dünyayı <span className="text-primary italic relative">
              Değiştir
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></span>
            </span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Geleceği kurtarmak hiç bu kadar teknolojik olmamıştı. Süreç nasıl işliyor?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 relative">
          
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-40"></div>
  <div className="absolute inset-0 animate-data-flow bg-[radial-gradient(circle,rgba(20,170,184,0.8)_2px,transparent_2px)] bg-[length:40px_4px]"></div>
</div>


          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`group relative glass-panel p-10 rounded-[48px] border border-white/5 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 animate-fade-up opacity-0 fill-mode-forwards ${step.delay}`}
            >
              {/* Adım Numarası (Holografik) */}
              <div className="absolute -top-6 -left-2 text-8xl font-black text-white/[0.03] pointer-events-none group-hover:text-primary/5 transition-colors">
                0{index + 1}
              </div>

              {/* İkon Rozeti ve Nabız Parlaması */}
              <div className="relative mb-8 w-fit mx-auto md:mx-0">
                <div className={`absolute inset-0 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-current ${step.color}`}></div>
                <div className="relative z-10 size-20 rounded-[24px] bg-surface-dark/80 border border-white/10 flex items-center justify-center shadow-2xl group-hover:rotate-[10deg] transition-transform">
                  <span className={`material-symbols-outlined text-5xl ${step.color} animate-pulse-slow`}>
                    {step.icon}
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors text-center md:text-left">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed text-center md:text-left group-hover:text-gray-300 transition-colors italic">
                {step.desc}
              </p>

              {/* Dekoratif Köşe Parlaması */}
              <div className={`absolute bottom-0 right-0 size-24 bg-gradient-to-br from-transparent to-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            </div>
          ))}
        </div>

        {/* ANA BUTON: Radyal Parlama Efektiyle */}
        <div className="flex justify-center animate-fade-up delay-700 opacity-0 fill-mode-forwards">
          <button 
            onClick={onStartClick}
            className="group relative px-12 py-6 overflow-hidden rounded-2xl bg-primary font-black text-background-dark uppercase tracking-[0.2em] shadow-[0_0_30px_-5px_rgba(20,170,184,0.5)] hover:shadow-[0_0_50px_-5px_rgba(20,170,184,0.8)] transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
            <div className="relative flex items-center justify-center gap-3">
              Sistemi Hemen Dene
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">rocket_launch</span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};