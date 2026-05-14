import React, { useState, useEffect, useRef } from "react";
import { User, Edit3, X, Loader2, CheckCircle, Camera } from "lucide-react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const Profile = () => {
  const fileInputRef = useRef(null); // Reference for the hidden file input
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    profileImage: "" // Added to state
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // --- NEW: Handle Image Upload ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${BASE_URL}/profile/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUserData((prev) => ({ ...prev, profileImage: response.data.profileImage }));
      setSuccessMessage("Profile photo updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      alert("Failed to upload image: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleSave = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${BASE_URL}/profile`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      alert("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>;

  return (
    <div className="space-y-6">
      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed top-24 right-10 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg shadow-lg z-50">
          <CheckCircle size={20} />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="flex items-center gap-5 p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
        {/* Profile Image with Camera Trigger */}
        <div className="relative group">
          <div className="h-20 w-20 rounded-full bg-[#457358] flex items-center justify-center text-white text-3xl font-bold overflow-hidden border-2 border-white shadow-sm">
            {userData.profileImage ? (
              <img src={userData.profileImage} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              userData.name?.charAt(0)
            )}
          </div>
          
          {/* Camera Icon Overlay */}
          <button 
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 p-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-red-600 shadow-sm transition-all"
            title="Upload Photo"
          >
            <Camera size={16} />
          </button>

          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
            accept="image/*" 
          />
          
          {updating && (
            <div className="absolute inset-0 bg-white/50 rounded-full flex items-center justify-center">
              <Loader2 className="animate-spin text-red-600" size={24} />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-1.5xl md:text-2xl font-bold text-gray-800">{userData.name}</h2>
          <p className="text-gray-500 text-[13px] md:text-md">{userData.email}</p>
        </div>
      </div>

      {/* Personal Information Card */}
      <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Personal Information</h3>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
              <Edit3 size={16} /> Edit
            </button>
          ) : (
            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name*</label>
              <input name="name" disabled={!isEditing} value={userData.name || ""} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 disabled:text-gray-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email*</label>
              <input type="email" name="email" disabled value={userData.email || ""} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mobile Number*</label>
              <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                <span className="px-3 text-xl">🇮🇳</span>
                <input name="phone" disabled={!isEditing} value={userData.phone || ""} onChange={handleChange} className="w-full py-2 outline-none bg-transparent disabled:text-gray-500" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <select name="gender" disabled={!isEditing} value={userData.gender || ""} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 outline-none">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date Of Birth</label>
              <input type="date" name="dateOfBirth" disabled={!isEditing} value={userData.dateOfBirth?.split('T')[0] || ""} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 outline-none" />
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
              <button onClick={handleSave} disabled={updating} className="flex flex-col gap-2 items-center px-10 py-2.5 bg-[#0f261c] text-white font-semibold rounded hover:bg-[#457358] shadow-md disabled:bg-[#0f261c]/20 cursor-pointer">
                {updating && <Loader2 className="animate-spin" size={18} />} Save Changes
              </button>
              <button onClick={() => setIsEditing(false)} className="px-10 py-2.5 border border-[#457358] text-gray-600 font-semibold rounded hover:bg-[#457358] hover:text-white cursor-pointer">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;