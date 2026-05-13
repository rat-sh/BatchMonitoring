-- EduTrack Database Schema
-- Phase 1: Initial Setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('teacher', 'student', 'parent');
CREATE TYPE language_preference AS ENUM ('en', 'hi');
CREATE TYPE board_type AS ENUM ('cbse', 'icse', 'jee', 'neet', 'state', 'other');
CREATE TYPE question_type AS ENUM ('mcq', 'true_false', 'numerical', 'theoretical');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE exam_type AS ENUM ('test', 'pyq_practice', 'mock');
CREATE TYPE attendance_status AS ENUM ('present', 'absent');
CREATE TYPE file_type AS ENUM ('pdf', 'image', 'link');
CREATE TYPE priority_level AS ENUM ('high', 'medium', 'low');
CREATE TYPE link_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE plan_type AS ENUM ('free', 'pro');

-- Users table (extends auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL,
    email TEXT,
    phone TEXT,
    preferred_language language_preference DEFAULT 'en',
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teachers table
CREATE TABLE teachers (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    institution_name TEXT,
    upi_id TEXT,
    upi_qr_url TEXT,
    plan plan_type DEFAULT 'free',
    plan_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Batches table
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subject TEXT,
    board board_type,
    join_code TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    academic_year TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Batch enrollments
CREATE TABLE batch_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(batch_id, student_id)
);

-- Parent links
CREATE TABLE parent_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status link_status DEFAULT 'pending',
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    responded_at TIMESTAMPTZ
);

-- Exams
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    exam_type exam_type DEFAULT 'test',
    board_tag board_type,
    subject TEXT,
    duration_minutes INTEGER NOT NULL,
    total_marks NUMERIC NOT NULL,
    negative_marking BOOLEAN DEFAULT false,
    negative_marks_per_wrong NUMERIC DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PYQ Bank
CREATE TABLE pyq_bank (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    board board_type NOT NULL,
    subject TEXT NOT NULL,
    chapter TEXT NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    pyq_bank_id UUID REFERENCES pyq_bank(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type question_type NOT NULL,
    options JSONB,
    correct_answer TEXT,
    marks NUMERIC NOT NULL,
    chapter_tag TEXT,
    difficulty difficulty_level,
    pyq_year INTEGER,
    order_index INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exam submissions
CREATE TABLE exam_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    server_end_time TIMESTAMPTZ NOT NULL,
    total_score NUMERIC,
    rank_in_batch INTEGER,
    tab_switch_count INTEGER DEFAULT 0,
    UNIQUE(exam_id, student_id)
);

-- Submission answers
CREATE TABLE submission_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES exam_submissions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    student_answer TEXT,
    is_correct BOOLEAN,
    marks_awarded NUMERIC
);

-- Assignments
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    deadline TIMESTAMPTZ NOT NULL,
    max_marks NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assignment submissions
CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_url TEXT,
    file_name TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    is_late BOOLEAN DEFAULT false,
    score NUMERIC,
    feedback TEXT,
    graded_at TIMESTAMPTZ,
    UNIQUE(assignment_id, student_id)
);

-- Attendance records
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL,
    marked_by UUID NOT NULL REFERENCES teachers(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(batch_id, student_id, date)
);

-- Notes
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    chapter_tag TEXT,
    file_url TEXT NOT NULL,
    file_type file_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doubts
CREATE TABLE doubts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    chapter_tag TEXT,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doubt replies
CREATE TABLE doubt_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doubt_id UUID NOT NULL REFERENCES doubts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Online classes
CREATE TABLE online_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    meeting_url TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recordings
CREATE TABLE recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    chapter_tag TEXT,
    video_url TEXT NOT NULL,
    recorded_on DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment logs
CREATE TABLE payment_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month TEXT NOT NULL, -- format 'YYYY-MM'
    is_paid BOOLEAN DEFAULT false,
    marked_by UUID NOT NULL REFERENCES teachers(id),
    marked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(batch_id, student_id, month)
);

-- Todo items
CREATE TABLE todo_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date DATE,
    priority priority_level DEFAULT 'medium',
    is_done BOOLEAN DEFAULT false,
    is_batch_wide BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_batches_teacher ON batches(teacher_id);
CREATE INDEX idx_batches_join_code ON batches(join_code);
CREATE INDEX idx_batch_enrollments_student ON batch_enrollments(student_id);
CREATE INDEX idx_batch_enrollments_batch ON batch_enrollments(batch_id);
CREATE INDEX idx_exams_batch ON exams(batch_id);
CREATE INDEX idx_exams_teacher ON exams(teacher_id);
CREATE INDEX idx_questions_exam ON questions(exam_id);
CREATE INDEX idx_questions_pyq ON questions(pyq_bank_id);
CREATE INDEX idx_exam_submissions_exam ON exam_submissions(exam_id);
CREATE INDEX idx_exam_submissions_student ON exam_submissions(student_id);
CREATE INDEX idx_assignments_batch ON assignments(batch_id);
CREATE INDEX idx_assignment_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_attendance_records_batch ON attendance_records(batch_id);
CREATE INDEX idx_attendance_records_student ON attendance_records(student_id);
CREATE INDEX idx_doubts_batch ON doubts(batch_id);
CREATE INDEX idx_doubt_replies_doubt ON doubt_replies(doubt_id);
CREATE INDEX idx_recordings_batch ON recordings(batch_id);
CREATE INDEX idx_payment_logs_batch ON payment_logs(batch_id);
CREATE INDEX idx_todo_items_created_by ON todo_items(created_by);
