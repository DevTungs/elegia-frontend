import { useEffect, useState } from "react";
import { getToken, removeToken, getUser, isAdmin as checkAdmin } from "@/services/api";

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const userData = getUser();
      setUser(userData);
      setIsAdmin(checkAdmin());
    }
    setLoading(false);
  }, []);

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
