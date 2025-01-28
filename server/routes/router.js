//INFO: All the necessary imports
import express from "express";
import authRoutes from "./auth.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);

export default router;
