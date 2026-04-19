import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function HowItWorks() {
  return (
    <>
      <Helmet>
        <title>How It Works - Learning Foxx | Home Tuition Process Explained</title>
        <meta name="description" content="Learn how Learning Foxx connects students with verified home tutors. Simple 5-step process for students and tutors. Get started with home tuition today." />
        <meta name="keywords" content="how home tuition works, tutor matching process, find home tutor process, online tutoring platform, Learning Foxx process" />
        <link rel="canonical" href="https://www.learningfoxx.com/how-it-works" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-pink-600 bg-clip-text text-transparent">
              How Learning Foxx Works
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our admin-vetted matching system ensures quality connections between students and verified tutors worldwide
            </p>
          </div>

          {/* For Students Section */}
          <section className="mb-24">
            <h2 className="text-4xl font-bold mb-12 text-center text-orange-400">For Students & Parents</h2>
            
            <div className="grid md:grid-cols-5 gap-8">
              {[
                {
                  step: 1,
                  title: "Register",
                  description: "Sign up with your details, location, subjects needed, and preferred schedule. Registration is free and takes under 5 minutes.",
                  icon: "📝"
                },
                {
                  step: 2,
                  title: "Verification",
                  description: "Our admin team reviews your profile to understand your learning needs and verify your information for safety.",
                  icon: "✓"
                },
                {
                  step: 3,
                  title: "Perfect Match",
                  description: "Admin manually matches you with a verified tutor based on subject expertise, location, availability, and teaching style.",
                  icon: "🎯"
                },
                {
                  step: 4,
                  title: "Start Learning",
                  description: "Your tutor visits your home for personalized one-on-one sessions. Set your own pace and learning goals.",
                  icon: "📚"
                },
                {
                  step: 5,
                  title: "Monthly Payment",
                  description: "Confirm monthly fees through our secure platform. Dual confirmation ensures transparency for all parties.",
                  icon: "💳"
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-orange-400 font-bold text-sm mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/find-tutor" className="inline-block bg-gradient-to-r from-orange-500 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Find Your Perfect Tutor →
              </Link>
            </div>
          </section>

          {/* For Tutors Section */}
          <section className="mb-24">
            <h2 className="text-4xl font-bold mb-12 text-center text-pink-400">For Tutors</h2>
            
            <div className="grid md:grid-cols-5 gap-8">
              {[
                {
                  step: 1,
                  title: "Apply",
                  description: "Register with your qualifications, subjects, experience, and upload required documents (ID proof, degrees, resume).",
                  icon: "📄"
                },
                {
                  step: 2,
                  title: "Document Check",
                  description: "Our admin team verifies all documents, qualifications, and conducts background checks to ensure student safety.",
                  icon: "🔍"
                },
                {
                  step: 3,
                  title: "Get Matched",
                  description: "Admin assigns you to suitable students based on your expertise, location, and availability. No algorithm - real human matching.",
                  icon: "👥"
                },
                {
                  step: 4,
                  title: "Teach",
                  description: "Visit student's home at scheduled times. Deliver personalized quality education and track student progress.",
                  icon: "🎓"
                },
                {
                  step: 5,
                  title: "Get Paid",
                  description: "Confirm payment receipt monthly through platform. Transparent fee structure with admin mediation if needed.",
                  icon: "💰"
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-pink-400 font-bold text-sm mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/become-tutor" className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Start Teaching Today →
              </Link>
            </div>
          </section>

          {/* Why Our Process is Different */}
          <section className="mb-24 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Our Process is Different</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3 text-orange-400">🛡️ Admin-Vetted Matching</h3>
                <p className="text-gray-300">No algorithms. Real humans review every profile and make thoughtful matches based on compatibility, not just availability.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-pink-400">🔒 Safety First</h3>
                <p className="text-gray-300">100% document verification, background checks, and ongoing quality monitoring. Your safety is our top priority.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-purple-400">💎 Transparent Fees</h3>
                <p className="text-gray-300">Dual payment confirmation system. Admin mediates any disputes. No hidden charges, ever.</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  q: "How long does the matching process take?",
                  a: "Typically 24-48 hours after your profile is verified. We prioritize quality matches over speed."
                },
                {
                  q: "Can I request a different tutor if not satisfied?",
                  a: "Absolutely! Contact admin immediately and we'll arrange a replacement tutor based on your feedback."
                },
                {
                  q: "Is there a minimum commitment period?",
                  a: "No long-term contracts. You can discontinue anytime with proper notice to your tutor."
                },
                {
                  q: "How do I pay my tutor?",
                  a: "All payments are confirmed through our platform monthly. Both parties confirm payment for transparency."
                },
                {
                  q: "What if I need to cancel a session?",
                  a: "Give at least 24 hours notice to your tutor. Respect their time as they've reserved it for you."
                },
                {
                  q: "Do tutors need special qualifications?",
                  a: "Yes. We verify degrees, experience, and conduct background checks. Only qualified tutors are approved."
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <h3 className="font-bold mb-2 text-orange-400">{faq.q}</h3>
                  <p className="text-gray-300 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
