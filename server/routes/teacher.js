const express = require('express');
const { pool } = require('../db');
const { authenticate, requireRole, requireApproved } = require('../middleware/auth');
const { uploadPortfolio, cloudinary, uploadBufferToCloudinary } = require('../cloudinary');

const router = express.Router();
router.use(authenticate, requireRole('teacher'));

// GET /api/teacher/dashboard — NO fee amounts
router.get('/dashboard', requireApproved, async (req, res) => {
  const { id: teacher_id, agency_id } = req.user;
  const client = await pool.connect();
  try {
    const students = await client.query(
      `SELECT a.id AS assignment_id, a.subject, a.status AS assignment_status, a.created_at AS assigned_on,
              u.id AS student_id, u.full_name, sp.class, sp.school_board, sp.days_per_week,
              (SELECT fr.status   FROM fee_records fr WHERE fr.assignment_id=a.id ORDER BY fr.created_at DESC LIMIT 1) AS latest_fee_status,
              (SELECT fr.month_year FROM fee_records fr WHERE fr.assignment_id=a.id ORDER BY fr.created_at DESC LIMIT 1) AS latest_fee_month,
              (SELECT fr.student_confirmed FROM fee_records fr WHERE fr.assignment_id=a.id ORDER BY fr.created_at DESC LIMIT 1) AS student_confirmed,
              (SELECT fr.id       FROM fee_records fr WHERE fr.assignment_id=a.id ORDER BY fr.created_at DESC LIMIT 1) AS latest_fee_id
       FROM assignments a
       JOIN users u ON u.id = a.student_id
       LEFT JOIN student_profiles sp ON sp.user_id = a.student_id
       WHERE a.teacher_id=$1 AND a.agency_id=$2 AND a.status='active'
       ORDER BY u.full_name ASC`,
      [teacher_id, agency_id]
    );
    const pending = await client.query(
      `SELECT fr.id, fr.month_year, fr.student_confirmed, fr.teacher_confirmed, a.subject, u.full_name AS student_name
       FROM fee_records fr
       JOIN assignments a ON a.id = fr.assignment_id
       JOIN users u ON u.id = a.student_id
       WHERE a.teacher_id=$1 AND a.agency_id=$2 AND fr.student_confirmed=true AND fr.teacher_confirmed=false
       ORDER BY fr.created_at DESC`,
      [teacher_id, agency_id]
    );
    res.json({ students: students.rows, total_students: students.rows.length, pending_confirmations: pending.rows });
  } finally { client.release(); }
});

router.get('/profile', async (req, res) => {
  const { id: user_id } = req.user;
  const client = await pool.connect();
  try {
    const user    = await client.query('SELECT id, email, full_name, phone, status FROM users WHERE id=$1', [user_id]);
    const profile = await client.query('SELECT * FROM teacher_profiles WHERE user_id=$1', [user_id]);
    res.json({ user: user.rows[0], profile: profile.rows[0] || {} });
  } finally { client.release(); }
});

router.put('/profile', async (req, res) => {
  const { id: user_id, agency_id } = req.user;
  const { full_name, phone, education, skills, available_slots, bio, class_from, class_to, subjects_taught, languages } = req.body;
  const client = await pool.connect();
  try {
    if (full_name || phone) {
      await client.query(
        'UPDATE users SET full_name=COALESCE($1,full_name), phone=COALESCE($2,phone), updated_at=NOW() WHERE id=$3',
        [full_name, phone, user_id]
      );
    }
    await client.query(
      `INSERT INTO teacher_profiles (agency_id, user_id, education, skills, available_slots, bio, class_from, class_to, subjects_taught, languages)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (user_id) DO UPDATE SET
         education=COALESCE($3, teacher_profiles.education),
         skills=COALESCE($4, teacher_profiles.skills),
         available_slots=COALESCE($5, teacher_profiles.available_slots),
         bio=COALESCE($6, teacher_profiles.bio),
         class_from=COALESCE($7, teacher_profiles.class_from),
         class_to=COALESCE($8, teacher_profiles.class_to),
         subjects_taught=COALESCE($9, teacher_profiles.subjects_taught),
         languages=COALESCE($10, teacher_profiles.languages),
         updated_at=NOW()`,
      [agency_id, user_id, education, skills,
       available_slots ? JSON.stringify(available_slots) : null,
       bio, class_from, class_to, subjects_taught, languages]
    );
    res.json({ message: 'Profile updated successfully' });
  } finally { client.release(); }
});

