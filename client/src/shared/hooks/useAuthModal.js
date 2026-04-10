import { create } from 'zustand';

export const useAuthModal = create((set) => ({
  type: null,

  openLogin: () => set({ type: 'login' }),
  openRegister: () => set({ type: 'register' }),
  close: () => set({ type: null })
}));