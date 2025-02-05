import express from "express";
import {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} from "../controllers/driver.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, checkRole(["Admin"]), createDriver);
router.get("/", authMiddleware, checkRole(["Admin", "Staff"]), getAllDrivers);
router.get("/:driverId", authMiddleware, checkRole(["Admin", "Staff"]), getDriverById);
router.put("/:driverId", authMiddleware, checkRole(["Admin","Staff"]), updateDriver);
router.delete("/:driverId", authMiddleware, checkRole(["Admin"]), deleteDriver);

export default router;
