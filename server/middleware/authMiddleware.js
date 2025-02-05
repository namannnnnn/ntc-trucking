import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { config } from "../config/constants.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    req.user = decoded; // Attach decoded user to request

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
