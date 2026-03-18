import { useState, useEffect } from 'react';
import api from '../../api';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/admin/users?role=student').then(r => setStudents(r.data.users)).finally(() => setLoading(false));
  }, []);

  const loadProfile = async (s) => {
    setSelected({ ...s, loading: true });
    try {
      const r = await api.get(`/admin/user-profile/${s.id}`);
      setSelected({ ...s, profile: r.data.profile, loading: false });
    } catch { setSelected({ ...s, loading: false }); }
  };

  const filtered = students.filter(s =>
    !search ||
    s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.phone?.includes(search)
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="page-title">🎓 All Students</h1>
          <p className="page-subtitle">{students.length} approved students on the platform</p>
        </div>
        <input type="text" className="input sm:max-w-xs" placeholder="Search name, email, phone..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* List */}
        <div className="space-y-2">
          {loading ? [...Array(5)].map((_, i) => <div key={i} className="shimmer rounded-2xl h-16" />)
          : filtered.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-4xl mb-2">🎓</div>
              <p className="text-[var(--text-secondary)]">{search ? 'No students match your search' : 'No approved students yet'}</p>
            </div>
          ) : filtered.map(s => (
            <div key={s.id} onClick={() => loadProfile(s)}
              className={`card py-3 px-4 cursor-pointer hover:border-blue-600 transition-all
                ${selected?.id === s.id ? 'ring-2 ring-blue-500' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {s.full_name[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--text-primary)] text-sm truncate">{s.full_name}</p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">{s.email} · {s.phone}</p>
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
              <p className="text-[var(--text-secondary)] text-sm">Click a student to view their full profile</p>
            </div>
          ) : (
            <div className="card space-y-4 animate-slide-up">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center text-xl font-bold">
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
                <div className="space-y-2">{[...Array(3)].map((_,i) => <div key={i} className="shimmer h-10 rounded-xl"/>)}</div>
              ) : selected.profile ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {selected.profile.class && (
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                        <p className="text-xs text-[var(--text-secondary)]">Class</p>
                        <p className="font-bold text-[var(--text-primary)]">Class {selected.profile.class}</p>
                      </div>
                    )}
                    {selected.profile.school_board && (
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                        <p className="text-xs text-[var(--text-secondary)]">Board</p>
                        <p className="font-bold text-[var(--text-primary)]">{selected.profile.school_board}</p>
                      </div>
                    )}
                    {selected.profile.days_per_week && (
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                        <p className="text-xs text-[var(--text-secondary)]">Days/Week</p>
                        <p className="font-bold text-[var(--text-primary)]">{selected.profile.days_per_week} days</p>
                      </div>
                    )}
                  </div>
                  {selected.profile.subjects && (
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Subjects Needed</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.profile.subjects.split(',').map((s,i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-lg bg-blue-900/40 text-blue-300 border border-blue-700/40 font-medium">{s.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selected.profile.address && (
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                      <p className="text-xs text-[var(--text-secondary)] mb-0.5">📍 Address</p>
                      <p className="text-sm text-[var(--text-primary)]">{selected.profile.address}</p>
                    </div>
                  )}
                </div>
              ) : <p className="text-sm text-[var(--text-secondary)]">Profile not filled yet.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
