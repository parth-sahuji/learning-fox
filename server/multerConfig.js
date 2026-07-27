const multer = require('multer');
const { fileFilter } = require('./utils/fileSignature');

// Memory storage — files go straight to a buffer, never touch local disk.
const memStorage = multer.memoryStorage();

// Aadhar/resume: image or PDF only.
const REG_DOC_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
// Portfolio: images only.
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

module.exports = { uploadRegDocs, uploadPortfolio, REG_DOC_MIMES, PORTFOLIO_MIMES };
