import { Router } from 'express';
import { uploadImage } from '../controllers/upload.controller.js';
import { generateReport } from '../controllers/report.controller.js';
import upload from '../middleware/uploadMiddleware.js';
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from 'url';


const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Upload an image to be embedded in future PDFs
 * Response: { filename, url, path }
 */
router.post('/uploads/image', upload.single('image'), uploadImage);

const LOGO_PATH = path.join(__dirname, '..', 'public', 'logo', 'company-logo.png');

router.get('/logo', (req, res) => {
  res.sendFile(LOGO_PATH);
});

/**
 * Generate report for driver + date range
 * Body: {
 *   driverId: string,
 *   startDate: "YYYY-MM-DD",
 *   endDate: "YYYY-MM-DD",
 *   imagePath?: string, // optional absolute or relative path returned from upload
 *   export: "download" | "email",
 *   emailTo?: "user@example.com" // required if export === "email"
 * }
 */
router.post('/', generateReport);

export default router;
