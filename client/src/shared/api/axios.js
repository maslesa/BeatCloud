import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        return Promise.reject(error);
    }
);