import React from "react";
import {
  Eye,
  User,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { format } from "date-fns";
import ShippingModal from "./ShippingModal";
import RefundModal from "./RefundModal";
import CancellationModal from "./CancellationModal";

// ─────────────────────────────────────────────
// STATUS COLORS
// ─────────────────────────────────────────────
const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-indigo-100 text-indigo-700 border-indigo-200",
  shipped: "bg-purple-100 text-purple-700 border-purple-200",
  out_for_delivery: "bg-orange-100 text-orange-700 border-orange-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  return_requested: "bg-pink-100 text-pink-700 border-pink-200",
  returned: "bg-gray-200 text-gray-700 border-gray-300",
  refund_initiated: "bg-cyan-100 text-cyan-700 border-cyan-200",
  refund_completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const paymentStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-blue-100 text-blue-700",
  partially_refunded: "bg-orange-100 text-orange-700",
};

// ─────────────────────────────────────────────
// STATUS ICONS
// ─────────────────────────────────────────────
const getStatusIcon = (status) => {
  switch (status) {
    case "delivered":
      return <CheckCircle2 className="w-4 h-4" />;

    case "cancelled":
      return <XCircle className="w-4 h-4" />;

    case "refund_completed":
      return <RotateCcw className="w-4 h-4" />;

    case "processing":
    case "shipped":
    case "out_for_delivery":
      return <Truck className="w-4 h-4" />;

    default:
      return <Clock3 className="w-4 h-4" />;
  }
};

// ─────────────────────────────────────────────
// ORDER STATUS OPTIONS
// ─────────────────────────────────────────────
const orderStatuses = [
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "return_requested",
  "returned",
  "refund_initiated",
  "refund_completed",
];

