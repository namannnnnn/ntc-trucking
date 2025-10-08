import express from "express";
import {
  getCompanyTotals,
getDriverSummary,
getIncomeExpenseSeries
} from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// 1. Company-wide totals
router.get('/totals',authMiddleware, getCompanyTotals);

// 2. Driver-specific summary
router.get('/driver/:driverId',authMiddleware, getDriverSummary);

// 3. Income vs Expense series
router.get('/series/:type',authMiddleware, getIncomeExpenseSeries);

export default router;