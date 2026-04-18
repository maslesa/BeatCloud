import { api } from '../../../shared/api/axios';

export const getUserByUsername = async (username) => {
    const res = await api.get(`/user/${username}`);    
    return res.data.user;
}