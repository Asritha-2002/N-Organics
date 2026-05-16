import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import {
  ShoppingBag, Trash2, Plus, Minus, Tag, ChevronRight,
  AlertTriangle, Package, Sparkles, Clock, ArrowLeft,
  X, ChevronDown, Loader2, Gift, Zap,
  RefreshCw, ShieldCheck, Truck, BadgePercent, TicketPercent,
} from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const cn = (...c) => c.filter(Boolean).join(" ");
const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

// ─── Countdown Timer ──────────────────────────────────────────────────────────
const Countdown = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate) - new Date();
      if (diff <= 0) { setTimeLeft("Expired"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`);
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [endDate]);
  return (
    <span className="flex items-center gap-1 text-amber-600 font-semibold">
      <Clock className="w-3 h-3" />{timeLeft}
    </span>
  );
};

// ─── Stock Badge ──────────────────────────────────────────────────────────────
const StockBadge = ({ status, reason }) => {
  if (status === "in_stock") return null;
  const styles = {
    out_of_stock:       "bg-rose-100 text-rose-600 border-rose-200",
    insufficient_stock: "bg-amber-100 text-amber-600 border-amber-200",
    low_stock:          "bg-orange-100 text-orange-600 border-orange-200",
    unavailable:        "bg-gray-100 text-gray-500 border-gray-200",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border", styles[status] || styles.unavailable)}>
      <AlertTriangle className="w-2.5 h-2.5" />
      {reason || status.replace(/_/g, " ")}
    </span>
  );
};

// ─── Voucher Section ──────────────────────────────────────────────────────────
const VoucherSection = ({ vouchers, appliedVoucher, onApply, onRemove, loading }) => {
  const [open, setOpen]           = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [applying, setApplying]   = useState(false);

  const handleManualApply = async () => {
    if (!manualCode.trim()) return;
    setApplying(true);
    await onApply(manualCode.trim().toUpperCase());
    setApplying(false);
    setManualCode("");
  };

  if (appliedVoucher) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Tag className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-700 font-mono tracking-wider">{appliedVoucher.code}</p>
              <p className="text-xs text-emerald-600">saving {fmt(appliedVoucher.discountAmount)}</p>
            </div>
          </div>
          <button onClick={onRemove} disabled={loading}
            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  const eligibleVouchers   = vouchers.filter((v) => v.isEligible);
  const ineligibleVouchers = vouchers.filter((v) => !v.isEligible);

  return (
    <div className="bg-white border border-[#e7dfd4] rounded-2xl overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#faf8f5] transition">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#457358]" />
          <span className="text-sm font-semibold text-[#143c2f]">Apply Voucher</span>
          {eligibleVouchers.length > 0 && (
            <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
              {eligibleVouchers.length} available
            </span>
          )}
        </div>
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-3 border-t border-[#e7dfd4]">
              {/* Manual input */}
              <div className="flex gap-2 pt-3">
                <input
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleManualApply()}
                  placeholder="Enter voucher code"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-[#e7dfd4] bg-[#faf8f5] text-sm font-mono tracking-wider uppercase placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#457358]/40 focus:border-[#457358] transition"
                />
                <button onClick={handleManualApply} disabled={!manualCode.trim() || applying}
                  className="px-4 py-2.5 bg-[#457358] hover:bg-[#143c2f] disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition flex items-center gap-1.5">
                  {applying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
                </button>
              </div>

              {/* Eligible */}
              {eligibleVouchers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Available for you</p>
                  {eligibleVouchers.map((v) => (
                    <div key={v.voucherId}
                      className="flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-xs font-black text-emerald-700 tracking-widest">{v.code}</span>
                          <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                            Save {fmt(v.potentialDiscount)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{v.title}</p>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5" /> Expires <Countdown endDate={v.endDate} />
                        </p>
                      </div>
                      <button onClick={() => onApply(v.code)} disabled={loading}
                        className="flex-shrink-0 ml-3 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition">
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Ineligible */}
              {ineligibleVouchers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Add more to unlock</p>
                  {ineligibleVouchers.map((v) => (
                    <div key={v.voucherId}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50/50 opacity-70">
                      <div className="flex-1 min-w-0">
                        <span className="font-mono text-xs font-black text-gray-500 tracking-widest">{v.code}</span>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{v.title}</p>
                        <p className="text-[10px] text-amber-600 font-semibold mt-0.5">
                          Add {fmt(v.amountNeeded)} more to unlock
                        </p>
                      </div>
                      <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-1 rounded-lg font-bold">Locked</span>
                    </div>
                  ))}
                </div>
              )}

              {vouchers.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-3">No vouchers available right now</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Order Summary ────────────────────────────────────────────────────────────
const OrderSummary = ({ pricing, onCheckout, loading }) => {
  const rows = [
    { label: "Subtotal",         value: pricing.subtotal,         show: true },
    { label: "MRP Savings",      value: pricing.mrpSavings,       show: pricing.mrpSavings > 0,     color: "text-emerald-600", prefix: "-" },
    { label: "Banner Discount",  value: pricing.bannerDiscount,   show: pricing.bannerDiscount > 0,  color: "text-emerald-600", prefix: "-" },
    { label: "Voucher Discount", value: pricing.voucherDiscount,  show: pricing.voucherDiscount > 0, color: "text-emerald-600", prefix: "-" },
  ].filter((r) => r.show);

  return (
    <div className="bg-white border border-[#e7dfd4] rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#e7dfd4]">
        <h3 className="text-sm font-bold text-[#143c2f] uppercase tracking-wider">Order Summary</h3>
      </div>
      <div className="px-5 py-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{row.label}</span>
            <span className={cn("font-semibold", row.color || "text-[#143c2f]")}>
              {row.prefix}{fmt(row.value)}
            </span>
          </div>
        ))}

        <div className="border-t border-dashed border-[#e7dfd4] pt-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-[#143c2f]">Total</span>
            <span className="text-xl font-black text-[#457358]">{fmt(pricing.total)}</span>
          </div>
          {pricing.totalDiscount > 0 && (
            <p className="text-xs text-emerald-600 font-semibold mt-1 text-right">
              🎉 You're saving {fmt(pricing.totalDiscount)} on this order!
            </p>
          )}
        </div>

        <button onClick={onCheckout} disabled={loading}
          className="cursor-pointer w-full flex items-center justify-center gap-2 py-3.5 bg-[#457358] hover:bg-[#143c2f] disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all shadow-sm mt-2">
          {loading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <><ShieldCheck className="w-4 h-4" /> Place Order</>}
        </button>

        <div className="flex items-center justify-center gap-4 pt-1">
          {[
            { icon: ShieldCheck, label: "Secure" },
            { icon: Truck,       label: "Fast Delivery" },
            { icon: RefreshCw,   label: "Easy Returns" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-[10px] text-gray-400">
              <Icon className="w-3.5 h-3.5" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main BuyNow Page ─────────────────────────────────────────────────────────
export default function BuyNow() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const token     = localStorage.getItem("token");

  // buyNowId comes via navigation state from ProductDetail
  // e.g. navigate("/buy-now", { state: { buyNowId: "..." } })
  const buyNowId  = location.state?.buyNowId;

  const [data,           setData]           = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [quantity,       setQuantity]       = useState(1);
  const [updatingQty,    setUpdatingQty]    = useState(false);
  const [checkingOut,    setCheckingOut]    = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);

  // ── Fetch Buy Now session ────────────────────────────────────────────────
const fetchBuyNow = useCallback(async () => {
  if (!token) { setLoading(false); return; }
  try {
    setLoading(true);
    const res  = await fetch(`${BASE_URL}/buynow`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Failed to load");
    setData(json.data);
    setQuantity(json.data.item?.quantity || 1);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [token]); // ← removed buyNowId from deps since we don't need it

  // ── Fetch Default Address ────────────────────────────────────────────────
  const fetchDefaultAddress = useCallback(async () => {
    if (!token) return;
    try {
      const res  = await fetch(`${BASE_URL}/addresses/default`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setDefaultAddress(json.success ? json.data : null);
    } catch {
      setDefaultAddress(null);
    }
  }, [token]);

 useEffect(() => {
  fetchBuyNow();
  fetchDefaultAddress();
}, [fetchBuyNow, fetchDefaultAddress]); // ← no buyNowId here either

  // ── Update quantity ──────────────────────────────────────────────────────
const handleQuantityChange = async (newQty) => {
  if (newQty < 1) return;

  if (
    data?.item?.maxAllowedQuantity &&
    newQty > data.item.maxAllowedQuantity
  ) {
    return;
  }

  setUpdatingQty(true);

  try {
    const res = await fetch(`${BASE_URL}/buynow/quantity`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: newQty }),
    });

    const json = await res.json();

    // ❌ Failed
    if (!res.ok || !json.success) {
      toast.error(json.message || "Failed to update quantity");

      // Auto clamp like cart
      if (json.maxAllowed) {
        setQuantity(json.maxAllowed);
      }

      return;
    }

    // ✅ LOW STOCK WARNING
    if (json.warning) {
      toast(json.warning, { icon: "⚠️" });
    }

    // ✅ Success
    setQuantity(newQty);

    await fetchBuyNow();

  } catch (err) {
    toast.error(err.message || "Failed to update quantity");
  } finally {
    setUpdatingQty(false);
  }
};

  // ── Apply Voucher ────────────────────────────────────────────────────────
  const handleApplyVoucher = async (code) => {
    try {
      const res  = await fetch(`${BASE_URL}/buynow/voucher/apply`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ code }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast.success(`Voucher applied! Saving ${fmt(json.data?.discountAmount)}`);
      await fetchBuyNow();
    } catch (err) {
      toast.error(err.message || "Invalid voucher code");
    }
  };

  // ── Remove Voucher ───────────────────────────────────────────────────────
  const handleRemoveVoucher = async () => {
    try {
      const res  = await fetch(`${BASE_URL}/buynow/voucher/remove`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast.success("Voucher removed");
      await fetchBuyNow();
    } catch (err) {
      toast.error(err.message || "Failed to remove voucher");
    }
  };

  // ── Place Order ──────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
     if (!defaultAddress) {
    toast(
  "Please add a delivery address to proceed",
  {
    icon: "⚠️",
  }
);

setTimeout(() => {
  navigate("/account/addresses");
}, 2600);

    return;
  }
    if (!data?.item?.isAvailable) {
      toast.error("This item is currently unavailable");
      return;
    }
    setCheckingOut(true);
    navigate("/checkout/payment", {
      state: {
        buyNowId,
        buyNowData: data,
        address: defaultAddress,
        isBuyNow: true,
      },
    });
    setCheckingOut(false);
  };

  // ── Guards ───────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div>
        <Navbar />
        <section className=" bg-[#faf8f5] pt-36 flex items-center justify-center">
          <div className="text-center space-y-4 px-6">
            <ShoppingBag className="w-10 h-10 text-[#457358] mx-auto" />
            <h2 className="text-lg font-bold text-[#143c2f]">Sign in to continue</h2>
            <Link to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#457358] text-white rounded-xl text-sm font-semibold hover:bg-[#143c2f] transition">
              Sign In
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }


  if (loading) {
    return (
      <div>
        <Navbar />
        <section className=" bg-[#faf8f5] pt-28 sm:pt-32 lg:pt-36 pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="h-6 w-32 bg-gray-200 rounded-xl animate-pulse mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
              <div className="space-y-4">
                <div className="h-36 bg-gray-200 rounded-2xl animate-pulse" />
                <div className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
              </div>
              <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <Navbar />
        <section className=" bg-[#faf8f5] pt-36 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Package className="w-10 h-10 text-rose-400 mx-auto" />
            <p className="text-[#143c2f] font-semibold">{error || "Something went wrong"}</p>
            <button onClick={fetchBuyNow}
              className="flex items-center gap-2 px-4 py-2 bg-[#457358] text-white rounded-xl text-sm font-medium hover:bg-[#143c2f] transition mx-auto">
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const item              = data.item;
  const appliedVoucher = data.appliedVoucher || null;
const pricing = {
  ...(data.pricing || {}),
  voucherDiscount: data.pricing?.voucherDiscount > 0
    ? data.pricing.voucherDiscount
    : (appliedVoucher?.discountAmount || 0),  // fallback to applied voucher
  // recalculate total and totalDiscount to stay consistent
  get totalDiscount() {
    return (data.pricing?.mrpSavings || 0) +
           (data.pricing?.bannerDiscount || 0) +
           (appliedVoucher?.discountAmount || 0);
  },
  get total() {
    return Math.max(0,
      (data.pricing?.subtotal || 0) -
      (data.pricing?.bannerDiscount || 0) -
      (appliedVoucher?.discountAmount || 0)
    );
  },
};
  const bestBanner        = data.bestBanner        || null;
  const availableVouchers = data.availableVouchers || [];
  const allBanners        = data.allApplicableBanners || [];

  const discountPct = item.price.mrp > item.price.sellingPrice
    ? Math.round((1 - item.price.sellingPrice / item.price.mrp) * 100)
    : 0;
  const hasAttrs = Object.values(item.attributes || {}).some((v) => v && v !== "" && v !== null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className=" bg-[#faf8f5] pt-28 sm:pt-32 lg:pt-36 pb-12 text-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <button onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#457358] transition mb-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Go Back
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#143c2f]">Buy Now</h1>
            </div>
            {/* Quick add to cart option */}
            <Link to="/cart"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#457358] hover:text-[#143c2f] transition border border-[#457358]/30 px-3 py-2 rounded-xl hover:bg-[#457358]/5">
              <ShoppingBag className="w-3.5 h-3.5" /> View Cart
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

            {/* ── LEFT ── */}
            <div className="space-y-4">

              {/* Banner offer strip */}
              {bestBanner && bestBanner.discountAmount > 0 && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#457358]/10 to-emerald-50 border border-[#457358]/20 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-[#457358] flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#143c2f]">{bestBanner.title}</p>
                    <p className="text-xs text-[#457358] font-semibold">
                      {bestBanner.discountType === "percentage"
                        ? `${bestBanner.discount}% off`
                        : `Flat ${fmt(bestBanner.discount)} off`}
                      {" "}— saving {fmt(bestBanner.discountAmount)}
                    </p>
                  </div>
                  {bestBanner.endDate && (
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] text-gray-400">Ends in</p>
                      <Countdown endDate={bestBanner.endDate} />
                    </div>
                  )}
                </motion.div>
              )}

              {/* Delivery address */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[#e7dfd4] rounded-2xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-[#457358]/10 flex items-center justify-center">
                        <Truck className="w-4 h-4 text-[#457358]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                          {defaultAddress ? `Deliver To ${defaultAddress.type || "Home"}` : "Delivery Address"}
                        </p>
                        {defaultAddress
                          ? <p className="text-sm font-bold text-[#143c2f]">{defaultAddress.name || defaultAddress.fullName}</p>
                          : <p className="text-sm font-bold text-rose-500">No Address Added</p>
                        }
                      </div>
                    </div>
                    {defaultAddress ? (
                      <div className="pl-10">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {defaultAddress.addl1}
                          {defaultAddress.addressLine2 && `, ${defaultAddress.addressLine2}`},{" "}
                          {defaultAddress.city}, {defaultAddress.state},{" "}
                          {defaultAddress.country} - {defaultAddress.pincode}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Phone: {defaultAddress.mobilenum}</p>
                      </div>
                    ) : (
                      <div className="pl-10">
                        <button onClick={() => navigate("/account/addresses")}
                          className="cursor-pointer mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#457358] hover:text-[#143c2f] transition">
                          Add Address <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <button onClick={() => navigate("/account/addresses")}
                    className="cursor-pointer flex-shrink-0 text-xs font-semibold text-[#457358] hover:text-[#143c2f] transition">
                    {defaultAddress ? "Change" : "Add"}
                  </button>
                </div>
              </motion.div>

              {/* ── Product Item Card ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "bg-white rounded-2xl border transition-all duration-200",
                  !item.isAvailable
                    ? "border-rose-200 bg-rose-50/30 opacity-70"
                    : bestBanner
                      ? "border-[#457358]/30 shadow-sm ring-1 ring-[#457358]/10"
                      : "border-[#e7dfd4]"
                )}
              >
                

                <div className="flex gap-3 sm:gap-4 p-4 sm:p-5 relative">
                  {/* Image */}
                  <Link to={`/product/${item.productId}`}
                    className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-[#e7dfd4] bg-[#faf8f5]">
                    <img src={item.image} alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/product/${item.productId}`}
                        className="text-sm font-bold text-[#143c2f] leading-snug hover:text-[#457358] transition line-clamp-2">
                        {item.name}
                      </Link>
                    </div>

                    {/* SKU */}
                    <p className="text-[10px] text-gray-400 font-mono tracking-widest">
                      SKU: {item.sku}
                    </p>

                    {/* Attributes */}
                    {hasAttrs && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.attributes.size  && <span className="text-[10px] bg-[#457358]/8 text-[#457358] border border-[#457358]/20 px-2 py-0.5 rounded-full font-medium">{item.attributes.size}</span>}
                        {item.attributes.shade && <span className="text-[10px] bg-[#457358]/8 text-[#457358] border border-[#457358]/20 px-2 py-0.5 rounded-full font-medium">{item.attributes.shade}</span>}
                        {item.attributes.scent && <span className="text-[10px] bg-[#457358]/8 text-[#457358] border border-[#457358]/20 px-2 py-0.5 rounded-full font-medium">{item.attributes.scent}</span>}
                      </div>
                    )}

                    <StockBadge status={item.stockStatus} reason={item.unavailableReason} />

                    {/* Price + Quantity */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-[#457358]">
                          {fmt(item.price.sellingPrice)}
                        </span>
                        {item.price.mrp > item.price.sellingPrice && (
                          <>
                            <span className="text-xs text-gray-400 line-through">{fmt(item.price.mrp)}</span>
                            {discountPct > 0 && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                                -{discountPct}%
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Quantity stepper */}
                      {item.isAvailable && (
                        <div className="flex items-center gap-0 border border-[#e7dfd4] rounded-xl overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={updatingQty || quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center text-[#457358] hover:bg-[#457358]/8 disabled:opacity-30 transition">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-[#143c2f]">
                            {updatingQty
                              ? <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                              : quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={
  updatingQty ||
  (
    item.maxAllowedQuantity &&
    quantity >= item.maxAllowedQuantity
  )
}
                            className="w-8 h-8 flex items-center justify-center text-[#457358] hover:bg-[#457358]/8 disabled:opacity-30 transition">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Subtotal */}
                    {item.isAvailable && (
                      <p className="text-xs text-gray-400">
                        Subtotal:{" "}
                        <span className="font-semibold text-gray-600">
                          {fmt(item.price.sellingPrice * quantity)}
                        </span>
                      </p>
                    )}

                    {/* Banner savings inline */}
                    {bestBanner && bestBanner.discountAmount > 0 && item.isAvailable && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-[#457358]/10 border border-[#457358]/25 rounded-lg w-fit"
                      >
                        <Zap className="w-3 h-3 text-[#457358] flex-shrink-0" />
                        <span className="text-[11px] font-bold text-[#457358]">
                          {bestBanner.title}: saving {fmt(bestBanner.discountAmount)}
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Voucher section */}
              <VoucherSection
                vouchers={availableVouchers}
                appliedVoucher={appliedVoucher}
                onApply={handleApplyVoucher}
                onRemove={handleRemoveVoucher}
                loading={updatingQty}
              />
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="space-y-4 lg:sticky lg:top-28">
              <OrderSummary
                pricing={pricing}
                onCheckout={handlePlaceOrder}
                loading={checkingOut}
              />

              {/* All applicable banners */}
              {allBanners.length > 0 && (
                <div className="bg-white border border-[#e7dfd4] rounded-2xl p-4 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5" /> Active Offers
                  </p>
                  {allBanners.map((b, i) => (
                    <div key={String(b.bannerId)} className={cn(
                      "flex items-center justify-between p-2.5 rounded-xl text-xs",
                      i === 0 ? "bg-[#457358]/8 border border-[#457358]/20" : "bg-gray-50 border border-gray-100"
                    )}>
                      <div>
                        <p className={cn("font-semibold", i === 0 ? "text-[#457358]" : "text-gray-600")}>
                          {b.title}
                          {i === 0 && <span className="ml-1.5 text-[9px] bg-[#457358] text-white px-1.5 py-0.5 rounded-full font-bold">BEST</span>}
                        </p>
                        <p className="text-gray-400">
                          {b.discountType === "percentage" ? `${b.discount}%` : fmt(b.discount)} off
                        </p>
                      </div>
                      <span className={cn("font-bold", i === 0 ? "text-[#457358]" : "text-gray-500")}>
                        -{fmt(b.discountAmount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}