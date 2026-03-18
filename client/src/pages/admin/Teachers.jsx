import { useState, useEffect } from 'react';
import api from '../../api';

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/admin/users?role=teacher').then(r => setTeachers(r.data.users)).finally(() => setLoading(false));
  }, []);

  const loadProfile = async (t) => {
    setSelected({ ...t, loading: true });
    try {
      const r = await api.get(`/admin/user-profile/${t.id}`);
      setSelected({ ...t, profile: r.data.profile, loading: false });
    } catch { setSelected({ ...t, loading: false }); }
  };

  const filtered = teachers.filter(t =>
    !search ||
    t.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase()) ||
    t.phone?.includes(search)
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="page-title">📚 All Teachers</h1>
          <p className="page-subtitle">{teachers.length} approved teachers on the platform</p>
        </div>
        <input type="text" className="input sm:max-w-xs" placeholder="Search name, email, phone..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* List */}
        <div className="space-y-2">
          {loading ? [...Array(5)].map((_, i) => <div key={i} className="shimmer rounded-2xl h-16"/>)
          : filtered.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-4xl mb-2">📚</div>
              <p className="text-[var(--text-secondary)]">{search ? 'No teachers match' : 'No approved teachers yet'}</p>
            </div>
          ) : filtered.map(t => (
            <div key={t.id} onClick={() => loadProfile(t)}
              className={`card py-3 px-4 cursor-pointer hover:border-purple-600 transition-all
                ${selected?.id === t.id ? 'ring-2 ring-purple-500' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {t.full_name[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--text-primary)] text-sm truncate">{t.full_name}</p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">{t.email} · {t.phone}</p>
                </div>
                <svg className="w-4 h-4 text-[var(--text-secondary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div>
          {!selected ? (
            <div className="card text-center py-16 border-2 border-dashed" style={{ borderColor: 'var(--border)' }}>
              <div className="text-4xl mb-2 opacity-30">👆</div>
              <p className="text-[var(--text-secondary)] text-sm">Click a teacher to view their full profile and documents</p>
            </div>
          ) : (
            <div className="card space-y-4 animate-slide-up">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 text-white flex items-center justify-center text-xl font-bold">
                    {selected.full_name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-[var(--text-primary)]">{selected.full_name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{selected.email}</p>
                    <p className="text-sm text-[var(--text-secondary)]">📞 {selected.phone}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-[var(--text-secondary)] hover:text-white p-1">✕</button>
              </div>

              {selected.loading ? (
                <div className="space-y-2">{[...Array(4)].map((_,i) => <div key={i} className="shimmer h-10 rounded-xl"/>)}</div>
              ) : selected.profile ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {selected.profile.class_from && (
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                        <p className="text-xs text-[var(--text-secondary)]">Teaches</p>
                        <p className="font-bold text-[var(--text-primary)]">Class {selected.profile.class_from}–{selected.profile.class_to}</p>
                      </div>
                    )}
                    {selected.profile.languages && (
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                        <p className="text-xs text-[var(--text-secondary)]">Languages</p>
                        <p className="font-bold text-[var(--text-primary)] text-sm">{selected.profile.languages}</p>
                      </div>
                    )}
                  </div>
                  {selected.profile.subjects_taught && (
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Subjects</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.profile.subjects_taught.split(',').map((s,i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-lg bg-purple-900/40 text-purple-300 border border-purple-700/40 font-medium">{s.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selected.profile.education && (
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                      <p className="text-xs text-[var(--text-secondary)] mb-0.5">Education</p>
                      <p className="text-sm text-[var(--text-primary)] whitespace-pre-line">{selected.profile.education}</p>
                    </div>
                  )}
                  {/* Documents */}
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">📎 Submitted Documents</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-primary)]">🪪 Aadhar Card</span>
                        {selected.profile.aadhar_doc
                          ? <a href={selected.profile.aadhar_doc} target="_blank" rel="noopener noreferrer"
                              className="text-xs px-3 py-1.5 rounded-lg bg-brand-900/40 text-brand-300 border border-brand-700/40 font-semibold hover:bg-brand-800/40 transition-colors">
                              View Aadhar
                            </a>
                          : <span className="text-xs text-[var(--text-secondary)]">Not uploaded</span>
                        }
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-primary)]">📄 Resume / CV</span>
                        {selected.profile.resume_doc
                          ? <a href={selected.profile.resume_doc} target="_blank" rel="noopener noreferrer"
                              className="text-xs px-3 py-1.5 rounded-lg bg-brand-900/40 text-brand-300 border border-brand-700/40 font-semibold hover:bg-brand-800/40 transition-colors">
                              View Resume
                            </a>
                          : <span className="text-xs text-[var(--text-secondary)]">Not uploaded</span>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              ) : <p className="text-sm text-[var(--text-secondary)]">Profile not filled yet.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
