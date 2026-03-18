const express = require('express');
const { pool } = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require auth + admin role
router.use(authenticate, requireRole('admin'));

// GET /api/admin/dashboard - Stats
router.get('/dashboard', async (req, res) => {
  const { agency_id } = req.user;
  const client = await pool.connect();
  try {
    const [students, teachers, pending, assignments, fees] = await Promise.all([
      client.query("SELECT COUNT(*) FROM users WHERE agency_id=$1 AND role='student' AND status='approved'", [agency_id]),
      client.query("SELECT COUNT(*) FROM users WHERE agency_id=$1 AND role='teacher' AND status='approved'", [agency_id]),
      client.query("SELECT COUNT(*) FROM users WHERE agency_id=$1 AND status='pending'", [agency_id]),
      client.query("SELECT COUNT(*) FROM assignments WHERE agency_id=$1 AND status='active'", [agency_id]),
      client.query("SELECT COALESCE(SUM(monthly_fee),0) as total FROM assignments WHERE agency_id=$1 AND status='active'", [agency_id]),
    ]);

    res.json({
      students: parseInt(students.rows[0].count),
      teachers: parseInt(teachers.rows[0].count),
      pending_approvals: parseInt(pending.rows[0].count),
      active_assignments: parseInt(assignments.rows[0].count),
      total_monthly_revenue: parseFloat(fees.rows[0].total),
    });
  } finally {
    client.release();
  }
});

// GET /api/admin/pending - Vetting queue
router.get('/pending', async (req, res) => {
  const { agency_id } = req.user;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, email, role, full_name, phone, status, created_at
       FROM users WHERE agency_id=$1 AND status='pending' ORDER BY created_at ASC`,
      [agency_id]
    );
    res.json({ users: result.rows });
  } finally {
    client.release();
  }
});

// PUT /api/admin/users/:id/approve
router.put('/users/:id/approve', async (req, res) => {
  const { agency_id } = req.user;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE users SET status='approved', updated_at=NOW()
       WHERE id=$1 AND agency_id=$2 RETURNING id, email, role, full_name, status`,
      [req.params.id, agency_id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });

    // Notify user
    await client.query(
      `INSERT INTO notifications (agency_id, user_id, title, message, type)
       VALUES ($1, $2, 'Account Approved', 'Your account has been approved! You can now access your dashboard.', 'success')`,
      [agency_id, req.params.id]
    );

    res.json({ user: result.rows[0] });
  } finally {
    client.release();
  }
});

// PUT /api/admin/users/:id/reject
router.put('/users/:id/reject', async (req, res) => {
  const { agency_id } = req.user;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE users SET status='rejected', updated_at=NOW()
       WHERE id=$1 AND agency_id=$2 RETURNING id, email, role, full_name, status`,
      [req.params.id, agency_id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });

    await client.query(
      `INSERT INTO notifications (agency_id, user_id, title, message, type)
       VALUES ($1, $2, 'Account Rejected', 'Your registration has been reviewed and was not approved at this time.', 'error')`,
      [agency_id, req.params.id]
    );

    res.json({ user: result.rows[0] });
  } finally {
    client.release();
  }
});

// GET /api/admin/users - All approved teachers and students
router.get('/users', async (req, res) => {
  const { agency_id } = req.user;
  const { role } = req.query;
  const client = await pool.connect();
  try {
    let query = `SELECT id, email, role, full_name, phone, status, created_at
                 FROM users WHERE agency_id=$1 AND status='approved'`;
    const params = [agency_id];
    if (role) {
      query += ` AND role=$2`;
      params.push(role);
    }
    query += ' ORDER BY full_name ASC';
    const result = await client.query(query, params);
    res.json({ users: result.rows });
  } finally {
    client.release();
  }
});

// GET /api/admin/assignments
router.get('/assignments', async (req, res) => {
  const { agency_id } = req.user;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT a.id, a.subject, a.monthly_fee, a.status, a.created_at,
              s.full_name AS student_name, s.email AS student_email,
              t.full_name AS teacher_name, t.email AS teacher_email,
              sp.class, sp.school_board, sp.locality
       FROM assignments a
       JOIN users s ON s.id = a.student_id
       JOIN users t ON t.id = a.teacher_id
       LEFT JOIN student_profiles sp ON sp.user_id = a.student_id
       WHERE a.agency_id=$1
       ORDER BY a.created_at DESC`,
      [agency_id]
    );
    res.json({ assignments: result.rows });
  } finally {
    client.release();
  }
});

