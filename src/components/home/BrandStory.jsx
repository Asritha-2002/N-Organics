import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import about1 from "../../assets/home/about1.png";
import about2 from "../../assets/home/about2.png";

export default function BrandStory() {
  const navigate = useNavigate();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#f4efe9] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#e8dec7]">
              <img
                src={about1}
                alt="Lavender field harvest"
                className="w-full h-full object-cover"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-6 -right-2 sm:-right-4 lg:-right-8 w-36 sm:w-44 lg:w-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#f4efe9]"
            >
              <img
                src={about2}
                alt="Product collection"
                className="w-full h-full object-cover aspect-square"
              />
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:pl-8"
          >
            <span className="font-body text-xs tracking-[0.3em] uppercase text-[#587645] mb-4 block">
              Our Story
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light text-[#1c402f] leading-tight mb-6">
              Born From Nature,
              <br />
              <span className="italic font-medium">Crafted With Love</span>
            </h2>

            <div className="space-y-4 mb-8 text-sm sm:text-base text-[#a47a6c] leading-relaxed">
              <p>
                Founded in 2021, N-Organics was born from a passion for clean, plant-based beauty. We believe in the power of natural botanicals and oils to restore your skin's natural vitality and glow.
              </p>

              <p>
                Each ingredient is carefully sourced from certified organic farms, cold-pressed and minimally refined to retain nature’s most potent bioactives. We uphold cruelty-free principles and embrace mindful, eco-conscious practices that honor both your skin and the environment.
              </p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-3 gap-6 mb-10">
              {[
                { number: 'Pure', label: 'Organic' },
                { number: 'Zero', label: 'Waste' },
                { number: 'B Corp', label: 'Certified' },
              ].map((v) => (
                <div key={v.label} className="text-center lg:text-left">
                  <p className="font-heading text-xl sm:text-2xl font-semibold text-[#1c402f]">
                    {v.number}
                  </p>
                  <p className="font-body text-[10px] sm:text-xs tracking-wider uppercase text-[#a47a6c] mt-1">
                    {v.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Button */}
            <button 
              type="button"
              className="bg-[#457358] hover:bg-[#1c402f] transition-all duration-300 text-white tracking-wider text-xs font-semibold uppercase px-8 py-3.5 rounded-full flex items-center group cursor-pointer shadow-md hover:shadow-lg"
              onClick={() => navigate('/about')}
            >
              Learn More
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}