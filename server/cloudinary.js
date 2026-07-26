const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { fileFilter } = require('./utils/fileSignature');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('✅ Cloudinary cloud_name:', process.env.CLOUDINARY_CLOUD_NAME);

// Use MEMORY storage — file goes to buffer, we upload to Cloudinary manually
// This is the most reliable approach — no multer-storage-cloudinary dependency
const memStorage = multer.memoryStorage();

// Aadhar/resume: image or PDF only. Declared-mimetype check here is a cheap
// first filter; the real check is requireRealType() on the buffered content
// (see routes) since mimetype/extension are both client-supplied and spoofable.
const REG_DOC_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const PORTFOLIO_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

const uploadRegDocs = multer({
  storage: memStorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 2 }, // 10MB
  fileFilter: fileFilter(REG_DOC_MIMES),
}).fields([
  { name: 'aadhar_doc', maxCount: 1 },
  { name: 'resume_doc', maxCount: 1 },
]);

const uploadPortfolio = multer({
  storage: memStorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  fileFilter: fileFilter(PORTFOLIO_MIMES),
}).array('files', 10);

// Helper: upload a buffer to Cloudinary, returns secure_url
function uploadBufferToCloudinary(buffer, folder, originalname) {
  return new Promise((resolve, reject) => {
    // 30 second timeout for Cloudinary upload
    const timer = setTimeout(() => reject(new Error('Cloudinary upload timed out after 30s')), 30000);
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        clearTimeout(timer);
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

module.exports = { cloudinary, uploadRegDocs, uploadPortfolio, uploadBufferToCloudinary, REG_DOC_MIMES, PORTFOLIO_MIMES };
