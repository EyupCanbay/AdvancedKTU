import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const TermsOfServicePage = () => {
  return (
    <div className="bg-background-dark min-h-screen font-display text-white overflow-x-hidden flex flex-col">
      <Navbar onAtikBildirClick={() => {}} />

      <main className="flex-grow w-full bg-background-dark relative">
        {/* Dekoratif Gradyan Işık */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#14aab8]/5 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full px-4 md:px-10 py-12 md:py-24 flex flex-col items-center max-w-[900px] mx-auto">
          
          {/* Başlık Bölümü */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 mb-5 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.2em] border border-accent/20">
              Yasal Bilgilendirme
            </span>
            <h1 className="text-white text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight uppercase italic">
              Kullanım <span className="text-primary">Şartları</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed italic">
              E-Atık Koruyucuları platformunu kullanımınızı, haklarınızı ve sorumluluklarınızı düzenleyen temel kurallar.
            </p>
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500 font-mono">
              <span className="material-symbols-outlined text-sm text-primary">schedule</span>
              <span>Son Güncelleme: 24 Ekim 2023</span>
            </div>
          </motion.div>

          {/* Giriş Metni */}
          <div className="w-full flex flex-col gap-6">
            <div className="glass-panel border border-white/5 rounded-[32px] p-8 backdrop-blur-sm bg-white/[0.02]">
              <p className="text-gray-400 leading-relaxed italic text-sm md:text-base">
                Lütfen platformumuzu kullanmadan önce bu şartları dikkatlice okuyunuz. Siteye erişerek veya hizmetlerimizi kullanarak, belirtilen tüm kuralları kabul etmiş sayılırsınız.
              </p>
            </div>

            {/* Şartlar Bölümleri */}
            <TermSection number="1" title="Hizmet Şartları" delay={0.1}>
              <p className="mb-6">E-Atık Koruyucuları, e-atıklarınızı güvenli ve çevreye duyarlı şekilde geri dönüştürmenizi sağlayan dijital bir platformdur.</p>
              <ul className="space-y-4">
                <CheckItem text="Atık bildirimi, toplama noktası haritası ve kurye süreçlerini kapsar." />
                <CheckItem text="Teknik bakım veya mücbir sebeplerle hizmette geçici kesintiler yaşanabilir." />
                <CheckItem text="Hizmet kapsamını ve özelliklerini değiştirme hakkımız saklıdır." />
              </ul>
            </TermSection>

            <TermSection number="2" title="Kullanıcı Sorumlulukları" delay={0.2}>
              <div className="grid grid-cols-1 gap-4">
                <ResponsibilityBox title="Doğru Beyan" text="Fotoğrafların, cihaz durumunun ve adresin gerçeği yansıtması zorunludur." />
                <ResponsibilityBox title="Güvenli Paketleme" text="Şişmiş bataryalar gibi tehlikeli atıkların Risk Rehberi'ne uygun paketlenmesi kullanıcı sorumluluğundadır." />
                <ResponsibilityBox title="Yasal Uygunluk" text="Kullanıcı, teslim ettiği atıkların yasal sahibi olduğunu beyan eder." />
              </div>
            </TermSection>

            <TermSection number="3" title="Fikri Mülkiyet Hakları" delay={0.3}>
              <p className="italic">Platformdaki tüm logolar, metinler, yazılımlar ve görseller E-Atık Koruyucuları'na aittir ve uluslararası kanunlarla korunmaktadır.</p>
              <p className="mt-4 text-xs opacity-60">İzinsiz kopyalanması, çoğaltılması veya ticari amaçla kullanılması kesinlikle yasaktır.</p>
            </TermSection>

            <TermSection number="4" title="Sorumluluğun Reddi" delay={0.4}>
              <p className="mb-6 opacity-80 italic">Hizmetlerimiz "olduğu gibi" sunulmaktadır. Kesintisiz veya hatasız olacağını garanti etmiyoruz.</p>
              
              {/* KRİTİK UYARI KUTUSU */}
              <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-[32px] flex gap-5 items-start">
                <div className="size-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500 shrink-0 animate-pulse">
                  <span className="material-symbols-outlined text-3xl">warning</span>
                </div>
                <div>
                  <h4 className="text-red-400 font-black text-sm mb-2 uppercase tracking-widest">Veri Güvenliği Uyarısı</h4>
                  <p className="text-gray-400 text-xs leading-relaxed italic">
                    Cihazlarınızdaki tüm kişisel verilerin (fotoğraf, belge, şifre) yedeklenmesi ve silinmesi tamamen kullanıcının sorumluluğundadır. Kaybolan verilerden kurumumuz sorumlu tutulamaz.
                  </p>
                </div>
              </div>
            </TermSection>
          </div>

          {/* İletişim CTA */}
          <motion.div 
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  className="mt-16 w-full p-10 bg-gradient-to-r from-primary/10 to-accent/5 border border-white/10 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
>
  <div>
    <h3 className="text-white text-2xl font-black italic tracking-tighter uppercase mb-2">Sorularınız mı var?</h3>
    <p className="text-gray-400 text-sm italic">Hukuk ekibimizle iletişime geçerek detaylı bilgi alabilirsiniz.</p>
  </div>
  
  {/* Link bileşeni eklenerek buton aktif hale getirildi */}
  <Link to="/contact">
    <button className="whitespace-nowrap px-10 py-4 bg-surface-dark border border-border-dark rounded-2xl text-white font-black uppercase tracking-widest hover:border-primary hover:bg-primary/10 transition-all active:scale-95 shadow-lg">
      Bize Ulaşın
    </button>
  </Link>
</motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Alt Bileşenler
const TermSection = ({ number, title, children, delay }: any) => (
  <motion.details 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="group bg-surface-dark/30 border border-border-dark rounded-[32px] overflow-hidden transition-all hover:border-primary/20"
  >
    <summary className="flex items-center justify-between p-8 cursor-pointer select-none group-open:bg-white/[0.02]">
      <div className="flex items-center gap-6">
        <span className="flex items-center justify-center size-10 rounded-xl bg-primary/20 text-primary font-black text-lg ring-1 ring-primary/30">{number}</span>
        <h3 className="text-xl font-black text-white italic tracking-tight uppercase">{title}</h3>
      </div>
      <span className="material-symbols-outlined text-gray-500 group-open:rotate-180 transition-transform">expand_more</span>
    </summary>
    <div className="px-8 md:px-24 pb-10 pt-4 text-gray-400 leading-relaxed border-t border-white/5 text-sm italic font-medium">
      {children}
    </div>
  </motion.details>
);

const CheckItem = ({ text }: { text: string }) => (
  <li className="flex gap-4 items-start">
    <span className="material-symbols-outlined text-accent text-lg">verified</span>
    <span className="opacity-80">{text}</span>
  </li>
);

const ResponsibilityBox = ({ title, text }: { title: string, text: string }) => (
  <div className="bg-background-dark/40 p-6 rounded-2xl border border-white/5 hover:border-accent/30 transition-all group/box">
    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
      <span className="size-2 rounded-full bg-accent animate-pulse" />
      {title}
    </h4>
    <p className="text-xs leading-relaxed text-gray-500">{text}</p>
  </div>
);