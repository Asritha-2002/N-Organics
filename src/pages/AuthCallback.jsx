import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../pages/CartContext";

export default function AuthCallback() {
  const navigate       = useNavigate();
  const location       = useLocation();
  const { fetchCartCount } = useCart();

  useEffect(() => {
    const params  = new URLSearchParams(location.search);
    const token   = params.get("token");
    const name    = params.get("name");
    const error   = params.get("error");

    if (error || !token) {
      toast.error("Google sign-in failed. Please try again.");
      navigate("/sign-in");
      return;
    }

    // Save token + user info
    localStorage.setItem("token",   token);
    localStorage.setItem("isAdmin", "false");  // ← always false for Google
    if (name) localStorage.setItem("userName", decodeURIComponent(name));

    fetchCartCount();

    toast.success(`Welcome back, ${decodeURIComponent(name || "there")}!`);
    navigate("/account");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-3 border-[#457358] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 text-sm">Signing you in with Google...</p>
      </div>
    </div>
  );
}