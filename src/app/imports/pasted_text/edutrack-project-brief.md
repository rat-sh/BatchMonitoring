# EduTrack — India Exam Preparation Platform
# Prompt Version: 3.0 | Target Market: India (Tier 1, 2, 3 cities)
# Based on: Existing Figma UI with demo data → convert to production

---

## 1. Project Context

You are converting an existing Figma-designed education app (with demo/mock data) into a fully functional production application. The UI and UX design already exists. Your job is to wire up real functionality, database, authentication, and business logic behind the existing design.

Target users:
- Independent tuition teachers in India running 1–5 batches of 10–100 students
- Small coaching institutes (JEE, NEET, CBSE, ICSE, State boards)
- School teachers managing their own class sections
- Students aged 13–24 preparing for board exams and competitive exams
- Parents who want read-only visibility into their child's performance

India-specific context that affects every design decision:
- 85%+ of students access on Android phones (budget phones, small screens)
- Patchy internet in Tier 2/3 cities — app must handle slow/dropped connections
- WhatsApp is the primary communication channel — every shareable item needs a WhatsApp share button
- Fees are collected via UPI or cash — no payment gateway needed
- Competitive exam culture: students expect rank lists, percentile, chapter-wise weak topic analysis
- Previous Year Questions (PYQs) are considered the most valuable study resource
- Parents actively monitor performance — a parent view is expected
- Hindi and regional language support builds trust in non-metro markets

Tech stack:
- Frontend: React 18 + TypeScript + Vite (PWA-enabled)
- Styling: Tailwind CSS
- Backend: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- PDF: react-pdf for report cards and exam papers
- Email/SMS: Supabase Edge Functions + Resend (email) + MSG91 (SMS OTP, optional)
- Deployment: Vercel (frontend) + Supabase (backend)
- i18n: react-i18next for Hindi/English toggle

---

## 2. What to KEEP from the Existing Figma Design

Keep all of the following features and their UI exactly as designed. Wire up real data behind them:

TEACHER SIDE (keep all UI, replace mock data with real):
- Calendar and scheduling (class schedule, exam dates, assignment deadlines)
- Student management with batch system and join codes
- Question creator: MCQ, True/False, Numerical, Theoretical (all 4 types)
- Assignment creation, submission tracking, grading and feedback
- Doubt forum: student posts, teacher replies, resolve toggle
- Lecture recordings: upload or link, title + chapter tag + date
- Results viewer: per-exam score table, class average, chapter breakdown
- Notes manager: PDF/image upload, chapter-tagged, batch-scoped
- To-Do list: keep as a simple manual task list only (remove any AI recommendation logic)

STUDENT SIDE (keep all UI, replace mock data with real):
- Exam taking interface: timer, question navigation, MCQ/T-F/Numerical/Theoretical
- Assignment submission view with deadline countdown and feedback display
- Notes viewer with chapter filter
- Recordings viewer
- Attendance calendar view with percentage
- Doubt forum: post doubt, see teacher reply, read classmate doubts

---

## 3. What to REMOVE from the Existing Design

Remove these completely — do not build them, do not show them in the UI:

- Interview preparation section (company packs: Infosys, TCS, Amazon, etc.)
- Interview practice for students (mock interview, audio/video recording)
- AI-powered To-Do recommendations (keep the To-Do list but remove AI logic)
- Student-facing payment view (payment is teacher-only)
- Multi-teacher switching for students
- PIN-based login (use email + password only)
- Discord-style real-time chat
- Zoom/Meet/Skype SDK embedding (replace with a plain URL input field)
- Auto chapter tagging on recordings (manual title + chapter tag is enough)
- Gamification: badges, XP, leaderboards

---

## 4. What to MODIFY in the Existing Design

### Payment Dashboard (Teacher)
- Remove: payment gateway, UPI API integration, online payment processing
- Add: manual paid/unpaid toggle per student per month
- Add: teacher can upload their UPI QR code image once in settings
- Add: a "Share payment details" button that opens WhatsApp with a pre-filled message containing the teacher's UPI ID and amount due
- Keep: the existing payment dashboard UI layout

### To-Do List (both sides)
- Remove: AI recommendation engine, smart suggestions
- Keep: manual task creation with title, due date, priority
- Add: tasks linked to batch (teacher creates batch-wide reminders students see too)

### Online Class Link (Teacher)
- Remove: Zoom/Meet/Skype tab switcher
- Replace with: a single text field for any meeting URL
- Add: WhatsApp share button next to each class link
- Add: "Starting in X minutes" badge when class is within 60 minutes

