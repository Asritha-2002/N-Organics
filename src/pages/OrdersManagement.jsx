import React, { useEffect, useState } from "react";
import axios from "axios";

import OrdersTable from "../components/orders/OrdersTable";
import OrderDetailModal from "../components/orders/OrderDetailModal";

import ShippingModal from "../components/orders/ShippingModal";
import CancellationModal from "../components/orders/CancellationModal";
import RefundModal from "../components/orders/RefundModal";

import OrderStatsCards from "../components/orders/OrderStatsCards";
import OrderSearchFilter from "../components/orders/OrderSearchFilter";

import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// ENV
// ─────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_BASE_URL;

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
const OrdersManagement = () => {

  // ─────────────────────────────────────────────
  // STATES
  // ─────────────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // VIEW ORDER MODAL
  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  // SHIPPING MODAL
  const [shippingModalOpen,
    setShippingModalOpen] = useState(false);

  const [selectedOrderForShipping,
    setSelectedOrderForShipping] =
    useState(null);

  // CANCEL MODAL
  const [cancelModalOpen,
    setCancelModalOpen] = useState(false);

  const [selectedOrderForCancel,
    setSelectedOrderForCancel] =
    useState(null);

  // REFUND MODAL
  const [refundModalOpen,
    setRefundModalOpen] = useState(false);

  const [selectedOrderForRefund,
    setSelectedOrderForRefund] =
    useState(null);

    const [searchQuery,    setSearchQuery]    = useState("");
const [statusFilter,   setStatusFilter]   = useState("");

// Derived filtered list — no extra fetch needed
const filteredOrders = orders.filter((order) => {
  const q = searchQuery.toLowerCase();

  const matchesSearch = !q || [
    order._id,
    order.shippingAddress?.fullName,
    order.userId,
    String(order.pricing?.total || ""),
    ...(order.items || []).map(i => i.name),
    ...(order.items || []).map(i => i.productId),
  ].some(val => String(val || "").toLowerCase().includes(q));

  const matchesStatus = !statusFilter || order.status === statusFilter;

  return matchesSearch && matchesStatus;
});

  // ─────────────────────────────────────────────
  // FETCH ORDERS
  // ─────────────────────────────────────────────
  const fetchOrders = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/all-orders`,
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("FULL RESPONSE:", response.data);

      setOrders(
        Array.isArray(response.data.orders)
          ? response.data.orders
          : []
      );

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to fetch orders"
      );

    } finally {

      setLoading(false);

    }
  };

  // ─────────────────────────────────────────────
  // INITIAL FETCH
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetchOrders();
  }, []);

  // ─────────────────────────────────────────────
  // VIEW ORDER
  // ─────────────────────────────────────────────
  const handleViewOrder = (order) => {

    setSelectedOrder(order);

    setIsModalOpen(true);
  };

  // ─────────────────────────────────────────────
  // STATUS CHANGE
  // ─────────────────────────────────────────────
  const handleStatusChange = async (
    order,
    newStatus
  ) => {

    // ───────────────── SHIPPING MODAL ─────────────────
    if (newStatus === "shipped") {

      setSelectedOrderForShipping(order);

      setShippingModalOpen(true);

      return;
    }

    // ───────────────── CANCEL MODAL ─────────────────
    if (newStatus === "cancelled") {

      setSelectedOrderForCancel(order);

      setCancelModalOpen(true);

      return;
    }

    // ───────────────── REFUND MODAL ─────────────────
    if (newStatus === "refund_completed") {

      setSelectedOrderForRefund(order);

      setRefundModalOpen(true);

      return;
    }

    // ───────────────── NORMAL STATUS UPDATE ─────────────────
    try {

      await axios.patch(
        `${BASE_URL}/${order._id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Order status updated");

      fetchOrders();

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to update status"
      );
    }
  };

  // ─────────────────────────────────────────────
  // PAYMENT STATUS CHANGE
  // ─────────────────────────────────────────────
  const handlePaymentStatusChange = async (
    orderId,
    paymentStatus
  ) => {

    try {

      await axios.patch(
        `${BASE_URL}/${orderId}/payment-status`,
        {
          paymentStatus,
        },
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Payment status updated");

      fetchOrders();

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to update payment status"
      );
    }
  };

  // ─────────────────────────────────────────────
  // SHIPPING SUBMIT
  // ─────────────────────────────────────────────
  const handleShippingSubmit = async (
    formData
  ) => {

    try {

      await axios.patch(
        `${BASE_URL}/${selectedOrderForShipping._id}/status`,
        {
          status: "shipped",

          shippingDetails: {
            name: formData.name,
            trackingId: formData.trackingId,
            estimatedDelivery:
              formData.estimatedDelivery,
          },
        },
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Shipping details saved");

      setShippingModalOpen(false);

      fetchOrders();

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to update shipping"
      );
    }
  };

  // ─────────────────────────────────────────────
  // CANCEL SUBMIT
  // ─────────────────────────────────────────────
  const handleCancelSubmit = async (
    formData
  ) => {

    try {

      await axios.patch(
        `${BASE_URL}/${selectedOrderForCancel._id}/status`,
        {
          status: "cancelled",

          cancellationDetails: {
            reason: formData.reason,
            notes: formData.notes,
            refundMethod: formData.refundMethod,
          },
        },
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Order cancelled");

      setCancelModalOpen(false);

      fetchOrders();

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to cancel order"
      );
    }
  };

  // ─────────────────────────────────────────────
  // REFUND SUBMIT
  // ─────────────────────────────────────────────
 const handleRefundSubmit = async (formData) => {
  try {

    await axios.patch(
      `${BASE_URL}/${selectedOrderForRefund._id}/status`,
      {
        status: "refund_completed",

        refundDetails: {
          refundAmount: formData.refundAmount,
          refundMethod: formData.refundMethod,
          referenceId: formData.referenceId,
          reason: formData.reason,
          notes: formData.notes,
          processedDate: formData.processedDate,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    toast.success("Refund completed");

    setRefundModalOpen(false);

    fetchOrders();

  } catch (error) {

    console.error(error);

    toast.error(
      error?.response?.data?.message ||
      "Failed to update refund"
    );
  }
};

  // ─────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────
  if (loading) {

    return (

      <div className="w-full py-20 flex items-center justify-center">

        <p className="text-gray-500">
          Loading orders...
        </p>

      </div>
    );
  }

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  return (

    <div className="w-full space-y-5">

      {/* ───────────────── STATS ───────────────── */}
      <OrderStatsCards />

    <OrderSearchFilter
  onSearch={setSearchQuery}
  onStatusFilter={setStatusFilter}
/>
      {/* ───────────────── TABLE ───────────────── */}
      <OrdersTable
        orders={filteredOrders} 
        onViewOrder={handleViewOrder}
        onStatusChange={handleStatusChange}
        onPaymentStatusChange={
          handlePaymentStatusChange
        }
      />

      {/* ───────────────── VIEW ORDER MODAL ───────────────── */}
      <OrderDetailModal
        order={selectedOrder}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* ───────────────── SHIPPING MODAL ───────────────── */}
      <ShippingModal
        open={shippingModalOpen}
        onClose={() => setShippingModalOpen(false)}
        onSubmit={handleShippingSubmit}
      />

      {/* ───────────────── CANCEL MODAL ───────────────── */}
      <CancellationModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onSubmit={handleCancelSubmit}
      />

      {/* ───────────────── REFUND MODAL ───────────────── */}
      <RefundModal
        open={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        onSubmit={handleRefundSubmit}
      />

    </div>
  );
};

export default OrdersManagement;