import React, { useState } from "react";
import { Truck, X } from "lucide-react";

export default function ShippingModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    trackingId: "",
    estimatedDelivery: "",
  });

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);

    // reset form
    setForm({
      name: "",
      trackingId: "",
      estimatedDelivery: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            <h2 className="font-semibold text-lg">Shipping Details</h2>
          </div>

          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          {/* SHIPPING NAME */}
          <div>
            <label className="text-sm font-medium">
              Shipping Partner Name *
            </label>
            <input
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="e.g. BlueDart, DTDC"
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* TRACKING ID */}
          <div>
            <label className="text-sm font-medium">
              Tracking ID *
            </label>
            <input
              required
              value={form.trackingId}
              onChange={(e) =>
                setForm({ ...form, trackingId: e.target.value })
              }
              placeholder="Enter tracking number"
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* DELIVERY DATE */}
          <div>
            <label className="text-sm font-medium">
              Estimated Delivery Date
            </label>
            <input
              type="date"
              value={form.estimatedDelivery}
              onChange={(e) =>
                setForm({
                  ...form,
                  estimatedDelivery: e.target.value,
                })
              }
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-3 border-t">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Save Details
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}