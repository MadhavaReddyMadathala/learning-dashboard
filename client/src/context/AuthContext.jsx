import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

/*
  IMPORTANT:
  Your VITE_API_URL must be like:
  https://your-railway-app.up.railway.app/api/auth
*/
const API = import.meta.env.VITE_API_URL;

if (!API) {
  throw new Error("VITE_API_URL is not defined in environment variables");
}

// Axios helper to set/remove token
const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  // 🔐 Check session on refresh
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      setAuthHeader(token);

      try {
        const { data } = await axios.get(`${API}/me`);
        setUser(data);
      } catch (err) {
        localStorage.removeItem("token");
        setAuthHeader(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // 🟢 REGISTER
  const register = async (name, email, password, role = "student") => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(`${API}/register`, {
        name,
        email,
        password,
        role,
      });

      const { token, user: userData } = data;

      localStorage.setItem("token", token);
      setAuthHeader(token);
      setUser(userData);

      return userData;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Registration failed";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // 🔵 LOGIN
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(`${API}/login`, {
        email,
        password,
      });

      const { token, user: userData } = data;

      localStorage.setItem("token", token);
      setAuthHeader(token);
      setUser(userData);

      return userData;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Login failed";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // 🔴 LOGOUT
  const logout = async () => {
    setLoading(true);

    try {
      await axios.post(`${API}/logout`);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      setAuthHeader(null);
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        clearError,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
