import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Tag, Percent, IndianRupee, Calendar, Users, Layers,
  ChevronDown, ChevronUp, Check, X, Plus, Loader2,
  Info, Package, ToggleLeft, ToggleRight,
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
      {/* Select all / clear */}
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

// ─── Live Preview Card ────────────────────────────────────────────────────────
const VoucherPreview = ({ form }) => {
  const hasCode = form.code.trim().length > 0;
  if (!hasCode && !form.discount) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-dashed border-emerald-200 rounded-2xl p-5 space-y-3"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Preview</p>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm sm:text-base lg:text-lg font-black text-emerald-700 tracking-widest break-all">
              {form.code || "VOUCHERCODE"}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-700">
            {form.title || "Voucher Title"}
          </p>
          {form.description && (
            <p className="text-xs text-gray-400 mt-0.5">{form.description}</p>
          )}
        </div>

        {/* Discount badge */}
        <div className="w-full sm:w-auto flex-shrink-0 bg-emerald-600 text-white rounded-xl px-3 py-2 text-center min-w-[72px]">
          <p className="text-xl font-black leading-none">
            {form.discount || "0"}
            {form.discountType === "percentage" ? "%" : "₹"}
          </p>
          <p className="text-[9px] uppercase tracking-wider mt-0.5 opacity-80">OFF</p>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-emerald-200/60">
        {form.minOrderValue > 0 && (
          <span className="text-[10px] bg-white text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
            Min. ₹{form.minOrderValue}
          </span>
        )}
        {form.maxDiscountAmount && (
          <span className="text-[10px] bg-white text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
            Max. ₹{form.maxDiscountAmount} off
          </span>
        )}
        {form.eligibility !== "all" && (
          <span className="text-[10px] bg-white text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-semibold capitalize">
            {form.eligibility === "new_users" ? "New Users Only" : "Existing Users Only"}
          </span>
        )}
        {form.appliesTo === "category" && form.applicableCategories.length > 0 && (
          <span className="text-[10px] bg-white text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-semibold">
            {form.applicableCategories.length} categor{form.applicableCategories.length > 1 ? "ies" : "y"}
          </span>
        )}
        {/* in VoucherPreview meta row, after the category pill */}
{form.appliesTo === "product" && form.applicableProductIds.length > 0 && (
  <span className="text-[10px] bg-white text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
    {form.applicableProductIds.length} product{form.applicableProductIds.length > 1 ? "s" : ""}
  </span>
)}
        {form.perUserLimit && (
          <span className="text-[10px] bg-white text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full font-semibold">
            {form.perUserLimit}x per user
          </span>
        )}
      </div>
    </motion.div>
  );
};

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function VoucherModal({  onClose,
  onSuccess,
  voucher, fetchStats,fetchVouchers }) {
  const [form, setForm] = useState({
  code: voucher?.code || "",
  title: voucher?.title || "",
  description: voucher?.description || "",
  discountType: voucher?.discountType || "percentage",
  discount: voucher?.discount || "",
  maxDiscountAmount: voucher?.maxDiscountAmount || "",
  minOrderValue: voucher?.minOrderValue || "",
  eligibility: voucher?.eligibility || "all",
  appliesTo: voucher?.appliesTo || "all",
  applicableCategories: voucher?.applicableCategories || [],
  applicableProductIds: voucher?.applicableProductIds || [],
  maxUses: voucher?.maxUses || "",
  perUserLimit: voucher?.perUserLimit || 1,
  startDate: voucher?.startDate
  ? formatDateTimeLocal(voucher.startDate)
  : "",

endDate: voucher?.endDate
  ? formatDateTimeLocal(voucher.endDate)
  : "",
  isActive: voucher?.isActive ?? true,


  
});


const isEditMode = !!voucher;

  const [errors,     setErrors]     = useState({});
  const [loading,    setLoading]    = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);

  // ── Fetch categories ───────────────────────────────────────────────────────
  useEffect(() => {
    setCatLoading(true);
    fetch(`${BASE_URL}/admin/products/categories`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCategories(json.data || []);
      })
      
      
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setCatLoading(false));
  }, []);
  useEffect(() => {
  if (form.appliesTo === "product") {
    fetchProducts();
  }
}, []);

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: null }));
  };

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};

    if (!form.code.trim())
      e.code = "Code is required";
    else if (!/^[A-Z0-9_-]+$/.test(form.code.trim()))
      e.code = "Only uppercase letters, numbers, hyphens and underscores";

    if (!form.title.trim())
      e.title = "Title is required";

    if (!form.discount || Number(form.discount) <= 0)
      e.discount = "Enter a valid discount amount";
    else if (form.discountType === "percentage" && Number(form.discount) > 100)
      e.discount = "Percentage cannot exceed 100";

    if (!form.startDate)
      e.startDate = "Start date is required";
    console.log(form.startDate, form.endDate);

    if (!form.endDate)
      e.endDate = "End date is required";
    else if (form.startDate && new Date(form.endDate) <= new Date(form.startDate))
      e.endDate = "End date must be after start date";

    if (form.appliesTo === "category" && form.applicableCategories.length === 0)
      e.applicableCategories = "Select at least one category";
    if (form.appliesTo === "product" && form.applicableProductIds.length === 0) // ← ADD
  e.applicableProductIds = "Select at least one product";

    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const [products,    setProducts]    = useState([]);
