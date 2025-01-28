// app.js
import express from "express";
// import connectDB from "./config/db.js";
// import routes from "./routes/index.js";

const app = express();

// Connect to database
// connectDB();

// Middleware
app.use(express.json()); // Body parser

// API Routes
// app.use("/api", routes);

export default app;
