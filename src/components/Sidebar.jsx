import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaBook,
  FaShoppingCart,
  FaTags,
  FaChartLine,
  FaImage,
  FaBullhorn,
  FaTag
} from "react-icons/fa";
import { Store, X } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      icon: FaHome,
      path: "/admin/dashboard",
    },
    {
      name: "Users",
      icon: FaUsers,
      path: "/admin/users",
    },
    {
      name: "Products",
      icon: FaBook,
      path: "/admin/products",
    },
    {
      name: "Banners",
      icon: FaImage,
      path: "/admin/banners",
    },
    {
      name: "Orders",
      icon: FaShoppingCart,
      path: "/admin/orders",
    },
    {
      name: "Vouchers",
      icon: FaTags,
      path: "/admin/vouchers",
    },
    {
      name: "Announcement Bar",
      icon: FaBullhorn,
      path: "/admin/announcementbar",
    },
    {
      name: "Tag Manager",
      icon: FaTag,
      path: "/admin/tagmanager",
    },
    {
      name: "Shop Details",
      icon: Store,
      path: "/admin/shop-details",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[280px] shrink-0 overflow-hidden border-r border-slate-200/10 bg-[#0f172a] text-white transition-transform duration-300 ease-in-out lg:sticky lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/20 shadow-[0_6px_18px_rgba(16,185,129,0.12)]">
                <FaChartLine className="text-[18px]" />
              </div>

              <div>
                <h2 className="text-[17px] font-semibold tracking-[0.01em] text-white">
                  N-Organics Admin
                </h2>

                <p className="mt-0.5 text-sm text-slate-400">
                  Manage your store
                </p>
              </div>
            </div>

            <button
              onClick={toggleSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition duration-200 hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-5 scrollbar-hide">
            <div className="space-y-2 pb-10">
              {navItems.map((item) => {
                const Icon = item.icon;

                const isDashboardDefault =
                  item.path === "/admin/dashboard" &&
                  location.pathname === "/admin";

                const isRouteActive =
                  location.pathname === item.path || isDashboardDefault;

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                      isRouteActive
                        ? "bg-slate-700/60 text-white shadow-sm"
                        : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 ${
                        isRouteActive
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-800 text-slate-300 group-hover:bg-slate-700"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <span className="text-sm font-medium">
                      {item.name}
                    </span>

                    {isRouteActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;