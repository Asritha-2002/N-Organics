import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import logo from "../assets/home/logo2.png";

export default function Footer() {
  return (
    <footer className="bg-[#0f261c] text-gray-300 py-16 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
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
            <li><a href="#hair-care" className="hover:text-white transition-colors duration-300">Hair Care</a></li>
            <li><a href="#skin-care" className="hover:text-white transition-colors duration-300">Skin Care</a></li>
            <li><a href="#dermistry-pure" className="hover:text-white transition-colors duration-300">Gift</a></li>
            <li><a href="#best-seller" className="hover:text-white transition-colors duration-300">Best Seller</a></li>
            <li><a href="#combos-shop" className="hover:text-white transition-colors duration-300">Combos Shop</a></li>
          </ul>
        </div>

        {/* Column 3: Explore More */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-white font-semibold tracking-wider text-sm uppercase">
            EXPLORE MORE
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#about" className="hover:text-white transition-colors duration-300">About</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors duration-300">Contact</a></li>
            <li><a href="#privacy-policy" className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-white transition-colors duration-300">Terms & Conditions</a></li>
            <li><a href="#refund-policy" className="hover:text-white transition-colors duration-300">Refund and Cancellation Policy</a></li>
            <li><a href="#account" className="hover:text-white transition-colors duration-300">Account</a></li>
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
      
      <hr className="border-gray-600 my-12" />

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 px-2 gap-4">
        <div>
          &copy; 2026, Dermistry Powered by N-Organics
        </div>
      </div>
    </footer>
  );
}