import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function LondonHomeTutors() {
  return (
    <>
      <Helmet>
        <title>Home Tutors in London | Private Tutoring London - Learning Foxx</title>
        <meta name="description" content="Find verified home tutors in London. Expert private tutors for all subjects across Central, North, South, East, West London. GCSE, A-Level, 11+ tutoring." />
        <meta name="keywords" content="home tutor London, private tutor London, tutoring London, GCSE tutors, A-Level tutors, 11+ tutors, home tutoring London UK" />
        <link rel="canonical" href="https://www.learningfoxx.com/locations/uk/london" />
      </Helmet>

      <div className="min-h-screen bg-stone-50">
        
        <section className="relative bg-gradient-to-br from-slate-800 via-red-900 to-blue-900 text-white py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="inline-block bg-red-500/20 border border-red-400/50 rounded-full px-6 py-2 mb-6">
                <span className="text-red-300 font-semibold">🇬🇧 London, UK</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6">
                Expert Home Tutors<br/>
                <span className="bg-gradient-to-r from-red-400 to-blue-500 bg-clip-text text-transparent">in London</span>
              </h1>
              <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                Qualified private tutors - GCSE, A-Level, 11+ and Primary
              </p>
              <Link to="/find-tutor" className="inline-block bg-gradient-to-r from-red-600 to-blue-700 px-10 py-5 rounded-full font-bold hover:shadow-2xl transition-all">
                Find Your Tutor
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">London Areas We Cover</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {["Westminster", "Kensington", "Chelsea", "Camden", "Islington", "Hampstead", "Wandsworth", "Battersea", "Clapham", "Canary Wharf", "Stratford", "Ealing", "Richmond", "Croydon", "Bromley"].map((area, i) => (
                <div key={i} className="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
                  <span className="font-semibold">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-stone-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Popular Subjects</h2>
            <div className="grid md:grid-cols-5 gap-6">
              {[
                { name: "Maths", icon: "🔢" },
                { name: "English", icon: "📚" },
                { name: "Science", icon: "🔬" },
                { name: "Physics", icon: "⚛️" },
                { name: "Chemistry", icon: "🧪" }
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition-all">
                  <div className="text-5xl mb-3">{s.icon}</div>
                  <div className="font-bold">{s.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-red-600 to-blue-700 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-5xl font-bold mb-6">Ready to Start?</h2>
            <Link to="/find-tutor" className="inline-block bg-white text-red-600 px-10 py-5 rounded-full font-bold hover:scale-105 transition-all">
              Find a London Tutor
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}
