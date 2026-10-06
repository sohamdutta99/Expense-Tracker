import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/inputs/Input";
import validateEmail from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useUser } from "../../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
      const { user, token } = res.data;

      login(user, token);
      toast.success("Welcome back! 👋");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-white mb-1">Welcome Back</h3>
        <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email address"
            placeholder="you@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Enter your password"
            type="password"
          />

          {error && (
            <p className="text-xs text-red-400 mb-4 -mt-2">{error}</p>
          )}

          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </button>

          <p className="text-sm mt-5" style={{ color: "var(--color-text-muted)" }}>
            Don't have an account?{" "}
            <Link
              to="/signUp"
              className="font-semibold underline"
              style={{ color: "var(--color-primary-light)" }}
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
