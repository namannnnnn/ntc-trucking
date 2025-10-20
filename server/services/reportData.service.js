// Replace this with your actual DB/data access layer.
// These are simple mocks to keep the example self-contained.

import dayjs from 'dayjs';
import Driver from "../models/driver.model.js";
import Trip from "../models/trip.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Mock drivers table
const DRIVERS = [
  { id: 'd1', name: 'Aman Sharma' },
  { id: 'd2', name: 'Priya Nair' },
  { id: 'd3', name: 'Vikram Rao' }
];

// Mock trip generator
function mockTripsInRange(start, end) {
  // Generate 5 pseudo trips between range
  const trips = [];
  let cursor = dayjs(start);
  for (let i = 0; i < 5; i++) {
    const st = cursor.add(i, 'day').hour(9).minute(0);
    const et = st.add(45 + i * 5, 'minute');
    trips.push({
      startTime: st.toDate(),
      endTime: et.toDate(),
      distanceKm: 12.3 + i * 1.1,
      durationMin: et.diff(st, 'minute')
    });
  }
  // Filter to range
  return trips.filter(t =>
    dayjs(t.startTime).isAfter(dayjs(start).subtract(1, 'minute')) &&
    dayjs(t.endTime).isBefore(dayjs(end).add(1, 'minute'))
  );
}

export async function getTripsForDriver(driverId, start, end) {
//   if (!mongoose.Types.ObjectId.isValid(driverId)) {
//     return [];
//   }

  // Trip filtering based on driver + date range
  const trips = await Trip.find({
    driver: new mongoose.Types.ObjectId(driverId),
    startTime: { $gte: start }
    
  })
    .populate('driver', 'name email')
    .sort({ startTime: 1 })
    .lean();

//   trips = await Trip.find({driver: new mongoose.Types.ObjectId(req.user.id)})
//                               .populate("driver", "name email")
//                               .sort({ createdAt: -1 });
// // endTime: { $lte: end }

  // Transform trips into structure for PDF service
  return trips.map(trip => ({
    startTime: trip.startTime,
    endTime: trip.endTime,
    distanceKm: trip.mileage ?? 0,
    // durationMin: trip.durationMin ?? calculateDurationMinutes(trip.startTime, trip.endTime)
  }));
}

export async function getDriverById(driverId) {
 
  
  //? Find driver by user
  return await User.findById(driverId).select('name email');
}
