import { useState, useEffect } from 'react';
import api from '../../api';

export default function TeacherDashboard() {
  const [data, setData] = useState({ students: [], total_students: 0, pending_confirmations: [] });
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState({});
  const [toast, setToast] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/teacher/dashboard').then(r => setData(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const confirmFee = async (feeId) => {
    setConfirming(c => ({ ...c, [feeId]: true }));
    try {
      await api.post(`/teacher/fees/${feeId}/confirm`);
      showToast('Fee receipt confirmed! Marked as cleared.');
      load();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed.', 'error');
    } finally {
      setConfirming(c => ({ ...c, [feeId]: false }));
    }
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
        <h1 className="page-title">Teacher Dashboard</h1>
        <p className="page-subtitle">Your assigned students and fee confirmations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card">
          <div className="stat-icon mb-3 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-2xl">👥</div>
          <div className="text-2xl font-bold font-display text-[var(--text-primary)]">{data.total_students}</div>
          <div className="text-xs text-[var(--text-secondary)] mt-0.5">Assigned Students</div>
        </div>
        <div className={`card ${data.pending_confirmations.length > 0 ? 'ring-2 ring-amber-400' : ''}`}>
          <div className="stat-icon mb-3 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-2xl">🔔</div>
          <div className="text-2xl font-bold font-display text-[var(--text-primary)]">{data.pending_confirmations.length}</div>
          <div className="text-xs text-[var(--text-secondary)] mt-0.5">Pending Fee Confirmations</div>
        </div>
      </div>

      {/* Fee amount notice */}
      <div className="card py-3 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
          <strong>Note:</strong> Fee amounts are set and managed by the platform admin. Your role is simply to confirm when you have received payment from the student.
        </p>
      </div>

      {/* Pending confirmations */}
      {data.pending_confirmations.length > 0 && (
        <div className="card border-2 border-amber-400 dark:border-amber-500">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl animate-pulse-soft">🔔</span>
            <h2 className="font-semibold text-[var(--text-primary)]">Action Required — Confirm Fee Receipts</h2>
            <span className="ml-auto badge-pending">{data.pending_confirmations.length} pending</span>
          </div>
          <div className="space-y-3">
            {data.pending_confirmations.map(r => (
              <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3
                                        p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{r.student_name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{r.subject} · <span className="font-mono">{r.month_year}</span></p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Student confirmed they made the payment</p>
                </div>
                <button
                  onClick={() => confirmFee(r.id)}
                  disabled={confirming[r.id]}
                  className="btn-success text-sm whitespace-nowrap flex-shrink-0"
                >
                  {confirming[r.id] ? 'Confirming...' : '✓ I have received fees'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Students list */}
      <div>
        <h2 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          My Students
          <span className="text-xs text-[var(--text-secondary)] font-normal">({data.students.length})</span>
        </h2>

        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="card shimmer h-28" />)}</div>
        ) : data.students.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-5xl mb-3">👥</div>
            <p className="font-semibold text-[var(--text-primary)]">No students assigned yet</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">The admin will assign students to you shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.students.map(s => {
              const feeStudentPaid = s.latest_fee_status === 'student_paid';
              const feePending = s.latest_fee_status === 'pending';
              return (
                <div key={s.assignment_id} className={`card hover:shadow-md transition-shadow ${feeStudentPaid ? 'ring-2 ring-blue-400' : ''}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold flex-shrink-0">
                      {s.full_name[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--text-primary)] truncate">{s.full_name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">Class {s.class} · {s.school_board}</p>
                      {s.days_per_week && <p className="text-xs text-[var(--text-secondary)]">{s.days_per_week} days/week</p>}
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-[var(--text-secondary)]">Subject</span>
                      <span className="text-xs font-medium px-2 py-0.5 bg-brand-100 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 rounded">
                        {s.subject}
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[var(--border)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--text-secondary)]">{s.latest_fee_month || 'No fee record'}</span>
                      <span className={`text-xs font-medium ${
                        feeStudentPaid ? 'text-blue-600 dark:text-blue-400'
                        : feePending ? 'text-amber-600 dark:text-amber-400'
                        : s.latest_fee_status === 'cleared' ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-[var(--text-secondary)]'}`}>
                        {feeStudentPaid ? '💰 Paid — Confirm!' : feePending ? '⏳ Fee Due' : s.latest_fee_status === 'cleared' ? '✅ Cleared' : '—'}
                      </span>
                    </div>
                    {feeStudentPaid && (
                      <button
                        onClick={() => confirmFee(s.latest_fee_id)}
                        disabled={confirming[s.latest_fee_id]}
                        className="btn-success text-xs w-full mt-2 py-2"
                      >
                        {confirming[s.latest_fee_id] ? '...' : '✓ Confirm Receipt'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
