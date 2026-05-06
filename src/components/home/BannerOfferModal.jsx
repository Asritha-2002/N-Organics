import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Tag, CalendarDays, Clock } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const formatDiscount = (banner) => {
  if (!banner) return "";
  return banner.discountType === "percentage"
    ? `${banner.discount}% Off`
    : `₹${banner.discount} Off`;
};
const formatAppliesToText = (banner) => {
  if (!banner) return "";

  if (banner.appliesTo === "all") return "all products";
  if (banner.appliesTo === "product") return "few products";
  if (banner.appliesTo === "category") return "few categories";

  return "selected items";
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const BannerOfferModal = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/banners`);
        const data = await res.json();
        const now = new Date();

        const validBanners = data
          .filter((b) => b.isActive && !b.deletedAt && now <= new Date(b.endDate))
          .sort((a, b) => a.priority - b.priority);

        setBanners(validBanners);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const orderedOffers = useMemo(() => {
    const now = new Date();

    const currentOffers = banners.filter((b) => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      return now >= start && now <= end;
    });

    const upcomingOffers = banners.filter((b) => {
      const start = new Date(b.startDate);
      return now < start;
    });

    return [...currentOffers, ...upcomingOffers];
  }, [banners]);

  useEffect(() => {
    if (!isOpen || orderedOffers.length <= 1) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % orderedOffers.length);
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [orderedOffers, isOpen]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [orderedOffers.length]);

  if (loading || !isOpen || orderedOffers.length === 0) return null;

  const banner = orderedOffers[currentIndex];
  const now = new Date();
  const start = new Date(banner.startDate);
  const end = new Date(banner.endDate);
  const isLive = now >= start && now <= end;

  return (
    <div className="fixed top-0 left-0 z-[9999] w-[280px] sm:w-[320px]">
      <div className="relative overflow-hidden border border-[#457358]/15 bg-white/95 backdrop-blur-md shadow-2xl">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-[#457358]" />

        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4 text-[#101828]" />
        </button>

        <div className="p-2 pl-3 pr-8">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.18em] ${
                isLive
                  ? "bg-[#457358]/10 text-[#457358]"
                  : "bg-[#d4a843]/15 text-[#9a6b00]"
              }`}
            >
              {isLive ? <Tag className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              {isLive ? "Today’s Offer" : "Upcoming"}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-[#101828] leading-snug mb-2">
            {banner.title}
          </h3>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-[#101828]">
              <Tag className="w-4 h-4 text-[#457358]" />
              <span className="font-semibold">
               {formatDiscount(banner)} on {formatAppliesToText(banner)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#6b7280]">
              <CalendarDays className="w-4 h-4 text-[#457358]" />
              <span>
                {formatDate(banner.startDate)} - {formatDate(banner.endDate)}
              </span>
            </div>
          </div>

          {orderedOffers.length > 1 && (
            <div className="flex items-center gap-1.5 mt-3">
              {orderedOffers.map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "w-5 h-1.5 bg-[#457358]"
                      : "w-1.5 h-1.5 bg-[#cbd5e1]"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerOfferModal;