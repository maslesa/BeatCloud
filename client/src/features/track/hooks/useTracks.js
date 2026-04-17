import { useEffect, useState } from "react"
import { getAllTracks } from "../api/track.api";
import { useAlertStore } from '../../../shared/hooks/useAlertStore';

export const useTracks = () => {
    const [tracks, setTracks] = useState([]);

    const showAlert = useAlertStore((state) => state.showAlert);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const data = await getAllTracks();
                setTracks(data.tracks);
            } catch (error) {
                showAlert(error.response?.data?.message || error.message, "error");
            }
        }

        fetchTracks();
    }, []);

    return { tracks };

}
