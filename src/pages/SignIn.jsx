import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { validateForm } from "../utils/validation"; // ✅ centralized validation
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Handle Change (field-level validation)
 const handleChange = (e) => {
  const { name, value } = e.target;

  const updatedData = {
    ...formData,
    [name]: value,
  };

  setFormData(updatedData);

  const validationErrors = validateForm(updatedData);

  // ❌ skip password validation
  if (name !== "password") {
    setErrors((prev) => ({
      ...prev,
      [name]: validationErrors[name] || "",
    }));
  }
};

  // ✅ Submit with API integration
  const handleSubmit = async (e) => {
  e.preventDefault();

  let validationErrors = validateForm(formData);

  // ❌ remove password validation
  delete validationErrors.password;

  setErrors(validationErrors);

  if (Object.keys(validationErrors).length > 0) return;

  setLoading(true);

  try {
    const res = await axios.post(`${BASE_URL}/user/login`, formData);

    toast.success(res.data.message || "Login successful");

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    const isAdmin = res.data.user?.isAdmin;
    localStorage.setItem("isAdmin", isAdmin ? "true" : "false");

    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/");
    }

  } catch (err) {
    toast.error(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[450px] px-8 py-10 flex flex-col items-center">

        <div className="bg-[#457358] rounded-full p-3 mb-4">
          <User size={30} className="text-white" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Sign In to Your Account
        </h1>

        <p className="text-center text-sm mb-5 px-6 leading-relaxed">
          Welcome back! please enter your credentials to access your account.
        </p>

        <form className="w-full space-y-4" onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-800 ml-1">
              Email Address
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Mail size={18} />
              </span>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your Email Address"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
            </div>

            {errors.email && (
              <span className="text-[10px] text-red-500 ml-1">
                {errors.email}
              </span>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-800 ml-1">
              Password
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock size={18} />
              </span>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Your Password"
                className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm outline-none ${
                  "border-gray-300"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <span className="text-[10px] text-red-500 ml-1">
                {errors.password}
              </span>
            )}

            <div className="w-full flex justify-end">
              <NavLink
                to="/forget-password"
                className="text-sm text-[#457358] underline font-semibold"
              >
                Forget Password?
              </NavLink>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 rounded-lg transition cursor-pointer ${
              loading
                ? "bg-[#8fb5a2] cursor-not-allowed text-white"
                : "bg-[#002b0a] hover:bg-[#457358] text-white"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-md text-gray-700 mt-3 font-semibold">
          Don't have an account?{" "}
          <NavLink
            to="/sign-up"
            className="text-[#457358] hover:underline"
          >
            Sign up
          </NavLink>
        </p>

        <div className="w-full flex items-center my-3">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="google"
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-semibold text-sm">
            Continue with Google
          </span>
        </button>
      </div>
    </div>
  );
};

export default SignIn;