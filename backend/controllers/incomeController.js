const Income = require("../models/Income");
const xlsx = require("xlsx");

/**
 * POST /api/v1/income/add
 * Add a new income transaction for the authenticated user.
 */
exports.addIncome = async (req, res) => {
  const { icon, source, amount, date, description } = req.body;

  if (!source || !amount || !date) {
    return res.status(400).json({ message: "Source, amount, and date are required" });
  }

  try {
    const income = await Income.create({
      userId: req.user._id,
      icon,
      source,
      amount,
      date: new Date(date),
      description,
    });
    res.status(201).json(income);
  } catch (err) {
    res.status(500).json({ message: "Error adding income", error: err.message });
  }
};

/**
 * GET /api/v1/income/get
 * Get all income transactions for the authenticated user, sorted by date descending.
 */
exports.getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching incomes", error: err.message });
  }
};

/**
 * DELETE /api/v1/income/:id
 * Delete a specific income by ID. Verifies ownership before deletion.
 */
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    // Ensure the income belongs to the requesting user
    if (income.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this income" });
    }

    await income.deleteOne();
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting income", error: err.message });
  }
};

/**
 * GET /api/v1/income/downloadexcel
 * Download all income data as an XLSX file.
 */
exports.downloadIncomeExcel = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user._id }).sort({ date: -1 });

    const data = incomes.map((inc) => ({
      Source: inc.source,
      Icon: inc.icon,
      Amount: inc.amount,
      Date: inc.date.toISOString().split("T")[0],
      Description: inc.description || "",
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Incomes");

    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=incomes.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: "Error exporting incomes", error: err.message });
  }
};
