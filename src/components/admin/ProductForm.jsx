import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast"
const BASE_URL = import.meta.env.VITE_BASE_URL;
import {
  Package, ChevronDown, ChevronUp, Plus, Trash2,
  X, Image as ImageIcon, Video, Tag, Leaf, Box,
  Info, Star, AlertCircle, Check, FolderOpen, Layers,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const TAGS = ["bestseller", "new", "combo", "limited"];
const TAG_COLORS = {
  bestseller: { bg: "bg-amber-500",  border: "border-amber-500",  text: "text-amber-700",  light: "bg-amber-50"  },
  new:        { bg: "bg-sky-500",    border: "border-sky-500",    text: "text-sky-700",    light: "bg-sky-50"    },
  combo:      { bg: "bg-violet-500", border: "border-violet-500", text: "text-violet-700", light: "bg-violet-50" },
  limited:    { bg: "bg-rose-500",   border: "border-rose-500",   text: "text-rose-700",   light: "bg-rose-50"   },
};
const SKIN_TYPES = ["all", "dry", "oily", "combination", "sensitive", "normal", "mature"];
const SKIN_CONCERNS = [
  "acne", "anti-aging", "brightening", "dark-spots", "dryness",
  "dullness", "hyperpigmentation", "pores", "redness", "sensitivity",
  "uneven-texture", "wrinkles",
];
const CLAIMS = [
  "vegan", "cruelty-free", "paraben-free", "sulfate-free",
  "fragrance-free", "alcohol-free", "dermatologist-tested",
  "hypoallergenic", "organic-certified", "natural", "reef-safe",
  "non-comedogenic", "gluten-free",
];
const PACKAGING_TYPES = ["bottle", "tube", "jar", "sachet", "pump", "dropper", "spray", "box", "pouch"];
const WEIGHT_UNITS = ["ml", "g", "l", "kg", "oz", "fl_oz"];
const TAX_RATES = [0, 5, 12, 18, 28];

const emptyVariant = () => ({
  id: Date.now() + Math.random(),
  sku: "",
  attributes: { size: "", shade: "", scent: "", packOf: "" },
  price: { mrp: "", sellingPrice: "" },
  stock: { quantity: "", lowStockAlert: 10 },
  // weight: { value: "", unit: "ml" },
  barcode: "",
  isDefault: false,
  isActive: true,
});

const emptyIngredient = () => ({
  id: Date.now() + Math.random(),
  name: "", inci: "", percentage: "", isKeyActive: false, benefit: "",
});

const cn = (...classes) => classes.filter(Boolean).join(" ");

// ─── Shared UI Components ─────────────────────────────────────────────────────
const SectionCard = ({ icon: Icon, title, color = "emerald", children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  const colors = {
    emerald: "from-emerald-500 to-teal-600",
    amber:   "from-amber-500 to-orange-500",
    sky:     "from-sky-500 to-blue-600",
    rose:    "from-rose-500 to-pink-600",
    violet:  "from-violet-500 to-purple-600",
    slate:   "from-slate-500 to-gray-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl bg-gradient-to-br text-white shadow-sm", colors[color])}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-semibold text-gray-800 text-sm">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
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
            <div className="px-6 pb-6 pt-2 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Field = ({ label, required, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
      {label}{required && <span className="text-rose-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={cn(
      "w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800",
      "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition",
      className
    )}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={cn(
      "w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800",
      "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition resize-none",
      className
    )}
    {...props}
  />
);

const Select = ({ children, className = "", ...props }) => (
  <div className="relative">
    <select
      className={cn(
        "w-full appearance-none px-3 py-2.5 pr-9 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800",
        "focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition",
        className
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
    <div onClick={() => onChange(!checked)}
      className={cn("relative w-10 h-5 rounded-full transition-colors duration-200",
        checked ? "bg-emerald-500" : "bg-gray-200")}>
      <span className={cn("absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200",
        checked ? "translate-x-5" : "translate-x-0")} />
    </div>
    {label && <span className="text-sm text-gray-700">{label}</span>}
  </label>
);

const PillToggle = ({ value, options, onChange, single = false }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => {
      const active = single ? value === opt : Array.isArray(value) ? value.includes(opt) : false;
      return (
        <button key={opt} type="button"
          onClick={() => {
            if (single) {
              onChange(active ? null : opt);
            } else {
              onChange(active ? value.filter((v) => v !== opt) : [...value, opt]);
            }
          }}
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-medium border capitalize transition",
            active ? "bg-emerald-600 text-white border-emerald-600"
                   : "bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300"
          )}>
          {opt}
        </button>
      );
    })}
  </div>
);

