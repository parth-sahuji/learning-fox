import { useState, useEffect } from 'react';
import api from '../../api';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const TIMES = ['6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM'];
const CLASSES = ['1','2','3','4','5','6','7','8','9','10','11','12','College/UG'];
const SUBJECTS_LIST = ['Mathematics','Physics','Chemistry','Biology','English','Hindi','History','Geography','Computer Science','Economics','Accounts','Business Studies','Sanskrit','Marathi','Science'];
const LANGUAGES = ['Hindi','English','Marathi','Bengali','Tamil','Telugu','Gujarati','Kannada','Punjabi','Other'];

export default function TeacherProfile() {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({ full_name:'', phone:'', bio:'', education:'', skills:'', available_slots:[], class_from:'', class_to:'', subjects_taught:[], languages:[] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [newSlot, setNewSlot] = useState({ day:'Monday', from:'9:00 AM', to:'11:00 AM' });

  useEffect(() => {
    api.get('/teacher/profile').then(r => {
      setUser(r.data.user);
      const p = r.data.profile || {};
      setForm({
        full_name: r.data.user.full_name||'',
        phone: r.data.user.phone||'',
        bio: p.bio||'',
        education: p.education||'',
        skills: p.skills||'',
        available_slots: p.available_slots||[],
        class_from: p.class_from||'',
        class_to: p.class_to||'',
        subjects_taught: p.subjects_taught ? p.subjects_taught.split(',').map(s=>s.trim()).filter(Boolean) : [],
        languages: p.languages ? p.languages.split(',').map(s=>s.trim()).filter(Boolean) : [],
      });
    }).finally(()=>setLoading(false));
  },[]);

  const showToast = (msg,type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const toggleArr = (key,val) => set(key, form[key].includes(val) ? form[key].filter(x=>x!==val) : [...form[key],val]);

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try {
      await api.put('/teacher/profile', {
        full_name:form.full_name, phone:form.phone, bio:form.bio,
        education:form.education, skills:form.skills,
        available_slots:form.available_slots,
        class_from:form.class_from, class_to:form.class_to,
        subjects_taught:form.subjects_taught.join(', '),
        languages:form.languages.join(', '),
      });
      showToast('Profile saved!');
    } catch (err) { showToast(err.response?.data?.error||'Save failed.','error'); }
    finally { setSaving(false); }
  };

  const addSlot = () => {
    if (form.available_slots.some(s=>s.day===newSlot.day&&s.from===newSlot.from)) return showToast('Slot already exists','error');
    set('available_slots',[...form.available_slots,{...newSlot}]);
  };
  const removeSlot = i => set('available_slots',form.available_slots.filter((_,idx)=>idx!==i));

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_,i)=><div key={i} className="card shimmer h-32"/>)}</div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {toast && <div className={`fixed top-16 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type==='error'?'bg-red-500':'bg-emerald-500'} animate-slide-up`}>{toast.msg}</div>}

      <div><h1 className="page-title">My Profile</h1><p className="page-subtitle">Update your professional details</p></div>

      <form onSubmit={save} className="space-y-5">
        {/* Personal */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 text-sm">
            <span className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xs">👤</span> Personal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Full Name</label><input className="input" value={form.full_name} onChange={e=>set('full_name',e.target.value)}/></div>
            <div><label className="label">Phone</label><input type="tel" className="input" value={form.phone} onChange={e=>set('phone',e.target.value)}/></div>
          </div>
          <div><label className="label">Email (read-only)</label><input className="input opacity-60 cursor-not-allowed" value={user.email||''} readOnly/></div>
          <div><label className="label">Bio</label><textarea className="input resize-none" rows={3} value={form.bio} onChange={e=>set('bio',e.target.value)} placeholder="Tell students about yourself..."/></div>
        </div>

        {/* Teaching Details */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 text-sm">
            <span className="w-6 h-6 rounded-lg bg-brand-500 text-white flex items-center justify-center text-xs">📚</span> Teaching Details
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Teach From</label>
              <select className="input" value={form.class_from} onChange={e=>set('class_from',e.target.value)}>
                <option value="">— Select —</option>{CLASSES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="label">Up To Class</label>
              <select className="input" value={form.class_to} onChange={e=>set('class_to',e.target.value)}>
                <option value="">— Select —</option>{CLASSES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Subjects</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {SUBJECTS_LIST.map(s=><button key={s} type="button" onClick={()=>toggleArr('subjects_taught',s)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${form.subjects_taught.includes(s)?'bg-brand-500 border-brand-500 text-white':'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-300'}`}>{s}</button>)}
            </div>
          </div>
          <div>
            <label className="label">Languages</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {LANGUAGES.map(l=><button key={l} type="button" onClick={()=>toggleArr('languages',l)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${form.languages.includes(l)?'bg-navy-600 border-navy-600 text-white':'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-navy-400'}`}>{l}</button>)}
            </div>
          </div>
          <div><label className="label">Education & Qualifications</label>
            <textarea className="input resize-none" rows={3} value={form.education} onChange={e=>set('education',e.target.value)} placeholder="e.g. B.Sc. Mathematics, Pune University (2018)"/>
          </div>
          <div><label className="label">Skills & Specializations</label>
            <textarea className="input resize-none" rows={2} value={form.skills} onChange={e=>set('skills',e.target.value)} placeholder="e.g. JEE coaching, NEET preparation, Algebra"/>
          </div>
        </div>

        {/* Time Slots */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 text-sm">
            <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs">🕐</span> Available Time Slots
          </h2>
          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">Add a new slot</p>
            <div className="flex flex-wrap gap-2 items-end">
              <div><label className="label text-xs">Day</label>
                <select className="input py-1.5 text-sm" value={newSlot.day} onChange={e=>setNewSlot(s=>({...s,day:e.target.value}))}>{DAYS.map(d=><option key={d}>{d}</option>)}</select>
              </div>
              <div><label className="label text-xs">From</label>
                <select className="input py-1.5 text-sm" value={newSlot.from} onChange={e=>setNewSlot(s=>({...s,from:e.target.value}))}>{TIMES.map(t=><option key={t}>{t}</option>)}</select>
              </div>
              <div><label className="label text-xs">To</label>
                <select className="input py-1.5 text-sm" value={newSlot.to} onChange={e=>setNewSlot(s=>({...s,to:e.target.value}))}>{TIMES.map(t=><option key={t}>{t}</option>)}</select>
              </div>
              <button type="button" onClick={addSlot} className="btn-secondary text-sm py-1.5">+ Add</button>
            </div>
          </div>
          {form.available_slots.length===0
            ? <p className="text-sm text-[var(--text-secondary)] text-center py-2">No slots added yet.</p>
            : <div className="flex flex-wrap gap-2">
                {form.available_slots.map((slot,i)=>(
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-100 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800">
                    <span className="text-xs font-medium text-brand-700 dark:text-brand-300">{slot.day} · {slot.from}–{slot.to}</span>
                    <button type="button" onClick={()=>removeSlot(i)} className="text-brand-400 hover:text-red-500 text-xs ml-1">✕</button>
                  </div>
                ))}
              </div>
          }
        </div>

        <button type="submit" className="btn-primary w-full" disabled={saving}>{saving?'Saving...':'💾 Save Profile'}</button>
      </form>
    </div>
  );
}
