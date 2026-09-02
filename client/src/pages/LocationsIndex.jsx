import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { locations } from '../data/locations';

export default function LocationsIndex() {
  const byCountry = locations.reduce((acc, l) => {
    (acc[l.country] ||= []).push(l);
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <title>All Locations | Home Tutors & Tutoring Jobs Worldwide - Learning Foxx</title>
        <meta name="description" content="Learning Foxx connects students and tutors across India, the USA and the UK. Browse home tutors or tutoring jobs in your city." />
        <link rel="canonical" href="https://www.learningfoxx.com/locations" />
      </Helmet>

      <div className="min-h-screen bg-stone-50" style={{ paddingTop: '56px' }}>
        <section className="bg-gradient-to-br from-brand-700 via-brand-800 to-stone-900 text-white py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4">Find Us In Your City</h1>
          <p className="text-xl text-gray-200">Verified home tutors and tutoring jobs, worldwide</p>
        </section>

        <section className="py-16 max-w-5xl mx-auto px-4">
          {Object.entries(byCountry).map(([country, cities]) => (
            <div key={country} className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{cities[0].flag} {country}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {cities.map((l) => (
                  <div key={l.slug} className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between">
                    <span className="font-semibold">{l.city}</span>
                    <div className="flex gap-3 text-sm">
                      <Link to={`/locations/${l.countrySlug}/${l.slug}`} className="text-brand-600 font-semibold hover:underline">Find a Tutor</Link>
                      <Link to={`/tutor-jobs/${l.countrySlug}/${l.slug}`} className="text-brand-600 font-semibold hover:underline">Tutoring Jobs</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
