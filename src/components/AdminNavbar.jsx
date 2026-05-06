import { FaBars, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const AdminNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // States for admin details (no defaults, fetched from backend)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  // Fetch admin details from backend
  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:2101/api/admin/admin-details",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch admin details");
      }

      const data = await response.json();
      const admin = data.data;

      // Sync state with fetched admin data
      setName(admin.name || "");
      setEmail(admin.email || "");
      setPhone(admin.phone || "");
      setGender(admin.gender || "");
      setDob(admin.dob || "");
    } catch (error) {
      console.error("Error fetching admin details:", error);
      toast.error("Could not load admin profile");
    }
  };

  // Load admin data on mount
  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign-in");
  };

  // Handler for submitting edit admin details
  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:2101/api/admin/update-admin",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email, phone, gender, dob }),
        }
      );

      if (!response.ok) {
        let errorMsg = "Failed to update admin details.";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          errorMsg = `Server error: ${response.status} ${response.statusText}`;
        }
        toast.error(errorMsg);
        return;
      }

      const data = await response.json();
      toast.success(data.message || "Admin details updated successfully!");

      // 👉 Refetch updated admin data after save
      await fetchAdminData();

      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating admin details:", error);
      toast.error("An error occurred while updating the profile.");
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left Side: Toggle and Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
              aria-label="Open sidebar"
            >
              <FaBars className="text-sm" />
            </button>

            <div>
              <h1 className="text-lg font-bold text-slate-800 sm:text-xl">
                Admin Dashboard
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Manage your store smoothly
              </p>
            </div>
          </div>

          {/* Right Side: Profile & Logout */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Admin profile card */}
            <div
              onClick={() => setShowAdminModal(true)}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                <FaUser className="text-sm" />
              </div>

              <div className="hidden md:block">
                <p className="text-xs font-bold text-slate-700">{name || "Admin"}</p>
                <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                  Administrator
                </p>
              </div>
            </div>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            {/* Logout button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-red-50 hover:border-red-100 hover:text-red-500 cursor-pointer"
              aria-label="Logout"
            >
              <FaSignOutAlt className="text-sm" />
            </button>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-slate-50 px-6 py-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                <FaSignOutAlt className="text-lg" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Logout Confirmation
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to log out?
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 text-sm leading-7 text-slate-600">
              Are you sure you want to log out from your admin account?
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-slate-50 px-6 py-4 bg-slate-50/30">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 shadow-sm shadow-emerald-600/10"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Profile Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-slate-50 px-6 py-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <FaUser className="text-lg" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Admin Profile
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Account information
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 text-sm leading-8 text-slate-600 space-y-2">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="font-semibold text-slate-700">Name:</span>
                <span className="text-slate-900">{name || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="font-semibold text-slate-700">Email:</span>
                <span className="text-slate-900">{email || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="font-semibold text-slate-700">Phone:</span>
                <span className="text-slate-900">{phone || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="font-semibold text-slate-700">Gender:</span>
                <span className="text-slate-900">{gender || "N/A"}</span>
              </div>
              
              
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-slate-50 px-6 py-4 bg-slate-50/30">
              <button
                onClick={() => setShowAdminModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowAdminModal(false);
                  setShowEditModal(true);
                }}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 shadow-sm shadow-emerald-600/10"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-slate-50 px-6 py-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <FaUser className="text-lg" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Edit Admin Details
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update profile details
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 transition"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 transition"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-slate-50 px-6 py-4 bg-slate-50/30">
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={handleEditSubmit}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 shadow-sm shadow-emerald-600/10"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;