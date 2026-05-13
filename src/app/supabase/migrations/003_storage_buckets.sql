-- EduTrack Storage Buckets Configuration

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
    ('notes', 'notes', false),
    ('assignments', 'assignments', false),
    ('recordings', 'recordings', false),
    ('upi-qr', 'upi-qr', true),
    ('profile-photos', 'profile-photos', true);

-- Notes bucket policies
CREATE POLICY "Teachers can upload notes"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'notes'
        AND auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1 FROM teachers WHERE id = auth.uid()
        )
    );

CREATE POLICY "Teachers can update own notes"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'notes'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Teachers can delete own notes"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'notes'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Enrolled students can read notes"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'notes'
        AND auth.role() = 'authenticated'
    );

-- Assignments bucket policies
CREATE POLICY "Students can upload assignments"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'assignments'
        AND auth.role() = 'authenticated'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Students can update own assignment files"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'assignments'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Teachers can read assignment files in own batches"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'assignments'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Students can read own assignment files"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'assignments'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Recordings bucket policies
CREATE POLICY "Teachers can upload recordings"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'recordings'
        AND EXISTS (
            SELECT 1 FROM teachers WHERE id = auth.uid()
        )
    );

CREATE POLICY "Teachers can update own recordings"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'recordings'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Teachers can delete own recordings"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'recordings'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Enrolled students can view recordings"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'recordings'
        AND auth.role() = 'authenticated'
    );

-- UPI QR bucket policies (public read)
CREATE POLICY "Teachers can upload own UPI QR"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'upi-qr'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Teachers can update own UPI QR"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'upi-qr'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Teachers can delete own UPI QR"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'upi-qr'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view UPI QR codes"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'upi-qr');

-- Profile photos bucket policies (public read)
CREATE POLICY "Users can upload own profile photo"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'profile-photos'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own profile photo"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'profile-photos'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own profile photo"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'profile-photos'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view profile photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'profile-photos');
