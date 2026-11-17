import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiLogin, apiRegister, apiGetMe } from "../services/backendApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("bookhub_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("bookhub_token") || null;
  });

  const [loading, setLoading] = useState(false);

  // Validate session on mount
  useEffect(() => {
    if (token) {
      apiGetMe()
        .then(({ user: profile }) => {
          setUser(profile);
          localStorage.setItem("bookhub_user", JSON.stringify(profile));
        })
        .catch(() => {
          // If server rejects token, clean up
          localStorage.removeItem("bookhub_token");
          localStorage.removeItem("bookhub_user");
          setToken(null);
          setUser(null);
        });
    }
  }, [token]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const data = await apiLogin({ email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("bookhub_token", data.token);
      localStorage.setItem("bookhub_user", JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      // Fallback for standalone frontend without server running
      if (err.code === "ERR_NETWORK" || err.message?.includes("Network Error")) {
        const demoUser = {
          id: "demo-user",
          name: email.split("@")[0],
          email,
          isDemo: true,
        };
        setUser(demoUser);
        localStorage.setItem("bookhub_user", JSON.stringify(demoUser));
        return { success: true, user: demoUser, isDemo: true };
      }
      const msg = err.response?.data?.error || "Invalid email or password.";
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const data = await apiRegister({ name, email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("bookhub_token", data.token);
      localStorage.setItem("bookhub_user", JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      if (err.code === "ERR_NETWORK" || err.message?.includes("Network Error")) {
        const demoUser = {
          id: "demo-user",
          name,
          email,
          isDemo: true,
        };
        setUser(demoUser);
        localStorage.setItem("bookhub_user", JSON.stringify(demoUser));
        return { success: true, user: demoUser, isDemo: true };
      }
      const msg = err.response?.data?.error || "Registration failed. Please try again.";
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("bookhub_token");
    localStorage.removeItem("bookhub_user");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
