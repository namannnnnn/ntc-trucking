//INFO: All the necessary imports
import express from "express";
import {connectDB} from "../server/config/db.js";
import routes from "./routes/router.js";
import fs from "fs";
import * as path from "path";
const app = express();

//INFO: Connect to database
connectDB();

//INFO: Initialising Middleware
app.use(express.json()); // Body parser

// API Routes
app.use("/api", routes);




export default app;
