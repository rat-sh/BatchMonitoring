-- EduTrack Row-Level Security Policies
-- Enable RLS on all tables

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE pyq_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE doubts ENABLE ROW LEVEL SECURITY;
ALTER TABLE doubt_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_items ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Teachers policies
CREATE POLICY "Teachers can view own data"
    ON teachers FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Teachers can update own data"
    ON teachers FOR UPDATE
    USING (auth.uid() = id);

-- Batches policies
CREATE POLICY "Teachers can view own batches"
    ON batches FOR SELECT
    USING (teacher_id = auth.uid());

CREATE POLICY "Students can view enrolled batches"
    ON batches FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM batch_enrollments
            WHERE batch_enrollments.batch_id = batches.id
            AND batch_enrollments.student_id = auth.uid()
            AND batch_enrollments.is_active = true
        )
    );

CREATE POLICY "Teachers can insert own batches"
    ON batches FOR INSERT
    WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update own batches"
    ON batches FOR UPDATE
    USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete own batches"
    ON batches FOR DELETE
    USING (teacher_id = auth.uid());

-- Batch enrollments policies
CREATE POLICY "Teachers can view enrollments in own batches"
    ON batch_enrollments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM batches
            WHERE batches.id = batch_enrollments.batch_id
            AND batches.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Students can view own enrollments"
    ON batch_enrollments FOR SELECT
    USING (student_id = auth.uid());

CREATE POLICY "Teachers can insert enrollments in own batches"
    ON batch_enrollments FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM batches
            WHERE batches.id = batch_enrollments.batch_id
            AND batches.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Students can enroll themselves with join code"
    ON batch_enrollments FOR INSERT
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers can update enrollments in own batches"
    ON batch_enrollments FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM batches
            WHERE batches.id = batch_enrollments.batch_id
            AND batches.teacher_id = auth.uid()
        )
    );

-- Parent links policies
CREATE POLICY "Parents can view own link requests"
    ON parent_links FOR SELECT
    USING (parent_id = auth.uid());

CREATE POLICY "Students can view link requests for themselves"
    ON parent_links FOR SELECT
    USING (student_id = auth.uid());

CREATE POLICY "Parents can create link requests"
    ON parent_links FOR INSERT
    WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Students can update link request status"
    ON parent_links FOR UPDATE
    USING (student_id = auth.uid());

-- Exams policies
CREATE POLICY "Teachers can view own exams"
    ON exams FOR SELECT
    USING (teacher_id = auth.uid());

CREATE POLICY "Students can view published exams in enrolled batches"
    ON exams FOR SELECT
    USING (
        is_published = true
        AND EXISTS (
            SELECT 1 FROM batch_enrollments
            WHERE batch_enrollments.batch_id = exams.batch_id
            AND batch_enrollments.student_id = auth.uid()
            AND batch_enrollments.is_active = true
        )
    );

CREATE POLICY "Teachers can insert own exams"
    ON exams FOR INSERT
    WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update own exams"
    ON exams FOR UPDATE
    USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete own exams"
    ON exams FOR DELETE
    USING (teacher_id = auth.uid());

-- PYQ Bank policies
CREATE POLICY "Teachers can view own PYQ bank"
    ON pyq_bank FOR SELECT
    USING (teacher_id = auth.uid());

CREATE POLICY "Students can view PYQ from enrolled batches"
    ON pyq_bank FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM batch_enrollments
            JOIN batches ON batches.id = batch_enrollments.batch_id
            WHERE batch_enrollments.student_id = auth.uid()
            AND batch_enrollments.is_active = true
            AND batches.teacher_id = pyq_bank.teacher_id
        )
    );

CREATE POLICY "Teachers can insert own PYQ"
    ON pyq_bank FOR INSERT
    WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update own PYQ"
    ON pyq_bank FOR UPDATE
    USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete own PYQ"
    ON pyq_bank FOR DELETE
    USING (teacher_id = auth.uid());

