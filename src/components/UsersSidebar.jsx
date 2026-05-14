// UsersSidebar.jsx

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { User, Package, MapPin, LogOut, Calendar } from "lucide-react";
import { useState } from "react";

const UsersSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { name: "My Profile", lucideIcon: User, path: "/account/profile" },
    { name: "My Orders", lucideIcon: Package, path: "/account/orders" },
    { name: "My Wishlist", lucideIcon: Calendar, path: "/account/wishlist" },
    { name: "My Address", lucideIcon: MapPin, path: "/account/addresses" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");

    navigate("/sign-in");
  };

  return (
    <>
      {/* MOBILE + TABLET HORIZONTAL NAV */}
      <div className="mb-5 block lg:hidden">
        <div className="overflow-x-auto scrollbar-hide rounded-2xl border border-gray-200 bg-white shadow-sm">
          
          <div className="flex min-w-max items-center gap-2 p-2 sm:p-3">
            {navItems.map((item) => {
              const LucideIcon = item.lucideIcon;
              const isRouteActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 transition-all ${
                    isRouteActive
                      ? "bg-[#457358] text-white shadow-sm"
                      : "text-slate-600 hover:bg-gray-100"
                  }`}
                >
                  <LucideIcon
                    size={18}
                    className={
                      isRouteActive
                        ? "text-white"
                        : "text-slate-400"
                    }
                  />

                  <span className="text-sm font-semibold">
                    {item.name}
                  </span>
                </NavLink>
              );
            })}

            {/* Logout */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 whitespace-nowrap rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-slate-600 transition-all hover:bg-gray-100"
            >
              <LogOut size={18} className="text-slate-400" />

              <span className="text-sm font-semibold">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:block w-[280px] shrink-0">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          
          {/* Navigation */}
          <nav className="flex-1 py-6">
            <div className="space-y-2">
              {navItems.map((item) => {
                const LucideIcon = item.lucideIcon;
                const isRouteActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={`group relative flex items-center gap-4 px-6 py-4 transition-all ${
                      isRouteActive
                        ? "bg-[#457358]/10 text-[#0f261c]"
                        : "text-slate-600 hover:bg-gray-50"
                    }`}
                  >
                    {isRouteActive && (
                      <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#0f261c]" />
                    )}

                    <LucideIcon
                      size={20}
                      className={
                        isRouteActive
                          ? "text-[#0f261c]"
                          : "text-slate-400 group-hover:text-slate-600"
                      }
                    />

                    <span className="text-[15px] font-medium">
                      {item.name}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="mt-auto border-t border-gray-100 p-4">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-slate-600 transition-colors hover:bg-gray-50"
            >
              <LogOut size={20} className="text-slate-400" />

              <span className="text-[15px] font-medium">
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-slate-50 px-4 py-5 sm:px-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                <LogOut className="text-lg" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-800 sm:text-lg">
                  Logout Confirmation
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Are you sure you want to log out?
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-4 py-5 text-sm leading-7 text-slate-600 sm:px-6">
              Are you sure you want to log out from your account?
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-slate-50 bg-slate-50/30 px-4 py-4 sm:px-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersSidebar;