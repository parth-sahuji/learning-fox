import { useState, useEffect } from 'react';
import api from '../../api';

export default function AdminFees() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggerMonth, setTriggerMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [triggering, setTriggering] = useState(false);
  const [toast, setToast] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/admin/fees').then(r => setRecords(r.data.fee_records)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const triggerFees = async () => {
    if (!triggerMonth) return;
    setTriggering(true);
    try {
      const r = await api.post('/admin/fees/trigger', { month_year: triggerMonth });
      showToast(r.data.message);
      load();
    } catch (err) {
      showToast(err.response?.data?.error || 'Trigger failed.', 'error');
    } finally {
      setTriggering(false);
    }
  };

  const filtered = records.filter(r => {
    const matchSearch = !search ||
      r.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.teacher_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.subject?.toLowerCase().includes(search.toLowerCase()) ||
      r.month_year?.includes(search);
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusConfig = {
    pending: { badge: 'badge-pending', icon: '⏳', label: 'Pending' },
    student_paid: { badge: 'badge-pending', icon: '💰', label: 'Student Paid' },
    cleared: { badge: 'badge-cleared', icon: '✅', label: 'Cleared' },
    overdue: { badge: 'badge-rejected', icon: '🚨', label: 'Overdue' },
  };

  const summaryStats = {
    total: records.length,
    pending: records.filter(r => r.status === 'pending').length,
    student_paid: records.filter(r => r.status === 'student_paid').length,
    cleared: records.filter(r => r.status === 'cleared').length,
    total_amount: records.filter(r => r.status === 'cleared').reduce((s, r) => s + parseFloat(r.monthly_fee || 0), 0),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className={`fixed top-12 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white
          ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} animate-slide-up`}>
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="page-title">Fee Records</h1>
        <p className="page-subtitle">Financial control — monitor all payments across assignments</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Records', value: summaryStats.total, color: 'text-[var(--text-primary)]' },
          { label: 'Pending', value: summaryStats.pending, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Awaiting Teacher', value: summaryStats.student_paid, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Cleared', value: summaryStats.cleared, color: 'text-emerald-600 dark:text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="card py-4 text-center">
            <div className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</div>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Trigger panel */}
      <div className="card border-2 border-brand-200 dark:border-brand-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950/40 flex items-center justify-center text-xl">
              📅
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--text-primary)] text-sm">Monthly Fee Trigger</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Manually trigger Payment Pending for a month (auto-runs on the 30th via cron). Creates fee records for all active assignments and notifies students.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <input
              type="month"
              className="input py-2 text-sm w-36"
              value={triggerMonth}
              onChange={e => setTriggerMonth(e.target.value)}
            />
            <button onClick={triggerFees} disabled={triggering} className="btn-primary text-sm whitespace-nowrap">
              {triggering ? 'Triggering...' : '▶ Trigger'}
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" className="input sm:max-w-xs" placeholder="Search student, teacher, subject..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input sm:max-w-[180px]" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="student_paid">Student Paid</option>
          <option value="cleared">Cleared</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="card shimmer h-16" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-3">₹</div>
          <p className="font-semibold text-[var(--text-primary)]">No fee records found</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Use the trigger above to generate records for the current month.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--bg-secondary)]">
                <tr>
                  {['Month', 'Student', 'Teacher', 'Subject', 'Fee', 'Student', 'Teacher', 'Status'].map((h, i) => (
                    <th key={i} className="table-header text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const sc = statusConfig[r.status] || statusConfig.pending;
                  return (
                    <tr key={r.id} className="table-row">
                      <td className="table-cell">
                        <span className="font-mono text-sm font-medium text-[var(--text-primary)]">{r.month_year}</span>
                      </td>
                      <td className="table-cell text-[var(--text-primary)]">{r.student_name}</td>
                      <td className="table-cell text-[var(--text-primary)]">{r.teacher_name}</td>
                      <td className="table-cell">
                        <span className="px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 text-xs">
                          {r.subject}
                        </span>
                      </td>
                      <td className="table-cell font-semibold text-[var(--text-primary)]">
                        ₹{parseFloat(r.monthly_fee).toLocaleString('en-IN')}
                      </td>
                      <td className="table-cell">
                        {r.student_confirmed ? (
                          <span className="text-emerald-500 text-sm font-medium">✓ Confirmed</span>
                        ) : (
                          <span className="text-[var(--text-secondary)] text-sm">Pending</span>
                        )}
                      </td>
                      <td className="table-cell">
                        {r.teacher_confirmed ? (
                          <span className="text-emerald-500 text-sm font-medium">✓ Confirmed</span>
                        ) : (
                          <span className="text-[var(--text-secondary)] text-sm">Pending</span>
                        )}
                      </td>
                      <td className="table-cell">
                        <span className={sc.badge}>{sc.icon} {sc.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Showing {filtered.length} of {records.length} records</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Total Cleared: ₹{summaryStats.total_amount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
