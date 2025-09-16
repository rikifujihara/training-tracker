-- Rename column leadType to lead_type on leads table
ALTER TABLE "public"."leads"
RENAME COLUMN "leadType" TO "lead_type";
