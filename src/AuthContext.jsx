import { createContext, useState, useEffect } from "react";
import axiosInstance from "./api/axiosInstance";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axiosInstance
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const res = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user); // correct user object
  };

  // SIGNUP
  const signup = async (name, email, password) => {
    const res = await axiosInstance.post("/auth/signup", {
      name,
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user); // correct user object
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;