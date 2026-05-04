import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ added
import pc1 from "../../assets/home/pc1.png";
import pc2 from "../../assets/home/pc2.png";
import pc3 from "../../assets/home/pc3.png";
import pc4 from "../../assets/home/pc4.png";

const PRODUCTS = [
  { id: 1, image: pc1, tag: "Bestseller" },
  { id: 2, image: pc2, tag: "New" },
  { id: 3, image: pc3, tag: "Limited" },
  { id: 4, image: pc4, tag: "Combo" },
];
const getTagColor = (tag) => {
  switch (tag) {
    case "Limited":
      return "bg-[#dd7714] text-white";
    case "Bestseller":
      return "bg-[#129b6f] text-white";
    case "New":
      return "bg-[#12988f] text-white";
    case "Combo":
      return "bg-[#5945f1] text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

function ProductCard({ product, index }) {
  const navigate = useNavigate(); // ✅ added
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.2 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#f2e4df] aspect-[4/5] sm:aspect-[3/4]"
       onClick={() =>
              navigate("/shop", {
                state: { tag: product.tag },
              })
            }>
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

        {/* ✅ ONLY CHANGE HERE */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-6 opacity-100 transition duration-500 sm:inset-x-4 sm:bottom-4 sm:translate-y-10 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={() =>
              navigate("/shop", {
                state: { tag: product.tag },
              })
            }
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 mb-6 lg:mb-2 text-sm font-medium text-black transition hover:bg-[#457358] hover:text-white cursor-pointer"
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
  const navigate = useNavigate(); // ✅ added

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

          {/* ✅ ALSO HANDLE VIEW ALL */}
         <button
  type="button"
  onClick={() => navigate("/shop")}
  className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#1c402f] transition hover:text-[#457358] sm:text-base cursor-pointer ml-auto md:ml-0 self-end md:self-auto"
>
  View All
  <ArrowRight size={16} />
</button>
        </div>

        <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}