import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import logo from "../assets/home/logo2.png";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScrollTop = () => {
    if (location.pathname === "/shop") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleScrollTopOnOther = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    // Added extra top margin/padding to handle the wave height nicely
   <footer className="relative bg-[#0f261c] text-gray-300 pb-16 pt-20 mt-16 px-6 lg:px-16 overflow-visible">
      
      {/* --- FIXED WAVE CONTAINER --- */}
      {/* We use negative top positioning and high z-index to make sure it sits right on the edge */}
     {/* --- WAVE CONTAINER --- */}
<div className="absolute -top-[59px] left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none">
  
  {/* Back wave — slower, slightly transparent */}
  <svg
    style={{
      display: "block",
      width: "200%",
      height: "60px",
      animation: "waveMove 16s linear infinite",
    }}
    viewBox="0 0 2880 60"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0,30 C180,55 360,5 540,30 C720,55 900,5 1080,30 C1260,55 1440,5 1620,30 C1800,55 1980,5 2160,30 C2340,55 2520,5 2700,30 C2880,55 2880,30 2880,30 L2880,60 L0,60 Z"
      fill="#0f261c"
    />
  </svg>

  {/* Front wave — faster, solid, seamless */}
  {/* <svg
    style={{
      display: "block",
      width: "200%",
      height: "60px",
      position: "absolute",
      top: 0,
      left: 0,
      animation: "waveMove 10s linear infinite",
    }}
    viewBox="0 0 2880 60"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0,40 C180,10 360,55 540,25 C720,0 900,50 1080,30 C1260,10 1440,55 1620,25 C1800,0 1980,50 2160,30 C2340,10 2520,55 2700,25 C2880,0 2880,30 2880,30 L2880,60 L0,60 Z"
      fill="#0f261c"
    />
  </svg> */}

</div>
      {/* ----------------------------- */}

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
        
        {/* Column 1: Description */}
        <div className="flex flex-col space-y-4">
          <img 
            src={logo} 
            alt="company logo" 
            className="h-24 w-auto object-contain object-left -ml-2 md:-ml-3" 
          />
          <p className="text-sm leading-relaxed text-gray-400 text-justify max-w-sm">
            N-Organics is a trusted platform dedicated to nature-based solutions, offering expert guidance on clean ingredients, holistic routines, and effective products to help you achieve healthy, radiant skin and natural vitality.
          </p>
        </div>

        {/* Column 2: Our Products */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-white font-semibold tracking-wider text-sm uppercase">
            OUR PRODUCTS
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white transition-colors duration-300">Home</a></li>
            <li>
              <Link
                to="/shop"
                state={{ tag: "Bestseller" }}
                onClick={handleScrollTop}
                className="hover:text-white transition-colors duration-300"
              >
                Best Seller
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                state={{ tag: "Combo" }}
                onClick={handleScrollTop}
                className="hover:text-white transition-colors duration-300"
              >
                Combos Shop
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                state={{ tag: "New" }}
                onClick={handleScrollTop}
                className="hover:text-white transition-colors duration-300"
              >
                New Seller
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                state={{ tag: "Limited" }}
                onClick={handleScrollTop}
                className="hover:text-white transition-colors duration-300"
              >
                Limited Shop
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Explore More */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-white font-semibold tracking-wider text-sm uppercase">
            EXPLORE MORE
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" onClick={handleScrollTopOnOther} className="hover:text-white transition-colors duration-300">About</Link></li>
            <li><Link to="/contact" onClick={handleScrollTopOnOther} className="hover:text-white transition-colors duration-300">Contact</Link></li>
            <li><a href="/privacy-policy" className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
            <li><a href="/termsandconditions" className="hover:text-white transition-colors duration-300">Terms & Conditions</a></li>
            <li><a href="/refund-policy" className="hover:text-white transition-colors duration-300">Refund Policy</a></li>
            <li><a href="/cancellation-policy" className="hover:text-white transition-colors duration-300"> Cancellation Policy</a></li>
            <li>
              <Link
                to={localStorage.getItem("token") ? "/account" : "/sign-in"}
                onClick={handleScrollTopOnOther}
                className="hover:text-white transition-colors duration-300"
              >
                Account
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Us */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-white font-semibold tracking-wider text-sm uppercase">
            CONTACT US
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Available between 10AM to 7PM. Ready to answer your questions.
          </p>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed">C-12, Noida Sector 2, Uttar Pradesh 201301</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <a href="tel:+918130095018" className="text-xs hover:text-white transition-colors duration-300">
                +91 8130095018
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <a href="mailto:sales@norganics.shop" className="text-xs hover:text-white transition-colors duration-300">
                sales@norganics.shop
              </a>
            </li>
          </ul>
        </div>
        
      </div>
      
      <hr className="border-gray-600 my-12 relative z-10" />

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 px-2 gap-4 relative z-10">
        <div>
          &copy; 2026, Dermistry Powered by N-Organics
        </div>
      </div>
    </footer>
  );
}