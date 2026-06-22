import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../pages/CartContext";
import toast from "react-hot-toast";
import {
  ShieldCheck, Truck, RefreshCw, ArrowLeft, Loader2,
  CreditCard, CheckCircle2, Lock, ChevronRight,
  Package, MapPin, Tag, AlertTriangle,
} from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

// ─── PayPal SDK Imports ───────────────────────────────────────────────────────
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const cn = (...c) => c.filter(Boolean).join(" ");
const fmt = (n) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 2,
  }).format(Number(n || 0));

// ─── Order Summary Sidebar ────────────────────────────────────────────────────
const OrderSummarySidebar = ({ item, pricing, address, appliedVoucher }) => (
  <div className="bg-white border border-[#e7dfd4] rounded-2xl overflow-hidden sticky top-28">
    {/* Product */}
    {console.log(appliedVoucher)}
    <div className="px-5 py-4 border-b border-[#e7dfd4]">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Order Summary</p>
      <div className="flex gap-3">
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#e7dfd4] flex-shrink-0 bg-[#faf8f5]">
          <img src={item?.image} alt={item?.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#143c2f] line-clamp-2 leading-snug">{item?.name}</p>
          <p className="text-[10px] text-gray-400 font-mono mt-1">SKU: {item?.sku}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-bold text-[#457358]">{fmt(item?.price?.sellingPrice)}</span>
            <span className="text-xs text-gray-400">× {item?.quantity}</span>
          </div>
          <p className="flex items-center gap-1.5 text-[11px] text-black mt-1 font-normal">
  <Truck className="w-3.5 h-3.5 text-black flex-shrink-0" />
  Estimated delivery within 5–6 business days.
</p>
        </div>
      </div>
    </div>

    {/* Delivery Address */}
    {address && (
      <div className="px-5 py-3 border-b border-[#e7dfd4] bg-[#fafaf8]">
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#457358] mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Delivering To</p>
            <p className="text-xs font-semibold text-[#143c2f]">{address.name || address.fullName}</p>
            <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
              {address.addl1}, {address.city}, {address.state} - {address.pincode}
            </p>
          </div>
        </div>
      </div>
    )}

    {/* Pricing Breakdown */}
    <div className="px-5 py-4 space-y-2.5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Subtotal</span>
        <span className="font-semibold text-[#143c2f]">{fmt(pricing?.subtotal)}</span>
      </div>
      {pricing?.mrpSavings > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">MRP Savings</span>
          <span className="font-semibold text-emerald-600">-{fmt(pricing.mrpSavings)}</span>
        </div>
      )}
      {pricing?.bannerDiscount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Offer Discount</span>
          <span className="font-semibold text-emerald-600">-{fmt(pricing.bannerDiscount)}</span>
        </div>
      )}
{appliedVoucher && (
  <div className="flex flex-col gap-1.5">
    {/* Monetary discount row — only for flat/percentage */}
    {appliedVoucher.discountType !== "complimentary" &&
      (pricing?.voucherDiscount > 0 || appliedVoucher?.discountAmount > 0) && (
      <div className="flex justify-between text-sm">
        <span className="flex items-center gap-1 text-gray-500">
          <Tag className="w-3 h-3" /> Voucher
          <span className="font-mono text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold">
            {appliedVoucher.code}
          </span>
        </span>
        <span className="font-semibold text-emerald-600">
          -{fmt(pricing?.voucherDiscount || appliedVoucher?.discountAmount)}
        </span>
      </div>
    )}

    {/* Complimentary row */}
    {appliedVoucher.discountType === "complimentary" && (
      <div className="flex flex-col gap-1.5 p-3 bg-green-50 border border-green-200 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-green-700 font-semibold text-xs">
            Free Gift
            <span className="font-mono text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-bold">
              {appliedVoucher.code}
            </span>
          </span>
          <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
            Added
          </span>
        </div>

        {/* Gift items list */}
        {appliedVoucher.complimentaryItems?.length > 0 && (
          <div className="space-y-1.5 mt-1">
            {appliedVoucher.complimentaryItems.map((gift, i) => (
              <div key={i} className="flex items-center gap-2">
                {gift.imageUrl ? (
                  <img src={gift.imageUrl} alt={gift.name}
                    className="w-8 h-8 rounded-lg object-cover border border-green-200 flex-shrink-0" />
                ) : (
                  <div>
                    
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-green-800 truncate">
                    {gift.name}
                    <span className="ml-1 text-[10px] font-normal text-green-500">×{gift.quantity}</span>
                  </p>
                  {gift.description && (
                    <p className="text-[10px] text-green-400 truncate">{gift.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
)}
      <div className="border-t border-dashed border-[#e7dfd4] pt-3">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-[#143c2f]">Total</span>
          <span className="text-xl font-black text-[#457358]">{fmt(pricing?.total)}</span>
        </div>
        {pricing?.totalDiscount > 0 && appliedVoucher?.discountType !== "complimentary" && (
  <p className="text-xs text-emerald-600 font-semibold mt-1 text-right">
    Saving {fmt(pricing.totalDiscount)} on this order!
  </p>
)}
{appliedVoucher?.discountType === "complimentary" && (
  <p className="text-xs text-emerald-600 font-semibold mt-1 text-right">
    Free gift included with your order!
  </p>
)}
      </div>
    </div>

    {/* Trust badges */}
    <div className="px-5 py-3 border-t border-[#e7dfd4] bg-[#fafaf8]">
      <div className="flex items-center justify-around">
        {[
          { icon: Lock,      label: "SSL Secured" },
          { icon: Truck,     label: "Fast Delivery" },
          { icon: RefreshCw, label: "Easy Returns" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 text-[10px] text-gray-400">
            <Icon className="w-3.5 h-3.5 text-[#457358]" />
            {label}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Payment Method Card ──────────────────────────────────────────────────────
const PaymentMethodCard = ({ id, selected, onSelect, icon, title, subtitle, badge, children }) => (
  <motion.div
    layout
    onClick={() => onSelect(id)}
    className={cn(
      "border rounded-2xl overflow-hidden cursor-pointer transition-all duration-200",
      selected
        ? "border-[#457358] shadow-md ring-1 ring-[#457358]/20"
        : "border-[#e7dfd4] hover:border-[#457358]/40 bg-white"
    )}
  >
    <div className="flex items-center gap-3 p-4">
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
        selected ? "bg-[#457358] text-white" : "bg-[#457358]/10 text-[#457358]"
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-[#143c2f]">{title}</p>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
      <div className={cn(
        "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
        selected ? "border-[#457358] bg-[#457358]" : "border-gray-300"
      )}>
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </div>

    <AnimatePresence>
      {selected && children && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="overflow-hidden"
        >
          <div className="px-4 pb-4 pt-0 border-t border-[#e7dfd4] bg-[#fafaf8]">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// ─── Stripe Info Panel ────────────────────────────────────────────────────────
const StripeInfoPanel = () => (
  <div className="pt-4 space-y-3">
    <p className="text-xs text-gray-500 leading-relaxed">
      You'll be securely redirected to Stripe's payment page to enter your card details.
      We never store your card information.
    </p>
    <div className="flex items-center gap-2 flex-wrap">
      {["VISA", "Mastercard", "Amex", "RuPay"].map((brand) => (
        <span key={brand}
          className="px-2.5 py-1 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-400 bg-white tracking-wider">
          {brand}
        </span>
      ))}
    </div>
    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
      <Lock className="w-3 h-3 text-[#457358]" />
      Powered by Stripe — PCI DSS compliant
    </div>
  </div>
);

// ─── PayPal Info Panel ────────────────────────────────────────────────────────
const PayPalInfoPanel = () => (
  <div className="pt-4 space-y-3">
    <p className="text-xs text-gray-500 leading-relaxed">
      Complete your payment smoothly via our safe checkout modal. 
      Log into your PayPal account directly or input any major credit card option.
    </p>
    <div className="flex items-center gap-2">
      <div className="px-3 py-1.5 bg-[#003087] rounded-lg">
        <span className="text-white text-xs font-black tracking-tight">
          Pay<span className="text-[#009cde]">Pal</span>
        </span>
      </div>
      <span className="text-[11px] text-gray-400">Fast. Secure. Trusted worldwide.</span>
    </div>
    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
      <Lock className="w-3 h-3 text-[#457358]" />
      Buyer Protection on every eligible purchase
    </div>
  </div>
);

// ─── Order Success Screen ─────────────────────────────────────────────────────
const OrderSuccessScreen = ({ orderId, total }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[60vh] flex items-center justify-center"
    >
      <div className="text-center space-y-6 px-6 max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-[#143c2f]">Order Placed!</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Your order has been confirmed and will be delivered soon.
          </p>
          {orderId && (
            <p className="text-xs text-gray-400 font-mono mt-2">
              Order ID: <span className="font-bold text-[#457358]">{orderId}</span>
            </p>
          )}
          {total && (
            <p className="text-lg font-bold text-[#457358] mt-1">{fmt(total)} paid</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/account/orders")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#457358] text-white rounded-xl text-sm font-bold hover:bg-[#143c2f] transition"
          >
            <Package className="w-4 h-4" /> Track Order
          </button>
          <button
            onClick={() => navigate("/shop")}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-[#e7dfd4] text-[#457358] rounded-xl text-sm font-bold hover:bg-[#457358]/5 transition"
          >
            Continue Shopping <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Standard Stripe Button ───────────────────────────────────────────────────
function StripePayNowButton({ paying, highlighted, total, onPay }) {
  return (
    <motion.button
      onClick={onPay}
      disabled={paying}
      animate={highlighted ? { x: [0, -6, 6, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
      className={cn(
        "cursor-pointer w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all shadow-sm disabled:opacity-60 bg-[#457358] hover:bg-[#143c2f] text-white",
        highlighted && "bg-rose-500 text-white ring-2 ring-rose-300"
      )}
    >
      {paying ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Redirecting to Stripe...
        </>
      ) : (
        <>
          <Lock className="w-4 h-4" />
          Pay {fmt(total)} via Stripe
        </>
      )}
    </motion.button>
  );
}

// ─── Main CheckoutPayment Page ────────────────────────────────────────────────
export default function CheckoutPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const token    = localStorage.getItem("token");
  const { fetchCartCount } = useCart();

  const { buyNowData, address, isBuyNow, isCartCheckout } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [paying,        setPaying]        = useState(false);
  const [orderSuccess,  setOrderSuccess]  = useState(false);
  const [orderId,       setOrderId]       = useState(null);
  const [highlighted,   setHighlighted]   = useState(false);

  useEffect(() => {
    if (!buyNowData || !token) navigate("/", { replace: true });
  }, []);

  if (!buyNowData) return null;

  const item           = buyNowData.item;
  const appliedVoucher = buyNowData.appliedVoucher || null;
  const pricing = {
    ...(buyNowData.pricing || {}),
    voucherDiscount: buyNowData.pricing?.voucherDiscount > 0
      ? buyNowData.pricing.voucherDiscount
      : (appliedVoucher?.discountAmount || 0),
    get totalDiscount() {
      return (buyNowData.pricing?.mrpSavings || 0) +
             (buyNowData.pricing?.bannerDiscount || 0) +
             (appliedVoucher?.discountAmount || 0);
    },
    get total() {
      return Math.max(0,
        (buyNowData.pricing?.subtotal || 0) -
        (buyNowData.pricing?.bannerDiscount || 0) -
        (appliedVoucher?.discountAmount || 0)
      );
    },
  };

  // ── Handle Stripe Pay Gateway ──────────────────────────────────────────────
  const handleStripePay = async () => {
    setPaying(true);
  try {
    const endpoint = isCartCheckout
      ? `${BASE_URL}/orders/cart`
      : `${BASE_URL}/orders/buynow`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentMethod: "stripe",
        address,
        isBuyNow: !isCartCheckout,
      }),
    });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Order failed");

      if (json.data?.redirectUrl) {
        window.location.href = json.data.redirectUrl;
        return;
      }

      setOrderId(json.data?.orderId || json.data?._id);
      await fetchCartCount();
      setOrderSuccess(true);


      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err.message || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  // ── Success Screen Route ────────────────────────────────────────────────────
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <section className="flex-1 bg-[#faf8f5] pt-28 sm:pt-32 lg:pt-36 pb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <OrderSuccessScreen orderId={orderId} total={pricing.total} />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-1 bg-[#faf8f5] pt-10 sm:pt-12 lg:pt-12 pb-12 text-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#457358] transition">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="text-gray-300">Review Order</span>
              <ChevronRight className="w-3 h-3" />
              <span className="font-bold text-[#457358]">Payment</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#143c2f] mb-6">
            Select Payment Method
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

            {/* ── LEFT: Payment Selection ── */}
            <div className="space-y-4">

              {/* Stripe */}
              <PaymentMethodCard
                id="stripe"
                selected={paymentMethod === "stripe"}
                onSelect={setPaymentMethod}
                icon={<CreditCard className="w-5 h-5" />}
                title="Pay with Stripe"
                subtitle="Credit card, Debit card — all major cards accepted"
                badge="Recommended"
              >
                <StripeInfoPanel />
              </PaymentMethodCard>

              {/* PayPal */}
              <PaymentMethodCard
                id="paypal"
                selected={paymentMethod === "paypal"}
                onSelect={setPaymentMethod}
                icon={<span className="text-sm font-black leading-none">P</span>}
                title="Pay with PayPal"
                subtitle="PayPal account or card via PayPal"
              >
                <PayPalInfoPanel />
              </PaymentMethodCard>

              {/* Info note */}
              <div className="flex items-start gap-2.5 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-600 leading-relaxed">
                  Completing checkout secures your payment route directly. You will stay on this page 
                  while processing via <strong>{paymentMethod === "paypal" ? "PayPal Smart Window" : "Stripe secure panel"}</strong>.
                </p>
              </div>

              {/* ── Conditional Gateway CTA Form Placement ── */}
              <div className="w-full">
                {paymentMethod === "paypal" ? (
                  <PayPalScriptProvider options={{ "client-id": "AefB7dbLNjb8zgFON22zytL_Kmz4L9StIcNm7fgCeUcI5BMTB_x2dJ21G6s0018SexY_ZQ-KE5Otd3aR",currency: "AUD" }}>
                    <PayPalButtons
                      style={{ layout: "vertical", shape: "rect", label: "pay" }}
                      disabled={paying}
                      
                   createOrder={async () => {
  setPaying(true);
  try {
    // ← pick endpoint based on flow
    const endpoint = isCartCheckout
      ? `${BASE_URL}/orders/cart`
      : `${BASE_URL}/orders/buynow`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentMethod: "paypal",
        address,
        isBuyNow: !isCartCheckout,
      }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || "Failed");
    if (!json.data?.paypalOrderId) throw new Error("PayPal Order ID missing");

    return json.data.paypalOrderId;
  } catch (err) {
    toast.error(err.message || "PayPal initialization failed");
    setPaying(false);
    throw err;
  }
}}

                      onApprove={async (data, actions) => {
                        try {
                          const res = await fetch(`${BASE_URL}/checkout/paypal/success?token=${data.orderID}&PayerID=${data.payerID}`, {
                            method: "GET",
                            headers: {
                              Authorization: `Bearer ${token}`,
                            }
                          });
                          const json = await res.json();

                          if (json.success) {
                            await fetchCartCount();
                            setOrderId(json.orderId);
                            setOrderSuccess(true);
                            toast.success("Order processed successfully!");
                          } else {
                            throw new Error(json.message || "Capture verification failed.");
                          }
                        } catch (err) {
                          toast.error(err.message || "Payment capture failed.");
                        } finally {
                          setPaying(false);
                        }
                      }}
                      
                      onCancel={() => {
                        setPaying(false);
                        toast.error("Payment cancelled by user.");
                      }}
                      onError={(err) => {
                        setPaying(false);
                        console.error("PayPal Error Context:", err);
                      }}
                    />
                  </PayPalScriptProvider>
                ) : (
                  <StripePayNowButton
                    paying={paying}
                    highlighted={highlighted}
                    total={pricing.total}
                    onPay={handleStripePay}
                  />
                )}
              </div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="space-y-4">
              <OrderSummarySidebar
                item={item}
                pricing={pricing}
                address={address}
                appliedVoucher={appliedVoucher}
              />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}