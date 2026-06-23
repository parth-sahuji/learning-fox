// Email via Brevo (Sendinblue) Transactional Email API
// Set BREVO_API_KEY and BREVO_SENDER_EMAIL in Render env vars
// BREVO_SENDER_EMAIL must be a verified sender in your Brevo account

const GMAIL_USER = process.env.GMAIL_USER || 'learningfoxx4u@gmail.com'; // shown in email footer only
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || GMAIL_USER;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL_1 || 'Ksl.13021412@gmail.com';

async function sendEmail({ to, subject, html }) {
  if (!BREVO_API_KEY) {
    console.log(`📧 Email skipped (BREVO_API_KEY not set): ${subject} → ${to}`);
    return;
  }
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'Learning Foxx', email: BREVO_SENDER_EMAIL },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    console.log(`✅ Email sent via Brevo: ${subject} → ${to}`);
  } catch (err) {
    console.error('Brevo email error:', err.message);
  }
}

const brandStyle = `
  font-family: 'Arial', sans-serif;
  max-width: 520px;
  margin: 0 auto;
  background: #1a0f05;
  color: #fdf0e8;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(239,117,32,0.3);
`;

const headerStyle = `
  background: linear-gradient(90deg, #7c2d12, #ea580c, #f97316, #ea580c, #7c2d12);
  padding: 20px 24px;
  text-align: center;
`;

function emailWrapper(content) {
  return `
    <div style="${brandStyle}">
      <div style="${headerStyle}">
        <p style="margin:0;font-size:22px;font-weight:900;color:white;letter-spacing:1px;">🦊 Learning Foxx</p>
        <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:2px;">India's Home Tuition Platform</p>
      </div>
      <div style="padding:28px 24px;">
        ${content}
      </div>
      <div style="padding:16px 24px;border-top:1px solid rgba(239,117,32,0.2);text-align:center;">
        <p style="margin:0;font-size:11px;color:#6b4c2a;">
          📞 8340173069 · 
          <a href="mailto:${GMAIL_USER}" style="color:#f97316;">${GMAIL_USER}</a> · 
          <a href="https://wa.me/918340173069" style="color:#25D366;">WhatsApp</a>
        </p>
        <p style="margin:4px 0 0;font-size:10px;color:#4a3520;">
          <a href="https://learningfoxx.com" style="color:#f97316;">learningfoxx.com</a> · Pune, Maharashtra, India
        </p>
      </div>
    </div>
  `;
}

function welcomeStudentEmail({ full_name, email }) {
  return sendEmail({
    to: email,
    subject: '🦊 Welcome to Learning Foxx! Your registration is received',
    html: emailWrapper(`
      <h2 style="color:#f97316;margin:0 0 8px;">Welcome, ${full_name}! 🎉</h2>
      <p style="color:#c49a7a;margin:0 0 16px;">Thank you for registering as a <strong style="color:#fdf0e8;">Student</strong> on Learning Foxx.</p>
      
      <div style="background:rgba(239,117,32,0.08);border:1px solid rgba(239,117,32,0.25);border-radius:12px;padding:16px;margin-bottom:16px;">
        <p style="margin:0 0 8px;color:#f97316;font-weight:bold;">✅ What happens next?</p>
        <ol style="color:#c49a7a;margin:0;padding-left:20px;line-height:1.8;">
          <li>Our admin team will review your profile</li>
          <li>You'll get an approval email within <strong style="color:#fdf0e8;">1–2 business days</strong></li>
          <li>After approval, a qualified home tutor will be matched to you</li>
          <li>Your tutor will visit your home at scheduled times</li>
        </ol>
      </div>

      <p style="color:#c49a7a;">Need help before that?</p>
      <a href="https://wa.me/918340173069?text=Hi%2C%20I%20just%20registered%20on%20Learning%20Foxx%20as%20a%20student." 
        style="display:inline-block;padding:10px 20px;background:#25D366;color:white;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:4px;">
        💬 WhatsApp Us
      </a>
    `),
  });
}

