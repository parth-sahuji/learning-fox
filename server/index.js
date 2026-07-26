require('dotenv').config();
const express = require('express');
require('express-async-errors'); // makes thrown/rejected errors in async route handlers reach the error middleware below (Express 4 doesn't do this natively)
const cors    = require('cors');
const path    = require('path');
const cron    = require('node-cron');
const { initDB, pool } = require('./db');
const { authLimiter, publicLimiter, authedLimiter } = require('./middleware/rateLimiters');

const app  = express();
const PORT = process.env.PORT || 5001;

// CORS — support multiple origins (local + production)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',').map(s => s.trim());

const helmet = require('helmet');

// Trust Render proxy (required for correct IP detection)
app.set('trust proxy', 1);

// CORS must come FIRST — before rate limiting
// Otherwise rate limit error responses have no CORS headers and browser rejects them
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Security headers (after CORS)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

// ── Rate limiting — tiered, all thresholds configurable via env (see .env.example) ──
// Strict: auth routes (login, all register variants via prefix match, password reset, doc upload)
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter); // also covers /register/student, /register/teacher
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);
app.use('/api/auth/upload-doc', authLimiter);
// login additionally gets per-account backoff — see routes/auth.js + middleware/accountLockout.js

// Moderate: public/unauthenticated, non-auth endpoints
app.use('/api/health', publicLimiter);

// Loose: everyday authenticated actions
app.use('/api/teacher', authedLimiter);
app.use('/api/student', authedLimiter);
app.use('/api/admin', authedLimiter);
app.use('/api/auth/me', authedLimiter);
app.use('/api/auth/notifications', authedLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/admin',   require('./routes/admin'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/student', require('./routes/student'));

app.get('/api/health', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    res.json({ status: 'ok', db: 'ok', version: '6.0', timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Health check DB error:', err);
    res.status(500).json({ status: 'error', db: 'error' });
  }
});

// 404
app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));

// Error handler — never leak stack traces, file paths, or raw DB errors to the client.
// Full detail always goes to the server log; the client gets a safe, generic message
// unless the error is one we deliberately threw ourselves with a controlled message
// (validation, multer upload rejections) via a statusCode < 500.
app.use((err, req, res, next) => {
  console.error(err);

  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large. Max 10MB.' });
  if (err.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).json({ error: 'Unexpected file field.' });
  if (err.name === 'MulterError') return res.status(400).json({ error: err.message });
  if (/^Unsupported file type/.test(err.message || '')) return res.status(400).json({ error: err.message });
  if (err.message && err.message.startsWith('CORS blocked')) return res.status(403).json({ error: 'Origin not allowed' });

  const status = err.statusCode && err.statusCode < 500 ? err.statusCode : 500;
  res.status(status).json({ error: status < 500 ? err.message : 'Something went wrong. Please try again.' });
});

// CRON: 30th of every month 9AM IST
cron.schedule('0 9 30 * *', async () => {
  console.log('🕐 Monthly fee trigger running...');
  const client = await pool.connect();
  try {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthYear = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;
    const agencies = await client.query("SELECT DISTINCT agency_id FROM assignments WHERE status='active'");
    for (const { agency_id } of agencies.rows) {
      const assignments = await client.query(
        "SELECT id, student_id FROM assignments WHERE agency_id=$1 AND status='active'", [agency_id]
      );
      for (const a of assignments.rows) {
        const ex = await client.query('SELECT id FROM fee_records WHERE assignment_id=$1 AND month_year=$2', [a.id, monthYear]);
        if (ex.rows.length === 0) {
          await client.query(
            "INSERT INTO fee_records (agency_id, assignment_id, month_year, status) VALUES ($1,$2,$3,'pending')",
            [agency_id, a.id, monthYear]
          );
          await client.query(
            `INSERT INTO notifications (agency_id, user_id, title, message, type)
             VALUES ($1,$2,'Fee Due',$3,'warning')`,
            [agency_id, a.student_id, `Your tuition fee for ${monthYear} is now due. Please pay your teacher and confirm.`]
          );
        }
      }
    }
    console.log(`✅ Fee trigger done for ${monthYear}`);
  } catch (err) { console.error('Cron error:', err); }
  finally { client.release(); }
}, { timezone: 'Asia/Kolkata' });

async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`🚀 Learning Fox Server running on port ${PORT}`);
    console.log(`🌍 Allowed origins: ${allowedOrigins.join(', ')}`);
  });
}

start();


// ── KEEPALIVE SELF-PING ──────────────────────────────────────────────────────
// Pings itself every 14 minutes so Render free tier never goes to sleep.
// Only runs in production to avoid unnecessary requests in local dev.
if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
  const https = require('https');
  const http  = require('http');

  setInterval(() => {
    const url = `${process.env.RENDER_EXTERNAL_URL}/api/health`;
    const lib  = url.startsWith('https') ? https : http;

    lib.get(url, (res) => {
      console.log(`🏓 Keepalive ping → ${res.statusCode}`);
    }).on('error', (err) => {
      console.warn(`⚠️  Keepalive failed: ${err.message}`);
    });
  }, 14 * 60 * 1000); // every 14 minutes

  console.log('✅ Keepalive self-ping active (every 14 min)');
}
