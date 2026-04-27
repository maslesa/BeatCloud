import { useEffect, useState } from "react";
import { getUserByUsername } from "../api/user.api";
import { useAlertStore } from '../../../shared/hooks/useAlertStore';
import { useAuthStore } from "../../auth/store/useAuthStore";

export const useUser = (username) => {
    const [user, setUser] = useState(null);
    const [isHydrated, setIsHydrated] = useState(false);
    
    const token = useAuthStore((state) => state.accessToken);
    const showAlert = useAlertStore((state) => state.showAlert);

    useEffect(() => {
        const unsubHydrate = useAuthStore.persist.onFinishHydration(() => {
            setIsHydrated(true);
        });

        if (useAuthStore.persist.hasHydrated()) {
            setIsHydrated(true);
        }

        return () => unsubHydrate();
    }, []);

    useEffect(() => {
        if (!username || !isHydrated) return;

        const fetchUser = async () => {
            try {
                const data = await getUserByUsername(username);
                setUser(data);
            } catch (error) {
                showAlert(error.response?.data?.message || error.message, "error");
            }
        }

        fetchUser();

    }, [username, token, isHydrated]);

    return { user, isHydrated };
}