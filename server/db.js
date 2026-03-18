const { Pool } = require('pg');
require('dotenv').config();

// Supports both DATABASE_URL (Supabase/Railway) and individual vars (local)
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // required for Supabase
      }
    : {
        host:     process.env.DB_HOST     || 'localhost',
        port:     parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME     || 'tutorapp',
        user:     process.env.DB_USER     || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
      }
);

pool.on('error', (err) => console.error('Unexpected DB error', err));

const fs = require('fs');
const path = require('path');

async function initDB() {
  const client = await pool.connect();
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schema);
    console.log('✅ Database schema initialized');

    const bcrypt = require('bcryptjs');
    const adminEmails = [
      process.env.ADMIN_EMAIL_1 || 'Ksl.13021412@gmail.com',
      process.env.ADMIN_EMAIL_2 || 'parthcollege1@gmail.com',
    ];
    for (const email of adminEmails) {
      const ex = await client.query(
        "SELECT id FROM users WHERE email=$1 AND agency_id='default'", [email]
      );
      if (ex.rows.length === 0) {
        const hash = await bcrypt.hash('Admin@1234', 12);
        await client.query(
          `INSERT INTO users (agency_id, email, password_hash, role, full_name, status)
           VALUES ('default', $1, $2, 'admin', 'Platform Admin', 'approved')`,
          [email, hash]
        );
        console.log(`✅ Admin seeded: ${email}`);
      }
    }
  } catch (err) {
    console.error('❌ DB init error:', err.message);
  } finally {
    client.release();
  }
}

module.exports = { pool, initDB };
