import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function MumbaiHomeTutors() {
  return (
    <>
      <Helmet>
        <title>Home Tuition in Mumbai | Find Home Tutors in Mumbai - Learning Foxx</title>
        <meta name="description" content="Find verified home tutors in Mumbai. Expert private tutors for all subjects across Andheri, Bandra, Borivali, Thane, Navi Mumbai. Best home tuition platform in Mumbai." />
        <meta name="keywords" content="home tuition Mumbai, home tutor Mumbai, private tutor Mumbai, tutoring services Mumbai, home teachers Mumbai, tuition classes Mumbai, Andheri tutors, Bandra tutors" />
        <link rel="canonical" href="https://www.learningfoxx.com/locations/india/mumbai" />
        <meta property="og:title" content="Home Tuition in Mumbai | Learning Foxx" />
        <meta property="og:description" content="Find verified home tutors in Mumbai for all subjects and grades. Trusted platform serving Mumbai, Thane, and Navi Mumbai." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center">
              <div className="inline-block bg-orange-500/20 border border-orange-500/50 rounded-full px-6 py-2 mb-6">
                <span className="text-orange-300 font-semibold">📍 Mumbai, Maharashtra</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Expert Home Tutors<br/>
                <span className="bg-gradient-to-r from-orange-400 to-pink-600 bg-clip-text text-transparent">in Mumbai</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
                Find verified, qualified tutors for all subjects across Mumbai, Thane & Navi Mumbai
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/find-tutor" className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  Find Your Tutor
                </Link>
                <Link to="/become-tutor" className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300">
                  Become a Tutor
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Areas Covered */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Areas We Serve in Mumbai</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                "Andheri East", "Andheri West", "Bandra", "Borivali", "Dadar", "Powai",
                "Malad", "Goregaon", "Kandivali", "Juhu", "Santacruz", "Kurla",
                "Ghatkopar", "Mulund", "Bhandup", "Vikhroli", "Chembur", "Worli",
                "Lower Parel", "Parel", "Thane", "Navi Mumbai", "Vashi", "Nerul",
                "Kharghar", "Panvel", "Kalyan", "Dombivli", "Mira Road", "Vasai"
              ].map((area, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-4 text-center hover:shadow-lg transition-shadow duration-300">
                  <span className="font-semibold text-gray-800">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Subjects */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Popular Subjects in Mumbai</h2>
            <p className="text-center text-gray-600 mb-12">Expert tutors available for CBSE, ICSE, IGCSE, IB, and State Board</p>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { name: "Mathematics", icon: "🔢", link: "/subjects/mathematics" },
                { name: "Science", icon: "🔬", link: "/subjects/science" },
                { name: "English", icon: "📚", link: "/subjects/english" },
                { name: "Physics", icon: "⚛️", link: "/subjects/physics" },
                { name: "Chemistry", icon: "🧪", link: "/subjects/chemistry" },
                { name: "Biology", icon: "🧬", link: "/subjects/biology" },
                { name: "Economics", icon: "💹", link: "/subjects/economics" },
                { name: "Computer Science", icon: "💻", link: "/subjects/computer-science" },
                { name: "Accountancy", icon: "📊", link: "#" },
                { name: "History", icon: "📜", link: "/subjects/history" }
              ].map((subject, idx) => (
                <Link key={idx} to={subject.link} className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-orange-500">
                  <div className="text-5xl mb-3">{subject.icon}</div>
                  <div className="font-bold text-gray-800">{subject.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Exam Prep */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">Exam Preparation Tutors</h2>
            <p className="text-center text-indigo-200 mb-12">Specialized coaching for competitive exams</p>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { exam: "JEE Main & Advanced", desc: "IIT entrance preparation" },
                { exam: "NEET", desc: "Medical entrance coaching" },
                { exam: "MHT-CET", desc: "Maharashtra CET preparation" },
                { exam: "Board Exams", desc: "Class 10 & 12 CBSE/ICSE/SSC" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
                  <h3 className="text-xl font-bold mb-2">{item.exam}</h3>
                  <p className="text-indigo-200 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Why Choose Learning Foxx in Mumbai?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "✓",
                  title: "100% Verified Tutors",
                  desc: "All tutors undergo document verification, background checks, and admin interviews before approval."
                },
                {
                  icon: "🎯",
                  title: "Perfect Match Guarantee",
                  desc: "Admin-vetted matching based on subject expertise, teaching style, and student needs - not algorithms."
                },
                {
                  icon: "🏠",
                  title: "Home & Online Options",
                  desc: "Flexible learning - choose in-home visits or online sessions based on your preference."
                },
                {
                  icon: "💰",
                  title: "Transparent Pricing",
                  desc: "No hidden fees. Clear pricing structure with admin-mediated payment confirmation system."
                },
                {
                  icon: "🛡️",
                  title: "Safety First",
                  desc: "Background-checked tutors, parent-present policy, and 24/7 admin support for any concerns."
                },
                {
                  icon: "📈",
                  title: "Track Progress",
                  desc: "Regular progress reports, feedback system, and open communication between all parties."
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                  <div className="text-5xl mb-4 text-blue-600">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Tuition Fees in Mumbai</h2>
            <p className="text-gray-600 mb-12">Transparent pricing based on subject complexity and tutor experience</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <h3 className="text-lg font-bold mb-2 text-gray-900">Elementary (1-5)</h3>
                <div className="text-4xl font-black text-blue-600 mb-2">₹400-800</div>
                <div className="text-sm text-gray-500">per hour</div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-8 border-2 border-blue-600 transform scale-105 shadow-2xl">
                <h3 className="text-lg font-bold mb-2">Middle & High School</h3>
                <div className="text-4xl font-black mb-2">₹800-1500</div>
                <div className="text-sm opacity-90">per hour</div>
                <div className="mt-4 bg-white/20 rounded-lg px-3 py-1 text-xs font-semibold">Most Popular</div>
              </div>
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <h3 className="text-lg font-bold mb-2 text-gray-900">Competitive Exams</h3>
                <div className="text-4xl font-black text-purple-600 mb-2">₹1500-3000</div>
                <div className="text-sm text-gray-500">per hour</div>
              </div>
            </div>
            
            <p className="mt-8 text-sm text-gray-600">* Prices vary based on tutor qualifications, experience, and subject complexity</p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-pink-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Learning?</h2>
            <p className="text-xl mb-10 opacity-90">Join thousands of Mumbai students achieving academic excellence with Learning Foxx</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/find-tutor" className="bg-white text-orange-600 px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Find a Tutor in Mumbai
              </Link>
              <Link to="/contact" className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
