import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import api from '../api';

const FLOAT_ICONS = ['📚','✏️','🔢','🧪','🌍','🎵','🚀','💡','🏆','⭐','🔬','📐'];

const SUBJECTS = ['Mathematics','Science','English','Hindi','Social Studies','Physics','Chemistry','Biology','History','Geography','Computer Science','Sanskrit','Economics','Accountancy','Business Studies'];
const BOARDS = ['CBSE','ICSE','State Board','IB','Cambridge','Others'];
const CLASSES = ['1','2','3','4','5','6','7','8','9','10','11','12'];

const Card = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ paddingTop: '80px' }}>
    <AnimatedBackground />
    <div className="w-full max-w-lg relative z-10" style={{ animation: 'slideUp 0.4s ease-out' }}>
      <div className="text-center mb-6">
        <img src="/fox-logo.png" alt="Learning Foxx" className="mx-auto object-contain"
          style={{ width: '110px', height: '110px', filter: 'drop-shadow(0 12px 32px rgba(239,117,32,0.5))', animation: 'floatIcon 3.5s ease-in-out infinite' }} />
        <h1 className="font-display text-3xl font-extrabold mt-2"
          style={{ background: 'linear-gradient(135deg, #f97316, #b94612)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Learning Foxx
        </h1>
      </div>

      <div className="card shadow-2xl" style={{ backdropFilter: 'blur(20px)', background: 'rgba(30,20,9,0.95)', border: '1px solid rgba(239,117,32,0.3)' }}>
        {children}
      </div>

      <p className="text-center text-sm text-[var(--text-secondary)] mt-4">
        Already have an account? <Link to="/login" className="text-brand-500 hover:text-brand-400 font-bold">Sign In</Link>
      </p>
    </div>
  </div>
);

const StepBar = ({ totalSteps, step }) => (
  <div className="flex items-center gap-2 mb-6">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-300"
        style={{ background: i < step ? 'linear-gradient(90deg,#f97316,#b94612)' : 'rgba(255,255,255,0.1)' }} />
    ))}
  </div>
);

