import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function ScienceTutors() {
  return (
    <>
      <Helmet>
        <title>Science Home Tutors | Physics Chemistry Biology Tutoring - Learning Foxx</title>
        <meta name="description" content="Find expert science tutors for home tuition. Physics, Chemistry, Biology tutoring for all grades. CBSE, ICSE, IB, AP Science preparation by qualified tutors." />
        <meta name="keywords" content="science tutor, physics tutor, chemistry tutor, biology tutor, science home tuition, NEET preparation, science tutoring" />
        <link rel="canonical" href="https://www.learningfoxx.com/subjects/science" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
        
        <section className="bg-gradient-to-r from-green-600 via-teal-600 to-cyan-700 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="inline-block bg-white/10 backdrop-blur border border-white/30 rounded-full px-6 py-2 mb-6">
              <span className="font-semibold">🔬 Subject</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Science<br/>
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Home Tutors</span>
            </h1>
            <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
              Expert Physics, Chemistry & Biology tutoring for all grades and curricula
            </p>
            <Link to="/register?role=student" className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-10 py-5 rounded-full font-bold hover:shadow-2xl hover:scale-105 transition-all">
              Find a Science Tutor
            </Link>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Science Disciplines We Cover</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "⚛️",
                  title: "Physics",
                  topics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics", "Modern Physics", "Waves & Sound"]
                },
                {
                  icon: "🧪",
                  title: "Chemistry",
                  topics: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Chemical Bonding", "Reactions", "Electrochemistry"]
                },
                {
                  icon: "🧬",
                  title: "Biology",
                  topics: ["Cell Biology", "Genetics", "Evolution", "Human Physiology", "Ecology", "Plant Biology"]
                }
              ].map((subject, idx) => (
                <div key={idx} className="bg-gradient-to-br from-green-50 to-teal-100 border-2 border-green-200 rounded-2xl p-8">
                  <div className="text-6xl mb-4">{subject.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 text-green-900">{subject.title}</h3>
                  <ul className="space-y-2 text-gray-700">
                    {subject.topics.map((topic, i) => (
                      <li key={i}>✓ {topic}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-teal-100 to-cyan-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Curriculum Coverage</h2>
            
            <div className="grid md:grid-cols-5 gap-4">
              {["CBSE Science", "ICSE Science", "IB Sciences", "IGCSE", "State Boards", "AP Physics", "AP Chemistry", "AP Biology", "A-Level Sciences", "Cambridge"].map((curr, idx) => (
                <div key={idx} className="bg-white border-2 border-teal-200 rounded-xl p-4 text-center font-bold text-gray-800 hover:shadow-lg transition-shadow">
                  {curr}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Topics by Grade Level</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-green-700">Elementary Science</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Basic biology concepts</li>
                  <li>✓ Simple machines</li>
                  <li>✓ Earth & space</li>
                  <li>✓ Weather & seasons</li>
                  <li>✓ Living organisms</li>
                  <li>✓ Scientific method</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 text-teal-700">Middle School Science</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ General Science (Integrated)</li>
                  <li>✓ Basic Chemistry concepts</li>
                  <li>✓ Physics fundamentals</li>
                  <li>✓ Human body systems</li>
                  <li>✓ Ecosystems & environment</li>
                  <li>✓ Lab skills & experiments</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 text-cyan-700">High School Science</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Advanced Physics (11-12)</li>
                  <li>✓ Organic & Inorganic Chem</li>
                  <li>✓ Molecular Biology</li>
                  <li>✓ Genetics & Evolution</li>
                  <li>✓ Practical lab work</li>
                  <li>✓ Research & projects</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-green-600 to-cyan-700 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Exam Preparation</h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { exam: "Board Exams", detail: "CBSE/ICSE/State Boards" },
                { exam: "NEET", detail: "Medical entrance exam" },
                { exam: "JEE", detail: "Engineering entrance" },
                { exam: "Olympiads", detail: "Science Olympiad prep" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">{item.exam}</h3>
                  <p className="text-green-200 text-sm">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Discover the Joy of Science</h2>
            <p className="text-xl text-gray-600 mb-10">
              Connect with passionate science tutors who bring concepts to life
            </p>
            <Link to="/register?role=student" className="inline-block bg-gradient-to-r from-green-600 to-cyan-700 text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
              Find Your Science Tutor
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}