// POST /api/admin/assignments - Create assignment (The Matcher)
router.post('/assignments', async (req, res) => {
  const { agency_id } = req.user;
  const { student_id, teacher_id, subject, monthly_fee } = req.body;

  if (!student_id || !teacher_id || !subject) {
    return res.status(400).json({ error: 'student_id, teacher_id, subject are required' });
  }

  const client = await pool.connect();
  try {
    // Verify student and teacher exist and are approved
    const [student, teacher] = await Promise.all([
      client.query("SELECT id, full_name FROM users WHERE id=$1 AND agency_id=$2 AND role='student' AND status='approved'", [student_id, agency_id]),
      client.query("SELECT id, full_name FROM users WHERE id=$1 AND agency_id=$2 AND role='teacher' AND status='approved'", [teacher_id, agency_id]),
    ]);

    if (!student.rows[0]) return res.status(404).json({ error: 'Student not found or not approved' });
    if (!teacher.rows[0]) return res.status(404).json({ error: 'Teacher not found or not approved' });

    // Check single assignment rule
    const existing = await client.query(
      'SELECT id FROM assignments WHERE student_id=$1 AND subject=$2 AND agency_id=$3 AND status=\'active\'',
      [student_id, subject, agency_id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: `Student already has an active assignment for ${subject}` });
    }

    const result = await client.query(
      `INSERT INTO assignments (agency_id, student_id, teacher_id, subject, monthly_fee)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [agency_id, student_id, teacher_id, subject, monthly_fee || 0]
    );

    const assignment = result.rows[0];

    // Notify both parties
    await Promise.all([
      client.query(
        `INSERT INTO notifications (agency_id, user_id, title, message, type)
         VALUES ($1, $2, 'Teacher Assigned', $3, 'info')`,
        [agency_id, student_id, `You have been assigned to teacher ${teacher.rows[0].full_name} for ${subject}.`]
      ),
      client.query(
        `INSERT INTO notifications (agency_id, user_id, title, message, type)
         VALUES ($1, $2, 'New Student Assigned', $3, 'info')`,
        [agency_id, teacher_id, `Student ${student.rows[0].full_name} has been assigned to you for ${subject}.`]
      ),
    ]);

    res.status(201).json({ assignment });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'This student is already assigned for this subject' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create assignment' });
  } finally {
    client.release();
  }
});

// PUT /api/admin/assignments/:id/fee - Set monthly fee
router.put('/assignments/:id/fee', async (req, res) => {
  const { agency_id } = req.user;
  const { monthly_fee } = req.body;

  if (monthly_fee === undefined || monthly_fee < 0) {
    return res.status(400).json({ error: 'Valid monthly_fee required' });
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE assignments SET monthly_fee=$1, updated_at=NOW()
       WHERE id=$2 AND agency_id=$3 RETURNING *`,
      [monthly_fee, req.params.id, agency_id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Assignment not found' });

    // Notify student
    await client.query(
      `INSERT INTO notifications (agency_id, user_id, title, message, type)
       SELECT $1, student_id, 'Fee Updated', $2, 'info' FROM assignments WHERE id=$3`,
      [agency_id, `Your monthly fee has been updated to ₹${monthly_fee}.`, req.params.id]
    );

    res.json({ assignment: result.rows[0] });
  } finally {
    client.release();
  }
});

// PUT /api/admin/assignments/:id/status
router.put('/assignments/:id/status', async (req, res) => {
  const { agency_id } = req.user;
  const { status } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE assignments SET status=$1, updated_at=NOW()
       WHERE id=$2 AND agency_id=$3 RETURNING *`,
      [status, req.params.id, agency_id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Assignment not found' });
    res.json({ assignment: result.rows[0] });
  } finally {
    client.release();
  }
});

// GET /api/admin/fees - All fee records
router.get('/fees', async (req, res) => {
  const { agency_id } = req.user;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT fr.*, a.subject, a.monthly_fee,
              s.full_name AS student_name, t.full_name AS teacher_name
       FROM fee_records fr
       JOIN assignments a ON a.id = fr.assignment_id
       JOIN users s ON s.id = a.student_id
       JOIN users t ON t.id = a.teacher_id
       WHERE fr.agency_id=$1
       ORDER BY fr.created_at DESC`,
      [agency_id]
    );
    res.json({ fee_records: result.rows });
  } finally {
    client.release();
  }
});

