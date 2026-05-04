import React from "react";

const ShopHero = () => {
  return (
    <section className="relative overflow-hidden bg-[#faf8f5] pt-28 sm:pt-32 lg:pt-36">
      {/* top line */}
      <div className="absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[#457358]/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 pb-14  text-center sm:px-6 sm:pb-16 lg:px-8 lg:pb-17">
        <span className="mb-4 block text-[11px] font-medium uppercase tracking-[0.32em] text-[#143c2f] sm:text-xs">
          Premium Collection
        </span>

        <h1 className="text-4xl font-light tracking-tight text-[#143c2f] sm:text-5xl lg:text-6xl">
          Explore Our <span className="italic font-medium">Products</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6f6a61] sm:text-base">
          Explore our range of clean, organic skincare crafted with nature’s finest ingredients. Designed to nourish, restore, and enhance your natural glow.
        </p>
      </div>
    </section>
  );
};

export default ShopHero;