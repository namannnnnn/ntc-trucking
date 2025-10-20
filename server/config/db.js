// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     console.log(process.env.MONGO_URI);
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//   console.log(`Connection to Mongo DB was established successfully !`);
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1);
//   }
// };


let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    isConnected = true;
    console.log("✅ MongoDB Connected:", conn.connection.host);
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    throw err;
  }
};