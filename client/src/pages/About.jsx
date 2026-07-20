import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import { SUPPORT_EMAIL } from '../components/StickyHeader';

const FEATURES = [
  { icon: '🏠', title: 'Home Tuition', desc: 'Expert tutors come to your home — no travel, no stress. Learn in the comfort of your own space.' },
  { icon: '✅', title: 'Verified Tutors', desc: 'Every teacher is manually vetted by our admin team with identity verification before being approved.' },
  { icon: '📚', title: 'All Subjects', desc: 'Mathematics, Science, English, Hindi, Computer Science, Commerce, and more — for Class 1 to 12.' },
  { icon: '💰', title: 'Affordable Fees', desc: 'Transparent monthly fee set by the platform. No hidden charges. Pay only after confirming sessions.' },
  { icon: '🔒', title: 'Safe & Secure', desc: 'Student and teacher contact details are never shared without consent. Admin-controlled matching only.' },
  { icon: '📍', title: 'Local Tutors', desc: 'We match you with tutors near your locality for minimum travel time and maximum convenience.' },
];

const STEPS = [
  { num: '1', title: 'Register', desc: 'Sign up as a Student or Teacher. Your profile is reviewed by our admin team.' },
  { num: '2', title: 'Get Matched', desc: 'Our admin matches you with the right tutor for your subject, class, and location.' },
  { num: '3', title: 'Start Learning', desc: 'Your tutor visits your home at scheduled times. Pay monthly after confirming sessions.' },
];

const SUBJECTS = ['Mathematics','Physics','Chemistry','Biology','English','Hindi',
  'Computer Science','Economics','Accounts','History','Geography','Science'];

