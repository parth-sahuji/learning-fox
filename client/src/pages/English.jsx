import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function EnglishTutors() {
  return (
    <>
      <Helmet>
        <title>English Home Tutors | Language & Literature Tutoring - Learning Foxx</title>
        <meta name="description" content="Find expert English tutors for home tuition. Language, Literature, Grammar, Writing, IELTS, TOEFL preparation. Improve reading, writing, and speaking skills." />
        <meta name="keywords" content="English tutor, English language tutor, literature tutor, grammar tutor, IELTS tutor, English home tuition, writing tutor" />
        <link rel="canonical" href="https://www.learningfoxx.com/subjects/english" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        
        <section className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="inline-block bg-white/10 backdrop-blur border border-white/30 rounded-full px-6 py-2 mb-6">
              <span className="font-semibold">📚 Subject</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              English<br/>
              <span className="bg-gradient-to-r from-yellow-300 to-pink-400 bg-clip-text text-transparent">Home Tutors</span>
            </h1>
            <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
              Expert Language & Literature tutoring for all levels - Reading, Writing, Speaking
            </p>
            <Link to="/find-tutor" className="inline-block bg-gradient-to-r from-yellow-400 to-pink-500 text-gray-900 px-10 py-5 rounded-full font-bold hover:shadow-2xl hover:scale-105 transition-all">
              Find an English Tutor
            </Link>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">What We Teach</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "✍️",
                  title: "Language & Grammar",
                  topics: ["Grammar rules", "Vocabulary building", "Sentence structure", "Parts of speech", "Punctuation", "Writing mechanics"]
                },
                {
                  icon: "📖",
                  title: "Literature",
                  topics: ["Poetry analysis", "Novel studies", "Shakespeare", "Drama & plays", "Literary devices", "Critical thinking"]
                },
                {
                  icon: "🗣️",
                  title: "Communication",
                  topics: ["Speaking skills", "Presentation skills", "Essay writing", "Creative writing", "Reading comprehension", "Debate & discussion"]
                }
              ].map((subject, idx) => (
                <div key={idx} className="bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-200 rounded-2xl p-8">
                  <div className="text-6xl mb-4">{subject.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 text-amber-900">{subject.title}</h3>
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

        <section className="py-16 bg-gradient-to-r from-orange-100 to-red-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Curriculum Coverage</h2>
            
            <div className="grid md:grid-cols-5 gap-4">
              {["CBSE English", "ICSE English", "IB English", "IGCSE", "State Boards", "Common Core", "Cambridge", "A-Level", "AP English", "GCSE English"].map((curr, idx) => (
                <div key={idx} className="bg-white border-2 border-orange-200 rounded-xl p-4 text-center font-bold text-gray-800 hover:shadow-lg transition-shadow">
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
                <h3 className="text-2xl font-bold mb-4 text-amber-700">Elementary English</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Phonics & reading</li>
                  <li>✓ Basic grammar</li>
                  <li>✓ Spelling & vocabulary</li>
                  <li>✓ Simple sentences</li>
                  <li>✓ Story writing</li>
                  <li>✓ Reading comprehension</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 text-orange-700">Middle School English</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Advanced grammar</li>
                  <li>✓ Essay writing</li>
                  <li>✓ Literature analysis</li>
                  <li>✓ Poetry & prose</li>
                  <li>✓ Public speaking</li>
                  <li>✓ Research skills</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 text-red-700">High School English</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Literary criticism</li>
                  <li>✓ Academic writing</li>
                  <li>✓ Shakespeare studies</li>
                  <li>✓ Argumentative essays</li>
                  <li>✓ College prep writing</li>
                  <li>✓ SAT/ACT English</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-amber-600 to-red-700 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Test Preparation</h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { exam: "IELTS", detail: "International English test" },
                { exam: "TOEFL", detail: "English proficiency exam" },
                { exam: "SAT Reading", detail: "SAT English section" },
                { exam: "Board Exams", detail: "School board English" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">{item.exam}</h3>
                  <p className="text-amber-200 text-sm">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Master the English Language</h2>
            <p className="text-xl text-gray-600 mb-10">
              Connect with expert English tutors who inspire a love for reading and writing
            </p>
            <Link to="/find-tutor" className="inline-block bg-gradient-to-r from-amber-600 to-red-700 text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
              Find Your English Tutor
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}
