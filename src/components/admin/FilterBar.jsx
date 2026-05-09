import React from "react";
import { Search } from "lucide-react";

export default function FilterBar({
  searchTerm,
  onSearchChange,
  categories = [],
  categoryFilter,
  onCategoryChange,
  stockFilter,
  onStockChange,
  sortBy,
  onSortChange,
  itemsPerPage,
  onItemsPerPageChange,
}) 
{
  return (
    <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">

        {/* SEARCH */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

            <input
              type="text"
              placeholder="Search products by title..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-200 focus:outline-none rounded-xl bg-[#f6f8f7] text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* CATEGORY */}
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="border border-gray-200 bg-[#f6f8f7] focus:outline-none rounded-xl px-3 py-2 bg-gray-50 text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* STOCK FILTER */}
        <select
          value={stockFilter}
          onChange={(e) => onStockChange(e.target.value)}
          className="border border-gray-200 bg-[#f6f8f7] focus:outline-none rounded-xl px-3 py-2 bg-gray-50 text-sm"
        >
          <option value="all">All Stock</option>
          <option value="low">Low Stock (&lt; 10)</option>
          <option value="medium">Medium (10-50)</option>
          <option value="high">High Stock (&gt; 50)</option>
        </select>

        {/* SORT */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-gray-200 bg-[#f6f8f7] focus:outline-none rounded-xl px-3 py-2 bg-gray-50 text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
        </select>

        {/* ITEMS PER PAGE */}
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border border-gray-200 bg-[#f6f8f7] focus:outline-none rounded-xl px-3 py-2 bg-gray-50 text-sm"
        >
          <option value={12}>12 / page</option>
          <option value={24}>24 / page</option>
          <option value={48}>48 / page</option>
        </select>

      </div>
    </div>
  );
}