export const Navbar = () => (
  <header className="sticky top-0 z-50 w-full border-b border-border-dark bg-background-dark/90 backdrop-blur-md">
    <div className="px-4 md:px-10 py-3 flex items-center justify-between max-w-[1440px] mx-auto w-full">
      <div className="flex items-center gap-4 text-white">
        <span className="material-symbols-outlined text-3xl text-primary">recycling</span>
        <h2 className="text-lg font-bold tracking-tight">E-Atık Koruyucuları</h2>
      </div>
      <nav className="hidden md:flex gap-8 items-center">
        <a href="#" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Hakkımızda</a>
        <a href="#" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Risk Rehberi</a>
        <button className="rounded-lg h-10 px-5 bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/20 transition-colors">
          Atık Bildir
        </button>
      </nav>
    </div>
  </header>
);