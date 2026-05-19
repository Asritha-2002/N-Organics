import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Loader2,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
  Search,
  ArrowRight,
  Eye,
  ShoppingCart,
  Heart,
} from "lucide-react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import toast from "react-hot-toast";
import { useCart } from "../pages/CartContext";
import LoginRequiredModal from "../components/shop/modal/LoginRequiredModal";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ── Star / Heart rating (same as ProductsSection) ──
const StarRating = ({ average = 0, count = 0 }) => (
  <div className="flex items-center gap-2 text-sm">
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Heart
          key={s}
          className={`h-4 w-4 ${
            s <= Math.round(average)
              ? "fill-[#d2e16a] text-[#d2e16a]"
              : "text-gray-300 fill-gray-100"
          }`}
        />
      ))}
    </div>
    <span className="text-gray-400">({count} reviews)</span>
  </div>
);

// ── Sort options ──
const SORT_OPTIONS = [
  { value: "relevant",   label: "Most Relevant" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc",   label: "Name: A → Z" },
  { value: "name_desc",  label: "Name: Z → A" },
];

// ── Filter group definitions ──
const FILTER_GROUPS = [
  {
    key: "concern",
    label: "Concern",
    extract: (item) => item.skincareDetails?.skinConcerns || [],
    match: (item, sel) =>
      sel.some((s) => (item.skincareDetails?.skinConcerns || []).includes(s)),
  },
  {
    key: "skinType",
    label: "Skin Type",
    extract: (item) => item.skincareDetails?.skinType || [],
    match: (item, sel) =>
      sel.some((s) => (item.skincareDetails?.skinType || []).includes(s)),
  },
  {
    key: "category",
    label: "Category",
    extract: (item) => {
      const v = [];
      if (item.category) v.push(item.category);
      if (item.subCategory) v.push(item.subCategory);
      return v;
    },
    match: (item, sel) =>
      sel.some((s) => item.category === s || item.subCategory === s),
  },
  {
    key: "brand",
    label: "Brand",
    extract: (item) => (item.brand ? [item.brand] : []),
    match: (item, sel) => sel.includes(item.brand),
  },
//   {
//     key: "ingredient",
//     label: "Key Ingredient",
//     extract: (item) =>
//       (item.ingredients || []).map((i) => i.name).filter(Boolean),
//     match: (item, sel) =>
//       sel.some((s) => (item.ingredients || []).some((i) => i.name === s)),
//   },
  {
    key: "quantity",
    label: "Size / Quantity",
    extract: (item) => {
      const sizes = new Set();
      (item.variants || []).forEach((v) => {
        if (v.attributes?.size) sizes.add(v.attributes.size);
      });
      return [...sizes];
    },
    match: (item, sel) =>
      sel.some((s) =>
        (item.variants || []).some((v) => v.attributes?.size === s)
      ),
  },
  {
    key: "certifications",
    label: "Certifications",
    extract: (item) => item.certifications || [],
    match: (item, sel) =>
      sel.some((s) => (item.certifications || []).includes(s)),
  },
  {
    key: "madeWithout",
    label: "Made Without",
    extract: (item) => item.madeWithoutList || [],
    match: (item, sel) =>
      sel.some((s) => (item.madeWithoutList || []).includes(s)),
  },
  {
    key: "claims",
    label: "Claims",
    extract: (item) => item.skincareDetails?.claims || [],
    match: (item, sel) =>
      sel.some((s) => (item.skincareDetails?.claims || []).includes(s)),
  },
];

function sortResults(results, sortBy) {
  const arr = [...results];
  if (sortBy === "price_asc")  return arr.sort((a, b) => (a.sellingPrice || 0) - (b.sellingPrice || 0));
  if (sortBy === "price_desc") return arr.sort((a, b) => (b.sellingPrice || 0) - (a.sellingPrice || 0));
  if (sortBy === "name_asc")   return arr.sort((a, b) => a.name?.localeCompare(b.name));
  if (sortBy === "name_desc")  return arr.sort((a, b) => b.name?.localeCompare(a.name));
  return arr;
}

// ── Collapsible filter group ──
function FilterGroup({ group, options, selected, onChange }) {
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll]   = useState(false);
  const LIMIT   = 5;
  const visible = showAll ? options : options.slice(0, LIMIT);
  if (options.length === 0) return null;

  return (
    <div className="border-b border-gray-100 py-4">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between text-sm font-semibold text-gray-800 mb-3"
      >
        {group.label}
        {expanded
          ? <ChevronUp   className="h-4 w-4 text-gray-400" />
          : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>

      {expanded && (
        <div className="space-y-2.5">
          {visible.map(({ value, count }) => {
            const checked = selected.includes(value);
            return (
              <label key={value} className="flex cursor-pointer items-start gap-2.5 group">
                <div
                  onClick={() => onChange(value)}
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                    checked
                      ? "border-[#1c402f] bg-[#1c402f]"
                      : "border-gray-300 bg-white group-hover:border-[#1c402f]"
                  }`}
                >
                  {checked && (
                    <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span
                  onClick={() => onChange(value)}
                  className={`flex-1 text-sm leading-snug capitalize transition ${
                    checked ? "font-medium text-[#1c402f]" : "text-gray-600 group-hover:text-gray-800"
                  }`}
                >
                  {value}
                </span>
                <span className="text-xs text-gray-400 mt-0.5">({count})</span>
              </label>
            );
          })}
          {options.length > LIMIT && (
            <button
              onClick={() => setShowAll((s) => !s)}
              className="mt-1 text-xs font-medium text-[#457358] hover:underline"
            >
              {showAll ? "Show Less ↑" : `Show More (${options.length - LIMIT}) ↓`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── No Results state ──
function NoResults({ query, allProducts, navigate, onAddToCart, cartLoadingId, token, setShowLoginModal }) {
  return (
    <div className="flex flex-col items-center py-16 text-center px-4">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#1c402f]/8 border border-[#1c402f]/10">
        <Search className="h-7 w-7 text-[#1c402f]/40" />
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        No results for &ldquo;{query}&rdquo;
      </h2>
      <p className="text-sm text-gray-500 max-w-xs mb-6">
        We couldn&apos;t find any products matching your search. Try checking your spelling or using different keywords.
      </p>
      <div className="mb-8 rounded-xl bg-[#f0f4f0] border border-[#1c402f]/10 px-5 py-4 text-left w-full max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#1c402f] mb-3">Suggestions</p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#457358]" />Check your spelling and try again</li>
          <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#457358]" />Use general keywords (e.g. &ldquo;serum&rdquo; instead of &ldquo;vitamin c brightening serum&rdquo;)</li>
          <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#457358]" />Try searching by skin concern, ingredient, or category</li>
        </ul>
      </div>
      <button
        onClick={() => navigate("/shop")}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#1c402f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2a5c43]"
      >
        Browse All Products <ArrowRight className="h-4 w-4" />
      </button>

      {allProducts.length > 0 && (
        <div className="mt-12 w-full text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">You might also like</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProducts.slice(0, 3).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                navigate={navigate}
                onAddToCart={onAddToCart}
                cartLoadingId={cartLoadingId}
              />
            ))}
          </div>
          <button
            onClick={() => navigate("/shop")}
            className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#457358] hover:underline"
          >
            View all products <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Product Card — identical to ProductsSection ──
function ProductCard({ product, navigate, onAddToCart, cartLoadingId }) {
  const loadingKey = `${product._id}-${product.variantIndex ?? 0}`;
  const isLoading  = cartLoadingId === loadingKey;
  const isOOS      = !product.quantity || product.quantity === 0;

  // Determine label badge (same logic as ProductsSection)
  let label = null;
  let labelColor = "";
  if (product.isFeatured) {
    label = "Featured"; labelColor = "bg-[#e8a020] text-white";
  } else if (product.isBestseller || product.tag?.toLowerCase() === "bestseller") {
    label = "Bestseller"; labelColor = "bg-[#129b6f] text-white";
  } else if (product.isNewArrival || product.tag?.toLowerCase() === "new") {
    label = "New"; labelColor = "bg-[#12988f] text-white";
  } else if (product.isLimited || product.tag?.toLowerCase() === "limited") {
    label = "Limited"; labelColor = "bg-[#dd7714] text-white";
  } else if (product.tag?.toLowerCase() === "combo") {
    label = "Combo"; labelColor = "bg-[#5945f1] text-white";
  } else if (product.tag) {
    label = product.tag; labelColor = "bg-gray-500 text-white";
  }

  const discount =
    product.mrp > product.sellingPrice
      ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
      : 0;

  return (
    <div className="flex flex-col group">
      {/* Image container — same aspect-[3/4] as ProductsSection */}
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-[24px] bg-white shadow-[0_6px_20px_rgba(20,60,47,0.04)] border border-gray-100/50 cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img
          src={product.image || ""}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          onError={(e) => { e.target.style.display = "none"; }}
        />

        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
          {/* Discount badge */}
          {discount > 0 && (
            <span className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full shadow-sm border bg-amber-50 text-amber-700 border-amber-200">
              {discount}% Off
            </span>
          )}
          {/* Label badge */}
          {label && (
            <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full shadow-sm ml-auto ${labelColor}`}>
              {label}
            </span>
          )}
        </div>

        {/* Hover overlay — same as ProductsSection */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          {!isOOS ? (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
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

      {/* Info below image — same as ProductsSection */}
      <div className="mt-4 px-1.5 flex flex-col items-start">
        <h4 className="text-sm font-bold tracking-wide text-[#143c2f] truncate max-w-full">
          {product.name}
        </h4>
        <StarRating
          average={product.ratingAverage || product.ratings?.average || 0}
          count={product.ratingCount || product.ratings?.count || 0}
        />
        {/* Concerns (bonus: search page shows this) */}
        {product.skincareDetails?.skinConcerns?.length > 0 && (
          <p className="mt-1 text-xs text-gray-400 line-clamp-1 capitalize">
            {product.skincareDetails.skinConcerns.slice(0, 3).join(", ")}
          </p>
        )}
        <div className="w-full flex flex-row justify-between mt-4">
          <div className="flex items-center gap-2 mt-1">
            <p className="font-semibold text-[#457358]">₹{product.sellingPrice}</p>
            {product.mrp > product.sellingPrice && (
              <p className="text-sm text-gray-400 line-through">₹{product.mrp}</p>
            )}
          </div>
          <button
            onClick={(e) => onAddToCart(e, product)}
            disabled={isLoading || isOOS}
            className="cursor-pointer flex items-center gap-1.5 bg-[#457358] text-white hover:bg-[#d2e16a] hover:text-[#143c2f] text-sm px-2 py-1 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <ShoppingCart className="w-4 h-4" />
            }
            {isLoading ? "Adding…" : isOOS ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ──
export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results,     setResults]     = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [sortBy,      setSortBy]      = useState("relevant");
  const [activeFilters, setActiveFilters] = useState({});
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [cartLoadingId, setCartLoadingId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigate = useNavigate();
  const { fetchCartCount } = useCart();
  const token = localStorage.getItem("token");

  // Fetch search results
  useEffect(() => {
    if (!query.trim()) return;
    setActiveFilters({});
    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_URL}/products/search?q=${encodeURIComponent(query.trim())}&limit=50`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (data.success) setResults(data.data);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => controller.abort();
  }, [query]);

  // Fallback products for no-results state
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products/search?q=organic&limit=6`);
        const data = await res.json();
        if (data.success) setAllProducts(data.data);
      } catch (_) {}
    };
    run();
  }, []);

  // Add to cart — same logic as ProductsSection
  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    if (!token) { setShowLoginModal(true); return; }
    if (!product.quantity || product.quantity === 0) {
      toast.error("This product is out of stock");
      return;
    }
    const loadingKey = `${product._id}-${product.variantIndex ?? 0}`;
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
        if (response.status === 409) toast.error(result.message || "Already in cart");
        else throw new Error(result.message || "Failed to add to cart");
        return;
      }
      toast.success(result.message || "Added to cart!");
      fetchCartCount();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setCartLoadingId(null);
    }
  };

  // Build sidebar filter options
  const filterOptions = useMemo(() => {
    const opts = {};
    FILTER_GROUPS.forEach((g) => {
      const map = {};
      results.forEach((item) => {
        g.extract(item).forEach((v) => { if (v) map[v] = (map[v] || 0) + 1; });
      });
      opts[g.key] = Object.entries(map)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count);
    });
    return opts;
  }, [results]);

  const filteredResults = useMemo(() => {
    let arr = results;
    FILTER_GROUPS.forEach((g) => {
      const sel = activeFilters[g.key] || [];
      if (sel.length > 0) arr = arr.filter((item) => g.match(item, sel));
    });
    return sortResults(arr, sortBy);
  }, [results, activeFilters, sortBy]);

  const toggleFilter = (groupKey, value) =>
    setActiveFilters((prev) => {
      const cur = prev[groupKey] || [];
      return { ...prev, [groupKey]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] };
    });

  const clearAll = () => setActiveFilters({});
  const totalActive = Object.values(activeFilters).flat().length;
  const activeFilterPills = Object.entries(activeFilters).flatMap(([gk, vals]) => vals.map((v) => ({ gk, v })));

  const sidebar = (
    <div className="w-full">
      {totalActive > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Active</span>
            <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 font-medium">Clear All</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeFilterPills.map(({ gk, v }) => (
              <span key={`${gk}-${v}`} className="inline-flex items-center gap-1 rounded-full bg-[#1c402f]/10 border border-[#1c402f]/20 px-2.5 py-0.5 text-xs font-medium text-[#1c402f] capitalize">
                {v}
                <button onClick={() => toggleFilter(gk, v)}><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
        </div>
      )}
      {FILTER_GROUPS.map((g) => (
        <FilterGroup
          key={g.key}
          group={g}
          options={filterOptions[g.key] || []}
          selected={activeFilters[g.key] || []}
          onChange={(val) => toggleFilter(g.key, val)}
        />
      ))}
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#f4efe9] pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-12 gap-4">
            <div className="min-w-0">
              {loading ? (
                <p className="text-sm text-gray-500">Searching…</p>
              ) : (
                <p className="text-sm text-gray-700 truncate">
                  <span className="font-bold text-[#457358]">{filteredResults.length}</span>
                  {" "}Results found for{" "}
                  <span className="font-semibold text-[#1c402f]">&ldquo;{query}&rdquo;</span>
                  {totalActive > 0 && (
                    <span className="text-gray-400"> · {totalActive} filter{totalActive > 1 ? "s" : ""} applied</span>
                  )}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Mobile filter button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4 text-[#457358]" />
                Filters
                {totalActive > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1c402f] text-[10px] text-white">{totalActive}</span>
                )}
              </button>

              {/* Sort dropdown */}
              <div className="relative w-full md:w-56">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 text-sm rounded-full py-2.5 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#457358]/40 transition cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-12 items-start">

            {/* Desktop sidebar */}
            <aside className="hidden md:block w-64 shrink-0">
              <div className="bg-white p-5 rounded-[22px] border border-gray-100 shadow-[0_5px_15px_rgba(20,60,47,0.03)]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#143c2f] flex items-center gap-2 mb-2">
                  <SlidersHorizontal className="h-4 w-4 text-[#457358]" /> Filters
                </h3>
                {sidebar}
              </div>
            </aside>

            {/* Product grid */}
            <div className="flex-1 w-full">
              {loading && (
                <div className="text-center py-20 text-gray-400">
                  <Loader2 className="h-8 w-8 animate-spin text-[#457358] mx-auto" />
                </div>
              )}

              {!loading && results.length === 0 && (
                <NoResults
                  query={query}
                  allProducts={allProducts}
                  navigate={navigate}
                  onAddToCart={handleAddToCart}
                  cartLoadingId={cartLoadingId}
                />
              )}

              {!loading && results.length > 0 && filteredResults.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100/60 shadow-sm">
                  <SlidersHorizontal className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm mb-1 font-medium">No products match all filters</p>
                  <p className="text-xs text-gray-400 mb-4">Try removing one or more filters.</p>
                  <button
                    onClick={clearAll}
                    className="rounded-full bg-[#1c402f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2a5c43]"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {!loading && filteredResults.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredResults.map((product) => (
                    <ProductCard
                      key={`${product._id}-${product.variantIndex ?? 0}`}
                      product={product}
                      navigate={navigate}
                      onAddToCart={handleAddToCart}
                      cartLoadingId={cartLoadingId}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      {mobileSidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setMobileSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white px-5 py-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#457358]" /> Filters
              </h2>
              <button onClick={() => setMobileSidebarOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {sidebar}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="mt-6 w-full rounded-full bg-[#1c402f] py-3 text-sm font-semibold text-white transition hover:bg-[#2a5c43]"
            >
              Show {filteredResults.length} Results
            </button>
          </div>
        </>
      )}

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login Required"
        message="Please sign in to add items to your cart."
        redirectPath="/sign-in"
      />

      <Footer />
    </div>
  );
}