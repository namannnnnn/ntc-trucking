import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  truckNumberPlate: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Driver = mongoose.model("Driver", driverSchema);
export default Driver;

