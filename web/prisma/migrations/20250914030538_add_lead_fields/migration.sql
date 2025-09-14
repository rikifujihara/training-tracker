-- AlterTable
ALTER TABLE "public"."leads" ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "join_date" TIMESTAMP(3),
ADD COLUMN     "leadType" TEXT,
ADD COLUMN     "year_of_birth" INTEGER;
