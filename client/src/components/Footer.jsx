import { Link } from 'react-router-dom';
import { SUPPORT_EMAIL, CONTACT_EMAIL, SUPPORT_PHONE } from './StickyHeader';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-10" style={{ background: 'rgba(0,0,0,0.15)' }}>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <img src="/fox-logo.png" alt="Learning Foxx" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-display font-bold text-[var(--text-primary)]">Learning Foxx</span>
          </div>
          <p className="text-[var(--text-secondary)]">
            Online or in-person tutoring — students and teachers can connect with us from anywhere in the world.
          </p>
        </div>

        <div>
          <div className="font-semibold text-[var(--text-primary)] mb-3">Explore</div>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/how-it-works" className="hover:underline">How It Works</Link></li>
            <li><Link to="/locations" className="hover:underline">Locations</Link></li>
            <li><Link to="/register?role=student" className="hover:underline">Find a Tutor</Link></li>
            <li><Link to="/register?role=teacher" className="hover:underline">Become a Tutor</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold text-[var(--text-primary)] mb-3">Subjects</div>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li><Link to="/subjects/mathematics" className="hover:underline">Mathematics</Link></li>
            <li><Link to="/subjects/science" className="hover:underline">Science</Link></li>
            <li><Link to="/subjects/english" className="hover:underline">English</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold text-[var(--text-primary)] mb-3">Policies & Contact</div>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li><Link to="/our-rules" className="hover:underline">Our Rules</Link></li>
            <li><Link to="/terms" className="hover:underline">Terms</Link></li>
            <li><a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">{CONTACT_EMAIL}</a></li>
            <li><a href={`mailto:${SUPPORT_EMAIL}`} className="hover:underline">{SUPPORT_EMAIL}</a></li>
            <li><a href={`tel:${SUPPORT_PHONE}`} className="hover:underline">{SUPPORT_PHONE}</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] text-center">
        © {new Date().getFullYear()} Learning Foxx. All rights reserved.
      </div>
    </footer>
  );
}
