-- CreateEnum
CREATE TYPE "public"."contact_type" AS ENUM ('PHONE', 'TEXT');

-- CreateEnum
CREATE TYPE "public"."contact_point_outcome" AS ENUM ('NO_ANSWER', 'NOT_INTERESTED', 'REQUESTED_CALLBACK', 'INTERESTED', 'SCHEDULED_APPOINTMENT', 'LEFT_VOICEMAIL', 'BUSY');

-- CreateTable
CREATE TABLE "public"."contact_points" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "contact_type" "public"."contact_type" NOT NULL,
    "outcome" "public"."contact_point_outcome",
    "notes" TEXT,
    "contact_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contact_points_lead_id_idx" ON "public"."contact_points"("lead_id");

-- CreateIndex
CREATE INDEX "contact_points_user_id_idx" ON "public"."contact_points"("user_id");

-- CreateIndex
CREATE INDEX "contact_points_contact_date_idx" ON "public"."contact_points"("contact_date");

-- AddForeignKey
ALTER TABLE "public"."contact_points" ADD CONSTRAINT "contact_points_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contact_points" ADD CONSTRAINT "contact_points_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
