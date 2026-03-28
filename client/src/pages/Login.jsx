import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';
import api from '../api';

const FLOAT_ICONS = ['📚','✏️','🔢','🧪','🌍','🎵','🚀','💡','🏆','⭐','🔬','📐'];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // Forgot password state
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const map = { admin: '/admin', teacher: '/teacher', student: '/student' };
      navigate(map[user.role] || '/login', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || '';
      if (err.response?.status === 403 && msg.includes('pending')) {
        setError('Your account is pending admin approval. Please wait 1-2 business days.');
      } else if (err.response?.status === 401) {
        setError('Invalid email or password. Please check and try again.');
      } else if (!err.response) {
        setError('Cannot connect to server. Please check your internet and try again.');
      } else {
        setError(msg || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async e => {
    e.preventDefault();
    if (!forgotEmail.trim()) return setForgotMsg('Please enter your email address.');
    setForgotLoading(true);
    setForgotMsg('');
    try {
      await api.post('/auth/forgot-password', { email: forgotEmail.trim() });
      setForgotMsg('✅ If that email is registered, a reset link has been sent. Check your inbox.');
    } catch (err) {
      setForgotMsg('✅ If that email is registered, a reset link has been sent. Check your inbox.');
      // Always show success msg for security (don't reveal if email exists)
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ paddingTop: '72px' }}>
      <AnimatedBackground />
      <div className="w-full max-w-md relative z-10" style={{ animation: 'slideUp 0.4s ease-out' }}>

        {/* Logo */}
        <div className="text-center mb-6">
          <img src="/fox-logo.png" alt="Learning Foxx" className="mx-auto object-contain"
            style={{ width: '140px', height: '140px', filter: 'drop-shadow(0 12px 32px rgba(239,117,32,0.5))', animation: 'floatIcon 3.5s ease-in-out infinite' }} />
          <h1 className="font-display text-4xl font-extrabold mt-2" style={{ background: 'linear-gradient(135deg, #f97316, #b94612)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Learning Foxx
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm font-medium">🏆 India's Best Home Tuition Platform</p>
        </div>

        <div className="card shadow-2xl" style={{ backdropFilter: 'blur(20px)', background: 'rgba(30,20,9,0.95)', border: '1px solid rgba(239,117,32,0.3)' }}>

          {!forgotMode ? (
            <>
              <h2 className="font-display text-2xl font-bold text-center text-[var(--text-primary)] mb-6">Welcome Back! 👋</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-950/50 border border-red-700 rounded-xl text-sm text-red-400 flex items-start gap-2">
                  <span className="flex-shrink-0">⚠️</span> {error}
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
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      className="input pr-12"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      required
                    />
                    <button type="button" onClick={() => setShowPwd(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-lg select-none"
                      title={showPwd ? 'Hide password' : 'Show password'}>
                      {showPwd ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button type="button" onClick={() => { setForgotMode(true); setError(''); }}
                    className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                    Forgot password?
                  </button>
                </div>

                <button type="submit" className="btn-primary w-full py-3 text-base" disabled={loading}>
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
                New here? <Link to="/register" className="text-brand-500 hover:text-brand-400 font-bold">Register as Teacher / Student</Link>
              </p>
              <p className="text-center text-xs text-[var(--text-secondary)]/50 mt-2">
                By signing in you agree to our <Link to="/terms" className="text-brand-500 hover:underline">Terms & Conditions</Link>
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-xl font-bold text-center text-[var(--text-primary)] mb-2">Reset Password</h2>
              <p className="text-sm text-[var(--text-secondary)] text-center mb-5">
                Enter your registered email. We'll send a reset link.
              </p>

              {forgotMsg && (
                <div className={`mb-4 p-3 rounded-xl text-sm border ${forgotMsg.startsWith('✅') ? 'bg-emerald-950/40 border-emerald-700 text-emerald-400' : 'bg-red-950/40 border-red-700 text-red-400'}`}>
                  {forgotMsg}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" className="input" placeholder="your@email.com"
                    value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required autoFocus />
                </div>
                <button type="submit" className="btn-primary w-full" disabled={forgotLoading}>
                  {forgotLoading ? 'Sending...' : '📧 Send Reset Link'}
                </button>
              </form>

              <button onClick={() => { setForgotMode(false); setForgotMsg(''); }}
                className="w-full text-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mt-4 transition-colors">
                ← Back to Login
              </button>
            </>
          )}
        </div>

        <div className="flex items-center justify-center gap-5 mt-5">
          {['✅ Verified Tutors','🔒 Safe & Secure','⭐ Best Results'].map(b => (
            <span key={b} className="text-xs text-[var(--text-secondary)] font-semibold">{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
