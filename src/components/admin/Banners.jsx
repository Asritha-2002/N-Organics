import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Plus, Edit2, Trash2, Eye, X } from "lucide-react";
import BannerModal from "./adminModals/BannerModal"; // Adjust path to your modal
const BASE_URL = import.meta.env.VITE_BASE_URL;
import BannerFilters from "./BannerFilters";
export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [appliesToFilter, setAppliesToFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/admin/banners`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch banners");
      }

      const data = await response.json();
      setBanners(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching banners:", err);
      setError("Failed to load banners. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (savedBanner) => {
    if (editingBanner) {
      setBanners((prev) =>
        prev.map((b) => (b._id === savedBanner._id ? savedBanner : b)),
      );
    } else {
      setBanners((prev) => [savedBanner, ...prev]);
    }
    setShowModal(false);
    setEditingBanner(null);
    fetchBanners(); // Refresh list to ensure order and consistency
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setShowModal(true);
  };

  const handleView = (banner) => {
    setSelectedBanner(banner);
    setShowViewModal(true);
  };

 const handleDelete = async (id, e) => {
    e.stopPropagation();

    try {
      const response = await fetch(`${BASE_URL}/admin/banners/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete");
      }

      // Keep the banner in the state and update the deletedAt timestamp so it reflects immediately
      setBanners((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, deletedAt: new Date().toISOString() } : b
        )
      );

      // toast.success("Banner deleted successfully"); // Uncomment if using toast
    } catch (err) {
      console.error("Error deleting banner:", err);
      // toast.error("Could not delete the banner"); // Uncomment if using toast
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredBanners = banners
    .filter((b) => {
      // 1. Search Filter

      const matchesSearch =
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        (b.description || "").toLowerCase().includes(search.toLowerCase());

      // 2. Status Filter
      let matchesStatus = true;
      if (statusFilter === "active") {
        matchesStatus = b.isActive === true && !b.deletedAt;
      } else if (statusFilter === "inactive") {
        matchesStatus = b.isActive === false && !b.deletedAt;
      } else if (statusFilter === "deleted") {
        matchesStatus = !!b.deletedAt; // Show only banners with a deletedAt timestamp
      } else if (statusFilter === "all") {
        // By default, show all active/inactive banners while excluding deleted banners
        matchesStatus = !b.deletedAt;
      }

      // 3. Applies To Filter
      let matchesAppliesTo = true;
      if (appliesToFilter && appliesToFilter !== "all") {
        matchesAppliesTo = b.appliesTo === appliesToFilter;
      }

      return matchesSearch && matchesStatus && matchesAppliesTo;
    })
    .sort((a, b) => {
      // 4. Sort Logic
      if (sort === "newest") {
        return (
          new Date(b.createdAt || b.updatedAt || 0) -
          new Date(a.createdAt || a.updatedAt || 0)
        );
      }
      if (sort === "oldest") {
        return (
          new Date(a.createdAt || a.updatedAt || 0) -
          new Date(b.createdAt || b.updatedAt || 0)
        );
      }
      // 3. High Priority First (0, 1, 2, 3, 4)
      if (sort === "priority-high") {
        return (a.priority || 0) - (b.priority || 0);
      }
      // 4. Low Priority First (4, 3, 2, 1, 0)
      if (sort === "priority-low") {
        return (b.priority || 0) - (a.priority || 0);
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-indigo-500 shadow-lg">
            <Image className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Banners Management
            </h1>
            <p className="text-sm text-gray-500">
              Create and manage promotional banners and displays
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingBanner(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#00bc7d] hover:bg-[#00965b] text-white font-medium rounded-xl transition shadow-sm text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </button>
      </motion.div>

      <BannerFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        appliesToFilter={appliesToFilter}
        onAppliesToChange={setAppliesToFilter}
        sort={sort}
        onSortChange={setSort}
      />

      {/* Content */}
      <div className="pb-3">
        {loading ? (
          <div className="flex justify-center p-12 bg-white rounded-2xl border border-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00bc7d]"></div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-center text-red-600 text-sm">
            {error}
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="p-4 bg-green-50 text-green-600 rounded-2xl mb-4">
              <Image className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Banners Found
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mb-6">
              Get started by creating your first promotional banner or display
              to showcase across your platform.
            </p>
            <button
              onClick={() => {
                setEditingBanner(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#00bc7d] hover:bg-[#00965b] text-white font-medium rounded-xl transition shadow-sm text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Banner
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-3">
            {filteredBanners.map((b) => (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col"
              >
                {/* Image */}
                {b.image?.url ? (
                  <img
                    src={b.image.url}
                    alt={b.title}
                    className="w-full h-28 object-cover"
                  />
                ) : (
                  <div className="w-full h-28 bg-gray-50 flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-300" />
                  </div>
                )}

                {/* Content */}
                <div className="p-3 flex flex-col gap-1.5 flex-1">
                  {/* Title + Status */}
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {b.title}
                    </h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        b.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {b.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-gray-500 line-clamp-2">
                    {b.description || "No description"}
                  </p>

                  {/* Discount */}
                  <div className="text-xs font-semibold text-green-600">
                    {b.discountType === "percentage"
                      ? `${b.discount}% OFF`
                      : `₹${b.discount} OFF`}
                  </div>
                </div>
                {/* Actions */}
                <div className="flex justify-end gap-1 p-2 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={() => handleView(b)}
                    className="p-1.5 hover:bg-blue-50 rounded-lg cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                  </button>

                  <button
                    onClick={() => handleEdit(b)}
                    disabled={!!b.deletedAt}
                    className={`p-1.5 hover:bg-green-50 rounded-lg cursor-pointer ${
                      b.deletedAt ? "opacity-40 cursor-not-allowed pointer-events-none" : ""
                    }`}
                  >
                    <Edit2 className="w-4 h-4 text-gray-500 hover:text-green-600" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(b._id);
                      setShowDeleteModal(true);
                    }}
                    disabled={!!b.deletedAt}
                    className={`p-1.5 hover:bg-red-50 rounded-lg cursor-pointer ${
                      b.deletedAt ? "opacity-40 cursor-not-allowed pointer-events-none" : ""
                    }`}
                  >
                    <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* View Banner Modal */}
      <AnimatePresence>
        {showViewModal && selectedBanner && (
          <div
            className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="w-full sm:w-[420px] h-full bg-white shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <h3 className="text-base font-semibold text-gray-800">
                  Banner Details
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scroll Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Image */}
                {selectedBanner.image?.url ? (
                  <img
                    src={selectedBanner.image.url}
                    alt=""
                    className="w-full h-44 object-cover rounded-xl border"
                  />
                ) : (
                  <div className="w-full h-44 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed">
                    <Image className="w-8 h-8 text-gray-300" />
                  </div>
                )}

                {/* Title + Status */}
                {/* {console.log(selectedBanner)} */}

                <div className="flex justify-between items-start h-[30px]">
                  <h2 className="text-lg font-bold text-gray-800">
                    {selectedBanner.title}
                  </h2>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedBanner.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {selectedBanner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed">
                  {selectedBanner.description || "No description available"}
                </p>

                {/* Divider */}
                <div className="border-t pt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Button Text</span>
                    <span className="text-gray-700 font-medium">
                      {selectedBanner.buttonText || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Applies To</span>
                    <span className="text-green-600 font-semibold">
                      {selectedBanner.appliesTo || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Discount</span>
                    <span className="text-green-600 font-semibold">
                      {selectedBanner.discountType === "percentage"
                        ? `${selectedBanner.discount}%`
                        : `₹${selectedBanner.discount}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Priority</span>
                    <span className="text-gray-700 font-medium">
                      {selectedBanner.priority}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Limit / User</span>
                    <span className="text-gray-700">
                      {selectedBanner.perUserLimitUser || 1}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Usage</span>
                    <span className="text-gray-700">
                      {selectedBanner.maxUses
                        ? `${selectedBanner.usedCount || 0} / ${selectedBanner.maxUses}`
                        : "Unlimited"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Start Date</span>
                    <span className="text-gray-700">
                      {formatDate(selectedBanner.startDate)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">End Date</span>
                    <span className="text-gray-700">
                      {formatDate(selectedBanner.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="cursor-pointer w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Delete Confirmation Modal */}
<AnimatePresence>
  {showDeleteModal && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={() => setShowDeleteModal(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-[360px] bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-3">
            <Trash2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-800">Delete Banner</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-[280px]">
            Are you sure you want to delete this banner? This action cannot be undone.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 py-2.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition cursor-pointer border border-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              handleDelete(deleteId, e);
              setShowDeleteModal(false);
            }}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition cursor-pointer"
          >
            Yes, Delete
          </button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>

      {/* Edit Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <BannerModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingBanner(null);
            }}
            onSave={handleSave}
            bannerData={editingBanner}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
