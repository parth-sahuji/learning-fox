const express = require('express');
const { pool } = require('../db');
const { authenticate, requireRole, requireApproved } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, requireRole('student'));

// GET /api/student/dashboard — NO teacher personal details (no email/phone)
router.get('/dashboard', requireApproved, async (req, res) => {
  const { id: student_id, agency_id } = req.user;
  const client = await pool.connect();
  try {
    const assignments = await client.query(
      `SELECT a.id AS assignment_id, a.subject, a.monthly_fee, a.status AS assignment_status, a.created_at AS assigned_on,
              -- Only show first name of teacher, no contact details
              SPLIT_PART(u.full_name, ' ', 1) AS teacher_first_name,
              -- Show teacher qualifications only (no contact info)
              tp.education, tp.skills, tp.subjects AS teacher_subjects, tp.languages,
              tp.teach_class_from, tp.teach_class_to,
              tp.available_slots, tp.bio,
              (SELECT fr.id FROM fee_records fr WHERE fr.assignment_id=a.id ORDER BY fr.created_at DESC LIMIT 1) AS latest_fee_id,
              (SELECT fr.status FROM fee_records fr WHERE fr.assignment_id=a.id ORDER BY fr.created_at DESC LIMIT 1) AS latest_fee_status,
              (SELECT fr.month_year FROM fee_records fr WHERE fr.assignment_id=a.id ORDER BY fr.created_at DESC LIMIT 1) AS latest_fee_month,
              (SELECT fr.student_confirmed FROM fee_records fr WHERE fr.assignment_id=a.id ORDER BY fr.created_at DESC LIMIT 1) AS student_confirmed,
              (SELECT fr.teacher_confirmed FROM fee_records fr WHERE fr.assignment_id=a.id ORDER BY fr.created_at DESC LIMIT 1) AS teacher_confirmed
       FROM assignments a
       JOIN users u ON u.id = a.teacher_id
       LEFT JOIN teacher_profiles tp ON tp.user_id = a.teacher_id
       WHERE a.student_id=$1 AND a.agency_id=$2 AND a.status='active'`,
      [student_id, agency_id]
    );
    res.json({ assignments: assignments.rows });
  } finally { client.release(); }
});

// GET /api/student/profile
router.get('/profile', async (req, res) => {
  const { id: user_id } = req.user;
  const client = await pool.connect();
  try {
    const user = await client.query('SELECT id, email, full_name, phone, status FROM users WHERE id=$1', [user_id]);
    const profile = await client.query('SELECT * FROM student_profiles WHERE user_id=$1', [user_id]);
    res.json({ user: user.rows[0], profile: profile.rows[0] || {} });
  } finally { client.release(); }
});

// PUT /api/student/profile
router.put('/profile', async (req, res) => {
  const { id: user_id, agency_id } = req.user;
  const { full_name, phone, class: studentClass, subjects, locality, address, school_board, days_per_week } = req.body;
  const client = await pool.connect();
  try {
    if (full_name || phone) {
      await client.query(
        `UPDATE users SET full_name=COALESCE($1,full_name), phone=COALESCE($2,phone), updated_at=NOW() WHERE id=$3`,
        [full_name, phone, user_id]
      );
    }
    await client.query(
      `INSERT INTO student_profiles (agency_id, user_id, class, subjects, locality, address, school_board, days_per_week)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (user_id) DO UPDATE SET
         class=COALESCE($3,student_profiles.class),
         subjects=COALESCE($4,student_profiles.subjects),
         locality=COALESCE($5,student_profiles.locality),
         address=COALESCE($6,student_profiles.address),
         school_board=COALESCE($7,student_profiles.school_board),
         days_per_week=COALESCE($8,student_profiles.days_per_week),
         updated_at=NOW()`,
      [agency_id, user_id, studentClass, subjects, locality, address, days_per_week ? parseInt(days_per_week) : null, school_board]
    );
    res.json({ message: 'Profile updated.' });
  } finally { client.release(); }
});

// POST /api/student/fees/:id/confirm
router.post('/fees/:fee_record_id/confirm', requireApproved, async (req, res) => {
  const { id: student_id, agency_id } = req.user;
  const client = await pool.connect();
  try {
    const check = await client.query(
      `SELECT fr.id, a.teacher_id, a.subject FROM fee_records fr
       JOIN assignments a ON a.id = fr.assignment_id
       WHERE fr.id=$1 AND a.student_id=$2 AND a.agency_id=$3`,
      [req.params.fee_record_id, student_id, agency_id]
    );
    if (!check.rows[0]) return res.status(404).json({ error: 'Fee record not found.' });

    const result = await client.query(
      `UPDATE fee_records SET student_confirmed=true, student_confirmed_at=NOW(), status='student_paid', updated_at=NOW()
       WHERE id=$1 AND student_confirmed=false RETURNING *`,
      [req.params.fee_record_id]
    );
    if (!result.rows[0]) return res.status(400).json({ error: 'Payment already confirmed.' });

    const user = await client.query('SELECT full_name FROM users WHERE id=$1', [student_id]);
    await client.query(
      `INSERT INTO notifications (agency_id, user_id, title, message, type) VALUES ($1,$2,'Fee Payment Confirmed',$3,'warning')`,
      [agency_id, check.rows[0].teacher_id,
       `A student has confirmed fee payment for ${check.rows[0].subject}. Please verify and confirm receipt.`]
    );
    res.json({ fee_record: result.rows[0] });
  } finally { client.release(); }
});

// GET /api/student/fees
router.get('/fees', requireApproved, async (req, res) => {
  const { id: student_id, agency_id } = req.user;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT fr.id, fr.month_year, fr.student_confirmed, fr.teacher_confirmed, fr.status,
              fr.student_confirmed_at, fr.teacher_confirmed_at, fr.created_at,
              a.subject, a.monthly_fee,
              SPLIT_PART(u.full_name, ' ', 1) AS teacher_first_name
       FROM fee_records fr
       JOIN assignments a ON a.id = fr.assignment_id
       JOIN users u ON u.id = a.teacher_id
       WHERE a.student_id=$1 AND a.agency_id=$2
       ORDER BY fr.created_at DESC`,
      [student_id, agency_id]
    );
    res.json({ fee_records: result.rows });
  } finally { client.release(); }
});

module.exports = router;
