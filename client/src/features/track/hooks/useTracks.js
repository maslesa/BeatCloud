import { useEffect, useState } from "react"
import { getAllTracks } from "../api/track.api";
import { useAlertStore } from '../../../shared/hooks/useAlertStore';
import { useAuthStore } from '../../auth/store/useAuthStore';

export const useTracks = () => {
    const [tracks, setTracks] = useState([]);
    
    const token = useAuthStore((state) => state.accessToken);
    
    console.log(token);

    const showAlert = useAlertStore((state) => state.showAlert);

    useEffect(() => {
        if(!token) return;

        const fetchTracks = async () => {
            try {
                const data = await getAllTracks();
                setTracks(data.tracks);
            } catch (error) {
                showAlert(error.response?.data?.message || error.message, "error");
            }
        }

        fetchTracks();
    }, [token]);

    return { tracks, setTracks };

}
