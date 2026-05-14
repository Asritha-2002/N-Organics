import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  X,
  ShoppingCart,
  CheckCircle2,
  ChevronRight,
  Package,
  Zap,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const cn = (...c) => c.filter(Boolean).join(" ");

// ─── AddToCartModal ───────────────────────────────────────────────────────────
// Props:
//   open          — boolean, controls visibility
//   onClose       — fn, called when user dismisses
//   product       — full product object from ProductDetail state
//   selectedVariant — the variant that was just added
//   quantity      — how many were added
//   bestOffer     — product.bestOffer (optional)
// ─────────────────────────────────────────────────────────────────────────────
export default function AddToCartModal({
  open,
  onClose,
  product,
  selectedVariant,
  quantity = 1,
  bestOffer,
}) {
  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!product || !selectedVariant) return null;

  // ── Derived values ─────────────────────────────────────────────────────────
  const sellingPrice = selectedVariant.price?.sellingPrice ?? 0;
  const mrp          = selectedVariant.price?.mrp ?? 0;
  const discount     = mrp > sellingPrice
    ? Math.round((1 - sellingPrice / mrp) * 100)
    : 0;
  const lineTotal    = sellingPrice * quantity;

  // Pick best image: variant first, then product
  const variantImg = selectedVariant.images?.[0];
  const productImg = product.images?.[0];
  const image =
    (typeof variantImg === "string" ? variantImg : variantImg?.url) ||
    (typeof productImg === "string" ? productImg : productImg?.url) ||
    null;

  // Attributes to show
  const attrs = Object.entries(selectedVariant.attributes || {})
    .filter(([, v]) => v && v !== "" && v !== 0 && v !== null)
    .slice(0, 3);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="atc-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
          />

          {/* ── Drawer ── */}
          <motion.div
            key="atc-drawer"
            initial={{ x: "100%", opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 32, mass: 0.9 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm sm:max-w-[400px] flex flex-col bg-[#faf8f5] shadow-2xl border-l border-[#e7dfd4]"
          >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e7dfd4] bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#143c2f]">Added to Cart</p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {quantity} item{quantity !== 1 ? "s" : ""} added
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Product Card ────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

              {/* Product info row */}
              <div className="flex gap-4 bg-white rounded-2xl border border-[#e7dfd4] p-4 shadow-sm">
                {/* Image */}
                <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-[#e7dfd4] bg-[#f4efe9]">
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-7 h-7 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="text-sm font-bold text-[#143c2f] leading-snug line-clamp-2">
                    {product.name}
                  </p>

                  {/* Attributes */}
                  {attrs.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {attrs.map(([key, val]) => (
                        <span
                          key={key}
                          className="text-[10px] bg-[#457358]/8 text-[#457358] border border-[#457358]/20 px-2 py-0.5 rounded-full font-medium capitalize"
                        >
                          {val}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Qty + price */}
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[11px] text-gray-400 font-medium">
                      Qty: <span className="font-bold text-[#143c2f]">{quantity}</span>
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-[#457358]">
                        {fmt(sellingPrice)}
                      </span>
                      {discount > 0 && (
                        <span className="text-[10px] text-gray-400 line-through">
                          {fmt(mrp)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Line total */}
              <div className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl border border-[#e7dfd4]">
                <span className="text-xs text-gray-500 font-medium">Item Total</span>
                <div className="flex items-center gap-2">
                  {discount > 0 && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                      {discount}% OFF
                    </span>
                  )}
                  <span className="text-sm font-black text-[#143c2f]">{fmt(lineTotal)}</span>
                </div>
              </div>

              {/* Best offer pill */}
              {bestOffer && bestOffer.discount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs font-semibold",
                    bestOffer.discountType === "percentage"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  )}
                >
                  <Zap className="w-4 h-4 flex-shrink-0" />
                  <span>
                    <span className="font-bold">Best Offer: </span>
                    {bestOffer.discountType === "percentage"
                      ? `${bestOffer.discount}% off`
                      : `Flat ₹${bestOffer.discount} off`}
                    {" "}applied at checkout
                  </span>
                </motion.div>
              )}
            </div>

            {/* ── Footer CTAs ─────────────────────────────────────────────── */}
            <div className="px-5 py-5 border-t border-[#e7dfd4] bg-white space-y-3">

              {/* Go to Cart */}
              <Link
                to="/cart"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#457358] hover:bg-[#143c2f] text-white rounded-2xl text-sm font-bold transition-all shadow-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                Go to Cart
              </Link>

              {/* Continue Shopping */}
              <button
              to="/shop"
                onClick={onClose}
                className="cursor-pointer flex items-center justify-center gap-2 w-full py-3.5 bg-[#f4efe9] hover:bg-[#e7dfd4] text-[#143c2f] rounded-2xl text-sm font-semibold transition-all border border-[#e7dfd4]"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}