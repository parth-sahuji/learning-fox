const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('✅ Cloudinary cloud_name:', process.env.CLOUDINARY_CLOUD_NAME);

// Use MEMORY storage — file goes to buffer, we upload to Cloudinary manually
// This is the most reliable approach — no multer-storage-cloudinary dependency
const memStorage = multer.memoryStorage();

const uploadRegDocs = multer({
  storage: memStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).fields([
  { name: 'aadhar_doc', maxCount: 1 },
  { name: 'resume_doc', maxCount: 1 },
]);

const uploadPortfolio = multer({
  storage: memStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
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

module.exports = { cloudinary, uploadRegDocs, uploadPortfolio, uploadBufferToCloudinary };
