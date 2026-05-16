import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import EditProductModal from "./EditProduct";
import {
  Eye, Pencil, Trash2, X, Package, Star, Leaf, Box,
  Layers, FlaskConical, CheckCircle2, AlertCircle,
  ImageOff, Truck, Receipt, AlertTriangle,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const cn = (...c) => c.filter(Boolean).join(" ");

const TAG_COLORS = {
  bestseller: "bg-amber-100 text-amber-700 border-amber-200",
  new:        "bg-sky-100 text-sky-700 border-sky-200",
  combo:      "bg-violet-100 text-violet-700 border-violet-200",
  limited:    "bg-rose-100 text-rose-700 border-rose-200",
};

const STATUS_COLORS = {
  
  out_of_stock: "bg-orange-100 text-orange-600",
};

const Pill = ({ children, className }) => (
  <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize", className)}>
    {children}
  </span>
);

const SectionTitle = ({ icon: Icon, label, color = "emerald" }) => {
  const colors = {
    emerald: "text-emerald-600 bg-emerald-50",
    amber:   "text-amber-600 bg-amber-50",
    sky:     "text-sky-600 bg-sky-50",
    rose:    "text-rose-600 bg-rose-50",
    violet:  "text-violet-600 bg-violet-50",
    slate:   "text-slate-600 bg-slate-100",
  };
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className={cn("p-1.5 rounded-lg", colors[color])}>
        <Icon className="w-3.5 h-3.5" />
      </span>
      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</span>
    </div>
  );
};