-- Questions policies
CREATE POLICY "Teachers can view questions in own exams"
    ON questions FOR SELECT
    USING (
        (exam_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM exams
            WHERE exams.id = questions.exam_id
            AND exams.teacher_id = auth.uid()
        ))
        OR
        (pyq_bank_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM pyq_bank
            WHERE pyq_bank.id = questions.pyq_bank_id
            AND pyq_bank.teacher_id = auth.uid()
        ))
    );

CREATE POLICY "Students can view questions in published exams"
    ON questions FOR SELECT
    USING (
        (exam_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM exams
            JOIN batch_enrollments ON batch_enrollments.batch_id = exams.batch_id
            WHERE exams.id = questions.exam_id
            AND exams.is_published = true
            AND batch_enrollments.student_id = auth.uid()
            AND batch_enrollments.is_active = true
        ))
        OR
        (pyq_bank_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM pyq_bank
            JOIN batches ON batches.teacher_id = pyq_bank.teacher_id
            JOIN batch_enrollments ON batch_enrollments.batch_id = batches.id
            WHERE pyq_bank.id = questions.pyq_bank_id
            AND batch_enrollments.student_id = auth.uid()
            AND batch_enrollments.is_active = true
        ))
    );

CREATE POLICY "Teachers can insert questions"
    ON questions FOR INSERT
    WITH CHECK (
        (exam_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM exams
            WHERE exams.id = questions.exam_id
            AND exams.teacher_id = auth.uid()
        ))
        OR
        (pyq_bank_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM pyq_bank
            WHERE pyq_bank.id = questions.pyq_bank_id
            AND pyq_bank.teacher_id = auth.uid()
        ))
    );

CREATE POLICY "Teachers can update own questions"
    ON questions FOR UPDATE
    USING (
        (exam_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM exams
            WHERE exams.id = questions.exam_id
            AND exams.teacher_id = auth.uid()
        ))
        OR
        (pyq_bank_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM pyq_bank
            WHERE pyq_bank.id = questions.pyq_bank_id
            AND pyq_bank.teacher_id = auth.uid()
        ))
    );

CREATE POLICY "Teachers can delete own questions"
    ON questions FOR DELETE
    USING (
        (exam_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM exams
            WHERE exams.id = questions.exam_id
            AND exams.teacher_id = auth.uid()
        ))
        OR
        (pyq_bank_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM pyq_bank
            WHERE pyq_bank.id = questions.pyq_bank_id
            AND pyq_bank.teacher_id = auth.uid()
        ))
    );

-- Exam submissions policies
CREATE POLICY "Teachers can view submissions in own exams"
    ON exam_submissions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM exams
            WHERE exams.id = exam_submissions.exam_id
            AND exams.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Students can view own submissions"
    ON exam_submissions FOR SELECT
    USING (student_id = auth.uid());

CREATE POLICY "Students can insert own submissions"
    ON exam_submissions FOR INSERT
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own submissions"
    ON exam_submissions FOR UPDATE
    USING (student_id = auth.uid());

-- Submission answers policies
CREATE POLICY "Teachers can view answers in own exams"
    ON submission_answers FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM exam_submissions
            JOIN exams ON exams.id = exam_submissions.exam_id
            WHERE exam_submissions.id = submission_answers.submission_id
            AND exams.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Students can view own answers"
    ON submission_answers FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM exam_submissions
            WHERE exam_submissions.id = submission_answers.submission_id
            AND exam_submissions.student_id = auth.uid()
        )
    );

CREATE POLICY "Students can insert own answers"
    ON submission_answers FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM exam_submissions
            WHERE exam_submissions.id = submission_answers.submission_id
            AND exam_submissions.student_id = auth.uid()
        )
    );

-- Assignments policies
CREATE POLICY "Teachers can view own assignments"
    ON assignments FOR SELECT
    USING (teacher_id = auth.uid());

