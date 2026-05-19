import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  ChevronUp,
  Heart,
  ShoppingCart
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import sampleProduct from "../../assets/products/sampleProduct.png";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react"; // add to existing lucide import
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useCart } from "../../pages/CartContext";
import LoginRequiredModal from "./modal/LoginRequiredModal"

const StarRating = ({ average = 0, count = 0 }) => (
  <div className="flex items-center gap-2 text-sm">
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Heart
          key={s}
          className={`h-4 w-4 ${s <= Math.round(average) ? "fill-[#d2e16a] text-[#d2e16a]" : "text-gray-300 fill-gray-100"}`}
        />
      ))}
    </div>

    <span className="text-gray-400">({count} reviews)</span>
  </div>
);

export default function ProductsSection() {
  const navigate = useNavigate(); // Added navigation hook
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(true);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const { fetchCartCount } = useCart();
  
  

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/products/categories`);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch categories");
      }

      setCategories(result.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/products/list`);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch products");
      }

      setProducts(result.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // Handle category checkbox change
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // NEW: Handle navigation to product detail
  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery.trim() !== "") {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Category — case-insensitive because API returns mixed case
    if (selectedCategories.length > 0) {
      result = result.filter((p) =>
        selectedCategories.some(
          (sel) => sel.toLowerCase() === p.category?.toLowerCase(),
        ),
      );
    }

    // Sort / tag filter
    if (sortBy === "low-to-high") {
      result = [...result].sort(
        (a, b) => (a.sellingPrice || 0) - (b.sellingPrice || 0),
      );
    } else if (sortBy === "high-to-low") {
      result = [...result].sort(
        (a, b) => (b.sellingPrice || 0) - (a.sellingPrice || 0),
      );
    } else if (sortBy === "new") {
      result = result.filter(
        (p) => p.tag?.toLowerCase() === "new" || p.isNewest === true,
      );
    } else if (sortBy === "bestseller") {
      result = result.filter(
        (p) => p.tag?.toLowerCase() === "bestseller" || p.isBestseller === true,
      );
    } else if (sortBy === "combo") {
      result = result.filter((p) => p.tag?.toLowerCase() === "combo");
    } else if (sortBy === "limited") {
      result = result.filter(
        (p) => p.tag?.toLowerCase() === "limited" || p.isLimited === true,
      );
    }

    return result;
  }, [products, searchQuery, selectedCategories, sortBy]);

  // Tag styling helper
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

  // ✅ UNIQUE USEFFECT: Handle category from CAROUSEL (URL params only)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");

    if (categoryParam && categories.length > 0) {
      const decodedCategory = decodeURIComponent(categoryParam);

      const matchedCategory = categories.find(
        (cat) => cat.toLowerCase() === decodedCategory.toLowerCase(),
      );

      if (matchedCategory) {
        setSelectedCategories([matchedCategory]);
      }
    }
  }, [location.search, categories]);
  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategories([location.state.category]);
    }
    if (location.state?.tag) {
      // map incoming tag label → sortBy key
      const tagMap = {
        New: "new",
        new: "new",
        Bestseller: "bestseller",
        bestseller: "bestseller",
        Combo: "combo",
        combo: "combo",
        Limited: "limited",
        limited: "limited",
        Featured: "default", // no sort option for featured, show all
      };
      setSortBy(tagMap[location.state.tag] ?? "default");
    }
  }, [location.state]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("categories");

    if (categoryParam) {
      // Store categories in их ORIGINAL case (from backend)
      const categoryList = categoryParam.split(",").map((cat) => cat.trim());

      // Filter categories that MATCH (case-insensitive)
      const matchingCategories = categories.filter((cat) =>
        categoryList.some(
          (selected) => selected.toLowerCase() === cat.toLowerCase(),
        ),
      );

      setSelectedCategories(matchingCategories);
    }
  }, [location.search, categories]);
  const [cartLoadingId, setCartLoadingId] = useState(null); // tracks which variant is loading
