import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import sampleProduct from "../../assets/products/sampleProduct.png";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

// Dummy Data with tags
const initialProducts = [
  {
    id: 1,
    name: "Pure Aloe Soothing Gel",
    category: "Skin Care",
    price: 499,
    tag: "Bestseller",
    image: sampleProduct,
  },
  {
    id: 2,
    name: "Rosehip Regenerative Facial Oil",
    category: "Skin Care",
    price: 1299,
    tag: "Limited",
    image: sampleProduct,
  },
  {
    id: 3,
    name: "Vitamin C Brightening Serum",
    category: "Skin Care",
    price: 899,
    tag: "New",
    image: sampleProduct,
  },
  {
    id: 4,
    name: "Nourishing Argan Hair Mask",
    category: "Hair Care",
    price: 699,
    tag: "Combo",
    image: sampleProduct,
  },
  {
    id: 5,
    name: "Rosemary Hair Growth Oil",
    category: "Hair Care",
    price: 999,
    tag: "Bestseller",
    image: sampleProduct,
  },
  {
    id: 6,
    name: "Exfoliating Coffee Body Scrub",
    category: "Body Care",
    price: 599,
    tag: "New",
    image: sampleProduct,
  },
  {
    id: 7,
    name: "Lavender & Shea Body Butter",
    category: "Body Care",
    price: 749,
    tag: "Combo",
    image: sampleProduct,
  },
  {
    id: 8,
    name: "Botanical Plant-based Clay Mask",
    category: "Organic Essentials",
    price: 1199,
    tag: "Limited",
    image: sampleProduct,
  },
  {
    id: 9,
    name: "Luxury Rose Water Mist",
    category: "Luxury Hair Rituals",
    price: 399,
    tag: "New",
    image: sampleProduct,
  },
  {
    id: 10,
    name: "Eucalyptus Bath Salt Spa",
    category: "Bath & Spa",
    price: 449,
    tag: "Bestseller",
    image: sampleProduct,
  },
];

const categories = [
  "Skin Care",
  "Hair Care",
  "Body Care",
  "Organic Essentials",
  "Luxury Hair Rituals",
  "Bath & Spa",
];

export default function ProductsSection() {
  const navigate = useNavigate(); // Added navigation hook
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(true);

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
    let result = [...initialProducts];

    // Search filter
    if (searchQuery.trim() !== "") {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Sort/Filter options
    if (sortBy === "low-to-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-to-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "new") {
      result = result.filter((item) => item.tag === "New");
    } else if (sortBy === "bestseller") {
      result = result.filter((item) => item.tag === "Bestseller");
    } else if (sortBy === "combo") {
      result = result.filter((item) => item.tag === "Combo");
    } else if (sortBy === "limited") {
      result = result.filter((item) => item.tag === "Limited");
    }

    return result;
  }, [searchQuery, selectedCategories, sortBy]);

  // Tag styling helper
  const getTagColor = (tag) => {
    switch (tag) {
      case "Bestseller":
        return "bg-emerald-600/90 text-white";
      case "Limited":
        return "bg-amber-600/90 text-white";
      case "New":
        return "bg-teal-600/90 text-white";
      case "Combo":
        return "bg-indigo-600/90 text-white";
      default:
        return "bg-white/80 text-[#1e352b]";
    }
  };

  useEffect(() => {
  if (location.state?.category) {
    setSelectedCategories([location.state.category]);
  }
}, [location.state]);
useEffect(() => {
  // CATEGORY (already done before)
  if (location.state?.category) {
    setSelectedCategories([location.state.category]);
  }

  // ✅ NEW: TAG → SORT DROPDOWN
  if (location.state?.tag) {
    const tagMap = {
      New: "new",
      Bestseller: "bestseller",
      Combo: "combo",
      Limited: "limited",
    };

    setSortBy(tagMap[location.state.tag] || "default");
  }
}, [location.state]);

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
                <option value="default">Featured</option>
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
                <SlidersHorizontal className="h-4 w-4 text-[#457358]" /> Categories
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
            {filteredProducts.length > 0 ? (
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
                    key={product.id}
                    className="flex flex-col group"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] bg-white shadow-[0_6px_20px_rgba(20,60,47,0.04)] border border-gray-100/50"
                    onClick={() => handleViewDetails(product.id)}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />

                      {product.tag && (
                        <span
                          className={`absolute top-4 right-4 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full shadow-sm ${getTagColor(
                            product.tag
                          )}`}
                        >
                          {product.tag}
                        </span>
                      )}

                      {/* MODIFIED: Added onClick to View Details button */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <button 
                          onClick={() => handleViewDetails(product.id)}
                          className="w-full bg-white text-[#143c2f] font-semibold text-xs uppercase tracking-widest py-3.5 rounded-full shadow-xl hover:bg-[#c8fec0] transition-all transform translate-y-3 group-hover:translate-y-0 duration-300 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Eye className="h-4 w-4" /> View Details
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 px-1.5 flex flex-col items-start">
                      <h4 className="text-sm font-bold tracking-wide text-[#143c2f] truncate max-w-full">
                        {product.name}
                      </h4>
                      <p className="mt-1 font-semibold text-[#457358]">
                        ₹{product.price}
                      </p>
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
    </section>
  );
}