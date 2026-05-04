import React, { useState } from "react";
import { Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import bg from "../assets/hero-sections-contact/contactsectionbgc-1.png";
import { validateForm } from "../utils/validation"; // ✅ use common validation

const RecetPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    const validationErrors = validateForm(updatedData);

    setErrors((prev) => ({
      ...prev,
      [name]: validationErrors[name],
      ...(name === "confirmPassword" && {
        confirmPassword: validationErrors.confirmPassword,
      }),
    }));
  };

  // ✅ submit (NO BACKEND)
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    // ✅ console only
    console.log("Reset Password Data:", formData);

    setTimeout(() => {
      console.log("Password Updated ✅");
      setLoading(false);
      setFormData({ password: "", confirmPassword: "" });

      // optional navigation
      navigate("/sign-in");
    }, 1000);
  };

  return (
    <div
      
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] px-10 py-12 flex flex-col items-center">

        {/* ✅ ICON (Lucide instead of image) */}
        <div className="bg-[#457358] rounded-full p-4 mb-4">
          <KeyRound className="w-6 h-6 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          New Password
        </h1>

        <p className="text-center text-sm text-gray-500 mb-4">
          Enter your new password
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-800 ml-1">
              New Password
            </label>

            <div
              className={`relative flex items-center border rounded-lg ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Lock size={18} className="absolute left-3 text-gray-400" />

              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Your New Password"
                className="w-full pl-10 pr-10 py-3 text-sm outline-none rounded-lg"
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 text-gray-400"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <span className="text-[10px] text-red-500 ml-1">
                {errors.password}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-800 ml-1">
              Confirm Password
            </label>

            <div
              className={`relative flex items-center border rounded-lg ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <Lock size={18} className="absolute left-3 text-gray-400" />

              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full pl-10 pr-10 py-3 text-sm outline-none rounded-lg"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 text-gray-400"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <span className="text-[10px] text-red-500 ml-1">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 rounded-lg transition cursor-pointer ${
              loading
                ? "bg-[#d46a6a] cursor-not-allowed text-white"
                : "bg-[#002b0a] hover:bg-[#457358] text-white"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecetPassword;