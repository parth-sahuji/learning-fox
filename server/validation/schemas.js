const { z } = require('zod');

// ── Reusable field primitives ────────────────────────────────────────────────
// Every free-text field blocks < and > (closes HTML-injection into admin
// vetting views and notification emails, which render these values as-is).
const noHtml = (label) => (v) => !/[<>]/.test(v) || `${label} can't contain < or >`;

const email = z.string().trim().toLowerCase().email('Enter a valid email address').max(255);

const password = z.string().min(6, 'Password must be at least 6 characters').max(72);

const fullName = z.string().trim().min(2).max(100)
  .regex(/^[\p{L} .'-]+$/u, 'Name can only contain letters, spaces, and . \' -');

const phone = z.string().trim()
  .refine(v => { const d = v.replace(/\D/g, ''); return d.length >= 10 && d.length <= 15; },
    'A valid phone number is required');

const agencyId = z.string().trim().max(50).optional().default('default');

const role = z.enum(['teacher', 'student'], { message: 'Role must be teacher or student' });

const shortText = (max, label) => z.string().trim().max(max).refine(noHtml(label)).optional();
const requiredShortText = (max, label) => z.string().trim().min(1, `${label} is required`).max(max).refine(noHtml(label));

const bio = z.string().trim().max(2000).refine(noHtml('Bio')).optional();
const address = z.string().trim().min(3, 'Address/location is required').max(500).refine(noHtml('Address'));
const studentClass = requiredShortText(20, 'Class');
const daysPerWeek = z.coerce.number().int().min(1).max(7).optional();

// Storage paths returned by our own upload endpoints, e.g. teacher/42/aadhar.pdf.
// Anything else (including another user's path) is rejected outright.
const ownStoragePath = (userId, docType) =>
  z.string().trim()
    .regex(new RegExp(`^teacher/${userId}/${docType}\\.[a-zA-Z0-9]{1,10}$`), 'Invalid document reference')
    .optional().or(z.literal(''));

// ── Auth ──────────────────────────────────────────────────────────────────
const login = z.object({
  email,
  password: z.string().min(1, 'Password is required').max(200),
  agency_id: agencyId,
});

const forgotPassword = z.object({ email, agency_id: agencyId });

const resetPassword = z.object({
  token: z.string().trim().regex(/^[a-f0-9]{64}$/, 'Invalid reset token'),
  password,
});

// Combined multipart /register (legacy route, still live)
const registerCombined = z.object({
  email, password, full_name: fullName, phone, role, agency_id: agencyId,
  teach_class_from: shortText(10, 'Class from'),
  teach_class_to: shortText(10, 'Class to'),
  subjects: shortText(500, 'Subjects'),
  languages: shortText(200, 'Languages'),
  education: shortText(500, 'Education'),
  skills: shortText(500, 'Skills'),
  bio,
  class: shortText(20, 'Class').optional(),
  subject_needs: shortText(500, 'Subjects needed'),
  days_per_week: daysPerWeek,
  address: shortText(500, 'Address'),
  school_board: shortText(100, 'School board'),
  locality: shortText(200, 'Locality'),
});

const registerStudent = z.object({
  email, password, full_name: fullName, phone, agency_id: agencyId,
  class: studentClass,
  subjects: requiredShortText(500, 'Subjects'),
  school_board: shortText(100, 'School board'),
  days_per_week: daysPerWeek,
  address,
  locality: shortText(200, 'Locality'),
});

// aadhar_url/resume_url prefix is validated per-request in the route handler
// (needs the just-created user id, which doesn't exist until after insert).
const registerTeacher = z.object({
  email, password, full_name: fullName, phone, agency_id: agencyId,
  subjects: requiredShortText(500, 'Subjects'),
  languages: requiredShortText(200, 'Languages'),
  teach_class_from: shortText(10, 'Class from'),
  teach_class_to: shortText(10, 'Class to'),
  education: shortText(500, 'Education'),
  skills: shortText(500, 'Skills'),
  bio,
  aadhar_url: z.string().trim().max(300).optional().or(z.literal('')),
  resume_url: z.string().trim().max(300).optional().or(z.literal('')),
});

// ── Teacher ───────────────────────────────────────────────────────────────
const teacherProfileUpdate = z.object({
  full_name: fullName.optional(),
  phone: phone.optional(),
  education: shortText(500, 'Education'),
  skills: shortText(500, 'Skills'),
  available_slots: z.array(z.record(z.string(), z.unknown())).max(50).optional(),
  bio,
  class_from: shortText(10, 'Class from'),
  class_to: shortText(10, 'Class to'),
  subjects_taught: shortText(500, 'Subjects'),
  languages: shortText(200, 'Languages'),
});

// ── Student ───────────────────────────────────────────────────────────────
const studentProfileUpdate = z.object({
  full_name: fullName.optional(),
  phone: phone.optional(),
  class: shortText(20, 'Class'),
  subjects: shortText(500, 'Subjects'),
  locality: shortText(200, 'Locality'),
  address: shortText(500, 'Address'),
  school_board: shortText(100, 'School board'),
  days_per_week: daysPerWeek,
});

// ── Admin ─────────────────────────────────────────────────────────────────
const positiveId = z.coerce.number().int().positive();

const createAssignment = z.object({
  student_id: positiveId,
  teacher_id: positiveId,
  subject: requiredShortText(100, 'Subject'),
  monthly_fee: z.coerce.number().nonnegative().max(10_000_000).optional(),
});

const setFee = z.object({
  monthly_fee: z.coerce.number().nonnegative('Valid monthly_fee required').max(10_000_000),
});

const setAssignmentStatus = z.object({
  status: z.enum(['active', 'paused', 'terminated']),
});

const feeTrigger = z.object({
  month_year: z.string().trim().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'month_year must be in YYYY-MM format'),
});

const idParam = z.object({ id: positiveId });
const feeRecordIdParam = z.object({ fee_record_id: positiveId });

module.exports = {
  login, forgotPassword, resetPassword,
  registerCombined, registerStudent, registerTeacher, ownStoragePath,
  teacherProfileUpdate, studentProfileUpdate,
  createAssignment, setFee, setAssignmentStatus, feeTrigger,
  idParam, feeRecordIdParam,
};
