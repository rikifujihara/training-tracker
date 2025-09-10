-- CreateEnum
CREATE TYPE "public"."task_type" AS ENUM ('INITIAL_CALL', 'FOLLOW_UP_CALL', 'SEND_TEXT', 'CONSULTATION_BOOKING', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."task_status" AS ENUM ('PENDING', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."tasks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMP(3) NOT NULL,
    "task_type" "public"."task_type" NOT NULL,
    "status" "public"."task_status" NOT NULL DEFAULT 'PENDING',
    "message_template_id" TEXT,
    "completed_at" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tasks_due_date_idx" ON "public"."tasks"("due_date");

-- CreateIndex
CREATE INDEX "tasks_lead_id_idx" ON "public"."tasks"("lead_id");

-- CreateIndex
CREATE INDEX "tasks_user_id_idx" ON "public"."tasks"("user_id");

-- CreateIndex
CREATE INDEX "tasks_status_idx" ON "public"."tasks"("status");

-- CreateIndex
CREATE INDEX "tasks_task_type_idx" ON "public"."tasks"("task_type");

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_message_template_id_fkey" FOREIGN KEY ("message_template_id") REFERENCES "public"."message_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
