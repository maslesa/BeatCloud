import { api } from '../../../shared/api/axios';

export const getAllTracks = async () => {
    const res = await api.get('/track/all');
    return res.data;
}

export const getUserTracks = async (username) => {
    const res = await api.get(`/track/user/${username}`);
    return res.data;
}

export const getSingleTrack = async (trackID) => {
    const res = await api.get(`/track/${trackID}`);
    return res.data;
}

export const deleteTrack = async (trackID) => {
    const res = await api.delete(`/track/${trackID}`);
    return res.data;
}

export const downloadTrack = async (trackID) => {
    window.open(`${import.meta.env.VITE_API_URL}/track/download/${trackID}`);
}

export const uploadTrack = async (formData, setProgress) => {
    try {
        const res = await api.post('/track/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (!progressEvent.total) return;

                const rawPercent = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );

                if (setProgress) {
                    const displayPercent = rawPercent >= 100 ? 95 : rawPercent;
                    setProgress(displayPercent);
                }
            },
        });

        if (setProgress) setProgress(100);

        return res.data;
    } catch (error) {
        if (setProgress) setProgress(0);
        throw error.response?.data || error;
    }
};

export const updateTrack = async (trackID, formData, setProgress) => {
    try {
        const res = await api.put(`/track/${trackID}`, formData, {
            headers: { 'Content-Type': 'multipart/formdata' },
            onUploadProgress: (progressEvent) => {
                if (!progressEvent.total) return;
                const rawPercent = Math.round((progressEvent.loaded * 100) / progressEvent);
                if (setProgress) setProgress(rawPercent >= 100 ? 95 : rawPercent);
            }
        });

        if (setProgress) setProgress(100);

        return res.data;
    } catch (error) {
        if (setProgress) setProgress(0);
        throw error.response?.data || error;
    }
}

export const likeTrack = async (trackID) => {
    const res = await api.post(`/like/${trackID}`);
    return res.data;
}

export const incrementTrackPlays = async(trackID) => {
    const res = await api.patch(`/track/${trackID}/play`);
    return res.data;
}