import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../components/layouts/DashboardLayout";
import AddExpenseForm from "../../components/Dashboard/AddExpenseForm";
import TransactionList from "../../components/Dashboard/TransactionList";
import useUserAuth from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import { formatCurrency } from "../../utils/data";
import { LuFileSpreadsheet, LuSearch, LuTrendingDown, LuCreditCard } from "react-icons/lu";

const Expense = () => {
  useUserAuth();

  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL);
      setExpenses(res.data);
    } catch {
      toast.error("Failed to load expense data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAdd = async (formData) => {
    setAdding(true);
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD, formData);
      toast.success("Expense recorded successfully! 💸");
      await fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add expense");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE(id));
      toast.success("Expense removed");
      setExpenses((prev) => prev.filter((t) => t._id !== id));
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  const handleDownload = () => {
    window.open(`${BASE_URL}${API_PATHS.EXPENSE.DOWNLOAD_EXCEL}`, "_blank");
  };

  const filteredExpenses = useMemo(() => {
    if (!search.trim()) return expenses;
    const q = search.toLowerCase();
    return expenses.filter(
      (e) =>
        e.category?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q)
    );
  }, [expenses, search]);

  const monthlyData = expenses.reduce((acc, txn) => {
    const month = new Date(txn.date).toLocaleString("en-IN", { month: "short", year: "2-digit" });
    const existing = acc.find((d) => d.month === month);
    if (existing) existing.amount += txn.amount;
    else acc.push({ month, amount: txn.amount });
    return acc;
  }, []).slice(-6);

  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout>
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
            <LuTrendingDown /> Spending & Outflow
          </div>
          <h1 className="page-title">Expenses Manager</h1>
          <p className="page-subtitle">Track, categorize, and control your daily spending</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-2.5 flex items-center gap-3 border-rose-500/30 bg-rose-500/5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-lg">
              <LuCreditCard />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Total Expenses</p>
              <p className="text-lg font-extrabold text-rose-400 leading-tight">
                {formatCurrency(totalExpense)}
              </p>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all duration-200"
          >
            <LuFileSpreadsheet size={15} />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left Column: Form & Monthly Trend ──────────────────────── */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <AddExpenseForm onAdd={handleAdd} loading={adding} />

          {/* Monthly Bar Chart Card */}
          <div className="glass-card p-6 animate-fade-in-up delay-200">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06]">
              <div>
                <h3 className="text-sm font-bold text-white">Monthly Expense Trend</h3>
                <p className="text-[11px] text-slate-400">Spending patterns over last 6 months</p>
              </div>
            </div>

            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={monthlyData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                  <Tooltip
                    formatter={(v) => [formatCurrency(v), "Expense"]}
                    contentStyle={{
                      background: "rgba(25, 27, 50, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "12px",
                      color: "#f8fafc",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                    }}
                  />
                  <Bar dataKey="amount" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[210px] text-slate-400 gap-2">
                <span className="text-2xl">📉</span>
                <p className="text-xs">Add expenses to view monthly trends.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column: Expenses List with Search ─────────────────── */}
        <div className="lg:col-span-7">
          <div className="glass-card p-6 animate-fade-in-up delay-100 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-white/[0.06]">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Expense History ({filteredExpenses.length})
                </h3>
                <p className="text-[11px] text-slate-400">All recorded spending transactions</p>
              </div>

              {/* Quick Search */}
              <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search expense..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="py-1.5 pl-8 pr-3 text-xs rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-slate-500 outline-none focus:border-rose-500/50 focus:bg-white/[0.08] transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1" style={{ maxHeight: "640px" }}>
              <TransactionList
                transactions={filteredExpenses}
                type="expense"
                onDelete={handleDelete}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
