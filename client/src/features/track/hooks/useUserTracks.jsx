import { useEffect, useState } from "react"
import { getUserTracks } from "../api/track.api";
import { useAlertStore } from '../../../shared/hooks/useAlertStore';

export const useUserTracks = (username) => {
    const [tracks, setTracks] = useState([]);

    const showAlert = useAlertStore((state) => state.showAlert);

    useEffect(() => {

        if(!username) return;

        const fetchTracks = async () => {
            try {
                const data = await getUserTracks(username);
                setTracks(data.tracks);
            } catch (error) {
                showAlert(error.response?.data?.message || error.message, "error");
            }
        }

        fetchTracks();
    }, [username]);

    return { tracks };

}
