const { welcomeStudentEmail, welcomeTeacherEmail, notifyAdminNewUser } = require('../email');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { JWT_SECRET, authenticate } = require('../middleware/auth');
const { uploadRegDocs, REG_DOC_MIMES } = require('../multerConfig');
const { uploadBufferToSupabase, docPath, extFromName } = require('../supabaseStorage');
const { requireRealType } = require('../utils/fileSignature');
const { validate } = require('../validation/validate');
const schemas = require('../validation/schemas');
const { isLocked, afterFailedLogin } = require('../middleware/accountLockout');

const router = express.Router();

// Checks the buffered content of each present doc field against its declared type.
// Throws (statusCode 400) on mismatch — caller is expected to be inside a try/catch.
function checkDocContents(files) {
  if (files.aadhar_doc?.[0]) requireRealType(files.aadhar_doc[0].buffer, REG_DOC_MIMES, 'Aadhar document');
  if (files.resume_doc?.[0]) requireRealType(files.resume_doc[0].buffer, REG_DOC_MIMES, 'Resume');
}

// POST /api/auth/register
router.post('/register', (req, res, next) => {
  uploadRegDocs(req, res, (err) => {
    if (err) {
      console.error('Upload middleware error:', err);
      return res.status(400).json({ error: 'File upload failed: ' + err.message });
    }
    next();
  });
}, validate(schemas.registerCombined), async (req, res) => {
  const {
    email, password, full_name, phone, role, agency_id,
    teach_class_from, teach_class_to,
    subjects: subjects_taught_raw,
    languages,
    education, skills, bio,
    class: studentClass,
    subject_needs,
    days_per_week, address, school_board, locality,
  } = req.body;

  const subjects_taught = subjects_taught_raw || '';
  const class_from = teach_class_from || '';
  const class_to = teach_class_to || '';
  const subjects = subject_needs || '';

  // Role-specific requiredness (conditional on role, so not expressed in the schema itself)
  if (role === 'teacher') {
    if (!subjects_taught) return res.status(400).json({ error: 'Please specify subjects you can teach' });
    if (!languages) return res.status(400).json({ error: 'Please specify languages you can speak' });
  }
  if (role === 'student') {
    if (!studentClass) return res.status(400).json({ error: 'Please specify your class' });
    if (!subjects) return res.status(400).json({ error: 'Please specify subjects you need' });
    if (!address) return res.status(400).json({ error: 'Address/location is required' });
  }

  try {
    checkDocContents(req.files || {});
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await client.query(
      'SELECT id FROM users WHERE email=$1 AND agency_id=$2',
      [email, agency_id]
    );
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'This email is already registered. Please login or use a different email.' });
    }

    const hash = await bcrypt.hash(password, 12);
    const result = await client.query(
      `INSERT INTO users (agency_id, email, password_hash, role, full_name, phone, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id, email, role, full_name, status, agency_id`,
      [agency_id, email, hash, role, full_name, phone]
    );
    const user = result.rows[0];

    if (role === 'teacher') {
      const aadharUrl = req.files?.aadhar_doc
        ? await uploadBufferToSupabase(
            req.files.aadhar_doc[0].buffer,
            docPath('teacher', user.id, 'aadhar', extFromName(req.files.aadhar_doc[0].originalname)),
            req.files.aadhar_doc[0].mimetype
          )
        : '';
      const resumeUrl = req.files?.resume_doc
        ? await uploadBufferToSupabase(
            req.files.resume_doc[0].buffer,
            docPath('teacher', user.id, 'resume', extFromName(req.files.resume_doc[0].originalname)),
            req.files.resume_doc[0].mimetype
          )
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
         days_per_week || 3,
         address, school_board || '', locality || '']
      );
    }

    await client.query('COMMIT');
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role,
        status: user.status, agency_id: user.agency_id, full_name: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({
      message: 'Registration successful. Please wait for admin approval.',
      token,
      user: { id: user.id, email: user.email, role: user.role, status: user.status },
    });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  } finally {
    client.release();
  }
});

