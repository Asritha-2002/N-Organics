import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Play } from "lucide-react";
import Navbar from "../Navbar";

import heroimg from "../../assets/home/herosectionimg.png";
import MarqueeBar from "./MarqueeBar"
import smallLogo from "../../assets/smallLogo.png"

const HeroSection2 = () => {
  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat flex flex-col overflow-hidden"
      style={{ backgroundImage: `url(${heroimg})` }}
    >
      {/* DARK GRADIENT OVERLAY (like premium UI) */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/20" />

      {/* FLOATING LEAFS (premium touch) */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-32 right-20 hidden lg:block"
      >
        <Leaf className="w-12 h-12 text-[#457358]/30" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-40 right-40 hidden lg:block"
      >
        <Leaf className="w-8 h-8 text-[#457358]/20" />
      </motion.div>

      {/* NAVBAR */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-20">
        <div className="max-w-2xl">

          {/* TAG */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#457358] mb-6 bg-[#457358]/10 px-4 py-2 rounded-full"
          >
            <img src={smallLogo} alt="" className="w-6 h-6" />
            Pure Organic & Natural
          </motion.span>

          {/* HEADING */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6"
          >
            Nourish Your <br />
            <span className="italic text-[#457358]">Natural</span> Beauty
          </motion.h1>

          {/* DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-[#a47a6c] text-lg max-w-md leading-relaxed mb-10"
          >
            Handcrafted with ethically sourced botanicals. Our formulas harness the power of nature to reveal your skin's true radiance.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <button className="flex items-center gap-2 px-8 py-3 bg-[#457358] text-white rounded-full shadow-md hover:shadow-lg hover:bg-[#1c402f] transition-all duration-300 group cursor-pointer">
  Shop Collection
  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
</button>
          </motion.div>

          {/* STATS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex gap-10 mt-16 pt-8 border-t border-gray-300"
          >
            <div className="flex flex-col gap-2" >
              <p className="text-3xl font-semibold text-gray-900">50K+</p>
              <p className="text-xs uppercase">Customers</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-3xl font-semibold text-gray-900">Pure</p>
              <p className="text-xs uppercase">Natural</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-3xl font-semibold text-gray-900">5+</p>
              <p className="text-xs uppercase">Awards</p>
            </div>
          </motion.div>
        </div>
      </div>
      <MarqueeBar/>
    </section>
    
  );
};

export default HeroSection2;