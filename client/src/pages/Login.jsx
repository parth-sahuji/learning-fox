import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const map = { admin: '/admin', teacher: '/teacher', student: '/student' };
      navigate(map[user.role] || '/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ paddingTop: '72px' }}>
      {/* Animated background */}
      <AnimatedBackground />

      {/* Content sits above background */}
      <div className="w-full max-w-md relative content-layer" style={{ animation: 'slideUp 0.4s ease-out' }}>

        {/* Big Fox Logo */}
        <div className="text-center mb-6">
          <div className="inline-block relative">
            <img
              src="/fox-logo.png"
              alt="Learning Foxx"
              className="mx-auto object-contain"
              style={{
                width: '160px',
                height: '160px',
                filter: 'drop-shadow(0 12px 32px rgba(239,117,32,0.5))',
                animation: 'floatIcon 3.5s ease-in-out infinite',
              }}
            />
          </div>
          <h1 className="font-display text-4xl font-extrabold mt-3" style={{
            background: 'linear-gradient(135deg, #ef7520, #b94612)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Learning Foxx
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm font-medium">
            🏆 India's Best Home Tuition Platform
          </p>
        </div>

        {/* Card */}
        <div className="card shadow-2xl border-2 border-brand-100 dark:border-brand-900"
          style={{ backdropFilter: 'blur(20px)', background: 'rgba(30,20,9,0.95)', border: '1px solid rgba(239,117,32,0.3)' }}>

          <h2 className="font-display text-2xl font-bold text-center text-[var(--text-primary)] mb-6">
            Welcome Back! 👋
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input type="email" className="input" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required autoFocus />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" placeholder="••••••••"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <button type="submit" className="btn-primary w-full py-3 text-base mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in...
                </span>
              ) : '🦊 Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-5">
            New here?{' '}
            <Link to="/register" className="text-brand-500 hover:text-brand-600 font-bold">
              Register as Teacher / Student
            </Link>
          </p>
          <p className="text-center text-xs text-[var(--text-secondary)]/60 mt-2">
            By signing in you agree to our{' '}
            <Link to="/terms" className="text-brand-500 hover:underline">Terms & Conditions</Link>
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-5 mt-5">
          {['✅ Verified Tutors', '🔒 Safe & Secure', '⭐ Best Results'].map(b => (
            <span key={b} className="text-xs text-[var(--text-secondary)] font-semibold"
              style={{ textShadow: '0 1px 4px rgba(255,255,255,0.8)' }}>{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
