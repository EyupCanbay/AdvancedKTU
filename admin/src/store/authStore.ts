import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user';
  active: boolean;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: localStorage.getItem('adminToken'),
  user: localStorage.getItem('adminUser') ? JSON.parse(localStorage.getItem('adminUser') || '{}') : null,
  
  setToken: (token) => {
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
    set({ token });
  },
  
  setUser: (user) => {
    if (user) {
      localStorage.setItem('adminUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('adminUser');
    }
    set({ user });
  },
  
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    set({ token: null, user: null });
  },
  
  isAdmin: () => {
    const state = get();
    return state.user?.role === 'admin' || false;
  },
}));
