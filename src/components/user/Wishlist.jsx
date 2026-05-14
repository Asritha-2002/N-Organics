import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Eye, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import sampleProduct from "../../assets/products/sampleProduct.png";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const getTagColor = (tag) => {
  switch (tag?.toLowerCase()) {
    case "limited":
      return "bg-[#dd7714] text-white";

    case "bestseller":
      return "bg-[#129b6f] text-white";

    case "new":
      return "bg-[#12988f] text-white";

    case "combo":
      return "bg-[#5945f1] text-white";

    default:
      return "bg-gray-500 text-white";
  }
};
export default function Wishlist() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const fetchWishlistProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/profile/favorites/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch wishlist products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: Toggle Favorite Logic ---
  const handleToggleFavorite = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${BASE_URL}/profile/favorites/toggle`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 200) {
        // Show specific message from backend or custom
        const isRemoved = response.data.message
          .toLowerCase()
          .includes("removed");
        showToast(
          isRemoved
            ? "Product removed successfully!"
            : "Product added to favorites!",
        );

        // Re-fetch to sync with database
        fetchWishlistProducts();
      }
    } catch (error) {
      showToast("Failed to remove product. Please try again.", "error");
      console.error("Toggle error:", error);
    }
  };

  useEffect(() => {
    fetchWishlistProducts();
  }, []);

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <section className="py-2 min-h-screen relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`fixed top-24 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border ${
              toast.type === "error"
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle size={18} />
            ) : (
              <CheckCircle size={18} />
            )}
            <span className="font-medium text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl px-2 sm:px-3 lg:px-3">
        <div className="mb-10 p-3 rounded pb-6 border border-gray-200 rounded-xl bg-white shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            My Wishlist
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">
            Your saved products are shown here. You can revisit any product and
            continue shopping.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-500">
            <Loader2 className="h-10 w-10 animate-spin text-[#457358] mb-4" />
            <p className="font-medium">Updating your collection...</p>
          </div>
        ) : products.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence>
              {products.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  key={product._id}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded border border-gray-100/50 bg-white shadow-sm
                  "
                  onClick={() => handleViewDetails(product._id)}>
                    <img
                      src={product.image || sampleProduct}
                      alt={product.name}
                      
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-2 right-2 flex items-start justify-between gap-2">
                      {/* Offer badge */}
                      {product.bestOffer && product.bestOffer.discount > 0 && (
                        <span
                          className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full shadow-sm border ${
                            product.bestOffer.discountType === "percentage"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {product.bestOffer.discountType === "percentage"
                            ? `${product.bestOffer.discount}% Off`
                            : `Flat ₹${product.bestOffer.discount} Off`}
                        </span>
                      )}

                      {product.tag && (
                        <span
                          className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full shadow-sm ${getTagColor(
                            product.tag,
                          )}`}
                        >
                          {product.tag}
                        </span>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-4">
                      <button
                        onClick={() => handleViewDetails(product._id)}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-2 text-xs font-semibold uppercase tracking-widest text-[#143c2f] shadow-xl hover:bg-[#c8fec0] transition-all cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 px-1.5 flex items-start justify-between gap-3 ">
                    {/* Left Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate text-sm font-bold text-[#143c2f]">
                        {product.name}
                      </h4>

                      <p className="mt-1 text-sm text-[#457358]">
                        {product.category}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <p className="font-semibold text-[#457358]">
                          ₹{product.sellingPrice}
                        </p>

                        {product.mrp > product.sellingPrice && (
                          <p className="text-sm text-gray-400 line-through">
                            ₹{product.mrp}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(product._id);
                      }}
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-600 shadow-sm hover:bg-emerald-50 transition-colors shrink-0 cursor-pointer"
                      aria-label="Remove from wishlist"
                    >
                      <Heart className="h-5 w-5 fill-emerald-600" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 py-24 text-center text-gray-400">
            No products in your wishlist yet.
          </div>
        )}
      </div>
    </section>
  );
}
