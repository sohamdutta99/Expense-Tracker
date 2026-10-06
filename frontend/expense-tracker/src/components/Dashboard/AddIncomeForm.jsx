import React, { useState } from "react";
import { INCOME_SOURCES } from "../../utils/data";
import { LuPlus, LuTag, LuIndianRupee, LuCalendar, LuFileText } from "react-icons/lu";

/**
 * Enhanced AddIncomeForm
 * Fast source selector chips, polished inputs with icon adornments, and gradient button.
 */
const AddIncomeForm = ({ onAdd, loading }) => {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    icon: "💼",
    source: "Salary",
    amount: "",
    date: today,
    description: "",
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSourceSelect = (sourceObj) => {
    setForm((prev) => ({
      ...prev,
      source: sourceObj.label,
      icon: sourceObj.icon,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.source || !form.amount || !form.date) return;
    await onAdd({ ...form, amount: parseFloat(form.amount) });
    setForm({ icon: "💼", source: "Salary", amount: "", date: today, description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="form-section animate-fade-in relative overflow-hidden">
      {/* Decorative accent top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />

      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              💰
            </span>
            Add Income
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Record a new revenue stream</p>
        </div>
      </div>

      {/* Quick Source Chips */}
      <div className="mb-4">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
          <LuTag size={13} className="text-emerald-400" /> Quick Select Source
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
          {INCOME_SOURCES.slice(0, 8).map((s) => {
            const isSelected = form.source === s.label;
            return (
              <button
                type="button"
                key={s.label}
                onClick={() => handleSourceSelect(s)}
                className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-sm font-semibold"
                    : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.07]"
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Source Dropdown */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-slate-400 mb-1">
          All Sources
        </label>
        <div className="input-box">
          <span className="text-lg">{form.icon}</span>
          <select
            value={form.source}
            onChange={(e) => {
              const selected = INCOME_SOURCES.find((s) => s.label === e.target.value);
              if (selected) handleSourceSelect(selected);
            }}
            required
            className="w-full bg-transparent outline-none text-sm text-white"
          >
            {INCOME_SOURCES.map((s) => (
              <option key={s.label} value={s.label}>
                {s.icon} {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Amount & Date Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
            <LuIndianRupee size={13} className="text-emerald-400" /> Amount (₹)
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
            <LuCalendar size={13} className="text-emerald-400" /> Date
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
          <LuFileText size={13} className="text-emerald-400" /> Description (optional)
        </label>
        <div className="input-box">
          <input
            type="text"
            placeholder="e.g. Monthly salary from company..."
            value={form.description}
            onChange={handleChange("description")}
            maxLength={120}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 border border-white/10 flex items-center justify-center gap-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
      >
        <LuPlus size={17} />
        <span>{loading ? "Adding Income..." : "Add Income"}</span>
      </button>
    </form>
  );
};

export default AddIncomeForm;
