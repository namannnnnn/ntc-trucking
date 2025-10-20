//INFO: All the necessary imports
import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import driverRoutes from "./driver.routes.js";
import tripRoutes from "./trip.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import reportRoutes from "./report.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/drivers", driverRoutes);
router.use("/trips", tripRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/reports",reportRoutes);
// router.use("/settings", )

export default router;
