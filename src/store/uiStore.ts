import { create } from 'zustand';

interface UIState {
  mode: 'friendly' | 'advanced';
  setMode: (mode: 'friendly' | 'advanced') => void;
}

export const useUIStore = create<UIState>((set) => ({
  mode: 'friendly',
  setMode: (mode) => set({ mode }),
})); 