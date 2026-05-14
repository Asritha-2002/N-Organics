
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Ticket, ChevronLeft, ChevronRight,
  Filter, Pencil, Trash2, RefreshCcw, AlertTriangle,
  ToggleLeft, ToggleRight, X, Loader2,
} from "lucide-react";
import toast from "react-hot-toast"

const BASE_URL = import.meta.env.VITE_BASE_URL;
import VoucherModal from "../admin/adminModals/VoucherModal"

const cn = (...c) => c.filter(Boolean).join(" ");

const STATUS_BADGE = {
  active:    "bg-green-100  text-green-700  border-green-200",
  expired:   "bg-red-100    text-red-700    border-red-200",
  upcoming:  "bg-blue-100   text-blue-700   border-blue-200",
  exhausted: "bg-orange-100 text-orange-700 border-orange-200",
  inactive:  "bg-gray-100   text-gray-500   border-gray-200",
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteModal = ({ voucher, onCancel, onConfirm, loading }) => (
  <>
    <motion.div key="del-bg" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={() => !loading && onCancel()}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
    <motion.div key="del-box"
      initial={{ opacity:0, scale:0.9, y:20 }}
      animate={{ opacity:1, scale:1, y:0 }}
      exit={{ opacity:0, scale:0.9, y:20 }}
      transition={{ type:"spring", stiffness:320, damping:28 }}
      className="fixed inset-0 z-[60] flex items-center justify-center px-4 pointer-events-none">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
        <div className="h-1.5 bg-gradient-to-r from-rose-400 to-red-500" />
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-rose-500" />
            </div>
          </div>
          <h3 className="text-center text-base font-bold text-gray-800 mb-1">Delete Voucher?</h3>
          <p className="text-center text-sm text-gray-500 leading-relaxed">
            Remove{" "}
            <span className="font-mono font-bold text-gray-800">
              {voucher?.code}
            </span>
            ?{" "}
            <span className="text-xs text-rose-400 block mt-1">This action cannot be undone.</span>
          </p>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onCancel} disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50">
              Cancel
            </button>
            <button type="button" onClick={onConfirm} disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 transition disabled:opacity-60 flex items-center justify-center gap-2">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</>
                : <><Trash2 className="w-4 h-4" /> Yes, Delete</>}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AllVouchers({
  vouchers,
  loading,
  error,
  fetchVouchers,
  totalPages,
  totalVouchers,
  currentPage,
  setCurrentPage,
  fetchStats,

  search,
  setSearch,

  status,
  setStatus,

  eligibility,
  setEligibility,

  appliesTo,
  setAppliesTo,

  sortBy,
  setSortBy,

  sortOrder,
  setSortOrder
}){
  
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [toggleTarget,  setToggleTarget]  = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

 

  const [showVoucherModal, setShowVoucherModal] = useState(false);
const [editVoucher, setEditVoucher] = useState(null);

  const token = localStorage.getItem("token");

  // ── Fetch ────────────────────────────────────────────────────────────────


  
useEffect(() => {
  fetchVouchers();
}, [
  currentPage,
  search,
  status,
  eligibility,
  appliesTo,
  sortBy,
  sortOrder
]);

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const res = await axios.delete(`${BASE_URL}/admin/vouchers/${deleteTarget._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {

        setDeleteTarget(null);
        toast.success("Voucher deleted successfully")
        fetchStats()

        fetchVouchers();
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Toggle status ─────────────────────────────────────────────────────────
  const handleConfirmToggle = async () => {
    if (!toggleTarget) return;
    setActionLoading(true);
    const isActive  = toggleTarget.status === "active";
    const newStatus = isActive ? "inactive" : "active";
    try {
      const res = await axios.patch(
        `${BASE_URL}/admin/vouchers/${toggleTarget._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setToggleTarget(null);
        fetchVouchers();
      } else {
        alert(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (voucher) => {
  setEditVoucher(voucher);
  setShowVoucherModal(true);
};

  // ── Helpers ───────────────────────────────────────────────────────────────
  const selectCls = "px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-300 text-sm bg-white w-full";

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* ── Header ── */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <Ticket className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">All Vouchers</h1>
            <p className="text-xs sm:text-sm text-gray-500">Manage discount vouchers and offers</p>
          </div>
        </div>
        <div className="text-sm font-semibold text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          Total: {totalVouchers}
        </div>
      </motion.div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-purple-500 flex-shrink-0" />
          <h2 className="font-semibold text-gray-700 text-sm">Filters</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search vouchers…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-300 text-sm" />
          </div>

          <select value={status}      onChange={(e) => setStatus(e.target.value)}      className={selectCls}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
            <option value="upcoming">Upcoming</option>
            <option value="exhausted">Exhausted</option>
          </select>

          <select value={eligibility} onChange={(e) => setEligibility(e.target.value)} className={selectCls}>
            <option value="all">All Users</option>
            <option value="new_users">New Users</option>
            <option value="existing_users">Existing Users</option>
          </select>

          <select value={appliesTo}   onChange={(e) => setAppliesTo(e.target.value)}   className={selectCls}>
            <option value="all">All Types</option>
            <option value="category">Category</option>
          </select>

          <select value={`${sortBy}-${sortOrder}`}
            onChange={(e) => { const [f,o] = e.target.value.split("-"); setSortBy(f); setSortOrder(o); }}
            className={selectCls}>
            <option value="createdAt-desc">Newest</option>
            <option value="createdAt-asc">Oldest</option>
            <option value="usedCount-desc">Most Used</option>
            <option value="endDate-asc">Expiry Soon</option>
          </select>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* horizontal scroll ONLY on table */}
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Voucher","Discount","Eligibility","Applies To","Usage","Expiry","Status","Actions"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Loading vouchers…</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="text-center py-14 text-rose-500 text-sm">{error}</td>
                </tr>
              ) : vouchers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-16">
                    <Ticket className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No vouchers found</p>
                  </td>
                </tr>
              ) : (
                vouchers.map((v) => (
                  <motion.tr key={v._id} initial={{ opacity:0 }} animate={{ opacity:1 }}
                    className="hover:bg-gray-50/60 transition">
                    {/* Voucher */}
                    <td className="px-5 py-4">
                      <p className="font-mono font-bold text-gray-800 text-sm tracking-widest">{v.code}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{v.title}</p>
                    </td>
                    {/* Discount */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-bold text-gray-800 text-sm">
                        {v.discountType === "percentage" ? `${v.discount}% OFF` : `₹${v.discount} OFF`}
                      </span>
                      {v.maxDiscountAmount && (
                        <p className="text-[10px] text-gray-400 mt-0.5">Max ₹{v.maxDiscountAmount}</p>
                      )}
                    </td>
                    {/* Eligibility */}
                    <td className="px-5 py-4 text-sm text-gray-600 capitalize whitespace-nowrap">
                      {v.eligibility?.replace("_"," ")}
                    </td>
                    {/* Applies To */}
                    <td className="px-5 py-4 text-sm text-gray-600 capitalize whitespace-nowrap">
                      {v.appliesTo === "category" && v.applicableCategories?.length > 0
                        ? <span>{v.applicableCategories.length} categor{v.applicableCategories.length>1?"ies":"y"}</span>
                        : v.appliesTo}
                    </td>
                    {/* Usage */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-700">
                        {v.usedCount || 0}{v.maxUses ? ` / ${v.maxUses}` : ""}
                      </p>
                      {v.maxUses && (
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full"
                            style={{ width:`${Math.min(((v.usedCount||0)/v.maxUses)*100,100)}%` }} />
                        </div>
                      )}
                    </td>
                    {/* Expiry */}
                    <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(v.endDate).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                    </td>
                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-bold capitalize",
                        STATUS_BADGE[v.status] || STATUS_BADGE.inactive
                      )}>
                        {v.status}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {/* Edit */}
                        <button onClick={() => handleEdit(v)} title="Edit"
                          className="w-8 h-8 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition">
                          <Pencil className="w-3.5 h-3.5 text-blue-600" />
                        </button>
                       
                        {/* Delete */}
                        <button onClick={() => setDeleteTarget(v)} title="Delete"
                          className="w-8 h-8 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 flex items-center justify-center transition">
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-gray-500 order-2 sm:order-1">
          Page <span className="font-semibold text-gray-700">{currentPage}</span> of{" "}
          <span className="font-semibold text-gray-700">{totalPages}</span>
          {" "}· {totalVouchers} total
        </p>
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}
            className="h-9 px-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm font-medium transition">
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          {/* Page number pills */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const page = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
              return (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-9 h-9 rounded-xl text-sm font-semibold transition",
                    page === currentPage
                      ? "bg-purple-600 text-white shadow-sm"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  )}>
                  {page}
                </button>
              );
            })}
          </div>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}
            className="h-9 px-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm font-medium transition">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            voucher={deleteTarget}
            loading={actionLoading}
            onCancel={() => !actionLoading && setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
  {showVoucherModal && (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={() => {
          setShowVoucherModal(false);
          setEditVoucher(null);
        }}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      >
        <div className="w-full max-w-5xl max-h-[95vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
          <VoucherModal
            voucher={editVoucher}
            onClose={() => {
              setShowVoucherModal(false);
              setEditVoucher(null);
            }}
            onSuccess={() => {
              fetchVouchers();
              setShowVoucherModal(false);
              setEditVoucher(null);
            }}
            fetchStats={fetchStats}
            fetchVouchers={fetchVouchers}

          />
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
    </div>
  );
}