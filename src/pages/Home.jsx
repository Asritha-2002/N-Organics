import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import HeroSection from '../components/home/HeroSection'
import FeaturedProducts from '../components/home/FeaturedProducts';
import BrandStory from '../components/home/BrandStory';
import IngredientsSection from '../components/home/IngredientsSection';
import ResultsSection from '../components/home/ResultsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import Footer from '../components/Footer';
import ProductCarousel from '../components/home/ProductCarousel';
import MarqueeBar from "../components/home/MarqueeBar"
import BannerOfferModal from "../components/home/BannerOfferModal";
import SignInModal from "../components/shop/modal/SignInModal";

const Home = () => {
  const location = useLocation();

  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (location.pathname === "/ingredients") {
      document
        .getElementById("ingredients")
        ?.scrollIntoView({ behavior: "smooth" });
    }

    if (location.pathname === "/reviews") {
      document
        .getElementById("testimonials")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  // Open modal when no token exists
 useEffect(() => {
  const token = localStorage.getItem("token");

  // check whether modal already shown before
  const hasSeenLoginModal = localStorage.getItem("hasSeenLoginModal");

  if (!token && !hasSeenLoginModal) {
    const timer = setTimeout(() => {
      setShowLoginModal(true);

      // save flag after first open
      localStorage.setItem("hasSeenLoginModal", "true");
    }, 1200);

    return () => clearTimeout(timer);
  }
}, []);

  return (
    <div className="bg-[#faf8f5]">
      <BannerOfferModal />

      <SignInModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Welcome Back"
        message="Sign in to explore personalized skincare products, wishlist, reviews, and faster checkout."
        redirectPath="/sign-in"
      />

      <HeroSection />
      <MarqueeBar />
      <ProductCarousel />
      <FeaturedProducts />
      <BrandStory />
      <IngredientsSection />
      <ResultsSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Home;