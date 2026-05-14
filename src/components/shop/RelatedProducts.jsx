import React from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import sampleProduct from "../../assets/products/sampleProduct.png";


export default function RelatedProducts({ relatedProducts }) {
  const navigate = useNavigate();

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };


  const getTagColor = (tag) => {
    switch (tag?.toLowerCase()) {
      case "bestseller":
        return "bg-emerald-600/90 text-white";
      case "limited":
        return "bg-amber-600/90 text-white";
      case "new":
        return "bg-teal-600/90 text-white";
      case "combo":
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
        {relatedProducts && relatedProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {relatedProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={product._id}
                className="flex flex-col group"
                 onClick={(e) => {
          e.stopPropagation();
          handleViewDetails(product._id);
        }}
              >
               <div
  className={`relative aspect-[3/4] overflow-hidden rounded-[24px] bg-white shadow-[0_6px_20px_rgba(20,60,47,0.04)] border border-gray-100/50 ${
    product?.stockQuantity===0
      ? "cursor-not-allowed"
      : "cursor-pointer"
  }`}
  onClick={() => {
    if (product?.stockQuantity===0 > 0) {
      handleViewDetails(product._id);
    }
  }}
>
  <img
    src={product.image || sampleProduct}
    alt={product.name}
    className={`h-full w-full object-cover object-center transition-transform duration-700 ${
      product?.stockQuantity > 0
        ? "group-hover:scale-105"
        : "grayscale opacity-60"
    }`}
    
  />

  
  {product.stockQuantity === 0 && (
    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
      <div className="bg-red-500 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-lg">
        Out Of Stock
      </div>
    </div>
  )}

  {/* TOP BADGES */}
  <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">

    {product.bestOffer && product.bestOffer.discount > 0 && (
      <span
        className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full shadow-sm border ${
          product.bestOffer.discountType === "percentage"
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : "bg-emerald-50 text-emerald-700 border-emerald-200"
        }`}
      >
        {product.bestOffer.discountType === "percentage"
          ? `${product.bestOffer.discount}% Off`
          : `Flat ₹${product.bestOffer.discount} Off`}
      </span>
    )}

    {product.tag && (
      <span
        className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full shadow-sm ${getTagColor(
          product.tag
        )}`}
      >
        {product.tag}
      </span>
    )}
  </div>

  {/* HOVER BUTTON ONLY FOR AVAILABLE PRODUCTS */}
  {product?.stockQuantity> 0 && (
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleViewDetails(product._id);
        }}
        className="w-full bg-white text-[#143c2f] font-semibold text-xs uppercase tracking-widest py-3.5 rounded-full shadow-xl hover:bg-[#c8fec0] transition-all transform translate-y-3 group-hover:translate-y-0 duration-300 flex items-center justify-center gap-2 cursor-pointer"
      >
        <Eye className="h-4 w-4" />
        View Details
      </button>
    </div>
  )}
</div>


                {/* Product Info */}
                <div className="mt-4 px-1.5 flex flex-col items-start">
                  <h4 className="text-sm font-bold tracking-wide text-[#143c2f] truncate max-w-full">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-semibold text-[#457358]">
                      ₹{product.sellingPrice}
                    </p>
                    {product.mrp > product.sellingPrice && (
                      <p className="text-sm text-gray-400 line-through">
                        ₹{product.mrp}
                      </p>
                    )}
                  </div>
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