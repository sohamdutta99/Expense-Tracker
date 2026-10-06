import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

/**
 * useUserAuth
 * Protects a route by redirecting unauthenticated users to /login.
 * Use at the top of any dashboard page component.
 */
const useUserAuth = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  return { user, loading };
};

export default useUserAuth;
