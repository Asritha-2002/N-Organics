import React, { useState } from "react";
import { Mail, KeyRound } from "lucide-react";


import { NavLink } from "react-router-dom";
import { validateForm } from "../utils/validation"; // ✅ use centralized validation

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ handle change (validate only email field)
  const handleChange = (e) => {
    const updatedData = { ...formData, email: e.target.value };
    setFormData(updatedData);

    const validationErrors = validateForm(updatedData);

    setErrors((prev) => ({
      ...prev,
      email: validationErrors.email
    }));
  };

  // ✅ submit (NO BACKEND)
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (validationErrors.email) return;

    setLoading(true);

    // ✅ simulate sending
    console.log("Verification email sent to:", formData.email);

    setTimeout(() => {
      console.log("Sent ✅");
      setLoading(false);
      setFormData({ email: "" });
    }, 1000);
  };

  return (
    <div
      
      className="min-h-screen bg-center bg-cover flex items-center justify-center p-4"
    >
        
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
        
        
<div className="flex justify-center mb-3">
    <div className="bg-[#457358] p-3 rounded-full">
      <KeyRound className="w-8 h-8 text-[#FFFFFF]" />
    </div>
  </div>
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          Forget Password?
        </h2>

        <p className="text-sm text-center mb-6">
          Enter your registered email and we’ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-800 ml-1">
              Email Address
            </label>

            <div
              className={`relative flex items-center border rounded-lg ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Mail size={18} className="absolute left-3 text-gray-400" />

              <input
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your Email Address"
                className="w-full pl-10 pr-4 py-2 text-sm outline-none rounded-lg"
              />
            </div>

            {errors.email && (
              <span className="text-[10px] text-red-500 ml-1">
                {errors.email}
              </span>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-2.5 rounded-lg text-white transition cursor-pointer ${
              loading
                ? "bg-[#d46a6a] cursor-not-allowed"
                : "bg-[#002b0a] hover:bg-[#457358]"
            }`}
          >
            {loading ? "Sending..." : "Send Verification Email"}
          </button>

          {/* Back */}
          <NavLink
            to="/sign-in"
            className="cursor-pointer block w-full text-center border border-[#002b0a] text-[#002b0a] font-semibold py-2.5 rounded-lg transition hover:bg-[#457358] hover:text-white"
          >
            Back to Login
          </NavLink>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;