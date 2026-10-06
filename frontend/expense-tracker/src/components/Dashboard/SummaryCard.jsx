import React from "react";

/**
 * Enhanced SummaryCard
 * Props:
 *   title     - Card label
 *   value     - Formatted string (e.g. "₹61,000")
 *   icon      - Icon element or emoji
 *   badgeText - Context badge (e.g. "Net Worth", "Total Inflow", "Total Outflow")
 *   theme     - "balance" | "income" | "expense"
 *   delay     - Animation delay class
 */
const SummaryCard = ({ title, value, icon, badgeText, theme = "balance", delay = "" }) => {
  const themeStyles = {
    balance: {
      bg: "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(30, 27, 75, 0.4) 100%)",
      border: "rgba(139, 92, 246, 0.3)",
      glow: "rgba(139, 92, 246, 0.2)",
      badgeBg: "rgba(139, 92, 246, 0.18)",
      badgeTextCol: "#c4b5fd",
      iconBg: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
      textColor: "text-white",
    },
    income: {
      bg: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.35) 100%)",
      border: "rgba(16, 185, 129, 0.3)",
      glow: "rgba(16, 185, 129, 0.2)",
      badgeBg: "rgba(16, 185, 129, 0.18)",
      badgeTextCol: "#6ee7b7",
      iconBg: "linear-gradient(135deg, #10b981, #059669)",
      textColor: "text-emerald-300",
    },
    expense: {
      bg: "linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(136, 19, 55, 0.35) 100%)",
      border: "rgba(244, 63, 94, 0.3)",
      glow: "rgba(244, 63, 94, 0.2)",
      badgeBg: "rgba(244, 63, 94, 0.18)",
      badgeTextCol: "#fda4af",
      iconBg: "linear-gradient(135deg, #f43f5e, #be123c)",
      textColor: "text-rose-300",
    },
  };

  const style = themeStyles[theme] || themeStyles.balance;

  return (
    <div
      className={`stat-card animate-fade-in-up ${delay}`}
      style={{
        background: style.bg,
        borderColor: style.border,
        boxShadow: `0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 20px ${style.glow}`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-white/10"
          style={{
            backgroundColor: style.badgeBg,
            color: style.badgeTextCol,
          }}
        >
          {badgeText || title}
        </span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg shadow-lg"
          style={{ background: style.iconBg }}
        >
          {icon}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-slate-400 mb-1">{title}</p>
        <p className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${style.textColor}`}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default SummaryCard;
