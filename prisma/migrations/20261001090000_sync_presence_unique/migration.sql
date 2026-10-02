-- AddUnique: Attendance (user_id, date) — table was renamed Presence → Attendance.
-- Index already created by 20261001090000_attendance_and_seats; keep idempotent for fresh databases.
CREATE UNIQUE INDEX IF NOT EXISTS "Attendance_user_id_date_key" ON "Attendance"("user_id", "date");
