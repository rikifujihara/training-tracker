/*
  Warnings:

  - The values [INITIAL_CALL,FOLLOW_UP_CALL,CONSULTATION_BOOKING] on the enum `task_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."task_type_new" AS ENUM ('CALL', 'SEND_TEXT', 'CONSULTATION', 'OTHER');
ALTER TABLE "public"."tasks" ALTER COLUMN "task_type" TYPE "public"."task_type_new" USING ("task_type"::text::"public"."task_type_new");
ALTER TYPE "public"."task_type" RENAME TO "task_type_old";
ALTER TYPE "public"."task_type_new" RENAME TO "task_type";
DROP TYPE "public"."task_type_old";
COMMIT;
