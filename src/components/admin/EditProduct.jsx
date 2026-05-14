import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  X,
  Image as ImageIcon,
  Leaf,
  Box,
  Info,
  Check,
  FolderOpen,
  Layers,
  Video,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ─── Constants ────────────────────────────────────────────────────────────────
const TAGS = ["bestseller", "new", "combo", "limited"];
const TAG_COLORS = {
  bestseller: {
    active: "bg-amber-500 text-white border-amber-500",
    idle: "bg-white text-amber-700 border-amber-300 hover:bg-amber-50",
  },
  new: {
    active: "bg-sky-500 text-white border-sky-500",
    idle: "bg-white text-sky-700 border-sky-300 hover:bg-sky-50",
  },
  combo: {
    active: "bg-violet-500 text-white border-violet-500",
    idle: "bg-white text-violet-700 border-violet-300 hover:bg-violet-50",
  },
  limited: {
    active: "bg-rose-500 text-white border-rose-500",
    idle: "bg-white text-rose-700 border-rose-300 hover:bg-rose-50",
  },
};
const SKIN_TYPES = [
  "all",
  "dry",
  "oily",
  "combination",
  "sensitive",
  "normal",
  "mature",
];
const SKIN_CONCERNS = [
  "acne",
  "anti-aging",
  "brightening",
  "dark-spots",
  "dryness",
  "dullness",
  "hyperpigmentation",
  "pores",
  "redness",
  "sensitivity",
  "uneven-texture",
  "wrinkles",
];
const CLAIMS = [
  "vegan",
  "cruelty-free",
  "paraben-free",
  "sulfate-free",
  "fragrance-free",
  "alcohol-free",
  "dermatologist-tested",
  "hypoallergenic",
  "organic-certified",
  "natural",
  "reef-safe",
  "non-comedogenic",
  "gluten-free",
];
const PACKAGING_TYPES = [
  "bottle",
  "tube",
  "jar",
  "sachet",
  "pump",
  "dropper",
  "spray",
  "box",
  "pouch",
];
const WEIGHT_UNITS = ["ml", "g", "l", "kg", "oz", "fl_oz"];
const TAX_RATES = [0, 5, 12, 18, 28];

const cn = (...c) => c.filter(Boolean).join(" ");

