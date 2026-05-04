import React from "react";
import { motion } from "framer-motion";
import vision from "../../assets/vision.png"
import mission from "../../assets/mission.png"

const VisionMission = () => {
  return (
    <section className="bg-[#f4efe9] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-3xl"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-3 block text-[11px] font-medium uppercase tracking-[0.32em] text-[#b48a2c] sm:text-xs"
          >
            Our Purpose
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl font-light tracking-tight text-[#143c2f] sm:text-4xl lg:text-5xl"
          >
            Vision <span className="font-medium italic">&</span> Mission
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-sm leading-7 text-[#6f6a61] sm:text-base"
          >
            Guided by nature, science, and sustainability, we are committed to
            building a beauty experience that is ethical, transparent, and
            effective.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="rounded-[28px] border border-[#e7dfd4] p-6 shadow-[0_10px_30px_rgba(20,60,47,0.06)] sm:p-8 lg:p-10 group  bg-[#FFFFFF]"
          >
            <div className="mb-5 flex items-center gap-3">
              <img src={vision} alt="" className="w-10 h-10" />
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.65 }}
                className="text-2xl font-medium text-[#143c2f] sm:text-3xl"
              >
                Vision
              </motion.h3>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-sm leading-8 text-[#5f5a51] sm:text-[15px]"
            >
              To become a globally trusted pioneer in sustainable, plant-based
              beauty by harmonizing nature&apos;s purest botanicals with advanced
              skincare science. We envision a world where everyone can access
              clean, effective, and ethical products that nurture both their
              skin and the planet.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="mt-4 text-sm leading-8 text-[#5f5a51] sm:text-[15px]"
            >
              By championing eco-friendly practices, we strive to redefine
              beauty standards and promote holistic, long-term wellness.
              Ultimately, our goal is to cultivate a deep, respectful connection
              between humanity and the natural world.
            </motion.p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="rounded-[28px] border border-[#e7dfd4] bg-[#143c2f] p-6 shadow-[0_10px_30px_rgba(20,60,47,0.12)] sm:p-8 lg:p-10 group"
          >
            <div className="mb-5 flex items-center gap-3">
              <img src={mission} alt="" className="w-10 h-10" />
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.75 }}
                className="text-2xl font-medium text-white sm:text-3xl"
              >
                Mission
              </motion.h3>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-sm leading-8 text-white/85 sm:text-[15px]"
            >
              Our mission is to craft premium, organic skincare and haircare
              solutions using ethically sourced ingredients that deliver
              visible, nourishing results. We are dedicated to maintaining full
              transparency in our formulations, ensuring that every product is
              free from harsh chemicals and synthetic additives.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="mt-4 text-sm leading-8 text-white/85 sm:text-[15px]"
            >
              Through sustainable harvesting and cruelty-free practices, we
              empower our community to embrace their natural radiance while
              minimizing their environmental footprint. We pledge to
              continuously innovate and provide expert education, making clean
              beauty accessible to everyone.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;