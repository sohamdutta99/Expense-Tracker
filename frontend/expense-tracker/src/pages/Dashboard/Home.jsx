import React, { useEffect, useState, useCallback } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../components/layouts/DashboardLayout";
import SummaryCard from "../../components/Dashboard/SummaryCard";
import TransactionList from "../../components/Dashboard/TransactionList";
import useUserAuth from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatCurrency } from "../../utils/data";
import { useUser } from "../../context/UserContext";
import { LuWallet, LuTrendingUp, LuTrendingDown, LuChartPie, LuSparkles, LuActivity } from "react-icons/lu";

// Pie chart color palette
const PIE_COLORS = ["#8b5cf6", "#38bdf8", "#10b981", "#f59e0b", "#f43f5e", "#ec4899", "#a855f7", "#14b8a6"];

// Custom tooltip for Area chart
const AreaTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl p-3.5 text-xs shadow-2xl bg-[#191b32]/95 border border-white/10 backdrop-blur-md">
      <p className="font-bold text-white mb-2 pb-1 border-b border-white/10">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.dataKey === "income" ? "Income" : "Expense"}
          </span>
          <span className="font-bold" style={{ color: p.color }}>
            {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const Home = () => {
  useUserAuth();
  const { user } = useUser();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.DASHBOARD.GET);
      setData(res.data);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
          <div className="spinner" />
          <p className="text-xs font-semibold text-slate-400">Loading your finances...</p>
        </div>
      </DashboardLayout>
    );
  }

  const chartData = data?.last60DaysData?.map((d) => ({
    date: d.date.slice(5), // MM-DD
    income: d.income,
    expense: d.expense,
  })) || [];

  const pieData = data?.expenseByCategory?.map((c) => ({
    name: `${c.icon} ${c._id}`,
    value: c.total,
  })) || [];

  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <DashboardLayout>
      {/* ── Page Header / Welcome Banner ────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
            <LuSparkles /> Welcome back, {user?.fullName?.split(" ")[0] || "there"}
          </div>
          <h1 className="page-title">Financial Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">{todayStr}</p>
        </div>
      </div>

      {/* ── Summary Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <SummaryCard
          title="Total Balance"
          value={formatCurrency(data?.totalBalance ?? 0)}
          icon={<LuWallet />}
          badgeText="Active Net Worth"
          theme="balance"
          delay="delay-100"
        />
        <SummaryCard
          title="Total Income"
          value={formatCurrency(data?.totalIncome ?? 0)}
          icon={<LuTrendingUp />}
          badgeText="Total Inflow"
          theme="income"
          delay="delay-200"
        />
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(data?.totalExpense ?? 0)}
          icon={<LuTrendingDown />}
          badgeText="Total Outflow"
          theme="expense"
          delay="delay-300"
        />
      </div>

      {/* ── Charts Row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Area Chart — Last 60 Days */}
        <div className="glass-card p-6 xl:col-span-2 animate-fade-in-up delay-200">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <LuActivity size={16} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-white">Cash Flow Analytics</h2>
                <p className="text-[11px] text-slate-400">Income vs Expense activity over the last 60 days</p>
              </div>
            </div>
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                <Tooltip content={<AreaTooltip />} />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2.5} fill="url(#gradIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2.5} fill="url(#gradExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[260px] text-slate-400 gap-2">
              <span className="text-3xl">📊</span>
              <p className="text-xs">No chart data available yet. Record your transactions to view analytics.</p>
            </div>
          )}
        </div>

        {/* Donut Chart — Expense Breakdown */}
        <div className="glass-card p-6 animate-fade-in-up delay-300">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/[0.06]">
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <LuChartPie size={16} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white">Expense Distribution</h2>
              <p className="text-[11px] text-slate-400">Spending by category</p>
            </div>
          </div>

          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} stroke="rgba(0,0,0,0.3)" />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px", color: "#94a3b8", paddingTop: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[260px] text-slate-400 gap-2">
              <span className="text-3xl">🍩</span>
              <p className="text-xs">No expense breakdown to display.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Transactions ───────────────────────────────────────── */}
      <div className="glass-card p-6 animate-fade-in-up delay-400">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06]">
          <div>
            <h2 className="text-sm font-bold text-white">Recent Transactions</h2>
            <p className="text-[11px] text-slate-400">Your latest income and expense activities</p>
          </div>
        </div>
        <TransactionList
          transactions={data?.recentTransactions ?? []}
          loading={false}
        />
      </div>
    </DashboardLayout>
  );
};

export default Home;
