import React, { useState } from "react";
import { EXPENSE_CATEGORIES } from "../../utils/data";
import { LuPlus, LuTag, LuIndianRupee, LuCalendar, LuFileText } from "react-icons/lu";

/**
 * Enhanced AddExpenseForm
 * Fast category selector chips, polished inputs with icon adornments, and gradient button.
 */
const AddExpenseForm = ({ onAdd, loading }) => {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    icon: "🍔",
    category: "Food & Dining",
    amount: "",
    date: today,
    description: "",
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleCategorySelect = (categoryObj) => {
    setForm((prev) => ({
      ...prev,
      category: categoryObj.label,
      icon: categoryObj.icon,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.amount || !form.date) return;
    await onAdd({ ...form, amount: parseFloat(form.amount) });
    setForm({ icon: "🍔", category: "Food & Dining", amount: "", date: today, description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="form-section animate-fade-in relative overflow-hidden">
      {/* Decorative accent top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500" />

      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              💸
            </span>
            Add Expense
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Record a new spending transaction</p>
        </div>
      </div>

      {/* Quick Category Chips */}
      <div className="mb-4">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
          <LuTag size={13} className="text-rose-400" /> Quick Select Category
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
          {EXPENSE_CATEGORIES.slice(0, 10).map((c) => {
            const isSelected = form.category === c.label;
            return (
              <button
                type="button"
                key={c.label}
                onClick={() => handleCategorySelect(c)}
                className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-rose-500/20 border-rose-500 text-rose-200 shadow-sm font-semibold"
                    : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.07]"
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Category Dropdown */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-slate-400 mb-1">
          All Categories
        </label>
        <div className="input-box">
          <span className="text-lg">{form.icon}</span>
          <select
            value={form.category}
            onChange={(e) => {
              const selected = EXPENSE_CATEGORIES.find((c) => c.label === e.target.value);
              if (selected) handleCategorySelect(selected);
            }}
            required
            className="w-full bg-transparent outline-none text-sm text-white"
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.label} value={c.label}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Amount & Date Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
            <LuIndianRupee size={13} className="text-rose-400" /> Amount (₹)
          </label>
          <div className="input-box">
            <input
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange("amount")}
              min="0.01"
              step="0.01"
              required
              className="text-base font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
            <LuCalendar size={13} className="text-rose-400" /> Date
          </label>
          <div className="input-box">
            <input
              type="date"
              value={form.date}
              onChange={handleChange("date")}
              required
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
          <LuFileText size={13} className="text-rose-400" /> Description (optional)
        </label>
        <div className="input-box">
          <input
            type="text"
            placeholder="e.g. Dinner with team, Groceries..."
            value={form.description}
            onChange={handleChange("description")}
            maxLength={120}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-500 via-rose-600 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-lg shadow-rose-500/25 border border-white/10 flex items-center justify-center gap-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
      >
        <LuPlus size={17} />
        <span>{loading ? "Adding Expense..." : "Add Expense"}</span>
      </button>
    </form>
  );
};

export default AddExpenseForm;
