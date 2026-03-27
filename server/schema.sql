-- Learning Fox Database Schema
-- SaaS-ready with agency_id for multi-tenancy

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  agency_id VARCHAR(50) NOT NULL DEFAULT 'default',
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL DEFAULT '',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agency_id, email)
);

CREATE TABLE IF NOT EXISTS teacher_profiles (
  id SERIAL PRIMARY KEY,
  agency_id VARCHAR(50) NOT NULL DEFAULT 'default',
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  education TEXT,
  skills TEXT,
  subjects TEXT,
  languages TEXT,
  teach_class_from VARCHAR(10),
  teach_class_to VARCHAR(10),
  available_slots JSONB DEFAULT '[]',
  portfolio_docs JSONB DEFAULT '[]',
  aadhar_doc TEXT,
  resume_doc TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS student_profiles (
  id SERIAL PRIMARY KEY,
  agency_id VARCHAR(50) NOT NULL DEFAULT 'default',
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class VARCHAR(50),
  subjects TEXT,
  locality VARCHAR(255),
  address TEXT,
  school_board VARCHAR(100),
  days_per_week INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS assignments (
  id SERIAL PRIMARY KEY,
  agency_id VARCHAR(50) NOT NULL DEFAULT 'default',
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  monthly_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'terminated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, subject)
);

CREATE TABLE IF NOT EXISTS fee_records (
  id SERIAL PRIMARY KEY,
  agency_id VARCHAR(50) NOT NULL DEFAULT 'default',
  assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  month_year VARCHAR(7) NOT NULL,
  student_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  teacher_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'student_paid', 'cleared', 'overdue')),
  student_confirmed_at TIMESTAMP WITH TIME ZONE,
  teacher_confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assignment_id, month_year)
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  agency_id VARCHAR(50) NOT NULL DEFAULT 'default',
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_agency_email ON users(agency_id, email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_assignments_student ON assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_fee_records_assignment ON fee_records(assignment_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

DO $$ BEGIN
  BEGIN ALTER TABLE users ADD COLUMN terms_accepted BOOLEAN NOT NULL DEFAULT FALSE; EXCEPTION WHEN duplicate_column THEN NULL; END;
  BEGIN ALTER TABLE teacher_profiles ADD COLUMN subjects TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
  BEGIN ALTER TABLE teacher_profiles ADD COLUMN languages TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
  BEGIN ALTER TABLE teacher_profiles ADD COLUMN teach_class_from VARCHAR(10); EXCEPTION WHEN duplicate_column THEN NULL; END;
  BEGIN ALTER TABLE teacher_profiles ADD COLUMN teach_class_to VARCHAR(10); EXCEPTION WHEN duplicate_column THEN NULL; END;
  BEGIN ALTER TABLE teacher_profiles ADD COLUMN aadhar_doc TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
  BEGIN ALTER TABLE teacher_profiles ALTER COLUMN aadhar_doc TYPE TEXT USING aadhar_doc::TEXT; EXCEPTION WHEN others THEN NULL; END;
  BEGIN ALTER TABLE teacher_profiles ADD COLUMN resume_doc TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
  BEGIN ALTER TABLE teacher_profiles ALTER COLUMN resume_doc TYPE TEXT USING resume_doc::TEXT; EXCEPTION WHEN others THEN NULL; END;
  BEGIN ALTER TABLE student_profiles ADD COLUMN address TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
  BEGIN ALTER TABLE student_profiles ADD COLUMN days_per_week INTEGER DEFAULT 3; EXCEPTION WHEN duplicate_column THEN NULL; END;
END $$;
