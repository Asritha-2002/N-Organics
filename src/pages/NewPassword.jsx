import React, { useState } from "react";
import { Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { validateForm } from "../utils/validation";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const NewPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm({ password, confirmPassword });

    if (validationErrors.password || validationErrors.confirmPassword) {
      setPasswordError(validationErrors.password || "");
      setConfirmError(validationErrors.confirmError || "");
      return;
    }

    setPasswordError("");
    setConfirmError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/user/reset-password`,
        { token, password }
      );

      toast.success(response.data.message || "Password reset successful");

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/recet-success");
      }, 1500);

    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong. Try again later.";

      toast.error(message);

      setTimeout(() => {
        navigate("/recet-failed");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] px-10 py-12 flex flex-col items-center">
        
        <div className="bg-[#457358] p-3 rounded-full mb-4">
          <KeyRound className="w-8 h-8 text-[#FFFFFF]" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">New Password</h1>
        <p className="text-center text-sm text-gray-500 mb-4">
          Enter your new password
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-800 ml-1">
              New Password
            </label>

            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-[#457358] transition-colors">
                <Lock size={18} />
              </span>

              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter Your New password"
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);

                  const validationErrors = validateForm({
                    password: value,
                    confirmPassword,
                  });

                  setPasswordError(validationErrors.password || "");
                  setConfirmError(validationErrors.confirmError || "");
                }}
                className={`w-full pl-10 pr-10 py-3 border rounded-lg text-sm 
                ${passwordError ? "border-red-500" : "border-gray-300"}
                focus:outline-none placeholder-gray-300`}
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {passwordError && (
              <p className="text-red-500 text-xs ml-1">{passwordError}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-800 ml-1">
              Confirm Password
            </label>

            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-[#457358] transition-colors">
                <Lock size={18} />
              </span>

              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setConfirmPassword(value);

                  const validationErrors = validateForm({
                    password,
                    confirmPassword: value,
                  });

                  setConfirmError(validationErrors.confirmPassword || "");
                }}
                className={`w-full pl-10 pr-10 py-3 border rounded-lg text-sm 
                ${confirmError ? "border-red-500" : "border-gray-300"}
                focus:outline-none placeholder-gray-300`}
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {confirmError && (
              <p className="text-red-300 text-xs ml-1">{confirmError}</p>
            )}
          </div>

          <button
  type="submit"
  disabled={loading}
  className={`w-full font-bold py-3 rounded-lg transition cursor-pointer ${
    loading
      ? "bg-[#8fb5a2] cursor-not-allowed text-white"
      : "bg-[#002b0a] hover:bg-[#457358] text-white"
  }`}
>
  {loading ? "Resetting..." : "Reset Password"}
</button>

        </form>
      </div>
    </div>
  );
};

export default NewPassword;