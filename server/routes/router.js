//INFO: All the necessary imports
import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import driverRoutes from "./driver.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/drivers", driverRoutes);


export default router;
