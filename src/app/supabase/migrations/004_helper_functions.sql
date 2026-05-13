-- EduTrack Helper Functions

-- Function to generate unique join code
CREATE OR REPLACE FUNCTION generate_join_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Exclude confusing characters
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate rank after exam
CREATE OR REPLACE FUNCTION calculate_exam_ranks(exam_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE exam_submissions
    SET rank_in_batch = ranked.rank
    FROM (
        SELECT 
            id,
            RANK() OVER (ORDER BY total_score DESC NULLS LAST) as rank
        FROM exam_submissions
        WHERE exam_id = exam_uuid
        AND submitted_at IS NOT NULL
    ) as ranked
    WHERE exam_submissions.id = ranked.id
    AND exam_submissions.exam_id = exam_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate attendance percentage
CREATE OR REPLACE FUNCTION get_attendance_percentage(student_uuid UUID, batch_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
    total_days INTEGER;
    present_days INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_days
    FROM attendance_records
    WHERE student_id = student_uuid
    AND batch_id = batch_uuid;

    IF total_days = 0 THEN
        RETURN 0;
    END IF;

    SELECT COUNT(*) INTO present_days
    FROM attendance_records
    WHERE student_id = student_uuid
    AND batch_id = batch_uuid
    AND status = 'present';

    RETURN ROUND((present_days::NUMERIC / total_days::NUMERIC) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to check if student has active enrollment
CREATE OR REPLACE FUNCTION is_student_enrolled(student_uuid UUID, batch_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM batch_enrollments
        WHERE student_id = student_uuid
        AND batch_id = batch_uuid
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql;

-- Function to check teacher batch limit (free plan)
CREATE OR REPLACE FUNCTION check_batch_limit(teacher_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    teacher_plan plan_type;
    batch_count INTEGER;
BEGIN
    SELECT plan INTO teacher_plan
    FROM teachers
    WHERE id = teacher_uuid;

    IF teacher_plan = 'pro' THEN
        RETURN true;
    END IF;

    SELECT COUNT(*) INTO batch_count
    FROM batches
    WHERE teacher_id = teacher_uuid
    AND is_active = true;

    RETURN batch_count < 1; -- Free plan: 1 batch maximum
END;
$$ LANGUAGE plpgsql;

-- Function to check student limit per batch (free plan)
CREATE OR REPLACE FUNCTION check_student_limit(batch_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    teacher_uuid UUID;
    teacher_plan plan_type;
    student_count INTEGER;
BEGIN
    SELECT teacher_id INTO teacher_uuid
    FROM batches
    WHERE id = batch_uuid;

    SELECT plan INTO teacher_plan
    FROM teachers
    WHERE id = teacher_uuid;

    IF teacher_plan = 'pro' THEN
        RETURN true;
    END IF;

    SELECT COUNT(*) INTO student_count
    FROM batch_enrollments
    WHERE batch_id = batch_uuid
    AND is_active = true;

    RETURN student_count < 40; -- Free plan: 40 students maximum
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate exam scores
CREATE OR REPLACE FUNCTION calculate_exam_score()
RETURNS TRIGGER AS $$
DECLARE
    calculated_score NUMERIC := 0;
    question_rec RECORD;
    negative_penalty NUMERIC;
BEGIN
    -- Get exam details
    SELECT negative_marking, negative_marks_per_wrong
    INTO negative_penalty
    FROM exams
    WHERE id = NEW.exam_id;

    -- Calculate total score from answers
    FOR question_rec IN
        SELECT 
            sa.marks_awarded,
            sa.is_correct,
            q.marks
        FROM submission_answers sa
        JOIN questions q ON q.id = sa.question_id
        WHERE sa.submission_id = NEW.id
    LOOP
        IF question_rec.is_correct THEN
            calculated_score := calculated_score + question_rec.marks_awarded;
        ELSIF negative_penalty THEN
            calculated_score := calculated_score - negative_marks_per_wrong;
        END IF;
    END LOOP;

    NEW.total_score := GREATEST(0, calculated_score); -- Don't allow negative scores
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_score_on_submission
    BEFORE UPDATE OF submitted_at ON exam_submissions
    FOR EACH ROW
    WHEN (NEW.submitted_at IS NOT NULL AND OLD.submitted_at IS NULL)
    EXECUTE FUNCTION calculate_exam_score();

-- Trigger to auto-calculate ranks after submission
CREATE OR REPLACE FUNCTION trigger_rank_calculation()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM calculate_exam_ranks(NEW.exam_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_ranks_after_submission
    AFTER UPDATE OF submitted_at ON exam_submissions
    FOR EACH ROW
    WHEN (NEW.submitted_at IS NOT NULL AND OLD.submitted_at IS NULL)
    EXECUTE FUNCTION trigger_rank_calculation();

-- Trigger to check assignment late submission
CREATE OR REPLACE FUNCTION check_late_submission()
RETURNS TRIGGER AS $$
DECLARE
    assignment_deadline TIMESTAMPTZ;
BEGIN
    SELECT deadline INTO assignment_deadline
    FROM assignments
    WHERE id = NEW.assignment_id;

    NEW.is_late := NEW.submitted_at > assignment_deadline;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_assignment_lateness
    BEFORE INSERT ON assignment_submissions
    FOR EACH ROW
    EXECUTE FUNCTION check_late_submission();
