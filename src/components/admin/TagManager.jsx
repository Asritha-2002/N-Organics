import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Tag,
  Image as ImageIcon,
  Upload,
  Pencil,
  Trash2,
  Check,
  Sparkles,
  Star,
  Layers3,
  Clock3,
  Loader2,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const FIXED_TAGS = [
  {
    key: "bestseller",
    label: "Best Seller",
    description: "Shown for high-performing and popular products.",
    icon: Star,
    theme: {
      soft: "bg-amber-50 border-amber-100",
      accent: "text-amber-700",
      badge: "bg-amber-100 text-amber-700 border-amber-200",
    },
  },
  {
    key: "new",
    label: "New",
    description: "Used for newly launched products and fresh arrivals.",
    icon: Sparkles,
    theme: {
      soft: "bg-sky-50 border-sky-100",
      accent: "text-sky-700",
      badge: "bg-sky-100 text-sky-700 border-sky-200",
    },
  },
  {
    key: "limited",
    label: "Limited",
    description: "Used for limited edition or short-availability products.",
    icon: Clock3,
    theme: {
      soft: "bg-rose-50 border-rose-100",
      accent: "text-rose-700",
      badge: "bg-rose-100 text-rose-700 border-rose-200",
    },
  },
  {
    key: "combo",
    label: "Combo",
    description: "Used for bundled or multi-product combo offers.",
    icon: Layers3,
    theme: {
      soft: "bg-violet-50 border-violet-100",
      accent: "text-violet-700",
      badge: "bg-violet-100 text-violet-700 border-violet-200",
    },
  },
];

const cn = (...classes) => classes.filter(Boolean).join(" ");

const buildInitialState = (initialTags = {}) =>
  FIXED_TAGS.map((tag) => {
    const existing = initialTags?.[tag.key];
    return {
      ...tag,
      image: existing?.url
        ? {
            preview: existing.url,
            url: existing.url,
            public_id: existing.public_id || "",
            fileName: existing.fileName || `${tag.key}.jpg`,
            existing: true,
            isNew: false,
          }
        : null,
    };
  });

export default function TagManager({ onSaved }) {
  const [tags, setTags] = useState(() => buildInitialState({}));
  const [loading, setLoading] = useState(true); // Added loading state
  const [savingKey, setSavingKey] = useState(null);

  // --- 1. FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/tags`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();

        if (response.ok) {
          // Re-build state with the actual data from the backend
          setTags(buildInitialState(result.data));
        } else {
          toast.error(result.message || "Failed to load tags");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Network error while loading tags");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const filledCount = useMemo(() => tags.filter((tag) => !!tag.image).length, [tags]);

  const handlePickImage = (tagKey, file) => {
    const preview = URL.createObjectURL(file);
    setTags((prev) =>
      prev.map((tag) =>
        tag.key === tagKey
          ? {
              ...tag,
              image: {
                preview,
                file,
                fileName: file.name,
                existing: false,
                isNew: true,
              },
            }
          : tag
      )
    );
  };

  const handleRemoveImage = (tagKey) => {
    setTags((prev) =>
      prev.map((tag) => (tag.key === tagKey ? { ...tag, image: null } : tag))
    );
  };

  const handleSaveTag = async (tagKey) => {
    const target = tags.find((t) => t.key === tagKey);
    if (!target) return;

    try {
      setSavingKey(tagKey);
      const token = localStorage.getItem("token");

      if (!target.image) {
        toast.error("Please upload an image first dear");
        return;
      }

      if (!target.image.file) {
        toast.success(`${target.label} is already saved`);
        return;
      }

      const formData = new FormData();
      formData.append("image", target.image.file);
      formData.append("alt", `${target.label} tag image`);

      const response = await fetch(`${BASE_URL}/admin/tags/${tagKey}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to save");

      toast.success(`${target.label} saved successfully`);

      setTags((prev) =>
        prev.map((tag) =>
          tag.key === tagKey
            ? {
                ...tag,
                image: {
                  preview: result.data?.image?.url || target.image.preview,
                  url: result.data?.image?.url || target.image.preview,
                  public_id: result.data?.image?.public_id || "",
                  fileName: result.data?.image?.fileName || target.image.fileName,
                  existing: true,
                  isNew: false,
                },
              }
            : tag
        )
      );
      onSaved?.(result.data);
    } catch (error) {
      toast.error(error.message || "Something went wrong dear");
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading tag settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Tag Manager</h2>
              <p className="text-sm text-gray-500 mt-1">Manage badge images for product labels.</p>
            </div>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-gray-50 border border-gray-100 text-right">
            <p className="text-lg font-bold text-gray-800">{filledCount}/4</p>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Configured</p>
          </div>
        </div>

        {/* Tags Grid */}
        <div className="px-6 py-6 bg-gray-50/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tags.map((tag) => (
              <div key={tag.key} className="space-y-3">
                <TagImageCard
                  item={tag}
                  onPick={handlePickImage}
                  onRemove={handleRemoveImage}
                />
                <button
                  type="button"
                  onClick={() => handleSaveTag(tag.key)}
                  disabled={savingKey === tag.key}
                  className={cn(
                    "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-sm transition",
                    savingKey === tag.key ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                  )}
                >
                  {savingKey === tag.key ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save {tag.label}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for individual Tag cards
const TagImageCard = ({ item, onPick, onRemove }) => {
  const inputRef = useRef(null);
  const Icon = item.icon;

  return (
    <motion.div layout className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl border", item.theme.soft)}>
            <Icon className={cn("w-5 h-5", item.theme.accent)} />
          </div>
          <h3 className="text-sm font-bold text-gray-800">{item.label}</h3>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs font-semibold text-gray-500 hover:text-emerald-600 transition"
        >
          {item.image ? "Change" : "Upload"}
        </button>
      </div>

      <div className="p-5">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onPick(item.key, file);
            e.target.value = "";
          }}
        />

        {item.image ? (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
              <img src={item.image.preview} alt={item.label} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <span className={cn(
                  "px-2 py-1 rounded-lg text-[10px] font-bold text-white shadow-sm",
                  item.image.isNew ? "bg-emerald-500" : "bg-sky-500"
                )}>
                  {item.image.isNew ? "New Selection" : "Current Badge"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRemove(item.key)}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove Image
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full aspect-video rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-200 transition text-gray-400"
          >
            <ImageIcon className="w-8 h-8" />
            <span className="text-xs font-medium">Upload {item.label} Image</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};