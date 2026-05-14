import React from "react";

export default function ProductStatsCard({ stats }) {
 
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {[
        {
          label: "Total Products",
          value: stats.totalProducts,
          suffix: "",
        },
        {
          label: "Total Stock",
          value: stats.totalStock,
          suffix: " units",
        },
        {
          label: "Low Stock Items",
          value: stats.lowStockProducts,
          suffix: " SKUs",
        },
        {
          label: "Inventory Value",
          value: "₹" + stats.inventoryValue.toLocaleString(),
          suffix: "",
        },
        {
          label: "Categories",
          value: stats.categoriesCount,
          suffix: " categories",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm"
        >
          <p className="text-sm text-gray-500 mb-1">{item.label}</p>
          <p className="text-xl font-bold text-gray-800">
            {item.value}
            <span className="text-sm font-normal text-gray-500">
              {item.suffix}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}