// components/SignInModal.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { validateForm } from "../../../utils/validation";
import { useCart } from "../../../pages/CartContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function SignInModal({
  isOpen,
  onClose,
}) {
  const [showPassword, setShowPassword] =
    useState(false);

  const navigate = useNavigate();

  const { fetchCartCount } = useCart();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  // ✅ Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedData);

    const validationErrors =
      validateForm(updatedData);

    if (name !== "password") {
      setErrors((prev) => ({
        ...prev,
        [name]:
          validationErrors[name] || "",
      }));
    }
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors =
      validateForm(formData);

    delete validationErrors.password;

    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length > 0
    )
      return;

    setLoading(true);

    try {
      // Guest cart
      const localGuestCart =
        JSON.parse(
          localStorage.getItem("guestCart")
        ) || [];

      const loginPayload = {
        ...formData,
        guestCart: localGuestCart,
      };

      const res = await axios.post(
        `${BASE_URL}/user/login`,
        loginPayload
      );

      toast.success(
        res.data.message ||
          "Login successful"
      );

      // Save token
      if (res.data.token) {
        localStorage.setItem(
          "token",
          res.data.token
        );
      }

      // Remove guest cart
      localStorage.removeItem(
        "guestCart"
      );

      // Save admin
      const isAdmin =
        res.data.user?.isAdmin;

      localStorage.setItem(
        "isAdmin",
        isAdmin ? "true" : "false"
      );

      // Refresh cart count
      await fetchCartCount();

      // Close modal
      onClose?.();

      // Navigate
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/account");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{
              scale: 0.9,
              opacity: 0,
              y: 20,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
              y: 20,
            }}
            transition={{
              duration: 0.2,
            }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-[450px] px-8 py-10 flex flex-col items-center max-h-[95vh] overflow-y-auto"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition"
            >
              <X size={20} />
            </button>

            {/* ICON */}
            <div className="bg-[#457358] rounded-full p-3 mb-4">
              <User
                size={30}
                className="text-white"
              />
            </div>

            {/* TITLE */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sign In to Your Account
            </h1>

            <p className="text-center text-sm mb-5 px-6 leading-relaxed text-gray-500">
              Welcome back! please enter
              your credentials to access
              your account.
            </p>

            {/* FORM */}
            <form
              className="w-full space-y-4"
              onSubmit={handleSubmit}
            >
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
                    onChange={
                      handleChange
                    }
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
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter Your Password"
                    className="w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm outline-none border-gray-300"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <div className="w-full flex justify-end">
                  <NavLink
                    to="/forget-password"
                    onClick={onClose}
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
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </button>
            </form>

            {/* SIGNUP */}
            <p className="text-md text-gray-700 mt-3 font-semibold">
              Don't have an account?{" "}
              <NavLink
                to="/sign-up"
                onClick={onClose}
                className="text-[#457358] hover:underline"
              >
                Sign up
              </NavLink>
            </p>

            {/* DIVIDER */}
            <div className="w-full flex items-center my-3">
              <div className="flex-grow border-t border-gray-300"></div>

              <span className="px-3 text-sm">
                or
              </span>

              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* GOOGLE */}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}