### Lecture Recordings (Teacher)
- Remove: auto-numbering, AI chapter tagging
- Keep: manual title, chapter tag dropdown, date picker
- Add: WhatsApp share button for each recording link

### Results Viewer (Teacher)
- Keep: existing score table
- Add: rank column (1st, 2nd, 3rd... in batch) with medal icon for top 3
- Add: chapter-wise weak area highlight (chapters where class average < 50% shown in red)
- Add: one-click PDF report card generation per student

---

## 5. New Features to ADD (India Market)

### 5.1 Previous Year Questions (PYQ) Bank
This is the most-requested feature in Indian exam prep. Treat it as a priority.

Teacher side:
- Upload PYQs as a question set: select exam board (CBSE/ICSE/JEE/NEET/State Board), year (2015–2024), subject, chapter
- Add individual PYQ questions using the same question creator (MCQ, Numerical, Theoretical)
- Mark each question with difficulty: Easy / Medium / Hard
- Assign a PYQ set to a batch as a practice test (not a graded exam — no negative marking, instant answers shown)
- Teacher can build custom sets by picking questions from the PYQ bank

Student side:
- Browse PYQ bank by: board > subject > chapter > year
- Practice mode: attempt questions, see correct answer immediately after each question
- Filter by difficulty: Easy / Medium / Hard
- See which PYQs they have already attempted and their score on each

### 5.2 Rank List After Exam
After every exam, auto-generate a rank list:
- Show student name, score, percentage, and rank (1 to N)
- Top 3 get a gold/silver/bronze indicator
- Teacher sees full list
- Student sees their own rank and the class average — they do NOT see other students' exact scores (privacy)
- WhatsApp share button for teacher: sends batch rank list as a formatted text message

### 5.3 Parent View (Separate Login)
Add a third role: Parent.

Sign up:
- Parent creates account with email + password
- During sign up, enters their child's registered email to link accounts
- Child receives an in-app notification to approve the parent link
- Once approved, parent can view child's data

Parent dashboard (read-only, no actions):
- Attendance: calendar view + percentage
- Exam results: score, percentage, rank per exam (no question-level detail)
- Assignments: submitted or not, score if graded
- Upcoming: next exam date, next class link, pending assignments

Parent does NOT see:
- Doubt forum
- Notes or recordings
- Payment information
- Other students' data

### 5.4 WhatsApp Integration (Share Buttons)
Add a WhatsApp share button to every shareable item. This is not an API integration — it uses the standard WhatsApp URL scheme: https://wa.me/?text=...

Add WhatsApp share to:
- Batch join code: "Join my batch on EduTrack! Code: XXXXXX — [app link]"
- Upcoming class link: "Class starting at 5PM today. Join here: [meeting URL]"
- Exam result (teacher shares rank list): "Batch results are out! Check your score: [app link]"
- Recording: "New lecture uploaded: [title] — [video URL]"
- Assignment reminder: "Assignment due tomorrow: [title]. Submit here: [app link]"

All WhatsApp messages must be pre-formatted in Hindi and English (teacher selects language in settings).

### 5.5 Board / Syllabus Tagging
- During batch creation, teacher selects: Board (CBSE / ICSE / NEET / JEE / State Board / Other)
- Subject list auto-populates standard subjects for that board
- Chapter list auto-populates standard chapters for that subject (teacher can edit/add custom)
- This tagging flows through to: question bank, PYQ bank, notes, recordings, exams

Pre-loaded chapter lists to include:
- CBSE Class 10: Physics, Chemistry, Biology, Maths, English, Social Science
- CBSE Class 12: Physics, Chemistry, Biology, Maths
- JEE: Physics, Chemistry, Maths (with standard JEE chapter breakdown)
- NEET: Physics, Chemistry, Biology (with standard NEET chapter breakdown)

### 5.6 Hindi / English Language Toggle
- Add a language toggle (EN | HI) in the top navigation bar
- All UI labels, button text, navigation items, empty states, and error messages must be translated
- Student-generated content (doubt text, assignment descriptions) stays in original language — do not translate user content
- Use react-i18next for implementation
- Provide complete translation strings for both languages in a /locales/en.json and /locales/hi.json file
- Default language: detected from browser, fallback to English

Hindi translations required for all navigation items, all button labels, all status badges (Present/Absent, Submitted/Pending, Paid/Unpaid), all empty state messages, all toast notifications.

