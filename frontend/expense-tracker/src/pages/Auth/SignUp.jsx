import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/inputs/Input";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import validateEmail from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import { useUser } from "../../context/UserContext";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useUser();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName) { setError("Please enter your full name."); return; }
    if (!validateEmail(email)) { setError("Please enter a valid email address."); return; }
    if (!password || password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      // If a profile image was selected, upload it first
      let profileImageUrl = null;
      if (profilePic) {
        const formData = new FormData();
        formData.append("image", profilePic);
        // Upload via multer endpoint (images land in /uploads)
        const uploadRes = await axiosInstance.post(API_PATHS.AUTH.UPLOAD_IMAGE, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        profileImageUrl = uploadRes.data.imageUrl;
      }

      const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      const { user, token } = res.data;
      login(user, token);
      toast.success("Account created! Welcome 🎉");
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-white mb-1">Create an Account</h3>
        <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email address"
              placeholder="you@example.com"
              type="text"
            />

            <div className="md:col-span-2">
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder="Min. 6 characters"
                type="password"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 mb-4 -mt-2">{error}</p>
          )}

          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {loading ? "Creating account…" : "Sign Up"}
          </button>

          <p className="text-sm mt-5" style={{ color: "var(--color-text-muted)" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold underline"
              style={{ color: "var(--color-primary-light)" }}
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
