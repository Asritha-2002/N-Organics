import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast"
import {
  Star,
  X,
  Upload,
  Image,
  Play,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  Camera,
  Heart
} from "lucide-react";
import LoginRequiredModal from "./modal/LoginRequiredModal"

/* =========================================================
   CUSTOM UI COMPONENTS
========================================================= */

function Button({
  children,
  className = "",
  variant = "default",
  type = "button",
  disabled = false,
  onClick,
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",

    outline:
      "border border-border bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary",

    ghost: "hover:bg-secondary",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Input({
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        w-full
        rounded
        border
        border-gray-400
        bg-secondary/40
        px-4
        py-3
        text-sm
        text-foreground
        outline-none
        transition-all
        focus:border-primary
        focus:none
        focus:gray-400
        placeholder:text-muted-foreground
        ${className}
      `}
    />
  );
}

function Textarea({ value, onChange, placeholder, className = "", rows = 5 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`
        w-full
        rounded
        border
        border-gray-400
        bg-secondary/40
        px-4
        py-3
        text-sm
        text-foreground
        outline-none
        resize-none
        transition-all
        focus:none
        focus:gray-400
        placeholder:text-muted-foreground
        ${className}
      `}
    />
  );
}

/* =========================================================
   DUMMY DATA
========================================================= */

const REVIEW_IMAGES = [
  "https://media.base44.com/images/public/69f08505834766ebdd17a93f/16af041ba_generated_image.png",
  "https://media.base44.com/images/public/69f08505834766ebdd17a93f/a1a4f8475_generated_image.png",
  "https://media.base44.com/images/public/69f08505834766ebdd17a93f/6ab240053_generated_image.png",
];

const REVIEWS = [
  {
    id: 1,
    name: "Sarah M.",
    rating: 5,
    headline: "Absolutely transformed my skin!",
    text: "I've been using the serum for 6 weeks and my skin looks amazing.",
    date: "April 15, 2026",
    helpful: 48,
    images: [REVIEW_IMAGES[0], REVIEW_IMAGES[1]],
    verified: true,
    avatar: REVIEW_IMAGES[0],
  },
  {
    id: 2,
    name: "Emily R.",
    rating: 4,
    headline: "Great results",
    text: "Took some time but the glow is real.",
    date: "March 12, 2026",
    helpful: 21,
    images: [REVIEW_IMAGES[2]],
    verified: true,
    avatar: REVIEW_IMAGES[2],
  },
];

const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];



const FILTER_OPTIONS = [
  "All Stars",
  "5 Stars",
  "4 Stars",
  "3 Stars",
  "2 Stars",
  "1 Star",
];

/* =========================================================
   STAR RATING
========================================================= */

function StarRating({ value, onChange, size = "md" }) {
  const [hovered, setHovered] = useState(0);

  const sz = size === "lg" ? "w-8 h-8" : "w-5 h-5";

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Heart
            className={`${sz} ${
              star <= (hovered || value)
                ? "fill-[#d2e16a] text-[#d2e16a]"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/* =========================================================
   RATING BAR
========================================================= */

function RatingBar({ label, percent, count }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-14">{label}</span>

      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          style={{ width: `${percent}%` }}
          className="h-full bg-[#d2e16a] rounded-full"
        />
      </div>

      <span className="text-xs text-muted-foreground w-6">{count}</span>
    </div>
  );
}

/* =========================================================
   MEDIA GALLERY
========================================================= */

function MediaGallery({ images }) {
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className="w-20 h-20 rounded-xl overflow-hidden border"
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-5 right-5 text-white"
              onClick={() => setLightbox(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <img
              src={images[lightbox]}
              alt=""
              className="max-h-[80vh] max-w-[90vw] rounded-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* =========================================================
   REVIEW CARD
========================================================= */

function ReviewCard({ review }) {
  const [voted, setVoted] = useState(false);
  const [showMedia, setShowMedia] = useState(false);

  const mediaImages =
    review.images?.map((img) => img.url) || [];

  const totalImages = mediaImages.length;
  const totalVideos = review.videos?.length || 0;

  return (
    <div className="bg-white border border-gray-300 rounded p-4 shadow-sm">

      {/* HEADER */}
      <div className="flex justify-between gap-4 mb-4">

        <div className="flex gap-2">

          <img
            src={
              review.user?.profileImage ||
              "https://ui-avatars.com/api/?name=User"
            }
            alt=""
            className="w-12 h-12 rounded-full object-cover"
          />

          <div className="flex flex-col gap-1">

            <h4 className="font-semibold text-[#0f261c]">
              {review.user?.name}
            </h4>

            <p className="text-xs text-gray-500">
              {review.user?.isVerified && (
                <span className="text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-600">
                  Verified
                </span>
              )}
            </p>
          </div>
        </div>

        <StarRating value={review.rating} />
      </div>

      {/* HEADLINE */}
      <h3 className="text-lg font-semibold mt-3 text-[#0f261c]">
        {review.headline}
      </h3>

      {/* REVIEW */}
      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
        {review.review}
      </p>

      {/* MEDIA TOGGLE BUTTON */}
      {(totalImages > 0 || totalVideos > 0) && (
        <button
          onClick={() => setShowMedia((prev) => !prev)}
          className="mt-4 text-sm font-medium text-[#457358] hover:text-[#0f261c] transition cursor-pointer"
        >
          {showMedia ? (
            "Hide Media"
          ) : (
            <>
              View{" "}
              {totalImages > 0 && `${totalImages} Photo${totalImages > 1 ? "s" : ""}`}
              {totalImages > 0 && totalVideos > 0 && " & "}
              {totalVideos > 0 && `${totalVideos} Video${totalVideos > 1 ? "s" : ""}`}
            </>
          )}
        </button>
      )}

      {/* MEDIA SECTION */}
      <AnimatePresence>
        {showMedia && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >

            {/* Images */}
            {mediaImages.length > 0 && (
              <div className="mt-4">
                <MediaGallery images={mediaImages} />
              </div>
            )}

            {/* Videos */}
            {review.videos?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {review.videos.map((video, i) => (
                  <video
                    key={i}
                    controls
                    className="w-52 rounded-xl border"
                  >
                    <source src={video.url} type="video/mp4" />
                  </video>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReviewModal({ onClose, productId }) {
  const [rating, setRating] = useState(0);
  const [headline, setHeadline] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [submitting,  setSubmitting]  = useState(false);
     const [showLoginModal, setShowLoginModal] = useState(false);
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
      type: f.type,
      file:f,
    }));

    setMediaFiles((prev) => [...prev, ...previews]);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!rating || !headline.trim() || !reviewText.trim()) return;

  setSubmitting(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
  setShowLoginModal(true);
  return;
}

    const fd = new FormData();
    fd.append("productId", productId);
    fd.append("rating",    rating);
    fd.append("headline",  headline.trim());
    fd.append("review",    reviewText.trim());

    // Separate images and videos into their own fields
    mediaFiles.forEach(({ file, type }) => {
      if (type.startsWith("image/")) {
        fd.append("images", file);
      } else if (type.startsWith("video/")) {
        fd.append("videos", file);
      }
    });

    const res  = await fetch(`${import.meta.env.VITE_BASE_URL}/reviews`, {
      method:  "POST",
      headers: { Authorization: `Bearer ${token}` }, // no Content-Type — browser sets multipart boundary
      body:    fd,
    });
    const json = await res.json();

    if (!res.ok) throw new Error(json.message || "Failed to submit review");

    toast.success(json.message || "Review submitted successfully!");
    onClose();
  } catch (err) {
    toast.error(err.message || "Something went wrong");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-6 border-b border-gray-300">
            <div>
              <h2 className="text-2xl font-semibold">Share your thoughts</h2>

              <p className="text-sm text-gray-500 mt-1">
                * required fields
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:text-[#d2e16a] hover:bg-[#0f261c] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-3">Rate your experience *</label>

              <div className="flex items-center gap-3">
                <StarRating value={rating} onChange={setRating} size="lg" />

                {rating > 0 && (
                  <span className="text-sm text-gray-500">
                    {ratingLabels[rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Headline */}
            <div>
              <label className="block text-sm font-medium mb-2">Add a headline *</label>

              <Input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Summarize your experience"
                className="outline-gray-300 focus-none"
              />
            </div>

            {/* Review */}
            <div>
              <label className="block text-sm font-medium mb-2">Write a review *</label>

              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tell others about the product..."
              />
            </div>

            {/* Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Add media (Optional)
              </label>
              <span className="text-gray-500">Upload upto 10 images and 3 videos (max.file size 2GB)</span>

              <div className="flex flex-wrap gap-3 mb-4">
                {mediaFiles.map((file, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-xl overflow-hidden border"
                  >
                    {file.type.startsWith("video") ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Play className="w-6 h-6 text-gray-500" />
                      </div>
                    ) : (
                      <img
                        src={file.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setMediaFiles((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        )
                      }
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                onClick={() => fileRef.current.click()}
                
                className="px-5 py-3 border border-gray-400 cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2 " />
                Upload
              </Button>

              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="p-6 border-t flex justify-end border-gray-200">
            <Button
  type="submit"
  disabled={!rating || !headline || !reviewText || submitting}
  className="cursor-pointer px-8 py-2 rounded border border-[#457358] text-[#457358] hover:bg-[#d2e16a] hover:text-[#0f261c]"
>
  {submitting ? "Submitting…" : "Submit Review"}
</Button>
          </div>
        </form>
        <LoginRequiredModal
  isOpen={showLoginModal}
  onClose={() => setShowLoginModal(false)}
  title="Login Required"
  message="Please sign in to add items to your cart."
  redirectPath="/sign-in"
/>
      </motion.div>
    </motion.div>
    
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ProductReviews({productId}) {
  const [modalOpen, setModalOpen] = useState(false);
      
  const [sort, setSort] = useState("Most Recent");
  const [filter, setFilter] = useState("All Stars");


  const [ratings, setRatings] = useState({
  average: 0,
  count: 0,
  breakdown: {
    five: 0,
    four: 0,
    three: 0,
    two: 0,
    one: 0,
  },
});

const [loadingRatings, setLoadingRatings] = useState(true);

React.useEffect(() => {
  const fetchRatings = async () => {
    try {
      setLoadingRatings(true);

      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/products/${productId}/ratings`
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to fetch ratings");
      }

      setRatings(
        json?.data?.ratings || {
          average: 0,
          count: 0,
          breakdown: {
            five: 0,
            four: 0,
            three: 0,
            two: 0,
            one: 0,
          },
        }
      );
    } catch (error) {
      console.error("Ratings fetch error:", error);
    } finally {
      setLoadingRatings(false);
    }
  };

  if (productId) {
    fetchRatings();
  }
}, [productId]);


const totalReviews = ratings?.count || 0;

const ratingBars = [
  {
    label: "5 Star",
    count: ratings?.breakdown?.five || 0,
  },
  {
    label: "4 Star",
    count: ratings?.breakdown?.four || 0,
  },
  {
    label: "3 Star",
    count: ratings?.breakdown?.three || 0,
  },
  {
    label: "2 Star",
    count: ratings?.breakdown?.two || 0,
  },
  {
    label: "1 Star",
    count: ratings?.breakdown?.one || 0,
  },
].map((item) => ({
  ...item,
  percent: totalReviews
    ? Math.round((item.count / totalReviews) * 100)
    : 0,
}));

const [reviews, setReviews] = useState([]);
const [loadingReviews, setLoadingReviews] = useState(true);

React.useEffect(() => {
  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);

      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/products/${productId}/reviews`
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to fetch reviews");
      }

      setReviews(json.reviews || []);
    } catch (error) {
      console.error("Reviews fetch error:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  if (productId) {
    fetchReviews();
  }
}, [productId]);
const filteredReviews = reviews.filter((review) => {
  if (filter === "All Stars") return true;

  const selectedRating = Number(filter[0]); // "5 Stars" => 5

  return review.rating === selectedRating;
});
  
  

  return (
    <>
      <section className="py-12 sm:py-16 bg-[#faf8f5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between">
            <div className="flex flex-col items-start gap-3 mb-12 border-b border-gray-200/50 pb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#143c2f] mb-4">
                  What They're Saying
                </h2>
                <span className="text-[#457358] font-medium text-sm">
                  Community Reviews
                </span>
              </div>
            </div>
            <div>
              <Button
                onClick={() => setModalOpen(true)}
                className="px-5 py-2 bg-[#d2e16a] hover:bg-[#457358] cursor-pointer text-[#002b0a] hover:text-white"
              >
                <Camera className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            </div>
          </div>
          {/* Rating Overview */}
<div className="bg-white border border-gray-300 rounded p-8 grid md:grid-cols-3 gap-8 mb-12">
  
  <div className="text-center border-b border-gray-300 md:border-b-0 md:border-r pb-6 md:pb-0">
    
    {loadingRatings ? (
      <h2 className="text-5xl font-light">...</h2>
    ) : (
      <>
        <h2 className="text-7xl font-light">
          {Number(ratings?.average || 0).toFixed(1)}
        </h2>

        <div className="flex justify-center mt-3">
          <StarRating value={Math.round(ratings?.average || 0)} />
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Based on {ratings?.count || 0} reviews
        </p>
      </>
    )}
  </div>

  <div className="md:col-span-2 space-y-3">
    {ratingBars.map((item) => (
      <RatingBar
        key={item.label}
        label={item.label}
        percent={item.percent}
        count={item.count}
      />
    ))}
  </div>
</div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`cursor-pointer px-4 py-2 rounded-full border border-gray-400 text-xs uppercase tracking-wider transition-all ${
                    filter === f
                      ? "bg-[#457358] text-white"
                      : "hover:border-gray-400 text-gray-500"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews */}
         <div className="grid md:grid-cols-2 gap-6">

{loadingReviews ? (
  <p>Loading reviews...</p>
) : filteredReviews.length > 0 ? (
  filteredReviews.map((review) => (
    <ReviewCard key={review._id} review={review} />
  ))
) : (
  <div className="col-span-full text-center py-10 text-gray-500">
    No reviews yet
  </div>
)}


</div>

        
        </div>
        
      </section>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && <ReviewModal onClose={() => setModalOpen(false)} productId={productId} />}
      </AnimatePresence>
    </>
  );
}
