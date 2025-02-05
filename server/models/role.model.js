// models/role.model.js
import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, //? Admin, Staff, Driver
  permissions: [String], //? For future purposes
});

const Role = mongoose.model("Role", roleSchema);
export default Role;