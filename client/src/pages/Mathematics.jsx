import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function MathematicsTutors() {
  return (
    <>
      <Helmet>
        <title>Mathematics Home Tutors | Expert Math Tuition - Learning Foxx</title>
        <meta name="description" content="Find qualified mathematics tutors for home tuition. Expert one-on-one math tutoring for all grades from elementary to college. CBSE, ICSE, IB, AP, SAT Math preparation." />
        <meta name="keywords" content="math tutor, mathematics tuition, algebra tutor, calculus tutor, geometry tutor, math home tutor, SAT math prep, JEE mathematics" />
        <link rel="canonical" href="https://www.learningfoxx.com/subjects/mathematics" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        
        <section className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="inline-block bg-white/10 backdrop-blur border border-white/30 rounded-full px-6 py-2 mb-6">
              <span className="font-semibold">📐 Subject</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Mathematics<br/>
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Home Tutors</span>
            </h1>
            <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
              Expert one-on-one math tutoring for all grades and curricula worldwide
            </p>
            <Link to="/find-tutor" className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-10 py-5 rounded-full font-bold hover:shadow-2xl hover:scale-105 transition-all">
              Find a Math Tutor
            </Link>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Why Mathematics Tutoring?</h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Mathematics is fundamental to academic success and critical thinking. Our expert tutors make complex concepts simple and build strong foundations.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Personalized Learning",
                  desc: "One-on-one attention tailored to your learning pace and style. No more feeling lost in crowded classrooms."
                },
                {
                  title: "Concept Mastery",
                  desc: "Focus on understanding WHY, not just HOW. Build strong mathematical reasoning and problem-solving skills."
                },
                {
                  title: "Exam Excellence",
                  desc: "Targeted preparation for board exams, competitive tests, SAT, JEE, and all major mathematics assessments."
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-3 text-blue-900">{item.title}</h3>
                  <p className="text-gray-700">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-indigo-100 to-purple-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Curriculum Coverage</h2>
            
            <div className="grid md:grid-cols-5 gap-4">
              {["CBSE", "ICSE", "IB (SL/HL)", "IGCSE", "State Boards", "Common Core", "Regents", "A-Level", "AP Calculus", "Cambridge"].map((curr, idx) => (
                <div key={idx} className="bg-white border-2 border-indigo-200 rounded-xl p-4 text-center font-bold text-gray-800 hover:shadow-lg transition-shadow">
                  {curr}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Topics We Cover</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-blue-700">Elementary (Grades 1-5)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Number sense & operations</li>
                  <li>✓ Basic arithmetic (+ - × ÷)</li>
                  <li>✓ Fractions & decimals</li>
                  <li>✓ Geometry basics</li>
                  <li>✓ Measurement & data</li>
                  <li>✓ Word problems</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 text-indigo-700">Middle School (Grades 6-8)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Pre-Algebra fundamentals</li>
                  <li>✓ Ratios & proportions</li>
                  <li>✓ Linear equations</li>
                  <li>✓ Geometry & shapes</li>
                  <li>✓ Statistics & probability</li>
                  <li>✓ Integers & exponents</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 text-purple-700">High School (Grades 9-12)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Algebra I & II</li>
                  <li>✓ Trigonometry</li>
                  <li>✓ Calculus (Differential & Integral)</li>
                  <li>✓ Coordinate geometry</li>
                  <li>✓ Matrices & determinants</li>
                  <li>✓ Complex numbers</li>
                  <li>✓ Vectors & 3D geometry</li>
                  <li>✓ Differential equations</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Exam Preparation</h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { exam: "Board Exams", detail: "Class 10, 12 all boards" },
                { exam: "SAT Math", detail: "SAT & PSAT preparation" },
                { exam: "JEE Mathematics", detail: "JEE Main & Advanced" },
                { exam: "Olympiads", detail: "Math Olympiad training" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">{item.exam}</h3>
                  <p className="text-blue-200 text-sm">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Ready to Excel in Mathematics?</h2>
            <p className="text-xl text-gray-600 mb-10">
              Connect with expert math tutors who make learning engaging and effective
            </p>
            <Link to="/find-tutor" className="inline-block bg-gradient-to-r from-blue-600 to-purple-700 text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
              Find Your Math Tutor Now
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}
