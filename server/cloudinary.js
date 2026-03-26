const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── LOCAL DISK STORAGE (always reliable) ─────────────────────────────────────
// Files land on disk first, then we upload to Cloudinary in the route handler.
// This avoids multer-storage-cloudinary silent failures.

const TMP_DIR = path.join(__dirname, 'uploads', 'tmp');
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, TMP_DIR),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExts = ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext)) cb(null, true);
  else cb(new Error('Only PDF and image files are allowed'), false);
};

// Middleware: saves to local disk, fields: aadhar_doc + resume_doc
const uploadRegDocs = multer({
  storage: diskStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).fields([
  { name: 'aadhar_doc', maxCount: 1 },
  { name: 'resume_doc', maxCount: 1 },
]);

// Middleware: saves to local disk, array of files for portfolio
const uploadPortfolio = multer({
  storage: diskStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array('files', 10);

// ── CLOUDINARY HELPER ─────────────────────────────────────────────────────────
// Call this AFTER multer saves the file to disk.
async function uploadToCloudinary(localPath, folder) {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder,
      resource_type: 'auto',
    });
    // Delete local temp file after successful upload
    fs.unlink(localPath, () => {});
    return result.secure_url;
  } catch (err) {
    console.error('Cloudinary upload failed:', err.message);
    // Return local path as fallback so registration still works
    return localPath;
  }
}

module.exports = { cloudinary, uploadRegDocs, uploadPortfolio, uploadToCloudinary };
