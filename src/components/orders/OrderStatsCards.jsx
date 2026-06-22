import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  PackageCheck,
  Loader2,
  Truck,
  Bike,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Undo2,
  Wallet,
  ShoppingBag,
} from "lucide-react";

import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// ENV
// ─────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_BASE_URL;

// ─────────────────────────────────────────────
// ICON MAP
// ─────────────────────────────────────────────
const statsConfig = [
  {
    key: "totalOrders",
    title: "Total",
    icon: ShoppingBag,
    color: "bg-black text-white",
  },

  {
    key: "confirmed",
    title: "Confirmed",
    icon: PackageCheck,
    color: "bg-blue-100 text-blue-700",
  },

  {
    key: "processing",
    title: "Processing",
    icon: Loader2,
    color: "bg-indigo-100 text-indigo-700",
  },

  {
    key: "shipped",
    title: "Shipped",
    icon: Truck,
    color: "bg-purple-100 text-purple-700",
  },

  {
    key: "out_for_delivery",
    title: "Out",
    icon: Bike,
    color: "bg-orange-100 text-orange-700",
  },

  {
    key: "delivered",
    title: "Delivered",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-700",
  },

  {
    key: "cancelled",
    title: "Cancelled",
    icon: XCircle,
    color: "bg-red-100 text-red-700",
  },

  {
    key: "return_requested",
    title: "Return",
    icon: Undo2,
    color: "bg-pink-100 text-pink-700",
  },

  {
    key: "returned",
    title: "Returned",
    icon: RotateCcw,
    color: "bg-gray-200 text-gray-700",
  },

  {
    key: "refund_initiated",
    title: "Refund Init",
    icon: Wallet,
    color: "bg-cyan-100 text-cyan-700",
  },

  {
    key: "refund_completed",
    title: "Refunded",
    icon: Wallet,
    color: "bg-emerald-100 text-emerald-700",
  },
];

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
const OrderStatsCards = () => {

  // ─────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  // ─────────────────────────────────────────────
  // FETCH STATS
  // ─────────────────────────────────────────────
  const fetchStats = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/order-status-counts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setStats(response.data.counts || {});

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to fetch order stats"
      );

    } finally {

      setLoading(false);

    }
  };

  // ─────────────────────────────────────────────
  // INITIAL FETCH
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetchStats();
  }, []);

  // ─────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full py-4 flex justify-center">
        <p className="text-xs text-gray-500">
          Loading stats...
        </p>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  return (

    <div className="w-full overflow-x-auto">

      <div className="flex gap-2 min-w-max">

        {statsConfig.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.key}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm min-w-[110px]"
            >

              {/* ───────────────── TOP ───────────────── */}
              <div className="flex items-center justify-between gap-2">

                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  {stats[item.key] || 0}
                </h3>

              </div>

              {/* ───────────────── TITLE ───────────────── */}
              <p className="text-[11px] text-gray-500 mt-2 leading-tight">
                {item.title}
              </p>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default OrderStatsCards;