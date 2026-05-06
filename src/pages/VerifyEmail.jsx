import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
//import bg from "../assets/hero-sections-contact/contactsectionbgc-1.png";
import axios from "axios";
const BASE_URL=import.meta.env.VITE_BASE_URL;

const VerifyEmail = () => {
  const [status, setStatus] = useState("verifying"); // verifying, success, failed
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  // Use a ref to prevent multiple calls in Strict Mode
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!token || hasVerified.current) return;

    const verifyEmail = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/verify/${token}`)
        setStatus("success");
        setMessage(res.data.message);
      } catch (err) {
        setStatus("failed");
        setMessage(
          err.response?.data?.message ||
            "Verification failed. This link may have expired.",
        );
      } finally {
        setLoading(false);
        hasVerified.current = true; // mark as verified to prevent re-run
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div
      
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center"
    >
      {loading && (
        <div className="flex flex-col items-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mb-4"></div>
          <p className="text-gray-500 font-medium">Verifying your email...</p>
        </div>
      )}

      {!loading && status === "success" && (
        <div className="text-center bg-[#ffffff] w-[300px] p-8 rounded-xl flex flex-col items-center justify-center border border-[#002b0a]">
          <div className="bg-green-600 rounded-full w-13 h-13 flex items-center justify-center mb-4">
            <FaCheck className="text-white text-2xl" />
          </div>
          <p className="text-gray-700 mb-6">
            Congratulations! Your Account has been created successfully.
          </p>
          <button
            onClick={() => navigate("/sign-in")}
            className="bg-[#002b0a] text-white hover:bg-[#457358] px-20 py-2 rounded-lg cursor-pointer"
          >
            Login
          </button>
        </div>
      )}

      {!loading && status === "failed" && (
        <div className="text-center bg-[#ffffff] w-[300px] p-8 rounded-xl flex flex-col items-center justify-center border border-[#002b0a]">
          <div className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <FaTimes className="text-white text-2xl" />
          </div>
          <p className="text-gray-700 mb-6">Account already verified</p>
          <button
            onClick={() => navigate("/sign-in")}
            className="bg-[#002b0a] text-white hover:bg-[#457358] px-20 py-2 rounded-lg cursor-pointer"
          >
            Login
          </button>
        </div>
      )}

      {/* Loader styles */}
      <style>{`
        .loader {
          border-top-color: #2caf69d7;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail
