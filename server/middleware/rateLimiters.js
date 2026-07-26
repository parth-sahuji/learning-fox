const rateLimit = require('express-rate-limit');

const int = (envVar, fallback) => {
  const n = parseInt(process.env[envVar], 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

// ponytail: keyed by IP (express-rate-limit default, respects `trust proxy`)
// for all three tiers — simplest thing that satisfies "stricter/moderate/looser".
// Upgrade path: key the authed tier by req.user.id instead of IP if shared-office
// IPs start tripping it for unrelated users.
const makeLimiter = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: message }),
});

// Strict — login, register, forgot/reset-password, doc upload during registration.
const authLimiter = makeLimiter(
  int('RATE_LIMIT_AUTH_WINDOW_MS', 15 * 60 * 1000),
  int('RATE_LIMIT_AUTH_MAX', 20),
  'Too many attempts. Please wait a few minutes and try again.'
);

// Moderate — public, unauthenticated endpoints (health check, etc).
const publicLimiter = makeLimiter(
  int('RATE_LIMIT_PUBLIC_WINDOW_MS', 15 * 60 * 1000),
  int('RATE_LIMIT_PUBLIC_MAX', 100),
  'Too many requests. Please slow down.'
);

// Loose — everyday authenticated actions (dashboard, profile, uploads, admin panel).
const authedLimiter = makeLimiter(
  int('RATE_LIMIT_AUTHED_WINDOW_MS', 60 * 1000),
  int('RATE_LIMIT_AUTHED_MAX', 120),
  'Too many requests. Please slow down.'
);

module.exports = { authLimiter, publicLimiter, authedLimiter };
