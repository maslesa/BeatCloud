import { useEffect, useState } from "react"
import { getAllTracks } from "../api/track.api";
import { useAlertStore } from '../../../shared/hooks/useAlertStore';
import { useAuthStore } from '../../auth/store/useAuthStore';

export const useTracks = () => {
    const [tracks, setTracks] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    
    const token = useAuthStore((state) => state.accessToken);
    const showAlert = useAlertStore((state) => state.showAlert);

    useEffect(() => {
        if(!token) return;

        const fetchTracks = async () => {
            try {
                const data = await getAllTracks(page);
                setTracks(data.tracks);
                setPagination(data.pagination);
            } catch (error) {
                showAlert(error.response?.data?.message || error.message, "error");
            }
        }

        fetchTracks();
    }, [token, page]);

    return { tracks, setTracks, page, setPage, pagination };

}
