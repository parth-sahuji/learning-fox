import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import AnimatedBackground from '../components/AnimatedBackground';
import TermsModal from './TermsModal';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'History',
  'Geography', 'Computer Science', 'Economics', 'Accounts', 'Business Studies', 'Sanskrit', 'Science'];
const LANGUAGES = ['Hindi', 'English', 'Marathi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Urdu', 'Punjabi'];
const CLASSES = ['1','2','3','4','5','6','7','8','9','10','11','12'];
const BOARDS = ['CBSE','ICSE','IGCSE','IB','Maharashtra State Board','UP Board','Bihar Board','MP Board','Other State Board'];
const DAYS = [1,2,3,4,5,6,7];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=role+basic, 2=details, 3=terms
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '', confirm: '',
    // Teacher
    subjects: [], languages: [], teach_class_from: '', teach_class_to: '',
    education: '', skills: '', bio: '',
    // Student
    class: '', subject_needs: [], school_board: '', days_per_week: '3', address: '', locality: '',
  });
  const [aadharFile, setAadharFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const aadharRef = useRef();
  const resumeRef = useRef();

  const toggleArr = (key, val) => setForm(f => ({
    ...f,
    [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
  }));

  const validateStep1 = () => {
    if (!form.full_name.trim()) return 'Full name is required.';
    if (!form.email.trim()) return 'Email is required.';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) return 'A valid 10-digit phone number is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    return null;
  };

  const validateStep2 = () => {
    if (role === 'teacher') {
      if (!aadharFile) return 'Aadhar card document is required.';
      if (!form.subjects.length) return 'Please select at least one subject you can teach.';
      if (!form.languages.length) return 'Please select at least one language.';
      if (!form.teach_class_from || !form.teach_class_to) return 'Please specify the class range you can teach.';
    } else {
      if (!form.class) return 'Please select your class.';
      if (!form.subject_needs.length) return 'Please select at least one subject you need help with.';
      if (!form.address.trim()) return 'Your address/locality is required.';
      if (!form.days_per_week) return 'Please specify how many days per week.';
    }
    return null;
  };

  const goToStep2 = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError('');
    setStep(2);
  };

  const goToStep3 = () => {
    const err = validateStep2();
    if (err) { setError(err); return; }
    setError('');
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!termsAccepted) { setError('Please accept the Terms & Conditions.'); return; }
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('full_name', form.full_name);
      fd.append('email', form.email);
      fd.append('phone', form.phone);
      fd.append('password', form.password);
      fd.append('role', role);
      fd.append('terms_accepted', 'true');

      if (role === 'teacher') {
        fd.append('subjects', form.subjects.join(', '));
        fd.append('languages', form.languages.join(', '));
        fd.append('teach_class_from', form.teach_class_from);
        fd.append('teach_class_to', form.teach_class_to);
        fd.append('education', form.education);
        fd.append('skills', form.skills);
        fd.append('bio', form.bio);
        if (aadharFile) fd.append('aadhar_doc', aadharFile);
        if (resumeFile) fd.append('resume_doc', resumeFile);
      } else {
        fd.append('class', form.class);
        fd.append('subject_needs', form.subject_needs.join(', '));
        fd.append('school_board', form.school_board);
        fd.append('days_per_week', form.days_per_week);
        fd.append('address', form.address);
        fd.append('locality', form.locality);
      }

      await api.post('/auth/register', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-primary)] relative">
      <AnimatedBackground />
      <div className="w-full max-w-md card text-center z-10 shadow-xl animate-slide-up">
        <img src="/fox-logo.png" alt="Learning Fox" className="w-20 h-20 mx-auto object-contain mb-3" />
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="font-display text-2xl font-extrabold text-[var(--text-primary)] mb-2">You're Registered!</h2>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
          Your account is pending admin approval. You'll receive a notification once it's activated — usually within 1–2 business days.
        </p>
        <button onClick={() => navigate('/login')} className="btn-primary w-full">Go to Login →</button>
      </div>
    </div>
  );

  const stepLabels = ['Basic Info', role === 'teacher' ? 'Teacher Details' : 'Student Details', 'Terms & Confirm'];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-primary)] relative">
      <AnimatedBackground />
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

      <div className="w-full max-w-xl relative z-10 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-6">
          <img src="/fox-logo.png" alt="Learning Fox" className="w-16 h-16 mx-auto object-contain mb-2" />
          <h1 className="font-display text-2xl font-extrabold text-[var(--text-primary)]">Join Learning Fox</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">India's best home tutor platform</p>
        </div>

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { v: 'student', icon: '🎓', label: 'I\'m a Student', sub: 'Need a home tutor' },
            { v: 'teacher', icon: '📚', label: 'I\'m a Teacher', sub: 'Want to teach' },
          ].map(r => (
            <button key={r.v} type="button" onClick={() => { setRole(r.v); setStep(1); setError(''); }}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${role === r.v
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30 shadow-md'
                : 'border-[var(--border)] hover:border-brand-300 bg-[var(--bg-card)]'}`}>
              <div className="text-2xl mb-1">{r.icon}</div>
              <div className="font-bold text-sm text-[var(--text-primary)]">{r.label}</div>
              <div className="text-xs text-[var(--text-secondary)]">{r.sub}</div>
            </button>
          ))}
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5">
          {stepLabels.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all
                ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-brand-500 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)]'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${step === i + 1 ? 'text-brand-500 font-bold' : 'text-[var(--text-secondary)]'}`}>{s}</span>
              {i < 2 && <div className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-emerald-500' : 'bg-[var(--border)]'}`} />}
            </div>
          ))}
        </div>

        <div className="card shadow-xl border-2 border-[var(--border)]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              ⚠️ {error}
            </div>
          )}

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">Full Name *</label>
                  <input type="text" className="input" placeholder="Your full name" required
                    value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Email Address *</label>
                  <input type="email" className="input" placeholder="you@example.com" required
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="label">📞 Phone Number * <span className="text-red-500 text-xs">(required)</span></label>
                  <input type="tel" className="input" placeholder="10-digit mobile number" required
                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Password *</label>
                  <input type="password" className="input" placeholder="Min 6 characters"
                    value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Confirm Password *</label>
                  <input type="password" className="input" placeholder="Repeat password"
                    value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
                </div>
              </div>
              <button type="button" onClick={goToStep2} className="btn-primary w-full mt-2">
                Continue → {role === 'teacher' ? 'Teacher Details' : 'Student Details'}
              </button>
            </div>
          )}

          {/* STEP 2: Teacher Details */}
          {step === 2 && role === 'teacher' && (
            <div className="space-y-5">
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">Teacher Details</h3>

              {/* Aadhar */}
              <div>
                <label className="label">🪪 Aadhar Card * <span className="text-red-500 text-xs">(required for verification)</span></label>
                <div onClick={() => aadharRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 cursor-pointer text-center transition-all
                    ${aadharFile ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20' : 'border-[var(--border)] hover:border-brand-400 hover:bg-[var(--bg-secondary)]'}`}>
                  <input ref={aadharRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => setAadharFile(e.target.files[0])} />
                  <div className="text-2xl mb-1">{aadharFile ? '✅' : '📄'}</div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {aadharFile ? aadharFile.name : 'Upload Aadhar Card (PDF or Image)'}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">Max 10MB · PDF, JPG, PNG</p>
                </div>
              </div>

              {/* Resume */}
              <div>
                <label className="label">📋 Resume / CV <span className="text-[var(--text-secondary)] text-xs font-normal">(optional)</span></label>
                <div onClick={() => resumeRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 cursor-pointer text-center transition-all
                    ${resumeFile ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20' : 'border-[var(--border)] hover:border-brand-400 hover:bg-[var(--bg-secondary)]'}`}>
                  <input ref={resumeRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => setResumeFile(e.target.files[0])} />
                  <div className="text-2xl mb-1">{resumeFile ? '✅' : '📎'}</div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {resumeFile ? resumeFile.name : 'Upload Resume / CV (Optional)'}
                  </p>
                </div>
              </div>

              {/* Subjects */}
              <div>
                <label className="label">📖 Subjects You Can Teach *</label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map(s => (
                    <button key={s} type="button" onClick={() => toggleArr('subjects', s)}
                      className={`text-xs px-3 py-1.5 rounded-full border-2 transition-all font-medium
                        ${form.subjects.includes(s) ? 'bg-brand-500 border-brand-500 text-white' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-400 bg-[var(--bg-secondary)]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Class range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Class From *</label>
                  <select className="input" value={form.teach_class_from} onChange={e => setForm(f => ({ ...f, teach_class_from: e.target.value }))}>
                    <option value="">From</option>
                    {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Class To *</label>
                  <select className="input" value={form.teach_class_to} onChange={e => setForm(f => ({ ...f, teach_class_to: e.target.value }))}>
                    <option value="">To</option>
                    {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="label">🗣️ Languages You Speak *</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(l => (
                    <button key={l} type="button" onClick={() => toggleArr('languages', l)}
                      className={`text-xs px-3 py-1.5 rounded-full border-2 transition-all font-medium
                        ${form.languages.includes(l) ? 'bg-purple-500 border-purple-500 text-white' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-purple-400 bg-[var(--bg-secondary)]'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Education & Bio */}
              <div>
                <label className="label">🎓 Education & Qualifications</label>
                <textarea className="input resize-none" rows={2}
                  placeholder="e.g. B.Sc. Mathematics, DU 2020 · M.Sc. Physics, IIT 2022"
                  value={form.education} onChange={e => setForm(f => ({ ...f, education: e.target.value }))} />
              </div>
              <div>
                <label className="label">About You (Bio)</label>
                <textarea className="input resize-none" rows={2}
                  placeholder="Brief introduction about your teaching style and experience..."
                  value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => { setStep(1); setError(''); }} className="btn-secondary flex-1">← Back</button>
                <button type="button" onClick={goToStep3} className="btn-primary flex-1">Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 2: Student Details */}
          {step === 2 && role === 'student' && (
            <div className="space-y-5">
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">Student Details</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">📚 My Class *</label>
                  <select className="input" value={form.class} onChange={e => setForm(f => ({ ...f, class: e.target.value }))}>
                    <option value="">Select class</option>
                    {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">School Board</label>
                  <select className="input" value={form.school_board} onChange={e => setForm(f => ({ ...f, school_board: e.target.value }))}>
                    <option value="">Select board</option>
                    {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              {/* Subjects needed */}
              <div>
                <label className="label">📖 Subjects I Need Help With *</label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map(s => (
                    <button key={s} type="button" onClick={() => toggleArr('subject_needs', s)}
                      className={`text-xs px-3 py-1.5 rounded-full border-2 transition-all font-medium
                        ${form.subject_needs.includes(s) ? 'bg-brand-500 border-brand-500 text-white' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-400 bg-[var(--bg-secondary)]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Days per week */}
              <div>
                <label className="label">📅 Days Per Week I Want Tuition *</label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS.map(d => (
                    <button key={d} type="button"
                      onClick={() => setForm(f => ({ ...f, days_per_week: String(d) }))}
                      className={`w-10 h-10 rounded-xl border-2 font-bold text-sm transition-all
                        ${form.days_per_week === String(d)
                          ? 'bg-brand-500 border-brand-500 text-white shadow-md'
                          : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-400 bg-[var(--bg-secondary)]'}`}>
                      {d}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Selected: {form.days_per_week} day(s) per week</p>
              </div>

              {/* Address */}
              <div>
                <label className="label">📍 Full Address / Locality * <span className="text-xs text-[var(--text-secondary)] font-normal">(for teacher matching)</span></label>
                <textarea className="input resize-none" rows={2}
                  placeholder="e.g. Flat 101, Sunshine Apartments, Kothrud, Pune 411038"
                  value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Area / Locality Name</label>
                <input type="text" className="input" placeholder="e.g. Kothrud, Pune"
                  value={form.locality} onChange={e => setForm(f => ({ ...f, locality: e.target.value }))} />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => { setStep(1); setError(''); }} className="btn-secondary flex-1">← Back</button>
                <button type="button" onClick={goToStep3} className="btn-primary flex-1">Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 3: Terms & Confirm */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">Terms & Confirmation</h3>

              {/* Summary */}
              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-1.5">
                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-2">Registration Summary</p>
                <p className="text-sm text-[var(--text-primary)]"><span className="font-semibold">Name:</span> {form.full_name}</p>
                <p className="text-sm text-[var(--text-primary)]"><span className="font-semibold">Email:</span> {form.email}</p>
                <p className="text-sm text-[var(--text-primary)]"><span className="font-semibold">Phone:</span> {form.phone}</p>
                <p className="text-sm text-[var(--text-primary)]"><span className="font-semibold">Role:</span> {role === 'teacher' ? '📚 Teacher' : '🎓 Student'}</p>
                {role === 'teacher' && <>
                  <p className="text-sm text-[var(--text-primary)]"><span className="font-semibold">Subjects:</span> {form.subjects.join(', ')}</p>
                  <p className="text-sm text-[var(--text-primary)]"><span className="font-semibold">Classes:</span> {form.teach_class_from}–{form.teach_class_to}</p>
                  <p className="text-sm text-[var(--text-primary)]"><span className="font-semibold">Languages:</span> {form.languages.join(', ')}</p>
                </>}
                {role === 'student' && <>
                  <p className="text-sm text-[var(--text-primary)]"><span className="font-semibold">Class:</span> {form.class}</p>
                  <p className="text-sm text-[var(--text-primary)]"><span className="font-semibold">Subjects Needed:</span> {form.subject_needs.join(', ')}</p>
                  <p className="text-sm text-[var(--text-primary)]"><span className="font-semibold">Days/Week:</span> {form.days_per_week}</p>
                </>}
              </div>

              {/* T&C box */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-700">
                <p className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-3">⚠️ Important — Please Read</p>
                <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1.5 mb-3">
                  <li>• Learning Fox is NOT responsible for offline arrangements made outside this platform.</li>
                  <li>• If teacher and student make direct contact offline, the platform bears NO responsibility.</li>
                  <li>• If any monthly fee is skipped, the platform owner is NOT responsible.</li>
                  <li>• All fee payments must be confirmed through this platform.</li>
                </ul>
                <button type="button" onClick={() => setShowTerms(true)}
                  className="text-xs text-brand-600 dark:text-brand-400 font-bold underline">
                  Read full Terms & Conditions →
                </button>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="sr-only" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
                  <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center
                    ${termsAccepted ? 'bg-brand-500 border-brand-500' : 'border-[var(--border)] bg-[var(--bg-secondary)] group-hover:border-brand-400'}`}>
                    {termsAccepted && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                  </div>
                </div>
                <span className="text-sm text-[var(--text-primary)] leading-relaxed">
                  I have read and agree to the <button type="button" onClick={() => setShowTerms(true)} className="text-brand-500 font-bold underline">Terms & Conditions</button> of Learning Fox. I understand that the platform is not responsible for offline arrangements or missed payments.
                </span>
              </label>

              <div className="flex gap-3">
                <button type="button" onClick={() => { setStep(2); setError(''); }} className="btn-secondary flex-1">← Back</button>
                <button type="button" onClick={handleSubmit} disabled={loading || !termsAccepted}
                  className="btn-primary flex-1 disabled:opacity-50">
                  {loading ? 'Registering...' : '🦊 Complete Registration'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-500 font-bold hover:text-brand-600">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
