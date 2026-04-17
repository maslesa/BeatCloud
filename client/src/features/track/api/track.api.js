import { api } from '../../../shared/api/axios';

export const getAllTracks = async () => {
    const res = await api.get('/track/all');
    return res.data;
}

export const getUserTracks = async (username) => {
    const res = await api.get(`/track/user/${username}`);
    return res.data;
}

export const deleteTrack = async (trackID) => {
    const res = await api.delete(`/track/${trackID}`);
    return res.data;
}