import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { WasteSubmissionModal } from '../../features/home/components/WasteSubmissionModal';

interface NavbarProps {
  onAtikBildirClick: () => void; // Modal açma fonksiyonu
}
export const Navbar = ({ onAtikBildirClick }: NavbarProps) => {
  <header className="sticky top-0 z-50 w-full border-b border-border-dark bg-[#112022]/90 backdrop-blur-md"></header>
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal kontrolü
  const [user, setUser] = useState<{ firstName: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser({ firstName: parsedUser.first_name });
      } catch (e) { console.error(e); }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border-dark bg-[#112022]/90 backdrop-blur-md">
        <div className="px-4 md:px-10 py-3 flex items-center justify-between max-w-[1440px] mx-auto w-full">
          <Link to="/" className="flex items-center gap-4 text-white">
            <span className="material-symbols-outlined text-3xl text-primary">recycling</span>
            <h2 className="text-lg font-bold tracking-tight">E-Atık Koruyucuları</h2>
          </Link>

          <nav className="hidden md:flex gap-8 items-center">
            {/* Yeni eklenen "Toplama Noktaları" linki */}
            <Link to="/centers" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Toplama Noktaları</Link>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 text-sm">Merhaba, <span className="text-white font-bold">{user.firstName}</span></span>
                  <button onClick={handleLogout} className="text-red-400 text-sm font-bold">Çıkış Yap</button>
                </div>
              ) : (
                <Link to="/login" className="text-gray-300 hover:text-white text-sm font-bold">Giriş Yap</Link>
              )}

              <button 
                onClick={onAtikBildirClick} // Butona tıklandığında modalı açar
className="rounded-lg h-10 px-5 bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"              >
                Atık Bildir
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Modal Entegrasyonu */}
      {isModalOpen && (
        <WasteSubmissionModal 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={() => {
            alert("Atık bildirimi başarıyla alındı. AI analiz sonuçları hazır!");
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
};