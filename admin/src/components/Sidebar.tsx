import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Trash2, MapPin, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
    { path: '/users', label: 'Kullanıcılar', icon: Users, adminOnly: true },
    { path: '/waste', label: 'Atık Yönetimi', icon: Trash2, adminOnly: false },
    { path: '/collection-map', label: 'Toplama Noktaları', icon: MapPin, adminOnly: false },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-sm text-gray-400 mt-1">Advanced KTU</p>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-6 py-4 bg-gray-800 text-sm">
          <p className="text-gray-300">Hoş geldiniz</p>
          <p className="font-semibold text-white">{user.first_name} {user.last_name}</p>
          <p className={`text-xs mt-1 ${isAdmin ? 'text-blue-400' : 'text-gray-400'}`}>
            {isAdmin ? '👑 Admin' : 'Kullanıcı'}
          </p>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            // Admin-only menüleri göster
            if (item.adminOnly && !isAdmin) {
              return null;
            }
            
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-900/50 hover:text-red-300 transition"
        >
          <LogOut size={20} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
