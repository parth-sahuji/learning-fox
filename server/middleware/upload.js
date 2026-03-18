// Portfolio upload middleware — uses Cloudinary
const { uploadPortfolio } = require('../cloudinary');

// Wrap the multer middleware so it can be used as Express middleware
function portfolioUpload(req, res, next) {
  uploadPortfolio(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}

module.exports = { upload: { array: () => portfolioUpload } };
