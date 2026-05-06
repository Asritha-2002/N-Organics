import React, { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function MarqueeBar() {
  const [bar, setBar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBar = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/admin/announcement-bar`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!res.ok) throw new Error("Failed to fetch announcement bar");

        const data = await res.json();
        const activeBar = Array.isArray(data) ? data.find((item) => item.isActive) || data[0] : data;
        setBar(activeBar || null);
      } catch (err) {
        console.error("Error fetching announcement bar:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBar();
  }, []);

  if (loading) return null;
  if (!bar) return null;

  const sentences = Array.isArray(bar.sentences) ? bar.sentences.filter(Boolean) : [];
  if (sentences.length === 0) return null;

  const items = [...sentences, ...sentences, ...sentences];

  return (
    <div
      className="py-3 overflow-hidden border-b border-black/5"
      style={{ backgroundColor: bar.backgroundColor, color: bar.textColor }}
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 mx-8 font-body text-xs tracking-[0.2em] uppercase shrink-0"
            style={{ color: bar.textColor }}
          >
            {bar.logo?.url ? (
              <img
                src={bar.logo.url}
                alt={bar.logo.altText || "Announcement logo"}
                className="w-4 h-4 object-contain"
              />
            ) : (
              <Leaf className="w-3 h-3" />
            )}
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