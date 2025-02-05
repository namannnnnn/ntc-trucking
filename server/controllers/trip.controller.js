// controllers/trip.controller.js
import Trip from "../models/trip.model.js";
import User from "../models/user.model.js";

//? Create a New Trip (Driver Only)
export const createTrip = async (req, res) => {
  try {
    const { origin, destination } = req.body;
    
    //INFO: Initiate the Trip mongo constructor
    const newTrip = new Trip({
      driver: req.user.id, // Logged-in driver
      origin,
      destination,
    });

    //QUERY: Save the new trip details
    await newTrip.save();
    
    res.status(201).json({ message: "Trip started successfully", trip: newTrip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//? Log Start Time (Driver Only)
export const logStartTime = async (req, res) => {
  try {
    const { tripId } = req.params;

    //QUERY: To find the trip by id
    const trip = await Trip.findById(tripId);

    //INFO: To check if the trip exists
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.driver.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    //INFO: Get the current time
    trip.startTime = new Date();

    //QUERY: Update the start time for the trip
    await Trip.updateOne({"_id":tripId},{$set :{...trip}});

    //* Send succesful response after logging the start time correctly
    res.status(200).json({ message: "Trip start time logged", trip });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//? Log End Time (Driver Only)
export const logEndTime = async (req, res) => {
  try {
    const { tripId } = req.params;

    //QUERY: To find the trip by id
    const trip = await Trip.findById(tripId);

    //INFO: To check if the trip exists
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.driver.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    //INFO: Get the current time
    trip.endTime = new Date();

    //QUERY: Update the end time for the trip
    await Trip.updateOne({"_id":tripId},{$set :{...trip}});

    //* Send succesful response after logging the end time correctly
    res.status(200).json({ message: "Trip end time logged", trip });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//? Add Driver Costs (Driver Only)
export const addDriverCosts = async (req, res) => {
  try {
    const { tripId } = req.params;

    const { fuelCost, additionalCosts } = req.body;

    //QUERY: To find the trip by id
    const trip = await Trip.findById(tripId);

    //INFO: To check if the trip exists
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.driver.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    trip.fuelCost = fuelCost || trip.fuelCost;
    if (additionalCosts) {
      trip.additionalCosts.push(...additionalCosts);
    }

    //QUERY: Update the driver costs for the trip
    await Trip.updateOne({"_id":tripId},{$set :{...trip}});    
    
    //* Send succesful response after updating the driver costs correctly
    res.status(200).json({ message: "Driver costs updated", trip });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//? Update Financial Data (Admin Only)
export const updateFinancialData = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { grossIncome, additionalIncome, mileage, payPerMile } = req.body;
    
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    trip.grossIncome = grossIncome || trip.grossIncome;
    trip.additionalIncome = additionalIncome || trip.additionalIncome;
    trip.mileage = mileage || trip.mileage;
    trip.payPerMile = payPerMile || trip.payPerMile;
    trip.costPerMile = trip.mileage > 0 ? trip.fuelCost / trip.mileage : 0;

    //QUERY: Update the financial details for the trip
    await Trip.updateOne({"_id":tripId},{$set :{...trip}}); 

    //* Send succesful response after updating the financial details correctly
    res.status(200).json({ message: "Financial data updated", trip });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//? Get All Trips (Admin & Driver)
export const getAllTrips = async (req, res) => {
  try {

    const trips = await Trip.find().populate("driver", "name email");

    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
