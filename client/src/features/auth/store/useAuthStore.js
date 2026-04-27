import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
    (set) => ({
      user: null,
      accessToken: null,

      setAuth: (user, token) => {
        set({
          user,
          accessToken: token
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null
        });
        localStorage.removeItem('auth-storage');
      }
    }),
    {
      name: 'auth-storage',
    }
  )
)