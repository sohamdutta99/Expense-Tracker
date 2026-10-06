import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { BASE_URL } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import { 
  LuLayoutDashboard, 
  LuArrowDownLeft, 
  LuArrowUpRight, 
  LuLogOut, 
  LuMenu, 
  LuX,
  LuSparkles
} from "react-icons/lu";

const navItems = [
  { label: "Dashboard", icon: <LuLayoutDashboard className="text-lg" />, path: "/dashboard" },
  { label: "Income",    icon: <LuArrowDownLeft className="text-lg text-emerald-400" />, path: "/income" },
  { label: "Expense",   icon: <LuArrowUpRight className="text-lg text-rose-400" />, path: "/expense" },
];

/**
 * Enhanced DashboardLayout
 * Responsive navigation, frosted glass aesthetic, user card with status badge.
 */
const DashboardLayout = ({ children }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const avatarSrc = user?.profileImageUrl
    ? user.profileImageUrl.startsWith("http")
      ? user.profileImageUrl
      : `${BASE_URL}/${user.profileImageUrl}`
    : null;

  return (
    <div className="min-h-screen flex bg-transparent">
      {/* ── Mobile Backdrop ────────────────────────────────────────── */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside 
        className={`sidebar transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Branding */}
        <div className="px-6 py-6 border-b border-white/[0.07] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 ring-1 ring-white/20">
              <LuSparkles className="text-xl" />
            </div>
            <div>
              <p className="font-extrabold text-white text-base tracking-tight leading-tight">
                Expense<span className="text-purple-400">Flow</span>
              </p>
              <p className="text-[11px] font-medium text-slate-400">Smart Financial Tracker</p>
            </div>
          </div>
          <button 
            className="lg:hidden text-slate-400 hover:text-white p-1"
            onClick={() => setIsMobileOpen(false)}
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 px-3 mb-2">
            Main Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="p-1 rounded-lg bg-white/[0.04] text-slate-300">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-white/[0.07] bg-white/[0.01]">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-3">
            <div className="relative">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.fullName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/50"
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-tr from-purple-600 to-sky-400 shadow-md">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              {/* Online status indicator */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#121324]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate leading-tight">
                {user?.fullName || "User"}
              </p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600/80 border border-rose-500/20 transition-all duration-200"
          >
            <LuLogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-[#121324]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-sky-400 flex items-center justify-center text-white text-sm">
              <LuSparkles />
            </div>
            <span className="font-bold text-white text-sm">ExpenseFlow</span>
          </div>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg bg-white/[0.05] text-slate-300 hover:text-white"
          >
            <LuMenu size={20} />
          </button>
        </header>

        <main className="dashboard-main flex-1 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
