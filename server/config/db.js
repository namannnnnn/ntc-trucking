import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  console.log(`Connection to Mongo DB was established successfully !`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