const [prodLoading, setProdLoading] = useState(false);

// Fetch products — lazy, only when "product" tab is selected
const fetchProducts = async () => {
  if (products.length > 0) return; // already fetched
  setProdLoading(true);
  fetch(`${BASE_URL}/admin/products/list`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
    .then((r) => r.json())
    .then((json) => { if (json.success) setProducts(json.data || []); })
    .catch(() => toast.error("Failed to load products"))
    .finally(() => setProdLoading(false));
};

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        code:        form.code.trim().toUpperCase(),
        title:       form.title.trim(),
        description: form.description.trim(),
        discountType: form.discountType,
        discount:    Number(form.discount),
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
        minOrderValue:     form.minOrderValue     ? Number(form.minOrderValue)     : 0,
        eligibility:       form.eligibility,
        appliesTo:         form.appliesTo,
        applicableCategories:
          form.appliesTo === "category" ? form.applicableCategories : [],
        applicableProductIds:                                          // ← ADD
    form.appliesTo === "product" ? form.applicableProductIds : [],
        maxUses:      form.maxUses      ? Number(form.maxUses)      : null,
        perUserLimit: Number(form.perUserLimit) || 1,
        startDate:    new Date(form.startDate).toISOString(),
        endDate:      new Date(form.endDate).toISOString(),
        isActive:     form.isActive,
      };

      const res = await fetch(
  isEditMode
    ? `${BASE_URL}/admin/vouchers/${voucher._id}`
    : `${BASE_URL}/admin/vouchers`,
  {
    method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type":  "application/json",
          Authorization:   `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create voucher");

      toast.success(
  isEditMode
    ? "Voucher updated successfully"
    : "Voucher created successfully"
);
fetchStats()
fetchVouchers()
      console.log(payload)
      setSubmitted(true);
      onSuccess?.();
      setTimeout(() => { setSubmitted(false); onClose?.(); }, 1200);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── Auto-uppercase code as user types ─────────────────────────────────────
  const handleCodeChange = (e) => {
    set("code", e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""));
  };

  // ── Today for date min ─────────────────────────────────────────────────────
  const todayStr = new Date().toISOString().slice(0, 16);

  return (
    <form
  onSubmit={handleSubmit}
  className="space-y-4 w-full max-w-[100vw] overflow-x-hidden"
>

      {/* ── Live Preview ── */}
      <VoucherPreview form={form} />

      {/* ── Basic Info ── */}
      <SectionCard icon={Tag} title="Voucher Details" color="emerald">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Voucher Code" required error={errors.code}
            hint="Letters, numbers, - and _ only">
            <div className="relative">
              <Input
                placeholder="GLOW20"
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
              placeholder="Summer Glow Sale"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              error={errors.title}
            />
          </Field>
        </div>

        <Field label="Description" hint="Shown to users on the voucher card">
          <Input
            placeholder="Get extra 20% off on all skincare products"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Discount Type" required>
            <SelectEl
              value={form.discountType}
              onChange={(e) => { set("discountType", e.target.value); set("maxDiscountAmount", ""); }}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </SelectEl>
          </Field>

          <Field
            label={form.discountType === "percentage" ? "Discount (%)" : "Discount (₹)"}
            required
            error={errors.discount}
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
                {form.discountType === "percentage" ? "%" : "₹"}
              </span>
              <Input
                type="number"
                min="1"
                max={form.discountType === "percentage" ? "100" : undefined}
                placeholder={form.discountType === "percentage" ? "20" : "100"}
                value={form.discount}
                onChange={(e) => set("discount", e.target.value)}
                onWheel={(e) => e.target.blur()}
                error={errors.discount}
                className="pl-7"
              />
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Max discount cap — only for percentage */}
          {form.discountType === "percentage" && (
            <Field label="Max Discount Cap (₹)"
              hint="e.g. 20% off but max ₹200 saved">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <Input
                  type="number"
                  min="1"
                  placeholder="200"
                  value={form.maxDiscountAmount}
                  onChange={(e) => set("maxDiscountAmount", e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  className="pl-7"
                />
              </div>
            </Field>
          )}

          <Field label="Minimum Order Value (₹)"
            hint="Cart must be at least this amount">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <Input
                type="number"
                min="0"
                placeholder="499"
                value={form.minOrderValue}
                onChange={(e) => set("minOrderValue", e.target.value)}
                onWheel={(e) => e.target.blur()}
                className="pl-7"
              />
            </div>
          </Field>
        </div>

        {/* Discount summary box */}
        {form.discount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
            <strong>Summary:</strong>{" "}
            {form.discountType === "percentage"
              ? `${form.discount}% off${form.maxDiscountAmount ? `, capped at ₹${form.maxDiscountAmount}` : ""}`
              : `Flat ₹${form.discount} off`}
            {form.minOrderValue > 0 ? ` on orders above ₹${form.minOrderValue}` : " on all orders"}
          </div>
        )}
      </SectionCard>

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
        { value: "all",      label: "All Products",         hint: "Works on entire cart" },
        { value: "product",  label: "Specific Products",    hint: "Only selected products" },
        { value: "category", label: "Specific Categories",  hint: "Only selected category products" },
      ].map((opt) => {
        const active = form.appliesTo === opt.value;
        return (
          <button key={opt.value} type="button"
            onClick={() => {
              set("appliesTo", opt.value);
              if (opt.value === "all") {
                set("applicableCategories", []);
                set("applicableProductIds", []);
              }
              if (opt.value === "product") {
                set("applicableCategories", []);
                fetchProducts(); // lazy load on first click
              }
              if (opt.value === "category") {
                set("applicableProductIds", []);
              }
            }}
            className={cn(
              "flex flex-col items-start gap-1 p-3 rounded-xl border-2 text-left transition-all",
              active ? "border-sky-500 bg-sky-50 shadow-sm" : "border-gray-200 bg-gray-50 hover:border-sky-300"
            )}
          >
            <span className={cn("text-xs font-bold", active ? "text-sky-700" : "text-gray-700")}>
              {opt.label}
            </span>
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
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <Field
          label="Select Products"
          required
          error={errors.applicableProductIds}
          hint="Voucher will only apply to these specific products"
        >
          {console.log(products)}
          {prodLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading products…
            </div>
          ) : products.length === 0 ? (
            <p className="text-sm text-gray-400 py-3 text-center border-2 border-dashed border-gray-200 rounded-xl">
              No products found.
            </p>
          ) : (
            <div className="space-y-2">
              {/* Select all / Clear */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <button type="button"
                  onClick={() => set("applicableProductIds", products.map((p) => p._id))}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition">
                  Select All
                </button>
                <span className="text-gray-300">·</span>
                <button type="button"
                  onClick={() => set("applicableProductIds", [])}
                  className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition">
                  Clear
                </button>
                {form.applicableProductIds.length > 0 && (
                  <span className="ml-auto text-xs text-emerald-600 font-semibold">
                    {form.applicableProductIds.length} selected
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                {products.map((p) => {
                  const active = form.applicableProductIds.includes(p._id);
                  return (
                    <button key={p._id} type="button"
                      onClick={() => {
                        set(
                          "applicableProductIds",
                          active
                            ? form.applicableProductIds.filter((id) => id !== p._id)
                            : [...form.applicableProductIds, p._id]
                        );
                      }}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all",
                        active
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                      )}
                    >
                      <span className={cn(
                        "w-4 h-4 rounded-md border flex-shrink-0 flex items-center justify-center",
                        active ? "bg-white/30 border-white/50" : "border-gray-300"
                      )}>
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

  {/* Category selector — unchanged */}
  <AnimatePresence>
    {form.appliesTo === "category" && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <Field
          label="Select Categories"
          required
          error={errors.applicableCategories}
          hint="Voucher will only apply to products in the selected categories"
        >
          <CategoryCheckboxGrid
            categories={categories}
            selected={form.applicableCategories}
            onChange={(val) => set("applicableCategories", val)}
            loading={catLoading}
          />
        </Field>
      </motion.div>
    )}
  </AnimatePresence>
</SectionCard>

      {/* ── Usage Limits ── */}
      <SectionCard icon={Package} title="Usage Limits" color="rose" defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Total Uses Allowed"
            hint="Leave empty for unlimited">
            <Input
              type="number"
              min="1"
              placeholder="Unlimited"
              value={form.maxUses}
              onChange={(e) => set("maxUses", e.target.value)}
              onWheel={(e) => e.target.blur()}
            />
          </Field>

          <Field label="Uses Per User"
            hint="How many times one user can apply this">
            <Input
              type="number"
              min="1"
              max="10"
              placeholder="1"
              value={form.perUserLimit}
              onChange={(e) => set("perUserLimit", e.target.value)}
              onWheel={(e) => e.target.blur()}
            />
          </Field>
        </div>

        {/* Info box */}
        <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <p>Most vouchers are <strong>single-use per user</strong> (per user limit = 1). Set total uses to cap global redemptions.</p>
        </div>
      </SectionCard>

      {/* ── Validity ── */}
      <SectionCard icon={Calendar} title="Validity Period" color="slate">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Start Date & Time" required error={errors.startDate}>
            <Input
              type="datetime-local"
              min={todayStr}
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
              error={errors.startDate}
              disabled={isEditMode}
            />
          </Field>

          <Field label="End Date & Time" required error={errors.endDate}>
            <Input
              type="datetime-local"
              min={form.startDate || todayStr}
              value={form.endDate}
              onChange={(e) => set("endDate", e.target.value)}
              error={errors.endDate}
            />
          </Field>
        </div>

        {/* Duration display */}
        {form.startDate && form.endDate && new Date(form.endDate) > new Date(form.startDate) && (
         <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center gap-2 break-words">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Valid for{" "}
            <strong>
              {Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24))} day(s)
            </strong>
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
            submitted ? "bg-emerald-500" : "bg-emerald-600 hover:bg-emerald-700",
            loading && "opacity-70 cursor-not-allowed"
          )}
        >
          {loading ? (
  <>
    <Loader2 className="w-4 h-4 animate-spin" />
    {isEditMode ? "Updating…" : "Creating…"}
  </>
) : submitted ? (
  <>
    <Check className="w-4 h-4" />
    {isEditMode ? "Updated!" : "Created!"}
  </>
) : (
  <>
    <Tag className="w-4 h-4" />
    {isEditMode ? "Update Voucher" : "Create Voucher"}
  </>
)}
        </button>
      </div>
    </form>
  );
}