// ─── Single Image Upload (for categoryImage & tagImage) ───────────────────────
const SingleImageUpload = ({ file, onAdd, onRemove, label, hint, accentColor = "emerald" }) => {
  const ref = useRef();
  const [drag, setDrag] = useState(false);

  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    onAdd({ id: Date.now(), file: f, preview: URL.createObjectURL(f) });
  };

  const colors = {
    emerald: { border: "hover:border-emerald-300", icon: "text-emerald-500", bg: "bg-emerald-50", ring: "focus:ring-emerald-400" },
    amber:   { border: "hover:border-amber-300",   icon: "text-amber-500",   bg: "bg-amber-50",   ring: "focus:ring-amber-400"   },
    sky:     { border: "hover:border-sky-300",      icon: "text-sky-500",     bg: "bg-sky-50",     ring: "focus:ring-sky-400"     },
    violet:  { border: "hover:border-violet-300",   icon: "text-violet-500",  bg: "bg-violet-50",  ring: "focus:ring-violet-400"  },
    rose:    { border: "hover:border-rose-300",     icon: "text-rose-500",    bg: "bg-rose-50",    ring: "focus:ring-rose-400"    },
  };
  const c = colors[accentColor] || colors.emerald;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</label>
      )}

      {!file ? (
        // Drop zone
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => ref.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 py-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all",
            drag ? `border-${accentColor}-400 ${c.bg}` : `border-gray-200 ${c.border} hover:bg-gray-50`
          )}
        >
          <input ref={ref} type="file" accept="image/*" className="hidden"
            onChange={(e) => handleFile(e.target.files[0])} />
          <div className={cn("p-2.5 rounded-xl bg-gray-100", drag && c.bg)}>
            <ImageIcon className={cn("w-5 h-5 text-gray-400", drag && c.icon)} />
          </div>
          <p className="text-sm text-gray-500 font-medium">{hint || "Click or drag to upload"}</p>
          <p className="text-xs text-gray-400">Single image · PNG, JPG, WEBP</p>
        </div>
      ) : (
        // Preview
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 group">
          <img src={file.preview} alt="" className="w-full h-36 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
            <button type="button"
              onClick={() => ref.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/90 rounded-xl text-xs font-semibold text-gray-700 hover:bg-white transition">
              <ImageIcon className="w-3.5 h-3.5" /> Change
            </button>
            <button type="button" onClick={onRemove}
              className="p-2 bg-red-500 rounded-xl text-white hover:bg-red-600 transition">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <input ref={ref} type="file" accept="image/*" className="hidden"
            onChange={(e) => handleFile(e.target.files[0])} />
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-white text-xs font-medium truncate">{file.file?.name}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Media Drop Zone (multi) ──────────────────────────────────────────────────
const MediaDropZone = ({ accept, label, multiple, files, onAdd, onRemove, icon: Icon = ImageIcon }) => {
  const ref = useRef();
  const handleFiles = (fileList) => {
    const arr = Array.from(fileList).map((f) => ({
      id: Date.now() + Math.random(),
      file: f,
      preview: URL.createObjectURL(f),
      isPrimary: false,
    }));
    onAdd(arr);
  };
  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onClick={() => ref.current.click()}
        className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-emerald-300 bg-gray-50 cursor-pointer transition"
      >
        <input ref={ref} type="file" accept={accept} multiple={multiple} className="hidden"
          onChange={(e) => handleFiles(e.target.files)} />
        <Icon className="w-7 h-7 text-gray-300" />
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-xs text-gray-400">Drag & drop or click to upload</p>
      </div>
      {files.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {files.map((f, i) => (
            <div key={f.id} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-square">
              <img src={f.preview} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button type="button" onClick={() => onRemove(f.id)}
                  className="p-1.5 bg-red-500 rounded-lg text-white">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {i === 0 && (
                <span className="absolute top-1 left-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-md font-bold">Main</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Variant Card ─────────────────────────────────────────────────────────────
const VariantCard = ({ variant, index, onChange, onRemove, isOnly }) => {
  const set = (path, val) => {
    const keys = path.split(".");
    const updated = { ...variant };
    let obj = updated;
    keys.slice(0, -1).forEach((k) => { obj[k] = { ...obj[k] }; obj = obj[k]; });
    obj[keys[keys.length - 1]] = val;
    onChange(updated);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 rounded-2xl border border-gray-100 bg-gray-50 space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="SKU" required>
          <Input placeholder="PROD-50ML-ROSE" value={variant.sku}
            onChange={(e) => set("sku", e.target.value.toUpperCase())} />
        </Field>
        <Field label="Barcode">
          <Input placeholder="8901234567890" value={variant.barcode}
            onChange={(e) => set("barcode", e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Field label="Size"><Input placeholder="50ml" value={variant.attributes.size} onChange={(e) => set("attributes.size", e.target.value)} /></Field>
        <Field label="Shade"><Input placeholder="Rose Beige" value={variant.attributes.shade} onChange={(e) => set("attributes.shade", e.target.value)} /></Field>
        <Field label="Scent"><Input placeholder="Lavender" value={variant.attributes.scent} onChange={(e) => set("attributes.scent", e.target.value)} /></Field>
        <Field label="Pack Of"><Input type="number" min="1" placeholder="1" value={variant.attributes.packOf} onWheel={(e) => e.target.blur()}  onChange={(e) => set("attributes.packOf", e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="MRP (₹)" required><Input type="number" min="0" placeholder="599" value={variant.price.mrp} onWheel={(e) => e.target.blur()}  onChange={(e) => set("price.mrp", e.target.value)} /></Field>
        <Field label="Selling Price (₹)" required><Input type="number" min="0" placeholder="399" value={variant.price.sellingPrice} onWheel={(e) => e.target.blur()}  onChange={(e) => set("price.sellingPrice", e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Field label="Stock Qty" required><Input type="number" min="0" placeholder="100" value={variant.stock.quantity} onWheel={(e) => e.target.blur()}  onChange={(e) => set("stock.quantity", e.target.value)} /></Field>
        <Field label="Low Stock Alert"><Input type="number" min="0" placeholder="10" value={variant.stock.lowStockAlert} onWheel={(e) => e.target.blur()}  onChange={(e) => set("stock.lowStockAlert", e.target.value)} /></Field>
        {/* <Field label="Net Weight"><Input type="number" min="0" placeholder="50" value={variant.weight.value} onWheel={(e) => e.target.blur()}  onChange={(e) => set("weight.value", e.target.value)} /></Field> */}
        {/* <Field label="Unit">
          <Select value={variant.weight.unit} onChange={(e) => set("weight.unit", e.target.value)}>
            {WEIGHT_UNITS.map((u) => <option key={u}>{u}</option>)}
          </Select>
        </Field> */}
      </div>
    </motion.div>
  );
};

// ─── Ingredient Row ───────────────────────────────────────────────────────────
const IngredientRow = ({ ing, onChange, onRemove }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="grid grid-cols-12 gap-2 items-end p-3 rounded-xl bg-gray-50 border border-gray-100"
  >
    <div className="col-span-3"><Field label="Name"><Input placeholder="Aloe Vera" value={ing.name} onChange={(e) => onChange({ ...ing, name: e.target.value })} /></Field></div>
    <div className="col-span-3"><Field label="INCI Name"><Input placeholder="Aloe Barbadensis Leaf Juice" value={ing.inci} onChange={(e) => onChange({ ...ing, inci: e.target.value })} /></Field></div>
    <div className="col-span-2"><Field label="Benefit"><Input placeholder="Hydrates" value={ing.benefit} onChange={(e) => onChange({ ...ing, benefit: e.target.value })} /></Field></div>
    <div className="col-span-1"><Field label="%"><Input type="number" min="0" max="100" placeholder="5" value={ing.percentage} onWheel={(e) => e.target.blur()}  onChange={(e) => onChange({ ...ing, percentage: e.target.value })} /></Field></div>
    <div className="col-span-2 pb-1"><Toggle checked={ing.isKeyActive} onChange={(v) => onChange({ ...ing, isKeyActive: v })} label={<span className="text-xs text-gray-500">Key</span>} /></div>
    <div className="col-span-1 pb-1">
      <button type="button" onClick={onRemove} className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition"><Trash2 className="w-4 h-4" /></button>
    </div>
  </motion.div>
);

// ─── Add Product Form ─────────────────────────────────────────────────────────
export function AddProductForm({ onClose, fetchProducts, fetchCategories }) {
  const [form, setForm] = useState({
    name: "", brand: "N-Organics", category: "", subCategory: "",
    tag: null,   // ← single tag (string | null)
    
    shortDescription: "", description: "", highlights: [""],
    // isFeatured: false, isBestseller: false, isNewArrival: false, isActive: true,
    isFreeShipping: false, hsn: "", taxRate: 18,
    skincareDetails: {
      skinType: [], skinConcerns: [], claims: [],
      usage: { howToUse: "", frequency: "", whenToApply: "", amountToUse: "" },
      shelfLife: { months: "", paoMonths: "" },
      certifications: "", countryOfOrigin: "India", madeWithoutList: "",
    },
    packaging: {
      type: "", material: "", isRecyclable: false,
      dimensions: { length: "", width: "", height: "" },
      shippingWeight: "",
    },
  });

  const [variants, setVariants]               = useState([{ ...emptyVariant(), isDefault: true }]);
  const [ingredients, setIngredients]         = useState([]);
  const [images, setImages]                   = useState([]);
  const [videos, setVideos]                   = useState([]);
  const [variantImageGroups, setVariantImageGroups] = useState([{ id: Date.now(), images: [] }]);

  // ── NEW: category image & tag image state ──────────────────────────────────
  const [categoryImage, setCategoryImage] = useState(null); // { id, file, preview }
  const [tagImage, setTagImage]           = useState(null); // { id, file, preview }
  const [submitted, setSubmitted]         = useState(false);

  // When tag changes, clear tagImage if tag is removed
  const handleTagChange = (val) => {
    setForm((p) => ({ ...p, tag: val }));
    if (!val) setTagImage(null);
  };

  const set = (path, val) => {
    const keys = path.split(".");
    setForm((prev) => {
      const next = { ...prev };
      let obj = next;
      keys.slice(0, -1).forEach((k) => { obj[k] = { ...obj[k] }; obj = obj[k]; });
      obj[keys[keys.length - 1]] = val;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const cleanedVariants = variants.map(({ id, ...v }) => ({
        ...v,
        price: { mrp: Number(v.price?.mrp || 0), sellingPrice: Number(v.price?.sellingPrice || 0) },
        stock: { quantity: Number(v.stock?.quantity || 0), lowStockAlert: Number(v.stock?.lowStockAlert || 10) },
        // weight: v.weight ? { value: Number(v.weight?.value || 0), unit: v.weight?.unit || "ml" } : undefined,
        packOf: v.attributes?.packOf ? Number(v.attributes.packOf) : undefined,
        isDefault: !!v.isDefault,
        isActive: v.isActive !== false,
      }));

      const cleanedIngredients = ingredients.map(({ id, ...i }) => ({
        ...i,
        percentage: i.percentage !== "" && i.percentage !== undefined ? Number(i.percentage) : undefined,
        isKeyActive: !!i.isKeyActive,
      }));

      const formData = new FormData();

      // Text fields
      formData.append("name",             form.name || "");
      formData.append("brand",            form.brand || "");
      formData.append("category",         form.category || "");
      formData.append("subCategory",      form.subCategory || "");
      formData.append("tag",              form.tag || "");
      formData.append("shortDescription", form.shortDescription || "");
      formData.append("description",      form.description || "");
      // formData.append("status",           form.status || "draft");
      formData.append("hsn",              form.hsn || "");
      formData.append("taxRate",          String(form.taxRate));
      formData.append("isActive",         String(form.isActive));
      // formData.append("isFeatured",       String(form.isFeatured));
      // formData.append("isBestseller",     String(form.isBestseller));
      // formData.append("isNewArrival",     String(form.isNewArrival));
      // formData.append("isFreeShipping",   String(form.isFreeShipping));

      // JSON fields
      formData.append("highlights",       JSON.stringify(form.highlights));
      formData.append("skincareDetails",  JSON.stringify(form.skincareDetails));
      formData.append("ingredients",      JSON.stringify(cleanedIngredients));
      formData.append("packaging",        JSON.stringify(form.packaging));
      formData.append("variants",         JSON.stringify(cleanedVariants));

      // Product images
      images.forEach((img) => {
        if (img.file) formData.append("images", img.file);
      });

      // ── NEW: Category image ──
      if (categoryImage?.file) {
        formData.append("categoryImage", categoryImage.file);
        formData.append("categoryImageAlt", categoryImage.altText || "");
      }

      // ── NEW: Tag image ──
      if (tagImage?.file && form.tag) {
        formData.append("tagImage", tagImage.file);
        formData.append("tagImageTag",  form.tag);
        formData.append("tagImageAlt",  tagImage.altText || "");
      }

      // Variant images
      variantImageGroups?.forEach((group, variantIndex) => {
  group.images?.forEach((img) => {
    if (img.file) {
      formData.append(`variantImage_${variantIndex}`, img.file);  // ← key has index
      formData.append(`variantImageAlt_${variantIndex}_${img.file.name}`, img.altText || "");
    }
  });
});

      // Videos
      videos.forEach((vid) => {
        if (vid.file) {
          formData.append("videos", vid.file);
          formData.append(`videoTitle_${vid.file.name}`, vid.title || "Product video");
        }
      });

      const response = await fetch(`${BASE_URL}/admin/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to create product");

      toast.success("Product created successfully");
      fetchProducts()
      fetchCategories()
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); onClose(); }, 1500);
    } catch (error) {
      console.error("❌ Error creating product:", error);
      const res = error.response?.data;
      if (res) {
        if (Array.isArray(res.details) && res.details.length > 0) {
          res.details.forEach((detail) => toast.error(`• ${detail.message}`));
          return;
        }
        if (res.message) { toast.error(res.message); return; }
      }
      toast.error(error.message || "Something went wrong");
    }
  };

  // Active tag color
  const activeTagColor = form.tag ? TAG_COLORS[form.tag] : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* ── Basic Info ── */}
      <SectionCard icon={Info} title="Basic Information" color="emerald">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Product Name" required>
            <Input placeholder="Vitamin C Glow Serum" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Brand">
            <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} />
          </Field>
        </div>

        {/* Category + Category Image — side by side */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Sub Category">
            <Input placeholder="Vitamin C" value={form.subCategory} onChange={(e) => set("subCategory", e.target.value)} />
          </Field>

          {/* ── Category field + image inline ── */}
          <div className="col-span-2 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <FolderOpen className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Category</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category Name" required>
                <Input
                  placeholder="Face Serum"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                />
                {form.category && (
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">
                    Image below will represent "{form.category}" on category pages
                  </p>
                )}
              </Field>

              {/* Category image upload */}
              <SingleImageUpload
                file={categoryImage}
                onAdd={setCategoryImage}
                onRemove={() => setCategoryImage(null)}
                label="Category Image"
                hint={form.category ? `Representative image for "${form.category}"` : "Enter category name first"}
                accentColor="emerald"
              />
            </div>
          </div>
        </div>

        {/* ── Tag + Tag Image — side by side ── */}
        <div className="p-4 rounded-2xl border space-y-3 transition-all duration-300"
          style={{
            backgroundColor: activeTagColor ? `${activeTagColor.light}` : "#f9fafb",
            borderColor: activeTagColor ? activeTagColor.border.replace("border-","") : "#f3f4f6",
          }}
          // tailwind can't do dynamic so we use inline style trick above and keep classes static:
          // classes are just for non-color styles:
        >
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" style={{ color: activeTagColor ? "#" : "#6b7280" }} />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Product Tag & Tag Image</span>
            {form.tag && (
              <span className={cn("ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full text-white", activeTagColor?.bg)}>
                {form.tag.toUpperCase()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Single tag selector */}
            <Field label="Select Tag" hint="Pick one — shown as a badge on the product card">
              <div className="flex flex-wrap gap-2">
                {TAGS.map((opt) => {
                  const active = form.tag === opt;
                  const tc = TAG_COLORS[opt];
                  return (
                    <button key={opt} type="button"
                      onClick={() => handleTagChange(active ? null : opt)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-semibold border capitalize transition-all",
                        active
                          ? `${tc.bg} text-white ${tc.border}`
                          : `bg-white ${tc.text} ${tc.border} hover:${tc.light}`
                      )}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Tag image upload — only shown when a tag is selected */}
            {/* <AnimatePresence>
              {form.tag ? (
                <motion.div
                  key="tag-image"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2 }}
                >
                  <SingleImageUpload
                    file={tagImage}
                    onAdd={setTagImage}
                    onRemove={() => setTagImage(null)}
                    label={`Tag Image — "${form.tag}"`}
                    hint={`Shown on the "${form.tag}" section/banner`}
                    accentColor={
                      form.tag === "bestseller" ? "amber"
                      : form.tag === "new"       ? "sky"
                      : form.tag === "combo"     ? "violet"
                      : "rose"
                    }
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="tag-placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 py-6"
                >
                  <p className="text-xs text-gray-400 text-center px-4">Select a tag above<br/>to upload its image</p>
                </motion.div>
              )}
            </AnimatePresence> */}
          </div>
        </div>

        <Field label="Short Description" hint="Max 300 chars">
          <Textarea rows={2} maxLength={300} placeholder="A lightweight, fast-absorbing serum…"
            value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
        </Field>
        <Field label="Full Description">
          <Textarea rows={4} placeholder="Write detailed product description…"
            value={form.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="Highlights" hint="Key bullet points">
          <div className="space-y-2">
            {form.highlights.map((h, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <Input placeholder="e.g. 24-hr hydration" value={h}
                  onChange={(e) => { const arr = [...form.highlights]; arr[i] = e.target.value; set("highlights", arr); }} />
                <button type="button" onClick={() => set("highlights", form.highlights.filter((_, idx) => idx !== i))}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => set("highlights", [...form.highlights, ""])}
              className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium">
              <Plus className="w-3.5 h-3.5" /> Add highlight
            </button>
          </div>
        </Field>

        <Field label="Product Status">
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
</Field>
        {/* <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-2xl">
          <Toggle checked={form.isFeatured}    onChange={(v) => set("isFeatured", v)}    label="Featured" />
          <Toggle checked={form.isBestseller}  onChange={(v) => set("isBestseller", v)}  label="Bestseller" />
          <Toggle checked={form.isNewArrival}  onChange={(v) => set("isNewArrival", v)}  label="New Arrival" />
          <Toggle checked={form.isFreeShipping}onChange={(v) => set("isFreeShipping", v)} label="Free Shipping" />
        </div> */}
      </SectionCard>

      {/* ── Media ── */}
      <SectionCard icon={ImageIcon} title="Images & Videos" color="sky" defaultOpen={false}>
        <Field label="Product Images" required hint="First image = main display">
          <MediaDropZone accept="image/*" label="Upload product images" multiple icon={ImageIcon}
            files={images}
            onAdd={(arr) => setImages((p) => [...p, ...arr])}
            onRemove={(id) => setImages((p) => p.filter((f) => f.id !== id))} />
        </Field>
        <Field label="Product Videos" hint="Optional">
          <MediaDropZone accept="video/*" label="Upload product videos" multiple icon={Video}
            files={videos}
            onAdd={(arr) => setVideos((p) => [...p, ...arr])}
            onRemove={(id) => setVideos((p) => p.filter((f) => f.id !== id))} />
        </Field>
      </SectionCard>

      {/* ── Variants ── */}
      <SectionCard icon={Box} title="Variants & Pricing" color="amber">
        <AnimatePresence>
          {variants.map((v, i) => (
            <motion.div key={v.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-4 border border-gray-100 rounded-2xl p-4 bg-white mb-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="text-sm font-semibold text-gray-700">Variant {i + 1} {v.sku && <span className="text-gray-400 font-normal">— {v.sku}</span>}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Toggle checked={v.isDefault} onChange={() => {
                    const arr = [...variants]; arr.forEach((variant, idx) => { variant.isDefault = idx === i; }); setVariants(arr);
                  }} label="Default" />
                  {variants.length > 1 && (
                    <button type="button" onClick={() => { setVariantImageGroups(prev => prev.filter((_, idx) => idx !== i)); setVariants(prev => prev.filter((_, idx) => idx !== i)); }}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <VariantCard variant={v} index={i} isOnly={variants.length === 1}
                onChange={(updated) => { const arr = [...variants]; arr[i] = updated; setVariants(arr); }} />
              <Field label={`Images for ${v.sku || `Variant ${i + 1}`}`} hint="Optional — overrides product images for this variant">
                <MediaDropZone accept="image/*" label={`Upload images for ${v.sku || `Variant ${i + 1}`}`} multiple
                  files={variantImageGroups[i]?.images || []}
                  onAdd={(arr) => setVariantImageGroups(prev => { const g = [...prev]; if (!g[i]) g[i] = { id: Date.now(), images: [] }; g[i].images = [...g[i].images, ...arr]; return g; })}
                  onRemove={(id) => setVariantImageGroups(prev => { const g = [...prev]; if (g[i]) g[i].images = g[i].images.filter(img => img.id !== id); return g; })} />
              </Field>
            </motion.div>
          ))}
        </AnimatePresence>
        <button type="button"
          onClick={() => { setVariants([...variants, emptyVariant()]); setVariantImageGroups(prev => [...prev, { id: Date.now(), images: [] }]); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-sm font-medium transition w-full justify-center">
          <Plus className="w-4 h-4" /> Add Variant
        </button>
      </SectionCard>

      {/* ── Skincare ── */}
      <SectionCard icon={Leaf} title="Skincare Details" color="emerald" defaultOpen={false}>
        <Field label="Skin Type"><PillToggle value={form.skincareDetails.skinType} options={SKIN_TYPES} onChange={(v) => set("skincareDetails.skinType", v)} /></Field>
        <Field label="Skin Concerns"><PillToggle value={form.skincareDetails.skinConcerns} options={SKIN_CONCERNS} onChange={(v) => set("skincareDetails.skinConcerns", v)} /></Field>
        <Field label="Claims"><PillToggle value={form.skincareDetails.claims} options={CLAIMS} onChange={(v) => set("skincareDetails.claims", v)} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Frequency"><Input placeholder="Twice daily" value={form.skincareDetails.usage.frequency} onChange={(e) => set("skincareDetails.usage.frequency", e.target.value)} /></Field>
          <Field label="When To Apply"><Input placeholder="Morning & Night" value={form.skincareDetails.usage.whenToApply} onChange={(e) => set("skincareDetails.usage.whenToApply", e.target.value)} /></Field>
          <Field label="Amount To Use"><Input placeholder="Pea-sized amount" value={form.skincareDetails.usage.amountToUse} onChange={(e) => set("skincareDetails.usage.amountToUse", e.target.value)} /></Field>
          <Field label="Country of Origin"><Input value={form.skincareDetails.countryOfOrigin} onChange={(e) => set("skincareDetails.countryOfOrigin", e.target.value)} /></Field>
        </div>
        <Field label="How To Use">
          <Textarea rows={3} placeholder="Step 1: Cleanse face…" value={form.skincareDetails.usage.howToUse} onChange={(e) => set("skincareDetails.usage.howToUse", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Shelf Life (months)"><Input type="number" placeholder="24" value={form.skincareDetails.shelfLife.months} onChange={(e) => set("skincareDetails.shelfLife.months", e.target.value)} /></Field>
          <Field label="PAO (months)"><Input type="number" placeholder="12" value={form.skincareDetails.shelfLife.paoMonths} onChange={(e) => set("skincareDetails.shelfLife.paoMonths", e.target.value)} /></Field>
        </div>
        <Field label="Certifications" hint="Comma-separated"><Input placeholder="USDA Organic, ECOCERT" value={form.skincareDetails.certifications} onChange={(e) => set("skincareDetails.certifications", e.target.value)} /></Field>
        <Field label="Free From" hint="Comma-separated"><Input placeholder="Mineral Oil, SLS, Parabens" value={form.skincareDetails.madeWithoutList} onChange={(e) => set("skincareDetails.madeWithoutList", e.target.value)} /></Field>
      </SectionCard>

      {/* ── Ingredients ── */}
      <SectionCard icon={Leaf} title="Ingredients (INCI List)" color="rose" defaultOpen={false}>
        <AnimatePresence>
          {ingredients.map((ing) => (
            <IngredientRow key={ing.id} ing={ing}
              onChange={(updated) => setIngredients(ingredients.map((i) => i.id === ing.id ? updated : i))}
              onRemove={() => setIngredients(ingredients.filter((i) => i.id !== ing.id))} />
          ))}
        </AnimatePresence>
        {ingredients.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No ingredients added yet.</p>}
        <button type="button" onClick={() => setIngredients([...ingredients, emptyIngredient()])}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-rose-200 text-rose-500 hover:bg-rose-50 text-sm font-medium transition w-full justify-center">
          <Plus className="w-4 h-4" /> Add Ingredient
        </button>
      </SectionCard>

      {/* ── Packaging ── */}
      <SectionCard icon={Box} title="Packaging, Shipping & Tax" color="slate" defaultOpen={false}>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Package Type">
            <Select value={form.packaging.type} onChange={(e) => set("packaging.type", e.target.value)}>
              <option value="">Select…</option>
              {PACKAGING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Material"><Input placeholder="Glass" value={form.packaging.material} onChange={(e) => set("packaging.material", e.target.value)} /></Field>
          {/* <Field label="Shipping Weight (g)"><Input type="number" placeholder="180" value={form.packaging.shippingWeight} onChange={(e) => set("packaging.shippingWeight", e.target.value)} /></Field>
          <Field label="Length (cm)"><Input type="number" placeholder="5" value={form.packaging.dimensions.length} onChange={(e) => set("packaging.dimensions.length", e.target.value)} /></Field>
          <Field label="Width (cm)"><Input type="number" placeholder="5" value={form.packaging.dimensions.width} onChange={(e) => set("packaging.dimensions.width", e.target.value)} /></Field> */}
          {/* <Field label="Height (cm)"><Input type="number" placeholder="12" value={form.packaging.dimensions.height} onChange={(e) => set("packaging.dimensions.height", e.target.value)} /></Field> */}
        </div>
        <Toggle checked={form.packaging.isRecyclable} onChange={(v) => set("packaging.isRecyclable", v)} label="Recyclable packaging" />
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <Field label="HSN Code"><Input placeholder="33049910" value={form.hsn} onChange={(e) => set("hsn", e.target.value)} /></Field>
          <Field label="GST Tax Rate (%)">
            <Select value={form.taxRate} onChange={(e) => set("taxRate", Number(e.target.value))}>
              {TAX_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
            </Select>
          </Field>
        </div>
      </SectionCard>

      {/* ── Footer ── */}
      <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl">
        <button type="button" onClick={onClose}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
          Cancel
        </button>
        <button type="submit"
          className={cn(
            "flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition",
            submitted ? "bg-emerald-500" : "bg-emerald-600 hover:bg-emerald-700"
          )}>
          {submitted ? <><Check className="w-4 h-4" /> Saved!</> : <><Package className="w-4 h-4" /> Add Product</>}
        </button>
      </div>
    </form>
  );
}

// ─── Modal Wrapper ────────────────────────────────────────────────────────────
export default function ProductModal({ open, onClose,fetchProducts, fetchCategories }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/50 z-40" />
          <motion.div key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
          >
            <div className="w-full max-w-4xl bg-gray-50 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between bg-white px-6 py-5 border-b border-gray-100 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Add New Product</h2>
                    <p className="text-xs text-gray-400">N-Organics · Natural Skincare</p>
                  </div>
                </div>
                <button type="button" onClick={onClose}
                  className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
                <AddProductForm onClose={onClose} fetchProducts={fetchProducts} fetchCategories={fetchCategories} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}