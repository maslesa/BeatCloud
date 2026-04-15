import { create } from 'zustand';

let timeoutId;

export const useAlertStore = create((set) => ({
    message: null,
    type: "error",

    showAlert: (message, type = "error") => {
        if (timeoutId) clearTimeout(timeoutId);

        set({ message, type });

        timeoutId = setTimeout(() => {
            set({ message: null });
        }, 4000);
    },

    clearAlert: () => {
        if (timeoutId) clearTimeout(timeoutId);
        set({ message: null });
    },
}));