// POST /api/auth/login
router.post('/login', validate(schemas.login), async (req, res) => {
  const { email, password, agency_id } = req.body;

  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE email=$1 AND agency_id=$2',
      [email, agency_id]
    );
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const lock = isLocked(user);
    if (lock.locked) {
      return res.status(429).json({ error: `Too many failed attempts. Try again in ${lock.retryAfterSeconds}s.` });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      const { attempts, lockoutUntil } = afterFailedLogin(user);
      await client.query(
        'UPDATE users SET failed_login_attempts=$1, lockout_until=$2 WHERE id=$3',
        [attempts, lockoutUntil, user.id]
      );
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.failed_login_attempts > 0 || user.lockout_until) {
      await client.query('UPDATE users SET failed_login_attempts=0, lockout_until=NULL WHERE id=$1', [user.id]);
    }

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
router.post('/register/student', validate(schemas.registerStudent), async (req, res) => {
  const {
    email, password, full_name, phone, agency_id,
    class: studentClass, subjects, school_board,
    days_per_week, address, locality,
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await client.query(
      'SELECT id, role FROM users WHERE email=$1 AND agency_id=$2',
      [email, agency_id]
    );
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      const existingRole = existing.rows[0].role;
      return res.status(409).json({ error: `This email is already registered as a ${existingRole}. Please login or use a different email.` });
    }

    const hash = await bcrypt.hash(password, 12);
    const result = await client.query(
      `INSERT INTO users (agency_id, email, password_hash, role, full_name, phone, status)
       VALUES ($1,$2,$3,'student',$4,$5,'pending')
       RETURNING id, email, role, full_name, status, agency_id`,
      [agency_id, email, hash, full_name, phone]
    );
    const user = result.rows[0];

    await client.query(
      `INSERT INTO student_profiles (agency_id, user_id, class, subjects, days_per_week, address, school_board, locality)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (user_id) DO NOTHING`,
      [agency_id, user.id, studentClass, subjects,
       days_per_week || 3, address,
       school_board || '', locality || '']
    );

    await client.query('COMMIT');

    // Send welcome email and admin notification (non-blocking, but logged if they fail)
    welcomeStudentEmail({ full_name, email }).catch(err => console.error('Welcome email failed:', err.message));
    notifyAdminNewUser({ full_name, email, role: 'Student', phone }).catch(err => console.error('Admin notify email failed:', err.message));

    res.status(201).json({
      message: 'Registration successful. Please wait for admin approval.',
      user: { id: user.id, email: user.email, role: user.role, status: user.status },
    });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Student registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  } finally {
    client.release();
  }
});


// POST /api/auth/upload-doc — upload file to Supabase Storage via memory buffer, THEN persist path to teacher_profiles
router.post('/upload-doc', authenticate, (req, res) => {
  uploadRegDocs(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message || 'Upload failed' });
    }

    const files = req.files || {};
    const result = {};

    try {
      checkDocContents(files);

      if (files.aadhar_doc?.[0]?.buffer) {
        result.aadhar_url = await uploadBufferToSupabase(
          files.aadhar_doc[0].buffer,
          docPath('teacher', req.user.id, 'aadhar', extFromName(files.aadhar_doc[0].originalname)),
          files.aadhar_doc[0].mimetype
        );
      }
      if (files.resume_doc?.[0]?.buffer) {
        result.resume_url = await uploadBufferToSupabase(
          files.resume_doc[0].buffer,
          docPath('teacher', req.user.id, 'resume', extFromName(files.resume_doc[0].originalname)),
          files.resume_doc[0].mimetype
        );
      }

      if (!result.aadhar_url && !result.resume_url) {
        return res.status(400).json({ error: 'No file received — please select your file again' });
      }

      const client = await pool.connect();
      try {
        await client.query(
          `UPDATE teacher_profiles
             SET aadhar_doc = COALESCE($1, aadhar_doc),
                 resume_doc = COALESCE($2, resume_doc),
                 updated_at = NOW()
           WHERE user_id = $3`,
          [result.aadhar_url || null, result.resume_url || null, req.user.id]
        );
      } finally {
        client.release();
      }

      res.json(result);
    } catch (uploadErr) {
      console.error('Doc upload error:', uploadErr);
      res.status(uploadErr.statusCode || 500).json({
        error: uploadErr.statusCode ? uploadErr.message : 'File upload to cloud failed. Check Supabase Storage credentials.',
      });
    }
  });
});


