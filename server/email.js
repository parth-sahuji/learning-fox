// Email notifications via Resend (free tier: 3000 emails/month)
// Sign up at resend.com, get API key, add RESEND_API_KEY to Render env vars
// If no API key set, emails are silently skipped (won't break anything)

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'Learning Foxx <noreply@learningfoxx.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL_1 || 'Ksl.13021412@gmail.com';

async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) {
    console.log(`📧 Email skipped (no RESEND_API_KEY): ${subject} → ${to}`);
    return;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8 sec timeout
    const res = await fetch('https://api.resend.com/emails', {
      signal: controller.signal,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (res.ok) console.log(`✅ Email sent: ${subject} → ${to}`);
    else console.error('Email error:', data);
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
}

function welcomeStudentEmail({ full_name, email }) {
  return sendEmail({
    to: email,
    subject: '🦊 Welcome to Learning Foxx! Registration Received',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#1e1409;color:#fdf0e8;padding:32px;border-radius:16px;">
        <img src="https://learningfoxx.com/fox-logo.png" alt="Learning Foxx" style="width:64px;height:64px;border-radius:50%;margin-bottom:16px;" />
        <h2 style="color:#f97316;margin:0 0 8px;">Welcome to Learning Foxx, ${full_name}! 🎉</h2>
        <p style="color:#c49a7a;">Thank you for registering as a <strong style="color:#fdf0e8;">Student</strong>.</p>
        <div style="background:rgba(239,117,32,0.1);border:1px solid rgba(239,117,32,0.3);border-radius:12px;padding:16px;margin:16px 0;">
          <p style="margin:0;color:#fdf0e8;"><strong>What happens next?</strong></p>
          <ul style="color:#c49a7a;margin:8px 0;padding-left:20px;">
            <li>Our admin team is reviewing your profile</li>
            <li>You'll receive a notification once approved (1–2 business days)</li>
            <li>After approval, a qualified tutor will be matched to you</li>
            <li>Your tutor will visit your home for sessions</li>
          </ul>
        </div>
        <p style="color:#c49a7a;">Need help? Contact us:</p>
        <p style="margin:4px 0;"><a href="tel:8340173069" style="color:#f97316;">📞 8340173069</a></p>
        <p style="margin:4px 0;"><a href="https://wa.me/918340173069" style="color:#25D366;">💬 WhatsApp Us</a></p>
        <hr style="border:1px solid rgba(239,117,32,0.2);margin:20px 0;" />
        <p style="font-size:12px;color:#6b4c2a;">Learning Foxx · India's Trusted Home Tuition Platform · learningfoxx.com</p>
      </div>
    `,
  });
}

function welcomeTeacherEmail({ full_name, email }) {
  return sendEmail({
    to: email,
    subject: '🦊 Welcome to Learning Foxx! Teacher Registration Received',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#1e1409;color:#fdf0e8;padding:32px;border-radius:16px;">
        <img src="https://learningfoxx.com/fox-logo.png" alt="Learning Foxx" style="width:64px;height:64px;border-radius:50%;margin-bottom:16px;" />
        <h2 style="color:#f97316;margin:0 0 8px;">Welcome, Teacher ${full_name}! 📚</h2>
        <p style="color:#c49a7a;">Thank you for registering as a <strong style="color:#fdf0e8;">Teacher</strong> on Learning Foxx.</p>
        <div style="background:rgba(239,117,32,0.1);border:1px solid rgba(239,117,32,0.3);border-radius:12px;padding:16px;margin:16px 0;">
          <p style="margin:0;color:#fdf0e8;"><strong>What happens next?</strong></p>
          <ul style="color:#c49a7a;margin:8px 0;padding-left:20px;">
            <li>Our admin will verify your profile and documents</li>
            <li>You'll be approved within 1–2 business days</li>
            <li>After approval, students will be assigned to you</li>
            <li>Please upload your Aadhar card via your Profile page</li>
          </ul>
        </div>
        <p style="color:#c49a7a;">Our admin may contact you on WhatsApp for document verification.</p>
        <p style="margin:4px 0;"><a href="tel:8340173069" style="color:#f97316;">📞 8340173069</a></p>
        <p style="margin:4px 0;"><a href="https://wa.me/918340173069" style="color:#25D366;">💬 WhatsApp Us</a></p>
        <hr style="border:1px solid rgba(239,117,32,0.2);margin:20px 0;" />
        <p style="font-size:12px;color:#6b4c2a;">Learning Foxx · learningfoxx.com</p>
      </div>
    `,
  });
}

function notifyAdminNewUser({ full_name, email, role, phone }) {
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `🔔 New ${role} registered: ${full_name}`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#1e1409;color:#fdf0e8;padding:32px;border-radius:16px;">
        <h2 style="color:#f97316;">New ${role} Registration</h2>
        <table style="width:100%;color:#c49a7a;">
          <tr><td><strong style="color:#fdf0e8;">Name:</strong></td><td>${full_name}</td></tr>
          <tr><td><strong style="color:#fdf0e8;">Email:</strong></td><td>${email}</td></tr>
          <tr><td><strong style="color:#fdf0e8;">Phone:</strong></td><td>${phone}</td></tr>
          <tr><td><strong style="color:#fdf0e8;">Role:</strong></td><td>${role}</td></tr>
        </table>
        <a href="https://learningfoxx.com/admin/vetting" 
          style="display:inline-block;margin-top:16px;padding:12px 24px;background:#f97316;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">
          Review in Admin Panel →
        </a>
        <p style="color:#6b4c2a;font-size:12px;margin-top:16px;">
          WhatsApp: <a href="https://wa.me/91${phone}" style="color:#25D366;">wa.me/91${phone}</a>
        </p>
      </div>
    `,
  });
}

function approvalEmail({ full_name, email, role }) {
  return sendEmail({
    to: email,
    subject: '✅ Your Learning Foxx account has been approved!',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#1e1409;color:#fdf0e8;padding:32px;border-radius:16px;">
        <h2 style="color:#10b981;">🎉 Account Approved!</h2>
        <p style="color:#c49a7a;">Hi <strong style="color:#fdf0e8;">${full_name}</strong>, your Learning Foxx ${role} account has been approved!</p>
        <a href="https://learningfoxx.com/login"
          style="display:inline-block;margin:16px 0;padding:12px 24px;background:#f97316;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">
          Login Now →
        </a>
        <p style="color:#c49a7a;font-size:12px;">Learning Foxx · learningfoxx.com</p>
      </div>
    `,
  });
}

module.exports = { welcomeStudentEmail, welcomeTeacherEmail, notifyAdminNewUser, approvalEmail };
