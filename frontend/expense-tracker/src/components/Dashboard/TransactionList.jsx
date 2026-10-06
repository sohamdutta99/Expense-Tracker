import React from "react";
import { formatDate, formatCurrency } from "../../utils/data";
import { LuTrash2, LuCalendar, LuTrendingUp, LuTrendingDown } from "react-icons/lu";

/**
 * Enhanced TransactionList
 * High-end transaction cards with custom badges, hover elevation, and clean visual hierarchy.
 */
const TransactionList = ({ transactions = [], type = "expense", onDelete, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="spinner" />
        <p className="text-xs text-slate-400 font-medium">Fetching transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-3 text-2xl">
          {type === "income" ? "💰" : "🧾"}
        </div>
        <p className="text-sm font-semibold text-white">No transactions recorded</p>
        <p className="text-xs text-slate-400 mt-1">
          {type === "income" 
            ? "Add your first income stream on the left." 
            : type === "expense"
            ? "Log your first expense on the left."
            : "No recent activity to show yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {transactions.map((txn, idx) => {
        const itemType = txn.type || type;
        const isIncome = itemType === "income";
        const label = isIncome ? (txn.source || txn.category) : (txn.category || txn.source);
        const prefix = isIncome ? "+" : "-";

        return (
          <div
            key={txn._id}
            className="transaction-item group animate-fade-in-up"
            style={{ animationDelay: `${idx * 0.04}s` }}
          >
            {/* Left: Icon & Details */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`w-11 h-11 flex items-center justify-center rounded-2xl text-xl flex-shrink-0 border transition-transform duration-200 group-hover:scale-105 ${
                  isIncome 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}
              >
                {txn.icon || (isIncome ? "💰" : "💸")}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white truncate leading-tight">
                    {label}
                  </p>
                  <span 
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isIncome 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                        : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    }`}
                  >
                    {isIncome ? "Income" : "Expense"}
                  </span>
                </div>
                {txn.description && (
                  <p className="text-xs text-slate-400 truncate mt-1">
                    {txn.description}
                  </p>
                )}
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                  <LuCalendar size={12} className="opacity-70" />
                  <span>{formatDate(txn.date)}</span>
                </div>
              </div>
            </div>

            {/* Right: Amount & Delete */}
            <div className="flex items-center gap-3.5 flex-shrink-0">
              <div className="text-right">
                <span
                  className={`text-base lg:text-lg font-bold tracking-tight ${
                    isIncome ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {prefix}{formatCurrency(txn.amount)}
                </span>
              </div>
              {onDelete && (
                <button
                  className="btn-danger opacity-80 group-hover:opacity-100 p-2"
                  onClick={() => onDelete(txn._id)}
                  title="Delete transaction"
                >
                  <LuTrash2 size={15} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionList;
