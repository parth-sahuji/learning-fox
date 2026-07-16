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
    // ponytail: admin users are seeded once by hand (SQL in chat), not
    // auto-created/reset on every boot with a password hardcoded in a public
    // repo. Upgrade path: a real one-time seed script, if onboarding more admins.
  } catch (err) {
    console.error('❌ DB init error:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, initDB };
