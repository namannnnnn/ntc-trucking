// controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { config } from "../config/constants.js";


//INFO: For user login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { id: user._id, role: user.role.name, name: user.name };

    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: "8h" });

    res.json({ token, role: user.role.name, name: user.name });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//INFO: For user login
export const ServerLive = async (req, res) => {
  try {
  
    res.json({ health: '200', message:'Server is up and running perfectly' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// Register user (Admin role initially)
// export const register = async (req, res) => {
//     try {
//       const { name, email, password, role } = req.body;
  
//       const existingRole = await Role.findOne({ name: role });
//       if (!existingRole) {
//         return res.status(400).json({ message: "Invalid role" });
//       }
  
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = new User({
//         name,
//         email,
//         password: hashedPassword,
//         role: existingRole._id,
//       });
  
//       await newUser.save();
//       res.status(201).json({ message: "User registered successfully" });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };