import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Modern NavLink Bileşeni
const NavLink = ({ to, icon, text }: { to: string, icon: string, text: string }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    
    return (
        <Link 
            to={to} 
            className={`group flex items-center px-4 py-2 rounded-xl transition-all duration-300 relative
                ${isActive ? 'text-cyan-400 bg-cyan-900/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
            <span className={`material-symbols-outlined mr-2 text-[22px] transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-300'}`}>
                {icon}
            </span>
            <span className="font-medium text-sm">{text}</span>
        </Link>
    );
};

interface NavbarProps {
  onAtikBildirClick: () => void;
}

export const Navbar = ({ onAtikBildirClick }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<{ firstName: string } | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // localStorage üzerinden kullanıcı takibi
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser({ firstName: parsedUser.first_name });
            } catch (e) { console.error(e); }
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
        window.location.reload();
    };

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#112022]/80 border-b border-white/5 shadow-lg shadow-black/10">
            <div className="max-w-[1440px] mx-auto px-4 md:px-10 h-20 flex items-center justify-between">
                
                {/* LOGO (Mol-e Vizyonu) */}
                <Link to="/" className="flex items-center group">
                    <span className="material-symbols-outlined text-4xl text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-blue-600 mr-3">
                        recycling
                    </span>
                    <h2 className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                        E-Atık <span className="text-cyan-500">Koruyucuları</span>
                    </h2>
                </Link>
                
                {/* DESKTOP MENU */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center bg-black/20 rounded-2xl p-1 border border-white/5">
                        <NavLink to="/" icon="home" text="Ana Sayfa" />
                        <NavLink to="/centers" icon="location_on" text="Toplama Noktaları" />
                        <NavLink to="/impact" icon="bar_chart_4_bars" text="Etki Dashboard" />
                        {/* HAKKIMIZDA EKLENDİ */}
                        <NavLink to="/about" icon="info" text="Hakkımızda" />
                    </div>

                    <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-300">Merhaba, <b className="text-white">{user.firstName}</b></span>
                                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm font-bold transition-colors">Çıkış</button>
                            </div>
                        ) : (
                            <Link to="/login" className="text-gray-300 hover:text-white text-sm font-bold transition-colors">Giriş Yap</Link>
                        )}

                        <button 
                            onClick={onAtikBildirClick}
                            className="group relative px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-sm font-black text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-95"
                        >
                            <span className="relative z-10">ATIK BİLDİR</span>
                            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU BUTTON */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-2">
                    <span className="material-symbols-outlined text-3xl">{isOpen ? 'close' : 'menu'}</span>
                </button>
            </div>

            {/* MOBILE DROPDOWN */}
            {isOpen && (
                <div className="md:hidden bg-[#112022] border-t border-white/5 p-4 space-y-2 animate-fade-in">
                    <NavLink to="/" icon="home" text="Ana Sayfa" />
                    <NavLink to="/centers" icon="location_on" text="Noktalar" />
                    <NavLink to="/impact" icon="bar_chart_4_bars" text="Etki Raporu" />
                    <NavLink to="/about" icon="info" text="Hakkımızda" />
                    <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                        {user ? (
                            <button onClick={handleLogout} className="text-red-400 font-bold px-4">Çıkış Yap</button>
                        ) : (
                            <Link to="/login" className="px-4 py-2 text-gray-300">Giriş Yap</Link>
                        )}
                        <button onClick={onAtikBildirClick} className="w-full py-3 bg-cyan-500 text-white font-bold rounded-xl">ATIK BİLDİR</button>
                    </div>
                </div>
            )}
        </nav>
    );
};