const token = localStorage.getItem("token");
const [showLoginModal, setShowLoginModal] = useState(false);
const handleAddToCart = async (e, product) => {
  e.stopPropagation(); // prevent navigating to product detail
  if (!token) {
  setShowLoginModal(true);
  return;
}


  if (!product.quantity || product.quantity === 0) {
    toast.error("This product is out of stock");
    return;
  }

  const loadingKey = `${product._id}-${product.variantIndex}`;
  setCartLoadingId(loadingKey);

  try {
    const response = await fetch(`${BASE_URL}/cart/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId:    product._id,
        variantIndex: product.variantIndex ?? 0,
        quantity:     1,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      // 409 = already in cart
      if (response.status === 409) {
        toast.error(result.message || "Already in cart");
      } else {
        throw new Error(result.message || "Failed to add to cart");
      }
      return;
    }

    toast.success(result.message || "Added to cart!");
    fetchCartCount()
    
    // If you have CartContext available here, call fetchCartCount
    // fetchCartCount?.();
  } catch (err) {
    toast.error(err.message || "Something went wrong");
  } finally {
    setCartLoadingId(null);
  }
};

  return (
    <section className="bg-[#f4efe9] py-12 sm:py-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* TOP HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 mb-12 border-b border-gray-200/50 pb-6">
          {/* Left: Product Count */}
          <div className="text-[#143c2f] font-medium text-sm">
            <span className="font-bold text-[#457358]">
              {filteredProducts.length}
            </span>{" "}
            Products Found
          </div>

          {/* Center: Search Bar */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search N-Organics products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#457358]/40 focus:border-[#457358] transition"
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          </div>

          {/* Right: Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs uppercase tracking-wider text-gray-400 hidden sm:block font-semibold">
              Sort:
            </span>
            <div className="relative w-full md:w-56">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 text-sm rounded-full py-3 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#457358]/40 focus:border-[#457358] transition cursor-pointer"
              >
                <option value="default">All Products</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
                <option value="new">Newest</option>

                <option value="bestseller">Bestseller</option>
                <option value="combo">Combo Products</option>
                <option value="limited">Limited Edition</option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* MAIN BODY: SIDEBAR & PRODUCT GRID */}
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div
              className="flex justify-between items-center mb-5 cursor-pointer bg-white p-4 rounded-2xl border border-gray-200/30 shadow-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#143c2f] flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#457358]" />{" "}
                Categories
              </h3>
              <button className="text-xs font-semibold text-[#457358] hover:underline">
                {showFilters ? (
                  <span className="flex items-center gap-1 cursor-pointer">
                    Hide <ChevronUp className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="flex items-center gap-1 cursor-pointer">
                    Show <ChevronDown className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>

            {/* Checkbox filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-3 bg-white p-5 rounded-[22px] border border-gray-100 shadow-[0_5px_15px_rgba(20,60,47,0.03)]"
                >
                  {categories.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-3 text-sm text-[#3b5247] font-medium cursor-pointer select-none py-1 transition hover:text-[#457358]"
                    >
                      <input
                        type="checkbox"
                        value={cat}
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                        className="rounded border-gray-300 text-[#457358] focus:ring-[#457358]"
                      />
                      {cat}
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Product Grid */}
          <div className="flex-1 w-full">
            {loading ? (
              <div className="text-center py-20 text-gray-400">
                Loading products...
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={`${product._id}-${product.variantIndex}`}
                    className="flex flex-col group"
                  >
                    <div
                      className="relative aspect-[3/4] overflow-hidden rounded-[24px] bg-white shadow-[0_6px_20px_rgba(20,60,47,0.04)] border border-gray-100/50"
                      onClick={() => handleViewDetails(product._id)}
                    >
                      <img
                        src={product.image || sampleProduct}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* top badges */}
                      {/* top badges — replace the entire "top badges" div with this */}
                      <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
                        {/* Left: offer/discount badge */}
                        {product.bestOffer &&
                          product.bestOffer.discount > 0 && (
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

                        {/* Right: product label badge
      Priority: isFeatured > isBestseller > isNewest > isLimited > tag string
      If tag string matches an active boolean, we show it once (no duplicate).  */}
                        {(() => {
                          // Determine which label to show
                          let label = null;
                          let colorClass = "";

                          if (product.isFeatured) {
                            label = "Featured";
                            colorClass = "bg-[#e8a020] text-white"; // amber
                          } else if (
                            product.isBestseller ||
                            product.tag?.toLowerCase() === "bestseller"
                          ) {
                            label = "Bestseller";
                            colorClass = "bg-[#129b6f] text-white";
                          } else if (
                            product.isNewest ||
                            product.tag?.toLowerCase() === "new"
                          ) {
                            label = "New";
                            colorClass = "bg-[#12988f] text-white";
                          } else if (
                            product.isLimited ||
                            product.tag?.toLowerCase() === "limited"
                          ) {
                            label = "Limited";
                            colorClass = "bg-[#dd7714] text-white";
                          } else if (product.tag?.toLowerCase() === "combo") {
                            label = "Combo";
                            colorClass = "bg-[#5945f1] text-white";
                          } else if (product.tag) {
                            // any other tag string fallback
                            label = product.tag;
                            colorClass = "bg-gray-500 text-white";
                          }

                          if (!label) return null;

                          return (
                            <span
                              className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full shadow-sm ml-auto ${colorClass}`}
                            >
                              {label}
                            </span>
                          );
                        })()}
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        {product.quantity > 0 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(product._id);
                            }}
                            className="w-full bg-white text-[#143c2f] font-semibold text-xs uppercase tracking-widest py-3.5 rounded-full shadow-xl hover:bg-[#c8fec0] transition-all transform translate-y-3 group-hover:translate-y-0 duration-300 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </button>
                        ) : (
                          <div className="w-full bg-red-500 text-white font-semibold text-xs uppercase tracking-widest py-3.5 rounded-full shadow-xl flex items-center justify-center">
                            Out Of Stock
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 px-1.5 flex flex-col items-start">
                      <h4 className="text-sm font-bold tracking-wide text-[#143c2f] truncate max-w-full">
                        {product.name}
                      </h4>
                      <StarRating
                        average={product.ratingAverage}
                        count={product.ratingCount}
                      />
                      <div className="w-full flex flex-row justify-between mt-4">
                        <div className="flex items-center gap-2 mt-1">
                          <p className="font-semibold text-[#457358]">
                            ₹{product.sellingPrice}
                          </p>

                          {product.mrp > product.sellingPrice && (
                            <p className="text-sm text-gray-400 line-through">
                              ₹{product.mrp}
                            </p>
                          )}
                        </div>
                        <div>
                
{(() => {
  const loadingKey = `${product._id}-${product.variantIndex}`;
  const isLoading  = cartLoadingId === loadingKey;
  const isOOS      = !product.quantity || product.quantity === 0;

  return (
    <button
      onClick={(e) => handleAddToCart(e, product)}
      disabled={isLoading || isOOS}
      className="cursor-pointer flex items-center gap-1.5 bg-[#457358] text-white hover:bg-[#d2e16a] hover:text-[#143c2f] text-sm px-2 py-1 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading
        ? <Loader2 className="w-4 h-4 animate-spin" />
        : <ShoppingCart className="w-4 h-4" />
      }
      {isLoading ? "Adding…" : isOOS ? "Out of Stock" : "Add to Cart"}
    </button>
  );
})()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100/60 shadow-sm text-gray-400">
                No products found matching your active filters.
              </div>
            )}
          </div>
        </div>
      </div>
      <LoginRequiredModal
  isOpen={showLoginModal}
  onClose={() => setShowLoginModal(false)}
  title="Login Required"
  message="Please sign in to add items to your cart."
  redirectPath="/sign-in"
/>
    </section>
  );
}
