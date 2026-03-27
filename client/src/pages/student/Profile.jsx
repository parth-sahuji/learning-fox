import { useState, useEffect } from 'react';
import api from '../../api';

const CLASSES = ['1','2','3','4','5','6','7','8','9','10','11','12','College/UG'];
const BOARDS = ['CBSE','ICSE','IGCSE','IB','Maharashtra State Board','UP Board','Bihar Board','MP Board','Other State Board'];
const SUBJECTS_LIST = ['All Subjects', 'Mathematics','Physics','Chemistry','Biology','English','Hindi','History','Geography','Computer Science','Economics','Accounts','Business Studies','Sanskrit','Marathi','Science'];

export default function StudentProfile() {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({ full_name:'', phone:'', class:'', subjects:[], locality:'', school_board:'', days_per_week:3, address:'' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get('/student/profile').then(r => {
      setUser(r.data.user);
      const p = r.data.profile||{};
      const subs = p.subjects ? p.subjects.split(',').map(s=>s.trim()).filter(Boolean) : [];
      setForm({ full_name:r.data.user.full_name||'', phone:r.data.user.phone||'',
        class:p.class||'', subjects:subs, locality:p.locality||'',
        school_board:p.school_board||'', days_per_week:p.days_per_week||3, address:p.address||'' });
    }).finally(()=>setLoading(false));
  },[]);

  const showToast = (msg,type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const toggleSub = s => set('subjects', form.subjects.includes(s)?form.subjects.filter(x=>x!==s):[...form.subjects,s]);

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try {
      await api.put('/student/profile', { full_name:form.full_name, phone:form.phone,
        class:form.class, subjects:form.subjects.join(', '), locality:form.locality,
        school_board:form.school_board, days_per_week:form.days_per_week, address:form.address });
      showToast('Profile saved!');
    } catch (err) { showToast(err.response?.data?.error||'Save failed.','error'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_,i)=><div key={i} className="card shimmer h-32"/>)}</div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {toast && <div className={`fixed top-16 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type==='error'?'bg-red-500':'bg-emerald-500'} animate-slide-up`}>{toast.msg}</div>}

      <div><h1 className="page-title">My Profile</h1><p className="page-subtitle">Keep your details updated for accurate matching</p></div>

      <form onSubmit={save} className="space-y-5">
        <div className="card space-y-4">
          <h2 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 text-sm">
            <span className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xs">👤</span> Personal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Full Name</label><input className="input" value={form.full_name} onChange={e=>set('full_name',e.target.value)}/></div>
            <div><label className="label">Phone</label><input type="tel" className="input" value={form.phone} onChange={e=>set('phone',e.target.value)}/></div>
          </div>
          <div><label className="label">Email (read-only)</label><input className="input opacity-60 cursor-not-allowed" value={user.email||''} readOnly/></div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 text-sm">
            <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs">🎓</span> Academic Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Class / Grade</label>
              <select className="input" value={form.class} onChange={e=>set('class',e.target.value)}>
                <option value="">— Select —</option>{CLASSES.map(c=><option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div><label className="label">School Board</label>
              <select className="input" value={form.school_board} onChange={e=>set('school_board',e.target.value)}>
                <option value="">— Select —</option>{BOARDS.map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Subjects Needed</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {SUBJECTS_LIST.map(s=><button key={s} type="button" onClick={()=>toggleSub(s)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${form.subjects.includes(s)?'bg-brand-500 border-brand-500 text-white':'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-300'}`}>{s}</button>)}
            </div>
          </div>
          <div>
            <label className="label">Days Per Week</label>
            <div className="flex gap-2">
              {[1,2,3,4,5,6,7].map(d=><button key={d} type="button" onClick={()=>set('days_per_week',d)}
                className={`w-10 h-10 rounded-xl text-sm font-bold border-2 transition-all ${form.days_per_week===d?'bg-brand-500 border-brand-500 text-white':'border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-400'}`}>{d}</button>)}
            </div>
          </div>
          <div><label className="label">Locality / Area</label>
            <input className="input" placeholder="e.g. Koregaon Park, Pune" value={form.locality} onChange={e=>set('locality',e.target.value)}/>
          </div>
          <div><label className="label">Full Home Address</label>
            <textarea className="input resize-none" rows={2} placeholder="e.g. Flat 12, Shivaji Nagar, Pune 411005" value={form.address} onChange={e=>set('address',e.target.value)}/>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={saving}>{saving?'Saving...':'💾 Save Profile'}</button>
      </form>
    </div>
  );
}
