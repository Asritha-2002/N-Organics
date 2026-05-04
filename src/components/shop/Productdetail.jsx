import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import sampleProduct from "../../assets/products/sampleProduct.png";
import { ChevronDown } from "lucide-react";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Share2,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
  HelpCircle,
} from "lucide-react";


// Expanded Dummy Data with detailed information and extra fields
const initialProducts = [
  {
    id: 1,
    name: "Pure Aloe Soothing Gel",
    category: "Skin Care",
    price: 499,
    tag: "Bestseller",
    image: sampleProduct,
    images: [
      sampleProduct,
      sampleProduct,
      sampleProduct

    ],
    rating: 4.5,
    reviewsCount: 127,
    description: "Pure Aloe Vera gel extracted directly from fresh, organic aloe leaves. This incredibly versatile gel soothes sunburns, reduces inflammation, and hydrates deeply without leaving any greasy residue. Formulated for all skin types, including highly sensitive skin.",
    details: [
      "100% natural and plant-based.",
      "Free from parabens, sulfates, and artificial fragrances.",
      "Cruelty-free and vegan."
    ],
    ingredients: ["Organic Aloe Vera", "Vitamin E", "Cucumber Extract", "Natural Preservative"],
    howToUse: "Apply a generous amount to clean skin and massage gently until absorbed. Use morning and night for optimal hydration.",
    benefits: "Deep hydration, soothes sunburns and irritation.",
    daysToEffect: "Visible results within 3-5 days."
  },
  {
    id: 2,
    name: "Rosehip Regenerative Facial Oil",
    category: "Skin Care",
    price: 1299,
    tag: "Limited",
    image: sampleProduct,
    images: [
      sampleProduct,
      sampleProduct,
      sampleProduct

    ],
    rating: 4.8,
    reviewsCount: 89,
    description: "Limited edition Rosehip oil rich in vitamins A & C. Regenerates skin cells, fades scars & hyperpigmentation, deeply nourishes dry skin. Cold-pressed from organic rosehip seeds. Fast-absorbing with visible results in 2 weeks.",
    details: [
      "Rich in essential fatty acids and antioxidants.",
      "Sustainably sourced from organic farms.",
      "Non-comedogenic formula."
    ],
    ingredients: ["Cold-Pressed Rosehip Seed Oil", "Jojoba Oil", "Sea Buckthorn Oil"],
    howToUse: "Warm 2-3 drops between your palms and gently press onto the face and neck after your serum step.",
    benefits: "Fades scars, regenerates skin cells, nourishes dry skin.",
    daysToEffect: "Visible results within 2 weeks."
  },
  {
    id: 3,
    name: "Vitamin C Brightening Serum",
    category: "Skin Care",
    price: 899,
    tag: "New",
    image: sampleProduct,
    images: [
      sampleProduct,
      sampleProduct,
      sampleProduct

    ],
    rating: 4.6,
    reviewsCount: 204,
    description: "Newly formulated 20% Vitamin C serum with stable ethyl ascorbic acid. Brightens dark spots, evens skin tone, boosts collagen production. Includes ferulic acid for enhanced stability. Lightweight texture, no sticky residue.",
    details: [
      "Concentrated formula with Ethyl Ascorbic Acid.",
      "Dermatologically tested.",
      "Glass dropper packaging for easy application."
    ],
    ingredients: ["20% Vitamin C", "Ferulic Acid", "Hyaluronic Acid", "Green Tea Extract"],
    howToUse: "Apply 4-5 drops to face and neck once daily in the AM. Follow with sunscreen.",
    benefits: "Brightens dark spots, evens skin tone, boosts collagen.",
    daysToEffect: "Visible results in 2-3 weeks."
  },
  {
    id: 4,
    name: "Nourishing Argan Hair Mask",
    category: "Hair Care",
    price: 699,
    tag: "Combo",
    image: sampleProduct,
    images: [
      sampleProduct,
      sampleProduct,
      sampleProduct

    ],
    rating: 4.7,
    reviewsCount: 56,
    description: "Combo pack of nourishing Argan oil hair mask. Repairs damaged hair, restores shine, deeply conditions dry & frizzy hair. Moroccan argan oil + shea butter formula. Use weekly for salon-like results at home.",
    details: [
      "Deeply conditions and strengthens hair roots.",
      "Safe for color-treated hair.",
      "Provides UV protection."
    ],
    ingredients: ["Moroccan Argan Oil", "Shea Butter", "Keratin", "Pro-Vitamin B5"],
    howToUse: "After shampooing, apply generously from roots to ends. Leave on for 5-10 minutes and rinse thoroughly.",
    benefits: "Repairs damaged hair, restores shine, deeply conditions.",
    daysToEffect: "After 2-3 applications."
  },
  {
    id: 5,
    name: "Rosemary Hair Growth Oil",
    category: "Hair Care",
    price: 999,
    tag: "Bestseller",
    image: sampleProduct,
    images: [
      sampleProduct,
      sampleProduct,
      sampleProduct

    ],
    rating: 4.9,
    reviewsCount: 412,
    description: "Our #1 bestseller! Rosemary oil proven to stimulate hair growth, reduce hair fall by 68%. Includes peppermint & castor oil for thicker, stronger hair. Clinical results in 90 days. Suitable for all hair types.",
    details: [
      "Clinically proven for hair fall reduction.",
      "Improves scalp health and circulation.",
      "100% natural, no synthetic fillers."
    ],
    ingredients: ["Pure Rosemary Oil", "Peppermint Oil", "Castor Oil", "Coconut Oil"],
    howToUse: "Massage a small amount into the scalp. Leave for an hour or overnight before washing.",
    benefits: "Stimulates hair growth, reduces hair fall, thickens hair.",
    daysToEffect: "Clinical results in 90 days."
  },
  {
    id: 6,
    name: "Exfoliating Coffee Body Scrub",
    category: "Body Care",
    price: 599,
    tag: "New",
    image: sampleProduct,
    images: [
      sampleProduct,
      sampleProduct,
      sampleProduct

    ],
    rating: 4.4,
    reviewsCount: 78,
    description: "New launch! Coffee + coconut oil body scrub removes dead skin, improves circulation, and aids cellulite reduction. Natural exfoliation with 92% less microplastics than commercial scrubs. Glowy skin guaranteed.",
    details: [
      "Polishes and evens skin tone.",
      "Invigorating coffee scent.",
      "Eco-friendly packaging."
    ],
    ingredients: ["Arabica Coffee Grounds", "Cold Pressed Coconut Oil", "Cane Sugar", "Vitamin E"],
    howToUse: "In the shower, apply to damp skin in circular motions. Rinse well.",
    benefits: "Removes dead skin, improves circulation, aids cellulite reduction.",
    daysToEffect: "After the first use."
  },
  {
    id: 7,
    name: "Lavender & Shea Body Butter",
    category: "Body Care",
    price: 749,
    tag: "Combo",
    image: sampleProduct,
    images: [
      sampleProduct,
      sampleProduct,
      sampleProduct

    ],
    rating: 4.6,
    reviewsCount: 119,
    description: "Combo deal! Ultra-rich shea butter + lavender essential oil. 24-hour deep moisturization for extremely dry skin. Melts on contact, non-greasy finish. Perfect for winter skincare routine.",
    details: [
      "Intense 24-hour moisture lock.",
      "Calms the senses for better sleep.",
      "Ideal for elbows, knees, and feet."
    ],
    ingredients: ["Raw Shea Butter", "Lavender Essential Oil", "Almond Oil", "Cocoa Butter"],
    howToUse: "Apply generously to the body, concentrating on dry areas, and massage until absorbed.",
    benefits: "Deep moisturization, calms the senses, softens rough areas.",
    daysToEffect: "Immediate effect after 1st use."
  },
  {
    id: 8,
    name: "Botanical Plant-based Clay Mask",
    category: "Organic Essentials",
    price: 1199,
    tag: "Limited",
    image: sampleProduct,
    images: [
      sampleProduct,
      sampleProduct,
      sampleProduct

    ],
    rating: 4.7,
    reviewsCount: 188,
    description: "Limited edition French green clay + 7 botanical extracts. Detoxifies pores, controls oil, and minimizes acne. 98% natural ingredients, vegan & cruelty-free. Results visible after first use.",
    details: [
      "Draws out impurities and toxins.",
      "Tightens pores naturally.",
      "Maintains natural skin moisture barrier."
    ],
    ingredients: ["French Green Clay", "Tea Tree Extract", "Aloe Vera", "Witch Hazel"],
    howToUse: "Apply an even layer on cleansed skin. Leave for 15 minutes and rinse off with warm water.",
    benefits: "Detoxifies pores, controls oil, minimizes acne.",
    daysToEffect: "Visible results after first use."
  },
  {
    id: 9,
    name: "Luxury Rose Water Mist",
    category: "Luxury Hair Rituals",
    price: 399,
    tag: "New",
    image: sampleProduct,
    images: [
      sampleProduct,
      sampleProduct,
      sampleProduct

    ],
    rating: 4.5,
    reviewsCount: 94,
    description: "Damask rose water from Bulgarian roses. Sets makeup, hydrates throughout day, soothes irritated skin. Pure hydrolat, no alcohol or preservatives. Travel-friendly 100ml size.",
    details: [
      "100% steam-distilled Damask rose petals.",
      "Balances the skin’s pH.",
      "Versatile use as a toner, primer, or refresher."
    ],
    ingredients: ["Damask Rose Hydrosol"],
    howToUse: "Mist directly onto face and neck from a distance for instant hydration throughout the day.",
    benefits: "Hydrates, sets makeup, balances skin pH.",
    daysToEffect: "Immediate upon use."
  },
  {
    id: 10,
    name: "Eucalyptus Bath Salt Spa",
    category: "Bath & Spa",
    price: 449,
    tag: "Bestseller",
    image: sampleProduct,
    images: [
      sampleProduct,
      sampleProduct,
      sampleProduct

    ],
    rating: 4.8,
    reviewsCount: 312,
    description: "Our bestselling bath salt with eucalyptus & epsom salt. Relieves muscle tension, clears sinuses, promotes deep relaxation. Add 2 scoops to warm bath water. 30+ luxurious baths per jar.",
    details: [
      "Helps relieve muscle soreness and fatigue.",
      "Eucalyptus provides natural aromatherapy.",
      "Exfoliates and softens skin."
    ],
    ingredients: ["Epsom Salt", "Eucalyptus Essential Oil", "Dead Sea Salt"],
    howToUse: "Add 2-3 scoops to warm running water. Soak in the bath for 20 minutes to relax.",
    benefits: "Relieves muscle tension, clears sinuses, promotes deep relaxation.",
    daysToEffect: "During or right after the first use."
  }
];

