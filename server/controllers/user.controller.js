// controllers/user.controller.js
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";

//? Create a new user (Admin Only)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    //INFO: Check if role exists
    const assignedRole = await Role.findOne({ name: role });
    if (!assignedRole) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    //INFO: Hashing the password by the salt lenth 10
    const hashedPassword = await bcrypt.hash(password, 10);

    //QUERY: Create the user info
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: assignedRole._id,
    });

    //QUERY: Save the user info
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//? Edit an existing user (Admin & Staff)
export const editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password, role } = req.body;

    //INFO: Check if user exists
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //INFO: Ensure role exists if it is getting updated
    if (role) {
      const assignedRole = await Role.findOne({ name: role });
      if (!assignedRole) {
        return res.status(400).json({ message: "Invalid role specified" });
      }
      user.role = assignedRole._id;
    }

    //INFO: Update the respective fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) { user.password = await bcrypt.hash(password, 10); }

    //QUERY: Save the user info
    await User.updateOne({"_id":userId},{$set :{...user}});

    //* User was successfully created
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//? Get all users (Admin)
export const getAllUsers = async (req, res) => {
  try {

    //QUERY: Find all users
    const users = await User.find().populate("role", "name");

    //INFO: Check if there are no users
    if(users.length === 0){
        return res.status(404).json({ message: "No user data found" });
    }

    //* Users were fetched successfully
    res.status(200).json(users);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//? Get a single user by ID (Admin)
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    //QUERY: Find user by ID
    const user = await User.findById(userId).populate("role", "name");

    //INFO: Check if user exists
    if (!user) return res.status(404).json({ message: "User not found" });

    //* User was fetched successfully
    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//? Delete a user (Admin Only)
export const deleteUser = async (req, res) => {
  try {

    const { userId } = req.params;

    //QUERY: Find user by ID
    const user = await User.findById(userId);

    //INFO: Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //QUERY: Delete the user by id
    await User.findByIdAndDelete(userId);

    //* User was deleted successfully
    res.status(200).json({ message: "User deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
