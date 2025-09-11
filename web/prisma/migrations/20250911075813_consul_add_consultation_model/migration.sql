/*
  Warnings:

  - The values [CONSULTATION] on the enum `task_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."ConsultationStatus" AS ENUM ('SCHEDULED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."ConsultationOutcome" AS ENUM ('NOT_CONVERTED', 'CONVERTED');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."task_type_new" AS ENUM ('CALL', 'SEND_TEXT', 'OTHER');
ALTER TABLE "public"."tasks" ALTER COLUMN "task_type" TYPE "public"."task_type_new" USING ("task_type"::text::"public"."task_type_new");
ALTER TYPE "public"."task_type" RENAME TO "task_type_old";
ALTER TYPE "public"."task_type_new" RENAME TO "task_type";
DROP TYPE "public"."task_type_old";
COMMIT;

-- CreateTable
CREATE TABLE "public"."consultations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "scheduled_time" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "status" "public"."ConsultationStatus" NOT NULL DEFAULT 'SCHEDULED',
    "outcome" "public"."ConsultationOutcome",
    "message_template_id" TEXT,
    "reminder_time" TIMESTAMP(3),

    CONSTRAINT "consultations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "consultations_scheduled_time_idx" ON "public"."consultations"("scheduled_time");

-- CreateIndex
CREATE INDEX "consultations_lead_id_idx" ON "public"."consultations"("lead_id");

-- CreateIndex
CREATE INDEX "consultations_user_id_idx" ON "public"."consultations"("user_id");

-- AddForeignKey
ALTER TABLE "public"."consultations" ADD CONSTRAINT "consultations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."consultations" ADD CONSTRAINT "consultations_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."consultations" ADD CONSTRAINT "consultations_message_template_id_fkey" FOREIGN KEY ("message_template_id") REFERENCES "public"."message_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
