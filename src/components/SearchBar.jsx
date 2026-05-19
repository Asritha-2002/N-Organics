import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function SearchBar({ scrolled, onClose, isMobile = false }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Focus input on mount
  useEffect(() => {
    if (!isMobile) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isMobile]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchResults = useCallback(
    debounce(async (q) => {
      if (!q || q.trim().length < 2) {
        setResults([]);
        setLoading(false);
        setOpen(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_URL}/products/search?q=${encodeURIComponent(q.trim())}&limit=6`
        );
        const data = await res.json();
        if (data.success) {
          setResults(data.data);
          setOpen(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length >= 2) {
      setLoading(true);
      fetchResults(val);
    } else {
      setResults([]);
      setOpen(false);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      setOpen(false);
      onClose?.();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    if (e.key === "Escape") {
      setOpen(false);
      onClose?.();
    }
  };

  const handleResultClick = (item) => {
  setOpen(false);
  setQuery("");
  onClose?.();
  navigate(`/product/${item._id}`);
};

  const handleSearchSubmit = () => {
    if (query.trim()) {
      setOpen(false);
      onClose?.();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  /* ── styles ── */
const inputBg = isMobile
  ? "bg-[#f4efe9] text-[#143c2f] placeholder:text-[#457358]/50 border-[#457358]/20"
  : scrolled
  ? "bg-[#f4efe9] text-[#143c2f] placeholder:text-[#457358]/50 border-[#457358]/20"
  : "bg-white text-gray-800 placeholder:text-gray-500 border-gray-300/50";

  const iconColor = isMobile
    ? "[#457358]/50"
    : scrolled
    ? "text-[#457358]/50"
    : "text-gray-500";

  const clearColor = isMobile
    ? "text-white/60 hover:text-white"
    : scrolled
    ? "text-white/60 hover:text-white"
    : "text-gray-400 hover:text-gray-700";

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Input row */}
      <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-200 ${inputBg}`}>
        {loading ? (
          <Loader2 className={`h-4 w-4 animate-spin shrink-0 ${iconColor}`} />
        ) : (
          <Search className={`h-4 w-4 shrink-0 ${iconColor}`} />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search products…"
          className="flex-1 bg-transparent text-sm outline-none min-w-0"
          autoComplete="off"
        />
        {query && (
          <button onClick={handleClear} className={`shrink-0 transition ${clearColor}`}>
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#1c402f] shadow-2xl">
          {results.map((item) => (
            <button
              key={item._id}
              onClick={() => handleResultClick(item)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/10"
            >
              {/* Product image */}
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/10">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Search className="h-4 w-4 text-white/30" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{item.name}</p>
                <p className="truncate text-xs text-white/50">{item.brand} · {item.category}</p>
              </div>

              {/* Price */}
              {item.sellingPrice > 0 && (
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-[#d2e16a]">
                    ₹{item.sellingPrice}
                  </p>
                  {item.mrp > item.sellingPrice && (
                    <p className="text-xs text-white/40 line-through">₹{item.mrp}</p>
                  )}
                </div>
              )}
            </button>
          ))}

          {/* View all results footer */}
          <button
            onClick={handleSearchSubmit}
            className="flex w-full items-center justify-center gap-2 border-t border-green/10 px-4 py-3 text-sm text-[#d2e16a] transition hover:bg-white/10"
          >
            <Search className="h-3.5 w-3.5" />
            View all results for &quot;{query}&quot;
          </button>
        </div>
      )}

      {/* No results */}
      {open && !loading && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-[100] mt-2 rounded-2xl border border-white/10 bg-[#1c402f] px-4 py-4 text-center shadow-2xl">
          <p className="text-sm text-white/50">No products found for &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}