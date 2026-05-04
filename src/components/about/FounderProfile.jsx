import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { Sparkles, GraduationCap, Leaf } from "lucide-react";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/ananyasharma-n-organics",
    icon: FaLinkedin,
  },
  {
    name: "Twitter",
    href: "https://x.com/ananyasharma_n",
    icon: FaXTwitter,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/ananyasharma_n",
    icon: FaInstagram,
  },
];

export default function FounderProfile() {
  return (
    <section className="bg-[#faf8f5] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="overflow-hidden rounded-[32px] border border-[#e7dfd4] bg-white shadow-[0_18px_45px_rgba(20,60,47,0.08)]"
        >
          <div className="relative px-6 py-10 text-center sm:px-10 sm:py-12 lg:px-16 lg:py-16">
            {/* top soft accent */}
            <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-[#caa24d] via-[#143c2f] to-[#caa24d]" />

            {/* badge */}
            <span className="inline-flex rounded-full border border-[#e6dccf] bg-[#faf8f5] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-[#b48a2c]">
              Founder & CEO
            </span>

            {/* name */}
            <h2 className="mt-5 text-3xl font-light tracking-tight text-[#143c2f] sm:text-4xl lg:text-5xl">
              Ananya <span className="font-medium italic">Sharma</span>
            </h2>

            {/* role text */}
            <p className="mt-3 text-sm uppercase tracking-[0.22em] text-[#7b766d] sm:text-[13px]">
              Founder & CEO — N-Organics
            </p>

            {/* description */}
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#6f6a61] sm:text-base">
              Ananya Sharma leads N-Organics with a thoughtful blend of cosmetic
              science, sustainable business values, and a deep commitment to
              clean beauty. Her vision is to create products that feel gentle,
              effective, transparent, and aligned with nature.
            </p>

            {/* info cards */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#eee5d9] bg-[#faf8f5] px-5 py-6 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#143c2f] text-white">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="text-base font-medium text-[#143c2f]">
                  Education
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#6f6a61]">
                  B.Tech Cosmetic Technology
                </p>
                <p className="text-sm leading-6 text-[#6f6a61]">
                  MBA Sustainable Business
                </p>
              </div>

              <div className="rounded-2xl border border-[#eee5d9] bg-[#faf8f5] px-5 py-6 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#143c2f] text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-base font-medium text-[#143c2f]">
                  Philosophy
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#6f6a61]">
                  Clean formulations, visible results, and conscious care in
                  every product.
                </p>
              </div>

              <div className="rounded-2xl border border-[#eee5d9] bg-[#faf8f5] px-5 py-6 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#143c2f] text-white">
                  <Leaf className="h-5 w-5" />
                </div>
                <h3 className="text-base font-medium text-[#143c2f]">
                  Commitment
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#6f6a61]">
                  Sustainability, transparency, and beauty that respects both
                  skin and planet.
                </p>
              </div>
            </div>

            {/* socials */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-3 rounded-full border border-[#e5dacd] bg-white px-5 py-3 text-sm font-medium text-[#143c2f] transition hover:border-[#cdb89d] hover:bg-[#faf8f5]"
                  >
                    <Icon className="text-[16px]" />
                    <span>{item.name}</span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}