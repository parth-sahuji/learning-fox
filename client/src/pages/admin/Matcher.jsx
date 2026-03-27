import { useState, useEffect } from 'react';
import api from '../../api';

const SUBJECTS = ['All Subjects', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'History', 'Geography', 'Computer Science', 'Economics', 'Accounts', 'Business Studies', 'Sanskrit', 'Science', 'Other'];

export default function Matcher() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ student_id: '', teacher_id: '', subject: '', monthly_fee: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/admin/users?role=student'),
      api.get('/admin/users?role=teacher'),
    ]).then(([s, t]) => {
      setStudents(s.data.users);
      setTeachers(t.data.users);
    }).finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.student_id || !form.teacher_id || !form.subject) {
      return setError('Please fill all required fields.');
    }
    setSubmitting(true);
    try {
      await api.post('/admin/assignments', {
        student_id: parseInt(form.student_id),
        teacher_id: parseInt(form.teacher_id),
        subject: form.subject,
        monthly_fee: parseFloat(form.monthly_fee) || 0,
      });
      showToast('Assignment created successfully! Both parties have been notified.');
      setForm({ student_id: '', teacher_id: '', subject: '', monthly_fee: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedStudent = students.find(s => s.id === parseInt(form.student_id));
  const selectedTeacher = teachers.find(t => t.id === parseInt(form.teacher_id));

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className={`fixed top-12 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white
          ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} animate-slide-up`}>
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="page-title">Assign Teachers</h1>
        <p className="page-subtitle">The Matcher — link a student to a teacher for a subject</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card">
          <h2 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-brand-500 text-white flex items-center justify-center text-xs">🔗</span>
            Create New Assignment
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="shimmer h-12 rounded-xl" />)}</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Select Student *</label>
                <select className="input" value={form.student_id} onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))} required>
                  <option value="">— Choose a student —</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.full_name} ({s.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Select Teacher *</label>
                <select className="input" value={form.teacher_id} onChange={e => setForm(f => ({ ...f, teacher_id: e.target.value }))} required>
                  <option value="">— Choose a teacher —</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.full_name} ({t.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Subject *</label>
                <select className="input" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required>
                  <option value="">— Select subject —</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="label">Monthly Fee (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] font-medium">₹</span>
                  <input type="number" className="input pl-7" placeholder="e.g. 2500"
                    value={form.monthly_fee} min="0" step="100"
                    onChange={e => setForm(f => ({ ...f, monthly_fee: e.target.value }))} required />
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Only admin can set and change this fee.</p>
              </div>

              <button type="submit" className="btn-primary w-full" disabled={submitting}>
                {submitting ? 'Creating assignment...' : '🔗 Create Assignment'}
              </button>
            </form>
          )}
        </div>

        {/* Preview card */}
        <div className="card">
          <h2 className="font-semibold text-[var(--text-primary)] mb-4">Assignment Preview</h2>
          {!form.student_id && !form.teacher_id ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
              <div className="text-5xl mb-3 opacity-30">🔗</div>
              <p className="text-[var(--text-secondary)] text-sm">Select a student and teacher to preview the assignment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedStudent && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">Student</p>
                  <p className="font-semibold text-[var(--text-primary)]">{selectedStudent.full_name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedStudent.email}</p>
                </div>
              )}
              {form.subject && (
                <div className="flex items-center justify-center gap-2 text-[var(--text-secondary)]">
                  <div className="flex-1 h-px bg-[var(--border)]" />
                  <span className="text-sm font-medium px-2 py-1 bg-brand-100 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 rounded-lg">
                    {form.subject}
                  </span>
                  <div className="flex-1 h-px bg-[var(--border)]" />
                </div>
              )}
              {selectedTeacher && (
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900">
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1">Teacher</p>
                  <p className="font-semibold text-[var(--text-primary)]">{selectedTeacher.full_name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedTeacher.email}</p>
                </div>
              )}
              {form.monthly_fee && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-center">
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">Monthly Fee</p>
                  <p className="text-2xl font-bold font-display text-[var(--text-primary)]">₹{parseFloat(form.monthly_fee || 0).toLocaleString('en-IN')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