// POST /api/teacher/portfolio — upload to Cloudinary
router.post('/portfolio', requireApproved, (req, res, next) => {
  uploadPortfolio(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, async (req, res) => {
  const { id: user_id, agency_id } = req.user;
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
  const client = await pool.connect();
  try {
    const existing = await client.query('SELECT portfolio_docs FROM teacher_profiles WHERE user_id=$1', [user_id]);
    const existingDocs = existing.rows[0]?.portfolio_docs || [];
    // Upload each file from disk to Cloudinary
    const newDocs = await Promise.all(req.files.map(async f => {
      const url = await uploadBufferToCloudinary(f.buffer, 'learningfox/portfolio', f.originalname);
      const safeName = Date.now() + '_' + f.originalname.replace(/[^a-zA-Z0-9._-]/g,'_');
      return {
        filename:     safeName,
        originalname: f.originalname,
        url,
        public_id:    url,
        mimetype:     f.mimetype,
        size:         f.size,
        uploaded_at:  new Date().toISOString(),
      };
    }));
    const allDocs = [...existingDocs, ...newDocs];
    await client.query(
      `INSERT INTO teacher_profiles (agency_id, user_id, portfolio_docs) VALUES ($1,$2,$3)
       ON CONFLICT (user_id) DO UPDATE SET portfolio_docs=$3, updated_at=NOW()`,
      [agency_id, user_id, JSON.stringify(allDocs)]
    );
    res.json({ message: `${req.files.length} file(s) uploaded`, docs: allDocs });
  } finally { client.release(); }
});

// DELETE /api/teacher/portfolio/:public_id — delete from Cloudinary
router.delete('/portfolio/:filename', requireApproved, async (req, res) => {
  const { id: user_id } = req.user;
  const { filename } = req.params;
  const client = await pool.connect();
  try {
    const existing = await client.query('SELECT portfolio_docs FROM teacher_profiles WHERE user_id=$1', [user_id]);
    const docs = existing.rows[0]?.portfolio_docs || [];
    const toDelete = docs.find(d => d.filename === filename);
    const updated  = docs.filter(d => d.filename !== filename);

    // Delete from Cloudinary
    if (toDelete?.public_id) {
      try { await cloudinary.uploader.destroy(toDelete.public_id, { resource_type: 'raw' }); } catch {}
    }

    await client.query('UPDATE teacher_profiles SET portfolio_docs=$1, updated_at=NOW() WHERE user_id=$2', [JSON.stringify(updated), user_id]);
    res.json({ message: 'Document removed', docs: updated });
  } finally { client.release(); }
});

// GET /api/teacher/document/:filename — redirect to Cloudinary URL
router.get('/document/:filename', async (req, res) => {
  const { id: user_id } = req.user;
  const { filename } = req.params;
  const client = await pool.connect();
  try {
    const r = await client.query('SELECT portfolio_docs FROM teacher_profiles WHERE user_id=$1', [user_id]);
    const docs = r.rows[0]?.portfolio_docs || [];
    const doc = docs.find(d => d.filename === filename);
    if (!doc?.url) return res.status(404).json({ error: 'Document not found' });
    res.redirect(doc.url);
  } finally { client.release(); }
});

// POST /api/teacher/fees/:id/confirm
router.post('/fees/:fee_record_id/confirm', requireApproved, async (req, res) => {
  const { id: teacher_id, agency_id } = req.user;
  const client = await pool.connect();
  try {
    const check = await client.query(
      `SELECT fr.id, fr.student_confirmed, a.student_id FROM fee_records fr
       JOIN assignments a ON a.id = fr.assignment_id
       WHERE fr.id=$1 AND a.teacher_id=$2 AND a.agency_id=$3`,
      [req.params.fee_record_id, teacher_id, agency_id]
    );
    if (!check.rows[0]) return res.status(404).json({ error: 'Fee record not found' });
    if (!check.rows[0].student_confirmed) return res.status(400).json({ error: 'Student has not confirmed payment yet' });
    const result = await client.query(
      `UPDATE fee_records SET teacher_confirmed=true, teacher_confirmed_at=NOW(),
       status=CASE WHEN student_confirmed=true THEN 'cleared' ELSE 'pending' END, updated_at=NOW()
       WHERE id=$1 RETURNING *`,
      [req.params.fee_record_id]
    );
    if (result.rows[0].student_confirmed && result.rows[0].teacher_confirmed) {
      await client.query(
        `INSERT INTO notifications (agency_id, user_id, title, message, type)
         VALUES ($1,$2,'Payment Confirmed','Your teacher confirmed receipt of your fee. All clear!','success')`,
        [agency_id, check.rows[0].student_id]
      );
    }
    res.json({ fee_record: result.rows[0] });
  } finally { client.release(); }
});

// GET /api/teacher/fees
router.get('/fees', requireApproved, async (req, res) => {
  const { id: teacher_id, agency_id } = req.user;
  const client = await pool.connect();
  try {
    const r = await client.query(
      `SELECT fr.id, fr.month_year, fr.status, fr.student_confirmed, fr.teacher_confirmed,
              fr.student_confirmed_at, fr.teacher_confirmed_at, fr.created_at,
              a.subject, u.full_name AS student_name
       FROM fee_records fr
       JOIN assignments a ON a.id = fr.assignment_id
       JOIN users u ON u.id = a.student_id
       WHERE a.teacher_id=$1 AND a.agency_id=$2
       ORDER BY fr.created_at DESC`,
      [teacher_id, agency_id]
    );
    res.json({ fee_records: r.rows });
  } finally { client.release(); }
});


// POST /api/teacher/upload-aadhar — upload Aadhar after registration
router.post('/upload-aadhar', requireApproved, (req, res, next) => {
  const { uploadRegDocs } = require('../cloudinary');
  uploadRegDocs(req, res, next);
}, async (req, res) => {
  const { id: user_id, agency_id } = req.user;
  const files = req.files || {};
  if (!files.aadhar_doc?.[0]) return res.status(400).json({ error: 'No file received' });
  const client = await pool.connect();
  try {
    const { uploadBufferToCloudinary } = require('../cloudinary');
    const url = await uploadBufferToCloudinary(
      files.aadhar_doc[0].buffer,
      'learningfox/reg_docs',
      files.aadhar_doc[0].originalname
    );
    await client.query(
      `INSERT INTO teacher_profiles (agency_id, user_id, aadhar_doc)
       VALUES ($1,$2,$3) ON CONFLICT (user_id) DO UPDATE SET aadhar_doc=$3, updated_at=NOW()`,
      [agency_id, user_id, url]
    );
    res.json({ message: 'Aadhar uploaded successfully', url });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  } finally { client.release(); }
});


// POST /api/teacher/upload-resume
router.post('/upload-resume', requireApproved, (req, res, next) => {
  const { uploadRegDocs } = require('../cloudinary');
  uploadRegDocs(req, res, next);
}, async (req, res) => {
  const { id: user_id, agency_id } = req.user;
  const files = req.files || {};
  const fileKey = files.aadhar_doc?.[0] ? 'aadhar_doc' : files.resume_doc?.[0] ? 'resume_doc' : null;
  if (!fileKey) return res.status(400).json({ error: 'No file received' });
  const client = await pool.connect();
  try {
    const { uploadBufferToCloudinary } = require('../cloudinary');
    const url = await uploadBufferToCloudinary(
      files[fileKey][0].buffer, 'learningfox/reg_docs', files[fileKey][0].originalname
    );
    await client.query(
      `INSERT INTO teacher_profiles (agency_id, user_id, resume_doc)
       VALUES ($1,$2,$3) ON CONFLICT (user_id) DO UPDATE SET resume_doc=$3, updated_at=NOW()`,
      [agency_id, user_id, url]
    );
    res.json({ message: 'Resume uploaded successfully', url });
  } catch(err) {
    res.status(500).json({ error: 'Upload failed' });
  } finally { client.release(); }
});

module.exports = router;
