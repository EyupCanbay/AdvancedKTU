import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const PrivacyPolicyPage = () => {
  return (
    <div className="bg-background-dark min-h-screen font-display text-white overflow-x-hidden flex flex-col">
      <Navbar onAtikBildirClick={() => {}} />

      <main className="flex-grow flex flex-col items-center w-full px-4 md:px-10 py-16 md:py-24 relative">
        {/* Arka Plan Dekoratif Işıklar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-primary/5 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[1000px] mx-auto relative z-10">
          {/* Hero Bölümü */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider border border-accent/20">
              Şeffaflık & Güven
            </span>
            <h1 className="text-white text-4xl md:text-6xl font-black mb-6 tracking-tight italic uppercase">
              Gizlilik <span className="text-primary">Politikası</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              E-Atık Koruyucuları olarak kişisel verilerinize saygı duyuyor ve onları en yüksek güvenlik standartlarıyla koruyoruz.
            </p>
            <p className="text-gray-500 text-sm mt-6 font-mono opacity-60">Son Güncelleme: 24 Ekim 2023</p>
          </motion.div>

          {/* Akordeon Bölümleri */}
          <div className="flex flex-col gap-6">
            <PrivacySection 
              icon="dataset" 
              title="Veri Toplama" 
              delay={0.1}
              content={(
                <>
                  <p className="mb-4">Hizmetlerimizi güvenli sunmak için aşağıdaki kategorileri toplamaktayız:</p>
                  <ul className="space-y-3">
                    <ListPoint title="Kimlik Bilgileri" text="Ad, soyad ve hesap bilgileri." />
                    <ListPoint title="İletişim Bilgileri" text="E-posta, telefon ve atık toplama adresi." />
                    <ListPoint title="Cihaz Verileri" text="Yüklenen fotoğraflar, marka/model ve atık durumu." />
                    <ListPoint title="Konum Verileri" text="En yakın toplama noktası önerileri için GPS bilgisi." />
                  </ul>
                </>
              )}
            />

            <PrivacySection 
              icon="schema" 
              title="Veri Kullanımı" 
              delay={0.2}
              content={(
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GridBox icon="local_shipping" title="Lojistik" text="Kurye rotalarının optimizasyonu ve planlama." />
                  <GridBox icon="analytics" title="Etki Raporlama" text="Kişisel karbon ayak izi tasarrufunun hesaplanması." />
                  <GridBox icon="security" title="Güvenlik" text="Tehlikeli atıkların fotoğraflar üzerinden tespiti." />
                  <GridBox icon="gavel" title="Yasal Uyumluluk" text="Atık yönetimi mevzuatına uygun kayıt tutma." />
                </div>
              )}
            />

            <PrivacySection 
              icon="lock" 
              title="Veri Koruma" 
              delay={0.3}
              content={(
                <>
                  <p className="mb-4">Verileriniz endüstri standardı SSL/TLS şifreleme protokolleri ile korunmaktadır.</p>
                  <div className="mt-6 p-5 border-l-4 border-accent bg-accent/5 rounded-r-2xl">
                    <h5 className="text-white font-bold mb-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-accent">verified_user</span>
                      Veri Satışı Yoktur
                    </h5>
                    <p className="text-gray-300 text-sm italic">Kişisel verilerinizi asla üçüncü taraf reklam şirketlerine satmaz veya kiralamayız.</p>
                  </div>
                </>
              )}
            />

            <PrivacySection 
              icon="balance" 
              title="Haklarınız" 
              delay={0.4}
              content={(
                <ul className="space-y-4">
                  <RightItem icon="visibility" text="Verilerinize erişme ve bilgi talep etme hakkı." />
                  <RightItem icon="delete" text="Verilerinizin silinmesini (Unutulma Hakkı) talep etme hakkı." />
                  <RightItem icon="edit" text="Yanlış verilerin düzeltilmesini isteme hakkı." />
                </ul>
              )}
            />
          </div>

          {/* İletişim Bloğu */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-20 text-center"
          >
            <div className="inline-flex flex-col items-center gap-4 p-10 rounded-[40px] bg-gradient-to-b from-surface-dark to-background-dark border border-border-dark max-w-lg w-full shadow-glow">
              <h3 className="text-white text-xl font-bold italic uppercase tracking-widest">Sorularınız mı var?</h3>
              <p className="text-gray-400 text-sm italic">Gizlilik politikamız hakkında daha fazla bilgi için bize ulaşın.</p>
              <a href="mailto:gizlilik@e-atikkoruyuculari.com" className="flex items-center gap-2 text-primary hover:text-accent font-black transition-all">
                <span className="material-symbols-outlined">mail</span>
                gizlilik@e-atikkoruyuculari.com
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Alt Bileşenler
const PrivacySection = ({ icon, title, content, delay }: any) => (
  <motion.details 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="group bg-surface-dark/40 border border-border-dark rounded-3xl overflow-hidden transition-all duration-300 open:border-primary/50 open:bg-surface-dark/60"
  >
    <summary className="flex items-center justify-between p-8 cursor-pointer select-none">
      <div className="flex items-center gap-6">
        <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-open:bg-primary group-open:text-background-dark transition-all">
          <span className="material-symbols-outlined text-2xl font-bold">{icon}</span>
        </div>
        <h3 className="text-white text-xl font-black italic tracking-tight uppercase">{title}</h3>
      </div>
      <span className="material-symbols-outlined text-gray-500 group-open:rotate-180 transition-transform">expand_more</span>
    </summary>
    <div className="px-8 md:px-24 pb-10 pt-2 text-gray-400 leading-relaxed border-t border-white/5 italic">
      {content}
    </div>
  </motion.details>
);

const ListPoint = ({ title, text }: any) => (
  <li className="flex items-start gap-3">
    <span className="material-symbols-outlined text-accent text-sm mt-1">radio_button_checked</span>
    <span><strong className="text-gray-200">{title}:</strong> {text}</span>
  </li>
);

const GridBox = ({ icon, title, text }: any) => (
  <div className="p-5 rounded-2xl bg-background-dark border border-border-dark hover:border-accent/30 transition-all group/box">
    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
      <span className="material-symbols-outlined text-accent text-lg group-hover/box:scale-110 transition-transform">{icon}</span>
      {title}
    </h4>
    <p className="text-xs leading-relaxed">{text}</p>
  </div>
);

const RightItem = ({ icon, text }: any) => (
  <li className="flex items-center gap-4 p-4 rounded-2xl bg-background-dark/50 border border-transparent hover:border-primary/30 transition-all">
    <span className="material-symbols-outlined text-primary">{icon}</span>
    <span className="text-sm font-medium">{text}</span>
  </li>
);