import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PendingApproval() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isRejected = user?.status === 'rejected';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-primary)]" style={{paddingTop:'68px'}}>
      <div className="w-full max-w-md card text-center animate-slide-up">
        <img src="/fox-logo.png" alt="Learning Fox" className="w-20 h-20 mx-auto object-contain mb-4" />
        <div className="text-4xl mb-3">{isRejected ? '❌' : '⏳'}</div>
        <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-2">
          {isRejected ? 'Account Not Approved' : 'Awaiting Admin Approval'}
        </h2>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
          {isRejected
            ? 'Unfortunately your registration was not approved. Please contact support for more information.'
            : 'Your account has been submitted and is pending admin review. We\'ll notify you once approved (usually 1–2 business days).'}
        </p>

        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] mb-6 text-left">
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">Contact Support</p>
          <a href="tel:8340173069" className="flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600 mb-1">
            📞 8340173069
          </a>
          <a href="mailto:Ksl.13021412@gmail.com" className="flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600 mb-1">
            ✉️ Ksl.13021412@gmail.com
          </a>
          <a href="https://wa.me/918340173069" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600">
            💬 WhatsApp Us
          </a>
        </div>

        <button onClick={() => { logout(); navigate('/login'); }} className="btn-secondary w-full">
          Sign Out
        </button>
      </div>
    </div>
  );
}
