import React, { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { NavLink } from "react-router-dom";
import { validateForm } from "../utils/validation";

const Signup = () => {
  const initialState = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({}); // ✅ NEW
  const [showPassword, setShowPassword] = useState(false);

  // ✅ SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    // mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (Object.keys(validationErrors).length > 0) return;

    console.log("Form Data:", formData);
    setFormData(initialState);
    setTouched({});
  };

  // ✅ CHANGE HANDLER (FIELD LEVEL VALIDATION ONLY)
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    // mark this field touched
    setTouched((prev) => ({ ...prev, [name]: true }));

    // validate only this field
    const validationErrors = validateForm(updatedData);

    setErrors((prev) => ({
      ...prev,
      [name]: validationErrors[name],
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[450px] p-8 flex flex-col items-center">
        
        <div className="bg-[#457358] rounded-full p-3">
          <User size={30} className="text-white" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create Your Account
        </h1>
        <p className="text-center text-sm mb-6">
          Join VetDiag Genomix to access diagnostic services and reports.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">

          {/* Name */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <div
                className={`relative flex items-center border rounded-lg ${
                  errors.name && touched.name ? "border-red-500" : "border-gray-300"
                }`}
              >
                <User size={18} className="absolute left-3 text-gray-400" />
                <input
                  name="name"
                  value={formData.name}
                  type="text"
                  placeholder="Enter Your Full Name"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 text-sm outline-none rounded-lg"
                />
              </div>
              {touched.name && errors.name && (
                <span className="text-[10px] text-red-500 ml-1">
                  {errors.name}
                </span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <div
                className={`relative flex items-center border rounded-lg ${
                  errors.email && touched.email ? "border-red-500" : "border-gray-300"
                }`}
              >
                <Mail size={18} className="absolute left-3 text-gray-400" />
                <input
                  name="email"
                  value={formData.email}
                  type="email"
                  placeholder="Enter Your Email Address"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 text-sm outline-none rounded-lg"
                />
              </div>
              {touched.email && errors.email && (
                <span className="text-[10px] text-red-500 ml-1">
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <div
                className={`relative flex items-center border rounded-lg ${
                  errors.phone && touched.phone ? "border-red-500" : "border-gray-300"
                }`}
              >
                <Phone size={18} className="absolute left-3 text-gray-400" />
                <input
                  name="phone"
                  value={formData.phone}
                  type="tel"
                  placeholder="Enter Your phone Number"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 text-sm outline-none rounded-lg"
                />
              </div>
              {touched.phone && errors.phone && (
                <span className="text-[10px] text-red-500 ml-1">
                  {errors.phone}
                </span>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div
                className={`relative flex items-center border rounded-lg ${
                  errors.password && touched.password ? "border-red-500" : "border-gray-300"
                }`}
              >
                <Lock size={18} className="absolute left-3 text-gray-400" />
                <input
                  name="password"
                  value={formData.password}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Your Password"
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 text-sm outline-none rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-[10px] ml-1">
                Password must contain 8 characters
              </p>
              {touched.password && errors.password && (
                <span className="text-[10px] text-red-500 ml-1">
                  {errors.password}
                </span>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>

              <div
                className={`relative flex items-center border rounded-lg ${
                  errors.confirmPassword && touched.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <Lock size={18} className="absolute left-3 text-gray-400" />
                <input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  type="password"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 text-sm outline-none rounded-lg"
                />
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <span className="text-[10px] text-red-500 ml-1">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-[#002b0a] text-white font-bold py-2.5 rounded-lg mt-4 hover:bg-[#457358] transition-colors cursor-pointer"
          >
            Create Your Account
          </button>
        </form>

        <p className="text-lg mt-6 text-gray-600 font-semibold">
          Already have an account?
          <NavLink
            to="/sign-in"
            className="text-[#457358] hover:underline cursor-pointer"
          >
            {" "}
            Sign In
          </NavLink>
        </p>

        <div className="w-full flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="G"
            className="w-4 h-4"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Signup;