import { useEffect, useState } from "react"
import { getUserTracks } from "../api/track.api";
import { useAlertStore } from '../../../shared/hooks/useAlertStore';

export const useUserTracks = (username) => {
    const [tracks, setTracks] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const showAlert = useAlertStore((state) => state.showAlert);

    useEffect(() => {

        if(!username) return;

        const fetchTracks = async () => {
            try {
                const data = await getUserTracks(username, page);
                setTracks(data.tracks);
                setPagination(data.pagination);
            } catch (error) {
                showAlert(error.response?.data?.message || error.message, "error");
            }
        }

        fetchTracks();
    }, [username, page]);

    return { tracks, setTracks, page, setPage, pagination };

}
