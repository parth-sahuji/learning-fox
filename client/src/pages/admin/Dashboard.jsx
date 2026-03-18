import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { icon: '🎓', label: 'Active Students',    value: stats.students,            color: 'from-blue-600 to-blue-800',    link: '/admin/students' },
    { icon: '📚', label: 'Active Teachers',    value: stats.teachers,            color: 'from-purple-600 to-purple-800',link: '/admin/teachers' },
    { icon: '🔍', label: 'Pending Approvals',  value: stats.pending_approvals,   color: 'from-amber-600 to-orange-700', link: '/admin/vetting', urgent: stats.pending_approvals > 0 },
    { icon: '🔗', label: 'Active Assignments', value: stats.active_assignments,  color: 'from-emerald-600 to-teal-700', link: '/admin/assignments' },
    { icon: '₹',  label: 'Monthly Revenue',    value: `₹${stats.total_monthly_revenue?.toLocaleString('en-IN')}`, color: 'from-brand-600 to-brand-800', link: '/admin/fees' },
  ] : [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <img src="/fox-logo.png" alt="" className="w-8 h-8 object-contain" />
          Admin Dashboard
        </h1>
        <p className="page-subtitle">Click any card to jump to that section</p>
      </div>

      {/* Stat cards — all clickable */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="shimmer rounded-2xl h-32" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map(c => (
            <div key={c.label}
              onClick={() => navigate(c.link)}
              className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer
                hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl
                bg-gradient-to-br ${c.color}
                ${c.urgent ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0f0a06]' : ''}`}>
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="text-2xl font-black font-display text-white">{c.value}</div>
              <div className="text-xs text-white/70 mt-0.5 font-medium">{c.label}</div>
              {c.urgent && (
                <div className="mt-1.5 text-xs text-amber-200 font-bold animate-pulse-soft">⚡ Action needed</div>
              )}
              {/* Shine overlay */}
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-white/10 -mr-4 -mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Quick action panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { title: '🔍 Vetting Queue',    desc: 'Review & approve pending teacher and student registrations. View their Aadhar, resume, and profile details.', link: '/admin/vetting',     cta: 'Review Now' },
          { title: '🔗 Assign Teachers',  desc: 'Use the Matcher to link students with qualified teachers for a subject and set their monthly fee.',          link: '/admin/matcher',     cta: 'Open Matcher' },
          { title: '₹ Fee Records',       desc: 'Monitor all payment statuses, trigger monthly fees, and track the dual-confirmation workflow.',               link: '/admin/fees',        cta: 'View Fees' },
        ].map(q => (
          <div key={q.link}
            onClick={() => navigate(q.link)}
            className="card cursor-pointer hover:border-brand-600 hover:shadow-brand-900/30 hover:shadow-2xl transition-all duration-200 group">
            <h3 className="font-display font-bold text-[var(--text-primary)] text-base mb-2 group-hover:text-brand-400 transition-colors">
              {q.title}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{q.desc}</p>
            <span className="text-xs font-bold text-brand-400 group-hover:text-brand-300">
              {q.cta} →
            </span>
          </div>
        ))}
      </div>

      {/* Platform info strip */}
      <div className="card py-4" style={{ background: 'rgba(185,70,18,0.08)', borderColor: 'rgba(185,70,18,0.3)' }}>
        <div className="flex flex-wrap items-center gap-6 justify-center text-center">
          {[
            { icon: '🔒', text: 'Gatekeeper Active', sub: 'Students see teacher only after assignment' },
            { icon: '💰', text: 'Fee Hidden from Teacher', sub: 'Admin controls all pricing' },
            { icon: '📅', text: 'Auto-trigger on 30th', sub: 'Monthly fee records auto-created' },
            { icon: '🌐', text: 'SaaS Ready', sub: 'Multi-tenancy with agency_id' },
          ].map(i => (
            <div key={i.text} className="flex items-center gap-2">
              <span className="text-xl">{i.icon}</span>
              <div className="text-left">
                <p className="text-xs font-bold text-[var(--text-primary)]">{i.text}</p>
                <p className="text-xs text-[var(--text-secondary)]">{i.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