const KV = ({ label, value }) =>
  value !== undefined && value !== null && value !== "" ? (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      <span className="text-sm text-gray-800 font-medium">{String(value)}</span>
    </div>
  ) : null;

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
const DeleteModal = ({ product, onCancel, onConfirm, isDeleting }) => (
  <>
    <motion.div
      key="del-backdrop"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={() => !isDeleting && onCancel()}
      className="fixed inset-0 bg-black/50 z-[60]"
    />
    <motion.div
      key="del-modal"
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      exit={{   opacity: 0, scale: 0.92, y: 20  }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="fixed inset-0 z-[70] flex items-center justify-center px-4 pointer-events-none"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
        <div className="h-1.5 bg-gradient-to-r from-rose-400 to-red-500" />
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-rose-500" />
            </div>
          </div>
          <h3 className="text-center text-base font-bold text-gray-800 mb-1">Delete Product?</h3>
          <p className="text-center text-sm text-gray-500 leading-relaxed">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-gray-700">"{product?.name}"</span>?
            <br />
            <span className="text-xs text-rose-400 mt-1 block">This action cannot be undone.</span>
          </p>
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Deleting…
                </>
              ) : (
                <><Trash2 className="w-4 h-4" /> Yes, Delete</>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </>
);

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product: p, onView, onEdit, onDeleteClick }) => {
  const mainImage      = p.images?.[0]?.url;
  const defaultVariant = p.variants?.find((v) => v.isDefault) || p.variants?.[0];
  const totalStock     = p.variants?.reduce((s, v) => s + (v.stock?.quantity || 0), 0) ?? 0;
  const tags = p.tag || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 overflow-hidden flex flex-col"
    >
      <div className="relative h-44 bg-gray-50 overflow-hidden">
        {mainImage ? (
          <img src={mainImage} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-10 h-10 text-gray-200" />
          </div>
        )}
        <span className={cn("absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize",  p.isActive
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-rose-100 text-rose-700 border-rose-200"
  )}>
          {p.isActive?"Active":"InActive"}
          
        </span>
        {tags && (
  <div className="absolute top-1 right-2">
    <span
      className={cn(
        "text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize",
        TAG_COLORS[tags] || "bg-gray-100 text-gray-500 border-gray-200"
      )}
    >
      {tags}
    </span>
  </div>
)}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="text-sm font-bold text-gray-800 truncate leading-snug">{p.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{p.brand} · {p.category}</p>
        </div>
        {defaultVariant && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 line-through">₹{defaultVariant.price?.mrp}</p>
              <p className="text-base font-bold text-emerald-600">₹{defaultVariant.price?.sellingPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Stock</p>
              <p className={cn("text-sm font-bold", totalStock <= 10 ? "text-rose-500" : "text-gray-700")}>
                {totalStock} in stock
              </p>
            </div>
          </div>
        )}
        <div className="flex gap-2 mt-auto pt-2 border-t border-gray-50">
          <button onClick={() => onView(p)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition">
            <Eye className="w-3.5 h-3.5" /> View
          </button>
          <button onClick={() => onEdit(p)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold transition">
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
          <button onClick={() => onDeleteClick(p)}
            className="flex items-center justify-center px-3 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 text-xs font-semibold transition">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── View Drawer ──────────────────────────────────────────────────────────────
const ViewDrawer = ({ product: p, onClose, onEdit, onDeleteClick }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab,   setActiveTab]   = useState("overview");
  const [variantImageIndexes, setVariantImageIndexes] = useState({});
  const handleVariantPrev = (variantIndex, totalImages) => {
  setVariantImageIndexes((prev) => ({
    ...prev,
    [variantIndex]:
      ((prev[variantIndex] || 0) - 1 + totalImages) % totalImages,
  }));
};

const handleVariantNext = (variantIndex, totalImages) => {
  setVariantImageIndexes((prev) => ({
    ...prev,
    [variantIndex]:
      ((prev[variantIndex] || 0) + 1) % totalImages,
  }));
};

  if (!p) return null;

  const tags       = Array.isArray(p.tags) ? p.tags : p.tag ? [p.tag] : [];
  const totalStock = p.variants?.reduce((s, v) => s + (v.stock?.quantity || 0), 0) ?? 0;
  const sd         = p.skincareDetails || {};

  const tabs = [
    { id: "overview",    label: "Overview"    },
    { id: "variants",    label: "Variants"    },
    { id: "skincare",    label: "Skincare"    },
    { id: "ingredients", label: "Ingredients" },
    { id: "packaging",   label: "Packaging"   },
  ];

  return (
    <>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />
      <motion.div
        key="drawer"
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="fixed top-0 right-0 h-full w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 bg-white shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full capitalize",  p.isActive
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-rose-100 text-rose-700 border-rose-200"
  )}>
                {p.isActive?"Active":"InActive"}
              </span>
              {tags.map((t) => (
                <span key={t} className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize", TAG_COLORS[t] || "bg-gray-100 text-gray-500 border-gray-200")}>
                  {t}
                </span>
              ))}
              {p.isFeatured   && <span className="text-[10px] bg-violet-100 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full font-bold">Featured</span>}
              {p.isBestseller && <span className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold">Bestseller</span>}
              {p.isNewArrival && <span className="text-[10px] bg-sky-100 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-bold">New Arrival</span>}
            </div>
            <h2 className="text-base font-bold text-gray-800 truncate">{p.name}</h2>
            <p className="text-xs text-gray-400">{p.brand} · {p.category}{p.subCategory ? ` › ${p.subCategory}` : ""}</p>
          </div>
          <div className="flex items-center gap-2 ml-3 shrink-0">
            <button onClick={() => onEdit(p)} className="p-2 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => onDeleteClick(p)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-3 pb-0 border-b border-gray-100 shrink-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-2 text-xs font-semibold rounded-t-lg whitespace-nowrap transition border-b-2",
                activeTab === tab.id
                  ? "text-emerald-600 border-emerald-500 bg-emerald-50"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              )}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {activeTab === "overview" && (
            <>
              {p.images?.length > 0 && (
                <div className="space-y-2">
                  <div className="rounded-2xl overflow-hidden bg-gray-50 h-56">
                    <img src={p.images[activeImage]?.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  {p.images.length > 1 && (
                    <div className="flex gap-2">
                      {p.images.map((img, i) => (
                        <button key={i} onClick={() => setActiveImage(i)}
                          className={cn("w-12 h-12 rounded-xl overflow-hidden border-2 transition",
                            activeImage === i ? "border-emerald-500" : "border-gray-200")}>
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total Stock", value: `${totalStock} units`, color: totalStock <= 10 ? "text-rose-500" : "text-emerald-600" },
                  { label: "Variants",    value: p.variants?.length || 0, color: "text-sky-600" },
                  { label: "Rating",      value: `${p.ratings?.average || 0} ★ (${p.ratings?.count || 0})`, color: "text-amber-500" },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-2xl p-3 text-center">
                    <p className={cn("text-base font-bold", s.color)}>{s.value}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              <div>
                <SectionTitle icon={Package} label="Basic Info" color="emerald" />
                <div className="grid grid-cols-2 gap-3">
                  
                  <KV label="Name"         value={p.name} />
                  <KV label="Brand"        value={p.brand} />
                  <KV label="Category"     value={p.category} />
                  <KV label="Sub-Category" value={p.subCategory} />
                  <KV label="HSN Code"     value={p.hsn} />
                  <KV label="Tax Rate"     value={p.taxRate ? `${p.taxRate}%` : null} />
                </div>
              </div>
              {/* <div className="flex flex-wrap gap-2">
                {[
                  { label: "Active",        val: p.isActive },
                  { label: "Featured",      val: p.isFeatured },
                  { label: "Bestseller",    val: p.isBestseller },
                  { label: "New Arrival",   val: p.isNewArrival },
                  { label: "Free Shipping", val: p.isFreeShipping },
                ].map((t) => (
                  <span key={t.label} className={cn(
                    "flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border",
                    t.val ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-400 border-gray-200"
                  )}>
                    {t.val ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {t.label}
                  </span>
                ))}
              </div> */}
              {p.shortDescription && (
                <div>
                  <SectionTitle icon={Package} label="Short Description" color="slate" />
                  <p className="text-sm text-gray-600 leading-relaxed">{p.shortDescription}</p>
                </div>
              )}
              {p.description && (
                <div>
                  <SectionTitle icon={Package} label="Full Description" color="slate" />
                  <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
                </div>
              )}
              {p.highlights?.length > 0 && (
                <div>
                  <SectionTitle icon={Star} label="Highlights" color="amber" />
                  <ul className="space-y-1.5">
                    {p.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {activeTab === "variants" && (
            <div className="space-y-4">
              <SectionTitle icon={Layers} label="Variants & Pricing" color="amber" />
              {p.variants?.map((v, i) => (
                <div key={v._id || i} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="text-sm font-bold text-gray-800">{v.sku}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {v.isDefault && <Pill className="bg-emerald-100 text-emerald-700 border-emerald-200">Default</Pill>}
                      {v.isActive  ? <Pill className="bg-green-100 text-green-700 border-green-200">Active</Pill>
                                   : <Pill className="bg-gray-100 text-gray-500 border-gray-200">Inactive</Pill>}
                    </div>
                  </div>
                  <div className="space-y-3">

  {/* Variant Images Carousel */}
  {v.images?.length > 0 && (
    <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100">
      
      {/* Main Image */}
      <div className="h-64 bg-gray-50">
        <img
          src={v.images[variantImageIndexes[i] || 0]?.url}
          alt={v.sku}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Navigation Buttons */}
      {v.images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => handleVariantPrev(i, v.images.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white shadow-md hover:scale-105 transition p-2 rounded-full"
          >
            ←
          </button>

          <button
            type="button"
            onClick={() => handleVariantNext(i, v.images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white shadow-md hover:scale-105 transition p-2 rounded-full"
          >
            →
          </button>
        </>
      )}

      {/* Thumbnails */}
      {v.images.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto bg-white border-t border-gray-100">
          {v.images.map((img, imgIndex) => (
            <button
              key={imgIndex}
              onClick={() =>
                setVariantImageIndexes((prev) => ({
                  ...prev,
                  [i]: imgIndex,
                }))
              }
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                (variantImageIndexes[i] || 0) === imgIndex
                  ? "border-emerald-500"
                  : "border-gray-200"
              }`}
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )}

  {/* Pricing + Stock */}
  <div className="grid grid-cols-2 gap-3">
    
    <div className="bg-white rounded-2xl p-4 border border-gray-100">
      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
        Pricing
      </p>

      <p className="text-xs text-gray-400 line-through">
        MRP ₹{v.price?.mrp}
      </p>

      <p className="text-xl font-bold text-emerald-600">
        ₹{v.price?.sellingPrice}
      </p>

      {v.price?.mrp && v.price?.sellingPrice && (
        <p className="text-xs text-rose-500 font-semibold mt-1">
          {Math.round(
            (1 - v.price.sellingPrice / v.price.mrp) * 100
          )}% OFF
        </p>
      )}
    </div>

    <div className="bg-white rounded-2xl p-4 border border-gray-100">
      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
        Stock
      </p>

      <p
        className={cn(
          "text-xl font-bold",
          v.stock?.quantity <= v.stock?.lowStockAlert
            ? "text-rose-500"
            : "text-gray-800"
        )}
      >
        {v.stock?.quantity}
      </p>

      <p className="text-xs text-gray-400 mt-1">
        Alert at {v.stock?.lowStockAlert}
      </p>
    </div>
  </div>
</div>
                  <div className="grid grid-cols-2 gap-2">
                    {/* {console.log(v.attributes)} */}
                    
                    {v.attributes?.size  && <KV label="Size"    value={v.attributes.size} />}
                    {v.attributes?.shade  && <KV label="Shade"   value={v.attributes.shade} />}
                    {v.attributes?.scent  && <KV label="Scent"   value={v.attributes.scent} />}
                    {v.attributes?.packOf && <KV label="Pack Of" value={v.attributes.packOf} />}
                    {v.weight?.value >0    && <KV label="Weight"  value={`${v.weight.value} ${v.weight.unit}`} />}
                    {v.barcode            && <KV label="Barcode" value={v.barcode} />}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "skincare" && (
            <div className="space-y-5">
              {sd.skinType?.length > 0 && (
                <div>
                  <SectionTitle icon={Leaf} label="Skin Type" color="emerald" />
                  <div className="flex flex-wrap gap-2">
                    {sd.skinType.map((s) => <Pill key={s} className="bg-emerald-50 text-emerald-700 border-emerald-200">{s}</Pill>)}
                  </div>
                </div>
              )}
              {sd.skinConcerns?.length > 0 && (
                <div>
                  <SectionTitle icon={Leaf} label="Skin Concerns" color="rose" />
                  <div className="flex flex-wrap gap-2">
                    {sd.skinConcerns.map((s) => <Pill key={s} className="bg-rose-50 text-rose-600 border-rose-200">{s}</Pill>)}
                  </div>
                </div>
              )}
              {sd.claims?.length > 0 && (
                <div>
                  <SectionTitle icon={CheckCircle2} label="Claims" color="sky" />
                  <div className="flex flex-wrap gap-2">
                    {sd.claims.map((c) => <Pill key={c} className="bg-sky-50 text-sky-700 border-sky-200">{c}</Pill>)}
                  </div>
                </div>
              )}
              {sd.usage && (
                <div>
                  <SectionTitle icon={Package} label="Usage" color="violet" />
                  <div className="grid grid-cols-2 gap-3">
                    <KV label="Frequency"     value={sd.usage.frequency} />
                    <KV label="When To Apply" value={sd.usage.whenToApply} />
                    <KV label="Amount"        value={sd.usage.amountToUse} />
                    <KV label="Origin"        value={sd.countryOfOrigin} />
                  </div>
                  {sd.usage.howToUse && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">How To Use</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{sd.usage.howToUse}</p>
                    </div>
                  )}
                </div>
              )}
              {(sd.shelfLife?.months || sd.shelfLife?.paoMonths) && (
                <div>
                  <SectionTitle icon={Package} label="Shelf Life" color="amber" />
                  <div className="grid grid-cols-2 gap-3">
                    <KV label="Shelf Life" value={sd.shelfLife?.months    ? `${sd.shelfLife.months} months`    : null} />
                    <KV label="PAO"        value={sd.shelfLife?.paoMonths ? `${sd.shelfLife.paoMonths} months` : null} />
                  </div>
                </div>
              )}
              
               
              {             
              
              sd.certifications?.length > 0 && (
                <div>
                  <SectionTitle icon={CheckCircle2} label="Certifications" color="emerald" />
                  <div className="flex flex-wrap gap-2">
                    {sd.certifications.map((c) => <Pill key={c} className="bg-emerald-50 text-emerald-700 border-emerald-200">{c}</Pill>)}
                  </div>
                </div>
              )}
              {sd.madeWithoutList?.length > 0 && (
                <div>
                  <SectionTitle icon={AlertCircle} label="Free From" color="rose" />
                  <div className="flex flex-wrap gap-2">
                    {sd.madeWithoutList.map((m) => <Pill key={m} className="bg-rose-50 text-rose-600 border-rose-200">{m}</Pill>)}
                  </div>
                </div>
              )}
            </div>
          )}

         {activeTab === "ingredients" && (
  <div className="space-y-4">
    <SectionTitle
      icon={FlaskConical}
      label="Ingredients"
      color="rose"
    />

    {p.ingredients?.length > 0 ? (
      p.ingredients.map((ing, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden"
        >

          {/* Image */}
          {ing.image?.url && (
            <div className="h-52 bg-white">
              <img
                src={ing.image.url}
                alt={ing.image.altText || ing.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-4 space-y-3">

            {/* Name */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-800">
                {ing.name}
              </h3>
            </div>

            {/* Description */}
            {ing.description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {ing.description}
              </p>
            )}

          </div>
        </div>
      ))
    ) : (
      <div className="text-center py-10 text-sm text-gray-400">
        No ingredients available.
      </div>
    )}
  </div>
)}

          {activeTab === "packaging" && (
            <div className="space-y-5">
              <div>
                <SectionTitle icon={Box} label="Packaging" color="slate" />
                <div className="grid grid-cols-2 gap-3">
                  <KV label="Type"            value={p.packaging?.type} />
                  <KV label="Material"        value={p.packaging?.material} />
                  <KV label="Shipping Weight" value={p.packaging?.shippingWeight ? `${p.packaging.shippingWeight}g` : null} />
                  <KV label="Recyclable"      value={p.packaging?.isRecyclable ? "Yes ♻️" : "No"} />
                  {p.packaging?.dimensions?.length && (
                    <KV label="Dimensions (L×W×H)"
                      value={`${p.packaging.dimensions.length} × ${p.packaging.dimensions.width} × ${p.packaging.dimensions.height} cm`} />
                  )}
                </div>
              </div>
              <div>
                <SectionTitle icon={Truck} label="Shipping" color="sky" />
                <KV label="Free Shipping" value={p.isFreeShipping ? "Yes" : "No"} />
              </div>
              <div>
                <SectionTitle icon={Receipt} label="Tax" color="amber" />
                <div className="grid grid-cols-2 gap-3">
                  <KV label="HSN Code" value={p.hsn} />
                  <KV label="GST Rate" value={p.taxRate !== undefined ? `${p.taxRate}%` : null} />
                </div>
              </div>
              <div>
                <SectionTitle icon={Star} label="Ratings" color="amber" />
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <KV label="Average" value={`${p.ratings?.average || 0} ★`} />
                  <KV label="Reviews" value={p.ratings?.count || 0} />
                </div>
                {p.ratings?.breakdown && (
                  <div className="space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const key   = ["one","two","three","four","five"][star - 1];
                      const count = p.ratings.breakdown[key] || 0;
                      const total = p.ratings.count || 1;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-3">{star}</span>
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(count / total) * 100}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 w-4 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

// ─── Main ProductsGrid ────────────────────────────────────────────────────────
export default function ProductsGrid({ products, loadingProducts, onEdit, onProductDeleted, fetchProducts, fetchCategories, fetchStats }) {
    
  const [viewProduct,  setViewProduct]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting,   setIsDeleting]   = useState(false);

  const [editProduct, setEditProduct] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  

  const handleDeleteClick = (product) => {
    setViewProduct(null);  
     // close drawer if open
    setDeleteTarget(product);   // open confirm modal
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token"); 
      const res   = await fetch(`${BASE_URL}/admin/products/${deleteTarget._id}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete product");

      toast.success(data.message || "Product deleted successfully 🗑️");
      setDeleteTarget(null);
      fetchProducts();
      fetchCategories();
      onProductDeleted?.(deleteTarget._id);   // parent removes it from list
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

    const handleEditClick = (product) => {
    setViewProduct(null);
    setDeleteTarget(null);
    setEditProduct(product);
   
    setIsEditOpen(true);
  };

  return (
    <div className="px-6">
      {loadingProducts ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">        
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00bc7d]"></div>          
        </div>
      ) : products?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (
             <ProductCard
    key={p._id}
    product={p}
    
    onView={setViewProduct}
    onEdit={handleEditClick}
    onDeleteClick={handleDeleteClick}
  />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No products match your filters.</p>
        </div>
      )}

      {/* View Drawer */}
      <AnimatePresence>
        {viewProduct && (
          <ViewDrawer
            product={viewProduct}
            onClose={() => setViewProduct(null)}
            onEdit={(p) => {
    setViewProduct(null);
    handleEditClick(p);
  }}
            onDeleteClick={handleDeleteClick}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            product={deleteTarget}
            isDeleting={isDeleting}
            onCancel={() => !isDeleting && setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
  {isEditOpen && editProduct && (
    <EditProductModal
      open={isEditOpen}
      onClose={() => {
        setIsEditOpen(false);
        setEditProduct(null);
      }}
      product={editProduct}
      fetchProducts={fetchProducts}
      fetchCategories={fetchCategories}
      fetchStats={fetchStats}
    />
  )}
</AnimatePresence>
    </div>
  );
}