const jwt = require('jsonwebtoken');
const { pool } = require('../db');

// ponytail: no fallback. A hardcoded secret in a public repo means anyone can
// forge admin tokens the moment this env var is unset — fail the boot instead.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET environment variable is not set');
  process.exit(1);
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// ponytail: JWT status is a snapshot from login/register time. Re-check the DB only when the token
// says not-approved, so users approved after logging in aren't 403'd for up to 7 days.
async function requireApproved(req, res, next) {
  if (req.user.status !== 'approved') {
    const { rows } = await pool.query('SELECT status FROM users WHERE id=$1', [req.user.id]);
    if (rows[0]?.status !== 'approved') return res.status(403).json({ error: 'Account pending admin approval' });
    req.user.status = 'approved';
  }
  next();
}

module.exports = { authenticate, requireRole, requireApproved, JWT_SECRET };
