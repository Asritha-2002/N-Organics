
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Tag, Percent, Calendar, Users, Layers,
  ChevronDown, ChevronUp, Check, X, Plus, Loader2,
  Info, Package, ToggleLeft, ToggleRight, Gift,
  Upload, Trash2, ImageIcon,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const cn = (...c) => c.filter(Boolean).join(" ");

const formatDateTimeLocal = (dateString) => {
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
};

const Field = ({ label, required, hint, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
      {label}
      {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
    {hint  && !error && <p className="text-xs text-gray-400">{hint}</p>}
    {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
  </div>
);

const Input = ({ className = "", error, ...props }) => (
  <input
    className={cn(
      "w-full min-w-0 appearance-none px-3 py-2.5 pr-9 rounded-xl border text-sm text-gray-800 bg-gray-50",
      "placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition",
      error
        ? "border-rose-300 focus:ring-rose-400"
        : "border-gray-200 focus:ring-emerald-400",
      className
    )}
    {...props}
  />
);

const SelectEl = ({ children, error, className = "", ...props }) => (
  <div className="relative">
    <select
      className={cn(
        "w-full appearance-none px-3 py-2.5 pr-9 rounded-xl border text-sm text-gray-800 bg-gray-50",
        "focus:outline-none focus:ring-2 focus:border-transparent transition",
        error
          ? "border-rose-300 focus:ring-rose-400"
          : "border-gray-200 focus:ring-emerald-400",
        className
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
);

const Toggle = ({ checked, onChange, label, hint }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
    <div>
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0",
        checked ? "bg-emerald-500" : "bg-gray-300"
      )}
    >
      <span className={cn(
        "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200",
        checked ? "translate-x-5" : "translate-x-0"
      )} />
    </button>
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({ icon: Icon, title, color = "emerald", children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  const gradients = {
    emerald: "from-emerald-500 to-teal-600",
    amber:   "from-amber-500 to-orange-500",
    sky:     "from-sky-500 to-blue-600",
    rose:    "from-rose-500 to-pink-600",
    violet:  "from-violet-500 to-purple-600",
    slate:   "from-slate-500 to-gray-600",
    pink:    "from-pink-500 to-fuchsia-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 sm:px-5 lg:px-6 py-4 hover:bg-gray-50 transition gap-3">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl bg-gradient-to-br text-white shadow-sm", gradients[color])}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-semibold text-gray-800 text-sm">{title}</span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400" />
          : <ChevronDown className="w-4 h-4 text-gray-400" />}
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
            <div className="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6 pt-2 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Category Checkbox Grid ───────────────────────────────────────────────────
const CategoryCheckboxGrid = ({ categories, selected, onChange, loading }) => {
  const toggle = (cat) => {
    onChange(
      selected.includes(cat)
        ? selected.filter((c) => c !== cat)
        : [...selected, cat]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading categories…
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-3 text-center border-2 border-dashed border-gray-200 rounded-xl">
        No categories found. Add products first.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <button type="button"
          onClick={() => onChange(categories)}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition">
          Select All
        </button>
        <span className="text-gray-300">·</span>
        <button type="button"
          onClick={() => onChange([])}
          className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition">
          Clear
        </button>
        {selected.length > 0 && (
          <span className="ml-auto text-xs text-emerald-600 font-semibold">
            {selected.length} selected
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {categories.map((cat) => {
          const active = selected.includes(cat);
          return (
            <button
              key={cat}
              type="button"
              onClick={() => toggle(cat)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all",
                active
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
              )}
            >
              <span className={cn(
                "w-4 h-4 rounded-md border flex-shrink-0 flex items-center justify-center transition-all",
                active ? "bg-white/30 border-white/50" : "border-gray-300"
              )}>
                {active && <Check className="w-2.5 h-2.5 text-white" />}
              </span>
              <span className="truncate text-left break-words">{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Complimentary Item Card ──────────────────────────────────────────────────
const ComplimentaryItemCard = ({ item, index, onChange, onRemove, error }) => {
  const [imgPreview, setImgPreview] = useState(item.imagePreview || null);
  const [imgUploading, setImgUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate: max 2 MB, image only
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2 MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    // Local preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImgPreview(ev.target.result);
      onChange(index, "imagePreview", ev.target.result);
      onChange(index, "imageFile", file);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImgPreview(null);
    onChange(index, "imagePreview", null);
    onChange(index, "imageFile", null);
    onChange(index, "imageUrl", "");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="relative bg-gradient-to-br from-pink-50 to-fuchsia-50 border border-pink-200 rounded-2xl p-4 space-y-3"
    >
      {/* Remove button */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-pink-500 flex items-center gap-1.5">
          <Gift className="w-3.5 h-3.5" />
          Free Gift #{index + 1}
        </span>
       
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Name */}
        <Field label="Gift Item Name" required error={error?.name}>
          <Input
            placeholder="e.g. Travel Size Moisturiser"
            value={item.name}
            onChange={(e) => onChange(index, "name", e.target.value)}
            error={error?.name}
            maxLength={80}
          />
        </Field>

        {/* Quantity */}
        <Field label="Quantity" required error={error?.quantity}>
          <div className="relative">
            <Input
              type="number"
              min="1"
              max="99"
              placeholder="1"
              value={item.quantity}
              onChange={(e) => onChange(index, "quantity", e.target.value)}
              error={error?.quantity}
              onWheel={(e) => e.target.blur()}
              className="pr-16"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
              unit{Number(item.quantity) !== 1 ? "s" : ""}
            </span>
          </div>
        </Field>
      </div>

      {/* Description — 70 char limit */}
      <Field
        label="Short Description"
        hint={`${(item.description || "").length}/70 characters`}
        error={error?.description}
      >
        <div className="relative">
          <Input
            placeholder="e.g. Hydrating mini moisturiser, perfect for on-the-go."
            value={item.description}
            onChange={(e) => onChange(index, "description", e.target.value.slice(0, 70))}
            error={error?.description}
            maxLength={70}
            className="pr-12"
          />
          <span className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold tabular-nums",
            (item.description || "").length >= 65 ? "text-rose-400" : "text-gray-300"
          )}>
            {(item.description || "").length}/70
          </span>
        </div>
      </Field>

      {/* Image upload — optional */}
      <Field label="Gift Image" hint="Optional · PNG/JPG/WEBP · Max 2 MB">
        {imgPreview ? (
          <div className="relative w-full h-32 rounded-xl overflow-hidden border border-pink-200 group">
            <img
              src={imgPreview}
              alt="gift preview"
              className="w-full h-full object-cover"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              <label className="cursor-pointer bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition flex items-center gap-1">
                <Upload className="w-3 h-3" /> Replace
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              <button
                type="button"
                onClick={removeImage}
                className="bg-rose-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-rose-600 transition flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center justify-center gap-2 w-full h-24 rounded-xl border-2 border-dashed border-pink-200 bg-white hover:bg-pink-50 hover:border-pink-300 transition text-pink-400">
            <ImageIcon className="w-6 h-6" />
            <span className="text-xs font-medium">Click to upload image</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        )}
      </Field>
    </motion.div>
  );
};

// ─── Live Preview Card ────────────────────────────────────────────────────────
const VoucherPreview = ({ form }) => {
  const hasCode = form.code.trim().length > 0;
  if (!hasCode && !form.discount && form.discountType !== "complimentary") return null;

  const isComplimentary = form.discountType === "complimentary";
  const totalGifts = isComplimentary
    ? form.complimentaryItems.reduce((s, i) => s + Number(i.quantity || 0), 0)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "border-2 border-dashed rounded-2xl p-5 space-y-3",
        isComplimentary
          ? "bg-gradient-to-br from-pink-50 to-fuchsia-50 border-pink-200"
          : "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200"
      )}
    >
      <p className={cn(
        "text-xs font-bold uppercase tracking-widest",
        isComplimentary ? "text-pink-600" : "text-emerald-600"
      )}>
        Preview
      </p>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <span className={cn(
            "font-mono text-sm sm:text-base lg:text-lg font-black tracking-widest break-all",
            isComplimentary ? "text-pink-700" : "text-emerald-700"
          )}>
            {form.code || "VOUCHERCODE"}
          </span>
          <p className="text-sm font-semibold text-gray-700 mt-1">
            {form.title || "Voucher Title"}
          </p>
          {form.description && (
            <p className="text-xs text-gray-400 mt-0.5">{form.description}</p>
          )}
        </div>

        {/* Badge */}
        <div className={cn(
          "w-full sm:w-auto flex-shrink-0 rounded-xl px-3 py-2 text-center min-w-[72px]",
          isComplimentary ? "bg-pink-600 text-white" : "bg-emerald-600 text-white"
        )}>
          {isComplimentary ? (
            <>
              <Gift className="w-6 h-6 mx-auto mb-0.5" />
              <p className="text-[9px] uppercase tracking-wider opacity-80">Free Gift</p>
            </>
          ) : (
            <>
              <p className="text-xl font-black leading-none">
                {form.discount || "0"}
                {form.discountType === "percentage" ? "%" : "$"}
              </p>
              <p className="text-[9px] uppercase tracking-wider mt-0.5 opacity-80">OFF</p>
            </>
          )}
        </div>
      </div>

      {/* Complimentary items preview */}
      {isComplimentary && form.complimentaryItems.some(i => i.name) && (
        <div className="space-y-1.5 pt-2 border-t border-pink-200/60">
          {form.complimentaryItems.filter(i => i.name).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-pink-800">
              <span className="w-4 h-4 rounded-full bg-pink-200 flex items-center justify-center font-bold text-[9px] flex-shrink-0">
                {item.quantity || 1}
              </span>
              <span className="font-semibold">{item.name}</span>
              {item.description && <span className="text-pink-500 truncate">{item.description}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Meta pills */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-pink-200/40">
        {form.minOrderValue > 0 && (
          <span className="text-[10px] bg-white border rounded-full px-2 py-0.5 font-semibold text-gray-600">
            Min. ${form.minOrderValue}
          </span>
        )}
        {isComplimentary && totalGifts > 0 && (
          <span className="text-[10px] bg-white border border-pink-200 text-pink-700 rounded-full px-2 py-0.5 font-semibold">
            {totalGifts} free item{totalGifts !== 1 ? "s" : ""}
          </span>
        )}
        {!isComplimentary && form.maxDiscountAmount && (
          <span className="text-[10px] bg-white border rounded-full px-2 py-0.5 font-semibold text-gray-600">
            Max. ${form.maxDiscountAmount} off
          </span>
        )}
        {form.appliesTo === "category" && form.applicableCategories.length > 0 && (
          <span className="text-[10px] bg-white border border-sky-200 text-sky-700 rounded-full px-2 py-0.5 font-semibold">
            {form.applicableCategories.length} categor{form.applicableCategories.length > 1 ? "ies" : "y"}
          </span>
        )}
        {form.appliesTo === "product" && form.applicableProductIds.length > 0 && (
          <span className="text-[10px] bg-white border border-emerald-200 text-emerald-700 rounded-full px-2 py-0.5 font-semibold">
            {form.applicableProductIds.length} product{form.applicableProductIds.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// ─── Default complimentary item ───────────────────────────────────────────────
const newComplimentaryItem = () => ({
  name: "",
  quantity: 1,
  description: "",
  imageFile: null,
  imagePreview: null,
  imageUrl: "",
});

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function VoucherModal({ onClose, onSuccess, voucher, fetchStats, fetchVouchers }) {
  const [form, setForm] = useState({
    code:                  voucher?.code        || "",
    title:                 voucher?.title       || "",
    description:           voucher?.description || "",
    discountType:          voucher?.discountType || "percentage",
    discount:              voucher?.discount    || "",
    maxDiscountAmount:     voucher?.maxDiscountAmount || "",
    minOrderValue:         voucher?.minOrderValue    || "",
    eligibility:           voucher?.eligibility      || "all",
    appliesTo:             voucher?.appliesTo         || "all",
    applicableCategories:  voucher?.applicableCategories  || [],
    applicableProductIds:  voucher?.applicableProductIds  || [],
    maxUses:               voucher?.maxUses      || "",
    perUserLimit:          voucher?.perUserLimit || 1,
    startDate: voucher?.startDate ? formatDateTimeLocal(voucher.startDate) : "",
    endDate:   voucher?.endDate   ? formatDateTimeLocal(voucher.endDate)   : "",
    isActive:  voucher?.isActive  ?? true,
    // complimentary
    complimentaryItems: voucher?.complimentaryItems?.length
      ? voucher.complimentaryItems.map(i => ({ ...newComplimentaryItem(), ...i }))
      : [newComplimentaryItem()],
  });

  const isEditMode = !!voucher;
  const isComplimentary = form.discountType === "complimentary";

  const [errors,     setErrors]     = useState({});
  const [loading,    setLoading]    = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [products,   setProducts]   = useState([]);
  const [prodLoading,setProdLoading]= useState(false);

  // ── Fetch categories ─────────────────────────────────────────────────────
  useEffect(() => {
    setCatLoading(true);
    fetch(`${BASE_URL}/admin/products/categories`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(r => r.json())
      .then(json => { if (json.success) setCategories(json.data || []); })
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setCatLoading(false));
  }, []);

  useEffect(() => {
    if (form.appliesTo === "product") fetchProducts();
  }, [form.appliesTo]);

  const fetchProducts = async () => {
    if (products.length > 0) return;
    setProdLoading(true);
    fetch(`${BASE_URL}/admin/products/list`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(r => r.json())
      .then(json => { if (json.success) setProducts(json.data || []); })
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setProdLoading(false));
  };

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: null }));
  };

  // ── Complimentary items helpers ──────────────────────────────────────────
  const updateComplimentaryItem = (index, field, value) => {
    setForm(p => {
      const items = [...p.complimentaryItems];
      items[index] = { ...items[index], [field]: value };
      return { ...p, complimentaryItems: items };
    });
    // clear item-level error
    if (errors[`complimentaryItems[${index}].${field}`]) {
      setErrors(p => ({ ...p, [`complimentaryItems[${index}].${field}`]: null }));
    }
  };

  const addComplimentaryItem = () => {
    if (form.complimentaryItems.length >= 5) {
      toast.error("Maximum 5 gift items allowed");
      return;
    }
    setForm(p => ({ ...p, complimentaryItems: [...p.complimentaryItems, newComplimentaryItem()] }));
  };

  const removeComplimentaryItem = (index) => {
    if (form.complimentaryItems.length === 1) {
      toast.error("At least one gift item is required");
      return;
    }
    setForm(p => ({
      ...p,
      complimentaryItems: p.complimentaryItems.filter((_, i) => i !== index),
    }));
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};

    if (!form.code.trim())
      e.code = "Code is required";
    else if (!/^[A-Z0-9_-]+$/.test(form.code.trim()))
      e.code = "Only uppercase letters, numbers, hyphens and underscores";

    if (!form.title.trim()) e.title = "Title is required";

    if (!isComplimentary) {
      if (!form.discount || Number(form.discount) <= 0)
        e.discount = "Enter a valid discount amount";
      else if (form.discountType === "percentage" && Number(form.discount) > 100)
        e.discount = "Percentage cannot exceed 100";
    }

    if (isComplimentary) {
      form.complimentaryItems.forEach((item, idx) => {
        if (!item.name.trim())
          e[`complimentaryItems[${idx}].name`] = "Item name is required";
        if (!item.quantity || Number(item.quantity) < 1)
          e[`complimentaryItems[${idx}].quantity`] = "Quantity must be at least 1";
      });
    }

    if (!form.startDate) e.startDate = "Start date is required";
    if (!form.endDate)   e.endDate   = "End date is required";
    else if (form.startDate && new Date(form.endDate) <= new Date(form.startDate))
      e.endDate = "End date must be after start date";

    if (form.appliesTo === "category" && form.applicableCategories.length === 0)
      e.applicableCategories = "Select at least one category";
    if (form.appliesTo === "product" && form.applicableProductIds.length === 0)
      e.applicableProductIds = "Select at least one product";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Upload image helper ──────────────────────────────────────────────────
  const uploadGiftImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${BASE_URL}/upload/image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Image upload failed");
    return data.url || data.imageUrl || "";
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error("Please fix the errors below"); return; }

    setLoading(true);
    try {
      // Upload any pending gift images first
      let resolvedItems = form.complimentaryItems;
      if (isComplimentary) {
        resolvedItems = await Promise.all(
          form.complimentaryItems.map(async (item) => {
            let imageUrl = item.imageUrl || "";
            if (item.imageFile) {
              try {
                imageUrl = await uploadGiftImage(item.imageFile);
              } catch {
                toast.error(`Failed to upload image for "${item.name}"`);
              }
            }
            return {
              name:        item.name.trim(),
              quantity:    Number(item.quantity),
              description: item.description.trim(),
              imageUrl,
            };
          })
        );
      }

      const payload = {
        code:        form.code.trim().toUpperCase(),
        title:       form.title.trim(),
        description: form.description.trim(),
        discountType: form.discountType,
        discount:    isComplimentary ? 0 : Number(form.discount),
        maxDiscountAmount: (!isComplimentary && form.maxDiscountAmount) ? Number(form.maxDiscountAmount) : null,
        minOrderValue:     form.minOrderValue ? Number(form.minOrderValue) : 0,
        eligibility:       form.eligibility,
        appliesTo:         form.appliesTo,
        applicableCategories: form.appliesTo === "category" ? form.applicableCategories : [],
        applicableProductIds: form.appliesTo === "product"  ? form.applicableProductIds  : [],
        maxUses:      form.maxUses ? Number(form.maxUses) : null,
        perUserLimit: Number(form.perUserLimit) || 1,
        startDate:    new Date(form.startDate).toISOString(),
        endDate:      new Date(form.endDate).toISOString(),
        isActive:     form.isActive,
        complimentaryItems: isComplimentary ? resolvedItems : [],
      };

      const res = await fetch(
        isEditMode
          ? `${BASE_URL}/admin/vouchers/${voucher._id}`
          : `${BASE_URL}/admin/vouchers`,
        {
          method: isEditMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save voucher");

      toast.success(isEditMode ? "Voucher updated successfully" : "Voucher created successfully");
      fetchStats?.();
      fetchVouchers?.();
      setSubmitted(true);
      onSuccess?.();
      setTimeout(() => { setSubmitted(false); onClose?.(); }, 1200);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    set("code", e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""));
  };

  const todayStr = new Date().toISOString().slice(0, 16);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[100vw] overflow-x-hidden">

      {/* ── Live Preview ── */}
      <VoucherPreview form={form} />

      {/* ── Basic Info ── */}
      <SectionCard icon={Tag} title="Voucher Details" color="emerald">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Voucher Code" required error={errors.code} hint="Letters, numbers, - and _ only">
            <div className="relative">
              <Input
                placeholder="FREEGIFT20"
                value={form.code}
                onChange={handleCodeChange}
                maxLength={20}
                error={errors.code}
                className="font-mono tracking-widest uppercase pr-16"
              />
              {form.code && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                  {form.code.length}/20
                </span>
              )}
            </div>
          </Field>

          <Field label="Voucher Title" required error={errors.title}>
            <Input
              placeholder="Summer Gift Bundle"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              error={errors.title}
            />
          </Field>
        </div>

        <Field label="Description" hint="Shown to users on the voucher card">
          <Input
            placeholder="Get a free gift with every order above $50"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>

        <Toggle
          checked={form.isActive}
          onChange={(v) => set("isActive", v)}
          label={form.isActive ? "Active" : "Inactive"}
          hint={form.isActive
            ? "Voucher is live and can be used by customers"
            : "Voucher is saved as draft, not visible to customers"}
        />
      </SectionCard>

      {/* ── Discount ── */}
      <SectionCard icon={Percent} title="Discount Configuration" color="amber">
        {/* Discount type selector — now includes Complimentary */}
        <Field label="Discount Type" required>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                value: "percentage",
                label: "Percentage",
                hint: "e.g. 20% off total",
                icon: "%",
              },
              {
                value: "flat",
                label: "Flat Amount",
                hint: "e.g. $5 off total",
                icon: "$",
              },
              {
                value: "complimentary",
                label: "Complimentary",
                hint: "Free gift item(s) added to order",
                icon: "🎁",
              },
            ].map((opt) => {
              const active = form.discountType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    set("discountType", opt.value);
                    set("maxDiscountAmount", "");
                    if (opt.value === "complimentary") set("discount", 0);
                  }}
                  className={cn(
                    "flex flex-col items-start gap-1 p-3 rounded-xl border-2 text-left transition-all",
                    active
                      ? opt.value === "complimentary"
                        ? "border-pink-500 bg-pink-50 shadow-sm"
                        : "border-amber-500 bg-amber-50 shadow-sm"
                      : "border-gray-200 bg-gray-50 hover:border-amber-300"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{opt.icon}</span>
                    <span className={cn(
                      "text-xs font-bold",
                      active
                        ? opt.value === "complimentary" ? "text-pink-700" : "text-amber-700"
                        : "text-gray-700"
                    )}>
                      {opt.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 leading-tight">{opt.hint}</span>
                  {active && (
                    <span className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center mt-1",
                      opt.value === "complimentary" ? "bg-pink-500" : "bg-amber-500"
                    )}>
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Field>

        {/* Flat / Percentage fields — hidden for complimentary */}
        <AnimatePresence>
          {!isComplimentary && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label={form.discountType === "percentage" ? "Discount (%)" : "Discount ($)"}
                  required
                  error={errors.discount}
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
                      {form.discountType === "percentage" ? "%" : "$"}
                    </span>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      max={form.discountType === "percentage" ? "100" : undefined}
                      placeholder={form.discountType === "percentage" ? "20" : "5"}
                      value={form.discount}
                      onChange={(e) => set("discount", e.target.value)}
                      onWheel={(e) => e.target.blur()}
                      error={errors.discount}
                      className="pl-7"
                    />
                  </div>
                </Field>

                {form.discountType === "percentage" && (
                  <Field label="Max Discount Cap ($)" hint="e.g. 20% off but max $2 saved">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <Input
                        type="number"
                        step="any"
                        min="1"
                        placeholder="2"
                        value={form.maxDiscountAmount}
                        onChange={(e) => set("maxDiscountAmount", e.target.value)}
                        onWheel={(e) => e.target.blur()}
                        className="pl-7"
                      />
                    </div>
                  </Field>
                )}
              </div>

              {form.discount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                  <strong>Summary:</strong>{" "}
                  {form.discountType === "percentage"
                    ? `${form.discount}% off${form.maxDiscountAmount ? `, capped at $${form.maxDiscountAmount}` : ""}`
                    : `Flat $${form.discount} off`}
                  {form.minOrderValue > 0 ? ` on orders above $${form.minOrderValue}` : " on all orders"}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Min order — shown for all types */}
        <Field label="Minimum Order Value ($)" hint="Cart must be at least this amount">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <Input
              type="number"
              min="0"
              placeholder="50"
              value={form.minOrderValue}
              onChange={(e) => set("minOrderValue", e.target.value)}
              onWheel={(e) => e.target.blur()}
              className="pl-7"
            />
          </div>
        </Field>
      </SectionCard>

      {/* ── Complimentary Items (shown only when discountType === complimentary) ── */}
      <AnimatePresence>
        {isComplimentary && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard icon={Gift} title="Free Gift Items" color="pink" defaultOpen>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Add gift item that will be included with the order.
                  </p>
                  
                </div>

                <AnimatePresence>
                  {form.complimentaryItems.map((item, idx) => (
                    <ComplimentaryItemCard
                      key={idx}
                      item={item}
                      index={idx}
                      onChange={updateComplimentaryItem}
                      onRemove={removeComplimentaryItem}
                      error={{
                        name:        errors[`complimentaryItems[${idx}].name`],
                        quantity:    errors[`complimentaryItems[${idx}].quantity`],
                        description: errors[`complimentaryItems[${idx}].description`],
                      }}
                    />
                  ))}
                </AnimatePresence>

              

                {/* Info */}
                <div className="flex items-start gap-2 p-3 bg-pink-50 border border-pink-200 rounded-xl text-xs text-pink-700">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <p>
                    Complimentary items are <strong>physical gifts</strong> added to the shipment.
                    They do not reduce the order total — the customer pays the regular cart price
                    and receives these items free.
                  </p>
                </div>
              </div>
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Who Can Use ── */}
      <SectionCard icon={Users} title="Eligibility" color="violet">
        <Field label="Who can use this voucher?">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { value: "all",            label: "Everyone",       hint: "All customers" },
              { value: "new_users",      label: "New Users",      hint: "Registered after voucher created" },
              { value: "existing_users", label: "Existing Users", hint: "Registered before voucher created" },
            ].map((opt) => {
              const active = form.eligibility === opt.value;
              return (
                <button key={opt.value} type="button"
                  onClick={() => set("eligibility", opt.value)}
                  className={cn(
                    "flex flex-col items-start gap-1 p-3 rounded-xl border-2 text-left transition-all",
                    active
                      ? "border-violet-500 bg-violet-50 shadow-sm"
                      : "border-gray-200 bg-gray-50 hover:border-violet-300"
                  )}
                >
                  <span className={cn("text-xs font-bold", active ? "text-violet-700" : "text-gray-700")}>
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-gray-400 leading-tight">{opt.hint}</span>
                  {active && (
                    <span className="w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center mt-1">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Field>
      </SectionCard>

      {/* ── Applies To ── */}
      <SectionCard icon={Layers} title="Applies To" color="sky">
        <Field label="Which products does this voucher apply to?">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: "all",      label: "All Products",        hint: "Works on entire cart" },
              { value: "product",  label: "Specific Products",   hint: "Only selected products" },
              { value: "category", label: "Specific Categories", hint: "Only selected category products" },
            ].map((opt) => {
              const active = form.appliesTo === opt.value;
              return (
                <button key={opt.value} type="button"
                  onClick={() => {
                    set("appliesTo", opt.value);
                    if (opt.value === "all") { set("applicableCategories", []); set("applicableProductIds", []); }
                    if (opt.value === "product") { set("applicableCategories", []); fetchProducts(); }
                    if (opt.value === "category") { set("applicableProductIds", []); }
                  }}
                  className={cn(
                    "flex flex-col items-start gap-1 p-3 rounded-xl border-2 text-left transition-all",
                    active ? "border-sky-500 bg-sky-50 shadow-sm" : "border-gray-200 bg-gray-50 hover:border-sky-300"
                  )}
                >
                  <span className={cn("text-xs font-bold", active ? "text-sky-700" : "text-gray-700")}>{opt.label}</span>
                  <span className="text-[10px] text-gray-400">{opt.hint}</span>
                  {active && (
                    <span className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center mt-1">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Field>

        {/* Product selector */}
        <AnimatePresence>
          {form.appliesTo === "product" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <Field label="Select Products" required error={errors.applicableProductIds} hint="Voucher will only apply to these specific products">
                {prodLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading products…
                  </div>
                ) : products.length === 0 ? (
                  <p className="text-sm text-gray-400 py-3 text-center border-2 border-dashed border-gray-200 rounded-xl">No products found.</p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <button type="button" onClick={() => set("applicableProductIds", products.map(p => p._id))} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition">Select All</button>
                      <span className="text-gray-300">·</span>
                      <button type="button" onClick={() => set("applicableProductIds", [])} className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition">Clear</button>
                      {form.applicableProductIds.length > 0 && <span className="ml-auto text-xs text-emerald-600 font-semibold">{form.applicableProductIds.length} selected</span>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                      {products.map(p => {
                        const active = form.applicableProductIds.includes(p._id);
                        return (
                          <button key={p._id} type="button"
                            onClick={() => set("applicableProductIds", active ? form.applicableProductIds.filter(id => id !== p._id) : [...form.applicableProductIds, p._id])}
                            className={cn("flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all", active ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50")}
                          >
                            <span className={cn("w-4 h-4 rounded-md border flex-shrink-0 flex items-center justify-center", active ? "bg-white/30 border-white/50" : "border-gray-300")}>
                              {active && <Check className="w-2.5 h-2.5 text-white" />}
                            </span>
                            <span className="truncate">{p.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Field>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category selector */}
        <AnimatePresence>
          {form.appliesTo === "category" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <Field label="Select Categories" required error={errors.applicableCategories} hint="Voucher will only apply to products in the selected categories">
                <CategoryCheckboxGrid categories={categories} selected={form.applicableCategories} onChange={val => set("applicableCategories", val)} loading={catLoading} />
              </Field>
            </motion.div>
          )}
        </AnimatePresence>
      </SectionCard>

      {/* ── Usage Limits ── */}
      <SectionCard icon={Package} title="Usage Limits" color="rose" defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Total Uses Allowed" hint="Leave empty for unlimited">
            <Input type="number" min="1" placeholder="Unlimited" value={form.maxUses} onChange={e => set("maxUses", e.target.value)} onWheel={e => e.target.blur()} />
          </Field>
          <Field label="Uses Per User" hint="How many times one user can apply this">
            <Input type="number" min="1" max="10" placeholder="1" value={form.perUserLimit} onChange={e => set("perUserLimit", e.target.value)} onWheel={e => e.target.blur()} />
          </Field>
        </div>
        <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <p>Most vouchers are <strong>single-use per user</strong> (per user limit = 1). Set total uses to cap global redemptions.</p>
        </div>
      </SectionCard>

      {/* ── Validity ── */}
      <SectionCard icon={Calendar} title="Validity Period" color="slate">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Start Date & Time" required error={errors.startDate}>
            <Input type="datetime-local" min={todayStr} value={form.startDate} onChange={e => set("startDate", e.target.value)} error={errors.startDate} disabled={isEditMode} />
          </Field>
          <Field label="End Date & Time" required error={errors.endDate}>
            <Input type="datetime-local" min={form.startDate || todayStr} value={form.endDate} onChange={e => set("endDate", e.target.value)} error={errors.endDate} />
          </Field>
        </div>
        {form.startDate && form.endDate && new Date(form.endDate) > new Date(form.startDate) && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center gap-2 break-words">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Valid for <strong>{Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24))} day(s)</strong>
            {" "}— from {new Date(form.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            {" "}to {new Date(form.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        )}
      </SectionCard>

      {/* ── Footer ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sticky bottom-0 bg-white border-t border-gray-100 px-4 sm:px-6 py-4 rounded-b-2xl">
        {onClose && (
          <button type="button" onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
            Cancel
          </button>
        )}
        <button type="submit" disabled={loading}
          className={cn(
            "w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition",
            submitted
              ? "bg-emerald-500"
              : isComplimentary
                ? "bg-pink-600 hover:bg-pink-700"
                : "bg-emerald-600 hover:bg-emerald-700",
            loading && "opacity-70 cursor-not-allowed"
          )}
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />{isEditMode ? "Updating…" : "Creating…"}</>
          ) : submitted ? (
            <><Check className="w-4 h-4" />{isEditMode ? "Updated!" : "Created!"}</>
          ) : (
            <>{isComplimentary ? <Gift className="w-4 h-4" /> : <Tag className="w-4 h-4" />}{isEditMode ? "Update Voucher" : "Create Voucher"}</>
          )}
        </button>
      </div>
    </form>
  );
}
