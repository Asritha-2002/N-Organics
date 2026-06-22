import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  X,
  Upload,
  Play,
  Heart,
} from "lucide-react";


// ─────────────────────────────────────────────
// STAR LABELS
// ─────────────────────────────────────────────
const ratingLabels = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

// ─────────────────────────────────────────────
// STAR RATING
// ─────────────────────────────────────────────
function StarRating({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Heart
            className={`w-7 h-7 ${
              star <= value
                ? "fill-[#D2E16A] text-[#D2E16A]"
                : "text-[#c9ced6]"
            }`}
            strokeWidth={1.8}
          />
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// REVIEW MODAL
// ─────────────────────────────────────────────
function ReviewModal({
  onClose,
  onSubmitted,
  productId,
}) {

  const [rating, setRating] = useState(0);

  const [headline, setHeadline] =
    useState("");

  const [reviewText, setReviewText] =
    useState("");

  const [mediaFiles, setMediaFiles] =
    useState([]);

  const [submitting, setSubmitting] =
    useState(false);

  const [showLoginModal, setShowLoginModal] =
    useState(false);

  const fileRef = useRef();

  // ─────────────────────────────────────────────
  // FILE CHANGE
  // ─────────────────────────────────────────────
  const handleFileChange = (e) => {

    const files = Array.from(
      e.target.files || []
    );

    const previews = files.map((file) => ({
      file,
      type: file.type,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setMediaFiles((prev) => [
      ...prev,
      ...previews,
    ]);
  };

  // ─────────────────────────────────────────────
  // REMOVE FILE
  // ─────────────────────────────────────────────
  const removeFile = (index) => {

    setMediaFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ─────────────────────────────────────────────
  // SUBMIT REVIEW
  // ─────────────────────────────────────────────
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !rating ||
      !headline.trim() ||
      !reviewText.trim()
    ) {

      toast.error(
        "Please fill all required fields"
      );

      return;
    }

    try {

      setSubmitting(true);

      const token =
        localStorage.getItem("token");

      if (!token) {

        setShowLoginModal(true);

        return;
      }

      const fd = new FormData();

      fd.append(
        "productId",
        productId
      );

      fd.append("rating", rating);

      fd.append(
        "headline",
        headline.trim()
      );

      fd.append(
        "review",
        reviewText.trim()
      );

      mediaFiles.forEach(
        ({ file, type }) => {

          if (
            type.startsWith("image/")
          ) {

            fd.append(
              "images",
              file
            );
          }

          else if (
            type.startsWith("video/")
          ) {

            fd.append(
              "videos",
              file
            );
          }
        }
      );

      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/reviews`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: fd,
        }
      );

      const json =
        await res.json();

      // CLOSE MODAL BEFORE TOAST
      onClose();

      if (!res.ok) {

        throw new Error(
          json.message ||
          "Failed to submit review"
        );
      }

      toast.success(
        json.message ||
        "Review submitted successfully!"
      );

      onSubmitted?.();

    } catch (err) {

      toast.error(
        err.message ||
        "Something went wrong"
      );

    } finally {

      setSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="
            fixed inset-0 z-[9999]
            bg-black/50 backdrop-blur-sm
            flex items-center justify-center
            p-4
          "
        >

          <motion.div
            initial={{
              scale: 0.95,
              opacity: 0,
            }}

            animate={{
              scale: 1,
              opacity: 1,
            }}

            exit={{
              scale: 0.95,
              opacity: 0,
            }}

            transition={{
              duration: 0.2,
            }}

            onClick={(e) =>
              e.stopPropagation()
            }

            className="
              bg-white
              rounded
              w-full
              max-w-xl
              max-h-[90vh]
              overflow-y-auto
              shadow-2xl
            "
          >

            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-gray-300">

              <div>

                <h2 className="text-2xl font-semibold">
                  Share your thoughts
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  * required fields
                </p>

              </div>

              <button
                type="button"
                onClick={onClose}

                className="
                  w-10 h-10
                  rounded-full
                  border
                  flex items-center justify-center
                  hover:text-[#d2e16a]
                  hover:bg-[#0f261c]
                  transition-all
                  cursor-pointer
                "
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit}>

              <div className="p-6 space-y-6">

                {/* RATING */}
                <div>

                  <label className="block text-sm font-medium mb-3">
                    Rate your experience *
                  </label>

                  <div className="flex items-center gap-3">

                    <StarRating
                      value={rating}
                      onChange={setRating}
                    />

                    {rating > 0 && (

                      <span className="text-sm text-gray-500">
                        {ratingLabels[rating]}
                      </span>

                    )}

                  </div>

                </div>

                {/* HEADLINE */}
                <div>

                  <label className="block text-sm font-medium mb-2">
                    Add a headline *
                  </label>

                  <input
                    type="text"

                    value={headline}

                    onChange={(e) =>
                      setHeadline(
                        e.target.value
                      )
                    }

                    placeholder="Summarize your experience"

                    className="
                      w-full
                      h-[44px]
                      border
                      border-gray-300
                      rounded
                      px-3
                      text-sm
                      outline-none
                      focus:border-[#0f261c]
                    "
                  />

                </div>

                {/* REVIEW */}
                <div>

                  <label className="block text-sm font-medium mb-2">
                    Write a review *
                  </label>

                  <textarea
                    value={reviewText}

                    onChange={(e) =>
                      setReviewText(
                        e.target.value
                      )
                    }

                    placeholder="Tell others about the product..."

                    className="
                      w-full
                      min-h-[130px]
                      border
                      border-gray-300
                      rounded
                      p-3
                      text-sm
                      resize-none
                      outline-none
                      focus:border-[#0f261c]
                    "
                  />

                </div>

                {/* MEDIA */}
                <div>

                  <label className="block text-sm font-medium mb-2">
                    Add media (Optional)
                  </label>

                  <p className="text-sm text-gray-500 mb-4">
                    Upload upto 10 images and 3 videos (max.file size 2GB)
                  </p>

                  {/* PREVIEWS */}
                  {mediaFiles.length > 0 && (

                    <div className="flex flex-wrap gap-3 mb-4">

                      {mediaFiles.map(
                        (file, index) => (

                          <div
                            key={index}

                            className="
                              relative
                              w-20 h-20
                              rounded-xl
                              overflow-hidden
                              border
                            "
                          >

                            {file.type.startsWith(
                              "video/"
                            ) ? (

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
                                removeFile(index)
                              }

                              className="
                                absolute top-1 right-1
                                bg-black/60
                                text-white
                                rounded-full
                                p-1
                              "
                            >
                              <X className="w-3 h-3" />
                            </button>

                          </div>
                        )
                      )}

                    </div>

                  )}

                  {/* UPLOAD */}
                  <button
                    type="button"

                    onClick={() =>
                      fileRef.current?.click()
                    }

                    className="
                      px-5 py-3
                      border border-gray-400
                      rounded
                      flex items-center gap-2
                      text-sm
                      cursor-pointer
                      hover:bg-gray-50
                      transition-all
                    "
                  >

                    <Upload className="w-4 h-4" />

                    Upload

                  </button>

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

              {/* FOOTER */}
              <div className="p-6 border-t border-gray-200 flex justify-end">

                <button
                  type="submit"

                  disabled={
                    !rating ||
                    !headline.trim() ||
                    !reviewText.trim() ||
                    submitting
                  }

                  className="
                    px-8
                    py-2
                    rounded
                    border
                    border-[#457358]
                    text-[#457358]
                    transition-all
                    cursor-pointer
                    disabled:opacity-60
                    hover:bg-[#d2e16a]
                    hover:text-[#0f261c]
                  "
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Review"}
                </button>

              </div>

            </form>

          </motion.div>

        </motion.div>

      </AnimatePresence>

      {/* LOGIN MODAL */}
      
    </>
  );
}

export default ReviewModal;