// POST /api/admin/fees/trigger - Manually trigger monthly fee records
router.post('/fees/trigger', async (req, res) => {
  const { agency_id } = req.user;
  const { month_year } = req.body; // format: YYYY-MM
  const client = await pool.connect();
  try {
    const assignments = await client.query(
      "SELECT id, student_id, teacher_id FROM assignments WHERE agency_id=$1 AND status='active'",
      [agency_id]
    );

    let created = 0;
    for (const a of assignments.rows) {
      const existing = await client.query(
        'SELECT id FROM fee_records WHERE assignment_id=$1 AND month_year=$2',
        [a.id, month_year]
      );
      if (existing.rows.length === 0) {
        await client.query(
          `INSERT INTO fee_records (agency_id, assignment_id, month_year, status)
           VALUES ($1, $2, $3, 'pending')`,
          [agency_id, a.id, month_year]
        );

        // Notify student
        await client.query(
          `INSERT INTO notifications (agency_id, user_id, title, message, type)
           VALUES ($1, $2, 'Fee Due', $3, 'warning')`,
          [agency_id, a.student_id, `Your tuition fee for ${month_year} is now due. Please make the payment and confirm.`]
        );
        created++;
      }
    }

    res.json({ message: `Created ${created} fee records for ${month_year}` });
  } finally {
    client.release();
  }
});

// GET /api/admin/all-users - All users for management
router.get('/all-users', async (req, res) => {
  const { agency_id } = req.user;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, email, role, full_name, phone, status, created_at
       FROM users WHERE agency_id=$1 AND role != 'admin' ORDER BY created_at DESC`,
      [agency_id]
    );
    res.json({ users: result.rows });
  } finally {
    client.release();
  }
});

module.exports = router;

// GET /api/admin/user-profile/:id — full profile for vetting detail panel
router.get('/user-profile/:id', async (req, res) => {
  const { agency_id } = req.user;
  const client = await pool.connect();
  try {
    const user = await client.query(
      'SELECT id, email, role, full_name, phone, status, created_at FROM users WHERE id=$1 AND agency_id=$2',
      [req.params.id, agency_id]
    );
    if (!user.rows[0]) return res.status(404).json({ error: 'User not found' });

    let profile = {};
    if (user.rows[0].role === 'teacher') {
      const r = await client.query('SELECT * FROM teacher_profiles WHERE user_id=$1', [req.params.id]);
      profile = r.rows[0] || {};
    } else if (user.rows[0].role === 'student') {
      const r = await client.query('SELECT * FROM student_profiles WHERE user_id=$1', [req.params.id]);
      profile = r.rows[0] || {};
    }

    res.json({ user: user.rows[0], profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load profile' });
  } finally { client.release(); }
});

// GET /api/admin/document/reg_docs/:filename
// Cloudinary stores the full URL in DB — look it up and redirect
router.get('/document/reg_docs/:filename', async (req, res) => {
  const { agency_id } = req.user;
  const { filename } = req.params;
  const client = await pool.connect();
  try {
    // Find in teacher_profiles where aadhar_doc or resume_doc matches filename
    const r = await client.query(
      `SELECT aadhar_doc, resume_doc FROM teacher_profiles tp
       JOIN users u ON u.id = tp.user_id
       WHERE u.agency_id=$1 AND (
         tp.aadhar_doc LIKE $2 OR tp.resume_doc LIKE $2
       ) LIMIT 1`,
      [agency_id, `%${filename}%`]
    );
    if (r.rows[0]) {
      const url = r.rows[0].aadhar_doc?.includes(filename)
        ? r.rows[0].aadhar_doc
        : r.rows[0].resume_doc;
      if (url) return res.redirect(url);
    }
    res.status(404).json({ error: 'Document not found' });
  } finally { client.release(); }
});