const paymentStatuses = [
  "paid",
  "failed",
  "refunded",
  "partially_refunded",
];

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export default function OrdersTable({
  orders = [],
  onViewOrder,
  onStatusChange,
  onPaymentStatusChange,
}) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">

      <table className="min-w-[1600px] w-full text-sm">

        {/* ───────────────── HEADER ───────────────── */}
        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">

          <tr className="text-left text-xs uppercase tracking-wider text-gray-600">

            <th className="px-5 py-4 font-semibold">
              Order ID
            </th>

            <th className="px-5 py-4 font-semibold">
              Customer
            </th>

            <th className="px-5 py-4 font-semibold">
              Products
            </th>

            <th className="px-5 py-4 font-semibold">
              Shipping
            </th>

            <th className="px-5 py-4 font-semibold">
              Payment
            </th>

            <th className="px-5 py-4 font-semibold">
              Total
            </th>

            <th className="px-5 py-4 font-semibold">
              Order Status
            </th>

            <th className="px-5 py-4 font-semibold">
              Payment Status
            </th>

            <th className="px-5 py-4 font-semibold">
              Delivery
            </th>

            <th className="px-5 py-4 font-semibold">
              Date
            </th>

            <th className="px-5 py-4 font-semibold text-center">
              Actions
            </th>

          </tr>

        </thead>

        {/* ───────────────── BODY ───────────────── */}
        <tbody>

          {orders.length === 0 ? (

            <tr>

              <td
                colSpan="11"
                className="py-20 text-center text-gray-500"
              >
                No orders found
              </td>

            </tr>

          ) : (

            orders.map((order) => {

              // ───────────────── TRACKING ─────────────────
              const latestTracking =
                order?.deliveryPartner?.trackingUpdates?.length
                  ? order.deliveryPartner.trackingUpdates[
                      order.deliveryPartner.trackingUpdates.length - 1
                    ]
                  : null;

              return (

                <tr
                  key={order._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >

                  {/* ───────────────── ORDER ID ───────────────── */}
                  <td className="px-5 py-5 align-top">

                    <div className="flex flex-col gap-2">

                      <span className="font-semibold text-gray-900">
                        #{order._id?.slice(-8).toUpperCase()}
                      </span>

                      <span className="text-xs text-gray-500">
                        {order.items?.length || 0} item(s)
                      </span>

                    </div>

                  </td>

                  {/* ───────────────── CUSTOMER ───────────────── */}
                  <td className="px-5 py-5 align-top">

                    <div className="flex items-start gap-3">

                     

                      <div className="space-y-1">

                        <p className="font-semibold text-gray-800">
                          {order.shippingAddress?.fullName || "Customer"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {order.shippingAddress?.mobilenum || "-"}
                        </p>

                        <p className="text-xs text-gray-500 break-all">
                          {order.user?.email || order.userId?.email || "-"}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* ───────────────── PRODUCTS ───────────────── */}
                  <td className="px-5 py-5 align-top">

                    <div className="space-y-3">

                      {order.items?.slice(0, 2).map((item, idx) => (

                        <div
                          key={idx}
                          className="flex gap-3"
                        >

                          {/* <img
                            src={
                              item.image ||
                              "https://via.placeholder.com/60x60?text=No+Image"
                            }
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover border"
                          /> */}

                          <div className="space-y-1">

                            <p className="font-medium text-gray-800 line-clamp-2">
                              {item.name}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">

                              {item.attributes?.size && (
                                <span>
                                  Size: {item.attributes.size}
                                </span>
                              )}

                              {item.attributes?.shade && (
                                <span>
                                  Shade: {item.attributes.shade}
                                </span>
                              )}

                            </div>

                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity}
                            </p>

                          </div>

                        </div>

                      ))}

                      {order.items?.length > 2 && (

                        <p className="text-xs text-blue-600 font-medium">
                          +{order.items.length - 2} more items
                        </p>

                      )}

                    </div>

                  </td>

                  {/* ───────────────── SHIPPING ───────────────── */}
                  <td className="px-5 py-5 align-top">

                    <div className="flex gap-2 min-w-[220px]">

                      <MapPin className="w-4 h-4 mt-1 text-gray-500 shrink-0" />

                      <div className="text-xs text-gray-600 leading-relaxed">

                        <p>
                          {order.shippingAddress?.addl1 || "-"}
                        </p>

                        <p>
                          {order.shippingAddress?.city},{" "}
                          {order.shippingAddress?.state}
                        </p>

                        <p>
                          {order.shippingAddress?.pincode}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* ───────────────── PAYMENT METHOD ───────────────── */}
                  <td className="px-5 py-5 align-top">

                    <div className="space-y-2">

                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-medium capitalize">

                        <CreditCard className="w-4 h-4" />

                        {order.payment?.method || "-"}

                      </div>

                      {order.payment?.paidAt && (

                        <p className="text-xs text-gray-500">

                          Paid on{" "}

                          {format(
                            new Date(order.payment.paidAt),
                            "dd MMM yyyy"
                          )}

                        </p>

                      )}

                    </div>

                  </td>

                  {/* ───────────────── TOTAL ───────────────── */}
                  <td className="px-5 py-5 align-top">

                    <div className="space-y-1">

                      <p className="font-bold text-lg text-green-600">
                        ${order.pricing?.total || 0}
                      </p>

                      {order.pricing?.totalDiscount > 0 && (

                        <p className="text-xs text-green-500">
                          Saved ${order.pricing.totalDiscount}
                        </p>

                      )}

                    </div>

                  </td>

                  {/* ───────────────── ORDER STATUS ───────────────── */}
                  <td className="px-5 py-5 align-top">

                    <div className="space-y-3">

                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold capitalize ${
                          statusStyles[order.status]
                        }`}
                      >

                        {getStatusIcon(order.status)}

                        {order.status?.replaceAll("_", " ")}

                      </div>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          onStatusChange(order, e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-black"
                      >

                        {orderStatuses.map((status) => (

                          <option
                            key={status}
                            value={status}
                          >
                            {status.replaceAll("_", " ")}
                          </option>

                        ))}

                      </select>

                    </div>

                  </td>

                  {/* ───────────────── PAYMENT STATUS ───────────────── */}
                  <td className="px-5 py-5 align-top">

                    <div className="space-y-3">

                      <div
                        className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
                          paymentStyles[order.payment?.status]
                        }`}
                      >

                        {order.payment?.status?.replaceAll("_", " ")}

                      </div>

                      <select
                        value={order.payment?.status}
                        onChange={(e) =>
                          onPaymentStatusChange(
                            order._id,
                            e.target.value
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-black"
                      >

                        {paymentStatuses.map((status) => (

                          <option
                            key={status}
                            value={status}
                          >
                            {status.replaceAll("_", " ")}
                          </option>

                        ))}

                      </select>

                    </div>

                  </td>

                  {/* ───────────────── DELIVERY ───────────────── */}
                  <td className="px-5 py-5 align-top">

                    {order.deliveryPartner ? (

                      <div className="space-y-2 min-w-[120px]">

                        <p className="font-medium text-gray-800">
                          {order.deliveryPartner?.name || "-"}
                        </p>

                        <p className="text-xs text-gray-500">

                          Tracking ID:{" "}

                          {order.deliveryPartner?.trackingId || "-"}

                        </p>

                        {latestTracking && (

                          <div className="text-xs text-gray-600">

                            <p className="font-medium capitalize">
                              {latestTracking.status.replaceAll("_", " ")}
                            </p>

                            {/* <p>
                              {latestTracking.location}
                            </p> */}

                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Not assigned
                      </span>
                    )}
                  </td>
                  {/* ───────────────── DATE ───────────────── */}
                  <td className="px-5 py-5 align-top">

                    <div className="space-y-1 text-xs text-gray-600 min-w-[70px]">

                      <p>
                        {format(
                          new Date(order.createdAt),
                          "dd MMM yyyy"
                        )}
                      </p>

                      <p>
                        {format(
                          new Date(order.createdAt),
                          "hh:mm a"
                        )}
                      </p>

                    </div>

                  </td>

                  {/* ───────────────── ACTIONS ───────────────── */}
                  <td className="px-5 py-5 align-top">

                    <div className="flex justify-center">

                      <button
                        onClick={() => onViewOrder(order)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition text-xs font-medium"
                      >

                        <Eye className="w-4 h-4" />

                        View

                      </button>

                    </div>

                  </td>

                </tr>

              );
            })

          )}

        </tbody>

      </table>

    </div>
  );
}