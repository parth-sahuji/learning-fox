const { Pool } = require('pg');
require('dotenv').config();

// Validate DATABASE_URL before trying to connect
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Quick validation - must start with postgres
if (!dbUrl.startsWith('postgres://') && !dbUrl.startsWith('postgresql://')) {
  console.error('❌ DATABASE_URL must start with postgres:// or postgresql://');
  console.error('❌ Current value starts with:', dbUrl.substring(0, 20) + '...');
  process.exit(1);
}

console.log('✅ DATABASE_URL format looks valid');
console.log('   Connecting to:', dbUrl.replace(/:([^:@]+)@/, ':****@')); // log with password hidden

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => console.error('Unexpected DB error', err));

const fs   = require('fs');
const path = require('path');

async function initDB() {
  const client = await pool.connect();
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schema);
    console.log('✅ Database schema initialized');

    const bcrypt = require('bcryptjs');
    const crypto = require('crypto');
    const adminEmails = [process.env.ADMIN_EMAIL_1, process.env.ADMIN_EMAIL_2].filter(Boolean);
    if (adminEmails.length === 0) {
      console.warn('⚠️  ADMIN_EMAIL_1/ADMIN_EMAIL_2 not set — skipping admin seed (no hardcoded fallback).');
    }
    // ponytail: seeds an admin row only if one doesn't exist yet (fresh DB / disaster recovery).
    // Existing admin accounts are never touched here — password changes only happen through
    // the normal login/forgot-password flow, not on every server boot.
    for (const email of adminEmails) {
      const ex = await client.query(
        "SELECT id FROM users WHERE email=$1 AND agency_id='default'", [email]
      );
      if (ex.rows.length === 0) {
        const tempPassword = crypto.randomBytes(9).toString('base64url');
        const hash = await bcrypt.hash(tempPassword, 12);
        await client.query(
          `INSERT INTO users (agency_id, email, password_hash, role, full_name, status)
           VALUES ('default', $1, $2, 'admin', 'Platform Admin', 'approved')`,
          [email, hash]
        );
        console.log(`✅ Admin seeded: ${email} — temp password: ${tempPassword}`);
        console.log('   Log in once with it, then use "Forgot password" to set your own.');
      }
    }
  } catch (err) {
    console.error('❌ DB init error:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, initDB };
