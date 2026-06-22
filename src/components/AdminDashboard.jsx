import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts/umd/Recharts";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const COLORS = ["#16a34a", "#2563eb", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

const formatMoney = (value = 0) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatNumber = (value = 0) =>
  new Intl.NumberFormat("en-AU").format(Number(value || 0));

const formatDate = (dateValue) => {
  if (!dateValue) return "";
  return new Date(dateValue).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
  });
};

const StatCard = ({ label, value, sub }) => (
  <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <h3 className="mt-2 text-2xl font-bold text-gray-900">{value}</h3>
    {sub ? <p className="mt-1 text-xs text-gray-400">{sub}</p> : null}
  </div>
);

const SectionCard = ({ title, children, className = "" }) => (
  <div className={`rounded-2xl bg-white border border-gray-200 p-5 shadow-sm ${className}`}>
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/analytics/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.data?.success) throw new Error(res.data?.message || "Failed to load dashboard");
      setData(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const dailyChartData = useMemo(() => {
    return (data?.dailyRevenue || []).map((item) => ({
      date: formatDate(item.date),
      revenue: Number(item.revenue || 0),
      orders: Number(item.orders || 0),
      avgOrderValue: Number(item.avgOrderValue || 0),
    }));
  }, [data]);

  const statusChartData = useMemo(() => {
    return (data?.statusBreakdown || []).map((item) => ({
      name: item.status || "unknown",
      value: Number(item.count || 0),
    }));
  }, [data]);

  const paymentMethodChartData = useMemo(() => {
    return (data?.paymentMethodBreakdown || []).map((item) => ({
      name: item.method || "unknown",
      value: Number(item.count || 0),
      revenue: Number(item.revenue || 0),
    }));
  }, [data]);

  const topProductsQty = data?.topProductsByQty || [];
  const topProductsRevenue = data?.topProductsByRevenue || [];
  const recentOrders = data?.recentOrders || [];
  const summary = data?.summary || {};

  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-80 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-4 sm:p-6">
      <div>
        <p className="mt-1 text-sm text-gray-500">Revenue, orders, products, refunds, and payment analytics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Orders" value={formatNumber(summary.totalOrders)} />
        <StatCard label="Gross Revenue" value={formatMoney(summary.grossRevenue)} />
        <StatCard label="Net Revenue" value={formatMoney(summary.netRevenue)} />
        <StatCard label="Refunded Amount" value={formatMoney(summary.refundedAmount)} />
        <StatCard label="Paid Orders" value={formatNumber(summary.paidOrders)} />
        <StatCard label="Refunded Orders" value={formatNumber(summary.refundedOrders)} />
        <StatCard label="Delivered Orders" value={formatNumber(summary.deliveredOrders)} />
        <StatCard label="Conversion Rate" value={`${Number(summary.conversionRate || 0).toFixed(2)}%`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Daily Revenue Trend">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={dailyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === "revenue" ? formatMoney(value) : formatNumber(value),
                  name,
                ]}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="orders" stroke="#2563eb" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Payment Methods">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={paymentMethodChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {paymentMethodChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Top Products by Quantity">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Qty Sold</th>
                  <th className="px-3 py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProductsQty.map((item) => (
                  <tr key={String(item._id)} className="border-b">
                    <td className="px-3 py-2 font-medium text-gray-900">{item.name}</td>
                    <td className="px-3 py-2 text-gray-600">{item.category}</td>
                    <td className="px-3 py-2">{formatNumber(item.qtySold)}</td>
                    <td className="px-3 py-2">{formatMoney(item.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Top Products by Revenue">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topProductsRevenue} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={140} />
              <Tooltip formatter={(value) => formatMoney(value)} />
              <Legend />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Order Status Breakdown">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={105}
                label
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`status-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Recent Orders">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Payment</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="px-3 py-2 font-medium text-gray-900">{order._id}</td>
                    <td className="px-3 py-2">{order.status}</td>
                    <td className="px-3 py-2">
                      {order?.payment?.method} / {order?.payment?.status}
                    </td>
                    <td className="px-3 py-2">{formatMoney(order?.pricing?.total)}</td>
                    <td className="px-3 py-2">
                      {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default AdminDashboard;