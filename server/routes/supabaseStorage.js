// Supabase Storage — private bucket for Aadhar/resume docs.
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars (Render dashboard).
// Bucket 'reg-docs' must be created in Supabase dashboard as PRIVATE (not public).

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'reg-docs';

function assertConfigured() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set in environment');
  }
}

// Uploads a buffer to storagePath (e.g. "teacher/42/aadhar.pdf"). Overwrites if exists.
// Returns the storagePath — store THIS in the DB, never a public URL.
async function uploadBufferToSupabase(buffer, storagePath, mimetype) {
  assertConfigured();
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePath}`,
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

// Generates a temporary signed URL (default 5 min) so the admin/teacher can view a private doc.
async function getSignedUrl(storagePath, expiresIn = 300) {
  assertConfigured();
  if (!storagePath) return null;
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/sign/${BUCKET}/${storagePath}`,
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

// Helper to build a stable path for a doc.
function docPath(role, userId, docType, ext) {
  return `${role}/${userId}/${docType}.${ext}`;
}

// Best-effort file extension from an original filename, defaults to 'bin'.
function extFromName(name = '') {
  const m = /\.([a-zA-Z0-9]+)$/.exec(name);
  return m ? m[1].toLowerCase() : 'bin';
}

module.exports = { uploadBufferToSupabase, getSignedUrl, docPath, extFromName, BUCKET };