export default function About() {
  return (
    <div className="min-h-screen relative" style={{ paddingTop: '56px' }}>
      <AnimatedBackground />

      {/* Hero */}
      <section className="relative content-layer py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <img src="/fox-logo.png" alt="Learning Foxx" className="w-24 h-24 mx-auto object-contain mb-4"
            style={{ filter: 'drop-shadow(0 8px 24px rgba(239,117,32,0.5))', animation: 'floatIcon 3.5s ease-in-out infinite' }} />
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-4" style={{
            background: 'linear-gradient(135deg, #f97316, #ef7520, #b94612)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Learning Foxx
          </h1>
          <p className="text-xl text-[var(--text-secondary)] mb-3 font-medium">
            🏆 India's Trusted Home Tuition Platform
          </p>
          <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-xl mx-auto mb-8">
            We connect students with qualified, verified home tutors across Pune, Maharashtra and India.
            Quality education, delivered to your doorstep — affordable, safe, and reliable.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="btn-primary px-8 py-3 text-base">
              🦊 Get Started — It's Free
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-3 text-base">
              Sign In
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {['✅ Verified Tutors', '📍 Pune & Across India', '🔒 Safe & Secure', '⭐ Best Results'].map(b => (
              <span key={b} className="text-sm text-[var(--text-secondary)] font-semibold">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="relative content-layer py-16 px-4" style={{ background: 'rgba(239,117,32,0.05)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-4">What is Learning Foxx?</h2>
          <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-2xl mx-auto">
            Learning Foxx is a <strong className="text-[var(--text-primary)]">home tuition management platform</strong> that
            bridges the gap between students who need personalized learning and qualified teachers who want to teach.
            Unlike traditional tuition centres, our tutors come <strong className="text-[var(--text-primary)]">directly to your home</strong>,
            saving travel time and providing a comfortable learning environment.
          </p>
          <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-2xl mx-auto mt-4">
            We operate as a <strong className="text-[var(--text-primary)]">trusted broker</strong> — we vet every teacher,
            set fair fee structures, and manage all payment confirmations through our platform.
            You focus on learning. We handle everything else.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="relative content-layer py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] text-center mb-10">Why Choose Learning Foxx?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="card hover:border-brand-600 transition-colors">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative content-layer py-16 px-4" style={{ background: 'rgba(239,117,32,0.05)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-10">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="card relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white text-xl font-black flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {s.num}
                </div>
                {i < 2 && (
                  <div className="hidden sm:block absolute top-10 -right-3 text-brand-500 text-2xl font-bold z-10">→</div>
                )}
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="relative content-layer py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-3">Subjects We Cover</h2>
          <p className="text-[var(--text-secondary)] mb-8">For Class 1 to 12 — CBSE, ICSE, Maharashtra Board, and more</p>
          <div className="flex flex-wrap justify-center gap-3">
            {SUBJECTS.map(s => (
              <span key={s} className="px-4 py-2 rounded-full text-sm font-semibold border-2 border-brand-700/50 text-brand-300 bg-brand-900/20">
                {s}
              </span>
            ))}
            <span className="px-4 py-2 rounded-full text-sm font-semibold border-2 border-brand-500 text-brand-300 bg-brand-900/30">
              + Many More
            </span>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="relative content-layer py-16 px-4" style={{ background: 'rgba(239,117,32,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] text-center mb-10">Who Is This For?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card border-2 border-blue-700/30">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mb-3">Students & Parents</h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li>✓ Struggling with specific subjects</li>
                <li>✓ Want personalised 1-on-1 attention</li>
                <li>✓ Preparing for board exams (Class 10 / 12)</li>
                <li>✓ Need a tutor in their local area</li>
                <li>✓ Want consistent, trackable progress</li>
              </ul>
              <Link to="/register" className="btn-primary w-full mt-5 text-center block">
                Register as Student
              </Link>
            </div>
            <div className="card border-2 border-purple-700/30">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mb-3">Teachers & Tutors</h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li>✓ Qualified graduates and post-graduates</li>
                <li>✓ Experienced school or college teachers</li>
                <li>✓ Want to earn by teaching from home</li>
                <li>✓ Can travel to nearby student locations</li>
                <li>✓ Want a trusted platform to find students</li>
              </ul>
              <Link to="/register" className="btn-primary w-full mt-5 text-center block">
                Register as Teacher
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="relative content-layer py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-4">📍 Where We Operate</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
            Currently serving students and teachers across <strong className="text-[var(--text-primary)]">Pune, Maharashtra</strong>.
            Expanding to Mumbai, Nagpur, and other major cities soon.
            Students can mention their exact locality during registration for best tutor matching.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Pune', 'Pimpri-Chinchwad', 'Kothrud', 'Shivaji Nagar', 'Hadapsar', 'Wakad', 'Baner', 'Viman Nagar', 'Deccan', 'Kalyani Nagar'].map(l => (
              <span key={l} className="text-xs px-3 py-1.5 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-700/30 font-medium">
                📍 {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative content-layer py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto card" style={{ background: 'linear-gradient(135deg, rgba(185,70,18,0.15), rgba(239,117,32,0.1))', border: '2px solid rgba(239,117,32,0.3)' }}>
          <img src="/fox-logo.png" alt="Learning Foxx" className="w-16 h-16 mx-auto object-contain mb-3" />
          <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-3">
            Ready to Start Learning?
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Join hundreds of students and teachers already on Learning Foxx.
            Registration is free. Get matched with the right tutor within 1–2 days.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary px-8 py-3 text-base">🦊 Register Free</Link>
            <a href="https://wa.me/918340173069?text=I%20want%20to%20know%20more%20about%20Learning%20Foxx%20tuition"
              target="_blank" rel="noopener noreferrer"
              className="btn-secondary px-8 py-3 text-base">
              💬 WhatsApp Us
            </a>
          </div>
          <p className="text-xs text-[var(--text-secondary)]/60 mt-4">
            📞 8340173069 · ✉️ {SUPPORT_EMAIL}
          </p>
        </div>
      </section>
    </div>
  );
}
