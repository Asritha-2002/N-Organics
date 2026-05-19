import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import RelatedProducts from "./RelatedProducts";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../../pages/CartContext";
import { useNavigate } from "react-router-dom";
import LoginRequiredModal from "./modal/LoginRequiredModal"
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  Leaf,
  Droplets,
  Package,
  Star,
  FlaskConical,
  CheckCircle2,
  Clock,
  Globe,
  Award,
  Layers,
  Play,
  TicketPercent,
  BadgePercent,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TAG_STYLES = {
  bestseller: "bg-amber-500 text-white",
  new: "bg-teal-500 text-white",
  limited: "bg-rose-500 text-white",
  combo: "bg-indigo-500 text-white",
};

const Pill = ({ children, className = "" }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${className}`}
  >
    {children}
  </span>
);

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

const Accordion = ({
  icon: Icon,
  title,
  children,
  defaultOpen = false,
  accent = "#457358",
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#e7dfd4] rounded-2xl bg-[#faf8f5] overflow-hidden transition hover:border-[#457358]/40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 text-left gap-4"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${accent}18` }}
          >
            <Icon className="h-4 w-4" style={{ color: accent }} />
          </div>
          <span className="text-sm sm:text-base font-semibold text-[#143c2f]">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span
            className="hidden sm:block text-[10px] tracking-[0.2em] uppercase"
            style={{ color: accent }}
          >
            {open ? "Hide" : "Show"}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            style={{ color: accent }}
          />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
    <span className="font-semibold text-[#457358]">
      {average?.toFixed(1) || "0.0"}
    </span>
    <span className="text-gray-400">({count} reviews)</span>
  </div>
);

