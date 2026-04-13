import { create } from 'zustand';

export const useAuthStore = create((set) => ({
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
    }
}))