CREATE POLICY "Students can view assignments in enrolled batches"
    ON assignments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM batch_enrollments
            WHERE batch_enrollments.batch_id = assignments.batch_id
            AND batch_enrollments.student_id = auth.uid()
            AND batch_enrollments.is_active = true
        )
    );

CREATE POLICY "Teachers can insert own assignments"
    ON assignments FOR INSERT
    WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update own assignments"
    ON assignments FOR UPDATE
    USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete own assignments"
    ON assignments FOR DELETE
    USING (teacher_id = auth.uid());

-- Assignment submissions policies
CREATE POLICY "Teachers can view submissions in own assignments"
    ON assignment_submissions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM assignments
            WHERE assignments.id = assignment_submissions.assignment_id
            AND assignments.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Students can view own submissions"
    ON assignment_submissions FOR SELECT
    USING (student_id = auth.uid());

CREATE POLICY "Students can insert own submissions"
    ON assignment_submissions FOR INSERT
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers can update submissions in own assignments"
    ON assignment_submissions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM assignments
            WHERE assignments.id = assignment_submissions.assignment_id
            AND assignments.teacher_id = auth.uid()
        )
    );

-- Attendance records policies
CREATE POLICY "Teachers can view attendance in own batches"
    ON attendance_records FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM batches
            WHERE batches.id = attendance_records.batch_id
            AND batches.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Students can view own attendance"
    ON attendance_records FOR SELECT
    USING (student_id = auth.uid());

CREATE POLICY "Teachers can insert attendance in own batches"
    ON attendance_records FOR INSERT
    WITH CHECK (
        marked_by = auth.uid()
        AND EXISTS (
            SELECT 1 FROM batches
            WHERE batches.id = attendance_records.batch_id
            AND batches.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can update attendance in own batches"
    ON attendance_records FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM batches
            WHERE batches.id = attendance_records.batch_id
            AND batches.teacher_id = auth.uid()
        )
    );

-- Notes policies
CREATE POLICY "Teachers can view own notes"
    ON notes FOR SELECT
    USING (teacher_id = auth.uid());

CREATE POLICY "Students can view notes in enrolled batches"
    ON notes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM batch_enrollments
            WHERE batch_enrollments.batch_id = notes.batch_id
            AND batch_enrollments.student_id = auth.uid()
            AND batch_enrollments.is_active = true
        )
    );

CREATE POLICY "Teachers can insert own notes"
    ON notes FOR INSERT
    WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update own notes"
    ON notes FOR UPDATE
    USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete own notes"
    ON notes FOR DELETE
    USING (teacher_id = auth.uid());

-- Doubts policies
CREATE POLICY "Teachers can view doubts in own batches"
    ON doubts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM batches
            WHERE batches.id = doubts.batch_id
            AND batches.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Students can view doubts in enrolled batches"
    ON doubts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM batch_enrollments
            WHERE batch_enrollments.batch_id = doubts.batch_id
            AND batch_enrollments.student_id = auth.uid()
            AND batch_enrollments.is_active = true
        )
    );

CREATE POLICY "Students can insert doubts in enrolled batches"
    ON doubts FOR INSERT
    WITH CHECK (
        student_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM batch_enrollments
            WHERE batch_enrollments.batch_id = doubts.batch_id
            AND batch_enrollments.student_id = auth.uid()
            AND batch_enrollments.is_active = true
        )
    );

CREATE POLICY "Students can update own doubts"
    ON doubts FOR UPDATE
    USING (student_id = auth.uid());

CREATE POLICY "Teachers can update doubts in own batches"
    ON doubts FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM batches
            WHERE batches.id = doubts.batch_id
            AND batches.teacher_id = auth.uid()
        )
    );

-- Doubt replies policies
CREATE POLICY "Teachers can view replies in own batches"
    ON doubt_replies FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM doubts
            JOIN batches ON batches.id = doubts.batch_id
            WHERE doubts.id = doubt_replies.doubt_id
            AND batches.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Students can view replies in enrolled batches"
    ON doubt_replies FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM doubts
            JOIN batch_enrollments ON batch_enrollments.batch_id = doubts.batch_id
            WHERE doubts.id = doubt_replies.doubt_id
            AND batch_enrollments.student_id = auth.uid()
            AND batch_enrollments.is_active = true
        )
    );

