import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../components/layouts/DashboardLayout";
import AddIncomeForm from "../../components/Dashboard/AddIncomeForm";
import TransactionList from "../../components/Dashboard/TransactionList";
import useUserAuth from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import { formatCurrency } from "../../utils/data";
import { LuFileSpreadsheet, LuSearch, LuTrendingUp, LuWallet } from "react-icons/lu";

const Income = () => {
  useUserAuth();

  const [incomes, setIncomes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchIncomes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.INCOME.GET_ALL);
      setIncomes(res.data);
    } catch {
      toast.error("Failed to load income data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const handleAdd = async (formData) => {
    setAdding(true);
    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD, formData);
      toast.success("Income added successfully! 💰");
      await fetchIncomes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add income");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE(id));
      toast.success("Income stream deleted");
      setIncomes((prev) => prev.filter((t) => t._id !== id));
    } catch {
      toast.error("Failed to delete income");
    }
  };

  const handleDownload = () => {
    window.open(`${BASE_URL}${API_PATHS.INCOME.DOWNLOAD_EXCEL}`, "_blank");
  };

  const filteredIncomes = useMemo(() => {
    if (!search.trim()) return incomes;
    const q = search.toLowerCase();
    return incomes.filter(
      (i) =>
        i.source?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q)
    );
  }, [incomes, search]);

  const monthlyData = incomes.reduce((acc, txn) => {
    const month = new Date(txn.date).toLocaleString("en-IN", { month: "short", year: "2-digit" });
    const existing = acc.find((d) => d.month === month);
    if (existing) existing.amount += txn.amount;
    else acc.push({ month, amount: txn.amount });
    return acc;
  }, []).slice(-6);

  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout>
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <LuTrendingUp /> Revenue & Inflow
          </div>
          <h1 className="page-title">Income Streams</h1>
          <p className="page-subtitle">Track, analyze, and manage all your revenue channels</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-2.5 flex items-center gap-3 border-emerald-500/30 bg-emerald-500/5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
              <LuWallet />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Total Income</p>
              <p className="text-lg font-extrabold text-emerald-400 leading-tight">
                {formatCurrency(totalIncome)}
              </p>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all duration-200"
          >
            <LuFileSpreadsheet size={15} />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left Column: Form & Monthly Trend ──────────────────────── */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <AddIncomeForm onAdd={handleAdd} loading={adding} />

          {/* Monthly Bar Chart Card */}
          <div className="glass-card p-6 animate-fade-in-up delay-200">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06]">
              <div>
                <h3 className="text-sm font-bold text-white">Monthly Inflow Trend</h3>
                <p className="text-[11px] text-slate-400">Income received over last 6 months</p>
              </div>
            </div>

            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={monthlyData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                  <Tooltip
                    formatter={(v) => [formatCurrency(v), "Income"]}
                    contentStyle={{
                      background: "rgba(25, 27, 50, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "12px",
                      color: "#f8fafc",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                    }}
                  />
                  <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[210px] text-slate-400 gap-2">
                <span className="text-2xl">📈</span>
                <p className="text-xs">Add income transactions to view monthly charts.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column: Income Transactions List with Search ─────── */}
        <div className="lg:col-span-7">
          <div className="glass-card p-6 animate-fade-in-up delay-100 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-white/[0.06]">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Income History ({filteredIncomes.length})
                </h3>
                <p className="text-[11px] text-slate-400">All registered inflow channels</p>
              </div>

              {/* Quick Search */}
              <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search income..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="py-1.5 pl-8 pr-3 text-xs rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500/50 focus:bg-white/[0.08] transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1" style={{ maxHeight: "640px" }}>
              <TransactionList
                transactions={filteredIncomes}
                type="income"
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

export default Income;
