import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Sparkles, Award } from "lucide-react";
import smallLogo from "../../assets/smallLogo.png"

const stats = [
  {
    icon: TrendingUp,
    number: "97%",
    label: "Saw visible improvement in skin texture within 4 weeks",
  },
  {
    icon: Clock,
    number: "2 Weeks",
    label: "Average time to notice a healthier, more radiant glow",
  },
  {
    icon: Sparkles,
    number: "89%",
    label: "Reported reduced fine lines and improved elasticity",
  },
  {
    icon: Award,
    number: "4.9/5",
    label: "Average customer satisfaction rating across all products",
  },
];

export default function ResultsSection() {
  return (
    <section className="py-20 bg-[#c5dbcf] relative overflow-hidden">
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-16 flex flex-col items-center">
          
          {/* <div className="w-48 h-0.5 bg-[#143c2f] mb-8" /> */}
          <img src={smallLogo} alt="" className="w-10 h-10 mb-5" />

          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs tracking-[0.3em] uppercase text-[#143c2f]/60 mb-4 block"
          >
            Clinical Results
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white text-3xl md:text-4xl  font-medium leading-tight"
          >
            <span className="text-[#143c2f] font-bold">Results</span> <span className="text-[#143c2f] font-light">That{" "}</span>
            <span className="italic font-semibold">Speak</span>
          </motion.h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-start mt-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative bg-white rounded-3xl p-8 pt-12 text-center flex flex-col items-center shadow-lg "
              >
                {/* Floating Icon */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-md border border-gray-100">
                  <Icon className="w-7 h-7 text-[#143c2f]" />
                </div>

                {/* Number */}
                <p className="text-[#143c2f] text-3xl md:text-4xl font-semibold mb-5 mt-4">
                  {stat.number}
                </p>

                {/* Label */}
                <p className="text-sm text-[#143c2f]/70 leading-relaxed max-w-[240px]">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}