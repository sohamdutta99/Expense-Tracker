import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const UserContext = createContext(null);

/**
 * UserProvider
 * Wraps the entire app and provides authentication state:
 *   - user: the authenticated user object
 *   - loading: true while verifying token on mount
 *   - login(userData, token): store credentials after login/register
 *   - logout(): clear credentials and redirect to login
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: try to restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axiosInstance
        .get(API_PATHS.AUTH.GET_USER)
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          // Token invalid/expired — clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * useUser hook — access the auth context anywhere in the app.
 */
export const useUser = () => useContext(UserContext);

export default UserContext;
