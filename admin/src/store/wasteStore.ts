import { create } from 'zustand';

interface Waste {
  id: string;
  user_id: string;
  image_path: string;
  description: string;
  status: 'analyzing' | 'pending' | 'collected';
  ai_analysis?: {
    riskDegree: number;
    cost: number;
    CO2Emission: number;
    [key: string]: any;
  };
  created_at: string;
}

interface WasteStore {
  wastes: Waste[];
  loading: boolean;
  setWastes: (wastes: Waste[]) => void;
  setLoading: (loading: boolean) => void;
  updateStatus: (id: string, status: string) => void;
  deleteWaste: (id: string) => void;
}

export const useWasteStore = create<WasteStore>((set) => ({
  wastes: [],
  loading: false,
  setWastes: (wastes) => set({ wastes }),
  setLoading: (loading) => set({ loading }),
  updateStatus: (id, status) =>
    set((state) => ({
      wastes: state.wastes.map((w) => (w.id === id ? { ...w, status } : w)),
    })),
  deleteWaste: (id) =>
    set((state) => ({
      wastes: state.wastes.filter((w) => w.id !== id),
    })),
}));