// ─── Shared UI ────────────────────────────────────────────────────────────────
const SectionCard = ({
  icon: Icon,
  title,
  color = "emerald",
  children,
  defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const gradients = {
    emerald: "from-emerald-500 to-teal-600",
    amber: "from-amber-500 to-orange-500",
    sky: "from-sky-500 to-blue-600",
    rose: "from-rose-500 to-pink-600",
    violet: "from-violet-500 to-purple-600",
    slate: "from-slate-500 to-gray-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-xl bg-gradient-to-br text-white shadow-sm",
              gradients[color],
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-semibold text-gray-800 text-sm">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 pb-6 pt-2 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Field = ({ label, required, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
      {label}
      {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={cn(
      "w-full px-3 py-2.5 rounded-xl  text-base sm:text-sm border border-gray-200 bg-gray-50 text-sm text-gray-800",
      "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition",
      className,
    )}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={cn(
      "w-full px-3 py-2.5 rounded-xl  text-base sm:text-sm border border-gray-200 bg-gray-50 text-sm text-gray-800",
      "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition resize-none",
      className,
    )}
    {...props}
  />
);

const SelectEl = ({ children, className = "", ...props }) => (
  <div className="relative">
    <select
      className={cn(
        "w-full appearance-none px-3 py-2.5 pr-9 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800",
        "focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition",
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
);

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <div
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-10 h-5 rounded-full transition-colors duration-200",
        checked ? "bg-emerald-500" : "bg-gray-200",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </div>
    {label && <span className="text-sm text-gray-700">{label}</span>}
  </label>
);

const PillToggle = ({ value, options, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => {
      const active = Array.isArray(value) ? value.includes(opt) : false;
      return (
        <button
          key={opt}
          type="button"
          onClick={() =>
            onChange(active ? value.filter((v) => v !== opt) : [...value, opt])
          }
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-medium border capitalize transition",
            active
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300",
          )}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

// ─── Single Image Upload (for category image) ─────────────────────────────────
const SingleImageUpload = ({ file, onAdd, onRemove, label, hint }) => {
  const ref = useRef();
  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    onAdd({
      id: Date.now(),
      file: f,
      preview: URL.createObjectURL(f),
      existing: false,
    });
  };
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </label>
      )}
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => ref.current?.click()}
          className="flex flex-col items-center justify-center gap-2 py-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-emerald-300 bg-gray-50 cursor-pointer transition"
        >
          <input
            ref={ref}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div className="p-2.5 rounded-xl bg-gray-100">
            <ImageIcon className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 text-center font-medium">
            {hint || "Click or drag to upload"}
          </p>
          <p className="text-xs text-gray-400">Single image · PNG, JPG, WEBP</p>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 group">
          <img src={file.preview} alt="" className="w-full h-36 object-cover" />
          {file.existing && (
            <span className="absolute top-2 right-2 text-[9px] bg-sky-500 text-white px-1.5 py-0.5 rounded-md font-bold">
              Saved
            </span>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/90 rounded-xl text-xs font-semibold text-gray-700 hover:bg-white transition"
            >
              <ImageIcon className="w-3.5 h-3.5" /> Change
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="p-2 bg-red-500 rounded-xl text-white hover:bg-red-600 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            ref={ref}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-white text-xs font-medium truncate">
              {file.file?.name || "Existing image"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Multi Image Manager (product + variant images) ───────────────────────────
const ImageManager = ({
  images,
  onAdd,
  onRemove,
  label = "Upload images",
  hint,
}) => {
  const ref = useRef();
  const handleFiles = (fileList) => {
    const arr = Array.from(fileList).map((f) => ({
      id: Date.now() + Math.random(),
      file: f,
      preview: URL.createObjectURL(f),
      existing: false,
    }));
    onAdd(arr);
  };
  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => ref.current.click()}
        className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 border-dashed border-gray-200 hover:border-emerald-300 bg-gray-50 cursor-pointer transition"
      >
        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <ImageIcon className="w-6 h-6 text-gray-300" />
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        {hint && <p className="text-xs text-gray-400">{hint}</p>}
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {images.map((f, i) => (
            <div
              key={f.id || i}
              className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-square"
            >
              <img
                src={f.preview}
                alt=""
                className="w-full h-full object-cover"
              />
              {f.existing && (
                <span className="absolute top-1 right-1 text-[9px] bg-sky-500 text-white px-1.5 py-0.5 rounded-md font-bold">
                  Saved
                </span>
              )}
              {i === 0 && !f.existing && (
                <span className="absolute top-1 left-1 text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-md font-bold">
                  Main
                </span>
              )}
              {i === 0 && f.existing && (
                <span className="absolute top-1 left-1 text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-md font-bold">
                  Main
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onRemove(f.id ?? i)}
                  className="p-1.5 bg-red-500 rounded-lg text-white"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const VideoManager = ({
  videos,
  onAdd,
  onRemove,
  label = "Upload videos",
  hint,
}) => {
  const ref = useRef();

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList).map((f) => ({
      id: Date.now() + Math.random(),
      file: f,
      preview: URL.createObjectURL(f),
      existing: false,
    }));

    onAdd(arr);
  };

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => ref.current.click()}
        className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 border-dashed border-violet-200 hover:border-violet-400 bg-violet-50/40 cursor-pointer transition"
      >
        <input
          ref={ref}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <Video className="w-6 h-6 text-violet-400" />

        <p className="text-sm text-violet-700 font-medium">{label}</p>

        {hint && <p className="text-xs text-violet-500">{hint}</p>}
      </div>

      {/* Preview Videos */}
      {videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {videos.map((f, i) => (
            <div
              key={f.id || i}
              className="relative group rounded-2xl overflow-hidden border border-violet-100 bg-gray-100"
            >
              <video
                src={f.preview || f.url}
                controls
                className="w-full h-44 object-cover"
              />

              {/* Saved Badge */}
              {f.existing && (
                <span className="absolute top-2 right-2 text-[10px] bg-sky-500 text-white px-2 py-0.5 rounded-md font-bold">
                  Saved
                </span>
              )}

              {/* Main Badge */}
              {i === 0 && (
                <span className="absolute top-2 left-2 text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-md font-bold">
                  Main
                </span>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onRemove(f.id ?? i)}
                  className="p-2 bg-red-500 rounded-xl text-white hover:bg-red-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Variant Editor ───────────────────────────────────────────────────────────
const VariantEditor = ({
  variant,
  index,
  variantImages,
  onVariantChange,
  onVariantImageAdd,
  onVariantImageRemove,
  onRemove,
  isOnly,
}) => {
  const setV = (path, val) => {
    const keys = path.split(".");
    const updated = { ...variant };
    let obj = updated;
    keys.slice(0, -1).forEach((k) => {
      obj[k] = { ...obj[k] };
      obj = obj[k];
    });
    obj[keys[keys.length - 1]] = val;
    onVariantChange(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden"
    >
      {/* Variant header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-gray-700">
            Variant {index + 1}{" "}
            {variant.sku && (
              <span className="text-gray-400 font-normal">— {variant.sku}</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Toggle
            checked={!!variant.isDefault}
            onChange={(v) => setV("isDefault", v)}
            label="Default"
          />
          {!isOnly && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* SKU + Barcode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Field label="SKU" required>
            <Input
              required
              placeholder="PROD-50ML"
              value={variant.sku || ""}
              onChange={(e) => setV("sku", e.target.value.toUpperCase())}
            />
          </Field>
          <Field label="Barcode">
            <Input
              placeholder="8901234567890"
              value={variant.barcode || ""}
              onChange={(e) => setV("barcode", e.target.value)}
            />
          </Field>
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Field label="Size">
            {" "}
            <Input
              placeholder="50ml"
              value={variant.attributes?.size || ""}
              onChange={(e) => setV("attributes.size", e.target.value)}
            />
          </Field>
          <Field label="Shade">
            {" "}
            <Input
              placeholder="Rose Beige"
              value={variant.attributes?.shade || ""}
              onChange={(e) => setV("attributes.shade", e.target.value)}
            />
          </Field>
          <Field label="Scent">
            {" "}
            <Input
              placeholder="Lavender"
              value={variant.attributes?.scent || ""}
              onChange={(e) => setV("attributes.scent", e.target.value)}
            />
          </Field>
          <Field label="Pack Of">
            {" "}
            <Input
              type="number"
              min="1"
              placeholder="1"
              onWheel={(e) => e.target.blur()}
              value={variant.attributes?.packOf || ""}
              onChange={(e) => setV("attributes.packOf", e.target.value)}
            />
          </Field>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Field label="MRP (₹)" required>
            <Input
              required
              type="number"
              min="0"
              placeholder="599"
              onWheel={(e) => e.target.blur()}
              value={variant.price?.mrp ?? ""}
              onChange={(e) => setV("price.mrp", e.target.value)}
            />
          </Field>
          <Field label="Selling Price (₹)" required>
            <Input
              required
              type="number"
              min="0"
              placeholder="399"
              onWheel={(e) => e.target.blur()}
              value={variant.price?.sellingPrice ?? ""}
              onChange={(e) => setV("price.sellingPrice", e.target.value)}
            />
          </Field>
        </div>

        {/* Stock + Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Field label="Stock Qty">
            <Input
              type="number"
              min="0"
              placeholder="100"
              onWheel={(e) => e.target.blur()}
              value={variant.stock?.quantity ?? ""}
              onChange={(e) => setV("stock.quantity", e.target.value)}
            />
          </Field>
          <Field label="Low Stock Alert">
            <Input
              type="number"
              min="0"
              placeholder="10"
              onWheel={(e) => e.target.blur()}
              value={variant.stock?.lowStockAlert ?? ""}
              onChange={(e) => setV("stock.lowStockAlert", e.target.value)}
            />
          </Field>
        </div>

        <div className="space-y-4 pt-2">
          {/* Active Status */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {variant.isActive ? "Variant Active" : "Variant Inactive"}
              </p>

              <p className="text-xs text-gray-500 mt-0.5">
                {variant.isActive
                  ? "This variant is available for customers."
                  : "This variant will be hidden from customers."}
              </p>
            </div>

            <Toggle
              checked={!!variant.isActive}
              onChange={(v) => setV("isActive", v)}
              label=""
            />
          </div>

          {/* Variant Labels */}
          <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Variant Labels
                </p>

                <p className="text-xs text-gray-500">
                  Control how this variant appears in the store.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={() => setV("isFeatured", !variant.isFeatured)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold border transition-all",
                  variant.isFeatured
                    ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50",
                )}
              >
                Featured
              </button>

              <button
                type="button"
                onClick={() => setV("isBestseller", !variant.isBestseller)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold border transition-all",
                  variant.isBestseller
                    ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:bg-amber-50",
                )}
              >
                Bestseller
              </button>

              <button
                type="button"
                onClick={() => setV("isNewArrival", !variant.isNewArrival)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold border transition-all",
                  variant.isNewArrival
                    ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-sky-300 hover:bg-sky-50",
                )}
              >
                New Arrival
              </button>

              <button
                type="button"
                onClick={() => setV("isLimited", !variant.isLimited)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold border transition-all",
                  variant.isLimited
                    ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:bg-rose-50",
                )}
              >
                Limited
              </button>
            </div>
          </div>
        </div>
        {/* ── Variant Images ── */}
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Variant Images{" "}
            <span className="text-gray-300 font-normal">
              (optional — overrides product images)
            </span>
          </p>
          <ImageManager
            images={variantImages}
            onAdd={onVariantImageAdd}
            onRemove={onVariantImageRemove}
            label={`Upload images for ${variant.sku || `Variant ${index + 1}`}`}
            hint="Drag & drop or click"
          />
        </div>
      </div>
    </motion.div>
  );
};

// ─── Ingredient Row ───────────────────────────────────────────────────────────
const IngredientRow = ({ ing, onChange, onRemove }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end p-3 rounded-xl bg-gray-50 border border-gray-100">
    <div className="col-span-3">
      <Field label="Name" required>
        {" "}
        <Input
          placeholder="Aloe Vera"
          value={ing.name || ""}
          onChange={(e) => onChange({ ...ing, name: e.target.value })}
          required
        />
      </Field>
    </div>
    <div className="col-span-3">
      <Field label="INCI">
        {" "}
        <Input
          placeholder="INCI"
          value={ing.inci || ""}
          onChange={(e) => onChange({ ...ing, inci: e.target.value })}
        />
      </Field>
    </div>
    <div className="col-span-2">
      <Field label="Benefit">
        <Input
          placeholder="Hydrates"
          value={ing.benefit || ""}
          onChange={(e) => onChange({ ...ing, benefit: e.target.value })}
        />
      </Field>
    </div>
    <div className="col-span-1">
      <Field label="%">
        {" "}
        <Input
          type="number"
          min="0"
          max="100"
          placeholder="5"
          onWheel={(e) => e.target.blur()}
          value={ing.percentage ?? ""}
          onChange={(e) => onChange({ ...ing, percentage: e.target.value })}
        />
      </Field>
    </div>
    <div className="col-span-2 pb-1">
      <Toggle
        checked={!!ing.isKeyActive}
        onChange={(v) => onChange({ ...ing, isKeyActive: v })}
        label={<span className="text-xs text-gray-500">Key</span>}
      />
    </div>
    <div className="col-span-1 pb-1">
      <button
        type="button"
        onClick={onRemove}
        className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);

// ─── Edit Product Form ────────────────────────────────────────────────────────
function EditProductForm({
  product,
  onClose,
  fetchProducts,
  fetchCategories,
  fetchStats,
}) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    subCategory: "",
    tag: null,
    shortDescription: "",
    description: "",
    highlights: [""],
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    isActive: true,
    isLimited: false,
    hsn: "",
    taxRate: 18,
    skincareDetails: {
      skinType: [],
      skinConcerns: [],
      claims: [],
      usage: { howToUse: "", frequency: "", whenToApply: "", amountToUse: "" },
      shelfLife: { months: "", paoMonths: "" },
      certifications: "",
      countryOfOrigin: "India",
      madeWithoutList: "",
    },
    packaging: {
      type: "",
      material: "",
      isRecyclable: false,
      dimensions: { length: "", width: "", height: "" },
      shippingWeight: "",
    },
  });

  const [variants, setVariants] = useState([]);
  const [variantImageGroups, setVariantImageGroups] = useState([]); // array of arrays
  const [ingredients, setIngredients] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [categoryImage, setCategoryImage] = useState(null);

  // ── Prefill ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!product) return;

    setForm({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      tag: product.tag || null,
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      highlights: product.highlights?.length ? product.highlights : [""],
      isFeatured: product.isFeatured ?? false,
      isBestseller: product.isBestseller ?? false,
      isNewArrival: product.isNewArrival ?? false,
      isActive: product.isActive ?? true,
      isLimited: product.isLimited ?? false,
      hsn: product.hsn || "",
      taxRate: product.taxRate ?? 18,
      skincareDetails: {
        skinType: product.skincareDetails?.skinType || [],
        skinConcerns: product.skincareDetails?.skinConcerns || [],
        claims: product.skincareDetails?.claims || [],
        usage: {
          howToUse: product.skincareDetails?.usage?.howToUse || "",
          frequency: product.skincareDetails?.usage?.frequency || "",
          whenToApply: product.skincareDetails?.usage?.whenToApply || "",
          amountToUse: product.skincareDetails?.usage?.amountToUse || "",
        },
        shelfLife: {
          months: product.skincareDetails?.shelfLife?.months || "",
          paoMonths: product.skincareDetails?.shelfLife?.paoMonths || "",
        },
        certifications: product.skincareDetails?.certifications || "",
        countryOfOrigin: product.skincareDetails?.countryOfOrigin || "India",
        madeWithoutList: product.skincareDetails?.madeWithoutList || "",
      },
      packaging: {
        type: product.packaging?.type || "",
        material: product.packaging?.material || "",
        isRecyclable: product.packaging?.isRecyclable ?? false,
        dimensions: {
          length: product.packaging?.dimensions?.length || "",
          width: product.packaging?.dimensions?.width || "",
          height: product.packaging?.dimensions?.height || "",
        },
        shippingWeight: product.packaging?.shippingWeight || "",
      },
    });

    // Product images
    setImages(
      product.images?.map((img, idx) => ({
        id: `existing-prod-${idx}`,
        preview: img.url,
        existing: true,
        public_id: img.public_id,
      })) || [],
    );

    setVideos(
      product.videos?.map((vid, idx) => ({
        id: `existing-video-${idx}`,
        preview: vid.url,
        existing: true,
        public_id: vid.public_id,
        title: vid.title,
      })) || [],
    );

    // Category image — prefill from db
    if (product.categoryImage?.image?.url) {
      setCategoryImage({
        id: "existing-cat",
        preview: product.categoryImage.image.url,
        existing: true,
        public_id: product.categoryImage.image.public_id,
        altText: product.categoryImage.image.altText || "",
      });
    }

    // Variants + their images
    const vArr = product.variants?.map((v) => ({ ...v })) || [];
    setVariants(vArr);
    setVariantImageGroups(
      vArr.map((v) =>
        (v.images || []).map((img, idx) => ({
          id: `existing-vimg-${v._id || idx}-${idx}`,
          preview: img.url,
          existing: true,
          public_id: img.public_id,
          altText: img.altText || "",
        })),
      ),
    );

    setIngredients(product.ingredients?.map((i) => ({ ...i })) || []);
  }, [product]);

  const set = (path, val) => {
    const keys = path.split(".");
    setForm((prev) => {
      const next = { ...prev };
      let obj = next;
      keys.slice(0, -1).forEach((k) => {
        obj[k] = { ...obj[k] };
        obj = obj[k];
      });
      obj[keys[keys.length - 1]] = val;
      return next;
    });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tag) {
      toast.error("Please select a product tag");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const cleanedVariants = variants.map(
        ({ _id, createdAt, updatedAt, images: _vi, ...v }) => ({
          ...v,
          price: {
            mrp: Number(v.price?.mrp || 0),
            sellingPrice: Number(v.price?.sellingPrice || 0),
          },
          stock: {
            quantity: Number(v.stock?.quantity || 0),
            lowStockAlert: Number(v.stock?.lowStockAlert || 10),
          },
          weight: {
            value: Number(v.weight?.value || 0),
            unit: v.weight?.unit || "ml",
          },
          isDefault: !!v.isDefault,
          isActive: v.isActive !== false,
        }),
      );

      const cleanedIngredients = ingredients.map(({ _id, ...i }) => ({
        ...i,
        percentage:
          i.percentage !== "" && i.percentage !== undefined
            ? Number(i.percentage)
            : undefined,
        isKeyActive: !!i.isKeyActive,
      }));

      const fd = new FormData();
      fd.append("name", form.name || "");
      fd.append("brand", form.brand || "");
      fd.append("category", form.category || "");
      fd.append("subCategory", form.subCategory || "");
      fd.append("tag", form.tag || "");
      fd.append("shortDescription", form.shortDescription || "");
      fd.append("description", form.description || "");
      fd.append("hsn", form.hsn || "");
      fd.append("taxRate", String(form.taxRate));
      fd.append("isActive", String(form.isActive));
      fd.append("isFeatured", String(form.isFeatured));
      fd.append("isBestseller", String(form.isBestseller));
      fd.append("isNewArrival", String(form.isNewArrival));
      fd.append("isLimited", String(form.isLimited));
      fd.append("highlights", JSON.stringify(form.highlights));
      fd.append("skincareDetails", JSON.stringify(form.skincareDetails));
      fd.append("packaging", JSON.stringify(form.packaging));
      fd.append("variants", JSON.stringify(cleanedVariants));
      fd.append("ingredients", JSON.stringify(cleanedIngredients));

      // Existing product image public_ids to keep
      const existingPids = images
        .filter((img) => img.existing && img.public_id)
        .map((img) => img.public_id);
      fd.append("existingImages", JSON.stringify(existingPids));

      // New product images
      images.forEach((img) => {
        if (!img.existing && img.file) fd.append("images", img.file);
      });

      // Existing videos public_ids to keep
      const existingVideoPids = videos
        .filter((vid) => vid.existing && vid.public_id)
        .map((vid) => vid.public_id);

      fd.append("existingVideos", JSON.stringify(existingVideoPids));

      // New product videos
      videos.forEach((vid) => {
        if (!vid.existing && vid.file) {
          fd.append("videos", vid.file);
        }
      });

      // Category image
      if (categoryImage && !categoryImage.existing && categoryImage.file) {
        fd.append("categoryImage", categoryImage.file);
        fd.append("categoryImageAlt", categoryImage.altText || "");
      }

      // Variant images — new uploads only, matched by variant index
      variantImageGroups.forEach((group, variantIndex) => {
        // Tell backend which existing variant images to keep
        const existingVariantPids = group
          .filter((img) => img.existing && img.public_id)
          .map((img) => img.public_id);
        fd.append(
          `existingVariantImages_${variantIndex}`,
          JSON.stringify(existingVariantPids),
        );

        // Upload new variant images with named field
        group.forEach((img) => {
          if (!img.existing && img.file) {
            fd.append(`variantImage_${variantIndex}`, img.file); // ← named field with index
            fd.append(
              `variantImageAlt_${variantIndex}_${img.file.name}`,
              img.altText || "",
            );
          }
        });
      });

      const response = await fetch(
        `${BASE_URL}/admin/products/${product._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to update product");

      toast.success(result.message || "Product updated successfully ✅");
      setSubmitted(true);
      fetchProducts?.();
      fetchCategories?.();
      fetchStats?.();
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1200);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const emptyVariant = () => ({
    id: Date.now() + Math.random(),
    sku: "",
    attributes: { size: "", shade: "", scent: "", packOf: "" },
    price: { mrp: "", sellingPrice: "" },
    stock: { quantity: "", lowStockAlert: 10 },
    weight: { value: "", unit: "ml" },
    barcode: "",
    isDefault: false,
    isActive: true,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    isLimited: false,
  });

  const emptyIngredient = () => ({
    id: Date.now() + Math.random(),
    name: "",
    inci: "",
    percentage: "",
    isKeyActive: false,
    benefit: "",
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ── Basic Info ── */}
      <SectionCard icon={Info} title="Basic Information" color="emerald">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Product Name" required>
            <Input
              required
              placeholder="Vitamin C Glow Serum"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>
          <Field label="Brand">
            <Input
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Category" required>
            <Input
              required
              placeholder="Face Serum"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            />
          </Field>
          <Field label="Sub Category">
            <Input
              placeholder="Vitamin C"
              value={form.subCategory}
              onChange={(e) => set("subCategory", e.target.value)}
            />
          </Field>
        </div>

        {/* Tag selector */}
        <Field
          label="Product Tag"
          hint="Pick one — shown as a badge on the product card"
          required
        >
          <div className="flex flex-wrap gap-2">
            {TAGS.map((opt) => {
              const active = form.tag === opt;
              const tc = TAG_COLORS[opt];
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => set("tag", active ? null : opt)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold border capitalize transition-all",
                    active ? tc.active : tc.idle,
                  )}
                >
                  {opt}
                </button>
              );
            })}
            {form.tag && (
              <button
                type="button"
                onClick={() => set("tag", null)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium border border-gray-200 text-gray-400 hover:bg-gray-50 transition"
              >
                <X className="w-3 h-3 inline mr-1" />
                Clear
              </button>
            )}
          </div>
        </Field>

        <Field label="Short Description" hint="Max 300 chars">
          <Textarea
            rows={2}
            maxLength={300}
            placeholder="A lightweight, fast-absorbing serum…"
            value={form.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
          />
        </Field>
        <Field label="Full Description">
          <Textarea
            rows={4}
            placeholder="Write detailed product description…"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>

        {/* Highlights */}
        <Field label="Highlights" hint="Key bullet points">
          <div className="space-y-2">
            {form.highlights.map((h, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <Input
                  placeholder="e.g. 24-hr hydration"
                  value={h}
                  onChange={(e) => {
                    const arr = [...form.highlights];
                    arr[i] = e.target.value;
                    set("highlights", arr);
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "highlights",
                      form.highlights.filter((_, idx) => idx !== i),
                    )
                  }
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => set("highlights", [...form.highlights, ""])}
              className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> Add highlight
            </button>
          </div>
        </Field>

        {/* Toggles */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-800">
              {form.isActive ? "Active" : "Inactive"}
            </p>
            <p className="text-xs text-gray-500">
              {form.isActive
                ? "This product will be available in active state."
                : "This product will be saved as inactive."}
            </p>
          </div>

          <Toggle
            checked={form.isActive}
            onChange={(v) => set("isActive", v)}
            label=""
          />
        </div>
      </SectionCard>

      {/* ── Images & Category Image ── */}
      <SectionCard
        icon={ImageIcon}
        title="Images, Videos & Category Image"
        color="sky"
        defaultOpen={false}
      >
        {/* Product Images */}
        <Field label="Product Images" hint="First image = main display image">
          <ImageManager
            images={images}
            onAdd={(arr) => setImages((p) => [...p, ...arr])}
            onRemove={(idOrIdx) =>
              setImages((p) => p.filter((f, i) => (f.id ?? i) !== idOrIdx))
            }
            label="Upload product images"
            hint="Drag & drop or click · 'Saved' = already on server"
          />
        </Field>

        {/* Videos Section */}
        <Field label="Product Videos" hint="First video = main display video">
          <VideoManager
            videos={videos}
            onAdd={(arr) => setVideos((p) => [...p, ...arr])}
            onRemove={(idOrIdx) =>
              setVideos((p) => p.filter((f, i) => (f.id ?? i) !== idOrIdx))
            }
            label="Upload product videos"
            hint="Drag & drop or click · 'Saved' = already on server"
          />
        </Field>

        {/* Category Image */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3 mt-6">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-emerald-600" />

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Category Image
            </span>

            {form.category && (
              <span className="ml-auto text-[11px] text-emerald-600 font-medium">
                for "{form.category}"
              </span>
            )}
          </div>

          <SingleImageUpload
            file={categoryImage}
            onAdd={setCategoryImage}
            onRemove={() => setCategoryImage(null)}
            hint={
              form.category
                ? `Representative image for "${form.category}" category pages`
                : "Enter category name above first"
            }
          />

          {categoryImage?.existing && (
            <p className="text-[11px] text-sky-600 font-medium">
              ℹ️ Current saved image shown. Upload a new one to replace it.
            </p>
          )}
        </div>
      </SectionCard>

      {/* ── Variants (with per-variant images) ── */}
      <SectionCard icon={Box} title="Variants & Pricing" color="amber">
        <AnimatePresence>
          {variants.map((v, i) => (
            <VariantEditor
              key={v._id || v.id || i}
              variant={v}
              index={i}
              isOnly={variants.length === 1}
              variantImages={variantImageGroups[i] || []}
              onVariantChange={(updated) => {
                const arr = [...variants];
                if (updated.isDefault)
                  arr.forEach((x) => (x.isDefault = false));
                arr[i] = updated;
                setVariants(arr);
              }}
              onVariantImageAdd={(arr) => {
                setVariantImageGroups((prev) => {
                  const g = [...prev];
                  g[i] = [...(g[i] || []), ...arr];
                  return g;
                });
              }}
              onVariantImageRemove={(idOrIdx) => {
                setVariantImageGroups((prev) => {
                  const g = [...prev];
                  g[i] = (g[i] || []).filter(
                    (f, fi) => (f.id ?? fi) !== idOrIdx,
                  );
                  return g;
                });
              }}
              onRemove={() => {
                setVariants(variants.filter((_, idx) => idx !== i));
                setVariantImageGroups((prev) =>
                  prev.filter((_, idx) => idx !== i),
                );
              }}
            />
          ))}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => {
            setVariants([...variants, emptyVariant()]);
            setVariantImageGroups((prev) => [...prev, []]);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-sm font-medium transition w-full justify-center"
        >
          <Plus className="w-4 h-4" /> Add Variant
        </button>
      </SectionCard>

      {/* ── Skincare ── */}
      <SectionCard
        icon={Leaf}
        title="Skincare Details"
        color="emerald"
        defaultOpen={false}
      >
        <Field label="Skin Type">
          {" "}
          <PillToggle
            value={form.skincareDetails.skinType}
            options={SKIN_TYPES}
            onChange={(v) => set("skincareDetails.skinType", v)}
          />
        </Field>
        <Field label="Skin Concerns">
          <PillToggle
            value={form.skincareDetails.skinConcerns}
            options={SKIN_CONCERNS}
            onChange={(v) => set("skincareDetails.skinConcerns", v)}
          />
        </Field>
        <Field label="Claims">
          {" "}
          <PillToggle
            value={form.skincareDetails.claims}
            options={CLAIMS}
            onChange={(v) => set("skincareDetails.claims", v)}
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Frequency">
            {" "}
            <Input
              placeholder="Twice daily"
              value={form.skincareDetails.usage.frequency}
              onChange={(e) =>
                set("skincareDetails.usage.frequency", e.target.value)
              }
            />
          </Field>
          <Field label="When To Apply">
            {" "}
            <Input
              placeholder="Morning & Night"
              value={form.skincareDetails.usage.whenToApply}
              onChange={(e) =>
                set("skincareDetails.usage.whenToApply", e.target.value)
              }
            />
          </Field>
          <Field label="Amount To Use">
            {" "}
            <Input
              placeholder="Pea-sized amount"
              value={form.skincareDetails.usage.amountToUse}
              onChange={(e) =>
                set("skincareDetails.usage.amountToUse", e.target.value)
              }
            />
          </Field>
          <Field label="Country of Origin">
            <Input
              value={form.skincareDetails.countryOfOrigin}
              onChange={(e) =>
                set("skincareDetails.countryOfOrigin", e.target.value)
              }
            />
          </Field>
        </div>
        <Field label="How To Use">
          <Textarea
            rows={3}
            placeholder="Step 1: Cleanse face…"
            value={form.skincareDetails.usage.howToUse}
            onChange={(e) =>
              set("skincareDetails.usage.howToUse", e.target.value)
            }
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Shelf Life (months)">
            <Input
              type="number"
              placeholder="24"
              onWheel={(e) => e.target.blur()}
              value={form.skincareDetails.shelfLife.months}
              onChange={(e) =>
                set("skincareDetails.shelfLife.months", e.target.value)
              }
            />
          </Field>
          <Field label="PAO (months)">
            {" "}
            <Input
              type="number"
              placeholder="12"
              onWheel={(e) => e.target.blur()}
              value={form.skincareDetails.shelfLife.paoMonths}
              onChange={(e) =>
                set("skincareDetails.shelfLife.paoMonths", e.target.value)
              }
            />
          </Field>
        </div>
        <Field label="Certifications" hint="Comma-separated">
          <Input
            placeholder="USDA Organic, ECOCERT"
            value={form.skincareDetails.certifications}
            onChange={(e) =>
              set("skincareDetails.certifications", e.target.value)
            }
          />
        </Field>
        <Field label="Free From" hint="Comma-separated">
          <Input
            placeholder="Mineral Oil, SLS"
            value={form.skincareDetails.madeWithoutList}
            onChange={(e) =>
              set("skincareDetails.madeWithoutList", e.target.value)
            }
          />
        </Field>
      </SectionCard>

      {/* ── Ingredients ── */}
      <SectionCard
        icon={Leaf}
        title="Ingredients (INCI List)"
        color="rose"
        defaultOpen={false}
      >
        <AnimatePresence>
          {ingredients.map((ing, idx) => (
            <IngredientRow
              key={ing._id || ing.id || idx}
              ing={ing}
              onChange={(updated) =>
                setIngredients(
                  ingredients.map((x, i) => (i === idx ? updated : x)),
                )
              }
              onRemove={() =>
                setIngredients(ingredients.filter((_, i) => i !== idx))
              }
            />
          ))}
        </AnimatePresence>
        {ingredients.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No ingredients yet.
          </p>
        )}
        <button
          type="button"
          onClick={() => setIngredients([...ingredients, emptyIngredient()])}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-rose-200 text-rose-500 hover:bg-rose-50 text-sm font-medium transition w-full justify-center"
        >
          <Plus className="w-4 h-4" /> Add Ingredient
        </button>
      </SectionCard>

      {/* ── Packaging ── */}
      <SectionCard
        icon={Box}
        title="Packaging, Shipping & Tax"
        color="slate"
        defaultOpen={false}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Package Type">
            <SelectEl
              value={form.packaging.type}
              onChange={(e) => set("packaging.type", e.target.value)}
            >
              <option value="">Select…</option>
              {PACKAGING_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </SelectEl>
          </Field>
          <Field label="Material">
            {" "}
            <Input
              placeholder="Glass"
              value={form.packaging.material}
              onChange={(e) => set("packaging.material", e.target.value)}
            />
          </Field>
          {/* <Field label="Shipping Wt (g)"> <Input type="number" placeholder="180" onWheel={(e) => e.target.blur()} value={form.packaging.shippingWeight} onChange={(e) => set("packaging.shippingWeight", e.target.value)} /></Field>
          <Field label="Length (cm)">     <Input type="number" placeholder="5"   onWheel={(e) => e.target.blur()} value={form.packaging.dimensions.length} onChange={(e) => set("packaging.dimensions.length", e.target.value)} /></Field>
          <Field label="Width (cm)">      <Input type="number" placeholder="5"   onWheel={(e) => e.target.blur()} value={form.packaging.dimensions.width}  onChange={(e) => set("packaging.dimensions.width",  e.target.value)} /></Field>
          <Field label="Height (cm)">     <Input type="number" placeholder="12"  onWheel={(e) => e.target.blur()} value={form.packaging.dimensions.height} onChange={(e) => set("packaging.dimensions.height", e.target.value)} /></Field> */}
        </div>
        <Toggle
          checked={form.packaging.isRecyclable}
          onChange={(v) => set("packaging.isRecyclable", v)}
          label="Recyclable packaging"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
          <Field label="HSN Code">
            <Input
              placeholder="33049910"
              value={form.hsn}
              onChange={(e) => set("hsn", e.target.value)}
            />
          </Field>
          <Field label="GST Tax Rate (%)">
            <SelectEl
              value={form.taxRate}
              onChange={(e) => set("taxRate", Number(e.target.value))}
            >
              {TAX_RATES.map((r) => (
                <option key={r} value={r}>
                  {r}%
                </option>
              ))}
            </SelectEl>
          </Field>
        </div>
      </SectionCard>

      {/* ── Footer ── */}
      <div
        className="flex
flex-col-reverse
sm:flex-row
items-stretch
sm:items-center
justify-end
gap-3 sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition",
            submitted
              ? "bg-emerald-500"
              : "bg-emerald-600 hover:bg-emerald-700",
            loading && "opacity-70 cursor-not-allowed",
          )}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{" "}
              Saving…
            </>
          ) : submitted ? (
            <>
              <Check className="w-4 h-4" /> Updated!
            </>
          ) : (
            <>
              <Package className="w-4 h-4" /> Update Product
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ─── Modal Wrapper ────────────────────────────────────────────────────────────
export default function EditProduct({
  open,
  onClose,
  product,
  fetchProducts,
  fetchCategories,
  fetchStats,
}) {
  if (!open || !product) return null;
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="edit-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            key="edit-modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="
fixed inset-0 z-50
flex items-start justify-center
overflow-y-auto
p-2 sm:p-4 md:p-6
"
          >
            <div className="w-full max-w-4xl bg-gray-50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div
                className="flex
flex-col
sm:flex-row
sm:items-center
justify-between
gap-3 bg-white px-6 py-5 border-b border-gray-100 sticky top-0 z-10"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Edit Product
                    </h2>
                    <p className="text-xs text-gray-400 truncate max-w-xs">
                      {product.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Body */}
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[85vh] sm:max-h-[80vh]">
                <EditProductForm
                  product={product}
                  onClose={onClose}
                  fetchProducts={fetchProducts}
                  fetchCategories={fetchCategories}
                  fetchStats={fetchStats}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
