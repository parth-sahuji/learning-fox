import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { findLocation, subjects } from '../data/locations';

export default function CareerPage() {
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

  const title = `Tutoring Jobs in ${loc.city} | Become a Home Tutor - Learning Foxx`;
  const description = `Looking for tutoring jobs in ${loc.city}? Join Learning Foxx as an admin-vetted home tutor. Set your own rate, flexible hours, direct student connections across ${loc.areas.slice(0, 3).join(', ')} and more.`;
  const canonical = `https://www.learningfoxx.com/tutor-jobs/${loc.countrySlug}/${loc.slug}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`tutoring jobs ${loc.city}, become a tutor ${loc.city}, private tutor jobs ${loc.city}, teaching jobs ${loc.city}`} />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <div className="min-h-screen bg-stone-50" style={{ paddingTop: '56px' }}>
        <section className="bg-gradient-to-br from-stone-900 via-brand-800 to-brand-700 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-block bg-white/10 border border-white/20 rounded-full px-6 py-2 mb-6">
              <span className="font-semibold">{loc.flag} {loc.city}{loc.region ? `, ${loc.region}` : ''}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6">Tutoring Jobs<br/>in {loc.city}</h1>
            <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto">Teach {loc.boards} students. Set your own rate. Admin-vetted, verified profile.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register?role=teacher" className="btn-primary px-10 py-5 text-lg rounded-full">Apply as a Tutor</Link>
              <Link to={`/locations/${loc.countrySlug}/${loc.slug}`} className="btn-secondary px-10 py-5 text-lg rounded-full">Looking for a tutor instead?</Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Teach Students Across {loc.city}</h2>
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
            <h2 className="text-4xl font-bold text-center mb-12">Subjects in Demand</h2>
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

        <section className="py-20 bg-brand-600 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-5xl font-bold mb-6">Start Teaching in {loc.city}</h2>
            <Link to="/register?role=teacher" className="inline-block bg-white text-brand-700 px-10 py-5 rounded-full font-bold hover:scale-105 transition-all">
              Register as a Tutor
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
