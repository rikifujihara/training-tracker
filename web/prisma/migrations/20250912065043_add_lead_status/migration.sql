-- CreateEnum
CREATE TYPE "public"."LeadStatus" AS ENUM ('PROSPECT', 'NOT_INTERESTED', 'CONVERTED');

-- AlterTable
ALTER TABLE "public"."leads" ADD COLUMN     "status" "public"."LeadStatus" NOT NULL DEFAULT 'PROSPECT';
