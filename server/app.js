//INFO: All the necessary imports
import express from "express";
import {connectDB} from "../server/config/db.js";
import routes from "./routes/router.js";
import fs from "fs";
import * as path from "path";
import cors from "cors"
const app = express();

//INFO: Connect to database
connectDB();

//INFO: Initialising Middleware
app.use(express.json()); // Body parser
app.use(cors());

// API Routes
app.use("/api", routes);

app.get('/', (req, res) => {
  res.status(200).send(`
    <div style="font-family: Arial; padding: 20px;">
      <h1>🚀 Backend is Live!</h1>
      <p>Status: <strong style="color:green;">OK</strong></p>
      <p>Timestamp: ${new Date().toISOString()}</p>
    </div>
  `);
});

export default app;
