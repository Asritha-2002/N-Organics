import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Plus,
  X,
  Tag,
  Palette,
  Type,
  Upload,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ─── Reusable Button ─────────────────────────────────────────────────────────
const Button = ({ icon: Icon, label, onClick, variant = "primary", className = "" }) => {
  const base = "flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm";
  const styles = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    outline: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
    danger:  "bg-red-50 hover:bg-red-100 text-red-600 border border-red-100",
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
};

// ─── Field wrapper ────────────────────────────────────────────────────────────
const Field = ({ label, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
      {label}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);
// ─── Color picker field ───────────────────────────────────────────────────────
const ColorField = ({ label, value, onChange }) => (
  <Field label={label}>
    <div className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 bg-gray-50">
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
        />
      </div>
      <span className="text-sm font-mono text-gray-700 tracking-widest">{value.toUpperCase()}</span>
      <div
        className="ml-auto w-8 h-8 rounded-lg border border-gray-200 shadow-inner"
        style={{ backgroundColor: value }}
      />
    </div>
  </Field>
);
// ─── Live preview bar ─────────────────────────────────────────────────────────
const PreviewBar = ({ backgroundColor, textColor, sentences, logoPreview }) => {
  const [idx, setIdx] = useState(0);
  const text = sentences.filter(Boolean)[idx % Math.max(sentences.filter(Boolean).length, 1)] || "Your announcement text here…";

  return (
    <div
      className="w-full rounded-xl overflow-hidden shadow-md"
      style={{ backgroundColor }}
    >
      <div className="flex items-center justify-center gap-3 px-6 py-2.5">
        {logoPreview && (
          <img src={logoPreview} alt="logo" className="w-5 h-5 object-contain rounded-sm" />
        )}
        <p
          className="text-xs font-medium tracking-widest uppercase text-center"
          style={{ color: textColor }}
        >
          {text}
        </p>
        {sentences.filter(Boolean).length > 1 && (
          <div className="flex gap-1 ml-2">
            {sentences.filter(Boolean).map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ backgroundColor: i === idx % sentences.filter(Boolean).length ? textColor : `${textColor}55` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AnnouncementModal = ({ bar, onClose, onSave }) => {
  const isEdit = !!bar;
    const [form, setForm] = useState({
    backgroundColor: "#457358",
    textColor: "#ffffff",
    sentences: [""],
    isActive: true,
  });
  
   const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(bar?.logo || null);
  const [logoAltText, setLogoAltText] = useState(bar?.logoAltText || "");
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  React.useEffect(() => {
    if (bar) {
      setForm({
        backgroundColor: bar.backgroundColor || "#457358",
        textColor: bar.textColor || "#ffffff",
        sentences: bar.sentences?.length ? bar.sentences : [""],
        isActive: bar.isActive ?? true,
      });
      setLogoPreview(bar.logo.url || null);
      setLogoAltText(bar.logoAltText || "");
    }
  }, [bar]);

  // sentences helpers
  const addSentence = () => {
    if (!tagInput.trim()) return;
    set("sentences", [...form.sentences.filter(Boolean), tagInput.trim()]);
    setTagInput("");
  };
  const removeSentence = (i) =>
    set("sentences", form.sentences.filter((_, idx) => idx !== i));
  const handleTagKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addSentence(); }
  };

  // logo
  const handleLogoFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setLogo(file);
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

   const handleSubmit = async () => {
    setError("");
    const cleaned = form.sentences.filter(Boolean);
    if (cleaned.length === 0) {
      setError("Add at least one sentence.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("backgroundColor", form.backgroundColor);
      fd.append("textColor", form.textColor);
      fd.append("sentences", JSON.stringify(cleaned));
      fd.append("isActive", String(form.isActive));

      if (logo) {
        fd.append("logo", logo);
        fd.append("logoAltText", logoAltText);
      }

      const token = localStorage.getItem("token");

      const url = isEdit
        ? `${BASE_URL}/admin/announcement-bar/${bar._id}`
        : `${BASE_URL}/admin/announcement-bar`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      if (!res.ok) throw new Error((await res.json()).message || "Failed");

      const data = await res.json();
      onSave(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-fuchsia-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow">
              <Megaphone className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Add Announcement Bar</h2>
              <p className="text-xs text-gray-500">Configure your sitewide announcement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-7 py-6 space-y-6">

          {/* ── Live Preview ── */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-3 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </p>
            <PreviewBar
              backgroundColor={form.backgroundColor}
              textColor={form.textColor}
              sentences={form.sentences}
              logoPreview={logoPreview}
            />
          </div>

          <div className="border-t border-gray-100" />

          {/* ── Colors ── */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-4 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Colors
            </p>
            <div className="grid grid-cols-2 gap-4">
              <ColorField
                label="Background Color"
                value={form.backgroundColor}
                onChange={(v) => set("backgroundColor", v)}
              />
              <ColorField
                label="Text Color"
                value={form.textColor}
                onChange={(v) => set("textColor", v)}
              />
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* ── Sentences / Tags ── */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-4 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" /> Announcement Sentences
            </p>

            {/* Existing tags */}
            {form.sentences.filter(Boolean).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.sentences.filter(Boolean).map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border border-violet-100 bg-violet-50 text-violet-700 max-w-full"
                  >
                    <Tag className="w-3 h-3 shrink-0" />
                    <span className="truncate max-w-[220px]">{s}</span>
                    <button
                      onClick={() => removeSentence(form.sentences.indexOf(s))}
                      className="shrink-0 text-violet-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Add new tag input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKey}
                placeholder="Type a sentence and press + or Enter…"
                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              />
              <button
                onClick={addSentence}
                disabled={!tagInput.trim()}
                className="w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">Press Enter or + to add. Each sentence scrolls in the bar.</p>
          </div>

          <div className="border-t border-gray-100" />

          {/* ── Logo ── */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-4 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Logo <span className="normal-case text-gray-400 font-normal">(optional)</span>
            </p>

            <div
              onClick={() => fileRef.current.click()}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-violet-300 bg-gray-50 cursor-pointer transition"
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleLogoFile(e.target.files[0])}
              />
              {logoPreview ? (
                <>
                  <img src={logoPreview} alt="logo" className="w-12 h-12 object-contain rounded-xl border border-gray-200 bg-white p-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Logo uploaded</p>
                    <p className="text-xs text-gray-400">Click to change</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setLogo(null); setLogoPreview(null); }}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 text-gray-400">
                  <Upload className="w-6 h-6" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Upload logo</p>
                    <p className="text-xs text-gray-400">PNG, SVG, WEBP — shown beside text</p>
                  </div>
                </div>
              )}
            </div>

            {logoPreview && (
              <input
                type="text"
                value={logoAltText}
                onChange={(e) => setLogoAltText(e.target.value)}
                placeholder="Alt text for accessibility (optional)"
                className="mt-2 w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
              />
            )}
          </div>

          <div className="border-t border-gray-100" />

          {/* ── Active toggle ── */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-700">Active</p>
              <p className="text-xs text-gray-400">Show this bar across your site immediately</p>
            </div>
            <button
              onClick={() => set("isActive", !form.isActive)}
              className="transition"
            >
              {form.isActive
                ? <ToggleRight className="w-8 h-8 text-violet-600" />
                : <ToggleLeft  className="w-8 h-8 text-gray-300"   />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
              {error}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-1 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold rounded-xl transition shadow-sm text-sm"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {submitting ? "Saving…" : "Save Bar"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnnouncementModal