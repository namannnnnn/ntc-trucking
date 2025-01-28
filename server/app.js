//INFO: All the necessary imports
import express from "express";
// import connectDB from "./config/db.js";
import routes from "./routes/router.js";

const app = express();

// Connect to database
// connectDB();

//INFO: Initialising Middleware
app.use(express.json()); // Body parser

// API Routes
app.use("/api", routes);

export default app;
