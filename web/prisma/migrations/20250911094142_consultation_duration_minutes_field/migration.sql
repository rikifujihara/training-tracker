/*
  Warnings:

  - Added the required column `duration_minutes` to the `consultations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."consultations" ADD COLUMN     "duration_minutes" INTEGER NOT NULL;
