// Supabase Storage.
//   'reg-docs'  bucket — PRIVATE. Aadhar/resume. Signed URLs only, 5 min expiry.
//   'portfolio' bucket — PUBLIC. Teacher work-sample images. Permanent public URLs
//                        (matches how these behaved on Cloudinary before).
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars (Render dashboard).
// Both buckets must be created manually in the Supabase dashboard first —
// 'reg-docs' as PRIVATE, 'portfolio' as PUBLIC.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEFAULT_BUCKET = 'reg-docs';
const PORTFOLIO_BUCKET = 'portfolio';

function assertConfigured() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set in environment');
  }
}

// Uploads a buffer to storagePath (e.g. "teacher/42/aadhar.pdf"). Overwrites if exists.
// Returns the storagePath — store THIS in the DB, never a public URL.
async function uploadBufferToSupabase(buffer, storagePath, mimetype, bucket = DEFAULT_BUCKET) {
  assertConfigured();
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${bucket}/${storagePath}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        apikey: SERVICE_KEY,
        'Content-Type': mimetype || 'application/octet-stream',
        'x-upsert': 'true',
      },
      body: buffer,
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase upload failed: ${res.status} ${text}`);
  }
  return storagePath;
}

// Generates a temporary signed URL (default 5 min) so the admin/teacher can view a PRIVATE doc.
async function getSignedUrl(storagePath, expiresIn = 300, bucket = DEFAULT_BUCKET) {
  assertConfigured();
  if (!storagePath) return null;
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/sign/${bucket}/${storagePath}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        apikey: SERVICE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expiresIn }),
    }
  );
  if (!res.ok) {
    console.error('Supabase sign error:', res.status, await res.text());
    return null;
  }
  const data = await res.json();
  return `${SUPABASE_URL}/storage/v1${data.signedURL}`;
}

// Permanent public URL for a file in a PUBLIC bucket — no API call, no expiry, no signing.
// Only valid for buckets actually configured as public in the Supabase dashboard.
function getPublicUrl(storagePath, bucket = PORTFOLIO_BUCKET) {
  if (!storagePath) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${storagePath}`;
}

// Deletes a single file from storage. Best-effort — caller decides how to handle failure.
async function deleteFromSupabase(storagePath, bucket = PORTFOLIO_BUCKET) {
  assertConfigured();
  if (!storagePath) return;
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${bucket}/${storagePath}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${SERVICE_KEY}`, apikey: SERVICE_KEY } }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase delete failed: ${res.status} ${text}`);
  }
}

// Helper to build a stable path for a singular doc (aadhar/resume).
function docPath(role, userId, docType, ext) {
  return `${role}/${userId}/${docType}.${ext}`;
}

// Best-effort file extension from an original filename, defaults to 'bin'.
function extFromName(name = '') {
  const m = /\.([a-zA-Z0-9]+)$/.exec(name);
  return m ? m[1].toLowerCase() : 'bin';
}

module.exports = {
  uploadBufferToSupabase, getSignedUrl, getPublicUrl, deleteFromSupabase,
  docPath, extFromName, DEFAULT_BUCKET, PORTFOLIO_BUCKET,
};
