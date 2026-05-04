import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ added

const categories = [
  {
    id: 1,
    name: "Skin Care",
    imageUrl:
      "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/0c8aaec1f89936afb633c73974e300eb4042b68b.jpg",
    description: "Cleansers, serums, masks, and daily glow essentials",
  },
  {
    id: 2,
    name: "Hair Care",
    imageUrl:
      "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/3089b7cb3c4ed9877ffff7c42a9a75a81f5b388d.jpg",
    description: "Nourishing oils, shampoos, masks, and repair rituals",
  },
  {
    id: 3,
    name: "Body Care",
    imageUrl:
      "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/dd524fcfcaab2a150f7643debe44d24c45fbbb4f.jpg",
    description: "Body butters, scrubs, lotions, and spa-inspired care",
  },
  {
    id: 4,
    name: "Organic Essentials",
    imageUrl:
      "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/661fdf90bb0233c0467e0b9dd739672aea2bae2b.jpg",
    description: "Plant-based formulas crafted for everyday wellness",
  },
  {
    id: 5,
    name: "Luxury Hair Rituals",
    imageUrl:
      "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/8a3f512020ac36963ff3fbec4ab014f6cd8b1719.jpg",
    description: "Premium hair treatments for shine, strength, and softness",
  },
  {
    id: 6,
    name: "Bath & Spa",
    imageUrl:
      "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/39bd42a0072ad312267302748b9c2e17130e07ef.jpg",
    description: "Relaxing self-care products for a calm body routine",
  },
];

export default function ProductCarousel() {
  const navigate = useNavigate(); // ✅ added

  return (
    <section className=" py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex w-max gap-5 pb-2 snap-x snap-mandatory sm:gap-6">
            {categories.map((item) => (
              <div
                key={item.id}
                className="group w-[170px] flex-shrink-0 snap-start sm:w-[190px] lg:w-[210px]"
              >
                <div className="overflow-hidden rounded-2xl bg-[#f3ece4] shadow-[0_6px_16px_rgba(20,60,47,0.05)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_10px_26px_rgba(20,60,47,0.09)]">
                  
                  <div className="relative aspect-square overflow-hidden" onClick={() =>
                          navigate("/shop", {
                            state: { category: item.name },
                          })
                        }>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-90" />

                    {/* ✅ ONLY CHANGE HERE */}
                    <div className="absolute inset-x-3 bottom-3 translate-y-5 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() =>
                          navigate("/shop", {
                            state: { category: item.name },
                          })
                        }
                        className="flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#143c2f] transition hover:bg-[#457358] hover:text-white cursor-pointer"
                      >
                        View
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="px-3 py-4 sm:px-4 sm:py-4 bg-[#002b0a]">
                    <h3 className="text-center text-sm font-medium text-[#1e352b] sm:text-base text-white">
                      {item.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}