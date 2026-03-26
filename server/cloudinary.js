const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error('❌ Cloudinary credentials missing!');
} else {
  console.log('✅ Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME);
}

const regDocsStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'learningfox/reg_docs',
    resource_type: 'auto',
  },
});

const portfolioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'learningfox/portfolio',
    resource_type: 'auto',
  },
});

// NO fileFilter — accept everything, let Cloudinary handle it
// fileFilter was silently dropping files in production causing "Aadhar required" error
const uploadRegDocs = multer({
  storage: regDocsStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).fields([
  { name: 'aadhar_doc', maxCount: 1 },
  { name: 'resume_doc', maxCount: 1 },
]);

const uploadPortfolio = multer({
  storage: portfolioStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array('files', 10);

module.exports = { cloudinary, uploadRegDocs, uploadPortfolio };
