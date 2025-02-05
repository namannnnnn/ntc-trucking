import express from "express";
import {
  createUser,
  editUser,
  getAllUsers,
  getUserById,
  deleteUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

//? Protect routes with authentication and restrict access to Admin role

router.post("/", authMiddleware, checkRole(["Admin"]), createUser);
router.put("/:userId", authMiddleware, checkRole(["Admin"]), editUser);
router.get("/", authMiddleware, checkRole(["Admin"]), getAllUsers);
router.get("/:userId", authMiddleware, checkRole(["Admin"]), getUserById);
router.delete("/:userId", authMiddleware, checkRole(["Admin"]), deleteUser);

export default router;