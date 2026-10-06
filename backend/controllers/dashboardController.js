const Expense = require("../models/Expense");
const Income = require("../models/Income");

/**
 * GET /api/v1/dashboard
 * Returns aggregated dashboard data for the authenticated user:
 *   - Total balance, total income, total expense
 *   - Last 60 days of daily income + expense for the area chart
 *   - Expense breakdown by category for pie chart
 *   - Recent 5 transactions (combined income + expense)
 */
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // --- Aggregate totals ---
    const [totalIncomeResult, totalExpenseResult] = await Promise.all([
      Income.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const totalIncome = totalIncomeResult[0]?.total || 0;
    const totalExpense = totalExpenseResult[0]?.total || 0;
    const totalBalance = totalIncome - totalExpense;

    // --- Last 60 days daily chart data ---
    const [incomeChart, expenseChart] = await Promise.all([
      Income.aggregate([
        { $match: { userId, date: { $gte: sixtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            amount: { $sum: "$amount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Expense.aggregate([
        { $match: { userId, date: { $gte: sixtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            amount: { $sum: "$amount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Merge income and expense chart data by date
    const chartDataMap = {};
    incomeChart.forEach(({ _id, amount }) => {
      chartDataMap[_id] = { date: _id, income: amount, expense: 0 };
    });
    expenseChart.forEach(({ _id, amount }) => {
      if (chartDataMap[_id]) {
        chartDataMap[_id].expense = amount;
      } else {
        chartDataMap[_id] = { date: _id, income: 0, expense: amount };
      }
    });
    const last60DaysData = Object.values(chartDataMap).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // --- Expense breakdown by category (for pie chart) ---
    const expenseByCategory = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: "$category", total: { $sum: "$amount" }, icon: { $first: "$icon" } } },
      { $sort: { total: -1 } },
      { $limit: 8 },
    ]);

    // --- Recent 5 transactions (income + expense combined) ---
    const [recentIncomes, recentExpenses] = await Promise.all([
      Income.find({ userId }).sort({ date: -1 }).limit(5).lean(),
      Expense.find({ userId }).sort({ date: -1 }).limit(5).lean(),
    ]);

    const recentTransactions = [
      ...recentIncomes.map((t) => ({ ...t, type: "income" })),
      ...recentExpenses.map((t) => ({ ...t, type: "expense" })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    res.status(200).json({
      totalBalance,
      totalIncome,
      totalExpense,
      last60DaysData,
      expenseByCategory,
      recentTransactions,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard data", error: err.message });
  }
};