const VideoModal = ({ video, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl bg-black"
    >
      <video
        src={video.url}
        controls
        autoPlay
        className="w-full max-h-[70vh] object-contain"
      />
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black transition"
      >
        ✕
      </button>
      {video.title && (
        <div className="px-4 py-3 bg-black/80">
          <p className="text-white text-sm font-medium">{video.title}</p>
        </div>
      )}
    </motion.div>
  </motion.div>
);

import AddToCartModal from "./AddToCartModal"; // adjust path as needed
import ProductReviews from "./ProductReviews";
// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { fetchCartCount } = useCart();

  const checkWishlistStatus = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token || !productId) {
        setWishlisted(false);
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/profile/favorites/check/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setWishlisted(response?.data?.isFavorite || false);
    } catch (error) {
      console.error("Wishlist status check failed:", error);
      setWishlisted(false);
    }
  };
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setCurrentImageIndex(0);
    setQuantity(1);

    const token = localStorage.getItem("token");

    // ── Pick route based on auth state ────────────────────────────────────────
    const url = token
      ? `${BASE_URL}/products/auth/${id}`
      : `${BASE_URL}/products/${id}`;

    const headers = token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" };

    fetch(url, { method: "GET", headers })
      .then((r) => r.json())
      .then(async (json) => {
        if (!json.success) throw new Error(json.message || "Product not found");

        setProduct(json.data);
        setRelatedProducts(json.data.relatedProducts || []);

        const def =
          json.data.variants?.find((v) => v.isDefault) ||
          json.data.variants?.[0];
        setSelectedVariant(def || null);

        // Only check wishlist if user is logged in
        if (token) {
          await checkWishlistStatus(json.data._id);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setCurrentImageIndex(0);
  };

  // ── Image logic ────────────────────────────────────────────────────────────
  // Always show product-level images first.
  // If selected variant has its OWN images, append them AFTER product images.
  // Videos are shown only as thumbnails (open modal on click), never in main viewer.
  const productImages = (product?.images || []).map((img) =>
    typeof img === "string" ? img : img.url,
  );

  const variantImages = (selectedVariant?.images || []).map((img) =>
    typeof img === "string" ? img : img.url,
  );

  // Main display pool: product images + selected variant's images (no duplicates)
  const displayImages =
    variantImages.length > 0
      ? [
          ...variantImages,
          ...productImages.filter((url) => !variantImages.includes(url)),
        ]
      : productImages;

  const videos = product?.videos || [];
  const currentPrice = selectedVariant?.price?.sellingPrice ?? null;
  const currentMRP = selectedVariant?.price?.mrp ?? null;
  const discount =
    currentMRP && currentPrice
      ? Math.round((1 - currentPrice / currentMRP) * 100)
      : 0;
  const stockQty = selectedVariant?.stock?.quantity ?? 0;
  const isInCart = selectedVariant?.isPresent || false;
  const sd = product?.skincareDetails || {};
  const availableOffers = (product?.offers || []).filter(
    (offer) => offer?.isAvailable,
  );
  const bestOffer = product?.bestOffer || {};

  const getVariantLabel = (v) =>
    [v.attributes?.size, v.attributes?.shade, v.attributes?.scent]
      .filter(Boolean)
      .join(" · ") || v.sku;

  // ── Free From — normalise and check if truly non-empty ────────────────────
const freeFromList = sd.madeWithoutList
  ? (Array.isArray(sd.madeWithoutList)
      ? sd.madeWithoutList
      : [sd.madeWithoutList]
    )
      .flatMap((item) => item.split(","))
      .map((m) => m.trim())
      .filter(Boolean)
  : [];
  if (loading) {
    return (
      <section className="min-h-screen bg-[#faf8f5] pt-28 sm:pt-32 lg:pt-36 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <Skeleton className="h-5 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Skeleton className="h-[420px] rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="min-h-screen bg-[#faf8f5] pt-36 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
            <Package className="h-7 w-7 text-rose-400" />
          </div>
          <p className="text-[#143c2f] font-semibold text-lg">
            Product not found
          </p>
          <p className="text-gray-400 text-sm">{error}</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#457358] text-white rounded-xl text-sm font-medium hover:bg-[#143c2f] transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Shop
          </Link>
        </div>
      </section>
    );
  }

  const handleToggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
  setShowLoginModal(true);
  return;
}

      if (!product?._id) {
        toast.error("Product not found");
        return;
      }

      setWishlistLoading(true);

      const response = await axios.patch(
        `${BASE_URL}/profile/favorites/toggle`,
        { productId: product._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response?.data?.isFavorite !== undefined) {
        setWishlisted(response.data.isFavorite);

        if (response.data.isFavorite) {
          toast.success("Product added to wishlist");
        } else {
          toast.success("Product removed from wishlist");
        }
      } else {
        // fallback
        setWishlisted((prev) => {
          const updated = !prev;

          toast.success(
            updated
              ? "Product added to wishlist"
              : "Product removed from wishlist",
          );

          return updated;
        });
      }
    } catch (error) {
      console.error("Favorite update error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update favorites",
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!product?._id && !product?.id) {
        toast.error("Product not found");
        return;
      }

      if (!selectedVariant) {
        toast.error("Please select a variant");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
  setShowLoginModal(true);
  return;
}

      const variantIndex = product?.variants?.findIndex(
        (variant) => variant?.sku === selectedVariant?.sku,
      );

      if (variantIndex === -1 || variantIndex === undefined) {
        toast.error("Selected variant is invalid");
        return;
      }

      setCartLoading(true);

      const payload = {
        productId: product?._id || product?.id,
        variantIndex,
        quantity,
      };

      const response = await axios.post(`${BASE_URL}/cart/items`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        response?.data?.message || "Item added to cart successfully",
      );
      await fetchCartCount();
      setShowAddedModal(true);
      setProduct((prev) => ({
        ...prev,
        variants: prev.variants.map((variant) =>
          variant.sku === selectedVariant.sku
            ? { ...variant, isPresent: true }
            : variant,
        ),
      }));

      setSelectedVariant((prev) => ({
        ...prev,
        isPresent: true,
      }));
    } catch (error) {
      if (error?.response?.status === 409) {
        toast.error(
          error?.response?.data?.message || "Product already in cart",
        );
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to add item to cart",
        );
      }

      console.error("Add to cart error:", error);
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      if (!product?._id && !product?.id) {
        toast.error("Product not found");
        return;
      }

      if (!selectedVariant) {
        toast.error("Please select a variant");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
  setShowLoginModal(true);
  return;
}

      const variantIndex = product?.variants?.findIndex(
        (variant) => variant?.sku === selectedVariant?.sku,
      );

      if (variantIndex === -1 || variantIndex === undefined) {
        toast.error("Invalid variant selected");
        return;
      }

      const payload = {
        productId: product?._id || product?.id,
        variantIndex,
        quantity,
      };

      const response = await axios.post(`${BASE_URL}/buy-now`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response?.data?.message || "Proceeding to checkout");

      // navigate to checkout page
      navigate("/checkout");
    } catch (error) {
      console.error("Buy now error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to process buy now",
      );
    }
  };

  return (
    <section className="min-h-screen bg-[#faf8f5] pt-28 sm:pt-32 lg:pt-36 pb-20 text-sm">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 w-full pb-6 overflow-hidden">
        {/* Breadcrumb */}
        <div className="mb-6 px-1 flex flex-col md:flex-row md:items-center md:justify-between text-[#143c2f] font-medium text-xs md:text-sm gap-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 hover:text-[#457358] transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Shop
          </Link>
          <span className="text-gray-400 text-right">
            Shop / {product.category}
            {product.subCategory ? ` / ${product.subCategory}` : ""} /{" "}
            <span className="text-[#457358]">{product.name}</span>
          </span>
        </div>

        {/* ── Main Grid ── */}
       <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 sm:gap-8 lg:gap-10 xl:gap-14 items-start">
          {/* ── LEFT: Images ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 xl:sticky xl:top-28 self-start"
          >
            {/* Main image viewer */}
            <div className="relative h-[300px] xs:h-[340px] sm:h-[420px] md:h-[500px] lg:h-[420px] xl:h-[520px] rounded-3xl overflow-hidden shadow-md bg-white border border-gray-100 flex items-center justify-center group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${selectedVariant?.sku}-${currentImageIndex}`}
                  src={displayImages[currentImageIndex]}
                  alt={product.name}
                  className="h-full w-full object-contain p-2 sm:p-4"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>

              {/* Tag badge */}
              {/* ── Tag badges: product-level + variant-level, deduped ── */}
              {(() => {
                const badges = [];

                // 1. Product-level tag (string)
                if (product.tag) {
                  badges.push({
                    label: product.tag,
                    style:
                      TAG_STYLES[product.tag?.toLowerCase()] ||
                      "bg-gray-500 text-white",
                  });
                }

                // 2. Variant-level boolean flags — only add if not already shown via product.tag
                const v = selectedVariant;
                const alreadyHas = (label) =>
                  badges.some(
                    (b) => b.label.toLowerCase() === label.toLowerCase(),
                  );

                if (v?.isFeatured && !alreadyHas("featured")) {
                  badges.push({
                    label: "Featured",
                    style: "bg-amber-500 text-white",
                  });
                }
                if (v?.isBestseller && !alreadyHas("bestseller")) {
                  badges.push({
                    label: "Bestseller",
                    style: TAG_STYLES.bestseller,
                  });
                }
                if ((v?.isNewest || v?.isNewArrival) && !alreadyHas("new")) {
                  badges.push({ label: "New", style: TAG_STYLES.new });
                }
                if (v?.isLimited && !alreadyHas("limited")) {
                  badges.push({ label: "Limited", style: TAG_STYLES.limited });
                }

                if (badges.length === 0) return null;

                return (
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    {badges.map((b) => (
                      <span
                        key={b.label}
                        className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${b.style}`}
                      >
                        {b.label}
                      </span>
                    ))}
                  </div>
                );
              })()}

              {/* Variant image badge — only when showing a variant-specific image */}
              {currentImageIndex >= productImages.length &&
                variantImages.length > 0 && (
                  <span className="absolute top-4 right-4 px-2.5 py-1 text-[10px] font-bold rounded-full bg-[#457358]/10 text-[#457358] border border-[#457358]/20 uppercase tracking-wider">
                    {getVariantLabel(selectedVariant)}
                  </span>
                )}

              {!product.isActive && (
                <span className="absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full bg-gray-200 text-gray-500 uppercase tracking-wider">
                  Unavailable
                </span>
              )}

              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((p) =>
                        p === 0 ? displayImages.length - 1 : p - 1,
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-2.5 rounded-full shadow-md border border-gray-100 transition opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((p) =>
                        p === displayImages.length - 1 ? 0 : p + 1,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-2.5 rounded-full shadow-md border border-gray-100 transition opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-700" />
                  </button>
                </>
              )}

              {displayImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {displayImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${i === currentImageIndex ? "w-5 bg-[#457358]" : "w-1.5 bg-gray-300"}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── Thumbnail strip ──────────────────────────────────────────────
                Order:
                1. All product.images  (always shown, no matter which variant)
                2. Selected variant's own images (if any, with a subtle label)
                3. Product videos  (open modal on click)
            ─────────────────────────────────────────────────────────────────── */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide w-full">
              {/* 1️⃣  Variant images first (if selected variant has its own) */}
              {variantImages.map((url, i) => (
                <motion.button
                  key={`var-img-${i}`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden transition-all relative ${
                    currentImageIndex === i
                      ? "border-[#457358] shadow-md"
                      : "border-[#457358]/30 hover:border-[#457358]"
                  }`}
                >
                  <img
                    src={url}
                    alt={`Variant ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-[#457358] border border-white" />
                </motion.button>
              ))}

              {/* 2️⃣  Product images that aren't already shown via variant */}
              {productImages
                .filter((url) => !variantImages.includes(url))
                .map((url, i) => {
                  const globalIdx = variantImages.length + i;
                  return (
                    <motion.button
                      key={`prod-img-${i}`}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentImageIndex(globalIdx)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden transition-all ${
                        currentImageIndex === globalIdx
                          ? "border-[#457358] shadow-md"
                          : "border-gray-200 hover:border-[#457358]/50"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Product ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  );
                })}

              {/* 3️⃣  Video thumbnails — click opens modal */}
              {videos.map((vid, i) => (
                <motion.button
                  key={`vid-${i}`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveVideo(vid)}
                  title={vid.title || "Product Video"}
                  className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-[#457358]/30 overflow-hidden transition-all hover:border-[#457358] relative group bg-[#143c2f]"
                >
                  <video
                    src={vid.url}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow">
                      <Play className="w-3 h-3 text-[#143c2f] fill-[#143c2f] ml-0.5" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* ── Variant visual strip ── */}
            {product.variants?.length > 1 && (
              <div className="bg-white border border-[#e7dfd4] rounded-2xl p-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  All Variants
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.sku === v.sku;
                    const hasVarImg = v.images?.length > 0;
                    // Use variant's own thumb if it has images, else first product image
                    const thumb = hasVarImg
                      ? typeof v.images[0] === "string"
                        ? v.images[0]
                        : v.images[0].url
                      : productImages[0];
                    return (
                      <motion.button
                        key={v.sku}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleVariantSelect(v)}
                        disabled={!v.isActive || v.stock?.quantity === 0}
                        className={`relative flex flex-col items-center gap-1.5 p-2 rounded-2xl border-2 transition-all w-[64px] sm:w-[72px] md:w-[78px] group
                          ${isSelected ? "border-[#457358] bg-[#457358]/5 shadow-md" : "border-gray-200 hover:border-[#457358]/50 bg-white"}
                          ${!v.isActive || v.stock?.quantity === 0 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl overflow-hidden border ${isSelected ? "border-[#457358]/30" : "border-gray-100"}`}
                        >
                          <img
                            src={thumb}
                            alt={v.sku}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p
                          className={`text-[9px] font-semibold text-center leading-tight truncate w-full ${isSelected ? "text-[#457358]" : "text-gray-600"}`}
                        >
                          {[v.attributes?.size, v.attributes?.shade]
                            .filter(Boolean)
                            .join(" · ") || v.sku}
                        </p>
                        <p
                          className={`text-[9px] font-bold ${isSelected ? "text-[#457358]" : "text-gray-500"}`}
                        >
                          ₹{v.price?.sellingPrice}
                        </p>
                        {v.stock?.quantity === 0 && (
                          <span className="absolute top-1 right-1 text-[8px] bg-gray-200 text-gray-500 px-1 py-0.5 rounded font-bold">
                            OOS
                          </span>
                        )}

                        {(() => {
                          let label = null;
                          let style = "";
                          if (v.isFeatured) {
                            label = "★";
                            style = "bg-amber-500 text-white";
                          } else if (v.isBestseller) {
                            label = "Best";
                            style = "bg-[#129b6f] text-white";
                          } else if (v.isNewest || v.isNewArrival) {
                            label = "New";
                            style = "bg-[#12988f] text-white";
                          } else if (v.isLimited) {
                            label = "Ltd";
                            style = "bg-rose-500 text-white";
                          }

                          if (!label) return null;
                          return (
                            <span
                              className={`absolute top-1 left-1 text-[8px] px-1.5 py-0.5 rounded font-bold ${style}`}
                            >
                              {label}
                            </span>
                          );
                        })()}
                        {isSelected && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#457358] flex items-center justify-center shadow">
                            <CheckCircle2 className="w-3 h-3 text-white fill-white" />
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* ── RIGHT: Details ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6 min-w-0"
          >
            {/* Category + Brand */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#457358]/10 text-[#457358] px-2.5 py-1 rounded-md text-xs tracking-wider uppercase font-semibold">
                {product.category}
              </span>
              {product.subCategory && (
                <span className="bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md text-xs tracking-wider uppercase">
                  {product.subCategory}
                </span>
              )}
              <span className="text-gray-300">·</span>
              <span className="text-gray-500 text-xs">{product.brand}</span>
            </div>

            {/* Name + Rating */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#143c2f] leading-tight mb-3">
                {product.name}
              </h1>
              <StarRating
                average={product.ratings?.average}
                count={product.ratings?.count}
              />
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <p className="text-gray-600 leading-relaxed text-sm border-l-2 border-[#457358]/30 pl-4">
                {product.shortDescription}
              </p>
            )}

            {/* Highlights */}
            {product.highlights?.filter(Boolean).length > 0 && (
              <ul className="space-y-1.5">
                {product.highlights.filter(Boolean).map((h, i) => (
                  <li
  key={i}
  className="flex items-start gap-2 text-sm text-[#284a39] bg-[#457358]/8 border border-[#457358]/15 px-3 py-2 rounded-xl font-medium"
>
  <span className="w-1.5 h-1.5 rounded-full bg-[#457358] mt-2 shrink-0" />
  <span>{h}</span>
</li>
                ))}
              </ul>
            )}

            {/* Selected variant info card */}
            {selectedVariant && (
              <motion.div
                key={selectedVariant.sku}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-[#e7dfd4] rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Selected Product
                  </p>
                  <span className="text-[10px] font-bold text-[#457358] bg-[#457358]/10 px-2 py-0.5 rounded-full">
                    {selectedVariant.sku}
                  </span>
                </div>
                {Object.entries(selectedVariant.attributes || {})
                  .filter(([, v]) => v && v !== "" && v !== 0)
                  .map(([key, val]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-400 capitalize">{key}</span>
                      <span className="font-semibold text-[#143c2f] capitalize">
                        {val}
                      </span>
                    </div>
                  ))}
                {selectedVariant.weight?.value > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Net Weight</span>
                    <span className="font-semibold text-[#143c2f]">
                      {selectedVariant.weight.value}{" "}
                      {selectedVariant.weight.unit}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Variant selector pills */}
            {product.variants?.length > 1 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Select Quantity
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const active = selectedVariant?.sku === v.sku;
                    return (
                      <button
                        key={v.sku}
                        onClick={() => handleVariantSelect(v)}
                        disabled={!v.isActive || v.stock?.quantity === 0}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          active
                            ? "bg-[#457358] text-white border-[#457358] shadow-sm"
                            : "bg-white text-[#143c2f] border-gray-200 hover:border-[#457358]/50"
                        } ${!v.isActive || v.stock?.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {getVariantLabel(v)}
                        {v.stock?.quantity === 0 && (
                          <span className="ml-1 text-[9px]">(OOS)</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pricing */}
            {currentPrice !== null && (
              <motion.div
                key={`price-${selectedVariant?.sku}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-baseline gap-3"
              >
                <span className="text-3xl font-bold text-[#457358]">
                  ₹{currentPrice}
                </span>
                {currentMRP > currentPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{currentMRP}
                    </span>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                      {discount}% OFF
                    </span>
                  </>
                )}
                <span className="text-xs text-gray-400 ml-auto">
                  (Incl. of all taxes)
                </span>
              </motion.div>
            )}
            {bestOffer && bestOffer.discount > 0 && (
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
                  bestOffer.discountType === "percentage"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                <span>
                  {bestOffer.discountType === "percentage" ? (
                    <TicketPercent className="w-4 h-4" />
                  ) : (
                    <BadgePercent className="w-4 h-4" />
                  )}
                </span>
                <span>
                  Best Offer:{" "}
                  {bestOffer.discountType === "percentage"
                    ? `${bestOffer.discount}% off`
                    : `Flat ₹${bestOffer.discount} off`}
                </span>
              </div>
            )}

            {/* Stock indicator */}
            {selectedVariant && (
              <div
                className={`flex items-center gap-2 text-xs font-semibold ${
                  stockQty > 10
                    ? "text-emerald-600"
                    : stockQty > 5
                      ? "text-amber-500"
                      : stockQty > 0
                        ? "text-rose-500"
                        : "text-gray-500"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    stockQty > 10
                      ? "bg-emerald-500"
                      : stockQty > 5
                        ? "bg-amber-400"
                        : stockQty > 0
                          ? "bg-rose-400"
                          : "bg-gray-400"
                  }`}
                />

                {stockQty > 10 ? (
                  <>
                    <span className="font-bold">{stockQty}</span> in stock
                  </>
                ) : stockQty > 5 ? (
                  <>
                    Only <span className="font-bold">{stockQty}</span> left!
                  </>
                ) : stockQty > 0 ? (
                  <>
                    Only <span className="font-bold">{stockQty}</span>{" "} left!
                  </>
                ) : (
                  "Out of Stock"
                )}
              </div>
            )}

            {/* Quantity + Actions */}
            <div className="space-y-3 border-t border-gray-200/50 pt-5">
              <div className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl border border-gray-200/50 shadow-sm">
                <span className="text-sm text-[#143c2f] font-medium">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                    className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200/60 flex items-center justify-center transition"
                  >
                    <Minus className="h-3.5 w-3.5 text-gray-600" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-[#143c2f]">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((p) => Math.min(stockQty || 99, p + 1))
                    }
                    disabled={quantity >= stockQty}
                    className="w-8 h-8 rounded-lg bg-[#457358] hover:bg-[#143c2f] disabled:opacity-40 flex items-center justify-center transition text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {isInCart ? (
                  <Link
                    to="/cart"
                    className="cursor-pointer w-full flex items-center justify-center gap-2 bg-[#143c2f] hover:bg-[#0f2c22] text-white py-3.5 px-6 rounded-2xl shadow-sm transition text-sm font-semibold"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Go to Cart
                  </Link>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={stockQty === 0 || cartLoading}
                    className="cursor-pointer w-full flex items-center justify-center gap-2 bg-[#457358] hover:bg-[#143c2f] disabled:opacity-50 text-white py-3.5 px-6 rounded-2xl shadow-sm transition text-sm font-semibold"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {cartLoading ? "Adding..." : "Add to Cart"}
                  </button>
                )}
                <button
                  onClick={handleBuyNow}
                  disabled={stockQty === 0}
                  className="cursor-pointer w-full py-3.5 px-6 rounded-2xl text-sm font-semibold bg-[#c8fec0] hover:bg-[#a8f0a0] disabled:opacity-50 text-[#143c2f] transition"
                >
                  Buy Now
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex gap-2">
                  {[
                    {
                      icon: Truck,
                      label: "Free Delivery",
                      show: product.isFreeShipping,
                    },
                    { icon: ShieldCheck, label: "Certified", show: true },
                    { icon: Leaf, label: "Natural", show: true },
                  ]
                    .filter((b) => b.show)
                    .map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white border border-gray-100 shadow-sm text-[10px] text-[#143c2f]"
                      >
                        <Icon className="h-4 w-4 text-[#457358]" />
                        {label}
                      </div>
                    ))}
                </div>
                <button
                  onClick={handleToggleFavorite}
                  disabled={wishlistLoading}
                  className={`p-3 rounded-full border shadow-sm transition disabled:opacity-60 ${
                    wishlisted
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-white border-gray-200 hover:bg-[#457358]/5"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 transition ${
                      wishlisted
                        ? "fill-emerald-600 text-emerald-600"
                        : "text-[#457358]"
                    } ${wishlistLoading ? "animate-pulse" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Skincare meta pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              {sd.skinType?.map((s) => (
                <Pill
                  key={s}
                  className="bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  {s} skin
                </Pill>
              ))}
              {sd.claims?.slice(0, 4).map((c) => (
                <Pill key={c} className="bg-sky-50 text-sky-700 border-sky-200">
                  {c}
                </Pill>
              ))}
              {product.packaging?.isRecyclable && (
                <Pill className="bg-green-50 text-green-700 border-green-200">
                  ♻ Recyclable
                </Pill>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── About Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 bg-white rounded-3xl border border-[#e7dfd4] p-6 sm:p-8 shadow-sm space-y-5"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#284a39]">
            About This Product
          </h2>

          {product.description && (
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {product.description}
            </p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              {
                icon: Clock,
                label: "Shelf Life",
                value: sd.shelfLife?.months
                  ? `${sd.shelfLife.months} months`
                  : null,
              },
              { icon: Globe, label: "Origin", value: sd.countryOfOrigin },
              {
                icon: Layers,
                label: "Variants",
                value: product.variants?.length
                  ? `${product.variants.length} options`
                  : null,
              },
              { icon: Award, label: "HSN Code", value: product.hsn || null },
            ]
              .filter((s) => s.value)
              .map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="bg-[#faf8f5] rounded-2xl p-4 border border-[#e7dfd4]"
                >
                  <Icon className="h-4 w-4 text-[#457358] mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-[#143c2f]">
                    {value}
                  </p>
                </div>
              ))}
          </div>
          <div className="space-y-3 pt-2">
            {availableOffers?.length > 0 && (
              <Accordion icon={Award} title="Available Offers">
                <div className="space-y-3">
                  {availableOffers.map((offer) => (
                    <div
                      key={offer.bannerId}
                      className="bg-white rounded-xl p-3 border border-[#e7dfd4]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#143c2f]">
                            {offer.title}
                          </p>
                          {offer.description && (
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                              {offer.description}
                            </p>
                          )}
                        </div>

                        <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {offer.discountType === "percentage"
                            ? `${offer.discount}% OFF`
                            : `₹${offer.discount} OFF`}
                        </span>
                      </div>

                      <p className="text-[10px] text-gray-400 mt-2">
                        Valid till{" "}
                        {new Date(offer.endDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </Accordion>
            )}
          </div>

          <div className="space-y-3 pt-2">
            {sd.usage?.howToUse && (
              <Accordion icon={Sparkles} title="How To Use" defaultOpen>
                <p className="text-sm text-[#7d756a] leading-relaxed">
                  {sd.usage.howToUse}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  {sd.usage.frequency && (
                    <div className="bg-white rounded-xl p-3 border border-[#e7dfd4]">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                        Frequency
                      </p>
                      <p className="text-sm font-semibold text-[#143c2f]">
                        {sd.usage.frequency}
                      </p>
                    </div>
                  )}
                  {sd.usage.whenToApply && (
                    <div className="bg-white rounded-xl p-3 border border-[#e7dfd4]">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                        When
                      </p>
                      <p className="text-sm font-semibold text-[#143c2f]">
                        {sd.usage.whenToApply}
                      </p>
                    </div>
                  )}
                  {sd.usage.amountToUse && (
                    <div className="bg-white rounded-xl p-3 border border-[#e7dfd4]">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                        Amount
                      </p>
                      <p className="text-sm font-semibold text-[#143c2f]">
                        {sd.usage.amountToUse}
                      </p>
                    </div>
                  )}
                </div>
              </Accordion>
            )}

            {sd.skinConcerns?.length > 0 && (
              <Accordion icon={Droplets} title="Skin Concerns Addressed">
                <div className="flex flex-wrap gap-2">
                  {sd.skinConcerns.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 capitalize"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Accordion>
            )}

            {product.ingredients?.length > 0 && (
            <Accordion icon={FlaskConical} title="Ingredients">
  {product.ingredients?.length > 0 ? (
    <>
      {/* INGREDIENTS WITH IMAGE */}
      {product.ingredients.filter((ing) => ing.image?.url).length > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#143c2f]">
              Featured Ingredients
            </h3>
            <span className="text-xs text-[#6f7f77]">Swipe to explore</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth scrollbar-hide">
            {product.ingredients
              .filter((ing) => ing.image?.url)
              .map((ing, i) => (
                <div
                  key={i}
                  className="snap-start shrink-0 w-[240px] sm:w-[260px] md:w-[280px] rounded-2xl overflow-hidden border border-[#e7dfd4] bg-white shadow-sm"
                >
                  <div className="aspect-[4/3] w-full bg-[#f8f6f2]">
                    <img
                      src={ing.image.url}
                      alt={ing.image.altText || ing.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-bold text-[#143c2f] line-clamp-1">
                      {ing.name}
                    </h3>

                    {ing.description ? (
                      <p className="mt-2 min-h-[72px] text-sm leading-6 text-[#457358] line-clamp-3">
                        {ing.description}
                      </p>
                    ) : (
                      <p className="mt-2 min-h-[72px] text-sm italic text-gray-400">
                        No description available.
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* INGREDIENTS WITHOUT IMAGE */}
      {product.ingredients.filter((ing) => !ing.image?.url).length > 0 && (
        <div className="rounded-2xl border border-[#e7dfd4] bg-[#fcfaf7] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#143c2f]">
              More Ingredients
            </h3>

            {/* Always show the button so users can toggle visibility */}
            <button
              type="button"
              onClick={() => setShowAllIngredients(!showAllIngredients)}
              className="rounded-full border border-[#d8cec1] bg-white px-4 py-2 text-xs font-semibold text-[#143c2f] transition hover:bg-[#f3eee8]"
            >
              {showAllIngredients ? "See Less" : "See More"}
            </button>
          </div>

          {/* This grid will now only mount/render if showAllIngredients is true */}
          {showAllIngredients && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {product.ingredients
                .filter((ing) => !ing.image?.url)
                .map((ing, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-[#eee5da] bg-white p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f8f1ea]">
                        <FlaskConical className="h-5 w-5 text-[#c78b6d]" />
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-[#143c2f]">
                          {ing.name}
                        </h4>

                        {ing.description ? (
                          <p className="mt-1 text-sm leading-6 text-[#5f746b] line-clamp-3">
                            {ing.description}
                          </p>
                        ) : (
                          <p className="mt-1 text-sm italic text-gray-400">
                            No description available.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </>
  ) : (
    <div className="py-10 text-center text-sm text-gray-400">
      No ingredients available.
    </div>
  )}
</Accordion>
            )}

            {sd.claims?.length > 0 && (
              <Accordion icon={CheckCircle2} title="Claims & Certifications">
                <div className="flex flex-wrap gap-2">
                  {sd.claims.map((c) => (
                    <span
                      key={c}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 capitalize"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {c}
                    </span>
                  ))}
                </div>
                {sd.certifications?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(Array.isArray(sd.certifications)
                      ? sd.certifications
                      : sd.certifications.split(",")
                    ).map((c, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"
                      >
                        <Award className="h-3 w-3" />
                        {c.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </Accordion>
            )}

            {/* ✅ Free From — only renders when list is truly non-empty */}
            {freeFromList.length > 0 && (
              <Accordion icon={Leaf} title="Free From">
                <div className="flex flex-wrap gap-2">
                  {freeFromList.map((m, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl  font-semibold bg-green-50 text-green-700 border border-green-200 capitalize"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </Accordion>
            )}

            {product.packaging?.type && (
              <Accordion icon={Package} title="Packaging & Shipping">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Type", value: product.packaging.type },
                    { label: "Material", value: product.packaging.material },
                    {
                      label: "Shipping Weight",
                      value: product.packaging.shippingWeight
                        ? `${product.packaging.shippingWeight}g`
                        : null,
                    },
                    {
                      label: "Dimensions",
                      value: product.packaging.dimensions?.length
                        ? `${product.packaging.dimensions.length}×${product.packaging.dimensions.width}×${product.packaging.dimensions.height} cm`
                        : null,
                    },
                    {
                      label: "Recyclable",
                      value: product.packaging.isRecyclable ? "Yes ♻" : null,
                    },
                    {
                      label: "GST",
                      value: product.taxRate ? `${product.taxRate}%` : null,
                    },
                  ]
                    .filter((r) => r.value)
                    .map(({ label, value }) => (
                      <div
                        key={label}
                        className="bg-white rounded-xl p-3 border border-[#e7dfd4]"
                      >
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                          {label}
                        </p>
                        <p className="text-sm font-semibold text-[#143c2f] capitalize">
                          {value}
                        </p>
                      </div>
                    ))}
                </div>
              </Accordion>
            )}
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <VideoModal
            video={activeVideo}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>

      <RelatedProducts relatedProducts={relatedProducts} />
      <AddToCartModal
        open={showAddedModal}
        onClose={() => setShowAddedModal(false)}
        product={product}
        selectedVariant={selectedVariant}
        quantity={quantity}
        bestOffer={bestOffer}
      />
      <ProductReviews productId={product?._id || product?.id} />
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
