import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Plus, Edit2, Trash2, Eye, X, Calendar, Percent } from 'lucide-react';
import BannerModal from './adminModals/BannerModal'; // Adjust path to your modal

export default function AllBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      // Replace with your API endpoint
      const response = await fetch('http://localhost:2101/api/banners', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch banners');
      }
      
      const data = await response.json();
      setBanners(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching banners:', err);
      setError('Failed to load banners. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (savedBanner) => {
    if (editingBanner) {
      setBanners(prev => prev.map(b => b._id === savedBanner._id ? savedBanner : b));
    } else {
      setBanners(prev => [savedBanner, ...prev]);
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
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      const response = await fetch(`http://localhost:2101/api/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (!response.ok) throw new Error('Failed to delete');
      
      setBanners(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      console.error('Error deleting banner:', err);
      alert('Could not delete the banner');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-indigo-500 shadow-lg">
            <Image className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Banners Management</h1>
            <p className="text-sm text-gray-500">Create and manage promotional banners and displays</p>
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

      {/* Content */}
      {loading ? (
        <div className="flex justify-center p-12 bg-white rounded-2xl border border-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00bc7d]"></div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-center text-red-600 text-sm">
          {error}
        </div>
      ) : banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl mb-4">
            <Image className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Banners Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mb-6">
            Get started by creating your first promotional banner or display to showcase across your platform.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((b) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Banner Image / Header Area */}
                {b.image && b.image.url ? (
                  <img src={b.image.url} alt={b.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center border-b border-gray-50">
                    <Image className="w-10 h-10 text-green-600/30" />
                  </div>
                )}
                
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-gray-800 text-base leading-snug line-clamp-1">{b.title}</h4>
                    <span className={`shrink-0 text-xs px-2.5 py-0.5 rounded-full font-semibold ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {b.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2 h-9 leading-relaxed">{b.description || '—'}</p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs border-t border-b border-gray-50 py-3 mb-4">
                    <div className="flex flex-col">
                      <span className="text-gray-400 mb-0.5">Priority</span>
                      <span className="font-semibold text-gray-700">{b.priority}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 mb-0.5">Applies To</span>
                      <span className="font-semibold text-gray-700 capitalize">{b.appliesTo === 'all' ? 'All Products' : b.appliesTo}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 mb-0.5">Discount</span>
                      <span className="font-semibold text-green-600 flex items-center gap-0.5">
                        {b.discountType === 'percentage' ? `${b.discount}%` : `₹${b.discount}`}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 mb-0.5">Uses Left / Max</span>
                      <span className="font-semibold text-gray-700">
                        {b.maxUses ? `${b.maxUses - b.usedCount} / ${b.maxUses}` : 'Unlimited'}
                      </span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="text-2xs text-gray-400 flex flex-col gap-1 bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                    <div className="flex justify-between">
                      <span>Starts:</span>
                      <span className="font-medium text-gray-600">{formatDate(b.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ends:</span>
                      <span className="font-medium text-gray-600">{formatDate(b.endDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <div className="text-3xs text-gray-400">
                  Updated: {new Date(b.updatedAt).toLocaleDateString('en-IN')}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleView(b)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition border border-transparent hover:border-blue-100"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(b)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50/50 rounded-xl transition border border-transparent hover:border-green-100"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(b._id, e)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition border border-transparent hover:border-red-100"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* View Banner Modal */}
      <AnimatePresence>
        {showViewModal && selectedBanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowViewModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-lg p-7 shadow-2xl flex flex-col gap-5 border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <h3 className="text-lg font-bold text-gray-800">Banner Details</h3>
                <button onClick={() => setShowViewModal(false)} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedBanner.image && selectedBanner.image.url ? (
                <img src={selectedBanner.image.url} alt="" className="w-full h-44 object-cover rounded-2xl border" />
              ) : (
                <div className="w-full h-44 bg-gray-50 rounded-2xl flex items-center justify-center border border-dashed text-gray-300">
                  <Image className="w-8 h-8" />
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">Title</span>
                  <span className="font-semibold text-gray-800">{selectedBanner.title}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">Description</span>
                  <span className="text-gray-700 text-right max-w-[60%] line-clamp-2">{selectedBanner.description || '—'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">Button Text</span>
                  <span className="text-gray-700">{selectedBanner.buttonText}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">Discount</span>
                  <span className="text-green-600 font-semibold">
                    {selectedBanner.discountType === 'percentage' 
                      ? `${selectedBanner.discount}%` 
                      : `₹${selectedBanner.discount}`}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">Priority Index</span>
                  <span className="text-gray-700 font-semibold">{selectedBanner.priority}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">Limit Per User</span>
                  <span className="text-gray-700">{selectedBanner.perUserLimitUser || '1'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Uses / Max</span>
                  <span className="text-gray-700 font-medium">
                    {selectedBanner.maxUses 
                      ? `${selectedBanner.usedCount || 0} / ${selectedBanner.maxUses}` 
                      : 'Unlimited'}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setShowViewModal(false)}
                className="mt-3 w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition"
              >
                Close
              </button>
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