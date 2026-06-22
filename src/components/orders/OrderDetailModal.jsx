import React from "react";
import {
  X, Package, MapPin, CreditCard, Tag, Percent,
  CheckCircle2, Clock, XCircle, Truck, ShoppingBag,
  ChevronRight, Hash, Globe, RotateCcw, Zap,
} from "lucide-react";
import { format } from "date-fns";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n, currency = "AUD") =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(n || 0));

const fmtDate = (d) => {
  try { return format(new Date(d), "MMM dd, yyyy • hh:mm a"); }
  catch { return "—"; }
};

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS = {
  pending:           { label: "Pending",            cls: "bg-amber-50 text-amber-700 border-amber-200",   dot: "bg-amber-400",   Icon: Clock },
  confirmed:         { label: "Confirmed",           cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-400", Icon: CheckCircle2 },
  processing:        { label: "Processing",          cls: "bg-blue-50 text-blue-700 border-blue-200",     dot: "bg-blue-400",    Icon: Zap },
  shipped:           { label: "Shipped",             cls: "bg-violet-50 text-violet-700 border-violet-200", dot: "bg-violet-400", Icon: Truck },
  delivered:         { label: "Delivered",           cls: "bg-teal-50 text-teal-700 border-teal-200",     dot: "bg-teal-400",    Icon: CheckCircle2 },
  cancelled:         { label: "Cancelled",           cls: "bg-red-50 text-red-700 border-red-200",        dot: "bg-red-400",     Icon: XCircle },
  "refund-completed":{ label: "Refund Completed",    cls: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-400", Icon: RotateCcw },
};

const PAY_STATUS = {
  paid:    "bg-emerald-100 text-emerald-700 border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  failed:  "bg-red-100 text-red-700 border-red-200",
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS[status] || STATUS.pending;
  const Icon = cfg.Icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─── Section Card ─────────────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, children, className = "" }) => (
  <div className={`bg-white border border-[#e7dfd4] rounded-2xl overflow-hidden ${className}`}>
    <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e7dfd4] bg-[#faf8f5]">
      <div className="w-7 h-7 rounded-lg bg-[#457358]/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-[#457358]" />
      </div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#143c2f]">{title}</h3>
    </div>
    <div className="px-4 py-4">{children}</div>
  </div>
);

// ─── Row ──────────────────────────────────────────────────────────────────────
const Row = ({ label, value, valueClass = "" }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-dashed border-[#e7dfd4] last:border-0">
    <span className="text-xs text-gray-400">{label}</span>
    <span className={`text-xs font-semibold text-[#143c2f] text-right max-w-[60%] break-all ${valueClass}`}>{value || "—"}</span>
  </div>
);

// ─── Order Item Card ──────────────────────────────────────────────────────────
const OrderItem = ({ item }) => (
  <div className="flex gap-3 p-3 bg-[#faf8f5] border border-[#e7dfd4] rounded-xl">
    {item.image ? (
      <img src={item.image} alt={item.name}
        className="w-14 h-14 rounded-lg object-cover border border-[#e7dfd4] flex-shrink-0 bg-white" />
    ) : (
      <div className="w-14 h-14 rounded-lg border border-[#e7dfd4] flex-shrink-0 bg-white flex items-center justify-center">
        <ShoppingBag className="w-5 h-5 text-gray-300" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-[#143c2f] leading-snug line-clamp-2">{item.name}</p>
      <p className="text-[10px] text-gray-400 font-mono mt-0.5">SKU: {item.variantSku || "—"}</p>
      <div className="flex items-center gap-2 mt-1 flex-wrap">
        {item.attributes?.size  && <span className="text-[10px] px-1.5 py-0.5 bg-white border border-[#e7dfd4] rounded text-gray-500">Size: {item.attributes.size}</span>}
        {item.attributes?.shade && <span className="text-[10px] px-1.5 py-0.5 bg-white border border-[#e7dfd4] rounded text-gray-500">Shade: {item.attributes.shade}</span>}
        {item.attributes?.scent && <span className="text-[10px] px-1.5 py-0.5 bg-white border border-[#e7dfd4] rounded text-gray-500">Scent: {item.attributes.scent}</span>}
        <span className="text-[10px] px-1.5 py-0.5 bg-[#457358]/10 text-[#457358] rounded font-bold">× {item.quantity}</span>
      </div>
    </div>
    <div className="flex flex-col items-end justify-between flex-shrink-0">
      <span className="text-sm font-black text-[#457358]">{fmt(item.lineTotal)}</span>
      <div className="text-right">
        <p className="text-[10px] text-gray-400 line-through">{fmt(item.price?.mrp)}</p>
        <p className="text-[10px] text-[#457358] font-semibold">{fmt(item.price?.sellingPrice)} ea.</p>
      </div>
    </div>
  </div>
);

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function OrderDetailModal({ order, open, onClose }) {
  if (!open || !order) return null;

  const pricing  = order.pricing  || {};
  const payment  = order.payment  || {};
  const address  = order.shippingAddress || {};
  const voucher  = order.appliedVoucher  || {};
  const banner   = order.appliedBanner   || {};
  const meta     = order.orderMeta       || {};
  const refund   = order.refundDetails   || {};
  const cancel   = order.cancellationDetails || {};

  const payMethod = payment.method?.toLowerCase();
  const isPayPal  = payMethod === "paypal";
  const isStripe  = payMethod === "stripe";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#faf8f5] w-full sm:max-w-4xl max-h-[95vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#e7dfd4]">

        {/* ── Header ── */}
        <div className="bg-[#143c2f] text-white px-5 py-4 flex items-start justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-[#a3c9b4]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#a3c9b4]">Order Details</span>
            </div>
            <p className="text-base font-black tracking-tight font-mono">#{String(order._id).slice(-12).toUpperCase()}</p>
            <p className="text-xs text-[#a3c9b4] mt-0.5">{fmtDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Items",    value: order.items?.length || 0,     sub: "products" },
              { label: "Total",    value: fmt(pricing.total),           sub: "AUD", green: true },
              { label: "Paid",     value: fmt(payment.paidAmount, payment.currency || "AUD"), sub: payment.currency || "AUD" },
              { label: "Source",   value: meta.isBuyNow ? "Buy Now" : "Cart", sub: meta.source || "web" },
            ].map(({ label, value, sub, green }) => (
              <div key={label} className="bg-white border border-[#e7dfd4] rounded-xl p-3 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                <p className={`text-base font-black ${green ? "text-[#457358]" : "text-[#143c2f]"}`}>{value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Items */}
          <Section icon={ShoppingBag} title={`Order Items (${order.items?.length || 0})`}>
            <div className="space-y-2">
              {(order.items || []).map((item, i) => (
                <OrderItem key={item._id || i} item={item} />
              ))}
            </div>
          </Section>

          {/* Shipping + Pricing side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Shipping Address */}
            <Section icon={MapPin} title="Shipping Address">
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#143c2f]">{address.fullName}</p>
                <p className="text-xs text-gray-500">{address.mobilenum}</p>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  {address.addl1}<br />
                  {address.city}, {address.state}<br />
                  {address.country} — {address.pincode}
                </p>
                {address.type && (
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 bg-[#457358]/10 text-[#457358] rounded font-bold">
                    {address.type}
                  </span>
                )}
              </div>
            </Section>

            {/* Pricing Breakdown */}
            <Section icon={Tag} title="Pricing Breakdown">
              <Row label="MRP Total"       value={fmt(pricing.mrpTotal)} />
              <Row label="MRP Savings"     value={`-${fmt(pricing.mrpSavings)}`} valueClass="text-emerald-600" />
              {pricing.bannerDiscount > 0 && (
                <Row label="Offer Discount" value={`-${fmt(pricing.bannerDiscount)}`} valueClass="text-emerald-600" />
              )}
              {pricing.voucherDiscount > 0 && (
                <Row label="Voucher Discount" value={`-${fmt(pricing.voucherDiscount)}`} valueClass="text-emerald-600" />
              )}
              <Row label="Shipping"        value={pricing.shippingCharge > 0 ? fmt(pricing.shippingCharge) : "Free"} />
              <div className="flex items-center justify-between pt-2 mt-1">
                <span className="text-sm font-bold text-[#143c2f]">Total</span>
                <span className="text-lg font-black text-[#457358]">{fmt(pricing.total)}</span>
              </div>
            </Section>
          </div>

          {/* Payment Details */}
          <Section icon={CreditCard} title="Payment Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-0">
                <Row label="Method" value={payment.method?.toUpperCase()} />
                <Row label="Status" value={
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border capitalize ${PAY_STATUS[payment.status] || PAY_STATUS.pending}`}>
                    {payment.status}
                  </span>
                } />
                <Row label="Currency" value={payment.currency} />
                <Row label="Amount Paid" value={`${fmt(payment.paidAmount, payment.currency || "AUD")} ${payment.currency || ""}`} />
                {payment.paidAt && (
                  <Row label="Paid At" value={fmtDate(payment.paidAt)} />
                )}
              </div>
              <div className="space-y-0">
                {isPayPal && <>
                  <Row label="PayPal Order ID"   value={payment.paypalOrderId} />
                  <Row label="PayPal Payer ID"   value={payment.paypalPayerId} />
                  <Row label="PayPal Capture ID" value={payment.paypalCaptureId} />
                </>}
                {isStripe && <>
                  <Row label="Stripe Session ID" value={payment.stripeSessionId} />
                  <Row label="Payment Intent"    value={payment.stripePaymentIntentId} />
                </>}
                {!isPayPal && !isStripe && (
                  <Row label="Transaction Ref" value={payment.transactionId || "—"} />
                )}
              </div>
            </div>
          </Section>

          {/* Voucher / Banner — only if applied */}
          {voucher.code && (
  <Section icon={Tag} title="Applied Voucher">
    <Row label="Code" value={voucher.code} />
    <Row label="Type" value={voucher.discountType} />

    {/* For flat/percentage — show monetary savings */}
    {voucher.discountType !== "complimentary" && (
      <>
        <Row label="Value"   value={`${voucher.discountValue}%`} />
        <Row label="Savings" value={fmt(voucher.discountAmount)} valueClass="text-emerald-600" />
      </>
    )}

    {/* For complimentary — show gift items */}
    {voucher.discountType === "complimentary" && (
      <div className="mt-3">
        {voucher.complimentaryItems?.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Free Gift Items
            </p>
            {voucher.complimentaryItems.map((gift, i) => (
              <div key={gift._id || i}
                className="flex items-center gap-3 p-2.5 bg-purple-50 border border-purple-200 rounded-xl">
                {gift.imageUrl ? (
                  <img src={gift.imageUrl} alt={gift.name}
                    className="w-10 h-10 rounded-lg object-cover border border-purple-200 flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 text-base">
                    🎁
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-purple-800 truncate">{gift.name}</p>
                    <span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
                      ×{gift.quantity}
                    </span>
                  </div>
                  {gift.description && (
                    <p className="text-[10px] text-purple-500 mt-0.5 truncate">{gift.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-purple-500 font-semibold">🎁 Complimentary gift included</p>
        )}
      </div>
    )}
  </Section>
)}

          {/* Refund — only if present */}
          {refund.reason && (
  <Section icon={RotateCcw} title="Refund Details">
    {refund.refundAmount > 0 && (
      <Row
        label="Refund Amount"
        value={fmt(refund.refundAmount)}
        valueClass="text-emerald-600"
      />
    )}
    <Row
      label="Reason"
      value={refund.reason?.replaceAll("-", " ")}
    />

    {refund.refundMethod && (
      <Row
        label="Refund Method"
        value={refund.refundMethod.replaceAll("-", " ")}
      />
    )}
    {refund.notes && (
      <Row
        label="Notes"
        value={refund.notes}
      />
    )}
     {refund.processedAt && (
      <Row
        label="Processed At"
        value={fmtDate(refund.processedAt)}
      />
    )}

  </Section>
)}

          {/* Cancellation — only if present */}
          {cancel.reason && (
            <Section icon={XCircle} title="Cancellation Details">
              <Row label="Reason" value={cancel.reason?.replaceAll("-", " ")} />
              {cancel.notes && <Row label="Notes" value={cancel.notes} />}
              {cancel?.refundMethod && (
  <Row
    label="Refund Method"
    value={cancel.refundMethod.replaceAll("_", " ")}
  />
)}
{cancel.cancelledAt && (
  <Row
    label="Cancelled At"
    value={fmtDate(cancel.cancelledAt)}
  />
)}

            </Section>
          )}

          {/* Order Meta */}
          {/* <Section icon={Globe} title="Order Meta">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Order ID",  value: String(order._id) },
                { label: "Source",    value: meta.source || "web" },
                { label: "Type",      value: meta.isBuyNow ? "Buy Now" : "Cart Order" },
                { label: "Gift Wrap", value: meta.giftWrap ? "Yes" : "No" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#faf8f5] border border-[#e7dfd4] rounded-xl p-2.5">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-xs font-bold text-[#143c2f] break-all">{value}</p>
                </div>
              ))}
            </div>
            {meta.giftMessage && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-1">Gift Message</p>
                <p className="text-xs text-amber-800">{meta.giftMessage}</p>
              </div>
            )}
          </Section> */}

        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-3 border-t border-[#e7dfd4] bg-white flex-shrink-0 flex items-center justify-between">
          <p className="text-[10px] text-gray-400">
            Last updated: {fmtDate(order.updatedAt)}
          </p>
          <button onClick={onClose}
            className="px-4 py-2 bg-[#143c2f] text-white text-xs font-bold rounded-xl hover:bg-[#457358] transition">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}