import { useEffect, useState } from "react"
import { getUserByUsername } from "../api/user.api";
import { useAlertStore } from '../../../shared/hooks/useAlertStore';


export const useUser = (username) => {
    
    const [user, setUser] = useState(null);

    const showAlert = useAlertStore((state) => state.showAlert);

    useEffect(() => {
        if (!username) return null;

        const fetchUser = async () => {
            try {
                const data = await getUserByUsername(username);
                setUser(data);
            } catch (error) {
                showAlert(error.response?.data?.message || error.message, "error");
            }
        }

        fetchUser();

    }, [username]);

    return { user };
}