import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../Navbar";
import smallLogo from "../../assets/smallLogo.png";
import heroimg from "../../assets/home/herosectionimg.png";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDiscount = (banner) => {
  if (!banner) return "";
  return banner.discountType === "percentage"
    ? `${banner.discount}% Off`
    : `₹${banner.discount} Off`;
};

const isUpcoming = (banner) => new Date() < new Date(banner.startDate);

// ─── Animation variants ───────────────────────────────────────────────────────

const textVariants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const bgVariants = {
  initial: { opacity: 0, scale: 1.03 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Static fallback — pixel-perfect HeroSection2 ────────────────────────────

const StaticFallback = () => (
  <>
    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent z-[1]" />
    <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/20 z-[1]" />

    <motion.div
      animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
      transition={{ duration: 6, repeat: Infinity }}
      className="absolute top-32 right-20 hidden lg:block z-[2]"
    >
      <Leaf className="w-12 h-12 text-[#457358]/30" />
    </motion.div>

    <motion.div
      animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
      transition={{ duration: 5, repeat: Infinity }}
      className="absolute bottom-40 right-40 hidden lg:block z-[2]"
    >
      <Leaf className="w-8 h-8 text-[#457358]/20" />
    </motion.div>

    <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-20">
      <div className="max-w-2xl">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#457358] mb-6 bg-[#457358]/10 px-4 py-2 rounded-full"
        >
          <img src={smallLogo} alt="" className="w-6 h-6" />
          Pure Organic & Natural
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6"
        >
          Nourish Your <br />
          <span className="italic text-[#457358]">Natural</span> Beauty
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-[#a47a6c] text-lg max-w-md leading-relaxed mb-10"
        >
          Handcrafted with ethically sourced botanicals. Our formulas harness
          the power of nature to reveal your skin's true radiance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-4"
        >
          <button className="flex items-center gap-2 px-8 py-3 bg-[#457358] text-white rounded-full shadow-md hover:shadow-lg hover:bg-[#1c402f] transition-all duration-300 group cursor-pointer">
            Shop Collection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex gap-10 mt-16 pt-8 border-t border-gray-300"
        >
          {[["50K+", "Customers"], ["Pure", "Natural"], ["5+", "Awards"]].map(
            ([val, label]) => (
              <div key={label} className="flex flex-col gap-2">
                <p className="text-3xl font-semibold text-gray-900">{val}</p>
                <p className="text-xs uppercase">{label}</p>
              </div>
            )
          )}
        </motion.div>
      </div>
    </div>
  </>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const HeroSection = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/banners`);
        const data = await res.json();
        const now = new Date();
        const live = data
          .filter((b) => b.isActive && !b.deletedAt && now <= new Date(b.endDate))
          .sort((a, b) => a.priority - b.priority);

        setBanners(live);
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const total = banners.length;

  const resetAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (total <= 1) return;

    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
  }, [total]);

  const goTo = useCallback(
    (index, dir) => {
      if (total <= 0) return;
      setDirection(dir);
      setCurrent((index + total) % total);
      resetAutoSlide();
    },
    [total, resetAutoSlide]
  );

  const next = useCallback(() => {
    if (total <= 0) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % total);
    resetAutoSlide();
  }, [total, resetAutoSlide]);

  const prev = useCallback(() => {
    if (total <= 0) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + total) % total);
    resetAutoSlide();
  }, [total, resetAutoSlide]);

  useEffect(() => {
    resetAutoSlide();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetAutoSlide]);

  const banner = banners[current] || null;
  const bgImage = banner?.image?.url || null;
  const upcoming = banner ? isUpcoming(banner) : false;

  if (!loading && total === 0) {
    return (
      <section
        className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat flex flex-col overflow-hidden"
        style={{ backgroundImage: `url(${heroimg})` }}
      >
        <div className="relative z-20">
          <Navbar />
        </div>
        <StaticFallback />
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden bg-[#111a12]">
      {/* Background image per slide */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          key={bgImage || "banner-bg"}
          variants={bgVariants}
          initial="initial"
          animate="animate"
          className="absolute inset-0"
          style={{
            backgroundImage: bgImage ? `url(${bgImage})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/20 z-[1]" />
      </div>

      {/* Gold floating leaves */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-32 right-20 hidden lg:block z-[2]"
      >
        <Leaf className="w-12 h-12 text-[#457358]/30" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-40 right-40 hidden lg:block z-[2]"
      >
        <Leaf className="w-8 h-8 text-[#457358]/30" />
      </motion.div>

      {/* Navbar */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Slide content */}
      <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto px-6 lg:px-8 w-full pt-28 pb-20">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl w-full space-y-4"
          >
            <div className="h-6 w-44 rounded-full bg-white/10 animate-pulse" />
            <div className="h-16 w-3/4 rounded-xl bg-white/10 animate-pulse" />
            <div className="h-16 w-1/2 rounded-xl bg-white/10 animate-pulse" />
            <div className="h-5 w-80 rounded bg-white/10 animate-pulse" />
            <div className="h-5 w-64 rounded bg-white/10 animate-pulse" />
            <div className="h-12 w-44 rounded-full bg-white/10 animate-pulse mt-4" />
          </motion.div>
        )}

        {!loading && banner && (
          <motion.div
            key={banner._id}
            variants={textVariants}
            initial="initial"
            animate="animate"
            className="max-w-2xl w-full"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#457358] mb-6 bg-[#d3dacf] px-4 py-2 rounded-full"
            >
              <img src={smallLogo} alt="" className="w-5 h-5" />
              {formatDiscount(banner)} ·{" "}
              {banner.appliesTo === "all"
                ? "Storewide"
                : banner.appliesTo === "category"
                ? "Selected Categories"
                : "Selected Products"}
            </motion.span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-[#101828] leading-[1.08] mb-5">
              {banner.title}
            </h1>

            {banner.description && (
              <p className="text-[#a47a6c] text-lg max-w-md leading-relaxed mb-5">
                {banner.description}
              </p>
            )}

            {upcoming ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-white border border-white/15 bg-[#d0d3cd] px-4 py-2 rounded-full mb-8"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0f261c] animate-pulse" />
                Starting on{" "}
                {new Date(banner.startDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </motion.p>
            ) : (
              <div className="mb-5" />
            )}

            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 px-8 py-3.5 bg-[#457358] text-[white] rounded-full shadow-xl hover:bg-[#1c402f] transition-all duration-300 group cursor-pointer text-sm tracking-wide">
                {banner.buttonText || "Shop Now"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-10 mt-16 pt-8 border-t border-[#d1d5dc]"
            >
              {[["50K+", "Customers"], ["Pure", "Natural"], ["5+", "Awards"]].map(
                ([val, label]) => (
                  <div key={label} className="flex flex-col gap-1.5">
                    <p className="text-3xl font-semibold text-[#101828]">{val}</p>
                    <p className="text-xs uppercase tracking-widest text-[#101828]">
                      {label}
                    </p>
                  </div>
                )
              )}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Slider controls — only when 2+ banners */}
      {total > 1 && (
        <>
          <div className="absolute bottom-4 left-6 lg:left-10 z-20 flex items-center gap-2">
            <span className="text-[#0f261c] font-bold">
              {String(current + 1).padStart(2, "0")}
            </span>
            <span className="text-[#0f261c] text-xs">
              / {String(total).padStart(2, "0")}
            </span>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-7 h-2 bg-[#0f261c]"
                    : "w-2 h-2 bg-white hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <div className="absolute bottom-4 right-6 lg:right-10 z-20 flex items-center gap-3">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-[#0f261c] flex items-center justify-center text-[#0f261c] hover:border-[#d4a843] hover:text-[#d4a843] hover:bg-[#d4a843]/10 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-[#0f261c] flex items-center justify-center text-[#0f261c] hover:border-[#d4a843] hover:text-[#d4a843] hover:bg-[#d4a843]/10 transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSection;