import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Sparkles, Award } from "lucide-react";
import smallLogo from "../../assets/smallLogo2.png"

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
    <section className="py-24 lg:py-32 bg-[#d2e16a] text-white relative overflow-hidden">
      
      {/* Decorative Circles */}
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full border border-white/10" />
      <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full border border-white/10" />
      <div className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full border border-white/5" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs tracking-[0.3em] uppercase text-[#587645] mb-4 block"
          >
            Clinical Results
          </motion.span>

         <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="flex items-center justify-center gap-3"
>
  <img src={smallLogo} alt="" className="w-10 h-10 mt-2" />

  <h2 className=" text-3xl md:text-4xl lg:text-6xl font-light leading-tight">
    Results That{" "}
    <span className="italic font-medium">Speak</span>
  </h2>
</motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                {/* Icon */}
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-[#FFFFFF] flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#587645]" />
                </div>

                {/* Number */}
                <p className="text-4xl lg:text-5xl font-semibold mb-3">
                  {stat.number}
                </p>

                {/* Label */}
                <p className="text-sm text-[#587645] leading-relaxed">
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