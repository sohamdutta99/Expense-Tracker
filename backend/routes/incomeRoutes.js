const express = require("express");
const {
  addIncome,
  getAllIncomes,
  deleteIncome,
  downloadIncomeExcel,
} = require("../controllers/incomeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All income routes are protected — require valid JWT
router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncomes);
router.delete("/:id", protect, deleteIncome);
router.get("/downloadexcel", protect, downloadIncomeExcel);

module.exports = router;