export default function Productdetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const foundProduct = initialProducts.find((p) => p.id === parseInt(id));
    setProduct(foundProduct);
    setCurrentImageIndex(0);
    setQuantity(1);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f4efe9] flex items-center justify-center">
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Sparkles className="animate-spin h-5 w-5 text-[#457358]" />
          Loading product details...
        </div>
      </div>
    );
  }

  const getTagColor = (tag) => {
    switch (tag) {
      case "Bestseller":
        return "bg-emerald-600/90 text-white";
      case "Limited":
        return "bg-amber-600/90 text-white";
      case "New":
        return "bg-teal-600/90 text-white";
      case "Combo":
        return "bg-indigo-600/90 text-white";
      default:
        return "bg-white/80 text-[#1e352b]";
    }
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const faqs = [
    {
      q: "What is the product about?",
      a: product.description,
    },
    {
      q: "What are the key ingredients?",
      a: product.ingredients.join(", "),
    },
    {
      q: "What are the benefits?",
      a: product.benefits,
    },
    {
      q: "When will I see the effect?",
      a: product.daysToEffect,
    },
    {
      q: "How should I use it?",
      a: product.howToUse,
    },
  ];

  return (
    <section className="py-8 text-sm min-h-screen flex flex-col justify-between relative overflow-hidden bg-[#faf8f5] pt-28 sm:pt-32 lg:pt-36">
      <div className="max-w-8xl mx-auto px-6 w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 px-5 flex flex-col md:flex-row md:items-center md:justify-between text-[#143c2f] font-medium text-xs md:text-sm gap-2 md:gap-0">
  <Link 
    to="/shop" 
    className="inline-flex items-center gap-2 hover:text-[#457358] transition self-start md:self-auto"
  >
    <ArrowLeft className="h-4 w-4" /> Back
  </Link>
  
  <span className="text-gray-400 self-end md:self-auto text-right md:text-left">
    Shop / {product.category} / <span className="text-[#457358]">{product.name}</span>
  </span>
</div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start p-6">
          {/* Left: Images */}
         <div className="space-y-5">
  
  {/* MAIN IMAGE */}
  <div className="relative h-[400px] md:h-[450px] rounded-2xl overflow-hidden shadow-sm bg-[#faf8f5] border border-gray-100 flex items-center justify-center">
    <img
      src={product.images[currentImageIndex]}
      alt={product.name}
      className="h-full w-full object-contain"
    />

    {product.images.length > 1 && (
      <>
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow transition-all border border-gray-100"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow transition-all border border-gray-100"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      </>
    )}
  </div>

  {/* THUMBNAILS */}
  {product.images.length > 1 && (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {product.images.map((img, index) => (
        <motion.button
          key={index}
          onClick={() => setCurrentImageIndex(index)}
          whileTap={{ scale: 0.95 }}
          className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl border overflow-hidden shadow-sm transition-all duration-300 ${
            index === currentImageIndex
              ? "border-[#457358] ring-2 ring-[#457358]/20"
              : "border-gray-200 hover:border-gray-400"
          }`}
        >
          <img
            src={img}
            alt={`${product.name} ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.button>
      ))}
    </div>
  )}
</div>

          {/* Right: Product details */}
         <div className="space-y-6">
  {/* TOP CONTENT */}
  <div>
    <div className="flex items-center gap-3 mb-3">
      <span className="bg-[#457358]/10 text-[#457358] px-2.5 py-1 rounded-md text-xs tracking-wider uppercase">
        {product.category}
      </span>

      {product.tag && (
        <span
          className={`px-2.5 py-1 text-xs uppercase tracking-wider rounded-md ${getTagColor(
            product.tag
          )}`}
        >
          {product.tag}
        </span>
      )}
    </div>

    <h1 className="text-2xl md:text-3xl font-semibold font-black text-[#143c2f] leading-tight mb-3">
      {product.name}
    </h1>

    {/* Rating */}
    <div className="flex items-center gap-3 mb-4 text-xs md:text-sm">
      <div className="flex gap-1 ">
        {[...Array(5)].map((_, i) => (
          <Heart
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(product.rating)
                ? "text-[#c8fec0] fill-[#c8fec0] stroke-[#457358] "
                : "text-transparent fill-transparent stroke-gray-400 "
            }`}
          />
        ))}
      </div>
      <span className=" text-[#457358]">
        {product.rating}
      </span>
      <span className="text-gray-500">
        ({product.reviewsCount} reviews)
      </span>
    </div>

    {/* Price */}
    <div className="flex items-baseline gap-3 mb-6">
      <span className="text-2xl md:text-3xl text-[#457358]">
        ₹{product.price}
      </span>
      <span className="text-xs text-gray-400 uppercase tracking-wide">
        (Inclusive of taxes)
      </span>
    </div>
  </div>

  {/* ACTION SECTION */}
  <div className="space-y-4 border-t border-gray-200/40 pt-6">
    
    {/* Quantity */}
    <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200/30 shadow-sm">
      <span className="text-sm  text-[#143c2f]">Quantity:</span>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200/50 flex items-center justify-center transition"
        >
          <Minus className="h-4 w-4 text-gray-600" />
        </button>

        <span className="w-8 text-center text-sm  text-[#143c2f]">
          {quantity}
        </span>

        <button
          onClick={() => setQuantity((prev) => prev + 1)}
          className="w-8 h-8 rounded-lg bg-[#457358] hover:bg-[#143c2f] flex items-center justify-center transition text-white shadow"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>

    {/* Buttons */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <button className="w-full bg-[#457358] hover:bg-[#143c2f] text-white py-3 px-6 rounded-xl shadow-sm transition flex items-center justify-center gap-2 text-sm cursor-pointer">
    <ShoppingCart className="h-5 w-5" />
    Add to Cart
  </button>

  <button className="w-full bg-[#c8fec0] text-black py-3 px-6 rounded-xl transition text-sm cursor-pointer">
    Buy Now
  </button>
</div>
    {/* Bottom Icons */}
    <div className="flex items-center justify-between pt-2 text-xs text-[#143c2f]">
      <div className="flex gap-3">
        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white border shadow-sm">
          <Truck className="h-5 w-5 text-[#457358]" />
          Shipping
        </div>

        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white border shadow-sm">
          <ShieldCheck className="h-5 w-5 text-[#457358]" />
          Organic
        </div>
        {/* <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white border shadow-sm">
                  <Share2 className="h-5 w-5 text-[#457358]" />
                  Share
                </div> */}
      </div>
      

      {/* Heart moved to end */}
      <button className="p-3  rounded-full bg-white border shadow-sm hover:bg-[#457358] transition">
        <Heart className="h-5 w-5 text-[#457358] hover:text-white" />
      </button>
    </div>
  </div>
</div>
        </div>

        {/* Description & Information Section */}
       <motion.div
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.1 }}
  className="mt-10 max:w-8xl mx-auto px-4 bg-white p-4 rounded"
>
  {/* HEADING */}
  <h2 className="text-2xl md:text-3xl font-bold text-[#284a39] mb-6">
    More About Product
  </h2>

  {/* DESCRIPTION */}
  <p className="text-gray-600 leading-relaxed mb-10 text-sm md:text-base">
    {product.fullDescription ||
      "This product is crafted using high-quality natural ingredients that deeply nourish, hydrate, and protect your skin. Designed for daily use, it enhances your natural glow while maintaining skin balance and health."}
  </p>

  {/* INFO / FAQ STYLE LIST */}
  <div className="space-y-5">
    {/* FAQS */}
    {faqs?.map((faq, index) => {
  const isOpen = openIndex === index;

  return (
   <div
  key={index}
  className="border border-[#e7dfd4] rounded-2xl bg-[#faf8f5] transition hover:border-[#457358]/40"
>
  {/* HEADER */}
  <button
    onClick={() => setOpenIndex(isOpen ? null : index)}
    className="w-full flex items-start sm:items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left gap-4"
  >
    <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#457358]/10 flex items-center justify-center text-[#457358] flex-shrink-0">
        <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>

      <h4 className="text-sm sm:text-base md:text-lg font-semibold text-[#143c2f] leading-snug">
        {faq.q}
      </h4>
    </div>

    {/* RIGHT SIDE */}
    <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
      <span className="text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.25em] uppercase text-[#457358]">
        FAQ
      </span>

      <ChevronDown
        className={`h-4 w-4 sm:h-5 sm:w-5 text-[#457358] transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </div>
  </button>

  {/* CONTENT (ANIMATED) */}
  <AnimatePresence initial={false}>
    {isOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden px-4 sm:px-6 pb-4 sm:pb-5"
      >
        <p className="text-sm leading-relaxed max-w-2xl ml-[52px] sm:ml-16 text-[#7d756a]">
          {faq.a}
        </p>
      </motion.div>
    )}
  </AnimatePresence>
</div>
  );
})}

    {/* OTHER DETAILS */}
    {product?.details && (
     <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6 border border-[#e7dfd4] rounded-2xl px-5 md:px-6 py-5 bg-[#faf8f5] hover:border-[#457358]/40 transition">
  {/* LEFT */}
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 rounded-xl bg-[#457358]/10 flex items-center justify-center text-[#457358] flex-shrink-0">
      *
    </div>

    <div>
      <h4 className="text-lg font-semibold text-[#143c2f]">
        Other Details
      </h4>

      <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-[#7d756a]">
        {product.details.map((detail, idx) => (
          <li key={idx}>{detail}</li>
        ))}
      </ul>
    </div>
  </div>

  {/* RIGHT TAG */}
  <span className="text-xs tracking-[0.25em] uppercase text-[#457358] whitespace-nowrap self-end md:self-auto mt-2 md:mt-0">
    Details
  </span>
</div>
    )}
  </div>
</motion.div>
      </div>
    </section>
  );
}