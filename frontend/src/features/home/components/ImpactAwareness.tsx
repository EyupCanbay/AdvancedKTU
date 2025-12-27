import React from 'react';
// Assets klasöründen görselleri import ediyoruz
// Not: Bu dosyaları klasöre eklediğinden emin ol
import batteryImg from '../../../assets/impact/battery-fire.jpg';
import toxicImg from '../../../assets/impact/toxic-water.jpg';
import wildlifeImg from '../../../assets/impact/wildlife-danger.jpg';

export const ImpactAwareness = () => {
  const dangers = [
    {
      title: "Batarya Bombası",
      desc: "Eski cihazlardaki lityum-iyon piller şişebilir ve patlayabilir. Tek bir hasarlı batarya, bir çöp kamyonunu saniyeler içinde alev topuna çevirebilir.",
      tag: "YANGIN RİSKİ",
      tagColor: "bg-orange-500/20 text-orange-500 border-orange-500/40",
      glowColor: "shadow-orange-500/20",
      icon: "local_fire_department",
      bgImage: batteryImg
    },
    {
      title: "Zehirli Sızıntı",
      desc: "Cıva, kurşun ve kadmiyum yeraltı sularına sızar. Bu 'Toksik Yeşil' akış, toprağı ve içme suyunu nesiller boyu zehirleyerek ekosistemi çökertir.",
      tag: "KİRLENME",
      tagColor: "bg-emerald-500/20 text-emerald-500 border-emerald-500/40",
      glowColor: "shadow-emerald-500/20",
      icon: "water_ph",
      bgImage: toxicImg
    },
    {
      title: "Değişen Yaşamlar",
      desc: "Hayvanlar e-atık plastiklerini yiyecek zanneder. Mikroplastikler ve ağır metaller besin zincirine karışarak sonunda soframıza geri döner.",
      tag: "BİYOLOJİK TEHDİT",
      tagColor: "bg-red-500/20 text-red-500 border-red-500/40",
      glowColor: "shadow-red-500/20",
      icon: "pets",
      bgImage: wildlifeImg
    }
  ];

  return (
    <section className="w-full bg-[#112022] px-4 md:px-10 py-32 border-t border-[#244447] relative overflow-hidden">
      {/* Dekoratif Doku */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
      
      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-white text-4xl md:text-6xl font-black mb-6 tracking-tighter">
            Sessiz Bir <span className="text-red-500 italic uppercase">Felaket</span>
          </h2>
          <p className="text-[#93c3c8] text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Evinizdeki her eski cihaz, doğa için birer saatli bomba. İşte görmezden gelinen gerçekler:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {dangers.map((danger, i) => (
            <div 
              key={i} 
              className={`group relative h-[520px] rounded-[48px] overflow-hidden border border-white/5 transition-all duration-700 hover:scale-[1.02] hover:border-white/20 shadow-2xl ${danger.glowColor} hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)]`}
            >
              {/* ARKA PLAN RESMİ */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{ backgroundImage: `url(${danger.bgImage})` }}
              ></div>
              
              {/* GRADIENT OVERLAY (Yazıların okunması için) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1415] via-[#0a1415]/85 to-transparent opacity-90"></div>

              {/* SAĞ ÜST BADGE */}
              <div className={`absolute top-8 right-8 px-4 py-1.5 rounded-full border text-[10px] font-black tracking-[0.2em] ${danger.tagColor} backdrop-blur-xl z-20`}>
                {danger.tag}
              </div>

              {/* İÇERİK ALANI */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end z-10">
                {/* İKON VE GLOW */}
                <div className="mb-8 relative w-fit">
                  <div className={`absolute inset-0 blur-3xl rounded-full opacity-40 group-hover:opacity-100 transition-opacity duration-500 ${danger.tagColor.split(' ')[0]}`}></div>
                  <div className="relative z-10 size-16 rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-2xl">
                    <span className={`material-symbols-outlined text-4xl ${danger.tagColor.split(' ')[1]}`}>
                      {danger.icon}
                    </span>
                  </div>
                </div>

                <h3 className="text-white text-3xl font-black mb-4 group-hover:text-primary transition-colors duration-300 tracking-tight">
                  {danger.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  {danger.desc}
                </p>
              </div>

              {/* ALT ÇİZGİ PARLAMASI */}
              <div className={`absolute bottom-0 left-0 h-2 w-0 group-hover:w-full transition-all duration-700 ${danger.tagColor.split(' ')[0].replace('/20', '')}`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};