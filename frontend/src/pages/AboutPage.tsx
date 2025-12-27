import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from 'react-router-dom'; // Link import edildiğinden emin olun
import { Footer } from '../components/layout/Footer'; // Footer yolu kontrol edilmeli
import cagatayImg from '../../src/assets/impact/cagatay.jpeg';
import eyupImg from '../../src/assets/impact/eyup.jpeg';
import erenImg from '../../src/assets/impact/eren.jpeg';
import rayyanImg from '../../src/assets/impact/rayyan.jpeg';
import eminImg from '../../src/assets/impact/emin.jpeg';
import eatik from '../../src/assets/impact/eatik.jpeg';
const Counter = ({ value, duration = 2, suffix = "" }: { value: number; duration?: number; suffix?: string }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString('tr-TR') + suffix);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    useEffect(() => {
      if (isInView) { animate(count, value, { duration, ease: "easeOut" }); }
    }, [isInView, count, value, duration]);
    return <motion.span ref={ref}>{rounded}</motion.span>;
};
export const AboutPage = () => {
  return (
    <div className="bg-background-dark min-h-screen font-display text-white overflow-x-hidden">
      {/* Navbar - Daha önce modernize ettiğimiz Navbar'ı kullanıyoruz */}
      <Navbar onAtikBildirClick={() => {}} />

      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24">
        {/* HERO SECTION: Biz Kimiz? */}
        <section className="flex flex-col gap-12 lg:flex-row lg:items-start mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-8 lg:w-1/2"
          >
            <div className="flex flex-col gap-4 text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider w-fit border border-accent/20">
                Biz Kimiz?
              </span>
              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                Teknoloji ve Doğayı <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Yeniden Bağlıyoruz</span>
              </h1>
            </div>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
              E-Atık Koruyucuları, hızla dijitalleşen dünyada artan elektronik atık sorununa sürdürülebilir bir çözüm sunmak amacıyla kurulmuş bir inisiyatiftir. Teknolojinin getirdiği kolaylıkların, doğamıza yük olmaması gerektiğine inanıyoruz.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="p-6 bg-surface-dark border border-border-dark rounded-2xl">
                <h4 className="text-3xl font-bold text-white mb-1">
                  <Counter value={50} suffix="+ Ton" />
                </h4>
                <p className="text-sm text-gray-500 italic">Dönüştürülen Atık</p>
              </div>
              <div className="p-6 bg-surface-dark border border-border-dark rounded-2xl">
                <h4 className="text-3xl font-bold text-white mb-1">
                  <Counter value={10000} suffix="+" />
                </h4>
                <p className="text-sm text-gray-500 italic">Aktif Kullanıcı</p>
              </div>
            </div>
          </motion.div>

          {/* GÖRSEL ALANI */}
          <div className="lg:w-1/2 w-full grid grid-cols-1 gap-6">
            <div className="relative group aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-glow">
              <img src={eatik} alt="Recycling" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <p className="text-white font-bold text-lg">Geleceği Tasarlamak</p>
                <p className="text-gray-400 text-sm">Değerli materyalleri ekonomiye geri kazandırıyoruz.</p>
              </div>
            </div>
          </div>
        </section>

        {/* MİSYON & VİZYON */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-32">
          <div className="glass-panel p-10 rounded-[40px] border border-primary/20">
            <div className="size-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl">target</span>
            </div>
            <h2 className="text-white text-3xl font-black mb-4 uppercase tracking-tighter italic">Misyonumuz</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Elektronik atıkların çevreye verdiği zararı en aza indirmek için erişilebilir, şeffaf ve güvenilir bir geri dönüşüm ağı kurmak.
            </p>
            <ul className="space-y-3 text-gray-300">
              {['Güvenli veri imhası', 'Maksimum hammadde geri kazanımı', 'Kolay erişilebilir toplama noktaları'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-accent text-xl">verified</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel p-10 rounded-[40px] border border-accent/20">
            <div className="size-14 rounded-2xl bg-accent/20 text-accent flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl">visibility</span>
            </div>
            <h2 className="text-white text-3xl font-black mb-4 uppercase tracking-tighter italic">Vizyonumuz</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Türkiye'nin en kapsamlı e-atık platformu olmak ve "atık" kavramını "kaynak" kavramına dönüştürmek.
            </p>
            <ul className="space-y-3 text-gray-300">
              {['Sıfır atık hedefi', 'Yapay zeka destekli lojistik', 'Global sürdürülebilirlik'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">verified</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* DEĞERLERİMİZ */}
        <section className="text-center mb-32">
          <h2 className="text-white text-4xl font-black mb-16 uppercase tracking-widest italic">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard icon="eco" title="Çevre Odaklılık" desc="Doğanın korunması, ticari kaygılardan her zaman önce gelir." color="text-primary" />
            <ValueCard icon="security" title="Güven ve Şeffaflık" desc="Atığınızın nereye gittiğini her an şeffafça takip edebilirsiniz." color="text-accent" />
            <ValueCard icon="groups" title="Toplumsal Katılım" desc="Değişimin kolektif bir hareket olduğuna inanıyoruz." color="text-teal-400" />
          </div>
        </section>

        {/* EKİBİMİZ */}
        <section className="text-center">
          <h2 className="text-white text-4xl font-black mb-16 uppercase tracking-widest italic">Çekirdek Ekibimiz</h2>
          <div className="flex flex-wrap justify-center gap-12">
            <TeamMember name="Çağatay Turunç" role="Bilgisayar Mühendisi 3.Sınıf" img={cagatayImg} />
            <TeamMember name="Eyüp Canbay" role="Bilgisayar Mühendisi 3.Sınıf" img={eyupImg} />
            <TeamMember name="Eren AKKOÇ" role="Yazılım Mühendisi 2.Sınıf" img={erenImg} />
            <TeamMember name="Rayan Ali Mohammed SALEM" role="Matematik 3. Sınıf" img={rayyanImg} />
            <TeamMember name="Emin Gökçek" role="Yazılım Mühendisi 2.Sınıf" img={eminImg} />

          </div>
        </section>
      </main>
      <div className="max-w-[900px] mx-auto w-full px-4 md:px-10 mb-16">
        
      </div>

      {/* FOOTER BURAYA EKLENDİ */}
      <Footer />
    </div>
  );
};

const ValueCard = ({ icon, title, desc, color }: any) => (
  <div className="glass-panel p-8 rounded-[32px] border border-white/5 hover:border-primary/30 transition-all text-center">
    <span className={`material-symbols-outlined text-5xl ${color} mb-4`}>{icon}</span>
    <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const TeamMember = ({ name, role, img }: any) => (
  <div className="flex flex-col items-center gap-4 group">
    <div className="size-28 rounded-full overflow-hidden border-2 border-primary p-1 group-hover:scale-110 transition-transform">
      <img src={img} alt={name} className="w-full h-full object-cover rounded-full" />
    </div>
    <div className="text-center">
      <h4 className="text-white font-bold">{name}</h4>
      <p className="text-primary text-xs font-medium uppercase tracking-widest">{role}</p>
    </div>
  </div>
);