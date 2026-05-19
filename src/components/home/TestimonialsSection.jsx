import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import smallLogo from "../../assets/smallLogo.png";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // ─── Fetch Reviews ─────────────────────────────────────────────
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${BASE_URL}/reviews`);
        const json = await res.json();

        if (json.success) {
          setReviews(json.reviews || []);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // ─── Loading State ─────────────────────────────────────────────
  if (loading) {
    return (
      <section className="py-24 bg-[#faf8f5] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#244736]">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg font-semibold">
            Loading testimonials...
          </span>
        </div>
      </section>
    );
  }

  // ─── Empty State ───────────────────────────────────────────────
  if (!reviews.length) {
    return null;
  }

  const next = () => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const review = reviews[current];

  return (
    <section
      id="testimonials"
      className="relative py-24 bg-[#faf8f5] overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-64 h-64 border border-gray-200 rounded-full" />
      <div className="absolute bottom-10 right-10 w-40 h-40 border border-gray-300 rounded-full" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-40 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#587645]">
            Customer Love
          </span>

          <h2 className="flex items-center justify-center gap-3 text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-3">
            <img src={smallLogo} alt="" className="w-10 h-10 mt-2" />
            What They{" "}
            <span className="italic text-[#244736] font-normal">
              Say
            </span>
          </h2>
        </motion.div>

        {/* Review Card */}
        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-10 md:p-14 shadow-xl border border-gray-200"
            >

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? "text-[#d2e16a] fill-[#d2e16a]"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Headline */}
              {review.headline && (
                <h3 className="text-2xl font-bold text-[#244736] mb-4">
                  {review.headline}
                </h3>
              )}

              {/* Review */}
              <p className="text-xl md:text-2xl text-gray-800 leading-relaxed italic">
                "{review.review}"
              </p>

              {/* Author */}
              <div className="mt-8 flex items-center gap-4">
                {/* Profile Image */}
                {review.user?.profileImage ? (
                  <img
                    src={review.user.profileImage}
                    alt={review.user.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#244736] flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {review.user?.name?.charAt(0)}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-gray-900">
                      {review.user?.name}
                    </p>

                    {review.user?.isVerified && (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase tracking-wide">
                        Verified
                      </span>
                    )}
                  </div>

                  {review.isVerifiedPurchase && (
                    <p className="text-sm text-[#457358] font-medium">
                      Verified Purchase
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {reviews.length > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              {/* Prev */}
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-[#d2e16a] hover:border-[#d2e16a] transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Indicators */}
              <div className="flex items-center gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-8 h-2 bg-[#d2e16a]"
                        : "w-2 h-2 bg-gray-300 hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>

              {/* Next */}
              <button
                onClick={next}
                className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-[#d2e16a] hover:border-[#d2e16a] transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}