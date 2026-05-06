import React, { useEffect } from "react";
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

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/ingredients") {
      document.getElementById("ingredients")?.scrollIntoView({ behavior: "smooth" });
    }

    if (location.pathname === "/reviews") {
      document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <div>
      <BannerOfferModal/>
      <HeroSection/>
      <MarqueeBar/>
      <ProductCarousel/>
      <FeaturedProducts />
      <BrandStory/>
      <IngredientsSection/>
      <ResultsSection/>
      <TestimonialsSection/>
      <Footer/>
    </div>
  )
}

export default Home;