const express = require("express");
const {
  addExpense,
  getAllExpenses,
  deleteExpense,
  downloadExpenseExcel,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All expense routes are protected — require valid JWT
router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpenses);
router.delete("/:id", protect, deleteExpense);
router.get("/downloadexcel", protect, downloadExpenseExcel);

module.exports = router;
