import { create } from 'zustand';

export interface CollectionPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
}

interface PointStore {
  points: CollectionPoint[];
  loading: boolean;
  setPoints: (points: CollectionPoint[]) => void;
  setLoading: (loading: boolean) => void;
  addPoint: (point: CollectionPoint) => void;
  updatePoint: (id: string, point: Partial<CollectionPoint>) => void;
  deletePoint: (id: string) => void;
}

export const usePointStore = create<PointStore>((set) => ({
  points: [],
  loading: false,
  setPoints: (points) => set({ points }),
  setLoading: (loading) => set({ loading }),
  addPoint: (point) =>
    set((state) => ({
      points: [...state.points, point],
    })),
  updatePoint: (id, point) =>
    set((state) => ({
      points: state.points.map((p) => (p.id === id ? { ...p, ...point } : p)),
    })),
  deletePoint: (id) =>
    set((state) => ({
      points: state.points.filter((p) => p.id !== id),
    })),
}));
