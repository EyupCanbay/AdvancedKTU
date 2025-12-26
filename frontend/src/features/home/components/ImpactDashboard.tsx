export const ImpactDashboard = () => (
  <div className="w-full bg-[#112022] border-y border-[#244447] py-20 px-4 md:px-10">
    <div className="max-w-[1280px] mx-auto flex flex-col items-center">
      <div className="flex flex-col items-center text-center mb-12">
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-3">Gerçek Zamanlı Etki Analizi</h2>
        <p className="text-gray-400 text-sm">Yapay zeka destekli veri modellemesi ile etkileri takip ediyoruz.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="metric-card-glass rounded-3xl p-8 flex flex-col items-center text-center group hover:-translate-y-2 transition-all">
          <span className="material-symbols-outlined text-4xl text-warning mb-4">warning</span>
          <div className="text-6xl font-black text-white mb-2">8.4<span className="text-2xl text-gray-500">/10</span></div>
          <h3 className="text-warning font-bold">Risk Skoru</h3>
        </div>
        <div className="metric-card-glass rounded-3xl p-8 flex flex-col items-center text-center group hover:-translate-y-2 transition-all">
          <span className="material-symbols-outlined text-4xl text-accent mb-4">eco</span>
          <div className="text-5xl font-black text-white mb-2">1,240 <span className="text-lg text-gray-400">kg</span></div>
          <h3 className="text-accent font-bold">Karbon Emisyonu</h3>
        </div>
        <div className="metric-card-glass rounded-3xl p-8 flex flex-col items-center text-center group hover:-translate-y-2 transition-all">
          <span className="material-symbols-outlined text-4xl text-primary mb-4">database</span>
          <div className="text-5xl font-black text-white mb-2">$85.4k</div>
          <h3 className="text-primary font-bold">Geri Kazanılan Değer</h3>
        </div>
      </div>
    </div>
  </div>
);