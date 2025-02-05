import express from "express";
import {
  createTrip,
  logStartTime,
  logEndTime,
  addDriverCosts,
  updateFinancialData,
  getAllTrips,
} from "../controllers/trip.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

//? Start a trip (Driver)
router.post("/", authMiddleware, checkRole(["Driver"]), createTrip);

//? Log Start & End Time (Driver)
router.put("/:tripId/start", authMiddleware, checkRole(["Driver"]), logStartTime);
router.put("/:tripId/end", authMiddleware, checkRole(["Driver"]), logEndTime);

//? Add driver costs (Driver)
router.put("/:tripId/costs", authMiddleware, checkRole(["Driver"]), addDriverCosts);

//? Update financial data (Admin)
router.put("/:tripId/financials", authMiddleware, checkRole(["Admin"]), updateFinancialData);

//? Get all trips (Admin & Staff)
router.get("/", authMiddleware, checkRole(["Admin", "Driver"]), getAllTrips);

export default router;
