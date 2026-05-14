import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { Download, Plus, Ticket, X } from "lucide-react";
import VoucherModal from '../admin/adminModals/VoucherModal'; // Import the modal component
import VoucherStats from './VoucherStats';
import AllVouchers from './AllVouchers';
import toast from "react-hot-toast"
const BASE_URL = import.meta.env.VITE_BASE_URL;
import axios from "axios"

function Button({ label, icon: Icon, variant = "default", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 text-sm font-medium rounded-md transition px-4 py-2 h-10";

  const styles = {
    default: "bg-purple-500 text-white hover:bg-purple-600 shadow cursor-pointer",
    outline: "border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer",
  };

  return (
    <button className={`${base} ${styles[variant]}`} {...props}>
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
}

const Voucher = () => {
  const [openForm, setOpenForm] = useState(false);
  const [stats, setStats] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [vouchers, setVouchers] = useState([]);
const [vouLoading, setVouLoading] = useState(false);
const [vouError, setVouError] = useState(null);

const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [totalVouchers, setTotalVouchers] = useState(0);

const fetchStats = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${BASE_URL}/admin/vouchers/stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    setStats(data.data);

  } catch (err) {
    setError(err.message);
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchStats();
}, []);
 const [search,      setSearch]      = useState("");
  const [status,      setStatus]      = useState("all");
  const [eligibility, setEligibility] = useState("all");
  const [appliesTo,   setAppliesTo]   = useState("all");
  const [sortBy,      setSortBy]      = useState("createdAt");
  const [sortOrder,   setSortOrder]   = useState("desc");
const limit = 10;
const token = localStorage.getItem("token");
 const fetchVouchers = async () => {
    try {
      setVouLoading(true);
      setVouError(null);
      const params = { page: currentPage, limit, sortBy, sortOrder };
      if (search)               params.search      = search;
      if (status !== "all")     params.status      = status;
      if (eligibility !== "all")params.eligibility = eligibility;
      if (appliesTo !== "all")  params.appliesTo   = appliesTo;

      const res = await axios.get(`${BASE_URL}/vouchers`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setVouchers(res.data.data || []);
        setTotalPages(res.data.pagination?.pages || 1);
        setTotalVouchers(res.data.pagination?.total || 0);
      } else {
        setVouError(res.data.message || "Failed to fetch vouchers");
      }
    } catch (err) {
      console.error(err);
      setVouError("Failed to load vouchers");
    } finally {
      setVouLoading(false);
    }
  };

  useEffect(() => {
   fetchVouchers();
}, [currentPage]);

  
  const handleAdd = () => {
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };

  const handleSuccess = () => {
    // Add any logic you want to execute after successful voucher creation
    // For example: refresh voucher list, show notification, etc.
    console.log("Voucher created successfully!");
    // The modal will close automatically after success
  };
  useEffect(() => {
  setCurrentPage(1);
}, [search, status, eligibility, appliesTo]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
            <Ticket className="w-5 h-5 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Vouchers Management
            </h1>
            <p className="text-sm text-gray-500">
              Create and manage discount vouchers and promotions
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            icon={Plus}
            label="Add Voucher"
            onClick={handleAdd}
          />
        </div>
      </motion.div>
      <VoucherStats
  stats={stats}
  loading={loading}
  error={error}
  onRetry={fetchStats}
/>
      <AllVouchers
  vouchers={vouchers}
  loading={vouLoading}
  error={vouError}
  fetchVouchers={fetchVouchers}
  totalPages={totalPages}
  totalVouchers={totalVouchers}
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
  fetchStats={fetchStats}

  search={search}
  setSearch={setSearch}

  status={status}
  setStatus={setStatus}

  eligibility={eligibility}
  setEligibility={setEligibility}

  appliesTo={appliesTo}
  setAppliesTo={setAppliesTo}

  sortBy={sortBy}
  setSortBy={setSortBy}

  sortOrder={sortOrder}
  setSortOrder={setSortOrder}
/>

      {/* Modal */}
      <AnimatePresence>
        {openForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-xl font-bold text-gray-800">Create New Voucher</h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <VoucherModal 
                  onClose={handleClose} 
                  onSuccess={handleSuccess} 
                  fetchStats={fetchStats}
                  fetchVouchers={fetchVouchers}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Voucher;