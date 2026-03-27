require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const cron    = require('node-cron');
const { initDB, pool } = require('./db');

const app  = express();
const PORT = process.env.PORT || 5001;

// CORS — support multiple origins (local + production)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',').map(s => s.trim());

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

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

// Rate limiting — AFTER cors so error responses include CORS headers
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many login attempts. Please wait 15 minutes.' });
  },
});
app.use('/api/auth/login', loginLimiter);

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many registrations. Please try again later.' });
  },
});
app.use('/api/auth/register', registerLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/admin',   require('./routes/admin'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/student', require('./routes/student'));

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', version: '6.0', timestamp: new Date().toISOString() })
);

// 404
app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large. Max 10MB.' });
  res.status(500).json({ error: err.message || 'Internal server error' });
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
