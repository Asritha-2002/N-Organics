import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";

import ProductModal from "./ProductForm";
import ProductStatsCards from "./ProductStatsCard";
import FilterBar from "./FilterBar";
import ProductGrid from "./ProductsGrid";

// BASE_URL
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Products() {
  const [openModal, setOpenModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [page, setPage] = useState(1);

  // Products
  const [products, setProducts] = useState([]);

  
  const [pagination, setPagination] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const token = localStorage.getItem("token");

  // ─────────────────────────────────────────────────────────────
  // Fetch Stats
  // ─────────────────────────────────────────────────────────────

   const fetchStats = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/products/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

  useEffect(() => {
   
    fetchStats();
  }, [token]);

  // ─────────────────────────────────────────────────────────────
  // Fetch Categories
  // ─────────────────────────────────────────────────────────────
  
   const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/products/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setCategories(data.data || []);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
  useEffect(() => {
       fetchCategories();
  }, [token]);

  // Reset page on filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, categoryFilter, stockFilter, sortBy, itemsPerPage]);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, categoryFilter, stockFilter, sortBy, itemsPerPage]);

  const fetchProducts = async () => {
    setLoadingProducts(true);

    const params = new URLSearchParams({
      page: String(page),
      limit: String(itemsPerPage),
      search: searchTerm || "",
      category: categoryFilter || "all",
      stock: stockFilter || "all",
      sortBy: sortBy || "newest",
    });

    try {
      const res = await fetch(
        `${BASE_URL}/admin/products?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        const normalizedProducts = (data?.data?.products || []).map((p) => {
          const totalStock =
            typeof p?.totalStock === "number"
              ? p.totalStock
              : Array.isArray(p?.variants)
              ? p.variants.reduce(
                  (sum, variant) =>
                    sum + (Number(variant?.stock?.quantity) || 0),
                  0
                )
              : 0;

          return {
            ...p,
            totalStock,
          };
        });

        setProducts(normalizedProducts);
        setPagination(data?.data?.pagination || null);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-2 justify-between p-6 items-center mb-6 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Product Management
          </h1>

          <p className="text-gray-500 text-sm">
            Manage your product inventory and catalog
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="p-6">
        {loadingStats ? (
          <p className="text-center text-gray-500">Loading stats...</p>
        ) : (
          stats && <ProductStatsCards stats={stats} />
        )}
      </div>

      {/* Filters */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        stockFilter={stockFilter}
        onStockChange={setStockFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {/* Product Grid Component */}
      <ProductGrid
        products={products}
        loadingProducts={loadingProducts}
        fetchProducts={fetchProducts}
        fetchCategories={fetchCategories}
        fetchStats={fetchStats}
      />

      {/* Pagination */}
      {pagination && (
        <div className="p-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <div className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium">{products.length}</span> of{" "}
            <span className="font-medium">{pagination.total}</span> products
          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            <button
              disabled={pagination.page <= 1}
              onClick={() => setPage(pagination.page - 1)}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-sm"
            >
              Previous
            </button>

            <span className="px-3 py-1 text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage(pagination.page + 1)}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <ProductModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        fetchProducts={fetchProducts}
        fetchCategories={fetchCategories}
        
      />
    </div>
  );
}