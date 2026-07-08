import { useState, useEffect } from 'react';
import api from '../../api';

export default function Vetting() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [selected, setSelected] = useState(null); // user details panel
  const [toast, setToast] = useState(null);
  const [queueTab, setQueueTab] = useState('teacher'); // 'teacher' | 'student'

  const teacherQueue = users.filter(u => u.role === 'teacher');
  const studentQueue = users.filter(u => u.role === 'student');
  const visibleUsers = queueTab === 'teacher' ? teacherQueue : studentQueue;

  const load = () => {
    setLoading(true);
    api.get('/admin/pending').then(r => setUsers(r.data.users)).finally(() => setLoading(false));
  };

  // Load full profile when a user is selected
  const loadProfile = async (user) => {
    setSelected({ ...user, loading: true });
    try {
      // Fetch the full profile depending on role
      const endpoint = user.role === 'teacher'
        ? `/admin/user-profile/${user.id}`
        : `/admin/user-profile/${user.id}`;
      const r = await api.get(`/admin/user-profile/${user.id}`);
      setSelected({ ...user, profile: r.data.profile, loading: false });
    } catch {
      setSelected({ ...user, loading: false });
    }
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const action = async (id, act) => {
    setProcessing(p => ({ ...p, [id]: true }));
    try {
      await api.put(`/admin/users/${id}/${act}`);
      setUsers(u => u.filter(x => x.id !== id));
      if (selected?.id === id) setSelected(null);
      showToast(`User ${act === 'approve' ? 'approved ✅' : 'rejected ❌'} successfully.`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Action failed.', 'error');
    } finally {
      setProcessing(p => ({ ...p, [id]: false }));
    }
  };

  // filename is now a full Cloudinary URL
  const DocLink = ({ filename, label }) => {
    if (!filename) return <span className="text-[var(--text-secondary)] text-xs">Not uploaded</span>;
    return (
      <a
        href={filename}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-900/30
                   text-amber-300 border border-amber-700/40 text-xs font-semibold hover:bg-amber-800/40 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View {label}
      </a>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className={`fixed top-16 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white
          ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} animate-slide-up`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Vetting Queue</h1>
          <p className="page-subtitle">Review registrations — click any card to see full details & documents</p>
        </div>
        <button onClick={load} className="btn-secondary text-sm">↻ Refresh</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Queue list */}
        <div className="space-y-3">
          <div className="flex gap-2 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
            <button
              onClick={() => setQueueTab('teacher')}
              className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-colors
                ${queueTab === 'teacher'
                  ? 'bg-purple-600 text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              👩‍🏫 Teachers ({teacherQueue.length})
            </button>
            <button
              onClick={() => setQueueTab('student')}
              className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-colors
                ${queueTab === 'student'
                  ? 'bg-blue-600 text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              🎓 Students ({studentQueue.length})
            </button>
          </div>

          {loading ? (
            [...Array(3)].map((_, i) => <div key={i} className="card shimmer h-24" />)
          ) : visibleUsers.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-5xl mb-3">✅</div>
              <p className="font-semibold text-[var(--text-primary)]">All caught up!</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                No pending {queueTab === 'teacher' ? 'teacher' : 'student'} registrations.
              </p>
            </div>
          ) : (
            visibleUsers.map(u => (
              <div
                key={u.id}
                onClick={() => loadProfile(u)}
                className={`card cursor-pointer transition-all hover:shadow-md
                  ${selected?.id === u.id ? 'ring-2 ring-brand-400 shadow-md' : ''}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0
                      ${u.role === 'teacher'
                        ? 'bg-gradient-to-br from-purple-500 to-purple-700'
                        : 'bg-gradient-to-br from-blue-500 to-blue-700'}`}>
                      {u.full_name[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--text-primary)] truncate">{u.full_name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0
                          ${u.role === 'teacher'
                            ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
                            : 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'}`}>
                          {u.role}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] truncate">{u.email}</p>
                      <p className="text-xs text-[var(--text-secondary)]/60">
                        {new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-[var(--text-secondary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT: Detail panel */}
        <div>
          {!selected ? (
            <div className="card text-center py-20 border-2 border-dashed border-[var(--border)]">
              <div className="text-4xl mb-3 opacity-40">👆</div>
              <p className="font-semibold text-[var(--text-primary)]">Select a user</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Click any card on the left to view their full details and documents</p>
            </div>
          ) : (
            <div className="card space-y-5 animate-slide-up">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0
                    ${selected.role === 'teacher'
                      ? 'bg-gradient-to-br from-purple-500 to-purple-700'
                      : 'bg-gradient-to-br from-blue-500 to-blue-700'}`}>
                    {selected.full_name[0].toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">{selected.full_name}</h2>
                    <p className="text-sm text-[var(--text-secondary)]">{selected.email}</p>
                    {selected.phone && <p className="text-sm text-[var(--text-secondary)]">📞 {selected.phone}</p>}
                  </div>
                </div>
                <button onClick={() => setSelected(null)}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1">✕</button>
              </div>

              {selected.loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => <div key={i} className="shimmer h-10 rounded-xl" />)}
                </div>
              ) : (
                <>
                  {/* Teacher-specific fields */}
                  {selected.role === 'teacher' && selected.profile && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Professional Details</h3>

                      <div className="grid grid-cols-2 gap-3">
                        {selected.profile.class_from && (
                          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                            <p className="text-xs text-[var(--text-secondary)] mb-0.5">Can Teach</p>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">
                              Class {selected.profile.class_from} to {selected.profile.class_to}
                            </p>
                          </div>
                        )}
                        {selected.profile.languages && (
                          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                            <p className="text-xs text-[var(--text-secondary)] mb-0.5">Languages</p>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">{selected.profile.languages}</p>
                          </div>
                        )}
                      </div>

                      {selected.profile.subjects_taught && (
                        <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                          <p className="text-xs text-[var(--text-secondary)] mb-1">Subjects</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selected.profile.subjects_taught.split(',').map((s, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 rounded-lg bg-brand-100 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 font-medium">
                                {s.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Documents */}
                      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-3">
                          📎 Submitted Documents
                        </p>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--text-primary)]">🪪 Aadhar Card</span>
                            <DocLink filename={selected.profile.aadhar_doc} label="Aadhar" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--text-primary)]">📄 Resume / CV</span>
                            <DocLink filename={selected.profile.resume_doc} label="Resume" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Student-specific fields */}
                  {selected.role === 'student' && selected.profile && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Student Details</h3>

                      <div className="grid grid-cols-2 gap-3">
                        {selected.profile.class && (
                          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                            <p className="text-xs text-[var(--text-secondary)] mb-0.5">Class</p>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">Class {selected.profile.class}</p>
                          </div>
                        )}
                        {selected.profile.school_board && (
                          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                            <p className="text-xs text-[var(--text-secondary)] mb-0.5">Board</p>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">{selected.profile.school_board}</p>
                          </div>
                        )}
                        {selected.profile.days_per_week && (
                          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                            <p className="text-xs text-[var(--text-secondary)] mb-0.5">Days/Week</p>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">{selected.profile.days_per_week} days</p>
                          </div>
                        )}
                      </div>

                      {selected.profile.subjects && (
                        <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                          <p className="text-xs text-[var(--text-secondary)] mb-1">Subjects Needed</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selected.profile.subjects.split(',').map((s, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 rounded-lg bg-brand-100 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 font-medium">
                                {s.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selected.profile.address && (
                        <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                          <p className="text-xs text-[var(--text-secondary)] mb-0.5">📍 Address</p>
                          <p className="text-sm text-[var(--text-primary)]">{selected.profile.address}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* If profile didn't load */}
                  {!selected.profile && (
                    <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
                      <p className="text-sm text-[var(--text-secondary)]">Profile details not available</p>
                    </div>
                  )}
                </>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2 border-t border-[var(--border)]">
                <button
                  onClick={() => action(selected.id, 'reject')}
                  disabled={processing[selected.id]}
                  className="btn-danger flex-1 disabled:opacity-50"
                >
                  {processing[selected.id] ? '...' : '✕ Reject'}
                </button>
                <button
                  onClick={() => action(selected.id, 'approve')}
                  disabled={processing[selected.id]}
                  className="btn-success flex-1 disabled:opacity-50"
                >
                  {processing[selected.id] ? '...' : '✓ Approve'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
