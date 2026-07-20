import { useState } from 'react';
import { CONTACT_EMAIL } from '../components/StickyHeader';

export const TERMS_TEXT = `TERMS & CONDITIONS — LEARNING FOX

Last Updated: January 2025

By registering on Learning Fox ("the Platform"), you agree to the following terms:

1. OFFLINE CONTACT DISCLAIMER
Learning Fox acts solely as an introduction and management platform. If a teacher and student make direct contact offline (phone, WhatsApp, in-person, social media, or any other means) outside of this platform, Learning Fox bears NO responsibility whatsoever for any agreements, disputes, payments, or outcomes arising from such offline interactions.

2. FEE PAYMENT RESPONSIBILITY
All tuition fees must be processed and confirmed through the Learning Fox platform. If any party skips a monthly fee payment, delays payment, or makes payment arrangements outside the platform, Learning Fox is NOT responsible and will not mediate disputes. The platform owner is not liable for any missed, delayed, or disputed payments made offline.

3. NO RESPONSIBILITY FOR SKIPPED MONTHS
If one or more monthly fee payments are skipped by either party, Learning Fox bears absolutely NO responsibility or liability. It is the sole responsibility of the teacher and student to maintain timely payments through the platform.

4. PRIVACY & CONFIDENTIALITY
Contact details (phone numbers, email addresses, home addresses) shared during registration are visible only to the admin. Teachers and students do not have direct access to each other's personal contact information through the platform. Any information exchanged outside the platform is at the parties' own risk.

5. DOCUMENT VERIFICATION
Teachers are required to upload their Aadhar card for identity verification. This information is stored securely and accessible only to Learning Fox administrators. Submitting false or forged documents is grounds for immediate account termination.

6. PLATFORM USE
The platform is to be used solely for legitimate tutoring arrangements. Any misuse, including providing false information, harassment, or fraudulent activity, will result in immediate termination without refund.

7. ADMIN AUTHORITY
The Learning Fox admin has sole authority to approve/reject registrations, create assignments, set fees, and manage the platform. All admin decisions are final.

8. LIMITATION OF LIABILITY
Learning Fox is not liable for the quality of tutoring, academic results, or any personal disputes between teachers and students. The platform provides a connection service only.

9. AGREEMENT
By checking the "I agree" box during registration, you confirm that you have read, understood, and agreed to all of the above terms.

For queries: 8340173069 | ${CONTACT_EMAIL}`;

export default function TermsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.6)' }}>
      <div className="w-full max-w-2xl bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--border)] 
                      flex flex-col max-h-[85vh] animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <img src="/fox-logo.png" alt="Learning Fox" className="w-8 h-8 rounded-lg object-cover" />
            <div>
              <h2 className="font-display font-bold text-[var(--text-primary)]">Terms & Conditions</h2>
              <p className="text-xs text-[var(--text-secondary)]">Learning Fox Platform</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] hover:bg-red-100 dark:hover:bg-red-950/30
                       flex items-center justify-center text-[var(--text-secondary)] hover:text-red-500 transition-colors">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            {TERMS_TEXT.split('\n\n').map((section, i) => {
              if (section.startsWith('TERMS & CONDITIONS')) {
                return (
                  <div key={i} className="text-center">
                    <h1 className="font-display font-extrabold text-xl text-brand-600 dark:text-brand-400">{section.split('\n')[0]}</h1>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">{section.split('\n')[1]}</p>
                  </div>
                );
              }
              const lines = section.split('\n');
              const heading = lines[0];
              const body = lines.slice(1).join(' ');
              return (
                <div key={i} className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                  <h3 className="font-bold text-sm text-brand-600 dark:text-brand-400 mb-1">{heading}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{body}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-[var(--border)]">
          <button onClick={onClose} className="btn-primary w-full">
            ✓ I have read and understood the Terms
          </button>
        </div>
      </div>
    </div>
  );
}
