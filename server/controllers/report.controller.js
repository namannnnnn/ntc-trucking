import path from 'path';
import fs from 'fs';
import dayjs from 'dayjs';
import { fileURLToPath } from 'url';
import { createDriverReportPDF } from '../services/pdf.service.js';
import { sendReportEmail } from '../services/email.service.js';
import { getDriverById, getTripsForDriver } from '../services/reportData.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateReport = async (req, res) => {
  try {
    const { driverId, startDate, endDate, imagePath, export: exportMode, emailTo } = req.body || {};

    // Validate inputs
    if (!driverId) return res.status(400).json({ error: 'driverId is required' });
    if (!startDate || !endDate) return res.status(400).json({ error: 'startDate and endDate are required (YYYY-MM-DD)' });

    const start = dayjs(startDate, 'YYYY-MM-DD', true);
    const end = dayjs(endDate, 'YYYY-MM-DD', true);

    if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
      return res.status(400).json({ error: 'Invalid date range' });
    }

    // Load driver & trips (replace with your DB calls)
    const driver = await getDriverById(driverId);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    const trips = await getTripsForDriver(driverId, start.toDate(), end.toDate());

    // Create the PDF
    const { filepath, filename } = await createDriverReportPDF({
      driver,
      trips,
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD'),
      imagePath // optional uploaded image (relative or absolute)
    });

    if (exportMode === 'email') {
      if (!emailTo) return res.status(400).json({ error: 'emailTo is required when export is "email"' });

      await sendReportEmail({
        to: emailTo,
        subject: `Driver Report: ${driver.name} (${startDate} to ${endDate})`,
        text: `Attached is the requested driver report for ${driver.name}`,
        attachments: [{ path: filepath, filename }]
      });

      return res.status(200).json({
        message: 'Report generated and emailed successfully',
        file: { filename, path: filepath, publicUrl: toPublicUrl(req, filepath) }
      });
    }

    // Default: download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');
    const stream = fs.createReadStream(filepath);
    stream.pipe(res);
    stream.on('error', (err) => {
      console.error(err);
      res.status(500).end('Error reading generated PDF');
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

function toPublicUrl(req, absOrRelPath) {
  // If path already absolute, make it relative from project root's /reports
  const normalized = absOrRelPath.replace(/\\/g, '/');
  const rel = normalized.includes('/reports/') ? normalized.slice(normalized.indexOf('/reports/') + 1) : normalized;
  return `${req.protocol}://${req.get('host')}/${rel}`;
}