const ErrorBox = ({ error }) => error ? (
  <div className="mb-4 p-3 bg-red-950/50 border border-red-700 rounded-xl text-sm text-red-400 flex items-start gap-2">
    <span className="flex-shrink-0">⚠️</span> {error}
  </div>
) : null;

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState('teacher'); // 'teacher' | 'student'
  const [step, setStep] = useState(1); // 1 = basic, 2 = profile, 3 = docs (teacher only)

  // Step 1 — common
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '', confirm_password: '',
  });

  // Step 2 — teacher
  const [teacherProfile, setTeacherProfile] = useState({
    education: '', skills: '', subjects: [], languages: '',
    teach_class_from: '1', teach_class_to: '12', bio: '',
  });

  // Step 2 — student
  const [studentProfile, setStudentProfile] = useState({
    class: '', subjects: [], school_board: '', locality: '', days_per_week: 3,
  });

  // Step 3 — docs (teacher)
  const [resumeFile, setResumeFile] = useState(null);
  const [aadharFile, setAadharFile] = useState(null);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const setF = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  const setTP = key => e => setTeacherProfile(p => ({ ...p, [key]: e.target.value }));
  const setSP = key => e => setStudentProfile(p => ({ ...p, [key]: e.target.value }));

  const toggleSubject = (list, setList, subj) => {
    setList(p => ({
      ...p,
      subjects: p.subjects.includes(subj)
        ? p.subjects.filter(s => s !== subj)
        : [...p.subjects, subj],
    }));
  };

  // ── Step 1 → 2 ──────────────────────────────────────────────────
  // Mirrors server/validation/schemas.js so bad input is caught here, not at final submit.
  const handleStep1 = e => {
    e.preventDefault();
    setError('');
    if (!/^[\p{L} .'-]+$/u.test(form.full_name.trim())) return setError("Name can only contain letters, spaces, and . ' -");
    const phoneDigits = form.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) return setError('A valid phone number is required.');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (form.password !== form.confirm_password) return setError('Passwords do not match.');
    setStep(2);
  };

  // ── Step 2 → 3 (teacher) or submit (student) ────────────────────
  const handleStep2 = e => {
    e.preventDefault();
    setError('');
    if (role === 'teacher') {
      if (!teacherProfile.subjects.length) return setError('Select at least one subject.');
      if (!teacherProfile.languages.trim()) return setError('Please specify languages you can speak.');
      setStep(3);
    } else {
      if (!studentProfile.subjects.length) return setError('Select at least one subject.');
      handleSubmit();
    }
  };

  // ── Final submit ─────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!termsAccepted) return setError('Please accept the Terms & Conditions.');
    setError('');
    setLoading(true);

    try {
      // 1. Register user
      const payload = {
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
        role,
        terms_accepted: true,
        ...(role === 'teacher' ? {
          education: teacherProfile.education,
          skills: teacherProfile.skills,
          subjects: teacherProfile.subjects.join(', '),
          languages: teacherProfile.languages,
          teach_class_from: teacherProfile.teach_class_from,
          teach_class_to: teacherProfile.teach_class_to,
          bio: teacherProfile.bio,
        } : {
          class: studentProfile.class,
          subjects: studentProfile.subjects.join(', '),
          school_board: studentProfile.school_board,
          locality: studentProfile.locality,
          days_per_week: Number(studentProfile.days_per_week),
        }),
      };

      const { data } = await api.post('/auth/register', payload);
      const token = data.token;
      localStorage.setItem('tutorapp_token', token);

      // 2. Upload docs (teacher) — non-blocking (account is already created; don't strand
      // the user on a form that would just hit "already registered" on resubmit), but we
      // do track and report failures instead of pretending the docs were saved.
      const docUploadErrors = [];
      if (role === 'teacher') {
        for (const [field, file] of [['resume_doc', resumeFile], ['aadhar_doc', aadharFile]]) {
          if (!file) continue;
          const fd = new FormData();
          fd.append(field, file);
          await api.post('/auth/upload-doc', fd, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
          }).catch(err => docUploadErrors.push(`${file.name}: ${err.response?.data?.error || 'upload failed'}`));
        }
      }

      navigate('/pending', { replace: true, state: { docUploadErrors } });
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.error || '';
      if (msg.toLowerCase().includes('already')) {
        setError('An account with this email already exists. Try logging in.');
      } else if (!err.response) {
        setError('Cannot connect to server. Please try again.');
      } else {
        setError(data?.details?.[0]?.message || msg || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = role === 'teacher' ? 3 : 2;

  // ════════════════════════════════════════════════════════════════
  // STEP 1 — Basic info
  // ════════════════════════════════════════════════════════════════
  if (step === 1) return (
    <Card>
      <h2 className="font-display text-2xl font-bold text-center text-[var(--text-primary)] mb-2">Create Account 🦊</h2>
      <p className="text-center text-sm text-[var(--text-secondary)] mb-5">Join Learning Foxx — it's free</p>
      <StepBar totalSteps={totalSteps} step={step} />

      {/* Role toggle */}
      <div className="flex gap-2 mb-6">
        {['teacher','student'].map(r => (
          <button key={r} type="button"
            onClick={() => setRole(r)}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm capitalize transition-all duration-200 ${role === r ? 'btn-primary' : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'}`}>
            {r === 'teacher' ? '👨‍🏫 I\'m a Teacher' : '🎓 I\'m a Student'}
          </button>
        ))}
      </div>

      <ErrorBox error={error} />

      <form onSubmit={handleStep1} className="space-y-4">
        <div>
          <label className="label">Full Name</label>
          <input className="input" placeholder="Your full name" value={form.full_name}
            onChange={setF('full_name')} required autoFocus />
        </div>
        <div>
          <label className="label">Email Address</label>
          <input type="email" className="input" placeholder="you@example.com" value={form.email}
            onChange={setF('email')} required />
        </div>
        <div>
          <label className="label">Phone Number</label>
          <input type="tel" className="input" placeholder="+91 98765 43210" value={form.phone}
            onChange={setF('phone')} required />
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input type={showPwd ? 'text' : 'password'} className="input pr-12"
              placeholder="Min 8 characters" value={form.password}
              onChange={setF('password')} required minLength={8} />
            <button type="button" onClick={() => setShowPwd(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lg select-none">
              {showPwd ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <div>
          <label className="label">Confirm Password</label>
          <input type="password" className="input" placeholder="Re-enter password"
            value={form.confirm_password} onChange={setF('confirm_password')} required />
        </div>

        <button type="submit" className="btn-primary w-full py-3 text-base mt-2">
          Continue →
        </button>
      </form>
    </Card>
  );

  // ════════════════════════════════════════════════════════════════
  // STEP 2 — Profile details
  // ════════════════════════════════════════════════════════════════
  if (step === 2) return (
    <Card>
      <h2 className="font-display text-2xl font-bold text-center text-[var(--text-primary)] mb-2">
        {role === 'teacher' ? '👨‍🏫 Teacher Profile' : '🎓 Student Profile'}
      </h2>
      <p className="text-center text-xs text-[var(--text-secondary)] mb-5">Tell us a bit more about you</p>
      <StepBar totalSteps={totalSteps} step={step} />
      <ErrorBox error={error} />

      <form onSubmit={handleStep2} className="space-y-4">
        {role === 'teacher' ? (
          <>
            <div>
              <label className="label">Highest Education</label>
              <input className="input" placeholder="e.g. B.Sc Mathematics, B.Ed" value={teacherProfile.education}
                onChange={setTP('education')} required />
            </div>
            <div>
              <label className="label">Skills / Expertise</label>
              <input className="input" placeholder="e.g. IIT JEE coaching, CBSE expert" value={teacherProfile.skills}
                onChange={setTP('skills')} />
            </div>
            <div>
              <label className="label">Subjects You Teach</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {SUBJECTS.map(s => (
                  <button key={s} type="button"
                    onClick={() => setTeacherProfile(p => ({
                      ...p,
                      subjects: p.subjects.includes(s) ? p.subjects.filter(x => x !== s) : [...p.subjects, s]
                    }))}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${teacherProfile.subjects.includes(s) ? 'bg-brand-500 border-brand-500 text-white' : 'border-white/20 text-[var(--text-secondary)] hover:border-brand-400'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Teach Class From</label>
                <select className="input" value={teacherProfile.teach_class_from} onChange={setTP('teach_class_from')}>
                  {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Teach Class To</label>
                <select className="input" value={teacherProfile.teach_class_to} onChange={setTP('teach_class_to')}>
                  {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Languages Known</label>
              <input className="input" placeholder="e.g. Hindi, English, Marathi" value={teacherProfile.languages}
                onChange={setTP('languages')} />
            </div>
            <div>
              <label className="label">Short Bio <span className="text-[var(--text-secondary)] font-normal">(optional)</span></label>
              <textarea className="input" rows={3} placeholder="Tell students about your teaching style..."
                value={teacherProfile.bio} onChange={setTP('bio')} />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Current Class</label>
                <select className="input" value={studentProfile.class} onChange={setSP('class')} required>
                  <option value="">Select</option>
                  {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">School Board</label>
                <select className="input" value={studentProfile.school_board} onChange={setSP('school_board')} required>
                  <option value="">Select</option>
                  {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Subjects Needed</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {SUBJECTS.map(s => (
                  <button key={s} type="button"
                    onClick={() => setStudentProfile(p => ({
                      ...p,
                      subjects: p.subjects.includes(s) ? p.subjects.filter(x => x !== s) : [...p.subjects, s]
                    }))}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${studentProfile.subjects.includes(s) ? 'bg-brand-500 border-brand-500 text-white' : 'border-white/20 text-[var(--text-secondary)] hover:border-brand-400'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Locality / Area</label>
              <input className="input" placeholder="e.g. Andheri West, Mumbai" value={studentProfile.locality}
                onChange={setSP('locality')} required />
            </div>
            <div>
              <label className="label">Days per Week</label>
              <select className="input" value={studentProfile.days_per_week} onChange={setSP('days_per_week')}>
                {[2,3,4,5,6].map(d => <option key={d} value={d}>{d} days/week</option>)}
              </select>
            </div>
          </>
        )}

        {/* Terms — shown in step 2 for students (last step), step 3 for teachers */}
        {role === 'student' && (
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)}
              className="mt-1 accent-brand-500" />
            <span className="text-xs text-[var(--text-secondary)]">
              I agree to the <Link to="/terms" target="_blank" className="text-brand-400 hover:underline">Terms & Conditions</Link>
            </span>
          </label>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={() => { setStep(1); setError(''); }}
            className="flex-1 py-2.5 rounded-xl bg-white/5 text-[var(--text-secondary)] hover:bg-white/10 transition-all text-sm font-medium">
            ← Back
          </button>
          <button type="submit" className="flex-2 btn-primary px-8 py-2.5 text-sm" disabled={loading}>
            {loading ? 'Submitting...' : role === 'teacher' ? 'Continue →' : '🦊 Register'}
          </button>
        </div>
      </form>
    </Card>
  );

  // ════════════════════════════════════════════════════════════════
  // STEP 3 — Documents (teacher only)
  // ════════════════════════════════════════════════════════════════
  if (step === 3) return (
    <Card>
      <h2 className="font-display text-2xl font-bold text-center text-[var(--text-primary)] mb-2">📎 Upload Documents</h2>
      <p className="text-center text-xs text-[var(--text-secondary)] mb-5">These help admin verify your profile faster</p>
      <StepBar totalSteps={totalSteps} step={step} />
      <ErrorBox error={error} />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label">Resume / CV <span className="text-[var(--text-secondary)] font-normal">(optional)</span></label>
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/20 hover:border-brand-400 rounded-xl p-5 cursor-pointer transition-all">
            <span className="text-3xl">{resumeFile ? '✅' : '📄'}</span>
            <span className="text-sm text-[var(--text-secondary)]">
              {resumeFile ? resumeFile.name : 'Click to upload PDF'}
            </span>
            {/* ponytail: PDF only — server/utils/fileSignature.js has no doc/docx magic-byte check,
                so those were always silently rejected. Add a signature + REG_DOC_MIMES entry to
                support them for real. */}
            <input type="file" accept=".pdf" className="hidden"
              onChange={e => setResumeFile(e.target.files[0])} />
          </label>
        </div>

        <div>
          <label className="label">Aadhar Card <span className="text-[var(--text-secondary)] font-normal">(optional)</span></label>
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/20 hover:border-brand-400 rounded-xl p-5 cursor-pointer transition-all">
            <span className="text-3xl">{aadharFile ? '✅' : '🪪'}</span>
            <span className="text-sm text-[var(--text-secondary)]">
              {aadharFile ? aadharFile.name : 'Click to upload image or PDF'}
            </span>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
              onChange={e => setAadharFile(e.target.files[0])} />
          </label>
          <p className="text-xs text-[var(--text-secondary)] mt-1 text-center">Stored securely. Only visible to admin.</p>
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)}
            className="mt-1 accent-brand-500" />
          <span className="text-xs text-[var(--text-secondary)]">
            I agree to the <Link to="/terms" target="_blank" className="text-brand-400 hover:underline">Terms & Conditions</Link>
          </span>
        </label>

        <div className="flex gap-3">
          <button type="button" onClick={() => { setStep(2); setError(''); }}
            className="flex-1 py-2.5 rounded-xl bg-white/5 text-[var(--text-secondary)] hover:bg-white/10 transition-all text-sm font-medium">
            ← Back
          </button>
          <button type="submit" className="flex-2 btn-primary px-8 py-2.5 text-sm" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Registering...
              </span>
            ) : '🦊 Complete Registration'}
          </button>
        </div>
      </form>
    </Card>
  );
}
