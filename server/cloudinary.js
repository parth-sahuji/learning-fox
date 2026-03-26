const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Validate Cloudinary credentials at startup
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ CLOUDINARY credentials missing! Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
} else {
  console.log('✅ Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for REGISTRATION documents (Aadhar, Resume)
const regDocsStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:        'learningfox/reg_docs',
    resource_type: 'auto',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png', 'webp'],
  },
});

// Storage for PORTFOLIO documents (teacher certificates etc.)
const portfolioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:        'learningfox/portfolio',
    resource_type: 'auto',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'gif'],
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only PDF and image files are allowed'), false);
};

const uploadRegDocs = multer({
  storage: regDocsStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).fields([
  { name: 'aadhar_doc', maxCount: 1 },
  { name: 'resume_doc', maxCount: 1 },
]);

const uploadPortfolio = multer({
  storage: portfolioStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array('files', 10);

module.exports = { cloudinary, uploadRegDocs, uploadPortfolio };
