import { useState, useEffect } from 'react';
import api from '../../api';

export default function TeacherFees() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState({});
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = () => {
    setLoading(true);
    api.get('/teacher/fees').then(r => setRecords(r.data.fee_records)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const confirm = async (id) => {
    setConfirming(c => ({ ...c, [id]: true }));
    try {
      await api.post(`/teacher/fees/${id}/confirm`);
      showToast('Confirmed! Fee cleared.');
      load();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed.', 'error');
    } finally {
      setConfirming(c => ({ ...c, [id]: false })); }
  };

  const filtered = filter === 'all' ? records : records.filter(r => r.status === filter);

  const statusCfg = {
    pending:      { icon: '⏳', label: 'Pending', cls: 'badge-pending' },
    student_paid: { icon: '💰', label: 'Student Paid — Confirm!', cls: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium' },
    cleared:      { icon: '✅', label: 'Cleared', cls: 'badge-cleared' },
    overdue:      { icon: '🚨', label: 'Overdue', cls: 'badge-rejected' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className={`fixed top-16 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white
          ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} animate-slide-up`}>
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="page-title">Fee History</h1>
        <p className="page-subtitle">Confirm receipt of student payments — amounts managed by admin</p>
      </div>

      <div className="card py-3 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
          <strong>Note:</strong> Fee amounts are managed by the platform admin and are not shown here. Your role is to confirm when you have received payment from the student.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'student_paid', 'cleared'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-sm px-3 py-1.5 rounded-lg transition-all ${filter === s
              ? 'bg-brand-500 text-white'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-brand-300'}`}>
            {s === 'all' ? 'All' : s === 'student_paid' ? 'Needs Confirmation' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="card shimmer h-20" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-3">📋</div>
          <p className="font-semibold text-[var(--text-primary)]">No records found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => {
            const sc = statusCfg[r.status] || statusCfg.pending;
            const needsConfirm = r.status === 'student_paid' && !r.teacher_confirmed;
            return (
              <div key={r.id} className={`card flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${needsConfirm ? 'ring-2 ring-blue-400' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0
                    ${r.status === 'cleared' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600'
                    : r.status === 'student_paid' ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-600'
                    : 'bg-amber-100 dark:bg-amber-950/40 text-amber-600'}`}>
                    {sc.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)]">{r.student_name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300">{r.subject}</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">Month: <span className="font-mono font-medium">{r.month_year}</span></p>
                    {r.teacher_confirmed_at && (
                      <p className="text-xs text-[var(--text-secondary)]/70">Confirmed: {new Date(r.teacher_confirmed_at).toLocaleDateString('en-IN')}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={sc.cls}>{sc.label}</span>
                  {needsConfirm && (
                    <button onClick={() => confirm(r.id)} disabled={confirming[r.id]} className="btn-success text-sm">
                      {confirming[r.id] ? '...' : '✓ Confirm Receipt'}
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
