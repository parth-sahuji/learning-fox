import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = {
  admin: [
    { to: '/admin',             label: 'Dashboard',       icon: '🏠', end: true },
    { to: '/admin/vetting',     label: 'Vetting Queue',   icon: '🔍' },
    { to: '/admin/matcher',     label: 'Assign Teachers', icon: '🔗' },
    { to: '/admin/assignments', label: 'Assignments',     icon: '📋' },
    { to: '/admin/students',    label: 'All Students',    icon: '🎓' },
    { to: '/admin/teachers',    label: 'All Teachers',    icon: '📚' },
    { to: '/admin/fees',        label: 'Fee Records',     icon: '₹'  },
  ],
  teacher: [
    { to: '/teacher',           label: 'Dashboard',   icon: '🏠', end: true },
    { to: '/teacher/profile',   label: 'My Profile',  icon: '👤' },
    { to: '/teacher/portfolio', label: 'Portfolio',   icon: '📁' },
    { to: '/teacher/fees',      label: 'Fee History', icon: '₹'  },
  ],
  student: [
    { to: '/student',           label: 'Dashboard',   icon: '🏠', end: true },
    { to: '/student/profile',   label: 'My Profile',  icon: '👤' },
    { to: '/student/fees',      label: 'Fee History', icon: '₹'  },
  ],
};

const roleGradient = {
  admin:   'from-brand-700 to-brand-900',
  teacher: 'from-indigo-700 to-indigo-900',
  student: 'from-emerald-700 to-emerald-900',
};

export default function Sidebar({ mobile, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = navItems[user?.role] || [];

  return (
    <aside className="flex flex-col h-full w-64"
      style={{ background: '#130d05', borderRight: '1px solid #3d2010' }}>

      {/* Brand header */}
      <div className={`p-5 bg-gradient-to-br ${roleGradient[user?.role] || roleGradient.student}`}>
        <div className="flex items-center gap-3">
          <img src="/fox-logo.png" alt="Learning Foxx"
            className="w-11 h-11 rounded-xl object-cover border-2 border-white/30 shadow-lg" />
          <div>
            <h1 className="font-display text-lg font-bold text-white leading-tight">Learning Foxx</h1>
            <p className="text-xs text-white/60">Tuition Platform</p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.25)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.full_name}</p>
              <p className="text-xs text-white/50 truncate">{user?.email}</p>
            </div>
          </div>
          <span className="inline-block mt-2 px-2.5 py-0.5 bg-white/15 rounded-lg text-xs text-white font-semibold capitalize border border-white/20">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-1">
        <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest px-3 py-2">
          Navigation
        </p>
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={mobile ? onClose : undefined}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="text-base w-6 text-center">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3" style={{ borderTop: '1px solid #3d2010' }}>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="nav-link w-full"
          style={{ color: '#f87171' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
