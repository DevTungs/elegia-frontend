import { useEffect, useState, useCallback } from "react";
import { getToken, removeToken, getUser, isAdmin as checkAdmin, api } from "@/services/api";

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

interface MeResponse {
  user: AuthUser;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const validateSession = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await api.get<MeResponse>("/auth/me");
      if (data.user) {
        setUser(data.user);
        setIsAdmin(data.user.role === "admin");
      } else {
        removeToken();
      }
    } catch {
      // Fallback: se a API falhar (offline, CORS, etc.), decodifica localmente
      const userData = getUser();
      if (userData) {
        setUser(userData);
        setIsAdmin(checkAdmin());
      } else {
        removeToken();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  const signOut = () => {
    removeToken();
    setUser(null);
    setIsAdmin(false);
  };

  return {
    user,
    session: user ? { user } : null,
    loading,
    isAdmin,
    signOut,
  };
};
