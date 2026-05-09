import React, { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";


const BASE_URL = import.meta.env.VITE_BASE_URL;


export default function ProductCarousel() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/categories/list`);
        const result = await res.json();
        if (result.success) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };


    fetchCategories();
  }, []);


  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#143c2f]" />
      </div>
    );
  }


  // Hide component if no categories are returned
  if (categories.length === 0) return null;


  return (
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex w-max gap-5 pb-2 snap-x snap-mandatory sm:gap-6">
            {categories.map((item, index) => (
              <div
                key={index}
                className="group w-[170px] flex-shrink-0 snap-start sm:w-[190px] lg:w-[210px]"
              >
                <div className="overflow-hidden rounded-2xl bg-[#f3ece4] shadow-[0_6px_16px_rgba(20,60,47,0.05)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_10px_26px_rgba(20,60,47,0.09)]">
                  
                 <div 
  className="relative aspect-square overflow-hidden cursor-pointer" 
  onClick={() =>
    navigate(`/shop?category=${encodeURIComponent(item.name)}`)
  }
>
  <img
    src={item.image}
    alt={item.name}
    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
    loading="lazy"
  />

  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-90" />

  <div className="absolute inset-x-3 bottom-3 translate-y-5 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/shop?category=${encodeURIComponent(item.name)}`);
      }}
      className="flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#143c2f] transition hover:bg-[#d2e16a] cursor-pointer"
    >
      View
      <ArrowRight className="h-3.5 w-3.5" />
    </button>
  </div>
</div>


                  <div className="px-3 py-4 sm:px-4 sm:py-4 bg-[#002b0a]">
                    <h3 className="text-center text-sm font-medium sm:text-base text-white">
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
          scroll-bar-width: none;
        }
      `}</style>
    </section>
  );
}