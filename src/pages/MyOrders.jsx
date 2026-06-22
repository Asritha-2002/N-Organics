import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReviewModal from "../components/ReviewModal";
import {
  ShoppingBag,
  Eye,
  EyeOff,
  Package,
  MapPin,
  CreditCard,
  Tag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  RotateCcw,
  Zap,
  ChevronUp,
  Calendar,
  Hash,
} from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const fmt = (n, currency = "AUD") =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(n || 0));

const fmtDate = (d) => {
  try {
    return new Date(d).toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

// ─────────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────────
const STATUS = {
  pending: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
    Icon: Clock,
  },

  confirmed: {
    label: "Confirmed",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-400",
    Icon: CheckCircle2,
  },

  processing: {
    label: "Processing",
    cls: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-400",
    Icon: Zap,
  },

  shipped: {
    label: "Shipped",
    cls: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-400",
    Icon: Truck,
  },

  out_for_delivery: {
    label: "Out for Delivery",
    cls: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-400",
    Icon: Truck,
  },

  delivered: {
    label: "Delivered",
    cls: "bg-teal-50 text-teal-700 border-teal-200",
    dot: "bg-teal-400",
    Icon: CheckCircle2,
  },

  cancelled: {
    label: "Cancelled",
    cls: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-400",
    Icon: XCircle,
  },

  return_requested: {
    label: "Return Requested",
    cls: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-400",
    Icon: RotateCcw,
  },

  returned: {
    label: "Returned",
    cls: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-400",
    Icon: RotateCcw,
  },

  refund_initiated: {
    label: "Refund Initiated",
    cls: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-400",
    Icon: RotateCcw,
  },

  refund_completed: {
    label: "Refund Completed",
    cls: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-400",
    Icon: CheckCircle2,
  },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS[status] || STATUS.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// DETAIL ROW
// ─────────────────────────────────────────────────────────────
const DetailRow = ({ label, value, valueClass = "" }) => (
  <div className="flex items-start justify-between py-2 border-b border-dashed border-[#e7dfd4] last:border-0 gap-4">
    <span className="text-xs text-gray-400 flex-shrink-0">
      {label}
    </span>

    <span
      className={`text-xs font-semibold text-[#143c2f] text-right break-all ${valueClass}`}
    >
      {value || "—"}
    </span>
  </div>
);
// ─────────────────────────────────────────────────────────────
// ORDER DETAILS PANEL
// ─────────────────────────────────────────────────────────────
const OrderDetailPanel = ({ order }) => {
  const pricing = order.pricing || {};
  const payment = order.payment || {};
  const address = order.shippingAddress || {};
  const voucher = order.appliedVoucher || {};
  const [showReviewModal, setShowReviewModal] = useState(false);
const [selectedProductId, setSelectedProductId] = useState(null);
const openReviewModal = (productId) => {
  setSelectedProductId(productId);
  setShowReviewModal(true);
};
    const navigate=useNavigate()
    const downloadInvoice = async () => {
  const { default: jsPDF } = await import("jspdf");
  const { default: html2canvas } = await import("html2canvas");

  // Build a hidden HTML div with invoice layout
  const invoiceEl = document.createElement("div");
  invoiceEl.style.cssText = `
    position: fixed; top: -9999px; left: -9999px;
    width: 794px; background: white; padding: 48px;
    font-family: Arial, sans-serif; color: #1a1a1a;
  `;

  const orderId = String(order._id).slice(-10).toUpperCase();
  const address = order.shippingAddress || {};
  const pricing = order.pricing || {};
  const payment = order.payment || {};

  const itemRows = (order.items || []).map(item => `
    <tr style="border-bottom: 1px solid #f0ede8;">
      <td style="padding: 10px 8px; font-size: 13px;">${item.name}</td>
      <td style="padding: 10px 8px; font-size: 13px; text-align:center;">${item.attributes?.size || "—"}</td>
      <td style="padding: 10px 8px; font-size: 13px; text-align:center;">${item.quantity}</td>
      <td style="padding: 10px 8px; font-size: 13px; text-align:right;">A$${(item.price?.mrp || 0).toFixed(2)}</td>
      <td style="padding: 10px 8px; font-size: 13px; text-align:right; color:#457358; font-weight:bold;">A$${(item.lineTotal || 0).toFixed(2)}</td>
    </tr>
  `).join("");

  invoiceEl.innerHTML = `
    <!-- Header -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:36px;">
      <div>
        <div style="font-size:24px; font-weight:900; color:#143c2f; letter-spacing:-0.5px;">N-Organics</div>
        <div style="font-size:11px; color:#888; margin-top:4px;">Natural Beauty, Honestly Made</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:20px; font-weight:800; color:#143c2f;">INVOICE</div>
        <div style="font-size:11px; color:#888; margin-top:4px;">#${orderId}</div>
        <div style="font-size:11px; color:#888;">${fmtDate(order.createdAt)}</div>
      </div>
    </div>

    <!-- Divider -->
    <div style="height:2px; background:linear-gradient(to right, #143c2f, #457358, #e7dfd4); margin-bottom:28px; border-radius:2px;"></div>

    <!-- Bill To + Payment Info -->
    <div style="display:flex; justify-content:space-between; margin-bottom:28px; gap:24px;">
      <div style="flex:1;">
        <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#888; margin-bottom:8px;">Bill To</div>
        <div style="font-size:13px; font-weight:700; color:#143c2f;">${address.fullName || "—"}</div>
        <div style="font-size:12px; color:#555; margin-top:4px; line-height:1.7;">
          ${address.addl1 || ""}<br/>
          ${address.city || ""}, ${address.state || ""}<br/>
          ${address.country || ""} — ${address.pincode || ""}
        </div>
        <div style="font-size:12px; color:#555; margin-top:4px;">📞 ${address.mobilenum || "—"}</div>
      </div>
      <div style="flex:1; background:#faf8f5; border-radius:12px; padding:16px; border:1px solid #e7dfd4;">
        <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#888; margin-bottom:10px;">Payment Info</div>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span style="font-size:11px; color:#888;">Method</span>
          <span style="font-size:11px; font-weight:700; text-transform:uppercase;">${payment.method || "—"}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span style="font-size:11px; color:#888;">Status</span>
          <span style="font-size:11px; font-weight:700; color:#457358; text-transform:capitalize;">${payment.status || "—"}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span style="font-size:11px; color:#888;">Currency</span>
          <span style="font-size:11px; font-weight:700;">${payment.currency || "AUD"}</span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="font-size:11px; color:#888;">Paid On</span>
          <span style="font-size:11px; font-weight:700;">${payment.paidAt ? fmtDate(payment.paidAt) : "—"}</span>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
      <thead>
        <tr style="background:#143c2f; color:white;">
          <th style="padding:10px 8px; text-align:left; font-size:11px; border-radius:6px 0 0 0;">Product</th>
          <th style="padding:10px 8px; text-align:center; font-size:11px;">Size</th>
          <th style="padding:10px 8px; text-align:center; font-size:11px;">Qty</th>
          <th style="padding:10px 8px; text-align:right; font-size:11px;">MRP</th>
          <th style="padding:10px 8px; text-align:right; font-size:11px; border-radius:0 6px 0 0;">Total</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <!-- Pricing Summary -->
    <div style="display:flex; justify-content:flex-end; margin-bottom:32px;">
      <div style="width:260px;">
        <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e7dfd4;">
          <span style="font-size:12px; color:#888;">MRP Total</span>
          <span style="font-size:12px; font-weight:600;">A$${(pricing.mrpTotal || 0).toFixed(2)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e7dfd4;">
          <span style="font-size:12px; color:#888;">MRP Savings</span>
          <span style="font-size:12px; font-weight:600; color:#457358;">-A$${(pricing.mrpSavings || 0).toFixed(2)}</span>
        </div>
        ${pricing.bannerDiscount > 0 ? `
        <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e7dfd4;">
          <span style="font-size:12px; color:#888;">Offer Discount</span>
          <span style="font-size:12px; font-weight:600; color:#457358;">-A$${(pricing.bannerDiscount).toFixed(2)}</span>
        </div>` : ""}
       ${pricing.voucherDiscount > 0 ? `
<div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e7dfd4;">
  <span style="font-size:12px; color:#888;">Voucher (${order.appliedVoucher?.code || ""})</span>
  <span style="font-size:12px; font-weight:600; color:#457358;">-A$${(pricing.voucherDiscount).toFixed(2)}</span>
</div>` : ""}

${order.appliedVoucher?.discountType === "complimentary" ? `
<div style="margin-top:8px; padding:12px; background:#f0f7f3; border:1px solid #457358; border-radius:10px;">
  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
    <div style="display:flex; align-items:center; gap:8px;">
      <span style="font-size:12px; font-weight:800; color:#143c2f;">Free Gift Included</span>
    </div>
    <span style="font-size:10px; font-weight:700; color:#457358; padding:2px 8px; border-radius:20px;">
      ${order.appliedVoucher.code}
    </span>
  </div>
  ${(order.appliedVoucher.complimentaryItems || []).map(gift => `
    <div style="display:flex; align-items:center; gap:10px; padding:8px; background:white; border-radius:8px; margin-top:6px; border:1px solid #e7dfd4;">
      
      <div style="flex:1;">
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:12px; font-weight:700; color:#143c2f;">${gift.name}</span>
          <span style="font-size:10px; font-weight:700; color:#457358; padding:1px 6px; border-radius:10px;">×${gift.quantity}</span>
        </div>
        ${gift.description
          ? `<div style="font-size:10px; color:#888; margin-top:2px;">${gift.description}</div>`
          : ""
        }
      </div>
      <span style="font-size:11px; font-weight:700; color:#457358;">FREE</span>
    </div>
  `).join("")}
</div>` : ""}
        <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e7dfd4;">
          <span style="font-size:12px; color:#888;">Shipping</span>
          <span style="font-size:12px; font-weight:600;">${pricing.shippingCharge > 0 ? `A$${pricing.shippingCharge.toFixed(2)}` : "Free"}</span>
        </div>
        <div style="display:flex; justify-content:space-between; padding:10px 0; margin-top:4px; background:#143c2f; border-radius:8px; padding:10px 14px;">
          <span style="font-size:14px; font-weight:800; color:white;">Total Paid</span>
          <span style="font-size:16px; font-weight:900; color:#a3c9b4;">A$${(pricing.total || 0).toFixed(2)}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="height:1px; background:#e7dfd4; margin-bottom:20px;"></div>
    <div style="text-align:center; font-size:11px; color:#aaa; line-height:1.8;">
      Thank you for shopping with N-Organics 🌿<br/>
      For queries, contact us at support@n-organics.com<br/>
      <span style="font-size:10px;">This is a computer-generated invoice and does not require a signature.</span>
    </div>
  `;

  document.body.appendChild(invoiceEl);

  try {
    const canvas = await html2canvas(invoiceEl, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const pdfWidth  = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice-${orderId}.pdf`);
  } finally {
    document.body.removeChild(invoiceEl);
  }
};
  return (
    <div className="border-t border-[#e7dfd4] bg-[#faf8f5] px-4 pb-4 pt-4 space-y-4">

      {/* ITEMS */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          All Items
        </p>

        <div className="space-y-2">
          {(order.items || []).map((item, i) => {

            // ✅ FIXED IMAGE PATH
            const image =
              item?.product?.image ||
              item?.image ||
              item?.productImage ||
              "";

            return (
              <div
  key={item._id || i}
  className="bg-white border border-[#e7dfd4] rounded-xl p-3"
>

  <div className="flex gap-3">

    {/* IMAGE */}
    {image ? (
      <img
        src={image}
        alt={item?.name}
        onClick={() =>
      navigate(`/product/${item?.product?._id}`)
    }
        className="w-14 h-14 rounded-lg object-cover border border-[#e7dfd4] flex-shrink-0 bg-[#faf8f5]"
      />
    ) : (
      <div className="w-14 h-14 rounded-lg bg-[#f0ede8] flex items-center justify-center flex-shrink-0">
        <ShoppingBag className="w-4 h-4 text-gray-300" />
      </div>
    )}

    {/* INFO */}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-[#143c2f] line-clamp-1">
        {item?.product?.name || item?.name}
      </p>

      <p className="text-xs text-gray-400 mt-0.5">
        {item?.product?.brand}
      </p>

      <div className="flex flex-wrap gap-1.5 mt-2">

        <span className="text-[10px] px-2 py-0.5 bg-[#457358]/10 text-[#457358] rounded-full font-bold">
          Qty: {item.quantity}
        </span>

        {item.attributes?.size && (
          <span className="text-[10px] px-2 py-0.5 bg-[#f0ede8] rounded-full text-gray-500">
            Size: {item.attributes.size}
          </span>
        )}

        {item.attributes?.shade && (
          <span className="text-[10px] px-2 py-0.5 bg-[#f0ede8] rounded-full text-gray-500">
            Shade: {item.attributes.shade}
          </span>
        )}
      </div>
    </div>

    {/* PRICE */}
    <div className="text-right flex-shrink-0">
      <p className="text-sm font-black text-[#457358]">
        {fmt(item.lineTotal)}
      </p>
    </div>
  </div>

  {/* REVIEW BUTTON */}
  <div className="mt-3 flex justify-end">
    <button
      onClick={() => openReviewModal(item?.product?._id)}
      className="
        px-4 py-2
        rounded-xl
        border border-[#143c2f]
        text-[#143c2f]
        text-xs font-semibold
        hover:bg-[#143c2f]
        hover:text-white
        transition-all duration-200
        cursor-pointer
      "
    >
      Write a Review
    </button>
  </div>

</div>
            );
          })}
        </div>
      </div>

      {/* PRICING + ADDRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* PRICING */}
        <div className="bg-white border border-[#e7dfd4] rounded-xl p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Pricing
          </p>

          <DetailRow
            label="MRP Total"
            value={fmt(pricing.mrpTotal)}
          />

          <DetailRow
            label="Savings"
            value={`-${fmt(pricing.mrpSavings)}`}
            valueClass="text-emerald-600"
          />

          <DetailRow
            label="Shipping"
            value={
              pricing.shippingCharge > 0
                ? fmt(pricing.shippingCharge)
                : "Free"
            }
          />

          <div className="flex justify-between pt-2 mt-1">
            <span className="text-sm font-bold text-[#143c2f]">
              Total
            </span>

            <span className="text-base font-black text-[#457358]">
              {fmt(pricing.total)}
            </span>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="bg-white border border-[#e7dfd4] rounded-xl p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Delivering To
          </p>

          <p className="text-sm font-bold text-[#143c2f]">
            {address.fullName}
          </p>

          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {address.addl1}
            <br />
            {address.city}, {address.state}
            <br />
            {address.country} — {address.pincode}
          </p>
        </div>
      </div>

      {/* TRACKING */}
      {order.deliveryPartner?.trackingUpdates?.length > 0 && (

        <div className="bg-white border border-[#e7dfd4] rounded-xl p-3">

          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1">
            <Truck className="w-3 h-3" /> Shipment Tracking
          </p>

          <div className="space-y-0">

            {/* ✅ FIXED ORDER STATUS TIMELINE */}
            {[...order.deliveryPartner.trackingUpdates]
              .sort(
                (a, b) =>
                  new Date(a.timestamp) -
                  new Date(b.timestamp)
              )
              .map((update, i, arr) => (

                <div
                  key={update._id || i}
                  className="flex gap-3"
                >

                  {/* LINE */}
                  <div className="flex flex-col items-center">

                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1 border-2 ${
                        i === arr.length - 1
                          ? "bg-[#457358] border-[#457358]"
                          : "bg-white border-gray-300"
                      }`}
                    />

                    {i < arr.length - 1 && (
                      <div className="w-px flex-1 bg-[#e7dfd4] my-1" />
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="pb-3 flex-1">

                    <p
                      className={`text-xs font-bold capitalize ${
                        i === arr.length - 1
                          ? "text-[#457358]"
                          : "text-[#143c2f]"
                      }`}
                    >
                      {update.status?.replaceAll("_", " ")}
                    </p>

                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {update.description}
                    </p>

                    {update.location && (
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {update.location}
                      </p>
                    )}

                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(update.timestamp).toLocaleString(
                        "en-AU",
                        {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* VOUCHER */}
      {/* VOUCHER */}
{voucher.code && (
  <div className={`border rounded-xl p-3 ${
    voucher.discountType === "complimentary"
      ? "bg-[#f0f7f3] border-[#457358]/30"
      : "bg-emerald-50 border-emerald-200"
  }`}>
    <p className="text-[10px] font-bold uppercase tracking-wider text-[#457358] mb-2 flex items-center gap-1">
      <Tag className="w-3 h-3" />
      {voucher.discountType === "complimentary" ? "Free Gift Voucher" : "Voucher Applied"}
    </p>

    <p className="text-sm font-black text-[#143c2f] font-mono mb-2">
      {voucher.code}
    </p>

    {/* Flat / Percentage — show savings */}
    {voucher.discountType !== "complimentary" && voucher.discountAmount > 0 && (
      <p className="text-xs text-emerald-700 font-semibold">
        Saved {fmt(voucher.discountAmount)}
      </p>
    )}

    {/* Complimentary — show gift items */}
    {voucher.discountType === "complimentary" && (
      <div className="mt-1">
        {voucher.complimentaryItems?.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#457358]/70">
              Gift Items Included
            </p>
            {voucher.complimentaryItems.map((gift, i) => (
              <div key={gift._id || i}
                className="flex items-center gap-2.5 p-2.5 bg-white border border-[#457358]/20 rounded-xl">
                {gift.imageUrl ? (
                  <img src={gift.imageUrl} alt={gift.name}
                    className="w-10 h-10 rounded-lg object-cover border border-[#e7dfd4] flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-[#457358]/10 flex items-center justify-center flex-shrink-0 text-base">
                    🎁
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs font-bold text-[#143c2f] truncate">{gift.name}</p>
                    <span className="text-[10px] bg-[#457358] text-white px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
                      ×{gift.quantity}
                    </span>
                  </div>
                  {gift.description && (
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">{gift.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#457358] font-semibold">🎁 Complimentary gift included with your order</p>
        )}
      </div>
    )}
  </div>
)}
      {/* ───────────────── SUPPORT / HELP ───────────────── */}
<div className="bg-[#143c2f]/5 border border-[#143c2f]/10 rounded-xl p-4">

  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
{/* DOWNLOAD INVOICE */}
<button
  onClick={downloadInvoice}
  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#457358] text-[#457358] text-sm font-bold hover:bg-[#457358] hover:text-white transition-all duration-200"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" />
  </svg>
  Download Invoice PDF
</button>
    {/* LEFT */}
    <div>
      <p className="text-sm font-bold text-[#143c2f]">
        Need help with this order?
      </p>

      <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-md">
        For cancellations, refunds, damaged products, delivery issues,
        or any order-related queries, please contact our support team
        through the contact form.
      </p>
    </div>

    {/* RIGHT BUTTON */}
    <button
      onClick={() => navigate("/contact")}
      className="
        px-5 py-2.5 rounded
        bg-[#D2E16A]
        text-[#457358]
        hover:bg-[#457358]
        hover:text-white
         text-sm font-semibold
        transition-all duration-200
        shadow-sm hover:shadow-md
        whitespace-nowrap
        cursor-pointer
      "
    >
      Contact Support
    </button>

  </div>

</div>

{/* REVIEW MODAL */}
{showReviewModal && (
  <ReviewModal
    productId={selectedProductId}
    onClose={() => setShowReviewModal(false)}
    onSubmitted={() => {
      setShowReviewModal(false);
    }}
  />
)}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ORDER CARD
// ─────────────────────────────────────────────────────────────
const OrderCard = ({ order }) => {

  const [expanded, setExpanded] = useState(false);

  const firstItem = order.items?.[0];

  const extraCount =
    (order.items?.length || 1) - 1;

  const pricing = order.pricing || {};

  const payment = order.payment || {};

  // ✅ FIXED IMAGE
  const image =
    firstItem?.product?.image ||
    firstItem?.image ||
    firstItem?.productImage ||
    "";

  return (
    <div className="bg-white border border-[#e7dfd4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 border-b border-[#e7dfd4] bg-[#faf8f5]">

        <div className="flex items-center gap-2">
          <Hash className="w-3 h-3 text-gray-400" />

          <span className="text-xs font-black text-[#143c2f] font-mono tracking-tight">
            {String(order._id).slice(-10).toUpperCase()}
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <Calendar className="w-3 h-3 text-gray-400" />

          <span className="text-[10px] text-gray-400">
            {fmtDate(order.createdAt)}
          </span>

          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* PRODUCT */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 py-4">

        {/* IMAGE */}
        {image ? (
          <img
            src={image}
            alt={firstItem?.name}
            className="w-full sm:w-20 h-52 sm:h-20 rounded-xl object-cover border border-[#e7dfd4] bg-[#faf8f5]"
          />
        ) : (
          <div className="w-full sm:w-20 h-52 sm:h-20 rounded-xl border border-[#e7dfd4] bg-[#f0ede8] flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-gray-300" />
          </div>
        )}

        {/* INFO */}
        <div className="flex-1 min-w-0">

          <p className="text-sm font-bold text-[#143c2f] line-clamp-2">
            {firstItem?.product?.name || firstItem?.name}
          </p>

          <p className="text-xs text-gray-400 mt-0.5">
            {firstItem?.product?.brand}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-2">

            <span className="text-[10px] px-2 py-0.5 bg-[#f0ede8] rounded-full text-gray-500 font-medium">
              Qty: {firstItem?.quantity}
            </span>

            {extraCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 bg-[#143c2f]/10 text-[#143c2f] rounded-full font-bold">
                +{extraCount} more item{extraCount > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-2">

            <span className="text-[10px] text-gray-400">
              via {payment.method?.toUpperCase() || "—"}
            </span>

            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold capitalize border ${
                payment.status === "paid"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : payment.status === "pending"
                  ? "bg-amber-50 text-amber-600 border-amber-200"
                  : "bg-gray-50 text-gray-500 border-gray-200"
              }`}
            >
              {payment.status}
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">

          <div className="text-left sm:text-right">
            <p className="text-[10px] text-gray-400">
              Total Paid
            </p>

            <p className="text-lg font-black text-[#457358]">
              {fmt(pricing.total)}
            </p>
          </div>

          <button
            onClick={() =>
              setExpanded(!expanded)
            }
            className="w-10 h-10 rounded-xl bg-[#143c2f] hover:bg-[#457358] text-white flex items-center justify-center transition-colors"
          >
            {expanded ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* DETAILS */}
      {expanded && (
        <OrderDetailPanel order={order} />
      )}

      {/* COLLAPSE */}
      {expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="w-full flex items-center justify-center gap-1 py-2 text-[10px] text-gray-400 hover:text-[#457358] hover:bg-[#faf8f5] transition border-t border-[#e7dfd4]"
        >
          <ChevronUp className="w-3 h-3" />
          Collapse
        </button>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
export default function MyOrders() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {

        setOrders(response.data.orders || []);
      }

    } catch (error) {

      console.error("Fetch Orders Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch orders"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchOrders();

  }, []);

  return (
    <div className="py-2 min-h-screen space-y-4">

      {/* HEADER */}
      <div className="bg-white border border-[#e7dfd4] rounded-xl shadow-sm p-4">

        <div className="flex items-center justify-between flex-wrap gap-3">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Your Orders
            </h1>

            <p className="text-gray-500 mt-1 text-sm leading-relaxed max-w-xl">
              Track, manage, and review all your purchased products in one place.
            </p>
          </div>

          {!loading && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#143c2f]/5 border border-[#143c2f]/10">

              <ShoppingBag className="w-4 h-4 text-[#143c2f]" />

              <span className="text-sm font-semibold text-[#143c2f]">
                {orders.length} Order
                {orders.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="bg-white border border-[#e7dfd4] rounded-2xl p-10 text-center">

          <Package className="w-8 h-8 text-gray-300 mx-auto mb-3 animate-pulse" />

          <p className="text-gray-400 text-sm font-medium">
            Loading your orders...
          </p>
        </div>
      )}

      {/* EMPTY */}
      {!loading && orders.length === 0 && (
        <div className="bg-white border border-[#e7dfd4] rounded-2xl p-12 text-center">

          <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />

          <p className="text-gray-500 font-semibold">
            No orders yet
          </p>

          <p className="text-gray-400 text-sm mt-1">
            Your orders will appear here once you make a purchase.
          </p>
        </div>
      )}

      {/* ORDERS */}
      {!loading && orders.length > 0 && (
        <div className="space-y-3">

          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
            />
          ))}
        </div>
      )}
    </div>
  );
}