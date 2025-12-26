import { Link } from 'react-router-dom';

interface NavbarProps {
  onOpenWasteModal: () => void;
}

export const Navbar = ({ onOpenWasteModal }: NavbarProps) => (
  <header className="sticky top-0 z-50 w-full border-b border-border-dark bg-[#112022]/90 backdrop-blur-md">
    <div className="px-4 md:px-10 py-3 flex items-center justify-between max-w-[1440px] mx-auto w-full">
      <Link to="/" className="flex items-center gap-4 text-white">
        <span className="material-symbols-outlined text-3xl text-primary">recycling</span>
        <h2 className="text-lg font-bold tracking-tight font-display">E-Atık Koruyucuları</h2>
      </Link>

      <nav className="hidden md:flex gap-8 items-center">
        <a href="#" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Hakkımızda</a>
        
        <div className="flex items-center gap-4 border-l border-border-dark pl-6">
          <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-bold px-4 py-2 rounded-lg">
            Giriş Yap
          </Link>
          <Link to="/register" className="bg-surface-dark border border-border-dark hover:border-primary/50 text-white text-sm font-bold py-2 px-6 rounded-lg transition-all">
            Kayıt Ol
          </Link>

          <button 
            onClick={onOpenWasteModal}
            className="rounded-lg h-10 px-5 bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            Atık Bildir
          </button>
        </div>
      </nav>
    </div>
  </header>
);