import { useState, useEffect } from 'react';
import api from '../../api';

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState({});
  const [toast, setToast] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/student/dashboard').then(r => setAssignments(r.data.assignments)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const confirmPayment = async (feeId) => {
    if (!window.confirm('Confirm that you have made the offline payment to your teacher?')) return;
    setConfirming(c => ({ ...c, [feeId]: true }));
    try {
      await api.post(`/student/fees/${feeId}/confirm`);
      showToast('Payment confirmed! Your teacher will now verify and confirm receipt.');
      load();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed.', 'error');
    } finally {
      setConfirming(c => ({ ...c, [feeId]: false }));
    }
  };

  const feeDisplay = (a) => {
    if (!a.latest_fee_id) return null;
    if (a.teacher_confirmed && a.student_confirmed)
      return { icon: '✅', text: `Fee cleared for ${a.latest_fee_month}`, cls: 'text-emerald-600 dark:text-emerald-400', canPay: false };
    if (a.student_confirmed)
      return { icon: '⏳', text: 'Waiting for teacher to confirm receipt', cls: 'text-blue-600 dark:text-blue-400', canPay: false };
    return { icon: '🔔', text: `Fee due for ${a.latest_fee_month} — pay your teacher offline then confirm below`, cls: 'text-amber-600 dark:text-amber-400', canPay: true };
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {toast && (
        <div className={`fixed top-16 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white
          ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} animate-slide-up`}>
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="page-title">My Dashboard</h1>
        <p className="page-subtitle">Your assigned teacher and session details</p>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(2)].map((_, i) => <div key={i} className="card shimmer h-64" />)}</div>
      ) : assignments.length === 0 ? (
        <div className="card text-center py-20 max-w-lg mx-auto">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)] mb-2">No Teacher Assigned Yet</h2>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
            The admin will assign a teacher to you shortly. Once assigned, your teacher's details and session info will appear here.
          </p>
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-left">
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">While you wait</p>
            <ul className="text-sm text-[var(--text-secondary)] space-y-1">
              <li>✓ Complete your profile with your class and subjects</li>
              <li>✓ Make sure your address is up to date</li>
              <li>✓ Contact support if it's been more than 2 days</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {assignments.map(a => {
            const fee = feeDisplay(a);
            return (
              <div key={a.assignment_id} className="space-y-4">
                {/* Teacher card — contact details hidden */}
                <div className="card">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700
                                      text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                        {a.teacher_name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">{a.teacher_name}</h2>
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                            Your Teacher
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 italic">
                          🔒 Contact details are managed by the admin for your privacy
                        </p>
                      </div>
                    </div>

                    <div className="sm:ml-auto flex flex-col gap-2 sm:items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--text-secondary)]">Subject:</span>
                        <span className="px-2.5 py-1 rounded-lg bg-brand-100 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 text-sm font-semibold">
                          {a.subject}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--text-secondary)]">Monthly Fee:</span>
                        <span className="text-lg font-bold font-display text-emerald-600 dark:text-emerald-400">
                          ₹{parseFloat(a.monthly_fee || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--text-secondary)]">Since:</span>
                        <span className="text-xs text-[var(--text-primary)]">
                          {new Date(a.assigned_on).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {a.bio && (
                    <div className="mt-4 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                      <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">About Teacher</p>
                      <p className="text-sm text-[var(--text-primary)] leading-relaxed">{a.bio}</p>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {a.education && (
                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                        <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">🎓 Education</p>
                        <p className="text-sm text-[var(--text-primary)] whitespace-pre-line">{a.education}</p>
                      </div>
                    )}
                    {a.skills && (
                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                        <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">⚡ Skills</p>
                        <p className="text-sm text-[var(--text-primary)]">{a.skills}</p>
                      </div>
                    )}
                    {a.languages && (
                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                        <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">🗣️ Languages</p>
                        <p className="text-sm text-[var(--text-primary)]">{a.languages}</p>
                      </div>
                    )}
                    {(a.class_from || a.class_to) && (
                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                        <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">📚 Teaches</p>
                        <p className="text-sm text-[var(--text-primary)]">Class {a.class_from} to {a.class_to}</p>
                      </div>
                    )}
                  </div>

                  {Array.isArray(a.available_slots) && a.available_slots.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">🕐 Available Slots</p>
                      <div className="flex flex-wrap gap-2">
                        {(a.available_slots || []).map((slot, i) => (
                          <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-brand-100 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                            {slot.day} · {slot.from}–{slot.to}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fee payment card */}
                {fee && (
                  <div className={`card border-2 ${fee.canPay ? 'border-amber-400' : 'border-[var(--border)]'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">Monthly Fee Payment</p>
                        <p className={`text-sm mt-0.5 ${fee.cls}`}>{fee.icon} {fee.text}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${a.student_confirmed ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                            <span className="text-xs text-[var(--text-secondary)]">You confirmed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${a.teacher_confirmed ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                            <span className="text-xs text-[var(--text-secondary)]">Teacher confirmed</span>
                          </div>
                        </div>
                      </div>
                      {fee.canPay && (
                        <button
                          onClick={() => confirmPayment(a.latest_fee_id)}
                          disabled={confirming[a.latest_fee_id]}
                          className="btn-primary flex-shrink-0 flex items-center gap-2"
                        >
                          {confirming[a.latest_fee_id] ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                              </svg>
                              Confirming...
                            </span>
                          ) : '💸 I have paid fees'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
