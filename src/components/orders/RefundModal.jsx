import React, { useState, useEffect } from "react";

const refundMethods = [
  { value: "original-payment-method", label: "Original Payment Method" },
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "store-credit", label: "Store Credit" },
  { value: "cash", label: "Cash" },
];

const refundReasons = [
  { value: "customer-request", label: "Customer Request" },

  { value: "defective-product", label: "Defective / Damaged Product" },
  { value: "damaged-in-transit", label: "Damaged During Shipping" },

  { value: "wrong-item", label: "Wrong Item Sent" },
  { value: "not-as-described", label: "Product Not as Described" },

  { value: "out-of-stock", label: "Out of Stock After Order" },
  { value: "quality-issue", label: "Quality Issue Identified" },

  { value: "payment-failure", label: "Payment Issue / Duplicate Payment" },
  { value: "fraud-suspected", label: "Fraud or Suspicious Activity" },

  { value: "logistics-failure", label: "Delivery Failure / Returned Shipment" },

  { value: "admin-error", label: "Internal Processing Error" },

  { value: "other", label: "Other" },
];

export default function RefundModal({ open, onClose, onSubmit }) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    refundAmount: "",
    refundMethod: "",
    referenceId: "",
    reason: "",
    notes: "",
    processedDate: today,
  });

  useEffect(() => {
    if (!open) {
      setForm({
        refundAmount: "",
        refundMethod: "",
        referenceId: "",
        reason: "",
        notes: "",
        processedDate: today,
      });
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      refundAmount: Number(form.refundAmount),
      completedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

        {/* HEADER */}
        <h2 className="text-lg font-bold text-orange-600 mb-4">
          Refund Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* AMOUNT */}
          <div>
            <label className="block text-sm mb-1">Refund Amount *</label>
            <input
              type="number"
              value={form.refundAmount}
              onChange={(e) =>
                setForm({ ...form, refundAmount: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
              required
            />
          </div>

          {/* METHOD */}
          <div>
            <label className="block text-sm mb-1">Refund Method *</label>
            <select
              value={form.refundMethod}
              onChange={(e) =>
                setForm({ ...form, refundMethod: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
              required
            >
              <option value="">Select method</option>
              {refundMethods.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* REFERENCE */}
          <div>
            <label className="block text-sm mb-1">
              Reference ID
            </label>
            <input
              value={form.referenceId}
              onChange={(e) =>
                setForm({ ...form, referenceId: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* REASON */}
          <div>
            <label className="block text-sm mb-1">Reason</label>
            <select
              value={form.reason}
              onChange={(e) =>
                setForm({ ...form, reason: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
            >
              <option value="">Select reason</option>
              {refundReasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* NOTES */}
          <div>
            <label className="block text-sm mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm mb-1">
              Processing Date
            </label>
            <input
              type="date"
              value={form.processedDate}
              onChange={(e) =>
                setForm({ ...form, processedDate: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full border rounded-lg p-2 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white rounded-lg p-2 cursor-pointer"
            >
              Complete Refund
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}