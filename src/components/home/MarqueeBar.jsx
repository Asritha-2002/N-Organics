import React from 'react';
import { Leaf } from 'lucide-react';

const items = [
  'Vegan & Cruelty-Free',
  '30-Day Money Back Guarantee',
  'Earth-Friendly Essentials',
  'Dermatologist Tested',
  'No Parabens or Sulfates',
];

export default function MarqueeBar() {
  return (
    <div className="bg-[#1c402f] py-3 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-3 mx-8 font-body text-xs tracking-[0.2em] uppercase">
            <Leaf className="w-3 h-3 opacity-60" />
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}