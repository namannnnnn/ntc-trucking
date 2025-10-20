//INFO: All the necessary imports
import express from "express";
import { login } from "../controllers/auth.controller.js";
import { ServerLive } from "../controllers/auth.controller.js";

//? Registering Routers
const router = express.Router();

// //? Registering endpoints
// router.post("/register", register); //INFO: Registering endpoint for registration of user


router.post("/login", login); //INFO: Registering endpoint for login 
router.post("/", ServerLive);       

export default router;