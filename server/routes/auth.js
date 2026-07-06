const { welcomeStudentEmail, welcomeTeacherEmail, notifyAdminNewUser } = require('../email');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { JWT_SECRET, authenticate } = require('../middleware/auth');
const { uploadRegDocs, uploadBufferToCloudinary } = require('../cloudinary');

const router = express.Router();

const ADMIN_EMAILS = [
  (process.env.ADMIN_EMAIL_1 || 'Ksl.13021412@gmail.com').toLowerCase(),
  (process.env.ADMIN_EMAIL_2 || 'parthcollege1@gmail.com').toLowerCase(),
];

// POST /api/auth/register
router.post('/register', (req, res, next) => {
  uploadRegDocs(req, res, (err) => {
    if (err) {
      console.error('Upload middleware error:', err.message, err.stack);
      return res.status(400).json({ error: 'File upload failed: ' + err.message });
    }
    console.log('Files received:', req.files ? Object.keys(req.files) : 'none');
    console.log('Body keys:', req.body ? Object.keys(req.body) : 'none');
    next();
  });
}, async (req, res) => {
  const {
    email, password, full_name, phone, role, agency_id = 'default',
    // teacher fields — frontend sends teach_class_from / teach_class_to
    teach_class_from, teach_class_to,
    // frontend sends 'subjects' for teacher subjects taught
    subjects: subjects_taught_raw,
    languages,
    education, skills, bio,
    // student fields
    class: studentClass,
    // frontend sends 'subject_needs' for student subjects
    subject_needs,
    days_per_week, address, school_board, locality,
  } = req.body;

  // Resolve field names
  const subjects_taught = subjects_taught_raw || '';
  const class_from = teach_class_from || '';
  const class_to = teach_class_to || '';
  const subjects = subject_needs || '';

  // Basic validation
  if (!email || !password || !full_name || !role)
    return res.status(400).json({ error: 'email, password, full_name, role are required' });
  if (!phone || phone.trim().replace(/\D/g, '').length < 10)
    return res.status(400).json({ error: 'A valid 10-digit phone number is required' });
  if (!['teacher', 'student'].includes(role))
    return res.status(400).json({ error: 'Role must be teacher or student' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  // Role-specific validation
  // Debug: log what files arrived
  console.log('Files received:', req.files ? Object.keys(req.files) : 'none');
  console.log('Body keys:', Object.keys(req.body));

  if (role === 'teacher') {
    // Aadhar optional
    if (!subjects_taught)
      return res.status(400).json({ error: 'Please specify subjects you can teach' });
    if (!languages)
      return res.status(400).json({ error: 'Please specify languages you can speak' });
  }
  if (role === 'student') {
    if (!studentClass)
      return res.status(400).json({ error: 'Please specify your class' });
    if (!subjects)
      return res.status(400).json({ error: 'Please specify subjects you need' });
    if (!address || !address.trim())
      return res.status(400).json({ error: 'Address/location is required' });
  }

  const client = await pool.connect();
  try {
    const existing = await client.query(
      'SELECT id FROM users WHERE email=$1 AND agency_id=$2',
      [email.toLowerCase(), agency_id]
    );
    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'This email is already registered. Please login or use a different email.' });

    const hash = await bcrypt.hash(password, 12);
    const result = await client.query(
      `INSERT INTO users (agency_id, email, password_hash, role, full_name, phone, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id, email, role, full_name, status, agency_id`,
      [agency_id, email.toLowerCase(), hash, role, full_name, phone.trim()]
    );
    const user = result.rows[0];

    if (role === 'teacher') {
      // Upload from memory buffer to Cloudinary
      const aadharUrl = req.files.aadhar_doc
        ? await uploadBufferToCloudinary(req.files.aadhar_doc[0].buffer, 'learningfox/reg_docs', req.files.aadhar_doc[0].originalname)
        : '';
      const resumeUrl = req.files.resume_doc
        ? await uploadBufferToCloudinary(req.files.resume_doc[0].buffer, 'learningfox/reg_docs', req.files.resume_doc[0].originalname)
        : '';
      await client.query(
        `INSERT INTO teacher_profiles
           (agency_id, user_id, aadhar_doc, resume_doc, teach_class_from, teach_class_to, subjects, languages, education, skills, bio)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (user_id) DO NOTHING`,
        [agency_id, user.id, aadharUrl, resumeUrl,
         class_from, class_to, subjects_taught, languages || '',
         education || '', skills || '', bio || '']
      );
    } else {
      await client.query(
        `INSERT INTO student_profiles
           (agency_id, user_id, class, subjects, days_per_week, address, school_board, locality)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (user_id) DO NOTHING`,
        [agency_id, user.id,
         studentClass, subjects,
         parseInt(days_per_week) || 3,
         address.trim(), school_board || '', locality || '']
      );
    }

    res.status(201).json({
      message: 'Registration successful. Please wait for admin approval.',
      user: { id: user.id, email: user.email, role: user.role, status: user.status },
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  } finally {
    client.release();
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password, agency_id = 'default' } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  const client = await pool.connect();
  try {
    const isAdminEmail = ADMIN_EMAILS.includes(email.toLowerCase());
    const result = await client.query(
      'SELECT * FROM users WHERE email=$1 AND agency_id=$2',
      [email.toLowerCase(), agency_id]
    );
    let user = result.rows[0];

    if (!user && isAdminEmail) {
      const hash = await bcrypt.hash(password, 12);
      const created = await client.query(
        `INSERT INTO users (agency_id, email, password_hash, role, full_name, status)
         VALUES ($1,$2,$3,'admin','Platform Admin','approved') RETURNING *`,
        [agency_id, email.toLowerCase(), hash]
      );
      user = created.rows[0];
    }

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role,
        status: user.status, agency_id: user.agency_id, full_name: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role,
              status: user.status, full_name: user.full_name, agency_id: user.agency_id },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  } finally {
    client.release();
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  const client = await pool.connect();
  try {
    const r = await client.query(
      'SELECT id, email, role, full_name, phone, status, agency_id, created_at FROM users WHERE id=$1',
      [req.user.id]
    );
    if (!r.rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json({ user: r.rows[0] });
  } finally { client.release(); }
});

// GET /api/auth/notifications
router.get('/notifications', authenticate, async (req, res) => {
  const client = await pool.connect();
  try {
    const r = await client.query(
      'SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    res.json({ notifications: r.rows });
  } finally { client.release(); }
});

// PUT /api/auth/notifications/read
router.put('/notifications/read', authenticate, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('UPDATE notifications SET is_read=true WHERE user_id=$1', [req.user.id]);
    res.json({ message: 'Marked all as read' });
  } finally { client.release(); }
});


// POST /api/auth/register/student — JSON route, no file uploads
// Separate from teacher route to avoid multer parsing issues
router.post('/register/student', async (req, res) => {
  const {
    email, password, full_name, phone, agency_id = 'default',
    class: studentClass, subjects, school_board,
    days_per_week, address, locality,
  } = req.body;

  if (!email || !password || !full_name || !phone)
    return res.status(400).json({ error: 'email, password, full_name, phone are required' });
  if (phone.replace(/\D/g, '').length < 10)
    return res.status(400).json({ error: 'A valid 10-digit phone number is required' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  if (!studentClass)
    return res.status(400).json({ error: 'Please specify your class' });
  if (!subjects || !subjects.trim())
    return res.status(400).json({ error: 'Please specify subjects you need' });
  if (!address || !address.trim())
    return res.status(400).json({ error: 'Address/location is required' });

  const client = await pool.connect();
  try {
    const existing = await client.query(
      'SELECT id, role FROM users WHERE email=$1 AND agency_id=$2',
      [email.toLowerCase(), agency_id]
    );
    if (existing.rows.length > 0) {
      const existingRole = existing.rows[0].role;
      return res.status(409).json({ error: `This email is already registered as a ${existingRole}. Please login or use a different email.` });
    }

    const hash = await bcrypt.hash(password, 12);
    const result = await client.query(
      `INSERT INTO users (agency_id, email, password_hash, role, full_name, phone, status)
       VALUES ($1,$2,$3,'student',$4,$5,'pending')
       RETURNING id, email, role, full_name, status, agency_id`,
      [agency_id, email.toLowerCase(), hash, full_name, phone.trim()]
    );
    const user = result.rows[0];

    await client.query(
      `INSERT INTO student_profiles (agency_id, user_id, class, subjects, days_per_week, address, school_board, locality)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (user_id) DO NOTHING`,
      [agency_id, user.id, studentClass, subjects.trim(),
       parseInt(days_per_week) || 3, address.trim(),
       school_board || '', locality || '']
    );

    // Send welcome email and admin notification (non-blocking)
    welcomeStudentEmail({ full_name, email: email.toLowerCase() }).catch(() => {});
    notifyAdminNewUser({ full_name, email: email.toLowerCase(), role: 'Student', phone }).catch(() => {});

    res.status(201).json({
      message: 'Registration successful. Please wait for admin approval.',
      user: { id: user.id, email: user.email, role: user.role, status: user.status },
    });
  } catch (err) {
    console.error('Student registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  } finally {
    client.release();
  }
});


// POST /api/auth/upload-doc — upload file to Cloudinary via memory buffer
// Uses manual upload to avoid multer-storage-cloudinary issues in production
router.post('/upload-doc', (req, res) => {
  uploadRegDocs(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message || 'Upload failed' });
    }

    console.log('upload-doc files:', req.files ? Object.keys(req.files) : 'none');
    console.log('upload-doc body keys:', Object.keys(req.body));

    const files = req.files || {};
    const result = {};

    try {
      if (files.aadhar_doc?.[0]?.buffer) {
        result.aadhar_url = await uploadBufferToCloudinary(
          files.aadhar_doc[0].buffer,
          'learningfox/reg_docs',
          files.aadhar_doc[0].originalname
        );
        console.log('Aadhar uploaded:', result.aadhar_url);
      }
      if (files.resume_doc?.[0]?.buffer) {
        result.resume_url = await uploadBufferToCloudinary(
          files.resume_doc[0].buffer,
          'learningfox/reg_docs',
          files.resume_doc[0].originalname
        );
      }

      if (!result.aadhar_url && !result.resume_url) {
        return res.status(400).json({ error: 'No file received — please select your file again' });
      }

      res.json(result);
    } catch (uploadErr) {
      console.error('Cloudinary upload error:', uploadErr);
      res.status(500).json({ error: 'File upload to cloud failed. Check Cloudinary credentials.' });
    }
  });
});


// POST /api/auth/register/teacher — JSON route after files uploaded separately
router.post('/register/teacher', async (req, res) => {
  const {
    email, password, full_name, phone, agency_id = 'default',
    subjects, languages, teach_class_from, teach_class_to,
    education, skills, bio,
    aadhar_url, resume_url,
  } = req.body;

  if (!email || !password || !full_name || !phone)
    return res.status(400).json({ error: 'email, password, full_name, phone are required' });
  if (phone.replace(/\D/g, '').length < 10)
    return res.status(400).json({ error: 'A valid 10-digit phone number is required' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  // Aadhar is optional - admin can collect separately
  if (!subjects)
    return res.status(400).json({ error: 'Please specify subjects you can teach' });
  if (!languages)
    return res.status(400).json({ error: 'Please specify languages you can speak' });

  const client = await pool.connect();
  try {
    const existing = await client.query(
      'SELECT id, role FROM users WHERE email=$1 AND agency_id=$2',
      [email.toLowerCase(), agency_id]
    );
    if (existing.rows.length > 0) {
      const existingRole = existing.rows[0].role;
      return res.status(409).json({ error: `This email is already registered as a ${existingRole}. Please login or use a different email.` });
    }

    const hash = await bcrypt.hash(password, 12);
    const result = await client.query(
      `INSERT INTO users (agency_id, email, password_hash, role, full_name, phone, status)
       VALUES ($1,$2,$3,'teacher',$4,$5,'pending')
       RETURNING id, email, role, full_name, status, agency_id`,
      [agency_id, email.toLowerCase(), hash, full_name, phone.trim()]
    );
    const user = result.rows[0];

    await client.query(
      `INSERT INTO teacher_profiles
         (agency_id, user_id, aadhar_doc, resume_doc, teach_class_from, teach_class_to, subjects, languages, education, skills, bio)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (user_id) DO NOTHING`,
      [agency_id, user.id,
       aadhar_url, resume_url || '',
       teach_class_from || '', teach_class_to || '',
       subjects, languages,
       education || '', skills || '', bio || '']
    );

    // Send welcome email and admin notification (non-blocking)
    welcomeTeacherEmail({ full_name, email: email.toLowerCase() }).catch(() => {});
    notifyAdminNewUser({ full_name, email: email.toLowerCase(), role: 'Teacher', phone }).catch(() => {});

    res.status(201).json({
      message: 'Registration successful. Please wait for admin approval.',
      user: { id: user.id, email: user.email, role: user.role, status: user.status },
    });
  } catch (err) {
    console.error('Teacher registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  } finally { client.release(); }
});


// In-memory token store (use Redis in production for multi-instance)
const resetTokens = new Map(); // token -> { email, agency_id, expires }

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email, agency_id = 'default' } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, email, full_name FROM users WHERE email=$1 AND agency_id=$2',
      [email.toLowerCase(), agency_id]
    );

    // Always return success (don't reveal if email exists)
    res.json({ message: 'If that email is registered, a reset link has been sent.' });

    if (result.rows.length === 0) return;

    const user = result.rows[0];
    const token = require('crypto').randomBytes(32).toString('hex');
    const expires = Date.now() + 60 * 60 * 1000; // 1 hour
    resetTokens.set(token, { email: email.toLowerCase(), agency_id, expires });

    const resetLink = `${process.env.CLIENT_URL?.split(',')[0] || 'https://learningfoxx.com'}/reset-password?token=${token}`;

    const { sendResetEmail } = require('../email');
    sendResetEmail({ full_name: user.full_name, email: user.email, resetLink })
      .catch(err => console.error('Reset email error:', err.message));
  } finally { client.release(); }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token and password are required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const data = resetTokens.get(token);
  if (!data) return res.status(400).json({ error: 'Invalid or expired reset link. Please request a new one.' });
  if (Date.now() > data.expires) {
    resetTokens.delete(token);
    return res.status(400).json({ error: 'This reset link has expired. Please request a new one.' });
  }

  const client = await pool.connect();
  try {
    const hash = await bcrypt.hash(password, 12);
    const result = await client.query(
      'UPDATE users SET password_hash=$1, updated_at=NOW() WHERE email=$2 AND agency_id=$3 RETURNING id',
      [hash, data.email, data.agency_id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });
    resetTokens.delete(token);
    res.json({ message: 'Password reset successfully. You can now login with your new password.' });
  } finally { client.release(); }
});

module.exports = router;