function welcomeTeacherEmail({ full_name, email }) {
  return sendEmail({
    to: email,
    subject: '🦊 Welcome to Learning Foxx! Teacher registration received',
    html: emailWrapper(`
      <h2 style="color:#f97316;margin:0 0 8px;">Welcome, ${full_name}! 📚</h2>
      <p style="color:#c49a7a;margin:0 0 16px;">Thank you for registering as a <strong style="color:#fdf0e8;">Teacher</strong> on Learning Foxx.</p>

      <div style="background:rgba(239,117,32,0.08);border:1px solid rgba(239,117,32,0.25);border-radius:12px;padding:16px;margin-bottom:16px;">
        <p style="margin:0 0 8px;color:#f97316;font-weight:bold;">✅ What happens next?</p>
        <ol style="color:#c49a7a;margin:0;padding-left:20px;line-height:1.8;">
          <li>Our admin will verify your profile and credentials</li>
          <li>You'll receive approval within <strong style="color:#fdf0e8;">1–2 business days</strong></li>
          <li>After approval, students will be assigned to you</li>
          <li>Please log in and upload your Aadhar card in your Profile page</li>
        </ol>
      </div>

      <p style="color:#c49a7a;font-size:13px;">Our admin may contact you on WhatsApp for document verification.</p>
      <a href="https://wa.me/918340173069?text=Hi%2C%20I%20just%20registered%20on%20Learning%20Foxx%20as%20a%20teacher."
        style="display:inline-block;padding:10px 20px;background:#25D366;color:white;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:8px;">
        💬 WhatsApp Us
      </a>
    `),
  });
}

function notifyAdminNewUser({ full_name, email, role, phone }) {
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `🔔 New ${role} registered: ${full_name}`,
    html: emailWrapper(`
      <h2 style="color:#f97316;margin:0 0 16px;">New ${role} Registration</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#c49a7a;width:100px;">Name</td><td style="color:#fdf0e8;font-weight:bold;">${full_name}</td></tr>
        <tr><td style="padding:6px 0;color:#c49a7a;">Email</td><td style="color:#fdf0e8;">${email}</td></tr>
        <tr><td style="padding:6px 0;color:#c49a7a;">Phone</td><td style="color:#fdf0e8;">${phone}</td></tr>
        <tr><td style="padding:6px 0;color:#c49a7a;">Role</td><td style="color:#f97316;font-weight:bold;">${role}</td></tr>
      </table>
      <div style="margin-top:20px;display:flex;gap:12px;">
        <a href="https://learningfoxx.com/admin/vetting"
          style="display:inline-block;padding:10px 20px;background:#f97316;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">
          Review in Admin Panel →
        </a>
        <a href="https://wa.me/91${phone.replace(/\D/g,'')}"
          style="display:inline-block;padding:10px 20px;background:#25D366;color:white;border-radius:8px;text-decoration:none;font-weight:bold;margin-left:8px;">
          WhatsApp User
        </a>
      </div>
    `),
  });
}

function approvalEmail({ full_name, email, role }) {
  return sendEmail({
    to: email,
    subject: '✅ Your Learning Foxx account is approved! You can now login.',
    html: emailWrapper(`
      <h2 style="color:#10b981;margin:0 0 8px;">🎉 Account Approved!</h2>
      <p style="color:#c49a7a;margin:0 0 16px;">Hi <strong style="color:#fdf0e8;">${full_name}</strong>, your Learning Foxx <strong style="color:#f97316;">${role}</strong> account has been approved!</p>
      
      <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:12px;padding:16px;margin-bottom:20px;">
        <p style="margin:0;color:#c49a7a;">You can now log in and access your dashboard. ${role === 'teacher' ? 'Students will be assigned to you shortly.' : 'Your tutor will be assigned to you shortly.'}</p>
      </div>

      <a href="https://learningfoxx.com/login"
        style="display:inline-block;padding:12px 28px;background:#f97316;color:white;border-radius:10px;text-decoration:none;font-weight:bold;font-size:15px;">
        Login to Learning Foxx →
      </a>
    `),
  });
}

function sendResetEmail({ full_name, email, resetLink }) {
  return sendEmail({
    to: email,
    subject: '🔐 Reset Your Learning Foxx Password',
    html: emailWrapper(`
      <h2 style="color:#f97316;margin:0 0 8px;">Reset Your Password</h2>
      <p style="color:#c49a7a;margin:0 0 16px;">Hi <strong style="color:#fdf0e8;">${full_name}</strong>, click the button below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetLink}"
        style="display:inline-block;padding:12px 28px;background:#f97316;color:white;border-radius:10px;text-decoration:none;font-weight:bold;font-size:15px;">
        Reset Password →
      </a>
      <p style="font-size:12px;color:#6b4c2a;margin-top:16px;">If you didn't request this, you can safely ignore this email.</p>
    `),
  });
}

module.exports = { welcomeStudentEmail, welcomeTeacherEmail, notifyAdminNewUser, approvalEmail, sendResetEmail };
