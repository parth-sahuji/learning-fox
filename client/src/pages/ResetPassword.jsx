import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api';
import AnimatedBackground from '../components/AnimatedBackground';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) setError('Invalid reset link. Please request a new one.');
  }, [token]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setError(''); setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ paddingTop: '72px' }}>
      <AnimatedBackground />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <img src="/fox-logo.png" alt="Learning Foxx" className="w-20 h-20 mx-auto object-contain mb-2"
            style={{ filter: 'drop-shadow(0 8px 20px rgba(239,117,32,0.4))' }} />
          <h1 className="font-display text-2xl font-bold" style={{ background: 'linear-gradient(135deg,#f97316,#b94612)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Learning Foxx
          </h1>
        </div>

        <div className="card" style={{ background: 'rgba(30,20,9,0.95)', border: '1px solid rgba(239,117,32,0.3)' }}>
          {success ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">✅</div>
              <h2 className="font-display text-xl font-bold text-[var(--text-primary)] mb-2">Password Reset!</h2>
              <p className="text-[var(--text-secondary)] text-sm">Redirecting to login in 3 seconds...</p>
            </div>
          ) : (
            <>
              <h2 className="font-display text-xl font-bold text-[var(--text-primary)] mb-5">🔐 Set New Password</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-950/50 border border-red-700 rounded-xl text-sm text-red-400">⚠️ {error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">New Password</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} className="input pr-12" placeholder="Min 6 characters"
                      value={password} onChange={e => setPassword(e.target.value)} required autoFocus />
                    <button type="button" onClick={() => setShowPwd(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">{showPwd ? '🙈' : '👁️'}</button>
                  </div>
                </div>
                <div>
                  <label className="label">Confirm Password</label>
                  <input type={showPwd ? 'text' : 'password'} className="input" placeholder="Repeat password"
                    value={confirm} onChange={e => setConfirm(e.target.value)} required />
                </div>
                <button type="submit" className="btn-primary w-full" disabled={loading || !token}>
                  {loading ? 'Resetting...' : '🔐 Reset Password'}
                </button>
              </form>
              <p className="text-center text-sm text-[var(--text-secondary)] mt-4">
                <Link to="/login" className="text-brand-400 hover:text-brand-300">← Back to Login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
