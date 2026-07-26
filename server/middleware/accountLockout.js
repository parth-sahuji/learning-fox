// Per-account login backoff, layered on top of the per-IP authLimiter.
// Stored on the users row (failed_login_attempts, lockout_until) rather than
// in memory — this server restarts often (Render free-tier cold starts), and
// in-memory counters would reset on every restart.
//
// Backoff, not a hard lockout: each failure past the threshold doubles the
// wait, capped at LOGIN_LOCKOUT_MAX_MS. A correct password always clears it.

const int = (envVar, fallback) => {
  const n = parseInt(process.env[envVar], 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const MAX_ATTEMPTS = int('LOGIN_MAX_ATTEMPTS', 5);
const BASE_DELAY_MS = int('LOGIN_LOCKOUT_BASE_MS', 30 * 1000);
const MAX_DELAY_MS = int('LOGIN_LOCKOUT_MAX_MS', 15 * 60 * 1000);

function isLocked(user) {
  if (!user.lockout_until) return { locked: false };
  const untilMs = new Date(user.lockout_until).getTime();
  if (untilMs <= Date.now()) return { locked: false };
  return { locked: true, retryAfterSeconds: Math.ceil((untilMs - Date.now()) / 1000) };
}

// Call after a wrong password. Returns the row values to persist.
function afterFailedLogin(user) {
  const attempts = (user.failed_login_attempts || 0) + 1;
  let lockoutUntil = null;
  if (attempts > MAX_ATTEMPTS) {
    const delayMs = Math.min(BASE_DELAY_MS * 2 ** (attempts - MAX_ATTEMPTS - 1), MAX_DELAY_MS);
    lockoutUntil = new Date(Date.now() + delayMs);
  }
  return { attempts, lockoutUntil };
}

module.exports = { isLocked, afterFailedLogin, MAX_ATTEMPTS };
