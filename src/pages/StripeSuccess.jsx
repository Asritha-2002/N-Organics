import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { Loader2 } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function StripeSuccess() {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();
  const { fetchCartCount } = useCart();
  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) { setStatus("error"); return; }

    fetch(`${BASE_URL}/checkout/stripe/success?session_id=${sessionId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(r => r.json())
      .then(async json => {
        if (json.success) {
          await fetchCartCount();
          setOrderId(json.orderId);
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#457358] mx-auto" />
          <p className="text-sm text-gray-500">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <p className="text-xl font-bold text-red-500">Payment verification failed</p>
          <p className="text-sm text-gray-400 mt-2">Please contact support if you were charged.</p>
          <button onClick={() => navigate("/shop")}
            className="mt-4 px-6 py-2 bg-[#457358] text-white rounded-xl text-sm font-bold">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // success — reuse your existing OrderSuccessScreen look
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div className="space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <span className="text-4xl">✅</span>
        </div>
        <h2 className="text-2xl font-bold text-[#143c2f]">Order Placed!</h2>
        {orderId && <p className="text-xs text-gray-400 font-mono">Order ID: <strong className="text-[#457358]">{orderId}</strong></p>}
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate("/account/orders")}
            className="px-6 py-2 bg-[#457358] text-white rounded-xl text-sm font-bold">
            Track Order
          </button>
          <button onClick={() => navigate("/shop")}
            className="px-6 py-2 border border-[#e7dfd4] text-[#457358] rounded-xl text-sm font-bold">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}