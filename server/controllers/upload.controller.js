// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const uploadImage = (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No image provided' });
//   }

//   const filename = req.file.filename;
//   const relPath = path.join('uploads', filename);
//   const url = `${req.protocol}://${req.get('host')}/${relPath.replace(/\\/g, '/')}`;

//   return res.status(201).json({
//     message: 'Image uploaded successfully',
//     filename,
//     url,
//     path: relPath // store and later pass this to /api/reports
//   });
// };

// controllers/logoController.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGO_DIR = path.join(__dirname, '..', 'public', 'logo');
const LOGO_PATH = path.join(LOGO_DIR, 'company-logo.png');

export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file provided' });
  }

  // Replace old logo with new one
  const tempPath = req.file.path;

  // Make sure directory exists
  fs.mkdirSync(LOGO_DIR, { recursive: true });

  // Always store the logo as company-logo.png (standardized)
  fs.rename(tempPath, LOGO_PATH, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to save logo' });
    }

    const publicUrl = `${req.protocol}://${req.get('host')}/logo/company-logo.png`;

    res.status(200).json({
      message: 'Logo updated successfully',
      url: publicUrl,
      path: '/logo/company-logo.png'
    });
  });
};
