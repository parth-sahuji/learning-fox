import { useState, useEffect } from 'react';
import api from '../../api';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editFee, setEditFee] = useState({}); // { [id]: value }
  const [saving, setSaving] = useState({});
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const load = () => {
    setLoading(true);
    api.get('/admin/assignments').then(r => setAssignments(r.data.assignments)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveFee = async (id) => {
    const fee = parseFloat(editFee[id]);
    if (isNaN(fee) || fee < 0) return;
    setSaving(s => ({ ...s, [id]: true }));
    try {
      await api.put(`/admin/assignments/${id}/fee`, { monthly_fee: fee });
      setAssignments(a => a.map(x => x.id === id ? { ...x, monthly_fee: fee } : x));
      setEditFee(e => { const c = { ...e }; delete c[id]; return c; });
      showToast('Fee updated successfully.');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update fee.', 'error');
    } finally {
      setSaving(s => ({ ...s, [id]: false }));
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/admin/assignments/${id}/status`, { status });
      setAssignments(a => a.map(x => x.id === id ? { ...x, status } : x));
      showToast(`Assignment ${status}.`);
    } catch {
      showToast('Status change failed.', 'error');
    }
  };

  const filtered = assignments.filter(a => {
    const matchSearch = !search ||
      a.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.teacher_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.subject?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusBadge = s => ({
    active: 'badge-approved',
    paused: 'badge-pending',
    terminated: 'badge-rejected',
  }[s] || 'badge-pending');

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className={`fixed top-12 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white
          ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} animate-slide-up`}>
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Assignments</h1>
          <p className="page-subtitle">Manage all student-teacher pairings and fees</p>
        </div>
        <button onClick={load} className="btn-secondary text-sm self-start">↻ Refresh</button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          className="input sm:max-w-xs"
          placeholder="Search student, teacher, subject..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="input sm:max-w-[160px]" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="card shimmer h-24" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-3">📋</div>
          <p className="font-semibold text-[var(--text-primary)]">No assignments found</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {assignments.length === 0 ? 'Use the Matcher to create your first assignment.' : 'Try adjusting your search filters.'}
          </p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--bg-secondary)]">
                <tr>
                  {['Student', 'Teacher', 'Subject', 'Monthly Fee', 'Status', 'Actions'].map(h => (
                    <th key={h} className="table-header text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium text-[var(--text-primary)]">{a.student_name}</div>
                      <div className="text-xs text-[var(--text-secondary)]">{a.student_email}</div>
                      {a.class && <div className="text-xs text-[var(--text-secondary)]">Class {a.class} · {a.school_board}</div>}
                    </td>
                    <td className="table-cell">
                      <div className="font-medium text-[var(--text-primary)]">{a.teacher_name}</div>
                      <div className="text-xs text-[var(--text-secondary)]">{a.teacher_email}</div>
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-1 rounded-lg bg-brand-100 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 text-xs font-medium">
                        {a.subject}
                      </span>
                    </td>
                    <td className="table-cell">
                      {editFee[a.id] !== undefined ? (
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-sm">₹</span>
                            <input
                              type="number"
                              className="input pl-6 w-28 py-1.5 text-sm"
                              value={editFee[a.id]}
                              min="0"
                              step="100"
                              onChange={e => setEditFee(f => ({ ...f, [a.id]: e.target.value }))}
                            />
                          </div>
                          <button onClick={() => saveFee(a.id)} disabled={saving[a.id]}
                            className="text-xs btn-success px-2 py-1.5">
                            {saving[a.id] ? '...' : '✓'}
                          </button>
                          <button onClick={() => setEditFee(f => { const c = { ...f }; delete c[a.id]; return c; })}
                            className="text-xs btn-secondary px-2 py-1.5">✕</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditFee(f => ({ ...f, [a.id]: a.monthly_fee }))}
                          className="flex items-center gap-1.5 group hover:text-brand-500 transition-colors"
                          title="Click to edit fee"
                        >
                          <span className="font-semibold text-[var(--text-primary)]">
                            ₹{parseFloat(a.monthly_fee).toLocaleString('en-IN')}
                          </span>
                          <svg className="w-3 h-3 text-[var(--text-secondary)] group-hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      )}
                    </td>
                    <td className="table-cell">
                      <span className={statusBadge(a.status)}>{a.status}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1.5">
                        {a.status !== 'active' && (
                          <button onClick={() => changeStatus(a.id, 'active')}
                            className="text-xs px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 transition-colors">
                            Activate
                          </button>
                        )}
                        {a.status === 'active' && (
                          <button onClick={() => changeStatus(a.id, 'paused')}
                            className="text-xs px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 transition-colors">
                            Pause
                          </button>
                        )}
                        {a.status !== 'terminated' && (
                          <button onClick={() => { if (window.confirm('Terminate this assignment?')) changeStatus(a.id, 'terminated'); }}
                            className="text-xs px-2 py-1 rounded-lg bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 hover:bg-red-200 transition-colors">
                            End
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[var(--border)] text-xs text-[var(--text-secondary)]">
            Showing {filtered.length} of {assignments.length} assignments · Click fee amount to edit
          </div>
        </div>
      )}
    </div>
  );
}
