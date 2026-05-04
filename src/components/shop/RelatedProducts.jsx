import React from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import sampleProduct from "../../assets/products/sampleProduct.png";

export default function RelatedProducts() {
  const navigate = useNavigate();

  const products = [
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
  ];

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

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

  return (
    <section className="bg-[#f4efe9] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col items-start gap-3 mb-12 border-b border-gray-200/50 pb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#143c2f]">
            Related Products
          </h2>
          <p className="text-[#457358] font-medium text-sm">
            Discover curated items you might love
          </p>
        </div>

        {/* PRODUCT GRID */}
        {products.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {products.map((product) => (
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
            No related products available.
          </div>
        )}
      </div>
    </section>
  );
}