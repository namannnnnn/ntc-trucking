import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to driver
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  startTime: { type: Date },
  endTime: { type: Date },
  duration: { type: Number }, // Duration in minutes
  fuelCost: { type: Number, default: 0 },
  additionalCosts: [
    {
      category: { type: String },
      amount: { type: Number, default: 0 },
    },
  ],
  grossIncome: { type: Number, default: 0 },
  additionalIncome: { type: Number, default: 0 },
  otherPay: { type: Number, default: 0 },
  fuelExpenses: { type: Number, default: 0 },
  mileage: { type: Number, default: 0 },
  payPerMile: { type: Number, default: 0 },
  costPerMile: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// // Middleware for automated calculations
//! --------------------------------------------------FOR FUTURE PRE EVALUATIONS------------------------------------------------------------------------------
tripSchema.pre("update", function (next) {
  if (this.startTime && this.endTime) {
    this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60)); // Convert ms to minutes
  }
  
  // Calculate costs
  this.costPerMile = this.mileage > 0 ? this.fuelCost / this.mileage : 0;
  const additionalCostSum = this.additionalCosts.reduce((sum, cost) => sum + cost.amount, 0);
  this.totalExpenses = this.fuelCost + additionalCostSum;
  this.balance = this.grossIncome - this.totalExpenses;
  
  next();
});

const Trip = mongoose.model("Trip", tripSchema);
export default Trip;
