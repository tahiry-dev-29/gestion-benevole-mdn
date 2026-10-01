CREATE TABLE "Seat" (
  "id" SERIAL NOT NULL,
  "tableNumber" INTEGER NOT NULL,
  "seatNumber" INTEGER NOT NULL,
  "label" TEXT,
  CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Attendance" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER NOT NULL,
  "date" DATE NOT NULL,
  "seat_id" INTEGER,
  "heure_arrivee" TEXT,
  "heure_depart" TEXT,
  "statut" TEXT NOT NULL DEFAULT 'PRESENT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Attendance" ("id", "user_id", "date", "heure_arrivee", "heure_depart", "statut", "createdAt", "updatedAt")
SELECT "id", "user_id", "date", "heure_arrivee", "heure_depart", "statut", "createdAt", "updatedAt"
FROM "Presence";

SELECT setval(pg_get_serial_sequence('"Attendance"', 'id'), GREATEST(COALESCE(MAX("id"), 1), 1)) FROM "Attendance";

CREATE UNIQUE INDEX "Seat_tableNumber_seatNumber_key" ON "Seat"("tableNumber", "seatNumber");
CREATE INDEX "Seat_tableNumber_idx" ON "Seat"("tableNumber");
CREATE UNIQUE INDEX "Attendance_user_id_date_key" ON "Attendance"("user_id", "date");
CREATE UNIQUE INDEX "Attendance_seat_id_date_key" ON "Attendance"("seat_id", "date");
CREATE INDEX "Attendance_date_idx" ON "Attendance"("date");

ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_seat_id_fkey"
  FOREIGN KEY ("seat_id") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

DROP TABLE "Presence";
