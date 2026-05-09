import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import pc1 from "../../assets/home/pc1.png";
import pc2 from "../../assets/home/pc2.png";
import pc3 from "../../assets/home/pc3.png";
import pc4 from "../../assets/home/pc4.png";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Default local images mapping
const DEFAULT_IMAGES = {
  bestseller: pc1,
  new: pc2,
  limited: pc3,
  combo: pc4,
};

const getTagColor = (tag) => {
  switch (tag.toLowerCase()) {
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

function ProductCard({ product, index }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.2 }}
      className="group"
    >
      <div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#f2e4df] aspect-[4/5] sm:aspect-[3/4] cursor-pointer"
        onClick={() =>
          navigate("/shop", {
            state: { tag: product.tag },
          })
        }
      >
        <img
          src={product.image}
          alt={product.tag}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-[#1c402f]/0 transition duration-500 group-hover:bg-[#1c402f]/35" />

        <div className="absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white sm:text-xs ${getTagColor(
              product.tag
            )}`}
          >
            {product.tag}
          </span>
        </div>

        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-6 opacity-100 transition duration-500 sm:inset-x-4 sm:bottom-4 sm:translate-y-10 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 mb-6 lg:mb-2 text-sm font-medium text-black transition hover:bg-[#d2e16a]"
          >
            <Eye size={16} />
            View Products
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedProducts() {
  const navigate = useNavigate();
  const [tagImages, setTagImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${BASE_URL}/admin/tags`);
        const result = await response.json();

        if (response.ok) {
          // Construct the products array based on our fixed categories
          const dynamicProducts = [
            {
              id: "bestseller",
              tag: "Bestseller",
              image: result.data.bestseller?.url || DEFAULT_IMAGES.bestseller,
            },
            {
              id: "new",
              tag: "New",
              image: result.data.new?.url || DEFAULT_IMAGES.new,
            },
            {
              id: "limited",
              tag: "Limited",
              image: result.data.limited?.url || DEFAULT_IMAGES.limited,
            },
            {
              id: "combo",
              tag: "Combo",
              image: result.data.combo?.url || DEFAULT_IMAGES.combo,
            },
          ];
          setTagImages(dynamicProducts);
        }
      } catch (error) {
        console.error("Error fetching tag images:", error);
        // On error, use defaults
        setTagImages([
          { id: 1, tag: "Bestseller", image: pc1 },
          { id: 2, tag: "New", image: pc2 },
          { id: 3, tag: "Limited", image: pc3 },
          { id: 4, tag: "Combo", image: pc4 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#faf8f5] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-5 sm:mb-12 md:flex-row md:items-end md:justify-between lg:mb-16">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#587645] sm:text-xs">
              Curated for You
            </p>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Bestselling <br className="hidden sm:block" />
              <span className="font-normal italic text-[#1c402f]">
                Rituals
              </span>
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#1c402f] transition hover:text-[#457358] sm:text-base cursor-pointer ml-auto md:ml-0 self-end md:self-auto"
          >
            View All
            <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex h-64 w-full items-center justify-center">
            <Loader2 className="animate-spin text-[#1c402f]" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {tagImages.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}