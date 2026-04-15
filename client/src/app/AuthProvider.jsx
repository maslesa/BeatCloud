import { useEffect } from "react";
import { api } from "../shared/api/axios";
import { useAuthStore } from "../features/auth/store/useAuthStore";

export default function AuthProvider({ children }) {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get("/auth/me");

        setAuth(res.data.user, res.data.accessToken);
      } catch (err) {
        setAuth(null, null);
      }
    };

    init();
  }, []);

  return children;
}