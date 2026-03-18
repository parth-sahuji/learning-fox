import { useState, useEffect } from 'react';
import api from '../../api';

export default function StudentFees() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState({});
  const [toast, setToast] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const load = () => {
    setLoading(true);
    api.get('/student/fees').then(r => setRecords(r.data.fee_records)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const confirmPayment = async id => {
    if (!window.confirm('Confirm that you have made the offline payment to your teacher?')) return;
    setConfirming(c => ({ ...c, [id]: true }));
    try {
      await api.post(`/student/fees/${id}/confirm`);
      showToast('Payment confirmed! Waiting for your teacher to verify.');
      load();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed.', 'error');
    } finally {
      setConfirming(c => ({ ...c, [id]: false }));
    }
  };

  const filtered = filterStatus === 'all' ? records : records.filter(r => r.status === filterStatus);

  const totalPaid = records.filter(r => r.status === 'cleared')
    .reduce((s, r) => s + parseFloat(r.monthly_fee || 0), 0);

  const statusConfig = {
    pending: { icon: '⏳', label: 'Fee Due', cls: 'badge-pending', canPay: true },
    student_paid: { icon: '💰', label: 'Awaiting Teacher', cls: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium', canPay: false },
    cleared: { icon: '✅', label: 'Cleared', cls: 'badge-cleared', canPay: false },
    overdue: { icon: '🚨', label: 'Overdue', cls: 'badge-rejected', canPay: true },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className={`fixed top-12 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white
          ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} animate-slide-up`}>
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Fee History</h1>
          <p className="page-subtitle">Track your tuition fee payments</p>
        </div>
        <div className="card py-3 px-4 text-center flex-shrink-0">
          <p className="text-xs text-[var(--text-secondary)]">Total Paid</p>
          <p className="text-lg font-bold font-display text-emerald-600 dark:text-emerald-400">
            ₹{totalPaid.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Info box about how the flow works */}
      <div className="card py-3 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
          <strong>How it works:</strong> Pay your fee offline to your teacher → Click "I have paid" →
          Your teacher will then confirm receipt → Status becomes Cleared ✅
        </p>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'student_paid', 'cleared'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`text-sm px-3 py-1.5 rounded-lg transition-all ${filterStatus === s
              ? 'bg-brand-500 text-white'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-brand-300'}`}>
            {s === 'all' ? 'All' : s === 'student_paid' ? 'Awaiting Teacher' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="card shimmer h-20" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-3">₹</div>
          <p className="font-semibold text-[var(--text-primary)]">No fee records yet</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Records will appear here once the admin generates them.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => {
            const sc = statusConfig[r.status] || statusConfig.pending;
            return (
              <div key={r.id} className={`card flex flex-col sm:flex-row sm:items-center justify-between gap-4
                ${sc.canPay ? 'ring-2 ring-amber-400' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0
                    ${r.status === 'cleared' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                      : r.status === 'student_paid' ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                      : 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'}`}>
                    {sc.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)]">{r.teacher_name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300">
                        {r.subject}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      <span className="font-mono font-medium">{r.month_year}</span>
                      <span className="mx-1">·</span>
                      <span className="font-bold text-[var(--text-primary)]">₹{parseFloat(r.monthly_fee).toLocaleString('en-IN')}</span>
                    </p>
                    {/* Dual confirmation dots */}
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${r.student_confirmed ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                        <span className="text-xs text-[var(--text-secondary)]">You</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${r.teacher_confirmed ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                        <span className="text-xs text-[var(--text-secondary)]">Teacher</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={sc.cls}>{sc.label}</span>
                  {sc.canPay && !r.student_confirmed && (
                    <button onClick={() => confirmPayment(r.id)} disabled={confirming[r.id]}
                      className="btn-primary text-sm">
                      {confirming[r.id] ? '...' : '💸 I have paid'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
