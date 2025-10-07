import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { uploadImage, reuploadImage, viewImage } from "../controllers/imageController.js";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage); // Upload Image
router.put("/reupload/:id", upload.single("image"), reuploadImage); // Reupload Image
router.get("/view/:id", viewImage); // View Image

export default router;
