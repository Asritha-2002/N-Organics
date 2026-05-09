import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, X, Upload, Percent, DollarSign, ChevronDown, Plus, Check } from 'lucide-react';
const BASE_URL = import.meta.env.VITE_BASE_URL;
import toast from "react-hot-toast"

const initialForm = {
  title: '',
  description: '',
  buttonText: 'Shop Now',
  image: null,
  imagePreview: null,
  discount: '',
  discountType: 'percentage',
  appliesTo: 'all',
  categoryIds: [],
  startDate: '',
  endDate: '',
  maxUses: '',
  perUserLimit: '1',
  isActive: true,
  priority: '',
};

const formatForDatetimeLocal = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

function FormField({ label, required, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
        {label}
        {required && <span className="text-[#00bc7d]">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition ${className}`}
      {...props}
    />
  );
}

function Select({ children, className = '', ...props }) {
  return (
    <div className="relative">
      <select
        className={`w-full appearance-none px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition pr-9 ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition resize-none ${className}`}
      {...props}
    />
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 ${checked ? 'bg-[#00bc7d]' : 'bg-gray-300'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
}

export default function BannerModal({ isOpen, onClose, onSave, bannerData }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const [categories, setCategories] = useState([]);
const [loadingCategories, setLoadingCategories] = useState(false);


useEffect(() => {
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const response = await fetch(
        `${BASE_URL}/admin/products/categories`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.log("Category fetch error:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  if (isOpen) {
    fetchCategories();
  }
}, [isOpen]);

const handleCategoryChange = (category) => {
  setForm((prev) => {
    const alreadySelected = prev.categoryIds.includes(category);

    return {
      ...prev,
      categoryIds: alreadySelected
        ? prev.categoryIds.filter((item) => item !== category)
        : [...prev.categoryIds, category],
    };
  });
};

  useEffect(() => {
    if (bannerData) {
      setForm({
  ...bannerData,
  categoryIds: Array.isArray(bannerData.categoryIds)
    ? bannerData.categoryIds
    : JSON.parse(bannerData.categoryIds || "[]"),

  startDate: formatForDatetimeLocal(bannerData.startDate),
  endDate: formatForDatetimeLocal(bannerData.endDate),
  imagePreview: bannerData.image?.url || null,
});
    } else {
      setForm(initialForm);
    }
  }, [bannerData, isOpen]);

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => set('imagePreview', e.target.result);
    reader.readAsDataURL(file);
    set('image', file);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (form.priority === undefined || form.priority === null || form.priority === '' || isNaN(form.priority)) 
      e.priority = 'Priority is required';
    if (!form.discount || isNaN(form.discount) || Number(form.discount) <= 0)
      e.discount = 'Enter a valid discount value';
    if (form.discountType === 'percentage' && Number(form.discount) > 100)
      e.discount = 'Percentage cannot exceed 100';
    if (!form.startDate) e.startDate = 'Start date is required';
    if (!form.endDate) e.endDate = 'End date is required';
    if (form.startDate && form.endDate && form.endDate <= form.startDate)
      e.endDate = 'End date must be after start date';
    if (
  form.appliesTo === "category" &&
  form.categoryIds.length === 0
) e.categoryIds = 'Enter at least one category ID';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("CATEGORY IDS:", form.categoryIds);
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === 'imagePreview') return;

        if (key === 'image' && form[key] instanceof File) {
          formData.append('image', form[key]);
        } else if (form[key] !== null && form[key] !== undefined) {
          if (Array.isArray(form[key])) {
  formData.append(key, JSON.stringify(form[key]));
} else {
  formData.append(key, form[key]);
}
        }
      });

      const isEditMode = !!bannerData;
      // Adjust '_id' if your unique identifier property has a different name
      const url = isEditMode 
        ? `${BASE_URL}/admin/banners/${bannerData._id}` 
        : `${BASE_URL}/admin/banners`;
      
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isEditMode ? 'update' : 'create'} banner`);
      }

      const result = await response.json();
      toast.success(`Banner ${isEditMode ? 'updated' : 'created'} successfully!`);
      
      if (onSave) {
        onSave(result); // Pass updated data back to parent state
      }
      onClose();
    } catch (error) {
      console.error('Error submitting banner:', error);
      toast.error(`Banner ${bannerData ? 'update' : 'creation'} failed!`);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00bc7d] shadow text-white">
              <Image className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {bannerData ? 'Edit Banner' : 'Add New Banner'}
              </h2>
              <p className="text-xs text-gray-500">
                {bannerData ? 'Update the details for the banner' : 'Fill in the details to create a promotional banner'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-6">
          {/* Section: Display */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#00bc7d] mb-4">Display</p>
            <div className="space-y-4">
              <FormField label="Banner Image">
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImageFile(e.dataTransfer.files[0]); }}
                  className={`relative rounded-2xl border-2 border-dashed transition cursor-pointer overflow-hidden ${dragOver ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-green-300 bg-gray-50'}`}
                  style={{ minHeight: 120 }}
                  onClick={() => document.getElementById('banner-img-input').click()}
                >
                  <input
                    id="banner-img-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFile(e.target.files[0])}
                  />
                  {form.imagePreview ? (
                    <div className="relative">
                      <img src={form.imagePreview} alt="Preview" className="w-full h-36 object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                        <p className="text-white text-xs font-medium">Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Upload className="w-7 h-7 text-gray-300 mb-2" />
                      <p className="text-sm text-gray-400 font-medium">Drag & drop or click to upload</p>
                      <p className="text-xs text-gray-300 mt-1">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  )}
                </div>
              </FormField>

              <FormField label="Title" required>
                <Input
                  placeholder="e.g. Summer Sale — Up to 50% Off"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
              </FormField>

              <FormField label="Description">
                <Textarea
                  placeholder="Short description shown below the banner title…"
                  rows={2}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                />
              </FormField>

              <FormField label="Button Text">
                <Input
                  placeholder="Shop Now"
                  value={form.buttonText}
                  onChange={(e) => set('buttonText', e.target.value)}
                />
              </FormField>

              <FormField label="Priority" required hint="Enter display priority index (e.g. 0, 1, 2)">
                <Input
                  type="number"
                  placeholder="e.g. 0"
                  value={form.priority}
                  onChange={(e) => set('priority', e.target.value)}
                  onWheel={(e) => e.target.blur()} 
                />
                {errors.priority && <p className="text-xs text-red-500">{errors.priority}</p>}
              </FormField>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Section: Discount */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#00bc7d] mb-4">Discount</p>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Discount Type" required>
                <Select value={form.discountType} onChange={(e) => set('discountType', e.target.value)}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </Select>
              </FormField>

              <FormField label="Discount Value" required>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {form.discountType === 'percentage' ? <Percent className="w-4 h-4" /> : <span className="w-4 h-4">₹</span>}
                  </div>
                  <Input
                    type="number"
                    min="0"
                    max={form.discountType === 'percentage' ? 100 : undefined}
                    placeholder={form.discountType === 'percentage' ? '20' : '200'}
                    value={form.discount}
                    onChange={(e) => set('discount', e.target.value)}
                    className="pl-9"
                    onWheel={(e) => e.target.blur()} 
                  />
                </div>
                {errors.discount && <p className="text-xs text-red-500">{errors.discount}</p>}
              </FormField>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Section: Product Targeting */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#00bc7d] mb-4">Product Targeting</p>
            <div className="space-y-4">
              <FormField label="Applies To" required>
                <div className="grid grid-cols-3 gap-2">
                  {['all', 'category'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => set('appliesTo', opt)}
                      className={`py-2 px-3 rounded-xl text-sm font-medium border transition capitalize ${
                        form.appliesTo === opt
                          ? 'bg-[#00bc7d] text-white border-[#00bc7d] shadow-sm'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-green-300'
                      }`}
                    >
                      {opt === 'all' ? 'All Products' : 'By Category'}
                    </button>
                  ))}
                </div>
              </FormField>

              <AnimatePresence>
                {form.appliesTo === 'category' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <FormField label="Category IDs" required hint="Comma-separated MongoDB ObjectIDs">
                      <div className="grid grid-cols-2 gap-3">
  {loadingCategories ? (
    <p className="text-sm text-gray-400">
      Loading categories...
    </p>
  ) : categories.length > 0 ? (
    categories.map((category, index) => {
      const selected = form.categoryIds.includes(category);

      return (
        <button
          type="button"
          key={index}
          onClick={() => handleCategoryChange(category)}
          className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition
            ${
              selected
                ? "bg-[#00bc7d] text-white border-[#00bc7d]"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:border-green-300"
            }`}
        >
          <span>{category}</span>

          {selected && (
            <Check className="w-4 h-4" />
          )}
        </button>
      );
    })
  ) : (
    <p className="text-sm text-gray-400">
      No categories found
    </p>
  )}
</div>
                      {errors.categoryIds && <p className="text-xs text-red-500">{errors.categoryIds}</p>}
                    </FormField>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Section: Schedule & Limits */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#00bc7d] mb-4">Schedule & Limits</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Start Date" required>
                  <Input
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(e) => set('startDate', e.target.value)}
                  />
                  {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
                </FormField>
                <FormField label="End Date" required>
                  <Input
                    type="datetime-local"
                    value={form.endDate}
                    min={form.startDate}
                    onChange={(e) => set('endDate', e.target.value)}
                  />
                  {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Max Total Uses" hint="Leave empty for unlimited">
                  <Input
                    type="number"
                    min="1"
                    placeholder="e.g. 500"
                    value={form.maxUses}
                    onChange={(e) => set('maxUses', e.target.value)}
                    onWheel={(e) => e.target.blur()} 
                  />
                </FormField>
                <FormField label="Per User Limit">
                  <Input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={form.perUserLimit}
                    onChange={(e) => set('perUserLimit', e.target.value)}
                    onWheel={(e) => e.target.blur()} 
                  />
                </FormField>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Active</p>
                  <p className="text-xs text-gray-400">Banner will be visible to users when active</p>
                </div>
                <Toggle checked={form.isActive} onChange={(v) => set('isActive', v)}  />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer flex items-center gap-2 px-6 py-2.5 bg-[#00bc7d] hover:bg-[#00965b] text-white font-semibold rounded-xl transition shadow-sm text-sm"
            >
              {bannerData ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {bannerData ? 'Save Changes' : 'Create Banner'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}