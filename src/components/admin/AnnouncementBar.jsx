import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnnouncementModal from "./adminModals/AnnouncementModal";
import { Megaphone, Plus, Pencil } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Button = ({
  icon: Icon,
  label,
  onClick,
  variant = "primary",
  className = "",
}) => {
  const base =
    "flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm";
  const styles = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    outline: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-100",
  };
  return (
    <button
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
};

export default function AnnouncementBar() {
  const [showModal, setShowModal] = useState(false);
  const [bars, setBars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBar, setSelectedBar] = useState(null);

  const handleSave = (data) => {
    setBars([data]); // always keep only one announcement
    setSelectedBar(null);
  };

  // Fetch data from the API
  useEffect(() => {
    const fetchBars = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/announcement-bar`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch announcement bars");
        }

        const data = await response.json();
        setBars(data);
      } catch (error) {
        console.error("Error fetching announcement bars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBars();
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Announcement Bar
            </h1>
            <p className="text-sm text-gray-500">
              Manage sitewide announcement banners and messages
            </p>
          </div>
        </div>
        <div className="flex gap-3 px-7">
          {bars.length > 0 ? (
            <Button
              icon={Pencil}
              label="Edit Announcement"
              onClick={() => {
                setSelectedBar(bars[0]);
                setShowModal(true);
              }}
            />
          ) : (
            <Button
              icon={Plus}
              label="Add Announcement"
              onClick={() => {
                setSelectedBar(null);
                setShowModal(true);
              }}
            />
          )}
        </div>
      </motion.div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex justify-center p-12 bg-white rounded-2xl border border-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00bc7d]"></div>
          </div>
      ) : bars.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="p-4 bg-violet-50 text-violet-500 rounded-2xl mb-4">
            <Megaphone className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Announcement Bars
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mb-6">
            Create your first sitewide announcement to display promotions,
            shipping info, or any important message.
          </p>
          <Button
            icon={Plus}
            label="Add Announcement"
            onClick={() => {
              setSelectedBar(null);
              setShowModal(true);
            }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {bars.map((bar) => (
            <div
              key={bar._id}
              className="flex flex-col md:flex-row md:items-start justify-between p-6 mx-2 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 gap-6"
            >
              {/* Main Content Column */}
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  
  <div className="flex items-center gap-3 min-w-0">
    <div
      className="w-10 h-10 shrink-0 rounded-2xl border border-gray-200/50 shadow-sm flex items-center justify-center text-xs font-bold"
      style={{
        backgroundColor: bar.backgroundColor,
        color: bar.textColor,
      }}
    >
      A
    </div>

    <div className="min-w-0">
      <h3 className="font-bold text-gray-800 text-sm md:text-base truncate">
        ID: {bar._id}
      </h3>

      <p className="text-xs text-gray-400 mt-0.5">
        Created: {new Date(bar.createdAt).toLocaleDateString()}
      </p>
    </div>
  </div>

  <div className="flex items-center justify-between sm:justify-end gap-3">
    <span
      className={`text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ${
        bar.isActive
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-gray-50 text-gray-500 border border-gray-200"
      }`}
    >
      {bar.isActive ? "Active" : "Inactive"}
    </span>

    <button
      onClick={() => {
        setSelectedBar(bar);
        setShowModal(true);
      }}
      className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition duration-200 shrink-0"
      title="Edit Announcement"
    >
      <Pencil className="w-4 h-4" />
    </button>
  </div>
</div>

                <hr className="border-gray-100/50 my-1" />

                {/* Meta Information Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-3 bg-gray-50/75 rounded-xl border border-gray-100/50">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                      Background
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="w-4 h-4 rounded border border-black/10"
                        style={{ backgroundColor: bar.backgroundColor }}
                      />
                      <span className="text-xs font-mono text-gray-700">
                        {bar.backgroundColor}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                      Text Color
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="w-4 h-4 rounded border border-black/10"
                        style={{ backgroundColor: bar.textColor }}
                      />
                      <span className="text-xs font-mono text-gray-700">
                        {bar.textColor}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                      Logo
                    </span>
                    <div className="mt-1">
                      {bar.logo.url ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={bar.logo.url}
                            alt={bar.logo.altText || "Announcement logo"}
                            className="w-8 h-8 object-contain rounded border border-gray-200 bg-white p-1"
                          />
                          <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs border border-green-100 font-medium inline-block">
                            Attached
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 bg-gray-50 px-2 py-0.5 rounded text-xs border border-gray-100 font-medium inline-block">
                          None
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sentences Column */}
                <div className="flex flex-col gap-2 mt-2 w-full">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                    Sentences ({bar.sentences?.length || 0})
                  </span>
                  <div className="flex flex-col gap-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    {bar.sentences && bar.sentences.length > 0 ? (
                      bar.sentences.map((sentence, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white border border-gray-200/40 rounded-lg shadow-sm flex items-start gap-3"
                        >
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed break-words w-full">
                            {typeof sentence === "object"
                              ? sentence.text || JSON.stringify(sentence)
                              : sentence}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">
                        No sentences available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      <AnimatePresence>
        {showModal && (
          <AnnouncementModal
            bar={selectedBar}
            onClose={() => {
              setShowModal(false);
              setSelectedBar(null);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
