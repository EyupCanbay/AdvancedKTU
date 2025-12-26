export const ImpactAwareness = () => (
  <section className="w-full bg-[#112022] px-4 md:px-10 py-20 flex justify-center border-t border-[#244447] relative">
    <div className="max-w-[1280px] w-full z-10">
      <div className="flex flex-col items-center text-center max-w-[800px] mx-auto mb-16">
        <h2 className="text-white text-3xl md:text-5xl font-black leading-tight mb-4">
          Sessiz Bir Felaket: <br className="md:hidden"/> E-Atık Neden Zararlı?
        </h2>
        <p className="text-accent text-lg md:text-xl font-bold">
          Evinizdeki her eski cihaz, doğa için birer saatli bomba.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Görünmez Yangınlar */}
        <div className="danger-card-glass rounded-3xl p-8 flex flex-col group hover:-translate-y-2 transition-all duration-300">
          <div className="mb-6 relative">
            <div className="w-16 h-16 rounded-2xl bg-red-900/40 border border-red-500/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-red-400">battery_alert</span>
            </div>
          </div>
          <h3 className="text-white text-2xl font-bold mb-3">Görünmez Yangınlar</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Şişmiş bataryalar sadece çöp değil, her an patlamaya hazır birer yangın kaynağıdır.</p>
        </div>
        {/* Sessiz Kurbanlar */}
        <div className="danger-card-glass rounded-3xl p-8 flex flex-col group hover:-translate-y-2 transition-all duration-300">
          <div className="mb-6 relative">
            <div className="w-16 h-16 rounded-2xl bg-emerald-900/40 border border-emerald-500/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-emerald-400">pets</span>
            </div>
          </div>
          <h3 className="text-white text-2xl font-bold mb-3">Sessiz Kurbanlar</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Sokağa atılan bir batarya, bir dostumuzun ısırmasıyla ölümcül bir zehre dönüşür.</p>
        </div>
        {/* Toprağın Zehri */}
        <div className="danger-card-glass rounded-3xl p-8 flex flex-col group hover:-translate-y-2 transition-all duration-300">
          <div className="mb-6 relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-primary">landscape</span>
            </div>
          </div>
          <h3 className="text-white text-2xl font-bold mb-3">Toprağın Zehri</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Tek bir batarya, 600.000 litre suyu geri dönüştürülemez şekilde kirletebilir.</p>
        </div>
      </div>
    </div>
  </section>
);