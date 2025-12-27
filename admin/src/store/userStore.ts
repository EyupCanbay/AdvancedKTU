import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface UserStore {
  users: User[];
  loading: boolean;
  setUsers: (users: User[]) => void;
  setLoading: (loading: boolean) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  setUsers: (users) => set({ users }),
  setLoading: (loading) => set({ loading }),
  updateUser: (id, user) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...user } : u)),
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),
}));
