import { Link } from 'react-router-dom';
import { SUPPORT_EMAIL } from '../components/StickyHeader';
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]" style={{paddingTop:'68px'}}>
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <img src="/fox-logo.png" alt="Learning Foxx" className="w-16 h-16 mx-auto object-contain mb-3"
            style={{filter:'drop-shadow(0 4px 12px rgba(239,117,32,0.35))'}} />
          <h1 className="font-display text-3xl font-bold" style={{
            background:'linear-gradient(135deg,#ef7520,#b94612)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'
          }}>Terms & Conditions</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-2">Last updated: January 2025 · Learning Foxx Tuition Platform</p>
        </div>

        <div className="card space-y-6 text-sm text-[var(--text-primary)] leading-relaxed">

          <section>
            <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">1. About Learning Foxx</h2>
            <p className="text-[var(--text-secondary)]">
              Learning Foxx is an online platform that connects students seeking home tuition with qualified home tutors in India.
              We act solely as an <strong className="text-[var(--text-primary)]">intermediary / broker</strong> between teachers and students.
              We do not provide tuition services directly and are not a party to the educational services agreement between
              teachers and students.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">2. Offline Arrangements — Disclaimer</h2>
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500">
              <p className="font-semibold text-red-700 dark:text-red-400 mb-2">⚠️ Important Notice</p>
              <p className="text-red-600 dark:text-red-400">
                Learning Foxx is <strong>strictly not responsible</strong> for any consequences arising from offline arrangements
                made directly between teachers and students outside of this platform. This includes but is not limited to:
              </p>
              <ul className="mt-2 space-y-1 text-red-600 dark:text-red-400 list-disc list-inside">
                <li>Direct payments made by students to teachers outside the platform</li>
                <li>Any private financial agreements not recorded on Learning Foxx</li>
                <li>Fee disputes, non-payment, or refund claims for offline transactions</li>
                <li>Personal disagreements or issues arising from private contact</li>
                <li>Any harm, loss, or damage arising from offline meetings</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">3. Fee Payment Policy</h2>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li className="flex items-start gap-2"><span className="text-amber-500 font-bold flex-shrink-0">•</span>
                  All fee amounts are set exclusively by the admin/platform owner. Teachers have no visibility of fee amounts charged to students — the platform maintains the fee structure on behalf of both parties.</li>
                <li className="flex items-start gap-2"><span className="text-amber-500 font-bold flex-shrink-0">•</span>
                  Fees are pre-paid on a monthly basis. Payment confirmation requires both the student and teacher to independently confirm the transaction.</li>
                <li className="flex items-start gap-2"><span className="text-amber-500 font-bold flex-shrink-0">•</span>
                  <strong className="text-[var(--text-primary)]">If even one month's fee is skipped</strong>, Learning Foxx takes no responsibility for the continuation of services or any resulting disputes. The platform owner is not liable for any financial loss arising from missed payments.</li>
                <li className="flex items-start gap-2"><span className="text-amber-500 font-bold flex-shrink-0">•</span>
                  Payments are made offline (cash or bank transfer). The platform only records confirmations — it does not process payments.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">4. Privacy & Confidentiality</h2>
            <p className="text-[var(--text-secondary)]">
              To protect both parties, contact details (phone numbers, email addresses) of teachers are not shared with students,
              and student contact details are not shared with teachers through the platform. Only the Admin has access to full
              contact information. Any sharing of personal contact details outside the platform is done at the user's own risk,
              and Learning Foxx bears no responsibility for any outcomes thereof.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">5. Teacher Verification</h2>
            <p className="text-[var(--text-secondary)]">
              Teachers are required to submit a valid Aadhar card and resume during registration. While Learning Foxx reviews
              these documents as part of the approval process, we do not guarantee the authenticity of all claims made by teachers.
              Students are advised to exercise their own judgment. Learning Foxx is not liable for any misrepresentation by teachers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">6. Platform Usage Rules</h2>
            <ul className="space-y-1 text-[var(--text-secondary)] list-disc list-inside">
              <li>Users must provide accurate information during registration</li>
              <li>Accounts found to contain false information may be terminated without notice</li>
              <li>Users must not attempt to solicit other users to bypass the platform</li>
              <li>Any abusive, fraudulent, or illegal behavior will result in immediate account suspension</li>
              <li>The platform reserves the right to assign or remove teacher-student pairings</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">7. Limitation of Liability</h2>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <p className="text-[var(--text-secondary)]">
                Learning Foxx (including its owners, administrators, and employees) shall not be held liable for:
              </p>
              <ul className="mt-2 space-y-1 text-[var(--text-secondary)] list-disc list-inside">
                <li>Any financial loss from offline fee payments or disputes</li>
                <li>Academic results or performance of students under tutors</li>
                <li>Any personal harm arising from teacher-student meetings</li>
                <li>Technical errors, downtime, or data loss on the platform</li>
                <li>Any indirect, incidental, or consequential damages</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">8. Governing Law</h2>
            <p className="text-[var(--text-secondary)]">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be
              subject to the exclusive jurisdiction of the courts in Pune, Maharashtra, India.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">9. Contact</h2>
            <p className="text-[var(--text-secondary)]">
              For any questions about these Terms, please contact us:
            </p>
            <div className="mt-2 flex flex-col gap-1">
              <a href="tel:8340173069" className="text-brand-500 hover:text-brand-600 font-medium">📞 8340173069</a>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-500 hover:text-brand-600 font-medium">✉️ {SUPPORT_EMAIL}</a>
              <a href="https://wa.me/918340173069" className="text-brand-500 hover:text-brand-600 font-medium">💬 WhatsApp: wa.me/918340173069</a>
            </div>
          </section>
        </div>

        <div className="text-center mt-6">
          <Link to="/login" className="btn-secondary inline-block">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
