import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function NewYorkHomeTutors() {
  return (
    <>
      <Helmet>
        <title>Home Tutors in New York City | NYC Private Tutoring - Learning Foxx</title>
        <meta name="description" content="Find verified home tutors in New York City. Expert private tutors for all subjects across Manhattan, Brooklyn, Queens, Bronx. Best home tutoring platform in NYC." />
        <meta name="keywords" content="home tutor NYC, private tutor New York, tutoring NYC, Manhattan tutors, Brooklyn tutors, home tutoring New York City, SAT prep NYC" />
        <link rel="canonical" href="https://www.learningfoxx.com/locations/usa/new-york" />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        
        <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-400 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center">
              <div className="inline-block bg-blue-500/20 border border-blue-400/50 rounded-full px-6 py-2 mb-6">
                <span className="text-blue-300 font-semibold">🗽 New York City, USA</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Premium Home Tutors<br/>
                <span className="bg-gradient-to-r from-yellow-400 to-blue-500 bg-clip-text text-transparent">in New York City</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
                Elite private tutors across Manhattan, Brooklyn, Queens, Bronx & Staten Island
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/find-tutor" className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
                  Find Your NYC Tutor
                </Link>
                <Link to="/become-tutor" className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
                  Teach in NYC
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">NYC Boroughs & Neighborhoods We Serve</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[
                "Upper East Side", "Upper West Side", "Midtown Manhattan", "Downtown Manhattan", "Financial District",
                "Tribeca", "SoHo", "Chelsea", "Greenwich Village", "East Village",
                "Williamsburg", "Park Slope", "Brooklyn Heights", "DUMBO", "Bushwick",
                "Astoria", "Long Island City", "Forest Hills", "Flushing", "Jackson Heights",
                "Riverdale", "Bronx Park", "Pelham Bay", "Fordham", "Kingsbridge",
                "Staten Island", "Hoboken NJ", "Jersey City NJ", "White Plains", "Yonkers"
              ].map((area, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 text-center hover:shadow-lg transition-shadow">
                  <span className="font-semibold text-gray-800">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Popular Subjects in NYC</h2>
            <p className="text-center text-gray-600 mb-12">Expert tutors for all curricula including Common Core, Regents, AP, and IB</p>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { name: "Mathematics", icon: "➕", link: "/subjects/mathematics" },
                { name: "English", icon: "📖", link: "/subjects/english" },
                { name: "Science", icon: "🔬", link: "/subjects/science" },
                { name: "SAT Prep", icon: "📝", link: "/exam-prep/sat" },
                { name: "ACT Prep", icon: "✍️", link: "/exam-prep/act" },
                { name: "Physics", icon: "⚡", link: "/subjects/physics" },
                { name: "Chemistry", icon: "🧪", link: "/subjects/chemistry" },
                { name: "Computer Science", icon: "💻", link: "/subjects/computer-science" },
                { name: "History", icon: "🏛️", link: "/subjects/history" },
                { name: "Economics", icon: "📊", link: "/subjects/economics" }
              ].map((subject, idx) => (
                <Link key={idx} to={subject.link} className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-yellow-500">
                  <div className="text-5xl mb-3">{subject.icon}</div>
                  <div className="font-bold text-gray-800">{subject.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">Test Preparation Specialists</h2>
            <p className="text-center text-blue-200 mb-12">NYC's top tutors for standardized tests and college admissions</p>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { exam: "SAT / PSAT", desc: "College Board test prep" },
                { exam: "ACT", desc: "ACT comprehensive coaching" },
                { exam: "AP Exams", desc: "Advanced Placement courses" },
                { exam: "Regents", desc: "NY State Regents exams" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
                  <h3 className="text-xl font-bold mb-2">{item.exam}</h3>
                  <p className="text-blue-200 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Why NYC Families Choose Learning Foxx</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🎓",
                  title: "Elite Verified Tutors",
                  desc: "Ivy League graduates, certified teachers, subject matter experts with verified credentials and background checks."
                },
                {
                  icon: "🗽",
                  title: "NYC-Specific Expertise",
                  desc: "Tutors familiar with NYC school systems, Regents exams, specialized high schools (Stuyvesant, Bronx Science), and local curricula."
                },
                {
                  icon: "🏡",
                  title: "In-Home Convenience",
                  desc: "Tutors come to your apartment, brownstone, or preferred location anywhere in the 5 boroughs."
                },
                {
                  icon: "💵",
                  title: "Transparent Rates",
                  desc: "Clear hourly pricing with no hidden platform fees. Pay-as-you-go flexibility, no long-term contracts."
                },
                {
                  icon: "🔒",
                  title: "Safety Guaranteed",
                  desc: "All tutors undergo rigorous background checks, identity verification, and reference checks before approval."
                },
                {
                  icon: "📱",
                  title: "24/7 Support",
                  desc: "Admin support available around the clock for scheduling, concerns, or tutor replacements."
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-100">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">NYC Tutoring Rates</h2>
            <p className="text-gray-600 mb-12">Competitive pricing for premium one-on-one instruction</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <h3 className="text-lg font-bold mb-2 text-gray-900">Elementary School</h3>
                <div className="text-4xl font-black text-blue-600 mb-2">$50-80</div>
                <div className="text-sm text-gray-500">per hour</div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-8 border-2 border-blue-600 transform scale-105 shadow-2xl">
                <h3 className="text-lg font-bold mb-2">Middle & High School</h3>
                <div className="text-4xl font-black mb-2">$80-150</div>
                <div className="text-sm opacity-90">per hour</div>
                <div className="mt-4 bg-white/20 rounded-lg px-3 py-1 text-xs font-semibold">Most Popular</div>
              </div>
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <h3 className="text-lg font-bold mb-2 text-gray-900">SAT/ACT/AP Prep</h3>
                <div className="text-4xl font-black text-indigo-600 mb-2">$150-250</div>
                <div className="text-sm text-gray-500">per hour</div>
              </div>
            </div>
            
            <p className="mt-8 text-sm text-gray-600">* Rates vary by tutor experience, credentials, and subject specialization</p>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Your NYC Tutoring Journey</h2>
            <p className="text-xl mb-10 opacity-90">Join hundreds of NYC families achieving academic excellence with Learning Foxx</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/find-tutor" className="bg-white text-orange-600 px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
                Find a Tutor in NYC
              </Link>
              <Link to="/contact" className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
