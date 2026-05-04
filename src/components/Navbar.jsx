import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, X, Heart, User } from "lucide-react";
import logo from "../assets/home/logo.png";
import logo2 from "../assets/home/logo2.png";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const links = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Ingredients", href: "/ingredients" },
  { name: "Reviews", href: "/reviews" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // ✅ Handle scroll after navigation
  useEffect(() => {
    if (location.pathname === "/ingredients") {
      setTimeout(() => {
        document
          .getElementById("ingredients")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }

    if (location.pathname === "/reviews") {
      setTimeout(() => {
        document
          .getElementById("testimonials")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/10 bg-[#0f261c] shadow-md backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-6">
        <div className="flex h-16 items-center justify-between sm:h-18 lg:h-20">
          {/* LOGO */}
          <div className="flex min-w-0 items-center">
            <img
              src={scrolled ? logo2 : logo}
              alt="logo"
              className="h-40 w-[200px] cursor-pointer object-contain sm:h-24 md:h-28 lg:h-32 xl:h-40 transition-all duration-300"
              onClick={() => navigate("/")}
            />
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden items-center gap-6 lg:flex xl:gap-10">
            {links.map((link) => (
             <NavLink key={link.name} to={link.href}>
  {() => {
    const isShopActive =
      location.pathname.startsWith("/shop") ||
      location.pathname.startsWith("/product");

    const isActive =
      location.pathname === link.href ||
      (link.name === "Shop" && isShopActive);

    return (
      <div
        className={`group relative text-sm uppercase tracking-[0.22em] transition xl:text-sm font-bold xl:tracking-widest ${
          isActive
            ? scrolled
              ? "text-[#c8fec0] hover:text-[#457358]"
              : "text-[#457358] hover:text-[#457358]"
            : scrolled
            ? "text-[#cbd1c7] hover:text-[#c8fec0]"
            : "text-gray-800 hover:text-[#457358]"
        }`}
      >
        {link.name}

        <span
  className={`absolute left-0 -bottom-2 h-[2px] w-0 transition-all duration-300 group-hover:w-full ${
    isActive
      ? scrolled
        ? "bg-[#c8fec0] group-hover:bg-[#457358]"
        : "bg-[#457358] group-hover:bg-[#457358]"
      : scrolled
      ? "bg-[#cbd1c7] group-hover:bg-[#c8fec0]"
      : "bg-gray-800 group-hover:bg-[#457358]"
  }`}
/>
      </div>
    );
  }}
</NavLink>
            ))}
          </div>

          {/* DESKTOP ICONS */}
         <div className="hidden items-center gap-4 lg:flex xl:gap-5">
  <Search
    className={`h-6 w-6 cursor-pointer transition ${
      scrolled
        ? "text-[#cbd1c7] hover:text-[#c8fec0]"
        : "text-gray-800 hover:text-[#457358]"
    }`}
  />

  <User
    className={`h-6 w-6 cursor-pointer transition ${
      scrolled
        ? "text-[#cbd1c7] hover:text-[#c8fec0]"
        : "text-gray-800 hover:text-[#457358]"
    }`}
  />

  <div className="relative cursor-pointer">
    <ShoppingBag
      className={`h-6 w-6 transition ${
        scrolled
          ? "text-[#cbd1c7] hover:text-[#c8fec0]"
          : "text-gray-800 hover:text-[#457358]"
      }`}
    />

    {/* Badge */}
    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#457358] text-[10px] text-white">
      0
    </span>
  </div>
</div>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition lg:hidden ${
              scrolled
                ? "text-white hover:bg-white/10"
                : "text-[#1c402f] hover:bg-[#1c402f]/10"
            }`}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 bg-black/30 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="absolute left-0 right-0 top-full border-t border-white/10 bg-[#1c402f] backdrop-blur-xl lg:hidden"
            >
              <div className="space-y-6 px-5 py-6 sm:px-6">
                <div className="flex flex-col space-y-4">
                  {links.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm uppercase tracking-[0.22em] text-[#cbd1c7] transition hover:text-[#e8b130]"
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </div>

                <div className="flex items-center gap-6 border-t border-white/10 pt-4">
                  <Search className="h-5 w-5 text-white transition hover:text-[#e8b130]" />
                  <Heart className="h-5 w-5 text-white transition hover:text-[#e8b130]" />
                  <User className="h-5 w-5 text-white transition hover:text-[#e8b130]" />
                  <div className="relative">
                    <ShoppingBag className="h-5 w-5 text-white transition hover:text-[#e8b130]" />
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#e8b130] text-[10px] text-black">
                      0
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
