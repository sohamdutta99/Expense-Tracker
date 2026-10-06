import React from "react";
import { LuTrendingUp } from "react-icons/lu";

/**
 * AuthLayout
 * Split-screen layout for Login and SignUp pages.
 * Left: form area  |  Right: decorative panel with stats card
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* ── Left: Form Panel ──────────────────────────────────────────── */}
      <div
        className="w-full md:w-[55vw] px-10 pt-8 pb-12 flex flex-col"
        style={{ background: "var(--color-surface)" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 mb-auto">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
          >
            💹
          </div>
          <span className="font-bold text-white text-sm">Expense Tracker</span>
        </div>

        {/* Children (Login / SignUp form) */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-12">
          {children}
        </div>
      </div>

      {/* ── Right: Decorative Panel ───────────────────────────────────── */}
      <div
        className="hidden md:flex w-[45vw] flex-col items-center justify-center relative overflow-hidden p-12"
        style={{
          background: "linear-gradient(135deg, #1a0533 0%, #0d1b3e 50%, #0f0f1a 100%)",
        }}
      >
        {/* Background blobs */}
        <div
          className="absolute w-72 h-72 rounded-full opacity-20 -top-16 -left-16"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }}
        />
        <div
          className="absolute w-56 h-56 rounded-full opacity-15 bottom-0 right-0"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }}
        />

        {/* Content */}
        <div className="relative z-10 text-center mb-10">
          <div className="text-6xl mb-6">💹</div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Take Control of Your
            <br />
            <span style={{ color: "var(--color-primary-light)" }}>Finances</span>
          </h2>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Track income and expenses, visualize your spending,
            <br />
            and make smarter financial decisions.
          </p>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 flex flex-col gap-3 w-full max-w-xs">
          <StatsInfoCard icon="📊" label="Real-time Dashboard" value="Always updated" color="rgba(124,58,237,0.3)" />
          <StatsInfoCard icon="💰" label="Income Tracking" value="All sources" color="rgba(16,185,129,0.3)" />
          <StatsInfoCard icon="📈" label="Visual Analytics" value="Charts & trends" color="rgba(6,182,212,0.3)" />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => (
  <div
    className="flex items-center gap-4 p-4 rounded-xl"
    style={{
      background: color,
      border: "1px solid rgba(255,255,255,0.08)",
      backdropFilter: "blur(8px)",
    }}
  >
    <span className="text-2xl">{icon}</span>
    <div>
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{value}</p>
    </div>
  </div>
);
