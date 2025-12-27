import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const ContactPage = () => {
  // Durum Yönetimi (Simülasyon için)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 2 saniyelik "Gönderiliyor" dümenden bekleme
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <div className="bg-background-dark min-h-screen font-display text-white overflow-x-hidden flex flex-col">
      <Navbar onAtikBildirClick={() => {}} />

      <main className="flex-grow relative w-full py-16 md:py-24 px-4 md:px-10">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
            <span className="inline-block px-3 py-1 mb-5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
              İletişim
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight uppercase italic">
              Bize <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Ulaşın</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed italic">
              Sorularınız veya iş birlikleri için Advanced KTU ekibiyle iletişime geçin.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* SOL TARAF: İLETİŞİM KARTLARI */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <ContactCard icon="mail" title="E-posta" info="iletisim@e-atikkoruyuculari.com" link="mailto:iletisim@e-atikkoruyuculari.com" delay={0.1} />
              <ContactCard icon="location_on" title="Konum" info="KTÜ Teknokent, Trabzon/Türkiye" link="#" delay={0.2} />
              <ContactCard icon="groups" title="Hackathon Ekibi" info="Advanced KTU Team" link="#" delay={0.3} />
            </div>

            {/* SAĞ TARAF: FORM VEYA BAŞARI EKRANI */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              className="lg:col-span-3 glass-panel border border-white/5 rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-2xl min-h-[500px] flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div key="form" exit={{ opacity: 0, scale: 0.9 }} className="w-full relative z-10">
                    <h3 className="text-2xl font-black italic uppercase mb-8">Mesaj Gönderin</h3>
                    <form className="space-y-6" onSubmit={handleFakeSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Adınız Soyadınız" type="text" icon="person" placeholder="Adınız" required />
                        <InputGroup label="E-posta Adresiniz" type="email" icon="mail" placeholder="ornek@mail.com" required />
                      </div>
                      <InputGroup label="Konu" type="text" icon="topic" placeholder="Mesajınızın konusu" required />
                      <div className="group relative">
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider ml-1">Mesajınız</label>
                        <textarea rows={4} placeholder="Aklınızdakileri bize yazın..." className="w-full bg-background-dark/50 border border-border-dark rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary transition-all resize-none" required />
                        <span className="material-symbols-outlined absolute top-10 left-4 text-gray-500">chat</span>
                      </div>
                      <button 
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full py-5 bg-gradient-to-r from-primary to-blue-600 rounded-2xl text-white font-black uppercase tracking-widest hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <><span>GÖNDERİLİYOR...</span><span className="animate-spin material-symbols-outlined">sync</span></>
                        ) : (
                          <><span>GÖNDER</span><span className="material-symbols-outlined">send</span></>
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  // BAŞARI EKRANI (DÜMENDEN)
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center flex flex-col items-center gap-6">
                    <div className="size-24 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-glow">
                      <span className="material-symbols-outlined text-6xl">verified</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black uppercase italic italic">Mesajınız Alındı!</h3>
                      <p className="text-gray-400 italic">Advanced KTU ekibi en kısa sürede size dönüş yapacak.</p>
                    </div>
                    <button 
                      onClick={() => setIsSuccess(false)}
                      className="text-primary font-black uppercase tracking-widest text-sm hover:underline"
                    >
                      Yeni Mesaj Gönder
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Yardımcı Alt Bileşenler (Değişmedi)
const ContactCard = ({ icon, title, info, link, delay }: any) => (
  <motion.a href={link} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }} className="group flex items-start gap-6 p-8 glass-panel border border-white/5 rounded-[32px] hover:border-primary/30 transition-all relative overflow-hidden">
    <div className="relative z-10 size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-3xl">{icon}</span></div>
    <div className="relative z-10"><h3 className="text-xl font-black italic uppercase mb-2">{title}</h3><p className="text-gray-400 text-sm font-medium break-all">{info}</p></div>
  </motion.a>
);

const InputGroup = ({ label, type, icon, placeholder, required }: any) => (
  <div className="group relative">
    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative">
      <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 group-focus-within:text-primary transition-colors">{icon}</span>
      <input type={type} placeholder={placeholder} required={required} className="w-full bg-background-dark/50 border border-border-dark rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary transition-all h-14" />
    </div>
  </div>
);