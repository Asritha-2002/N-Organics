import React from "react";
import { Search, ChevronDown } from "lucide-react";

/* ================= REUSABLE INPUT ================= */
const Input = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`flex h-11 w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#29a9a7] ${className}`}
    />
  );
};

/* ================= REUSABLE SELECT ================= */
const Select = ({ value, onChange, options = [], className = "" }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none h-11 w-full rounded-xl border border-gray-300 bg-gray-50 px-3 pr-8 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#29a9a7] ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom dropdown icon */}
      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  );
};

/* ================= MAIN FILTER COMPONENT ================= */
export default function BannerFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  appliesToFilter,
  onAppliesToChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mx-4">
      
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        
        {/* 🔍 SEARCH */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search banners by title..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 🔽 FILTERS */}
        <div className="flex flex-wrap gap-3">
          
          {/* STATUS */}
          <Select
            value={statusFilter}
            onChange={onStatusChange}
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "deleted", label: "Deleted" },
            ]}
            className="w-36"
          />

          {/* APPLIES TO */}
          <Select
            value={appliesToFilter}
            onChange={onAppliesToChange}
            options={[
              { value: "all", label: "All Targets" },
              { value: "products", label: "Products" },
              { value: "category", label: "Category" },
            ]}
            className="w-40"
          />

          {/* SORT */}
          <Select
            value={sort}
            onChange={onSortChange}
            options={[
              { value: "newest", label: "Newest First" },
              { value: "oldest", label: "Oldest First" },
              { value: "priority-high", label: "High Priority" },
              { value: "priority-low", label: "Low Priority" },
            ]}
            className="w-40"
          />
        </div>
      </div>
    </div>
  );
}