import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import dayjs from 'dayjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPORTS_DIR = path.join(__dirname, '..', 'reports');

fs.mkdirSync(REPORTS_DIR, { recursive: true });

export async function createDriverReportPDF({ driver, trips, startDate, endDate, imagePath }) {
  return new Promise((resolve, reject) => {
    const timestamp = dayjs().format('YYYYMMDD_HHmmss');
    const filename = `driver_report_${driver.id}_${timestamp}.pdf`;
    const filepath = path.join(REPORTS_DIR, filename);

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const writeStream = fs.createWriteStream(filepath);
    doc.pipe(writeStream);

    // Header
    doc.fontSize(20).text('Driver Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Driver: ${driver.name} (ID: ${driver.id})`);
    doc.text(`Date Range: ${startDate} to ${endDate}`);
    doc.text(`Generated: ${dayjs().format('YYYY-MM-DD HH:mm')}`);
    doc.moveDown();

    // Optional image (logo or uploaded)
    if (imagePath) {
      try {
        const absolute = path.isAbsolute(imagePath)
          ? imagePath
          : path.join(__dirname, '..', imagePath);
        if (fs.existsSync(absolute)) {
          doc.image(absolute, { fit: [150, 150], align: 'left' });
          doc.moveDown();
        }
      } catch (e) {
        // non-fatal
        doc.moveDown().fontSize(10).fillColor('red').text('Warning: Failed to load image.');
        doc.fillColor('black');
      }
    }

    // Summary
    const totalTrips = trips.length;
    const totalDistance = trips.reduce((sum, t) => sum + (t.distanceKm || 0), 0);
    const totalDurationMin = trips.reduce((sum, t) => sum + (t.durationMin || 0), 0);

    doc.fontSize(14).text('Summary', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(12).list([
      `Total Trips: ${totalTrips}`,
      `Total Distance: ${totalDistance.toFixed(2)} km`,
      `Total Duration: ${totalDurationMin} min`
    ]);
    doc.moveDown();

    // Table-ish details
    doc.fontSize(14).text('Trips', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(11);

    if (trips.length === 0) {
      doc.text('No trips found for this period.');
    } else {
      const colWidths = [120, 120
        // 100, 100
    ];
      const headers = ['Start Time',
                    //    'End Time',
                       'Distance (km)'
                    //    'Duration (min)'
                    ];
    const tableStartX = doc.x; // fix this before drawing table
      drawRow(doc, headers, colWidths, true, tableStartX);

      trips.forEach((t) => {
        // t.endTime = new Date();
        // t.durationMin == '0'
        drawRow(doc, [
          dayjs(t.startTime).format('YYYY-MM-DD HH:mm'),
        //   dayjs(t.endTime).format('YYYY-MM-DD HH:mm'),
          (t.distanceKm ?? 0).toFixed(2)
        //   t.durationMin ?? 0
        ], colWidths, false, tableStartX);
      });
    }

    doc.end();

    writeStream.on('finish', () => resolve({ filepath, filename }));
    writeStream.on('error', reject);
  });
}

// function drawRow(doc, cells, widths, isHeader) {
//   const y = doc.y;
//   const padding = 6;

//   cells.forEach((cell, idx) => {
//     const x = doc.x + widths.slice(0, idx).reduce((a, b) => a + b, 0);
//     doc.rect(x, y, widths[idx], 20).stroke();
//     doc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica');
//     doc.text(String(cell), x + padding, y + 5, { width: widths[idx] - padding * 2, ellipsis: true });
//   });

//   doc.moveDown(1.3);
// }

function drawRow(doc, cells, widths, isHeader, startX) {
  const y = doc.y;
  const padding = 6;

  cells.forEach((cell, idx) => {
    const x = startX + widths.slice(0, idx).reduce((a, b) => a + b, 0);
    doc.rect(x, y, widths[idx], 20).stroke();
    doc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica');
    doc.text(String(cell), x + padding, y + 5, {
      width: widths[idx] - padding * 2,
      ellipsis: true,
    });
  });

  doc.moveDown(1.3);
}
