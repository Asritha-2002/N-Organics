import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets,
  Sun,
  Shield,
  Sparkles,
  Truck,
  RotateCcw,
  Award,
} from "lucide-react";
import video from "../../assets/home/video.mp4";

const INGREDIENTS_IMG = video;

const ingredients = [
  {
    id: 1,
    name: "Rosehip Oil",
    icon: Droplets,
    description:
      "Rich in vitamins A & C, rosehip oil deeply hydrates while reducing fine lines and dark spots for a luminous complexion.",
    benefit: "Anti-aging & Brightening",
  },
  {
    id: 2,
    name: "Raw Honey",
    icon: Sun,
    description:
      "A natural humectant packed with antioxidants, raw honey locks in moisture and soothes inflammation for supple, calm skin.",
    benefit: "Hydrating & Soothing",
  },
  {
    id: 3,
    name: "Green Tea Extract",
    icon: Shield,
    description:
      "Loaded with polyphenols, green tea shields skin from environmental damage and reduces redness for a clear, even tone.",
    benefit: "Protective & Calming",
  },
  {
    id: 4,
    name: "Turmeric Root",
    icon: Sparkles,
    description:
      "Curcumin-rich turmeric brightens dull skin, fades hyperpigmentation, and delivers powerful anti-inflammatory benefits.",
    benefit: "Brightening & Healing",
  },
];

const highlights = [
  {
    id: 1,
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On orders above $50",
  },
  {
    id: 2,
    icon: RotateCcw,
    title: "30-Day Returns",
    subtitle: "Hassle-free returns",
    active: true,
  },
  {
    id: 3,
    icon: Shield,
    title: "Dermatologist Tested",
    subtitle: "Safe for all skin types",
  },
  {
    id: 4,
    icon: Award,
    title: "Award Winning",
    subtitle: "Voted #1 organic brand",
  },
];

export default function IngredientsSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="ingredients" className="bg-[#faf8f5] pt-12 sm:pt-20 lg:pt-28 pb-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Video / Graphic Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-[4/3] sm:aspect-video lg:aspect-[4/5] xl:aspect-[5/4] shadow-sm"
          >
            <video
              src={INGREDIENTS_IMG}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />
          </motion.div>

          {/* Text & Accordion Content */}
          <div className="min-w-0">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="mb-3 block text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#587645] font-semibold sm:mb-4"
            >
              Pure Ingredients
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="mb-8 text-3xl font-light leading-tight text-[#1c402f] sm:mb-10 sm:text-4xl lg:text-5xl"
            >
              Nature&apos;s Most
              <br />
              <span className="italic font-medium text-[#457358]">Potent Botanicals</span>
            </motion.h2>

            <div className="space-y-3 sm:space-y-4">
              {ingredients.map((item, index) => {
                const Icon = item.icon;
                const isActive = active === index;

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(index)}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.08 }}
                    className={`w-full rounded-[18px] border px-4 py-4 text-left transition-all duration-300 sm:px-5 sm:py-5 cursor-pointer ${
                      isActive
                        ? "border-[#457358] bg-[#f0f1ed] shadow-sm"
                        : "border-[#e5dfd3] bg-[#fbf8f2] hover:border-[#c9cbc8] hover:bg-[#f2f6ec]"
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-colors sm:h-12 sm:w-12 ${
                          isActive
                            ? "bg-[#457358] text-white"
                            : "bg-[#f0ebe3] text-[#78746a]"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                          <h3 className="font-serif text-[18px] font-normal leading-tight text-[#1c402f] sm:text-[20px]">
                            {item.name}
                          </h3>

                          <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#457358] sm:text-right">
                            {item.benefit}
                          </span>
                        </div>

                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.p
                              key="content"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.28 }}
                              className="mt-2 overflow-hidden pr-1 text-sm leading-relaxed text-[#5f6f63] sm:text-[15px]"
                            >
                              {item.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Highlights Strip */}
      <div className="mt-16 border-t border-[#e5dfd3]/60 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {highlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8b130]/15 text-[#e8b130]">
                    <Icon className="h-7 w-7" strokeWidth={1.8} />
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold text-[#1c402f]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-[#5f6f63]">{item.subtitle}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}