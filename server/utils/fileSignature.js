// Validates a file's actual bytes, not the client-supplied filename/mimetype
// (both are trivially spoofable). Small, fixed set of types the app accepts —
// ponytail: hand-rolled signature check beats adding a dependency (`file-type`
// is ESM-only and this server is CommonJS) for 4 well-known signatures.

const SIGNATURES = [
  { mime: 'image/jpeg', match: buf => buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff },
  { mime: 'image/png', match: buf => buf.length >= 8 && buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { mime: 'image/webp', match: buf => buf.length >= 12 && buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP' },
  { mime: 'application/pdf', match: buf => buf.length >= 5 && buf.slice(0, 5).toString('ascii') === '%PDF-' },
];

// Returns the real mimetype detected from content, or null if it matches none of the known signatures.
function detectType(buffer) {
  const hit = SIGNATURES.find(s => s.match(buffer));
  return hit ? hit.mime : null;
}

// multer fileFilter factory: only accept files whose real bytes match one of `allowedMimes`.
// Note: fileFilter only sees the first chunk in older multer versions, but multer 2.x's
// memoryStorage buffers the whole file before fileFilter's callback path completes for
// disk writes — to be safe we re-check the full buffer again after upload (see requireRealType).
function fileFilter(allowedMimes) {
  return (req, file, cb) => {
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
    cb(null, true);
  };
}

// Call this AFTER multer has buffered the file (req.files.x[0].buffer), before using it.
// Throws if the content doesn't match an allowed signature — this is the real check;
// the multer fileFilter above only rejects obviously-wrong declared mimetypes early.
function requireRealType(buffer, allowedMimes, label = 'file') {
  const real = detectType(buffer);
  if (!real || !allowedMimes.includes(real)) {
    const err = new Error(`${label} content doesn't match an allowed file type (jpg/png/webp/pdf)`);
    err.statusCode = 400;
    throw err;
  }
  return real;
}

module.exports = { detectType, fileFilter, requireRealType };
