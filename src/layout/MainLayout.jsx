import React from "react";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { ChevronDown } from "lucide-react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineUser,
  HiOutlineClipboardList,
} from "react-icons/hi";

import { HiOutlineBuildingOffice } from "react-icons/hi2";

/* Sidebar Navigation */
const navItems = [
  { label: "Home", icon: HiOutlineHome, path: "/dashboard" },

  {
    label: "Sales ",
    icon: HiOutlineDocumentText,
    path: "/sales-invoice-list",
    addPath: "/sales-invoice",
  },

  {
    label: "Purchase ",
    icon: HiOutlineDocumentText,
    path: "/purchase-invoice-list",
    addPath: "/purchase-invoice",
  },

  {
    label: "Items",
    icon: HiOutlineClipboardList,
    path: "/item-list",
 
  },

  {
    label: "Customers",
    icon: HiOutlineUser,
    path: "/customer-list",
    addPath: "/customers",
  },

  {
    label: "Vendors",
    icon: HiOutlineUser,
    path: "/vendor-list",
    addPath: "/vendors",
  },

  {
    label: "My Stores",
    icon: HiOutlineBuildingOffice,
    path: "/stores",
  },

  {
    label: "Reports",
    icon: HiOutlineDocumentText,
    path: "/reports",
  },
];

const MainLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRouteActive = (path, addPath) => {
    return (
      location.pathname === path ||
      location.pathname.startsWith(path + "/") ||
      location.pathname === addPath
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white bg-[#1e3a8a]">
            <HiOutlineSquares2X2 size={20} />
          </div>

       <span className="font-semibold text-gray-800 text-base">
  D&apos;LumeBiz
</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ label, icon: Icon, path, addPath }) => {
            const isActive = isRouteActive(path, addPath);

            /* Menu with + button */
            if (addPath) {
              return (
                <div
                  key={label}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {/* Left Menu */}
                  <NavLink to={path} className="flex items-center gap-3 flex-1">
                    <Icon
                      size={19}
                      className={
                        isActive ? "text-blue-600" : "text-gray-400"
                      }
                    />

                    <span>{label}</span>
                  </NavLink>

                  {/* Add Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(addPath);
                    }}
                    title={`Add ${label}`}
                    className={`flex items-center justify-center rounded-full font-bold transition-all duration-150
                    ${
                      isActive
                        ? "w-[18px] h-[18px] bg-blue-600 text-white text-[11px]"
                        : "w-[18px] h-[18px] bg-gray-300 text-white text-[11px] opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    +
                  </button>
                </div>
              );
            }

            /* Normal Menu */
            return (
              <NavLink
                key={label}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon
                  size={19}
                  className={isActive ? "text-blue-600" : "text-gray-400"}
                />

                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between px-8 py-3.5">
          <div>
            <p className="font-semibold text-gray-900 text-base leading-tight">
              Welcome back, {user?.email?.split("@")[0] || "User"} 👋
            </p>

          <p className="text-gray-400 text-sm">
  Here&apos;s your invoice overview.
</p>
          </div>

          {/* Profile */}
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-[#1e3a8a]">
              {user?.email?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {user?.email?.split("@")[0] || "User"}
              </p>

              <p className="text-xs text-gray-400">
                {user?.email || "user@email.com"}
              </p>
            </div>

            <ChevronDown
              size={16}
              className="text-gray-400 group-hover:text-gray-600 transition"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;