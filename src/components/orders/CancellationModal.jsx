import React, { useState } from "react";
import { XCircle } from "lucide-react";

const reasons = [
  { value: "customer_request", label: "Customer Request" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "payment_issue", label: "Payment Issue" },
  { value: "shipping_issue", label: "Shipping Issue" },
  { value: "quality_issue", label: "Quality Issue" },
  { value: "other", label: "Other" },
];

const refundMethods = [
  { value: "original_payment", label: "Original Payment Method" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "store_credit", label: "Store Credit" },
  { value: "cash", label: "Cash" },
  { value: "no_refund", label: "No Refund Required" },
];

const CancellationModal = ({ open, onClose, onSubmit }) => {
 const [form, setForm] = useState({
  reason: "",
  notes: "",
  refundMethod: "original_payment",
});

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      cancelledAt: new Date().toISOString(),
    });

    setForm({
  reason: "",
  notes: "",
  refundMethod: "original_payment",
});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      {/* MODAL BOX */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeIn">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Order Cancellation</h2>
          </div>

          <button
            onClick={() => onClose(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* REASON */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Cancellation Reason *
            </label>

            <select
              value={form.reason}
              onChange={(e) =>
                setForm({ ...form, reason: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-red-400"
              required
            >
              <option value="">Select reason</option>
              {reasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* NOTES */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Additional Notes
            </label>

            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
              rows={3}
              placeholder="Enter details..."
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* REFUND METHOD */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Refund Method
            </label>

            <select
              value={form.refundMethod}
              onChange={(e) =>
                setForm({ ...form, refundMethod: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-red-400"
            >
              {refundMethods.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!form.reason}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              Confirm Cancellation
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CancellationModal;