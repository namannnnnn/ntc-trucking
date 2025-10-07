import Driver from "../models/driver.model.js";
import User from "../models/user.model.js";

//? Create a New Driver (Admin Only)
export const createDriver = async (req, res) => {
  try {

    const { name, contactNumber, email, truckNumberPlate } = req.body;

    //INFO: Check if driver already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "No user exists with this email address" });
    }


    //INFO: Check if driver already exists
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ message: "Driver with this email already exists" });
    }

    //QUERY: Create the driver constructor of mongo model
    const newDriver = new Driver({
      name,
      contactNumber,
      email,
      truckNumberPlate,
    });

    //QUERY: Save the new driver details
    await newDriver.save();

    res.status(201).json({ message: "Driver added successfully", driver: newDriver });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//? Get All Drivers (Admin & Staff)
export const getAllDrivers = async (req, res) => {
  try {
    console.log("inside")
    //QUERY: Find all drivers
    const drivers = await Driver.find();

    //INFO: Check if there are no drivers
    if(drivers.length === 0){
        return res.status(404).json({ message: "No driver data found" });
    }
    console.log(drivers)
    //* Drivers fetched successfully
    res.status(200).json(drivers);
  
} catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//? Get a Single Driver by ID (Admin & Staff)
export const getDriverById = async (req, res) => {
  try {
    const { driverId } = req.params;

    //QUERY: Find driver by id
    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    //* Driver was fetched successfully
    res.status(200).json(driver);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//? Update a Driver (Admin & Staff)
export const updateDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { name, contactNumber, email, truckNumberPlate } = req.body;

    //QUERY: Find the driver
    const driver = await Driver.findById(driverId);

    //INFO: Check if driver already exists
    const existingUser = await User.findOne({ email:driver.email });
    if (existingUser) {
      return res.status(400).json({ message: "No user exists with this email address" });
    }

    //INFO: Check if the driver exists
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    //INFO: Update fields if provided
    if (name) driver.name = name;
    if (contactNumber) driver.contactNumber = contactNumber;
    if (email) driver.email = email;
    if (truckNumberPlate) driver.truckNumberPlate = truckNumberPlate;

    //QUERY: Update the driver information
    await Driver.updateOne({"_id":driverId},{$set :{...driver}});

    //* Driver data was updated successfully
    res.status(200).json({ message: "Driver updated successfully", driver });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//? Delete a Driver (Admin Only)
export const deleteDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    //QUERY : Delete the driver by id
    await Driver.findByIdAndDelete(driverId);

    //* Driver was deleted successfully
    res.status(200).json({ message: "Driver deleted successfully" });
  
} catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 67b7137f20efce127e5b94ad
// 67b7134520efce127e5b94ab