### 5.7 Progressive Web App (PWA)
Configure the app as a PWA so students can install it on their Android home screen:
- Add manifest.json with app name, icons (512x512, 192x192), theme color
- Service worker: cache the app shell and last-viewed data for offline access
- When offline: show cached results, attendance, and notes (read-only)
- When offline and student tries to submit exam: show warning "No internet. Your answers are saved locally. Submit when you reconnect." — save to localStorage and auto-submit when connection restores
- Show an "Install App" banner on mobile after user's second visit

### 5.8 Mobile-First Layout Adjustments
The existing Figma design appears to be desktop-first. Apply these mobile adjustments:
- Navigation: bottom tab bar on screens < 768px (5 tabs: Home, Exams, Doubt, Notes, Profile)
- Teacher nav: bottom tab bar (Home, Batches, Exams, Results, More)
- Tables: replace with card list on mobile — each student = one card with swipe actions
- Exam taking: full-screen mode on mobile, question takes full viewport, navigation arrows at bottom
- Touch targets: minimum 48px height for all buttons and interactive rows
- Font size: minimum 14px body text on mobile (Indian students on budget phones have small screens at arm's length)
- Attendance marking on mobile: large toggle per student — easy to tap quickly for 50+ students

### 5.9 SMS OTP Login (Optional but Recommended)
Many Indian teachers and students remember phone numbers better than email:
- Add phone number + OTP as an alternative login method
- Use MSG91 API for OTP delivery (₹0.15 per SMS, most cost-effective for India)
- On sign-up: collect phone number (mandatory) + email (optional)
- Login options: email+password OR phone+OTP
- OTP: 6 digits, expires in 10 minutes, max 3 attempts

If MSG91 integration is complex, skip for MVP and add email login only. Mark this as Phase 2.

---

## 6. Database Schema

Create all tables before building any UI. Use UUID primary keys throughout.

### users
- id: uuid (FK → auth.users.id)
- full_name: text NOT NULL
- role: enum('teacher', 'student', 'parent') NOT NULL
- email: text
- phone: text
- preferred_language: enum('en', 'hi') default 'en'
- date_of_birth: date (required — for age gate, store full date but display year only)
- created_at: timestamptz default now()

### teachers
- id: uuid (FK → users.id)
- institution_name: text
- upi_id: text (for display only — never process payments)
- upi_qr_url: text (Supabase Storage URL of their QR code image)
- plan: enum('free', 'pro') default 'free'
- plan_expires_at: timestamptz

### batches
- id: uuid
- teacher_id: uuid FK → teachers.id
- name: text NOT NULL
- subject: text
- board: enum('cbse', 'icse', 'jee', 'neet', 'state', 'other')
- join_code: text UNIQUE (6 chars uppercase)
- is_active: boolean default true
- academic_year: text (e.g. '2024-25')
- created_at: timestamptz

### batch_enrollments
- id: uuid
- batch_id: uuid FK → batches.id
- student_id: uuid FK → users.id
- enrolled_at: timestamptz
- is_active: boolean default true

### parent_links
- id: uuid
- parent_id: uuid FK → users.id
- student_id: uuid FK → users.id
- status: enum('pending', 'approved', 'rejected')
- requested_at: timestamptz
- responded_at: timestamptz

### exams
- id: uuid
- batch_id: uuid FK → batches.id
- teacher_id: uuid FK → teachers.id
- title: text
- exam_type: enum('test', 'pyq_practice', 'mock')
- board_tag: enum('cbse','icse','jee','neet','state','other')
- subject: text
- duration_minutes: integer
- total_marks: numeric
- negative_marking: boolean default false
- negative_marks_per_wrong: numeric default 0
- is_published: boolean default false
- scheduled_at: timestamptz
- created_at: timestamptz

### questions
- id: uuid
- exam_id: uuid FK → exams.id (nullable if standalone PYQ)
- pyq_bank_id: uuid FK → pyq_bank.id (nullable)
- question_text: text
- question_type: enum('mcq','true_false','numerical','theoretical')
- options: jsonb
- correct_answer: text
- marks: numeric
- chapter_tag: text
- difficulty: enum('easy','medium','hard')
- pyq_year: integer (null if not a PYQ)
- order_index: integer

### pyq_bank
- id: uuid
- teacher_id: uuid FK → teachers.id
- board: enum('cbse','icse','jee','neet','state','other')
- subject: text
- chapter: text
- year: integer
- created_at: timestamptz

### exam_submissions
- id: uuid
- exam_id: uuid FK → exams.id
- student_id: uuid FK → users.id
- started_at: timestamptz
- submitted_at: timestamptz
- server_end_time: timestamptz (set at start, enforced on submit)
- total_score: numeric
- rank_in_batch: integer (computed after all submissions)
- tab_switch_count: integer default 0

### submission_answers
- id: uuid
- submission_id: uuid FK → exam_submissions.id
- question_id: uuid FK → questions.id
- student_answer: text
- is_correct: boolean
- marks_awarded: numeric

### assignments
- id: uuid
- batch_id: uuid FK → batches.id
- teacher_id: uuid FK → teachers.id
- title: text
- description: text
- deadline: timestamptz
- max_marks: numeric

### assignment_submissions
- id: uuid
- assignment_id: uuid FK → assignments.id
- student_id: uuid FK → users.id
- file_url: text
- file_name: text
- submitted_at: timestamptz
- is_late: boolean
- score: numeric
- feedback: text
- graded_at: timestamptz

### attendance_records
- id: uuid
- batch_id: uuid FK → batches.id
- student_id: uuid FK → users.id
- date: date
- status: enum('present','absent')
- marked_by: uuid FK → teachers.id

### notes
- id: uuid
- batch_id: uuid FK → batches.id
- teacher_id: uuid FK → teachers.id
- title: text
- chapter_tag: text
- file_url: text
- file_type: enum('pdf','image','link')
- created_at: timestamptz

### doubts
- id: uuid
- batch_id: uuid FK → batches.id
- student_id: uuid FK → users.id
- title: text
- body: text
- chapter_tag: text
- is_resolved: boolean default false
- created_at: timestamptz

### doubt_replies
- id: uuid
- doubt_id: uuid FK → doubts.id
- author_id: uuid FK → users.id
- body: text
- created_at: timestamptz

### online_classes
- id: uuid
- batch_id: uuid FK → batches.id
- teacher_id: uuid FK → teachers.id
- title: text
- meeting_url: text
- scheduled_at: timestamptz
- duration_minutes: integer

### recordings
- id: uuid
- batch_id: uuid FK → batches.id
- teacher_id: uuid FK → teachers.id
- title: text
- chapter_tag: text
- video_url: text
- recorded_on: date

### payment_logs
- id: uuid
- batch_id: uuid FK → batches.id
- student_id: uuid FK → users.id
- month: text (format 'YYYY-MM')
- is_paid: boolean default false
- marked_by: uuid FK → teachers.id
- marked_at: timestamptz

### todo_items
- id: uuid
- created_by: uuid FK → users.id
- batch_id: uuid FK → batches.id (nullable — personal if null)
- title: text
- due_date: date
- priority: enum('high','medium','low')
- is_done: boolean default false
- is_batch_wide: boolean default false (teacher creates, students see)

---

## 7. Row-Level Security — Mandatory on Every Table

Enable RLS on all tables. Never use service_role key on the frontend.

Core rules:
- Teachers access only their own batches and all data within those batches
- Students access only data from their currently active enrolled batch
- Parents access only their linked child's data (after approval)
- No cross-teacher data visibility under any condition
- Students cannot see other students' exam answers, scores, or submission files

Key policies to write explicitly:
- batches: teacher SELECT/INSERT/UPDATE/DELETE where teacher_id = auth.uid()
- batch_enrollments: student SELECT where student_id = auth.uid() AND is_active = true
- exam_submissions: student INSERT own; student SELECT own only; teacher SELECT all in own batch
- submission_answers: student SELECT own only; teacher SELECT all in own batch exams
- attendance_records: teacher INSERT/UPDATE own batches; student SELECT own rows only
- parent_links: parent SELECT where parent_id = auth.uid(); student SELECT/UPDATE where student_id = auth.uid()
- pyq_bank: teacher full access own; student SELECT if enrolled in teacher's batch
- doubt_replies: both teacher and enrolled student can INSERT and SELECT within shared batch

---

## 8. Supabase Storage Buckets

Create these buckets with explicit policies:

1. "notes" — teacher writes, enrolled students read. Max 50MB per file. PDF and images only.
2. "assignments" — students write their own files, teacher reads all in their batch. Students cannot read each other's files. Max 20MB. PDF and JPEG only.
3. "recordings" — teacher writes, enrolled students read. Max 500MB. Video files.
4. "upi-qr" — teacher writes their own QR image. All authenticated users can read (for payment info display). Max 2MB. JPEG/PNG only.
5. "profile-photos" — users write their own. All authenticated read. Max 5MB.

Validate MIME type server-side in an Edge Function before saving to storage — do not trust the file extension alone.

---

## 9. Authentication

Three roles: teacher, student, parent.

Sign-up flow:
1. Collect: full name, phone number, email (optional for students), password, role, date of birth
2. Age gate: if date_of_birth < 13 years ago, block with message in Hindi and English: "This app is for users aged 13 and above." 
3. Send email OTP or SMS OTP for verification (use Supabase Auth email verification; SMS OTP via MSG91 if implemented)
4. After verification: create users row, create teachers row (if teacher role)
5. Route to dashboard based on role

Login options:
- Email + password
- Phone + OTP (6-digit, 10-minute expiry) — implement as Phase 2 if complex

Forgot password: standard email reset link via Supabase.

Session handling:
- Auto-refresh Supabase session
- On app load: check session → route to correct dashboard
- No sensitive data in localStorage except the Supabase session token (handled by Supabase client automatically)

---

## 10. Exam Integrity (Server-Side Enforcement)

The exam timer must be server-enforced, not client-side:

1. When student clicks "Start Exam": Edge Function records started_at = now() and server_end_time = now() + (duration_minutes * 60 seconds) in exam_submissions
2. Client displays countdown using: server_end_time (fetched from DB) - current_server_time (fetched every 60s via Edge Function)
3. When timer hits 0: client auto-submits. Edge Function on submit checks: IF submitted_at > server_end_time THEN mark as overtime, still accept but flag it
4. A student cannot create two submissions for the same exam — check before accepting
5. Tab switch detection: on document.visibilityState = 'hidden', increment tab_switch_count in DB via Edge Function. On 3rd switch: auto-submit exam

---

## 11. Rank Calculation

After each exam, when all submissions are in (or at exam close time):
- Run a Supabase Edge Function (or database trigger) to compute rank_in_batch for each submission
- Rank 1 = highest total_score. Ties get the same rank.
- Store rank in exam_submissions.rank_in_batch
- Teacher can manually trigger recalculation from the results view

Rank display rules:
- Teacher sees: full rank list with all scores
- Student sees: their own rank + class average score only — NOT other students' individual scores
- Parent sees: their child's rank + class average only

---

## 12. WhatsApp Share Implementation

Use the standard WhatsApp share URL — no API key needed:
https://wa.me/?text=ENCODED_MESSAGE

Implement a reusable ShareButton component that accepts:
- message: string (the pre-formatted text)
- language: 'en' | 'hi' (from user's language preference)

Pre-formatted messages (provide both English and Hindi versions):

Join code share (EN): "Join my EduTrack batch! 📚 Batch: {batch_name} | Code: {join_code} | Install: {app_url}"
Join code share (HI): "मेरे EduTrack बैच में शामिल हों! 📚 बैच: {batch_name} | कोड: {join_code} | ऐप: {app_url}"

Class link share (EN): "Online class starting soon! 📹 {class_title} at {time} | Join: {meeting_url}"
Class link share (HI): "ऑनलाइन क्लास शुरू होने वाली है! 📹 {class_title} {time} बजे | जॉइन करें: {meeting_url}"

Result share (EN): "{batch_name} exam results are out! 🏆 Check your score: {app_url}"
Result share (HI): "{batch_name} परीक्षा के नतीजे आ गए! 🏆 अपना स्कोर देखें: {app_url}"

---

## 13. Free vs Pro Plan

### Free plan (default):
- 1 batch maximum
- 40 students per batch
- 10 exams per month
- 2GB storage
- Basic results view
- PDF report card: watermarked with "EduTrack Free"

### Pro plan (₹299/month for individual teacher, ₹799/month for institute with up to 5 teachers):
- Unlimited batches and students
- Unlimited exams
- 20GB storage
- Clean PDF report cards (no watermark)
- CSV and PDF export of payment logs
- PYQ bank access (upload and assign)
- Parent view feature
- Priority doubt response badge

### Enforcement:
- Check limits in Supabase Edge Functions on batch/exam/enrollment creation
- When limit hit: show upgrade modal — do NOT show an error
- For MVP: no payment processing. Pro is unlocked by setting teachers.plan = 'pro' in DB manually
- Show "Upgrade to Pro" button in teacher settings → modal with pricing → WhatsApp message to support number

---

## 14. UX Requirements

### Loading states:
- Every list/table shows skeleton loaders matching content shape
- Tables: 5 skeleton rows while loading
- Never show blank white screen while data loads

### Empty states (in both Hindi and English):
- No students: "कोई छात्र नहीं। Join code शेयर करें →" / "No students yet. Share your join code →"
- No exams: "कोई परीक्षा नहीं। पहली परीक्षा बनाएं →" / "No exams yet. Create your first exam →"
- No doubts: "कोई प्रश्न नहीं। छात्र यहाँ सवाल पूछ सकते हैं।" / "No doubts posted yet."
- Provide empty state for every list view

### Error states:
- Network error: show retry button, not just error text
- Form errors: inline below each field
- File upload failure: show specific reason (too large, wrong type)

### Confirmation dialogs — required for:
- Remove student from batch
- Delete exam (show count of submissions)
- Delete note or recording
- Clear attendance for a date

### Pagination:
- All lists with >20 potential items: paginate at 20 per page
- Doubt forum: paginate at 10 per page

### Mobile-specific:
- Bottom navigation bar on screens <768px
- Exam interface: full screen, swipe between questions
- Attendance marking: large tap targets, mark all present button + exceptions
- All touch targets: minimum 48px height

---

## 15. Legal and Compliance (India + Global)

### India-specific:
- IT Act 2000 compliance: store user data in Supabase (which offers Mumbai region — use it)
- No sharing of student data with third parties
- DPDP Act 2023 (India's new data protection law): collect only what is listed in the schema, provide data deletion

### Global (for non-India users):
- GDPR: account deletion removes all user data; data export shows all their records
- COPPA: age gate blocks under-13 sign-up
- Cookie notice: only session cookies used — show simple notice, no complex consent banner needed

### Required pages (build these):
- /privacy — Privacy Policy (use a standard template, include data controller details)
- /terms — Terms of Service
- /contact — Contact page with support WhatsApp number and email
- Footer on all public pages with links to above

---

## 16. Build Order — Follow Exactly, Confirm Before Each Phase

Phase 1 — Database and auth foundation:
- All Supabase tables with exact schema above
- All RLS policies
- All storage buckets with policies
- Auth: sign-up (with age gate), email verification, login, forgot password
- Role detection and routing to correct dashboard shell
- i18n setup: react-i18next with en.json and hi.json, language toggle in nav

Phase 2 — Teacher core (wire mock data to real DB):
- Batch creation with board tagging and join code generation
- Student management: list, remove, view metrics
- Attendance: mark, view history, per-student percentage

Phase 3 — Exam system:
- Exam creator with all 4 question types
- Board/chapter tagging
- Difficulty tagging (Easy/Medium/Hard)
- Exam publishing
- Student exam-taking with server-side timer enforcement
- Tab switch detection and auto-submit
- Auto-grading for MCQ/T-F/Numerical
- Rank calculation after exam close
- Results view with rank list and chapter-wise breakdown

Phase 4 — PYQ Bank:
- Teacher PYQ upload interface (board > subject > chapter > year)
- PYQ practice mode for students
- PYQ difficulty filtering
- PYQ progress tracking per student

Phase 5 — Assignments, notes, doubts:
- Assignment creation and student submission
- Teacher grading flow with feedback
- Notes upload (PDF/image/link) with chapter tags
- Doubt forum: post, reply, resolve
- Online class link management with WhatsApp share

Phase 6 — Parent view:
- Parent sign-up and child-link request flow
- Student approval notification
- Parent dashboard: attendance, results, assignments (read-only)

Phase 7 — Reports and export:
- PDF exam paper export (with answer key)
- PDF student report card (score, rank, chapter breakdown, improvement vs last exam)
- Payment log with UPI QR display
- WhatsApp share buttons on all shareable items
- CSV export (Pro plan only)

Phase 8 — PWA and mobile polish:
- PWA manifest and service worker
- Offline mode: cache last data, queue exam submission
- Mobile layout fixes (bottom nav, full-screen exam, large tap targets)
- "Install App" banner

Phase 9 — Legal and launch:
- Privacy policy page
- Terms of service page
- Contact page
- Age gate enforcement audit
- RLS policy audit (verify no cross-teacher data leaks)
- Performance audit: paginate all lists, lazy load all routes
- Smoke test on a budget Android phone (Chrome, slow 3G throttle)