// POST /api/auth/register/teacher — JSON route after files uploaded separately via /upload-doc
router.post('/register/teacher', validate(schemas.registerTeacher), async (req, res) => {
  const {
    email, password, full_name, phone, agency_id,
    subjects, languages, teach_class_from, teach_class_to,
    education, skills, bio,
    aadhar_url, resume_url,
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await client.query(
      'SELECT id, role FROM users WHERE email=$1 AND agency_id=$2',
      [email, agency_id]
    );
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      const existingRole = existing.rows[0].role;
      return res.status(409).json({ error: `This email is already registered as a ${existingRole}. Please login or use a different email.` });
    }

    const hash = await bcrypt.hash(password, 12);
    const result = await client.query(
      `INSERT INTO users (agency_id, email, password_hash, role, full_name, phone, status)
       VALUES ($1,$2,$3,'teacher',$4,$5,'pending')
       RETURNING id, email, role, full_name, status, agency_id`,
      [agency_id, email, hash, full_name, phone]
    );
    const user = result.rows[0];

    // aadhar_url/resume_url are storage paths the client got back from /upload-doc.
    // Only trust them if they point at THIS user's own path — otherwise a crafted
    // request could point at (and later view) another teacher's uploaded document.
    for (const [label, val, docType] of [['aadhar_url', aadhar_url, 'aadhar'], ['resume_url', resume_url, 'resume']]) {
      if (val && !schemas.ownStoragePath(user.id, docType).safeParse(val).success) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `${label} does not match an uploaded document for this account` });
      }
    }

    await client.query(
      `INSERT INTO teacher_profiles
         (agency_id, user_id, aadhar_doc, resume_doc, teach_class_from, teach_class_to, subjects, languages, education, skills, bio)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (user_id) DO NOTHING`,
      [agency_id, user.id,
       aadhar_url || '', resume_url || '',
       teach_class_from || '', teach_class_to || '',
       subjects, languages,
       education || '', skills || '', bio || '']
    );

    await client.query('COMMIT');

    welcomeTeacherEmail({ full_name, email }).catch(err => console.error('Welcome email failed:', err.message));
    notifyAdminNewUser({ full_name, email, role: 'Teacher', phone }).catch(err => console.error('Admin notify email failed:', err.message));

    res.status(201).json({
      message: 'Registration successful. Please wait for admin approval.',
      user: { id: user.id, email: user.email, role: user.role, status: user.status },
    });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Teacher registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  } finally { client.release(); }
});


// In-memory token store (use Redis in production for multi-instance)
const resetTokens = new Map(); // token -> { email, agency_id, expires }

// POST /api/auth/forgot-password
router.post('/forgot-password', validate(schemas.forgotPassword), async (req, res) => {
  const { email, agency_id } = req.body;

  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, email, full_name FROM users WHERE email=$1 AND agency_id=$2',
      [email, agency_id]
    );

    // Always return success (don't reveal if email exists)
    res.json({ message: 'If that email is registered, a reset link has been sent.' });

    if (result.rows.length === 0) return;

    const user = result.rows[0];
    const token = require('crypto').randomBytes(32).toString('hex');
    const expires = Date.now() + 60 * 60 * 1000; // 1 hour
    resetTokens.set(token, { email, agency_id, expires });

    const resetLink = `${process.env.CLIENT_URL?.split(',')[0] || 'https://learningfoxx.com'}/reset-password?token=${token}`;

    const { sendResetEmail } = require('../email');
    sendResetEmail({ full_name: user.full_name, email: user.email, resetLink })
      .catch(err => console.error('Reset email error:', err.message));
  } finally { client.release(); }
});

// POST /api/auth/reset-password
router.post('/reset-password', validate(schemas.resetPassword), async (req, res) => {
  const { token, password } = req.body;

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
      'UPDATE users SET password_hash=$1, failed_login_attempts=0, lockout_until=NULL, updated_at=NOW() WHERE email=$2 AND agency_id=$3 RETURNING id',
      [hash, data.email, data.agency_id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });
    resetTokens.delete(token);
    res.json({ message: 'Password reset successfully. You can now login with your new password.' });
  } finally { client.release(); }
});

module.exports = router;
