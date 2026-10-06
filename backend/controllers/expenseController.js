const Expense = require("../models/Expense");
const xlsx = require("xlsx");

/**
 * POST /api/v1/expense/add
 * Add a new expense transaction for the authenticated user.
 */
exports.addExpense = async (req, res) => {
  const { icon, category, amount, date, description } = req.body;

  if (!category || !amount || !date) {
    return res.status(400).json({ message: "Category, amount, and date are required" });
  }

  try {
    const expense = await Expense.create({
      userId: req.user._id,
      icon,
      category,
      amount,
      date: new Date(date),
      description,
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: "Error adding expense", error: err.message });
  }
};

/**
 * GET /api/v1/expense/get
 * Get all expense transactions for the authenticated user, sorted by date descending.
 */
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching expenses", error: err.message });
  }
};

/**
 * DELETE /api/v1/expense/:id
 * Delete a specific expense by ID. Verifies ownership before deletion.
 */
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Ensure the expense belongs to the requesting user
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this expense" });
    }

    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting expense", error: err.message });
  }
};

/**
 * GET /api/v1/expense/downloadexcel
 * Download all expense data as an XLSX file.
 */
exports.downloadExpenseExcel = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });

    const data = expenses.map((exp) => ({
      Category: exp.category,
      Icon: exp.icon,
      Amount: exp.amount,
      Date: exp.date.toISOString().split("T")[0],
      Description: exp.description || "",
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");

    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=expenses.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: "Error exporting expenses", error: err.message });
  }
};
