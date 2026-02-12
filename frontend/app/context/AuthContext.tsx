  "use client";

  import { createContext, useContext, useEffect, useMemo, useState } from "react";
  import api from "../lib/axios";

  type User = {
    id: number;
    email: string;
    role: "Admin" | "Manager" | "Member" | "Viewer";
  };

  type AuthContextValue = {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
  };

  const AuthContext = createContext<AuthContextValue | null>(null);

  export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const token = localStorage.getItem("token"); // get the stored token
      const response = await api.get<User>("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setUser(response.data);
    } catch (err) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

    useEffect(() => {
      const stored = localStorage.getItem("token");
      if (!stored) {
        setLoading(false);
        return;
      }

      setToken(stored);
      fetchMe().finally(() => setLoading(false));
    }, []);

    const login = async (nextToken: string) => {
      localStorage.setItem("token", nextToken);
      setToken(nextToken);
      await fetchMe();
    };

    const logout = () => {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    };

    const value = useMemo(
      () => ({ user, token, loading, login, logout }),
      [user, token, loading],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }

  export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
  }
