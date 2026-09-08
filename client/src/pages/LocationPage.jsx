import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { findLocation, subjects } from '../data/locations';

const buildFaqs = (loc) => [
  { q: `How much does a home tutor cost in ${loc.city}?`,
    a: `Tutor rates in ${loc.city} vary by subject, grade level, and tutor experience. Each tutor sets their own rate, so you can compare options and pick one that fits your budget after registering.` },
  { q: `Are Learning Foxx tutors in ${loc.city} verified?`,
    a: `Yes. Every tutor on Learning Foxx, including those in ${loc.city}, is reviewed by our admin team before their profile goes live.` },
  { q: `Does Learning Foxx offer online tutoring in ${loc.city}, or only in-person?`,
    a: `Both. You can choose an in-person home tutor or a remote/online tutor in ${loc.city}, depending on what works for you.` },
  { q: `What subjects and boards are covered in ${loc.city}?`,
    a: `Tutors in ${loc.city} cover ${loc.boards}, along with core subjects like Maths, Science, and English.` },
  { q: `How long does it take to get matched with a tutor in ${loc.city}?`,
    a: `Most students in ${loc.city} are matched with a vetted tutor within 1-2 days of registering.` },
];

export default function LocationPage() {
  const { country, city } = useParams();
  const loc = findLocation(country, city);

  if (!loc) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: '56px' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">City not found</h1>
          <Link to="/locations" className="btn-primary inline-block">Browse all cities</Link>
        </div>
      </div>
    );
  }

  const title = `Home Tutors in ${loc.city} | Private Tutoring ${loc.city} - Learning Foxx`;
  const description = `Find verified, admin-vetted home tutors in ${loc.city}. Expert private tutors for ${loc.boards} across ${loc.areas.slice(0, 4).join(', ')} and more.`;
  const canonical = `https://www.learningfoxx.com/locations/${loc.countrySlug}/${loc.slug}`;
  const faqs = buildFaqs(loc);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`home tutor ${loc.city}, private tutor ${loc.city}, home tuition ${loc.city}, ${loc.city} tutoring`} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Service', serviceType: 'Home Tutoring',
          provider: { '@type': 'Organization', name: 'Learning Foxx', url: 'https://www.learningfoxx.com' },
          areaServed: { '@type': 'City', name: loc.city }, description,
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({
            '@type': 'Question', name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-stone-50" style={{ paddingTop: '56px' }}>
        <section className="bg-gradient-to-br from-brand-700 via-brand-800 to-stone-900 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-block bg-white/10 border border-white/20 rounded-full px-6 py-2 mb-6">
              <span className="font-semibold">{loc.flag} {loc.city}{loc.region ? `, ${loc.region}` : ''}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6">Expert Home Tutors<br/>in {loc.city}</h1>
            <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto">Admin-vetted private tutors — {loc.boards}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register?role=student" className="btn-primary px-10 py-5 text-lg rounded-full">Find Your Tutor</Link>
              <Link to={`/tutor-jobs/${loc.countrySlug}/${loc.slug}`} className="btn-secondary px-10 py-5 text-lg rounded-full">Become a Tutor Here</Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">{loc.city} Areas We Cover</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {loc.areas.map((area) => (
                <div key={area} className="bg-brand-50 border border-brand-100 rounded-lg p-4 text-center">
                  <span className="font-semibold">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-stone-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Popular Subjects</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {subjects.map((s) => (
                <div key={s.name} className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition-all">
                  <div className="text-5xl mb-3">{s.icon}</div>
                  <div className="font-bold">{s.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">FAQs: Tutoring in {loc.city}</h2>
            <div className="space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="bg-stone-50 border border-stone-200 rounded-lg p-4 group">
                  <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                    {f.q}
                    <span className="text-brand-500 group-open:rotate-45 transition-transform text-xl">+</span>
                  </summary>
                  <p className="text-[var(--text-secondary,#57534e)] mt-3">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-brand-600 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-5xl font-bold mb-6">Ready to Start?</h2>
            <Link to="/register?role=student" className="inline-block bg-white text-brand-700 px-10 py-5 rounded-full font-bold hover:scale-105 transition-all">
              Find a {loc.city} Tutor
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
