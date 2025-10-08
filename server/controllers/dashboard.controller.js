import mongoose from "mongoose";
import Trip from '../models/trip.model.js';


// 1️⃣ Company-wide Totals
// Returns: Total Trips, Total Income, Total Expenses, Balance
export const getCompanyTotals = async (req, res) => {
  try {
    const result = await Trip.aggregate([
      {
        $group: {
          _id: null,
          totalTrips: { $sum: 1 },
          totalIncome: {
            $sum: { $add: ['$grossIncome', { $ifNull: ['$additionalIncome', 0] }] },
          },
          totalExpenses: { $sum: '$totalExpenses' },
          balance: { $sum: '$balance' },
        },
      },
    ]);

    res.json(result[0] || { totalTrips: 0, totalIncome: 0, totalExpenses: 0, balance: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch totals' });
  }
};


export const getDriverSummary = async (req, res) => {
  try {
    const { driverId } = req.params;

    const result = await Trip.aggregate([
      { $match: { driver: new mongoose.Types.ObjectId(driverId) } },
      {
        $group: {
          _id: '$driver',
          trips: { $sum: 1 },
          income: {
            $sum: { $add: ['$grossIncome', { $ifNull: ['$additionalIncome', 0] }] },
          },
          expenses: { $sum: '$totalExpenses' },
          balance: { $sum: '$balance' },
          mileage: { $sum: '$mileage' },
        },
      },
      {
        $project: {
          _id: 0,
          trips: 1,
          income: 1,
          expenses: 1,
          balance: 1,
          costPerMile: {
            $cond: [
              { $gt: ['$mileage', 0] },
              { $divide: ['$expenses', '$mileage'] },
              0,
            ],
          },
        },
      },
    ]);

    res.json(result[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch driver summary' });
  }
};

export const getIncomeExpenseSeries = async (req, res) => {
  try {
    // Optional: allow year filtering if you want (e.g., /series/year?year=2025)
    const year = parseInt(req.query.year) || new Date().getFullYear();

    // 1️⃣ Aggregate income & expense by month for the given year
    const data = await Trip.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00Z`),
            $lte: new Date(`${year}-12-31T23:59:59Z`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalIncome: {
            $sum: { $add: ['$grossIncome', { $ifNull: ['$additionalIncome', 0] }] },
          },
          totalExpenses: { $sum: '$totalExpenses' },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    // 2️⃣ Prepare 12 months in order
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // 3️⃣ Fill arrays with 0s initially
    const incomeArr = Array(12).fill(0);
    const expenseArr = Array(12).fill(0);

    // 4️⃣ Fill available data into correct month index
    data.forEach(item => {
      const index = item._id - 1; // Mongo month starts from 1
      incomeArr[index] = item.totalIncome;
      expenseArr[index] = item.totalExpenses;
    });

    // 5️⃣ Send formatted result
    res.json({
      year,
      labels: months,
      series: [
        { name: 'expense', data: expenseArr },
        { name: 'income', data: incomeArr },
      ],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch monthly income/expense data' });
  }
};