CREATE POLICY "Teachers and students can insert replies"
    ON doubt_replies FOR INSERT
    WITH CHECK (
        author_id = auth.uid()
        AND (
            EXISTS (
                SELECT 1 FROM doubts
                JOIN batches ON batches.id = doubts.batch_id
                WHERE doubts.id = doubt_replies.doubt_id
                AND batches.teacher_id = auth.uid()
            )
            OR
            EXISTS (
                SELECT 1 FROM doubts
                JOIN batch_enrollments ON batch_enrollments.batch_id = doubts.batch_id
                WHERE doubts.id = doubt_replies.doubt_id
                AND batch_enrollments.student_id = auth.uid()
                AND batch_enrollments.is_active = true
            )
        )
    );

-- Online classes policies
CREATE POLICY "Teachers can view own online classes"
    ON online_classes FOR SELECT
    USING (teacher_id = auth.uid());

CREATE POLICY "Students can view classes in enrolled batches"
    ON online_classes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM batch_enrollments
            WHERE batch_enrollments.batch_id = online_classes.batch_id
            AND batch_enrollments.student_id = auth.uid()
            AND batch_enrollments.is_active = true
        )
    );

CREATE POLICY "Teachers can insert own classes"
    ON online_classes FOR INSERT
    WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update own classes"
    ON online_classes FOR UPDATE
    USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete own classes"
    ON online_classes FOR DELETE
    USING (teacher_id = auth.uid());

-- Recordings policies
CREATE POLICY "Teachers can view own recordings"
    ON recordings FOR SELECT
    USING (teacher_id = auth.uid());

CREATE POLICY "Students can view recordings in enrolled batches"
    ON recordings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM batch_enrollments
            WHERE batch_enrollments.batch_id = recordings.batch_id
            AND batch_enrollments.student_id = auth.uid()
            AND batch_enrollments.is_active = true
        )
    );

CREATE POLICY "Teachers can insert own recordings"
    ON recordings FOR INSERT
    WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update own recordings"
    ON recordings FOR UPDATE
    USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete own recordings"
    ON recordings FOR DELETE
    USING (teacher_id = auth.uid());

-- Payment logs policies
CREATE POLICY "Teachers can view payments in own batches"
    ON payment_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM batches
            WHERE batches.id = payment_logs.batch_id
            AND batches.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Students can view own payments"
    ON payment_logs FOR SELECT
    USING (student_id = auth.uid());

CREATE POLICY "Teachers can insert payments in own batches"
    ON payment_logs FOR INSERT
    WITH CHECK (
        marked_by = auth.uid()
        AND EXISTS (
            SELECT 1 FROM batches
            WHERE batches.id = payment_logs.batch_id
            AND batches.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can update payments in own batches"
    ON payment_logs FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM batches
            WHERE batches.id = payment_logs.batch_id
            AND batches.teacher_id = auth.uid()
        )
    );

-- Todo items policies
CREATE POLICY "Users can view own todos"
    ON todo_items FOR SELECT
    USING (created_by = auth.uid());

CREATE POLICY "Students can view batch-wide todos"
    ON todo_items FOR SELECT
    USING (
        is_batch_wide = true
        AND batch_id IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM batch_enrollments
            WHERE batch_enrollments.batch_id = todo_items.batch_id
            AND batch_enrollments.student_id = auth.uid()
            AND batch_enrollments.is_active = true
        )
    );

CREATE POLICY "Users can insert own todos"
    ON todo_items FOR INSERT
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own todos"
    ON todo_items FOR UPDATE
    USING (created_by = auth.uid());

CREATE POLICY "Users can delete own todos"
    ON todo_items FOR DELETE
    USING (created_by = auth.uid());
