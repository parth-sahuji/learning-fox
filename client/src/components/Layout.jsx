import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationsDropdown from './Notifications';
import AnimatedBackground from './AnimatedBackground';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen pt-[56px] overflow-hidden relative" style={{ background: '#0f0a06' }}>
      <AnimatedBackground />

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0 content-layer" style={{ zIndex: 10 }}>
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ top: '56px' }}>
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full">
            <Sidebar mobile onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden content-layer" style={{ zIndex: 5 }}>
        {/* Topbar */}
        <header className="flex-shrink-0 h-14 flex items-center justify-between px-4 md:px-6"
          style={{
            background: 'rgba(30,20,9,0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(61,32,16,0.8)',
          }}>
          <button className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-white/10"
            onClick={() => setMobileOpen(true)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-brand-500 rounded-full hidden md:block" />
            <img src="/fox-logo.png" alt="" className="w-6 h-6 object-contain hidden md:block" />
            <span className="text-sm font-semibold text-[var(--text-primary)] hidden md:block">
              Welcome back, {user?.full_name?.split(' ')[0]} 👋
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <NotificationsDropdown />
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-sm font-bold shadow-lg">
              {user?.full_name?.[0]?.toUpperCase() || '?'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6" style={{ background: 'rgba(15,10,6,0.7)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
