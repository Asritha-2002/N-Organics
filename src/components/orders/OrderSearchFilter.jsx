import React, { useState, useEffect, useRef } from "react";
import { Search, X, ChevronDown, Filter } from "lucide-react";

// ─── All order statuses matching your backend ─────────────────────────────────
const STATUS_OPTIONS = [
  { value: "",                 label: "All" },
  { value: "confirmed",        label: "Confirmed" },
  { value: "processing",       label: "Processing" },
  { value: "shipped",          label: "Shipped" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered",        label: "Delivered" },
  { value: "cancelled",        label: "Cancelled" },
  { value: "return_requested", label: "Return Requested" },
  { value: "returned",         label: "Returned" },
  { value: "refund_initiated",  label: "Refund Initiated" },
  { value: "refund_completed",  label: "Refund Completed" },
];

const STATUS_COLORS = {
  confirmed:        "text-emerald-600 bg-emerald-50 border-emerald-200",
  processing:       "text-blue-600 bg-blue-50 border-blue-200",
  shipped:          "text-violet-600 bg-violet-50 border-violet-200",
  out_for_delivery: "text-indigo-600 bg-indigo-50 border-indigo-200",
  delivered:        "text-teal-600 bg-teal-50 border-teal-200",
  cancelled:        "text-red-600 bg-red-50 border-red-200",
  return_requested: "text-orange-600 bg-orange-50 border-orange-200",
  returned:         "text-orange-600 bg-orange-50 border-orange-200",
  refund_initiated:  "text-yellow-600 bg-yellow-50 border-yellow-200",
  refund_completed:  "text-green-600 bg-green-50 border-green-200",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function OrderSearchFilter({ onSearch, onStatusFilter }) {
  const [query,          setQuery]          = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dropdownOpen,   setDropdownOpen]   = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(query.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleStatusSelect = (value) => {
    setSelectedStatus(value);
    setDropdownOpen(false);
    onStatusFilter?.(value);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch?.("");
  };

  const selectedLabel = STATUS_OPTIONS.find(o => o.value === selectedStatus)?.label || "All";

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">

      {/* ── Search Bar ── */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by order ID, product, customer, price..."
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Status Dropdown ── */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition min-w-[160px] justify-between"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className={`font-medium ${selectedStatus ? "text-gray-800" : "text-gray-500"}`}>
              {selectedLabel}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
            {STATUS_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleStatusSelect(value)}
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition ${
                  selectedStatus === value ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700"
                }`}
              >
                {value && (
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 border ${STATUS_COLORS[value] || "bg-gray-200"}`} />
                )}
                {!value && <span className="w-2 h-2 rounded-full flex-shrink-0 bg-gray-300" />}
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}