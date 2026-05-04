import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import smallLogo from "../../assets/smallLogo.png"

const STATIC_TESTIMONIALS = [
  {
    id: 1,
    customer_name: "Sophia Martinez",
    review:
      "I've tried countless skincare brands, but Botánica is truly different. The Botanical Face Serum transformed my skin in just two weeks. The texture, the scent, the results — everything feels luxurious and pure.",
    rating: 5,
    product_purchased: "Botanical Face Serum",
  },
  {
    id: 2,
    customer_name: "Aisha Patel",
    review:
      "As someone with sensitive skin, finding the right products has always been a struggle. Botánica's Herbal Day Cream is gentle yet incredibly effective. My skin has never felt this calm and radiant.",
    rating: 5,
    product_purchased: "Herbal Day Cream",
  },
  {
    id: 3,
    customer_name: "Emma Richardson",
    review:
      "The Body Elixir Oil is absolute heaven. It absorbs quickly, smells divine, and leaves my skin glowing all day. I've recommended it to everyone I know. Truly a game-changer!",
    rating: 5,
    product_purchased: "Body Elixir Oil",
  },
];

export default function TestimonialsSection({ testimonials = [] }) {
  const reviews = testimonials.length > 0 ? testimonials : STATIC_TESTIMONIALS;
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % reviews.length);
  const prev = () => setCurrent((current - 1 + reviews.length) % reviews.length);

  const review = reviews[current];

  return (
    <section id="testimonials" className="relative py-24 bg-[#faf8f5] overflow-hidden">
      
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
  <span className="italic text-[#244736] font-normal">Say</span>
</h2>
        </motion.div>

        {/* Card */}
        <div className="relative max-w-3xl mx-auto">
          
          {/* Quote Icon */}
          {/* <Quote className="absolute -top-6 -left-6 w-16 h-16 text-[#d2e16a]/10" /> */}

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-10 md:p-14 shadow-xl border border-gray-200"
            >
              
              {/* Hearts */}
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

              {/* Review */}
              <p className="text-xl md:text-2xl text-gray-800 leading-relaxed italic">
                "{review.review}"
              </p>

              {/* Author */}
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#244736] flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {review.customer_name?.charAt(0)}
                  </span>
                </div>

                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {review.customer_name}
                  </p>

                  {review.product_purchased && (
                    <p className="text-sm text-gray-500">
                      Purchased: {review.product_purchased}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-[#d2e16a] hover:border-[#d2e16a] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

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

            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-[#d2e16a] hover:border-[#d2e16a] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}