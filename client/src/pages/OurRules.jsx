import React from 'react';
import { Helmet } from 'react-helmet';
import { CONTACT_EMAIL } from '../components/StickyHeader';

export default function OurRules() {
  return (
    <>
      <Helmet>
        <title>Our Rules & Guidelines - Learning Foxx | Community Code of Conduct</title>
        <meta name="description" content="Learning Foxx community guidelines and rules for students, parents, and tutors. Safe, professional, and respectful home tuition platform. Read our code of conduct." />
        <meta name="keywords" content="tutoring rules, platform guidelines, code of conduct, home tuition safety, tutor standards, Learning Foxx policies" />
        <link rel="canonical" href="https://www.learningfoxx.com/our-rules" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Our Community Rules
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Creating a safe, professional, and respectful learning environment for everyone
            </p>
          </div>

          {/* For Students & Parents */}
          <section className="mb-20">
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-3xl p-10">
              <h2 className="text-3xl font-bold mb-8 text-cyan-400 flex items-center gap-3">
                <span>👨‍👩‍👧</span> For Students & Parents
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Respect Your Tutor's Time",
                    points: [
                      "Be ready for sessions at scheduled times",
                      "Give 24 hours notice for cancellations",
                      "Arrive prepared with materials and homework",
                      "Inform tutor in advance if running late"
                    ]
                  },
                  {
                    title: "Maintain a Learning Environment",
                    points: [
                      "Provide quiet, distraction-free study space",
                      "Ensure proper lighting and seating",
                      "Minimize interruptions during sessions",
                      "Keep pets and siblings away from study area"
                    ]
                  },
                  {
                    title: "Payment & Fees",
                    points: [
                      "Pay tuition fees on time each month",
                      "Confirm payments through platform only",
                      "Never make direct cash payments to tutors",
                      "Discuss fee changes with admin, not tutor"
                    ]
                  },
                  {
                    title: "Communication & Feedback",
                    points: [
                      "Provide honest feedback about progress",
                      "Report any issues to admin immediately",
                      "Communicate concerns professionally",
                      "Keep admin informed of schedule changes"
                    ]
                  },
                  {
                    title: "Safety & Conduct",
                    points: [
                      "Parent/guardian must be home during sessions",
                      "No recording without tutor's consent",
                      "Respect tutor's professional boundaries",
                      "Report inappropriate behavior immediately"
                    ]
                  }
                ].map((rule, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 text-white">{rule.title}</h3>
                    <ul className="space-y-2">
                      {rule.points.map((point, pidx) => (
                        <li key={pidx} className="flex items-start gap-3">
                          <span className="text-cyan-400 mt-1">✓</span>
                          <span className="text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* For Tutors */}
          <section className="mb-20">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-3xl p-10">
              <h2 className="text-3xl font-bold mb-8 text-purple-400 flex items-center gap-3">
                <span>👨‍🏫</span> For Tutors
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Professionalism Standards",
                    points: [
                      "Dress appropriately and maintain hygiene",
                      "Arrive on time for all scheduled sessions",
                      "Inform student 24 hours before cancellations",
                      "Maintain professional conduct at all times",
                      "No personal relationships with students"
                    ]
                  },
                  {
                    title: "Teaching Quality",
                    points: [
                      "Prepare lesson plans before each session",
                      "Provide quality education and explanations",
                      "Track and report student progress",
                      "Adapt teaching methods to student's needs",
                      "Give homework and practice assignments"
                    ]
                  },
                  {
                    title: "Privacy & Confidentiality",
                    points: [
                      "Respect student and family privacy",
                      "Never share student information publicly",
                      "Keep academic performance confidential",
                      "Do not take photos/videos without consent",
                      "Professional boundaries with families"
                    ]
                  },
                  {
                    title: "Payment & Platform Use",
                    points: [
                      "NEVER collect cash directly from students",
                      "All payments MUST go through platform",
                      "Confirm payment receipts monthly via system",
                      "Report payment issues to admin only",
                      "No side arrangements outside platform"
                    ]
                  },
                  {
                    title: "Safety & Compliance",
                    points: [
                      "Background check compliance mandatory",
                      "Keep documents updated (ID, degrees)",
                      "Report any safety concerns to admin",
                      "Follow child protection policies strictly",
                      "Never be alone with minor students (parent must be home)"
                    ]
                  }
                ].map((rule, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 text-white">{rule.title}</h3>
                    <ul className="space-y-2">
                      {rule.points.map((point, pidx) => (
                        <li key={pidx} className="flex items-start gap-3">
                          <span className="text-purple-400 mt-1">✓</span>
                          <span className="text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* General Community Rules */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-3xl p-10">
              <h2 className="text-3xl font-bold mb-8 text-orange-400 flex items-center gap-3">
                <span>⚖️</span> General Community Rules
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Zero Tolerance Policy",
                    desc: "Harassment, discrimination, or abuse of any kind results in immediate permanent ban from the platform. We protect all community members."
                  },
                  {
                    title: "No Discrimination",
                    desc: "Discrimination based on race, religion, gender, caste, nationality, sexual orientation, or disability is strictly prohibited."
                  },
                  {
                    title: "Honest Representation",
                    desc: "All qualifications, experience, and personal information must be truthful. Fake credentials result in permanent account termination."
                  },
                  {
                    title: "Platform-Only Payments",
                    desc: "ALL financial transactions MUST go through Learning Foxx platform. Direct payments void our safety guarantees and violate terms."
                  },
                  {
                    title: "Confidentiality Required",
                    desc: "Personal information shared on platform is confidential. Sharing user data publicly violates privacy policy and results in ban."
                  },
                  {
                    title: "Report Issues Immediately",
                    desc: "Any violation of these rules, safety concerns, or inappropriate behavior must be reported to admin within 24 hours."
                  }
                ].map((rule, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-3 text-orange-400">{rule.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{rule.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Consequences */}
          <section className="mb-16">
            <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-10">
              <h2 className="text-2xl font-bold mb-6 text-red-400">⚠️ Consequences for Rule Violations</h2>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-sm shrink-0">MINOR</div>
                  <div>
                    <p className="font-bold mb-1">First Offense</p>
                    <p className="text-gray-300 text-sm">Warning issued, documented in profile. Second warning results in suspension.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-lg font-bold text-sm shrink-0">MODERATE</div>
                  <div>
                    <p className="font-bold mb-1">Serious Violations</p>
                    <p className="text-gray-300 text-sm">Account suspension for 30 days. Reinstatement requires admin review and commitment letter.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm shrink-0">SEVERE</div>
                  <div>
                    <p className="font-bold mb-1">Major Violations</p>
                    <p className="text-gray-300 text-sm">Immediate permanent ban. Harassment, abuse, fraud, fake credentials, or safety violations = lifetime ban.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Agreement */}
          <section className="text-center bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-10">
            <h2 className="text-2xl font-bold mb-4">By Using Learning Foxx, You Agree To:</h2>
            <div className="max-w-3xl mx-auto text-gray-300 space-y-2 mb-8">
              <p>✓ Follow all rules and guidelines outlined above</p>
              <p>✓ Maintain professional, respectful conduct at all times</p>
              <p>✓ Report violations and safety concerns immediately</p>
              <p>✓ Use platform payment system exclusively</p>
              <p>✓ Accept consequences for rule violations</p>
            </div>
            
            <div className="bg-orange-500/20 border border-orange-500/50 rounded-xl p-6 max-w-2xl mx-auto">
              <p className="text-sm text-gray-300">
                <strong className="text-orange-400">Questions about rules?</strong><br/>
                Contact admin at <a href={`mailto:${CONTACT_EMAIL}`} className="text-cyan-400 hover:underline">{CONTACT_EMAIL}</a> or call <a href="tel:+918340173069" className="text-cyan-400 hover:underline">+91-8340173069</a>
              </p>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
